from io import BytesIO
from pathlib import Path
import json
import re

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse


ROOT = Path(__file__).resolve().parent
app = FastAPI(title="Smart Data Automation Dashboard", docs_url="/api/docs")
MAX_BYTES = 5 * 1024 * 1024


@app.get("/")
def index():
    return FileResponse(ROOT / "public" / "index.html")


@app.get("/{asset}")
def static_asset(asset: str):
    if asset not in {"styles.css", "dashboard.css", "motion.css", "motion.js", "app.js", "sample.csv", "bricolage-grotesque.ttf"}:
        raise HTTPException(404)
    file = ROOT / ("sample.csv" if asset == "sample.csv" else f"public/{asset}")
    return FileResponse(file)


def read_table(name: str, content: bytes) -> pd.DataFrame:
    suffix = Path(name).suffix.lower()
    try:
        if suffix == ".csv":
            frame = pd.read_csv(BytesIO(content), encoding="utf-8-sig")
        elif suffix == ".xlsx":
            frame = pd.read_excel(BytesIO(content), engine="openpyxl")
        else:
            raise HTTPException(400, "Upload a .csv or .xlsx file")
    except (UnicodeDecodeError, ValueError, ImportError, pd.errors.ParserError) as exc:
        raise HTTPException(400, f"Could not read this table: {exc}") from exc
    if frame.empty or not len(frame.columns):
        raise HTTPException(400, "The file has no data rows")
    if len(frame) > 20_000 or len(frame.columns) > 80:
        raise HTTPException(400, "Demo limit: 20,000 rows and 80 columns")
    names, seen = [], {}
    for i, column in enumerate(frame.columns):
        name = str(column).strip() or f"Column {i+1}"
        seen[name] = seen.get(name, 0) + 1
        names.append(name if seen[name] == 1 else f"{name} ({seen[name]})")
    frame.columns = names
    return frame


def clean_table(original: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    df = original.copy()
    rows_before = len(df)
    date_columns = []
    cleaned_dates = 0
    whitespace_trimmed = 0
    missing_filled = 0
    dates_unparsed = 0

    for column in df.columns:
        if pd.api.types.is_object_dtype(df[column]) or pd.api.types.is_string_dtype(df[column]):
            text_values = df[column].astype("string")
            whitespace_trimmed += int((text_values != text_values.str.strip()).fillna(False).sum())
            df[column] = df[column].astype("string").str.strip().replace("", pd.NA)

    initial = df.copy()

    df = df.drop_duplicates().reset_index(drop=True)
    duplicates_removed = rows_before - len(df)

    for column in df.columns:
        if re.search(r"(^|[_\s-])(date|created|start|end)([_\s-]|$)", column, re.I):
            values = pd.to_datetime(df[column], errors="coerce", format="mixed")
            nonmissing = int(df[column].notna().sum())
            if nonmissing and int(values.notna().sum()) / nonmissing >= .7:
                cleaned_dates += int(values.notna().sum())
                dates_unparsed += int((df[column].notna() & values.isna()).sum())
                df[column] = values.dt.strftime("%Y-%m-%d").fillna("")
                date_columns.append(column)
                continue
        if pd.api.types.is_numeric_dtype(df[column]):
            missing_filled += int(df[column].isna().sum())
            median = df[column].median()
            df[column] = df[column].fillna(float(median) if pd.notna(median) else 0)
        else:
            missing_filled += int(df[column].isna().sum())
            df[column] = df[column].fillna("Unknown")

    schema = []
    for column in df.columns:
        kind = "Date" if column in date_columns else "Number" if pd.api.types.is_numeric_dtype(df[column]) else "Text"
        schema.append({"name": column, "type": kind, "missing": int(initial[column].isna().sum()), "unique": int(df[column].nunique(dropna=True))})

    summary = {
        "rows_before": rows_before,
        "rows_after": len(df),
        "columns": len(df.columns),
        "duplicates_removed": duplicates_removed,
        "missing_filled": missing_filled,
        "whitespace_trimmed": whitespace_trimmed,
        "dates_standardized": cleaned_dates,
        "dates_unparsed": dates_unparsed,
        "date_columns": date_columns,
    }
    return df, {"summary": summary, "schema": schema}


def export_csv(frame: pd.DataFrame) -> str:
    safe = frame.copy()
    for column in safe.columns:
        if not pd.api.types.is_numeric_dtype(safe[column]):
            safe[column] = safe[column].map(lambda value: "'" + value if isinstance(value, str) and value.startswith(("=", "+", "-", "@")) else value)
    return safe.to_csv(index=False)


@app.post("/api/process")
async def process(file: UploadFile = File(...)):
    content = await file.read(MAX_BYTES + 1)
    if len(content) > MAX_BYTES:
        raise HTTPException(413, "Demo limit: files up to 5 MB")
    frame = read_table(file.filename or "", content)
    cleaned, report = clean_table(frame)
    original_preview = json.loads(frame.head(8).to_json(orient="records", date_format="iso"))
    preview = json.loads(cleaned.head(8).to_json(orient="records", date_format="iso"))
    return JSONResponse({
        "filename": file.filename,
        **report,
        "original_preview": original_preview,
        "preview": preview,
        "csv": export_csv(cleaned),
    })
