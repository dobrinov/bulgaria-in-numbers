// Бюджет и дълг — НСИ (дефицит и дълг) и Евростат (gov_10a_main, gov_10a_exp).
import './budget.css';
import { barList, stackedBar } from '../lib/charts.js';
import { EUR, fmt, esc, COLORS } from '../lib/format.js';
import { hashFor } from '../lib/state.js';
import { PY, PUB, NAT_WAGE_BGN, perEmployee } from '../data/publicSector.js';

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// НСИ, сектор „Държавно управление“, окончателни данни (последна ревизия за всяка година), млн. лв.
const BAL_BGN = [-1532, 78, 1136, 1898, 2566, -4593, -5526, -4942, -3683, -6240, -9122];
const BAL_PCT = [-1.7, 0.1, 1.1, 1.7, 2.1, -3.8, -4.0, -2.9, -2.0, -3.0, -4.0];
const DEBT_BGN = [23218, 27859, 25908, 24305, 24078, 29595, 33279, 37855, 42393, 48851, 68057];
const DEBT_PCT = [26.0, 29.3, 25.3, 22.1, 20.0, 24.5, 23.8, 22.5, 22.9, 23.8, 29.9];
const bn = (xs) => xs.map((v) => v / 1000 / EUR);
const SRC = 'НСИ, дефицит и дълг на сектор „Държавно управление“ (окончателни данни, последна ревизия)';
const REV_MEUR = [17643.5, 17107.1, 19118.0, 21740.6, 23662.4, 23227.3, 26800.1, 33026.7, 34846.0, 37876.0, 44347.5];
const EXP_MEUR = [18494.9, 16952.0, 18265.4, 20770.1, 22343.4, 25595.4, 29625.6, 35554.6, 36729.5, 41067.5, 49012.0];
const kind = (v) => (v < 0 ? 'Дефицит' : 'Излишък');

const sgn = (v, d) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), d);
const dd = (v) => (Math.abs(v) < 1 ? 2 : 1);
const tone = (v) => (v > 0 ? 'tone-bad' : 'tone-good');

// Правителства (дати на встъпване). Последното е до края на наличните данни.
const GOV = [
  { name: 'Борисов II', kind: 'редовно', from: '2014-11-07', to: '2017-01-27', period: '11.2014 – 01.2017' },
  { name: 'Герджиков', kind: 'служебно', from: '2017-01-27', to: '2017-05-04', period: '01.2017 – 05.2017' },
  { name: 'Борисов III', kind: 'редовно', from: '2017-05-04', to: '2021-05-12', period: '05.2017 – 05.2021' },
  { name: 'Янев I и II', kind: 'служебно', from: '2021-05-12', to: '2021-12-13', period: '05.2021 – 12.2021' },
  { name: 'Петков', kind: 'редовно', from: '2021-12-13', to: '2022-08-02', period: '12.2021 – 08.2022' },
  { name: 'Донев I и II', kind: 'служебно', from: '2022-08-02', to: '2023-06-06', period: '08.2022 – 06.2023' },
  { name: 'Денков', kind: 'редовно', from: '2023-06-06', to: '2024-04-09', period: '06.2023 – 04.2024' },
  { name: 'Главчев I и II', kind: 'служебно', from: '2024-04-09', to: '2025-01-16', period: '04.2024 – 01.2025' },
  { name: 'Желязков', kind: 'редовно', from: '2025-01-16', to: '2026-01-01', period: '01.2025 – (данни до 12.2025)' },
];

/** Разпределя годишната промяна на дълга и салдото между правителствата по дни на власт. */
function allocate() {
  const day = (s) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 86400000;
  const govs = GOV.map((g) => ({ ...g, debtSum: 0, balSum: 0 }));
  const annual = [];
  for (let i = 1; i < YEARS.length; i++) {
    const y = YEARS[i];
    const ys = day(y + '-01-01');
    const ye = day(y + 1 + '-01-01');
    const len = ye - ys;
    const dDebt = DEBT_BGN[i] - DEBT_BGN[i - 1];
    const names = [];
    for (const g of govs) {
      const ov = Math.min(ye, day(g.to)) - Math.max(ys, day(g.from));
      if (ov > 0) {
        g.debtSum += (dDebt * ov) / len;
        g.balSum += (BAL_BGN[i] * ov) / len;
        names.push(g.name);
      }
    }
    annual.push({ year: y, v: dDebt / 1000 / EUR, govs: names.join(', ') });
  }
  return { govs, annual };
}
const ALLOC = allocate();

// Евростат gov_10a_exp (COFOG), S13, млн. €, 2015–2024
const CY = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
// Общи държавни услуги (GF01) и в тях — лихви по дълга (GF0107, „Операции с публичния дълг“).
const GF01 = [1753.7, 1767.0, 1693.3, 2057.9, 2198.7, 2284.2, 3532.5, 3161.7, 3028.9, 3075.3];
const GF0107 = [421.1, 430.3, 424.4, 371.5, 343.4, 324.8, 347.3, 333.4, 468.6, 543.2];
// Платени лихви от сектор „Държавно управление“, млн. € (Евростат, gov_10a_main, D41PAY), 2015–2025.
const INTEREST = [420.9, 430.0, 424.1, 371.0, 341.7, 324.3, 346.4, 332.7, 467.4, 541.9, 908.4];
// Върнати главници по държавния дълг, млн. лв. (Годишен отчет за състоянието на държавния дълг на МФ,
// цитиран в становищата на Фискалния съвет). 2019 и 2023 г. — от посочената в същите становища промяна
// спрямо предходната година; 2025 г. — закръглено до 0,1 млрд. лв. Няма публикувани данни за 2015–2017 и 2022 г.
const PRINCIPAL_BGN = [null, null, null, 1581.1, 1361.9 - 161.5, 1361.9, 1076.3, null, 3492.2 - 495.2, 3492.2, 3600];
const add = (a, b, c) => a.map((v, i) => v + b[i] + c[i]);
const FN = [
  ['Социална защита (пенсии, помощи)', '#163A9E', [5949.1, 6001.1, 6436.5, 6720.5, 7047.7, 8051.5, 9209.1, 11403.0, 13060.9, 15091.9]],
  ['Икономически дейности (транспорт, енергетика, земеделие)', '#5B84E8', [2821.4, 1854.3, 2174.6, 3757.8, 3970.0, 5235.7, 4696.8, 7366.2, 5444.4, 6105.9]],
  ['Здравеопазване', '#A9C1F5', [2429.9, 2414.3, 2547.4, 2785.9, 2845.5, 3600.0, 4170.4, 4770.2, 5098.1, 5618.4]],
  ['Образование', '#0F1B2D', [1792.2, 1655.2, 1852.9, 1981.7, 2342.2, 2418.4, 3100.2, 3376.3, 3908.3, 4455.0]],
  ['Общи държавни услуги (администрация, без лихвите)', '#B45309', GF01.map((v, i) => v - GF0107[i])],
  ['Лихви по държавния дълг', '#9F1239', GF0107],
  ['Обществен ред и сигурност', '#E8A867', [1279.4, 1113.4, 1296.9, 1378.0, 1633.0, 1672.7, 1988.8, 2219.8, 2493.1, 2914.6]],
  ['Отбрана', '#6B3A0A', [597.4, 541.7, 564.1, 649.9, 729.8, 914.7, 1037.6, 1305.9, 1430.9, 1344.5]],
  ['Околна среда, жилища, култура', '#C5CCD8', add(
    [356.2, 321.8, 351.9, 393.1, 414.6, 427.6, 547.1, 638.4, 555.6, 639.8],
    [964.5, 923.8, 812.7, 593.3, 748.8, 465.5, 681.0, 766.1, 1005.2, 1067.0],
    [551.1, 359.5, 534.9, 451.7, 413.1, 525.2, 662.2, 534.1, 698.7, 747.0])],
];
const TOT = [18494.9, 16952.1, 18265.4, 20770.0, 22343.5, 25595.5, 29625.6, 35541.6, 36724.0, 41059.6];
const TOTPCT = [40.4, 34.8, 34.8, 37.1, 36.5, 41.4, 41.5, 41.3, 38.9, 39.2];

// Евростат gov_10a_main, S13, млн. €, 2015–2025 — разходи по икономически вид.
const TY = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const D1 = [4268.2, 4341.1, 4798.2, 5327.5, 6140.9, 6641.9, 7881.8, 8656.7, 9989.8, 11886.3, 14357.5];
const D62 = [5427, 5628.2, 5814.9, 6138.7, 6507.9, 7213, 8274.3, 10330.3, 11764.5, 13406.5, 14909.2];
const D632 = [900.5, 1052.2, 1190.6, 1173, 1335.7, 1547.2, 1784.2, 2249.3, 2439.9, 2438.6, 3219.7];
const P2 = [2383.2, 2326.5, 2517.9, 2708.1, 2801.4, 3172.8, 3690.9, 4448.3, 4606.7, 4875.6, 5648.5];
const D3 = [830.5, 679.8, 590.4, 1210.7, 1488.3, 2057, 2667.3, 4563.3, 2288.7, 2311.8, 2094.7];
const P51G = [3010, 1298.1, 1201.2, 1724.6, 2059.6, 2053.8, 1933.5, 2033.1, 3608, 3311.3, 5574.9];
const TYPE_ROWS = [
  ['Заплати и осигуровки на наетите от държавата', '#163A9E', D1],
  ['Пенсии и социални помощи', '#5B84E8', D62],
  ['Лечение и услуги, платени от държавата (здравна каса, лекарства)', '#A9C1F5', D632],
  ['Стоки и услуги (издръжка: ток, ремонти, консумативи)', '#0F1B2D', P2],
  ['Инвестиции (пътища, сгради, техника)', '#E8A867', P51G],
  ['Субсидии за фирми', '#6B3A0A', D3],
  ['Лихви по държавния дълг', '#9F1239', INTEREST],
];
TYPE_ROWS.push(['Други (трансфери към ЕС и чужбина, капиталови трансфери)', '#C5CCD8',
  EXP_MEUR.map((t, i) => t - TYPE_ROWS.reduce((sum, row) => sum + row[2][i], 0))]);
const EXP_PCT = [40.4, 34.8, 34.8, 37.0, 36.5, 41.3, 41.5, 41.2, 38.6, 39.0, 42.1];

const SPEND_VIEWS = {
  type: {
    tab: 'По вид разход', years: TY, rows: TYPE_ROWS, tot: EXP_MEUR, totPct: EXP_PCT,
    sub: 'Разходи на сектор „Държавно управление“ по вид — за какво отиват парите: заплати, пенсии, издръжка, инвестиции, лихви.',
    source: 'Евростат, gov_10a_main (D1, D62, D632, P2, P51G, D3, D41). „Други“ е разликата до общите разходи.',
    extra: `Заплатите са на всички наети от държавата — учители, лекари в държавни болници, полицаи, военни и администрация. Повече за администрацията — в <a href="${hashFor('admin')}">Администрация</a>.`,
    callout: payCallout,
  },
  fn: {
    tab: 'По предназначение', years: CY, rows: FN, tot: TOT, totPct: TOTPCT,
    sub: 'Разходи на сектор „Държавно управление“ по функции — за какви дейности: всяка включва и заплатите, и издръжката, и инвестициите в нея.',
    source: 'Евростат, gov_10a_exp (COFOG; лихвите са функция 01.7 „Операции с публичния дълг“). Данните по функции за 2025 г. още не са публикувани.',
    extra: 'Лихвите са цената на дълга. Връщането на самия дълг (главницата) не е разход — то се плаща основно с нов дълг, затова не е в тази графика. Вижте показателите „Лихви по дълга“ и „Върнат дълг“ по-горе.',
  },
};

/** Връзка към обяснението на проектобюджета за 2027 г. (отделна статична страница). */
function dummiesSection() {
  return `
  <a class="dummies-promo" href="./budget-2027-for-dummies.html">
    <span class="dummies-tag">Ново · Проект</span>
    <strong>Бюджет 2027 for dummies</strong>
    <span>Проектобюджетът за 2027 г. с човешки думи: дефицит 4,2%, дълг 47,0 млрд. €, новите данъци и къде отиват парите.</span>
    <span class="dummies-go">Прочетете →</span>
  </a>`;
}

/** Колко струва средно един нает от държавата за избраната година (или най-близката с данни). */
function payCallout(year) {
  const j = PY.indexOf(year) >= 0 ? PY.indexOf(year) : year < PY[0] ? 0 : PY.length - 1;
  const y = PY[j];
  const i = TY.indexOf(y);
  const per = perEmployee(j);
  const nat = NAT_WAGE_BGN[j] / EUR;
  const other = y !== year ? `<p class="small budget-warn">Броят наети за ${year} г. още не е публикуван — показваме ${y} г.</p>` : '';
  return `
    <div class="pay-callout">
      <h3>Колко струва средно един нает от държавата, ${y} г.</h3>
      ${other}
      <dl class="pay-math num">
        <div><dt>Заплати и осигуровки</dt><dd>${fmt(D1[i] / 1000, 2)} млрд. €</dd></div>
        <div class="op" aria-hidden="true">÷</div>
        <div><dt>Наети в обществения сектор</dt><dd>${fmt(PUB[j], 0)}</dd></div>
        <div class="op" aria-hidden="true">÷</div>
        <div><dt>Месеца</dt><dd>12</dd></div>
        <div class="op" aria-hidden="true">≈</div>
        <div class="res"><dt>На един нает на месец</dt><dd>${fmt(per, 0)} €</dd></div>
      </dl>
      <p class="small muted">За сравнение: средната брутна заплата в страната е ${fmt(nat, 0)} €. Сумата на един нает включва и около 19% осигуровки за сметка на работодателя, затова не е равна на брутната заплата. Броят наети (НСИ) включва и държавните предприятия, затова резултатът е приблизителен.</p>
    </div>`;
}

function cofogSection(ctx) {
  const viewKey = (ctx.ui && ctx.ui.spendView) || 'type';
  const V = SPEND_VIEWS[viewKey];
  const Y = V.years;
  const last = Y[Y.length - 1];
  const ci = Y.indexOf(ctx.year) < 0 ? Y.length - 1 : Y.indexOf(ctx.year);
  const note = ctx.year > last ? `Данните за ${ctx.year} г. още не са публикувани — показваме ${last} г.` : '';
  const shareMax = Math.max(...V.rows.map((f) => f[2][ci] / V.tot[ci]));
  return `
  <section class="card" aria-labelledby="fn-h">
    <div class="card-head">
      <div>
        <h2 id="fn-h">За какво харчи държавата, ${Y[0]}–${last}</h2>
        <p class="muted">${esc(V.sub)}</p>
      </div>
      <div class="seg" role="group" aria-label="Изглед">${Object.entries(SPEND_VIEWS).map(([k, v]) =>
        `<button type="button" data-action="spend-view" data-view="${k}" aria-pressed="${k === viewKey}">${esc(v.tab)}</button>`).join('')}</div>
    </div>
    <ul class="legend budget-legend">${V.rows.map(([name, color]) => `<li><i class="sw" style="background:${color}"></i>${esc(name)}</li>`).join('')}</ul>
    <ol class="cofog-rows">${Y.map((y, i) => `
      <li${y === ctx.year ? ' class="is-on"' : ''}>
        <span class="num">${y}</span>
        ${stackedBar(V.rows.map(([name, color, xs]) => ({ value: Math.max(0, xs[i]), color, label: name })), 24)}
        <span class="num">${fmt(V.tot[i] / 1000, 1)} млрд. €</span>
      </li>`).join('')}</ol>
    <div class="cofog-detail">
      <h3>Разбивка за ${Y[ci]} г.</h3>
      ${note ? `<p class="small budget-warn">${esc(note)}</p>` : ''}
      ${barList(V.rows.map(([name, color, xs]) => {
        const sh = xs[ci] / V.tot[ci];
        return { label: name, swatch: color, color, value: sh,
          display: `<strong>${fmt(sh * 100, 1)}%</strong> · ${fmt(xs[ci] / 1000, 2)} млрд. €`,
          sub: fmt(sh * V.totPct[ci], 1) + '% от БВП' };
      }), { max: shareMax })}
    </div>
    ${V.callout ? V.callout(Y[ci]) : ''}
    <p class="small muted">${V.extra}</p>
    <p class="source">Източник: ${esc(V.source)}</p>
  </section>`;
}

function govSection() {
  const gMax = Math.max(...ALLOC.govs.map((g) => Math.abs(g.debtSum)));
  const rows = ALLOC.govs.map((g) => {
    const v = g.debtSum / 1000 / EUR;
    const b = g.balSum / 1000 / EUR;
    const w = ((Math.abs(g.debtSum) / gMax) * 100).toFixed(1);
    return `
      <tr>
        <th scope="row"><strong>${esc(g.name)}</strong><span class="gov-kind">${esc(g.kind)}</span></th>
        <td class="num">${esc(g.period)}</td>
        <td><div class="gov-debt">
          <span class="bar" aria-hidden="true"><span style="width:${w}%;background:${v > 0 ? COLORS.worse : 'var(--accent)'}"></span></span>
          <strong class="num ${tone(v)}">${sgn(v, dd(v))}</strong>
        </div></td>
        <td class="num gov-right ${b < 0 ? 'tone-bad' : 'tone-good'}"><strong>${sgn(b, dd(b))}</strong></td>
      </tr>`;
  }).join('');
  return `
  <section class="card" aria-labelledby="gov-h">
    <div class="card-head">
      <div>
        <h2 id="gov-h">Дълг и салдо по правителства, 2016–2025</h2>
        <p class="muted">Промяна на дълга и сумарен дефицит (−) или излишък (+) по време на всяко правителство, в млрд. €. Промяната на дълга включва и рефинансиране и натрупване на фискален резерв, а служебните правителства изпълняват вече приет бюджет — числата не са оценка на отделно правителство.</p>
      </div>
      <span class="badge badge-estimate">Оценка по годишни данни</span>
    </div>
    <div class="table-scroll">
      <table class="data gov-table">
        <thead><tr><th scope="col">Правителство</th><th scope="col">Период</th><th scope="col">Промяна на дълга</th><th scope="col" class="gov-right">Сумарно салдо</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="legend small">
      <span><i class="sw" style="background:${COLORS.worse}"></i>дългът нараства</span>
      <span><i class="sw" style="background:var(--accent)"></i>дългът намалява</span>
      <span>Борисов II: само 2016 г. и януари 2017 г. — в набора няма дълг за 2014 г.</span>
    </p>
  </section>`;
}

function annualSection() {
  const aMax = Math.max(...ALLOC.annual.map((a) => Math.abs(a.v)));
  return `
  <section class="card" aria-labelledby="yr-h">
    <div class="card-head"><div>
      <h2 id="yr-h">Промяна на дълга по години</h2>
      <p class="muted">С колко милиарда евро се е променил дългът спрямо края на предходната година и кои правителства са управлявали през годината.</p>
    </div></div>
    <ol class="annual-rows">${ALLOC.annual.map((a) => `
      <li>
        <span class="num">${a.year}</span>
        <div>
          <span class="bar" aria-hidden="true"><span style="width:${((Math.abs(a.v) / aMax) * 100).toFixed(1)}%;background:${a.v > 0 ? COLORS.worse : 'var(--accent)'}"></span></span>
          <span class="annual-govs">${esc(a.govs)}</span>
        </div>
        <strong class="num ${tone(a.v)}">${sgn(a.v, dd(a.v))} млрд. €</strong>
      </li>`).join('')}</ol>
  </section>`;
}

export default {
  id: 'budget',
  eyebrow: 'Раздел · Бюджет и дълг',
  title: 'Дефицит, излишък и дълг',
  lead: 'Колко е похарчила държавата над приходите си всяка година, колко е дългът и кое правителство колко дълг е добавило.',
  summary: [
    'Бюджетът е на дефицит всяка година от 2020 г.; през 2025 г. той е 4,0% от БВП — над тавана на ЕС от 3%.',
    'Дългът е 29,9% от БВП — далеч под тавана от 60%, но само през 2025 г. нараства с 9,8 млрд. €.',
    'Най-много държавата харчи за социална защита — 37% от разходите (2024).',
    'Лихвите по дълга почти се удвояват през 2025 г.: 908 млн. € при 542 млн. € през 2024 г.',
  ],
  defaultYear: 2025,
  defaultMetric: 'balPct',
  order: ['balPct', 'bal', 'rev', 'exp', 'debtPct', 'debt', 'interest', 'principal'],
  metrics: {
    balPct: {
      label: 'Дефицит (−) / излишък (+), % от БВП', tab: 'Дефицит/излишък, %', d: 1, suffix: '%', good: 'up', pp: true, signed: true,
      values: BAL_PCT, source: SRC, limit: 'Таван на ЕС за дефицита: −3% от БВП.', note: kind,
      sub: 'Дефицит (−) или излишък (+) на сектор „Държавно управление“ като дял от БВП',
    },
    bal: {
      label: 'Дефицит (−) / излишък (+), млрд. €', tab: 'Дефицит/излишък, млрд. €', d: 2, suffix: '', good: 'up', signed: true, pp: true, money: true,
      values: bn(BAL_BGN), source: SRC, note: kind,
      sub: 'Дефицит (−) или излишък (+), млрд. евро',
    },
    rev: {
      label: 'Приходи, % от БВП', tab: 'Приходи', d: 1, suffix: '%', good: 'none', pp: true,
      values: [38.5, 35.1, 36.4, 38.8, 38.7, 37.5, 37.5, 38.3, 36.6, 36.0, 38.1],
      source: 'Евростат, gov_10a_main', sub: 'Общо приходи на сектор „Държавно управление“ като дял от БВП',
      note: (v, i) => fmt(REV_MEUR[i] / 1000, 1) + ' млрд. €',
    },
    exp: {
      label: 'Разходи, % от БВП', tab: 'Разходи', d: 1, suffix: '%', good: 'none', pp: true,
      values: [40.4, 34.8, 34.8, 37.0, 36.5, 41.3, 41.5, 41.2, 38.6, 39.0, 42.1],
      source: 'Евростат, gov_10a_main', sub: 'Общо разходи на сектор „Държавно управление“ като дял от БВП',
      note: (v, i) => fmt(EXP_MEUR[i] / 1000, 1) + ' млрд. €',
    },
    debtPct: {
      label: 'Дълг, % от БВП', tab: 'Дълг, % от БВП', d: 1, suffix: '%', good: 'down', pp: true,
      values: DEBT_PCT, source: SRC, limit: 'Таван на ЕС за дълга: 60% от БВП.',
      sub: 'Консолидиран дълг на сектор „Държавно управление“ като дял от БВП',
    },
    debt: {
      label: 'Дълг, млрд. €', tab: 'Дълг, млрд. €', d: 1, suffix: '', good: 'down', money: true,
      values: bn(DEBT_BGN), source: SRC,
      sub: 'Консолидиран дълг на сектор „Държавно управление“, млрд. евро',
    },
    interest: {
      label: 'Лихви по дълга, млн. €', tab: 'Лихви по дълга', d: 0, suffix: '', good: 'down', money: true,
      values: INTEREST, source: 'Евростат, gov_10a_main (D41, платени лихви)',
      sub: 'Лихви, платени от сектор „Държавно управление“ за годината, млн. евро. Без връщането на главницата — тя се рефинансира с нов дълг.',
      note: (v, i) => fmt((v / EXP_MEUR[i]) * 100, 1) + '% от всички разходи',
    },
    principal: {
      label: 'Върнат дълг (главници), млрд. €', tab: 'Върнат дълг', d: 2, suffix: '', good: 'none', money: true,
      values: PRINCIPAL_BGN.map((v) => (v == null ? null : v / 1000 / EUR)),
      source: 'Министерство на финансите, годишен отчет за състоянието на държавния дълг (по становищата на Фискалния съвет)',
      sub: 'Главници, върнати по държавния дълг през годината, млрд. евро. Не е разход на бюджета — плаща се основно с нов дълг, затова дългът продължава да расте.',
      note: (v, i) => (i === YEARS.length - 1 ? 'Закръглено: 3,6 млрд. лв.' : ''),
      limit: 'Министерството на финансите не публикува тези данни в машинно четим вид; за 2015–2017 и 2022 г. няма данни в достъпните отчети.',
    },
  },
  sections: [dummiesSection, cofogSection, govSection, annualSection],
  actions: {
    'spend-view': (el, { state, update }) => update({ ui: { ...state.ui, budget: { ...(state.ui.budget || {}), spendView: el.dataset.view } } }),
  },
  method: [
    { title: 'Дефицит и излишък', text: 'Салдото на бюджета е приходи минус разходи на целия сектор „Държавно управление“ по методологията на ЕС. Минус е дефицит, плюс — излишък. Таванът по правилата на ЕС е 3% дефицит.' },
    { title: 'Как разпределяме дълга', text: 'Годишната промяна на дълга се разделя между правителствата пропорционално на дните им на власт през годината. Точното разпределение изисква месечните данни на Министерството на финансите.' },
    { title: 'Лихви и главници', text: 'Лихвите са разход на бюджета. Главниците (връщането на заетите пари) не са разход — държавата ги плаща основно с нов дълг. Затова „Върнат дълг“ не влиза в „Разходи“ и в разбивката по функции.' },
    { title: 'Дълг ≠ дефицит', text: 'Държавата може да тегли дълг и за да увеличи фискалния резерв или да рефинансира стар дълг, затова промяната на дълга не съвпада точно с дефицита.' },
  ],
  sourcesNote: 'НСИ публикува предварителни данни през април и окончателни през октомври на следващата година. Сумите в лева са преизчислени в евро по 1,95583 лв.',
  sources: [
    { href: 'https://www.nsi.bg/en/press-release/notification-tables-for-debt-and-deficit-for-general-government-sector-2024-final-data-8820', title: 'НСИ — дефицит и дълг, 2021–2024', text: 'Нотификационни таблици, окончателни данни' },
    { href: 'https://www.nsi.bg/sites/default/files/files/pressreleases/GFS2021_2IKKLN8.pdf', title: 'НСИ — дефицит и дълг, 2018–2021', text: 'Окончателни данни за 2021 г.' },
    { href: 'https://www.nsi.bg/file/22915/GFS2019_6T13SZJ.pdf', title: 'НСИ — дефицит и дълг, 2016–2019', text: 'Окончателни данни за 2019 г.' },
    { href: 'https://www.nsi.bg/file/22393/GFS2018_8LS6E7J.pdf', title: 'НСИ — дефицит и дълг, 2015–2018', text: 'Окончателни данни за 2018 г.' },
    { href: 'https://www.fiscal-council.bg/bg/publikacii/stanovishte-otnosno-otchet-za-izpylnenieto-na-dyrjavnia-biudget-na-republika-bylgaria-za-2024', title: 'Фискален съвет — становища по отчетите за бюджета', text: 'Главници и лихви по държавния дълг, 2018–2025 (по годишния отчет на МФ)' },
    { href: 'https://www.bta.bg/bg/news/economy/1229229-dalgat-na-balgariya-za-2025-g-e-blizo-30-na-sto-ot-bvp-otchete-nsi', title: 'БТА / НСИ — 2025 г.', text: 'Окончателни данни за 2025 г.' },
  ],
};
