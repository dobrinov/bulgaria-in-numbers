// Връзки — съотношения, индекс спрямо 2015 г. и корелации между показателите.
import './links.css';
import { pageHero } from '../components/sectionPage.js';
import { scatterChart } from '../lib/charts.js';
import { YEARS, EUR, POPULATION, fmt, esc, correlation, strength, COLORS } from '../lib/format.js';

const ID = 'links';

// Официални серии (вижте останалите раздели за източниците)
const POP = POPULATION;
const OCC = [118966, 126808, 128905, 130005, 131278, 131463, 131970, 131644, 131496, 132392, 133275];
const PAY = [4268.2, 4341.1, 4798.2, 5327.5, 6140.9, 6641.9, 7881.8, 8656.7, 9989.8, 11886.3, 14357.5];
const PAYPCT = [9.3, 8.9, 9.1, 9.5, 10.0, 10.7, 11.0, 10.0, 10.5, 11.3, 12.3];
const GDP = [45797, 48751, 52501, 56076, 61179, 62003, 71400, 86336, 95101, 105279, 116549];
const TAX = [13219, 14228, 15667, 16682, 18677, 18789, 21889, 26736, 28341, 31907, 35622];
const WAGE = [878, 948, 1037, 1146, 1267, 1391, 1561, 1770, 2040, 2325, 31239 / 12];
const HICP = [-1.1, -1.3, 1.2, 2.6, 2.5, 1.2, 2.8, 13.0, 8.6, 2.6, 3.5];
const CRIMES = [100054, 91500, 93747, 84730, 77674, 69896, 67310, 75334, 73111, 74709, 70075];
const OFFICERS = [22465, 30434, 28299, 28742, 28769, 29170, 29117, 28800, 29120, 29154, null];
const CLEAR = [40.1, 48.7, 45.3, 49.0, 50.4, 50.8, 51.7, 49.2, 52.6, 49.45, 54.18];
const POL100K = [311.92, 425.43, 398.47, 407.69, 410.98, 419.62, 445.75, 444.27, 451.63, 452.32, null];
const UNEMP = [10.1, 8.6, 7.2, 6.2, 5.2, 6.1, 5.2, 4.2, 4.3, 4.2, 3.5];
const BALPCT = [-1.7, 0.1, 1.1, 1.7, 2.1, -3.8, -4.0, -2.9, -2.0, -3.0, -4.0];
const DEBT = [23218, 27859, 25908, 24305, 24078, 29595, 33279, 37855, 42393, 48851, 68057];
const POVERTY = [43.3, 41.0, 38.0, 33.0, 33.2, 33.5, 31.7, 32.2, 30.0, 30.3, 29.0];

const PRICE = [100];
for (let i = 1; i < YEARS.length; i++) PRICE.push(PRICE[i - 1] * (1 + HICP[i] / 100));
const REALW = WAGE.map((w, i) => (w / WAGE[0]) / (PRICE[i] / 100) * 100);
const L = YEARS.length - 1;

const pct = (a, b) => ((b - a) / a) * 100;
const sg = (v, d) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), d);

function ratios() {
  const admK = OCC.map((v, i) => (v / POP[i]) * 1000);
  const taxPc = TAX.map((v, i) => (v * 1e6) / POP[i]);
  const crimeK = CRIMES.map((v, i) => (v / POP[i]) * 1000);
  const debtPc = DEBT.map((v, i) => ((v / EUR) * 1e6) / POP[i]);
  return [
    { label: 'Заети щатни места в администрацията (вкл. МВР) на 1000 души, 2016 → 2025', from: fmt(admK[1], 1), to: fmt(admK[L], 1),
      change: sg(pct(admK[1], admK[L]), 0) + '%', tone: 'muted',
      text: 'Населението намалява с ' + fmt(Math.abs(pct(POP[1], POP[L])), 1) + '%, а заетите щатни места растат с ' + fmt(pct(OCC[1], OCC[L]), 1) + '%. Сравняваме от 2016 г. заради различно отчитане през 2015 г.' },
    { label: 'Заплати на всички наети от държавата, % от БВП', from: fmt(PAYPCT[0], 1) + '%', to: fmt(PAYPCT[L], 1) + '%',
      change: sg(PAYPCT[L] - PAYPCT[0], 1) + ' п.п.', tone: 'muted',
      text: 'Разходите за заплати растат ' + fmt(PAY[L] / PAY[0], 1) + ' пъти, а БВП — ' + fmt(GDP[L] / GDP[0], 1) + ' пъти.' },
    { label: 'Реална средна заплата (индекс)', from: '100', to: fmt(REALW[L], 0),
      change: sg(REALW[L] - 100, 0) + '% над инфлацията', tone: 'good',
      text: 'Номиналната заплата расте ' + fmt(WAGE[L] / WAGE[0], 1) + ' пъти, цените — с ' + fmt(PRICE[L] - 100, 0) + '%.' },
    { label: 'Данъци и осигуровки на човек', from: fmt(taxPc[0], 0) + ' €', to: fmt(taxPc[L], 0) + ' €',
      change: '×' + fmt(taxPc[L] / taxPc[0], 1), tone: 'muted',
      text: 'Като дял от БВП данъчната тежест е почти същата: 28,9% → 30,6%.' },
    { label: 'Регистрирани престъпления на 1000 души', from: fmt(crimeK[0], 1), to: fmt(crimeK[L], 1),
      change: sg(pct(crimeK[0], crimeK[L]), 0) + '%', tone: 'good',
      text: 'Разкриваемостта се покачва от ' + fmt(CLEAR[0], 1) + '% на ' + fmt(CLEAR[L], 1) + '%.' },
    { label: 'Държавен дълг на човек', from: fmt(debtPc[0], 0) + ' €', to: fmt(debtPc[L], 0) + ' €',
      change: '×' + fmt(debtPc[L] / debtPc[0], 1), tone: 'bad',
      text: 'Като дял от БВП дългът е 26,0% през 2015 г. и 29,9% през 2025 г.' },
  ];
}

const SERIES = [
  ['pop', 'Население', '#163A9E', POP],
  ['occ', 'Заети щатове в администрацията, вкл. МВР (2016 = 100)', '#B45309', [null, ...OCC.slice(1)]],
  ['pay', 'Заплати на всички наети от държавата (текущи цени)', '#BE185D', PAY],
  ['gdp', 'БВП (текущи цени)', '#0F766E', GDP],
  ['tax', 'Данъчни приходи (текущи цени)', '#6D28D9', TAX],
  ['wage', 'Средна заплата (текущи цени)', '#0F1B2D', WAGE],
  ['price', 'Цени (ХИПЦ)', '#A16207', PRICE],
  ['real', 'Реална заплата', '#5B84E8', REALW],
  ['crimes', 'Регистрирани престъпления', '#64748B', CRIMES],
  ['police', 'Полицаи (2016 = 100)', '#9A3412', [null, ...OFFICERS.slice(1)]],
];
const DEFAULT_ON = { pop: true, occ: true, pay: true, gdp: true };

const debtChg = DEBT.map((v, i) => (i === 0 ? null : (v - DEBT[i - 1]) / EUR / 1000));
const PAIRS = {
  police: { label: 'Полицаи ↔ разкриваемост', x: POL100K, y: CLEAR, xl: 'Полицаи на 100 000 души', yl: 'Разкриваемост, %', xd: 0, yd: 0, ys: '%',
    src: 'Евростат (crim_just_job), МВР',
    text: 'Години с повече полицаи на глава от населението са и години с по-висока разкриваемост. Но точката за 2015 г. (необичайно нисък брой полицаи по Евростат) засилва връзката — без нея r = 0,62. И двете растат с времето, така че причината може да е друга.' },
  officers: { label: 'Полицаи ↔ престъпления', x: OFFICERS, y: CRIMES, xl: 'Брой полицаи', yl: 'Регистрирани престъпления', xd: 0, yd: 0, ys: '',
    src: 'Евростат (crim_just_job), МВР',
    text: 'Броят полицаи е почти постоянен от 2016 г., докато престъпленията намаляват. Точката за 2015 г. е необичайно ниска по данни на Евростат и влияе силно на r.' },
  debt: { label: 'Дефицит ↔ нов дълг', x: BALPCT, y: debtChg, xl: 'Дефицит (−) / излишък (+), % от БВП', yl: 'Промяна на дълга, млрд. €', xd: 0, yd: 1, ys: '',
    src: 'НСИ',
    text: 'Години с дефицит са години с нов дълг, а години с излишък — с намаляващ дълг. 2025 г. се откроява: дългът расте с повече от дефицита, защото държавата трупа и резерв.' },
  phillips: { label: 'Безработица ↔ инфлация', x: UNEMP, y: HICP, xl: 'Безработица, %', yl: 'Инфлация (ХИПЦ), %', xd: 0, yd: 0, ys: '%',
    src: 'Евростат (une_rt_a, prc_hicp_aind)',
    text: 'Класическата крива на Филипс предполага: по-ниска безработица → по-висока инфлация. Скокът на цените през 2022–2023 г. идва основно от енергията, а не от пазара на труда.' },
  conv: { label: 'Сближаване с ЕС ↔ бедност', x: [49, 51, 52, 53, 55, 57, 60, 62, 64, 66, null], y: POVERTY,
    xl: 'БВП на човек, ЕС = 100', yl: 'В риск от бедност или социално изключване, %', xd: 0, yd: 0, ys: '%',
    src: 'Евростат (prc_ppp_ind, ilc_peps01n)',
    text: 'Колкото повече се доближаваме до средния доход в ЕС, толкова по-малко хора са в риск от бедност. Най-голям спад има до 2018 г.; оттогава намалява по-бавно, въпреки растежа.' },
  minw: { label: 'Минимална заплата ↔ бедност', x: [194, 215, 235, 261, 286, 312, 332, 363, 399, 477, 551], y: POVERTY,
    xl: 'Минимална заплата, €', yl: 'В риск от бедност или социално изключване, %', xd: 0, yd: 0, ys: '%',
    src: 'Евростат (earn_mw_cur, ilc_peps01n)',
    text: 'Минималната заплата се е увеличила почти 3 пъти, а дялът на хората в риск от бедност е спаднал от 43% на 29%. Последните години показват, че по-високата минимална заплата не сваля бедността сама по себе си.' },
  wagegdp: { label: 'БВП ↔ заплати на наетите от държавата', x: GDP.map((v) => v / 1000), y: PAY.map((v) => v / 1000), xl: 'БВП, млрд. €', yl: 'Заплати на всички наети от държавата, млрд. €', xd: 0, yd: 0, ys: '',
    src: 'Евростат (nama_10_gdp, gov_10a_main)',
    text: 'Държавните заплати растат заедно с икономиката, но наклонът на линията показва колко евро заплати се добавят на всяко ново евро БВП.' },
};

// Индекс спрямо първата година с данни (полицаите и щатовете — от 2016 г. заради прекъсване в данните за 2015 г.)
const toIdx = (xs) => { const b = xs.find((v) => v != null); return xs.map((v) => (v == null ? null : (v / b) * 100)); };

function uiOf(state) {
  const ui = state.ui[ID] || {};
  return { on: ui.on || DEFAULT_ON, pair: PAIRS[ui.pair] ? ui.pair : 'debt' };
}
function setUi(state, update, patch) {
  update({ ui: { ...state.ui, [ID]: { ...uiOf(state), ...patch } } });
}

/** Няколко линии в една графика (индекс 2015 = 100). */
function indexChart(sel) {
  const W = 800, H = 320, X0 = 70, R = 20, T = 25, B = 270;
  const all = [100, ...sel.flatMap((s) => s.idx.filter((v) => v != null))];
  let lo = Math.min(...all), hi = Math.max(...all);
  const padY = (hi - lo) * 0.08 || 10;
  lo = Math.floor((lo - padY) / 10) * 10;
  hi = Math.ceil((hi + padY) / 10) * 10;
  const X = (i) => X0 + 10 + (i * (W - X0 - R - 20)) / (YEARS.length - 1);
  const Y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
  const ticks = [0, 1, 2, 3, 4].map((k) => lo + ((hi - lo) * k) / 4);
  const grid = ticks.map((v) => `
    <line x1="${X0}" x2="${W - R}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="${COLORS.grid}" />
    <text x="${X0 - 8}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end" class="tick">${fmt(v, 0)}</text>`).join('')
    + `<line x1="${X0}" x2="${W - R}" y1="${Y(100).toFixed(1)}" y2="${Y(100).toFixed(1)}" stroke="#8792A6" stroke-width="1.5" />
    <text x="${X0 - 8}" y="${(Y(100) + 4).toFixed(1)}" text-anchor="end" class="tick tick-on">100</text>`;
  const lines = sel.map((s) => {
    const d = s.idx.map((v, i) => (v == null ? null : [i, v])).filter(Boolean)
      .map(([i, v], n, arr) => (n > 0 && arr[n - 1][0] === i - 1 ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
    return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><title>${esc(s.label)}</title></path>`;
  }).join('');
  const years = YEARS.map((y, i) => `<text x="${X(i).toFixed(1)}" y="${B + 24}" text-anchor="middle" class="tick">${y}</text>`).join('');
  const aria = 'Индекс 2015 = 100: ' + sel.map((s) => s.label + ' ' + fmt(s.idx.filter((v) => v != null).slice(-1)[0], 0)).join(', ');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(aria)}">${grid}${lines}${years}</svg>`;
}

function indexSection(ui) {
  const sel = SERIES.filter(([k]) => ui.on[k]).map(([k, label, color, xs]) => ({ key: k, label, color, idx: toIdx(xs) }));
  const buttons = SERIES.map(([k, label, color, xs]) => {
    const ix = toIdx(xs);
    let li = ix.length - 1;
    while (ix[li] == null) li--;
    const v = ix[li];
    const on = !!ui.on[k];
    return `<button type="button" class="lk-series${on ? ' is-on' : ''}" style="--c:${color}" data-action="toggle-series" data-key="${k}" aria-pressed="${on}">
      <i aria-hidden="true"></i><span>${esc(label)}</span>
      <strong class="num${v >= 100 ? '' : ' is-down'}">${fmt(v, 0)}${li < L ? ' (' + YEARS[li] + ')' : ''}</strong>
    </button>`;
  }).join('');
  return `
  <section class="card" aria-labelledby="idx-h">
    <div class="card-head"><div>
      <h2 id="idx-h">Всичко спрямо 2015 г.</h2>
      <p class="muted">Индекс: стойността за 2015 г. = 100. Линия над 100 значи ръст, под 100 — спад. Изберете кои показатели да сравните.</p>
    </div></div>
    <div class="lk-series-group" role="group" aria-label="Показатели">${buttons}</div>
    ${sel.length ? indexChart(sel) : '<p class="muted lk-empty">Изберете поне един показател.</p>'}
    <p class="source">Стойността в бутона е индексът за последната година с данни. Цени: ХИПЦ (Евростат). Реална заплата = средна заплата (НСИ), разделена на индекса на цените. Сумите в евро — по фиксирания курс.</p>
  </section>`;
}

function scatterSection(ui) {
  const pair = PAIRS[ui.pair];
  const pts = YEARS.map((y, i) => ({ y, xv: pair.x[i], yv: pair.y[i] })).filter((p) => p.xv != null && p.yv != null);
  const fit = correlation(pts.map((p) => p.xv), pts.map((p) => p.yv));
  const weak = Math.abs(fit.r) < 0.3;
  const chart = scatterChart({
    points: pts.map((p) => ({ x: p.xv, y: p.yv, label: String(p.y) })),
    xLabel: pair.xl, yLabel: pair.yl, xDec: pair.xd, yDec: pair.yd, ySuffix: pair.ys, fit,
  });
  return `
  <section class="card" aria-labelledby="sc-h">
    <div class="card-head"><div>
      <h2 id="sc-h">Има ли връзка?</h2>
      <p class="muted">Всяка точка е една година. Линията показва общата посока. Коефициентът r е между −1 и 1: близо до 0 — няма връзка, близо до ±1 — силна връзка.</p>
    </div></div>
    <div class="seg" role="group" aria-label="Сравнение">${Object.keys(PAIRS).map((k) =>
      `<button type="button" data-action="pair" data-key="${k}" aria-pressed="${k === ui.pair}">${esc(PAIRS[k].label)}</button>`).join('')}</div>
    <div class="lk-scatter">
      <div class="lk-scatter-chart">${chart}</div>
      <aside class="lk-corr">
        <span class="muted">Корелация</span>
        <span class="num lk-r">r = ${fmt(fit.r, 2)}</span>
        <strong${weak ? ' class="tone-muted"' : ''}>${esc(strength(fit.r))}</strong>
        <p>${esc(pair.text)}</p>
        <p class="small muted">Години: ${pts[0].y}–${pts[pts.length - 1].y}. Източници: ${esc(pair.src)}.</p>
      </aside>
    </div>
    <p class="source">Корелацията не доказва причина. Две числа могат да се движат заедно, защото и двете зависят от нещо трето — например от растежа на икономиката.</p>
  </section>`;
}

export default {
  id: ID,
  render(state) {
    const ui = uiOf(state);
    return `
    ${pageHero({
      eyebrow: 'Анализ · Връзки',
      title: 'Как се движат числата едно спрямо друго',
      lead: 'Сравнения и корелации между показателите от останалите раздели. Всички стойности са официални — тук само ги поставяме едно до друго.',
    })}
    <section aria-labelledby="ratio-h" class="stack">
      <h2 id="ratio-h">2015 → 2025 в шест съотношения</h2>
      <div class="lk-ratios">${ratios().map((r) => `
        <article class="card card-sm">
          <h3 class="lk-ratio-label">${esc(r.label)}</h3>
          <div class="num lk-ratio-vals"><span>${esc(r.from)}</span><span aria-hidden="true">→</span><strong>${esc(r.to)}</strong></div>
          <span class="num lk-ratio-change tone-${r.tone}">${esc(r.change)}</span>
          <p>${esc(r.text)}</p>
        </article>`).join('')}</div>
    </section>
    ${indexSection(ui)}
    ${scatterSection(ui)}`;
  },
  actions: {
    'toggle-series': (el, { state, update }) => {
      const { on } = uiOf(state);
      const k = el.dataset.key;
      setUi(state, update, { on: { ...on, [k]: !on[k] } });
    },
    pair: (el, { state, update }) => setUi(state, update, { pair: el.dataset.key }),
  },
};
