const $ = id => document.getElementById(id);
let currentFile = null;
let cleanedCsv = '';

function select(file) {
  if (!file) return;
  currentFile = file;
  $('file-info').textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`;
  $('file-info').classList.remove('hidden');
  $('process').disabled = false;
}

$('dropzone').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', event => select(event.target.files[0]));
$('sample').addEventListener('click', async () => {
  const response = await fetch('/sample.csv');
  const text = await response.text();
  select(new File([text], 'sample.csv', { type: 'text/csv' }));
});
for (const event of ['dragenter', 'dragover']) $('dropzone').addEventListener(event, e => { e.preventDefault(); $('dropzone').classList.add('dragging'); });
for (const event of ['dragleave', 'drop']) $('dropzone').addEventListener(event, e => { e.preventDefault(); $('dropzone').classList.remove('dragging'); if (event === 'drop') select(e.dataTransfer.files[0]); });

$('process').addEventListener('click', async () => {
  if (!currentFile) return;
  const button = $('process'); button.disabled = true; button.textContent = 'Cleaning…';
  try {
    const form = new FormData(); form.append('file', currentFile);
    const response = await fetch('/api/process', { method: 'POST', body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Could not process this file');
    render(result);
  } catch (error) { alert(error.message); }
  finally { button.disabled = false; button.innerHTML = 'Clean & analyze <span>→</span>'; }
});

function render(result) {
  cleanedCsv = result.csv;
  $('empty').classList.add('hidden'); $('results').classList.remove('hidden');
  $('state-pill').textContent = 'Ready to export'; $('state-pill').classList.add('ready');
  for (const [id, key] of Object.entries({ rows: 'rows_after', dupes: 'duplicates_removed', missing: 'missing_filled', dates: 'dates_standardized' })) $(''+id).textContent = result.summary[key];
  $('column-count').textContent = `${result.summary.columns} columns`;
  $('schema').replaceChildren(...result.schema.map(field => {
    const row = document.createElement('div'); row.className = 'schema-row';
    const name = document.createElement('strong'); name.textContent = field.name;
    const kind = document.createElement('span'); kind.className = `type ${field.type.toLowerCase()}`; kind.textContent = field.type;
    const meta = document.createElement('small'); meta.textContent = `${field.unique} unique · ${field.missing} missing before`;
    row.append(name, kind, meta); return row;
  }));
  const table = $('preview'); table.replaceChildren();
  const head = document.createElement('thead'); const hr = document.createElement('tr');
  for (const col of result.schema) { const th = document.createElement('th'); th.textContent = col.name; hr.append(th); } head.append(hr); table.append(head);
  const body = document.createElement('tbody');
  for (const record of result.preview) { const tr = document.createElement('tr'); for (const col of result.schema) { const td = document.createElement('td'); td.textContent = record[col.name] ?? ''; tr.append(td); } body.append(tr); }
  table.append(body);
}

$('download').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([cleanedCsv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'cleaned-data.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
