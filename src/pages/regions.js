// Области — 28 области: карта, сравнение, класиране и връзки между показателите.
import './regions.css';
import { OBLASTS, LATEST } from '../data/oblasts.js';
import { renderRegionMap, renderRegionChip, MAP_METRICS } from '../components/regionMap.js';
import { pageHero, methodBlock, sourcesBlock } from '../components/sectionPage.js';
import { scatterChart } from '../lib/charts.js';
import { fmt, esc, EUR, correlation, strength } from '../lib/format.js';

const ID = 'regions';
const N = OBLASTS.length;
const NAT_POP = 6423207;
const SOFIA = 18;
const KEYS = ['gdp', 'wage', 'dpop', 'unemp', 'crimesK', 'clear', 'pop'];
const MAP_KEYS = ['gdp', 'dpop', 'wage', 'unemp', 'crimesK', 'clear', 'pop'];

// Стойности по области (последна година); престъпленията на 1000 души се изчисляват.
const V = {
  gdp: LATEST.gdp, dpop: LATEST.dpop, wage: LATEST.wage.map((v) => v / 12), unemp: LATEST.unemp,
  crimesK: MAP_METRICS.crimesK.values, clear: LATEST.clear, pop: LATEST.pop,
};
const FLAG = LATEST.unempFlag;

const MET = {
  gdp: { label: 'БВП на човек', title: 'БВП на човек по области, 2024 г.', sub: 'Евро на жител.', unit: ' €', d: 0, nat: 16300, src: 'Евростат, nama_10r_3gdp', good: 'up' },
  dpop: { label: 'Промяна на населението', title: 'Промяна на населението, 2015–2025', sub: 'Процент спрямо края на 2015 г.', unit: '%', d: 1, nat: -10.2, src: 'НСИ', good: 'up', signed: true },
  wage: { label: 'Средна заплата', title: 'Средна месечна заплата по области, 2024 г.', sub: 'Бруто, € на месец (годишната заплата, разделена на 12).', unit: ' €', d: 0, nat: 27898 / EUR / 12, src: 'НСИ', good: 'up' },
  unemp: { label: 'Безработица', title: 'Безработица по области, 2025 г.', sub: 'Коефициент на безработица, 15+ г.', unit: '%', d: 1, nat: 3.5, src: 'НСИ, Наблюдение на работната сила', good: 'down',
    note: '* Малка извадка — ненадеждна стойност според НСИ.' },
  crimesK: { label: 'Престъпления на 1000 души', title: 'Регистрирани престъпления на 1000 души, 2025 г.', sub: 'Криминални престъпления спрямо населението на областта.', unit: '', d: 1, nat: (70075 / NAT_POP) * 1000, src: 'МВР; НСИ (изчислено)', good: 'down' },
  clear: { label: 'Разкриваемост', title: 'Разкриваемост по области, 2025 г.', sub: 'Дял на престъпленията с установен извършител.', unit: '%', d: 1, nat: 54.18, src: 'МВР', good: 'up' },
  pop: { label: 'Население', title: 'Население по области, 31.12.2025', sub: 'Брой жители.', unit: '', d: 0, nat: NAT_POP / 28, src: 'НСИ', good: 'none', natLabel: 'средно ' },
};

const PAIRS = {
  gdpPop: { label: 'Богатство ↔ обезлюдяване', x: 'gdp', y: 'dpop', xl: 'БВП на човек, €', yl: 'Промяна на населението 2015–2025, %',
    text: 'По-богатите области губят по-малко население, а бедните области на северозапад и североизток са сред най-обезлюдените. Връзката се дължи до голяма степен на София: без нея r = 0,25.' },
  gdpWage: { label: 'БВП ↔ заплати', x: 'gdp', y: 'wage', xl: 'БВП на човек, €', yl: 'Средна месечна заплата, €',
    text: 'Където се произвежда повече, се плаща повече — но заплатите се различават много по-малко от БВП.' },
  wagePop: { label: 'Заплати ↔ обезлюдяване', x: 'wage', y: 'dpop', xl: 'Средна месечна заплата, €', yl: 'Промяна на населението 2015–2025, %',
    text: 'Областите с по-високи заплати губят по-малко население. Кърджали е изключение — с ниски заплати, но без загуба на население. Без София r = 0,35.' },
  unempPop: { label: 'Безработица ↔ обезлюдяване', x: 'unemp', y: 'dpop', xl: 'Безработица 2025, %', yl: 'Промяна на населението 2015–2025, %', skipFlag: true,
    text: 'Областите с по-висока безработица са загубили повече население.' },
  crime: { label: 'Престъпност ↔ разкриваемост', x: 'crimesK', y: 'clear', xl: 'Престъпления на 1000 души', yl: 'Разкриваемост, %',
    text: 'Там, където има повече престъпления на глава от населението — големите градове, — полицията разкрива по-малък дял от тях.' },
  gdpCrime: { label: 'Богатство ↔ престъпност', x: 'gdp', y: 'crimesK', xl: 'БВП на човек, €', yl: 'Престъпления на 1000 души',
    text: 'Почти няма връзка: богатството на областта не обяснява колко престъпления се регистрират на глава от населението. Варна и Бургас имат повече престъпления от много по-богатата Стара Загора.' },
};

const sg = (m, v, d = m.d) => (m.signed && v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), d);
const val = (k, v) => sg(MET[k], v) + MET[k].unit;
const star = (k, i) => (k === 'unemp' && FLAG[i] ? '*' : '');
const natV = (k) => (k === 'pop' ? NAT_POP : MET[k].nat);

function uiOf(state) {
  const ui = state.ui[ID] || {};
  return { cmp: ui.cmp || [], pair: PAIRS[ui.pair] ? ui.pair : 'gdpPop' };
}

function setUi(state, update, patch) {
  update({ ui: { ...state.ui, [ID]: { ...uiOf(state), ...patch } } });
}

function compareSection(state, ui) {
  const sel = state.region;
  const chosen = ui.cmp;
  const canAdd = sel != null && !chosen.includes(sel) && chosen.length < 3;
  const head = ['България', ...chosen.map((i) => OBLASTS[i].name)];
  const rows = KEYS.map((k) => {
    const vs = chosen.map((i) => V[k][i]);
    const best = vs.length > 1 && MET[k].good !== 'none' ? (MET[k].good === 'up' ? Math.max(...vs) : Math.min(...vs)) : null;
    return `<tr><th scope="row">${esc(MET[k].label)}</th>
      <td class="reg-nat">${esc(val(k, natV(k)))}</td>
      ${chosen.map((i) => `<td${V[k][i] === best ? ' class="best"' : ''}>${esc(val(k, V[k][i]) + star(k, i))}</td>`).join('')}</tr>`;
  }).join('');
  return `
  <section class="card" aria-labelledby="cmp-h">
    <div class="card-head"><div>
      <h2 id="cmp-h">Сравнение на области</h2>
      <p class="muted">Добавете до 3 области от картата. Без избрани области се показват стойностите за цялата страна.</p>
    </div></div>
    <div class="reg-chips">
      ${chosen.map((i) => `<span class="reg-chip">${esc(OBLASTS[i].name)}<button type="button" data-action="remove-compare" data-id="${i}" aria-label="${esc('Премахни ' + OBLASTS[i].name)}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>`).join('')}
      ${!chosen.length && sel == null ? '<span class="muted small">Изберете област от картата и натиснете „+ Добави за сравнение“.</span>' : ''}
    </div>
    <div class="table-scroll">
      <table class="data reg-cmp">
        <thead><tr><th scope="col">Показател</th>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="source">В синьо: най-добрата стойност сред избраните области. БВП и заплати — 2024 г.; население, безработица и престъпност — 2025 г.</p>
  </section>`;
}

function rankSection(mk) {
  const m = MET[mk];
  const ids = [...Array(N).keys()].sort((a, b) => V[mk][b] - V[mk][a]);
  const maxAbs = Math.max(...V[mk].map(Math.abs));
  const rows = ids.map((i, pos) => {
    const v = V[mk][i];
    const better = m.good === 'none' ? null : m.good === 'up' ? v >= m.nat : v <= m.nat;
    const color = better === null ? 'var(--ink)' : better ? 'var(--accent)' : 'var(--worse)';
    return `<li>
      <span class="num muted small">${pos + 1}</span>
      <span class="reg-name${i === SOFIA ? ' is-capital' : ''}">${esc(OBLASTS[i].name)}</span>
      <span class="bar" aria-hidden="true"><span style="width:${((Math.abs(v) / maxAbs) * 100).toFixed(1)}%;background:${color}"></span></span>
      <span class="num reg-val">${esc(val(mk, v) + star(mk, i))}</span>
    </li>`;
  }).join('');
  return `
  <section class="card" aria-labelledby="rank-h">
    <div class="card-head"><div>
      <h2 id="rank-h">${esc(m.title)}</h2>
      <p class="muted">${esc(m.sub)} Средно за страната: <strong class="num reg-natv">${esc((m.natLabel || '') + sg(m, m.nat) + m.unit)}</strong></p>
    </div></div>
    <div class="seg" role="group" aria-label="Показател">${MAP_KEYS.map((k) =>
      `<button type="button" data-action="map-metric" data-key="${k}" aria-pressed="${k === mk}">${esc(MET[k].label)}</button>`).join('')}</div>
    <ol class="reg-rank">${rows}</ol>
    <p class="source">${m.note ? esc(m.note) + ' ' : ''}Източник: ${esc(m.src)}.</p>
  </section>`;
}

function scatterSection(ui) {
  const pair = PAIRS[ui.pair];
  const ids = [...Array(N).keys()].filter((i) => !(pair.skipFlag && FLAG[i]));
  const xs = ids.map((i) => V[pair.x][i]);
  const ys = ids.map((i) => V[pair.y][i]);
  const fit = correlation(xs, ys);
  const dec = (key, arr) => {
    if (!['dpop', 'unemp', 'crimesK', 'clear'].includes(key)) return 0;
    const lo = Math.min(...arr), hi = Math.max(...arr);
    return (hi - lo) * 1.16 < 20 ? 1 : 0;
  };
  const chart = scatterChart({
    points: ids.map((i) => ({ x: V[pair.x][i], y: V[pair.y][i], label: OBLASTS[i].name, highlight: i === SOFIA })),
    xLabel: pair.xl, yLabel: pair.yl, xDec: dec(pair.x, xs), yDec: dec(pair.y, ys), fit,
  });
  return `
  <section class="card" aria-labelledby="sc-h">
    <div class="card-head"><div>
      <h2 id="sc-h">Връзки между областите</h2>
      <p class="muted">Всяка точка е една област. Линията показва общата посока, r — силата на връзката (от −1 до 1).</p>
    </div></div>
    <div class="seg" role="group" aria-label="Сравнение">${Object.keys(PAIRS).map((k) =>
      `<button type="button" data-action="pair" data-key="${k}" aria-pressed="${k === ui.pair}">${esc(PAIRS[k].label)}</button>`).join('')}</div>
    <div class="reg-scatter">
      <div class="reg-scatter-chart">${chart}</div>
      <aside class="reg-corr">
        <span class="muted">Корелация</span>
        <span class="num reg-r">r = ${fmt(fit.r, 2)}</span>
        <strong>${esc(strength(fit.r))}</strong>
        <p>${esc(pair.text)}</p>
        <p class="small muted">${pair.skipFlag ? 'Без 6-те области с ненадеждна оценка на безработицата. ' : ''}${fit.n} области.</p>
      </aside>
    </div>
    <p class="source">Корелацията не доказва причина. София (столица) е силно отклонение и влияе на r — затова е отбелязана в различен цвят.</p>
  </section>`;
}

export default {
  id: ID,
  render(state) {
    const ui = uiOf(state);
    const mk = MAP_KEYS.includes(state.mapMetric[ID]) ? state.mapMetric[ID] : 'gdp';
    return `
    ${pageHero({
      eyebrow: 'Хора · Области',
      title: '28 области, две Българии',
      lead: 'София произвежда над два пъти повече на човек от средното за страната, а някои области са загубили почти една четвърт от населението си за 10 години.',
    })}
    ${renderRegionMap({
      pageId: ID, metrics: MAP_KEYS, selected: state.region, mapMetric: mk, highlight: ui.cmp,
      panelExtra: state.region != null && !ui.cmp.includes(state.region) && ui.cmp.length < 3
        ? '<button type="button" class="btn" data-action="add-compare">+ Добави за сравнение</button>' : '',
    })}
    ${compareSection(state, ui)}
    ${rankSection(mk)}
    ${scatterSection(ui)}
    ${methodBlock([
      { title: 'Промяна на населението', text: '31.12.2015 → 31.12.2025 по НСИ. Включва корекцията от преброяването през 2021 г.' },
      { title: 'Безработица по области', text: 'Наблюдението на работната сила има малки извадки в някои области. Стойностите, отбелязани със *, са ненадеждни според НСИ и не участват в корелациите.' },
      { title: 'Различни години', text: 'БВП и заплатите са за 2024 г., населението, безработицата и престъпността — за 2025 г. Това са последните публикувани данни.' },
    ])}
    ${sourcesBlock([
      { href: 'https://www.nsi.bg/sites/default/files/files/data/timeseries/Pop_6.1.1_Pop_DR_EN.xlsx', title: 'НСИ — население по области', text: '2015 и 2025 г.' },
      { href: 'https://ec.europa.eu/eurostat/databrowser/view/nama_10r_3gdp/default/table', title: 'Евростат — nama_10r_3gdp', text: 'БВП на човек по области, 2024' },
      { href: 'https://www.nsi.bg/sites/default/files/files/data/timeseries/Labour_3.2.3_EN.xlsx', title: 'НСИ — безработица и заплати по области', text: 'Наблюдение на работната сила; наети и заплати' },
      { href: 'https://www.mvr.bg/upload/315961/STAT_2025.xlsx', title: 'МВР — полицейска статистика 2025', text: 'Престъпления и разкриваемост по области' },
    ], 'НСИ, Евростат (NUTS 3), МВР.')}
    ${renderRegionChip(state.region)}`;
  },
  actions: {
    'add-compare': (el, { state, update }) => {
      const { cmp } = uiOf(state);
      const sel = state.region;
      if (sel != null && !cmp.includes(sel) && cmp.length < 3) setUi(state, update, { cmp: [...cmp, sel] });
    },
    'remove-compare': (el, { state, update }) => {
      const id = Number(el.dataset.id);
      setUi(state, update, { cmp: uiOf(state).cmp.filter((x) => x !== id) });
    },
    pair: (el, { state, update }) => setUi(state, update, { pair: el.dataset.key }),
  },
};
