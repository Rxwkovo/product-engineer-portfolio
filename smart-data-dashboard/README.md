# Smart Data Automation Dashboard

**Personal Project / Demo.** A focused CSV/Excel cleanup workflow built with Python, FastAPI, pandas, and a responsive web interface.

## Run

```bash
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python -m uvicorn app:app --host 127.0.0.1 --port 8789
```

On macOS/Linux use `.venv/bin/python` instead. Open `http://127.0.0.1:8789`. Select a file or choose the bundled fictional sample, then select **Clean & analyze**. The dashboard shows detected fields, before/after counts, a preview, and a downloadable CSV.

The demo accepts `.csv` (UTF-8) or `.xlsx`, up to 5 MB, 20,000 rows, and 80 columns. It strips surrounding whitespace, drops identical rows, fills missing numeric cells with a column median and text cells with `Unknown`, and converts recognizable date columns to `YYYY-MM-DD`. Unparseable date cells remain blank. Exported text beginning with spreadsheet formula characters is escaped. Files are processed in memory and are not stored by the server. Review cleaning decisions before using results.

The UI uses system fonts and CSS shapes. The sample dataset is fictional. MIT license; see `LICENSE`.
