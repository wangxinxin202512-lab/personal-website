const canvas = document.querySelector('.board-canvas');
const objects = new Map(
  [...document.querySelectorAll('[data-artifact]')].map((element) => [element.dataset.artifact, element])
);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const key = objects.get('key');
const file = objects.get('file');
const id = objects.get('id');
const backdrop = canvas.querySelector('.detail-backdrop');
const keyExit = canvas.querySelector('.detail-key-exit');
const pageExit = canvas.querySelector('.detail-page-exit');
const pageViews = [...canvas.querySelectorAll('[data-page-view]')];
const detailClasses = ['detail-key', 'detail-project', 'detail-experience'];
let activeTrigger = null;

backdrop.tabIndex = -1;
keyExit.tabIndex = -1;
pageExit.tabIndex = -1;

function hasDetail() {
  return detailClasses.some((name) => canvas.classList.contains(name));
}

function swing(element, entering = false) {
  if (!element || reducedMotion.matches || hasDetail()) return;
  element.classList.remove('entering', 'is-swinging');
  void element.offsetWidth;
  element.classList.add(entering ? 'entering' : 'is-swinging');
}

function setKeyTravel() {
  const scale = canvas.clientWidth / 1440;
  key.style.setProperty('--key-dx', `${(498 - 352) * scale}px`);
  key.style.setProperty('--key-dy', `${(260 - 67) * scale}px`);
}

function clearDetail(restoreFocus = true) {
  if (!hasDetail()) return;
  canvas.classList.remove(...detailClasses);
  backdrop.tabIndex = -1;
  keyExit.tabIndex = -1;
  pageExit.tabIndex = -1;
  [key, file, id].forEach((element) => element.setAttribute('aria-expanded', 'false'));
  pageViews.forEach((view) => view.setAttribute('aria-hidden', 'true'));
  const trigger = activeTrigger;
  activeTrigger = null;
  if (restoreFocus && trigger) trigger.focus({ preventScroll: true });
}

function openKey() {
  if (canvas.classList.contains('detail-key')) return;
  clearDetail(false);
  activeTrigger = key;
  setKeyTravel();
  key.classList.remove('entering', 'is-swinging');
  canvas.classList.add('detail-key');
  backdrop.tabIndex = 0;
  keyExit.tabIndex = 0;
  key.setAttribute('aria-expanded', 'true');
}

function openPage(kind, trigger) {
  const className = kind === 'project' ? 'detail-project' : 'detail-experience';
  if (canvas.classList.contains(className)) return;
  clearDetail(false);
  activeTrigger = trigger;
  canvas.classList.add(className);
  pageExit.tabIndex = 0;
  trigger.setAttribute('aria-expanded', 'true');
  pageViews.forEach((view) => view.setAttribute('aria-hidden', String(view.dataset.pageView !== kind)));
}

function closeDetails() {
  clearDetail();
}

for (const [name, element] of objects) {
  if (name !== 'contact') element.setAttribute('aria-expanded', 'false');
}
backdrop.addEventListener('click', closeDetails);
keyExit.addEventListener('click', closeDetails);
pageExit.addEventListener('click', closeDetails);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDetails();
});
window.addEventListener('resize', () => {
  setKeyTravel();
});

for (const [name, element] of objects) {
  element.addEventListener('pointerenter', () => swing(element));
  if (name !== 'contact') {
    element.addEventListener('click', () => {
      if (name === 'key') openKey();
      else if (name === 'file') openPage('project', element);
      else if (name === 'id') openPage('experience', element);
      else swing(element);
    });
  }
  element.querySelector('img').addEventListener('animationend', () => {
    element.classList.remove('entering', 'is-swinging');
  });
}

for (const legend of document.querySelectorAll('[data-target]')) {
  legend.addEventListener('click', () => {
    const target = legend.dataset.target;
    if (target === 'key') openKey();
    else if (target === 'file') openPage('project', legend);
    else if (target === 'id') openPage('experience', legend);
    else swing(objects.get(target));
  });
}

let entrancePlayed = false;
function playEntrance() {
  if (entrancePlayed || reducedMotion.matches) return;
  entrancePlayed = true;
  [...objects.values()].forEach((element, index) => {
    window.setTimeout(() => swing(element, true), index * 95);
  });
}

document.addEventListener('board:shown', playEntrance);
if (document.body.classList.contains('direct-board-page')) {
  window.addEventListener('load', () => window.setTimeout(playEntrance, 200), { once: true });
}
