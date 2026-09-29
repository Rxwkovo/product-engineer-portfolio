const $ = id => document.getElementById(id);
const widget = $('widget');
const usageCard = $('usage-card');
const stateButtons = [...document.querySelectorAll('[data-state]')];
const states = {
  calm: { image: 'preview-mood-calm.png', five: 72, week: 48, message: 'A quick glance, then back to work.', status: 'Illustrative preview' },
  happy: { image: 'preview-mood-happy.png', five: 85, week: 80, message: 'Plenty of room to keep going.', status: 'Illustrative preview' },
  worried: { image: 'preview-mood-worried.png', five: 24, week: 18, message: 'The limits are getting closer.', status: 'Illustrative preview' },
  exhausted: { image: 'preview-mood-exhausted.png', five: 0, week: 0, message: 'Time for a pause and a reset.', status: 'Illustrative preview' },
  stale: { image: 'preview-mood-calm.png', five: null, week: null, message: 'Usage information needs a refresh.', status: 'Stale data · no live claim' }
};

function setExpanded(expanded) {
  if (!expanded && usageCard.contains(document.activeElement)) $('pet-toggle').focus();
  widget.classList.toggle('expanded', expanded);
  widget.classList.toggle('compact', !expanded);
  $('pet-toggle').setAttribute('aria-expanded', String(expanded));
  $('pet-toggle').setAttribute('aria-label', expanded ? 'Collapse Code Pet details' : 'Expand Code Pet details');
  $('view-toggle').textContent = expanded ? 'Compact view' : 'Expanded view';
  usageCard.setAttribute('aria-hidden', String(!expanded));
  usageCard.inert = !expanded;
}

function setState(name) {
  const state = states[name];
  if (!state) return;
  widget.classList.toggle('stale', name === 'stale');
  $('pet-image').src = `assets/${state.image}`;
  $('pet-image').alt = `Mint green Code Pet mascot, ${name} preview state`;
  $('pet-message').textContent = state.message;
  $('data-status').textContent = state.status;
  $('five-value').textContent = state.five === null ? 'Unavailable' : `${state.five}% left`;
  $('week-value').textContent = state.week === null ? 'Unavailable' : `${state.week}% left`;
  $('five-bar').style.width = `${state.five ?? 0}%`;
  $('week-bar').style.width = `${state.week ?? 0}%`;
  for (const button of stateButtons) {
    const selected = button.dataset.state === name;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  }
}

$('pet-toggle').addEventListener('click', () => setExpanded(widget.classList.contains('compact')));
$('hide-detail').addEventListener('click', () => setExpanded(false));
$('view-toggle').addEventListener('click', () => setExpanded(widget.classList.contains('compact')));
for (const button of stateButtons) button.addEventListener('click', () => setState(button.dataset.state));
$('motion-toggle').addEventListener('change', event => document.body.classList.toggle('reduce-motion', event.target.checked));

setExpanded(true);
setState('calm');
$('motion-toggle').checked = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.toggle('reduce-motion', $('motion-toggle').checked);
