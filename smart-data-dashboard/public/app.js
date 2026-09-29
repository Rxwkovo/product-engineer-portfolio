const $ = id => document.getElementById(id);
let currentFile = null;
let cleanedCsv = '';
const publicDemo = document.documentElement.dataset.mode === 'public-demo';
if (publicDemo) {
  $('dropzone').disabled = true;
  $('dropzone').innerHTML = '<strong>Public sample walkthrough</strong><small>Use the fictional sample below</small>';
  $('source-title').textContent = 'Explore a sample.';
  document.querySelector('.source-panel .panel-lede').textContent = 'This public walkthrough uses a result produced by the Python pipeline. File uploads are available in the local app.';
}

function showError(message) {
  $('error').textContent = message;
  $('error').classList.remove('hidden');
}

function select(file) {
  if (!file) return;
  const validExtension = /\.(csv|xlsx)$/i.test(file.name);
  if (!validExtension || file.size > 5 * 1024 * 1024) {
    showError('Choose a CSV or XLSX file no larger than 5 MB.');
    return;
  }
  $('error').classList.add('hidden');
  currentFile = file;
  cleanedCsv = '';
  $('results').classList.add('hidden');
  $('empty').classList.remove('hidden');
  $('state-pill').textContent = 'Awaiting file review';
  $('state-pill').classList.remove('ready');
  $('file-info').textContent = `${file.name} · ${(file.size / 1024).toFixed(1)} KB`;
  $('file-info').classList.remove('hidden');
  $('process').disabled = false;
}

if (!publicDemo) $('dropzone').addEventListener('click', () => $('file').click());
if (!publicDemo) $('file').addEventListener('change', event => select(event.target.files[0]));
$('sample').addEventListener('click', async () => {
  try {
    const response = await fetch('sample.csv');
    if (!response.ok) throw new Error('Could not load the sample file.');
    const content = await response.text();
    select(new File([content], 'sample.csv', { type: 'text/csv' }));
  } catch (error) { showError(error.message); }
});
if (!publicDemo) for (const event of ['dragenter', 'dragover']) $('dropzone').addEventListener(event, e => {
  e.preventDefault();
  $('dropzone').classList.add('dragging');
});
if (!publicDemo) for (const event of ['dragleave', 'drop']) $('dropzone').addEventListener(event, e => {
  e.preventDefault();
  $('dropzone').classList.remove('dragging');
  if (event === 'drop') select(e.dataTransfer.files[0]);
});

$('process').addEventListener('click', async () => {
  if (!currentFile) return;
  const button = $('process');
  button.disabled = true;
  button.textContent = 'Cleaning…';
  document.querySelector('.source-panel').classList.add('is-processing');
  document.querySelector('.report-panel').setAttribute('aria-busy', 'true');
  $('error').classList.add('hidden');
  try {
    const form = new FormData();
    form.append('file', currentFile);
    const response = publicDemo ? await fetch('sample-report.json') : await fetch('/api/process', { method: 'POST', body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Could not process this file.');
    render(result);
  } catch (error) { showError(error.message); }
  finally {
    document.querySelector('.source-panel').classList.remove('is-processing');
    document.querySelector('.report-panel').setAttribute('aria-busy', 'false');
    button.disabled = false;
    button.innerHTML = 'Clean & inspect <span aria-hidden="true">↗</span>';
  }
});

function renderTable(target, records, schema) {
  const table = $(target);
  table.replaceChildren();
  const head = document.createElement('thead');
  const heading = document.createElement('tr');
  for (const field of schema) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = field.name;
    heading.append(cell);
  }
  head.append(heading);
  table.append(head);
  const body = document.createElement('tbody');
  for (const record of records) {
    const row = document.createElement('tr');
    for (const field of schema) {
      const cell = document.createElement('td');
      cell.textContent = record[field.name] ?? '—';
      row.append(cell);
    }
    body.append(row);
  }
  table.append(body);
}

function render(result) {
  cleanedCsv = result.csv;
  $('empty').classList.add('hidden');
  $('results').classList.remove('hidden');
  $('state-pill').textContent = 'Ready for review';
  $('state-pill').classList.add('ready');
  $('source-count').textContent = `${result.summary.rows_before} rows → ${result.summary.rows_after} rows`;
  for (const [id, key] of Object.entries({
    rows: 'rows_after',
    dupes: 'duplicates_removed',
    missing: 'missing_filled',
    dates: 'dates_standardized'
  })) $(id).textContent = result.summary[key];
  $('column-count').textContent = `${result.summary.columns} columns`;

  const rules = [
    ['Identical rows removed', result.summary.duplicates_removed, 'remove'],
    ['Missing cells filled', result.summary.missing_filled, ''],
    ['Date values converted', result.summary.dates_standardized, ''],
    ['Text cells trimmed', result.summary.whitespace_trimmed, ''],
    ['Date values left blank', result.summary.dates_unparsed, 'remove']
  ];
  $('ledger').replaceChildren(...rules.map(([label, count, kind]) => {
    const row = document.createElement('div');
    row.className = `ledger-row ${kind}`;
    const title = document.createElement('span');
    title.textContent = label;
    const value = document.createElement('strong');
    value.textContent = count;
    row.append(title, value);
    return row;
  }));

  $('schema').replaceChildren(...result.schema.map(field => {
    const row = document.createElement('div');
    row.className = 'schema-row';
    const name = document.createElement('strong');
    name.textContent = field.name;
    const kind = document.createElement('span');
    kind.className = 'type';
    kind.textContent = field.type;
    const meta = document.createElement('small');
    meta.textContent = `${field.missing} missing before`;
    row.append(name, kind, meta);
    return row;
  }));
  document.querySelectorAll('.ledger-row').forEach((el,i)=>el.style.setProperty('--field-i',i));
  renderTable('original-preview', result.original_preview || [], result.schema);
  renderTable('preview', result.preview, result.schema);
}

$('download').addEventListener('click', () => {
  if (!cleanedCsv) return;
  const url = URL.createObjectURL(new Blob([cleanedCsv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cleaned-data.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
