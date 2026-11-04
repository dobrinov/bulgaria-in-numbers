import './styles.css';
import { state, update, onChange, syncFromHash } from './lib/state.js';
import { renderHeader } from './components/header.js';
import { renderSectionPage } from './components/sectionPage.js';
import { PAGES } from './pages/index.js';
import { findPage } from './pages/registry.js';

const app = document.getElementById('app');

function render({ routeChanged } = {}) {
  const page = PAGES[state.route] || PAGES.home;
  const body = page.render ? page.render(state) : renderSectionPage(page, state);
  const info = findPage(state.route);
  document.title = info ? `${info.label} — България в цифри` : 'България в цифри';
  const scroll = window.scrollY;
  app.innerHTML = `${renderHeader(state)}<main class="wrap main">${body}</main>${footer()}`;
  if (routeChanged) window.scrollTo(0, 0);
  else window.scrollTo(0, scroll);
}

function footer() {
  return `<footer class="site-footer"><div class="wrap footer-row">
    <span>България в цифри — независим граждански проект с отворени данни.</span>
    <span>Източници: НСИ, Евростат, МВР, НОИ, ВСС, Министерски съвет.</span>
  </div></footer>`;
}

// Всички действия минават през data-action.
const ACTIONS = {
  'toggle-nav': () => update({ navOpen: !state.navOpen }),
  year: (el) => update({ year: Number(el.dataset.year) }),
  metric: (el) => update({ metric: { ...state.metric, [state.route]: el.dataset.key } }),
  'map-metric': (el) => update({ mapMetric: { ...state.mapMetric, [state.route]: el.dataset.key } }),
  'pick-region': (el) => {
    const id = Number(el.dataset.id);
    update({ region: state.region === id ? null : id });
  },
  'select-region': (el) => update({ region: el.value === '' ? null : Number(el.value) }),
  'clear-region': () => update({ region: null }),
};

function handle(e, type) {
  const el = e.target.closest('[data-action]');
  if (!el || !app.contains(el)) return;
  const name = el.dataset.action;
  if (type === 'click' && el.tagName === 'SELECT') return;
  if (type === 'change' && el.tagName !== 'SELECT') return;
  const page = PAGES[state.route];
  const fn = ACTIONS[name] || (page && page.actions && page.actions[name]);
  if (fn) {
    e.preventDefault();
    fn(el, { state, update });
  }
}

app.addEventListener('click', (e) => handle(e, 'click'));
app.addEventListener('change', (e) => handle(e, 'change'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.navOpen) update({ navOpen: false });
});
// Затваря менюто при навигация.
app.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#/"]');
  if (a && state.navOpen) state.navOpen = false;
});

onChange(render);
window.addEventListener('hashchange', syncFromHash);
syncFromHash();

// Позволява тестове и отстраняване на грешки от конзолата.
window.__bgc = { state, update, findPage };
