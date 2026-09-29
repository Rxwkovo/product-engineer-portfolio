(() => {
  'use strict';
  const root = document.documentElement;
  const $ = selector => document.querySelector(selector);
  const clamp = value => Math.max(0, Math.min(1, value));
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const colorMedia = matchMedia('(prefers-color-scheme: dark)');
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };
  let reduceChoice = storage.get('northstar-motion') === 'reduce';
  let themeChoice = storage.get('northstar-theme');
  const theme = $('#theme'), motion = $('#motion');
  function setTheme() {
    const dark = themeChoice ? themeChoice === 'dark' : colorMedia.matches;
    root.dataset.theme = dark ? 'dark' : 'light';
    theme.textContent = dark ? 'Light' : 'Dark';
    theme.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  }
  setTheme();
  theme.addEventListener('click', () => {
    themeChoice = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storage.set('northstar-theme', themeChoice);
    setTheme();
  });
  colorMedia.addEventListener('change', setTheme);

  const menu = $('#menu'), links = $('#links');
  function closeMenu(returnFocus = false) {
    links.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links.classList.contains('open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('nav') && links.classList.contains('open')) closeMenu();
  });

  const story = $('#story'), route = $('#rt'), path = $('#prog'), marker = $('#mk');
  const chapters = [...document.querySelectorAll('.s')];
  const waypoints = [...document.querySelectorAll('.wp')];
  const length = path.getTotalLength();
  const fractions = [0, .5, .86];
  const end = path.getPointAtLength(length);
  $('#stars').setAttribute('transform', `translate(${end.x} ${end.y})`);
  waypoints.forEach((node, index) => {
    const position = path.getPointAtLength(length * fractions[index]);
    node.setAttribute('transform', `translate(${position.x} ${position.y})`);
  });
  path.style.strokeDasharray = length;
  let animated = false, progress = 0, target = 0, frameId = 0;
  function draw(value) {
    path.style.strokeDashoffset = length * (1 - value);
    const point = path.getPointAtLength(length * value);
    marker.setAttribute('cx', point.x);
    marker.setAttribute('cy', point.y);
    const current = value < .5 ? 0 : value < .86 ? 1 : 2;
    chapters.forEach((chapter, index) => {
      chapter.classList.toggle('on', index === current);
      chapter.classList.toggle('past', index < current);
      if (animated) chapter.setAttribute('aria-hidden', String(index !== current));
      else chapter.removeAttribute('aria-hidden');
    });
    waypoints.forEach((node, index) => node.classList.toggle('done', value >= fractions[index]));
    route.classList.toggle('arrived', value >= .995);
    $('#chapter-count').textContent = `0${current + 1} / 03`;
    $('#chapter-name').textContent = chapters[current].dataset.chapter;
  }
  function paint() {
    frameId = 0;
    const viewport = innerHeight;
    const navHeight = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 74;
    const bounds = story.getBoundingClientRect();
    target = animated ? clamp((navHeight - bounds.top) / Math.max(1, bounds.height - viewport + navHeight)) : 1;
    if (animated) {
      progress += (target - progress) * .12;
      if (Math.abs(target - progress) < .0008) progress = target;
    } else progress = 1;
    draw(progress);
    const trail = $('.trail'), trailBounds = trail.getBoundingClientRect();
    const fill = animated ? clamp((viewport * .73 - trailBounds.top) / trailBounds.height) : 1;
    trail.style.setProperty('--tp', fill);
    document.querySelectorAll('.trail li').forEach(item => {
      item.classList.toggle('on', !animated || item.getBoundingClientRect().top < viewport * .73);
    });
    $('nav').classList.toggle('scrolled', scrollY > 8);
    const arrival = $('.arrive').getBoundingClientRect();
    const arrivalProgress = clamp((viewport - arrival.top) / (viewport + arrival.height * .4));
    $('.arrive svg path').style.setProperty('--rot', animated ? `${arrivalProgress * 24 - 12}deg` : '0deg');
    $('.arrive svg path').style.setProperty('--sc', animated ? String(.93 + arrivalProgress * .12) : '1');
    if (animated && Math.abs(target - progress) > .0008) schedule();
  }
  function schedule() { if (!frameId) frameId = requestAnimationFrame(paint); }
  function applyMotion() {
    const reduced = media.matches || reduceChoice;
    animated = !reduced && innerHeight > 640;
    root.classList.toggle('motion-enabled', animated);
    root.classList.toggle('motion-reduced', !animated);
    motion.setAttribute('aria-pressed', String(reduced));
    motion.textContent = media.matches ? 'Reduced motion' : 'Reduce motion';
    motion.disabled = media.matches;
    motion.title = media.matches ? 'Reduced motion is enabled in your system preferences.' : '';
    if (!animated) progress = 1;
    schedule();
  }
  motion.addEventListener('click', () => {
    const oldTop = story.getBoundingClientRect().top;
    const inStory = oldTop < innerHeight && oldTop + story.offsetHeight > 0;
    reduceChoice = !reduceChoice;
    storage.set('northstar-motion', reduceChoice ? 'reduce' : 'animate');
    applyMotion();
    // Changing the story's length should keep its content within reach.
    if (inStory) story.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', () => { closeMenu(); applyMotion(); });
  media.addEventListener('change', applyMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frameId) { cancelAnimationFrame(frameId); frameId = 0; }
    if (!document.hidden) schedule();
  });
  applyMotion();

  const phases = [
    {
      name: 'Discover', title: 'Shape the opportunity.', status: 'Scope agreed',
      description: 'Collect the questions before choosing a direction. Make the shared understanding explicit.',
      tasks: [['Gather the team context', 'Product · Research complete', 'Done'], ['Map the open questions', 'Design · Workshop complete', 'Done'], ['Agree on the first release', 'Team · Scope recorded', 'Done']],
      decision: 'Start with one shared project view. Keep ownership and the next milestone visible.'
    },
    {
      name: 'Build', title: 'Make useful progress.', status: 'In progress',
      description: 'Turn decisions into small, owned steps. Keep the next move visible.',
      tasks: [['Align the launch scope', 'Product · Decision recorded', 'Done'], ['Review the working prototype', 'Design · Thursday', 'Now'], ['Prepare the release notes', 'Operations · Friday', 'Next']],
      decision: 'Ship the focused core first. Save additional views for a later iteration.'
    },
    {
      name: 'Launch', title: 'Share what is ready.', status: 'Ready to hand off',
      description: 'Close the loop with a clear record of the work, the decisions, and the next owner.',
      tasks: [['Complete the final review', 'Design · Review recorded', 'Done'], ['Publish the release notes', 'Operations · Notes ready', 'Done'], ['Share the handoff', 'Team · Next owner assigned', 'Now']],
      decision: 'Keep the decision history with the handoff so the next team has the full context.'
    }
  ];
  const tabs = [...document.querySelectorAll('[data-phase]')];
  let selected = 1;
  function selectPhase(index, focus = false) {
    const changed = index !== selected;
    selected = index;
    const phase = phases[index];
    tabs.forEach((tab, position) => {
      tab.setAttribute('aria-selected', String(position === index));
      tab.tabIndex = position === index ? 0 : -1;
    });
    if (focus) tabs[index].focus();
    const panel = $('#phase-panel');
    panel.setAttribute('aria-labelledby', tabs[index].id);
    $('#phase-kicker').textContent = `0${index + 1} / ${phase.name.toUpperCase()}`;
    $('#phase-title').textContent = phase.title;
    $('#phase-status').textContent = phase.status;
    $('#phase-description').textContent = phase.description;
    $('#decision').textContent = phase.decision;
    const list = $('#task-list');
    list.replaceChildren();
    phase.tasks.forEach(([title, owner, state]) => {
      const item = document.createElement('li');
      const check = document.createElement('span');
      check.className = 'task-check' + (state === 'Done' ? ' done' : state === 'Now' ? ' current' : '');
      check.textContent = state === 'Done' ? '✓' : '';
      check.setAttribute('aria-hidden', 'true');
      const copy = document.createElement('div');
      const strong = document.createElement('strong'); strong.textContent = title;
      const small = document.createElement('small'); small.textContent = owner;
      copy.append(strong, small);
      const status = document.createElement('span'); status.className = 'task-state'; status.textContent = state;
      item.append(check, copy, status); list.append(item);
    });
    panel.classList.remove('phase-enter');
    if (changed && animated) {
      void panel.offsetWidth;
      panel.classList.add('phase-enter');
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPhase(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectPhase(next, true); }
    });
  });
  selectPhase(1);
})();
