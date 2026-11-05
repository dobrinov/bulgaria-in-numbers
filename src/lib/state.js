// Състояние на приложението и адреси (#/страница?region=…&year=…).

const STORE_KEY = 'bgc-region';
const listeners = new Set();

function readStoredRegion() {
  try {
    const s = window.localStorage.getItem(STORE_KEY);
    return s === null || s === '' ? null : Number(s);
  } catch {
    return null;
  }
}

function storeRegion(v) {
  try {
    window.localStorage.setItem(STORE_KEY, v == null ? '' : String(v));
  } catch {
    /* хранилището може да е забранено — без запазване */
  }
}

const REAL_KEY = 'bgc-real';
function readStoredReal() {
  try {
    return window.localStorage.getItem(REAL_KEY) !== '0';
  } catch {
    return true;
  }
}

export const state = {
  route: 'home',
  year: null, // null = годината по подразбиране на страницата
  region: readStoredRegion(),
  metric: {}, // избран показател за графиката, по страница
  mapMetric: {}, // избран показател на картата, по страница
  real: readStoredReal(), // показва сумите и без инфлацията (в цени от последната година)
  ui: {}, // свободно място за състояние на отделни раздели
  navOpen: false,
};

export function parseHash(hash = window.location.hash) {
  const [path, query = ''] = hash.replace(/^#\/?/, '').split('?');
  const params = new URLSearchParams(query);
  const out = { route: path || 'home' };
  if (params.has('region')) {
    const r = params.get('region');
    out.region = r === '' ? null : Number(r);
  }
  if (params.has('year')) out.year = Number(params.get('year'));
  return out;
}

export function hashFor(route, { region = state.region, year = null } = {}) {
  const params = new URLSearchParams();
  if (region != null) params.set('region', String(region));
  if (year != null) params.set('year', String(year));
  const q = params.toString();
  return '#/' + (route === 'home' ? '' : route) + (q ? '?' + q : '');
}

/** Обновява състоянието, синхронизира адреса и уведомява за прерисуване. */
export function update(patch) {
  const routeChanged = patch.route && patch.route !== state.route;
  Object.assign(state, patch);
  if ('region' in patch) storeRegion(patch.region);
  if ('real' in patch) {
    try { window.localStorage.setItem(REAL_KEY, patch.real ? '1' : '0'); } catch { /* без запазване */ }
  }
  const target = hashFor(state.route, { region: state.region, year: state.year });
  if (window.location.hash !== target) window.history.replaceState(null, '', target);
  listeners.forEach((fn) => fn({ routeChanged }));
}

export function onChange(fn) {
  listeners.add(fn);
}

/** Чете адреса при зареждане или „назад/напред“. */
export function syncFromHash() {
  const h = parseHash();
  const patch = { route: h.route, navOpen: false };
  if ('region' in h) patch.region = h.region;
  patch.year = 'year' in h ? h.year : null;
  update(patch);
}
