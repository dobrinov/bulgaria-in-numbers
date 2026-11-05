// Сигурност и МВР — полицейска статистика на МВР, Евростат.
import './security.css';
import { SERIES } from '../data/oblasts.js';
import { barList } from '../lib/charts.js';
import { POPULATION, fmt, esc, COLORS } from '../lib/format.js';

const CRIM_ALL = [112037, 103773, 106659, 96753, 89742, 81136, 78418, 86998, 84225, 86049, 80885];
const OFFICERS = [22465, 30434, 28299, 28742, 28769, 29170, 29117, 28800, 29120, 29154, null];
const GF03PCT = [2.8, 2.3, 2.5, 2.5, 2.7, 2.7, 2.8, 2.6, 2.6, 2.8, null];
const CLEARANCE = [40.1, 48.7, 45.3, 49.0, 50.4, 50.8, 51.7, 49.2, 52.6, 49.45, 54.18];
const CRIMES = [100054, 91500, 93747, 84730, 77674, 69896, 67310, 75334, 73111, 74709, 70075];

// МВР, полицейска статистика 2025, лист Т2-крим: [област, регистрирани, разкриваемост %]
const R = [['София-град', 13925, 43.64], ['Благоевград', 2508, 58.97], ['Бургас', 5156, 48.99], ['Варна', 6560, 44.65],
  ['Велико Търново', 2171, 64.21], ['Видин', 976, 52.05], ['Враца', 2110, 64.41], ['Габрово', 1029, 66.57],
  ['Добрич', 1549, 57.52], ['Кърджали', 958, 68.89], ['Кюстендил', 1032, 58.24], ['Ловеч', 1416, 61.58],
  ['Монтана', 1513, 53.40], ['Пазарджик', 2101, 64.16], ['Перник', 1056, 58.90], ['Плевен', 2235, 49.80],
  ['Пловдив', 5515, 57.26], ['Разград', 925, 69.30], ['Русе', 1987, 54.50], ['Силистра', 795, 66.79],
  ['Сливен', 2005, 58.70], ['Смолян', 429, 60.61], ['София област', 2115, 59.86], ['Стара Загора', 3274, 54.89],
  ['Търговище', 989, 67.04], ['Хасково', 1825, 61.32], ['Шумен', 1409, 61.18], ['Ямбол', 1115, 67.89]];
const NAT = 54.18;
const SORTS = [['value', 'По разкриваемост'], ['reg', 'По брой'], ['name', 'А–Я']];

const STAFF = [
  ['Щатни бройки в МВР · май 2017', '61 170', '≈ 0,87% от населението', 'МВР, публикация от 01.05.2017'],
  ['Щатни бройки в МВР · края на 2024', '51 509', '≈ 0,80% от населението', 'Справка на дирекция „Човешки ресурси“ на МВР'],
  ['Заети места в МВР · 2026', '≈ 46 995', '≈ 0,73% от населението · 51 565 щатни, 4 570 незаети', 'Вестник „Сега“, 26.05.2026'],
  ['От тях полицаи · 2024', '29 154', '≈ 0,45% от населението', 'Евростат, crim_just_job (полицейски служители)'],
];

function staffSection() {
  return `
  <section class="card" aria-labelledby="staff-h">
    <div class="card-head"><div>
      <h2 id="staff-h">Служители на МВР и полицаи</h2>
      <p class="muted">Не всички служители на МВР са полицаи. В министерството работят и Гранична полиция, пожарна безопасност, администрация и служители по трудов договор. МВР не публикува численост всяка година, затова показваме наличните справки.</p>
    </div></div>
    <div class="sec-staff">${STAFF.map(([label, value, note, src], i) => `
      <div class="sec-stat${i === STAFF.length - 1 ? ' is-on' : ''}">
        <span class="sec-stat-label">${esc(label)}</span>
        <span class="sec-stat-value num">${esc(value)}</span>
        <span class="sec-stat-note num">${esc(note)}</span>
        <span class="sec-stat-src">${esc(src)}</span>
      </div>`).join('')}</div>
    <p class="source">Щатните бройки не са равни на реално заетите хора. През 2026 г. 43 741 щата са на служебно правоотношение (полицаи, гранични полицаи, пожарникари и др.) и 7 824 на трудов договор. Дял от населението — спрямо населението към края на предходната година по НСИ.</p>
  </section>`;
}

function regionsSection(ctx) {
  const sort = ctx.ui.sort || 'value';
  const rows = R.slice();
  if (sort === 'value') rows.sort((a, b) => b[2] - a[2]);
  if (sort === 'reg') rows.sort((a, b) => b[1] - a[1]);
  if (sort === 'name') rows.sort((a, b) => a[0].localeCompare(b[0], 'bg'));
  return `
  <section class="card sec-regions" aria-labelledby="reg-h">
    <div class="card-head">
      <div>
        <h2 id="reg-h">Разкриваемост по области, 2025 г.</h2>
        <p class="muted">28 областни дирекции. Средно за страната: <strong class="num sec-strong">54,2%</strong></p>
      </div>
      <div class="seg" role="group" aria-label="Подреждане">${SORTS.map(([k, label]) =>
        `<button type="button" data-action="sort" data-sort="${k}" aria-pressed="${k === sort}">${esc(label)}</button>`).join('')}</div>
    </div>
    <ol class="sec-rank">${rows.map(([name, reg, p]) => `
      <li>
        <span class="sec-rank-name">${esc(name)}</span>
        <span class="bar" aria-hidden="true"><span style="width:${p.toFixed(1)}%;background:${p >= NAT ? 'var(--accent)' : COLORS.worse}"></span></span>
        <span class="num sec-rank-pct">${fmt(p, 1)}%</span>
        <span class="num sec-rank-reg">${fmt(reg, 0)}</span>
      </li>`).join('')}</ol>
    <p class="legend small">
      <span><i class="sw" style="background:var(--accent)"></i>над средното</span>
      <span><i class="sw" style="background:${COLORS.worse}"></i>под средното</span>
      <span>Последна колона: регистрирани престъпления. Източник: МВР, полицейска статистика 2025.</span>
    </p>
  </section>`;
}

function typesSection() {
  const change = [['Кражби', '29 794', '18 233'], ['Грабежи', '1 835', '714'], ['Умишлени убийства', '159', '104'],
    ['Измами', '3 963', '3 334'], ['Наркотици', '4 011', '7 500'], ['Шофиране след алкохол/наркотици', '6 145', '6 645']];
  return `
  <section class="card sec-types" aria-labelledby="types-h">
    <div class="card-head"><div>
      <h2 id="types-h">Видове престъпления, 2025 г.</h2>
      <p class="muted">Дял от 70 075 регистрирани криминални престъпления</p>
    </div></div>
    ${barList([
      { label: 'Против собствеността', value: 44.7, display: '<strong>44,7%</strong> · 31 298', sub: 'от тях кражби: 24 091' },
      { label: 'Общоопасни', value: 32.3, display: '<strong>32,3%</strong> · 22 654', sub: 'от тях транспортни: 9 493 · наркотици: 7 503' },
      { label: 'Против личността', value: 11.3, display: '<strong>11,3%</strong> · 7 933' },
      { label: 'Други', value: 11.7, display: '<strong>11,7%</strong>' },
    ])}
    <div class="sec-change">
      <h3>Промяна 2015 → 2025</h3>
      <table class="data sec-change-table">
        <thead><tr><th scope="col">Престъпление</th><th scope="col">2015</th><th scope="col">2025</th></tr></thead>
        <tbody>${change.map(([k, a, b]) => `<tr><th scope="row">${esc(k)}</th><td>${a}</td><td><strong>${b}</strong></td></tr>`).join('')}</tbody>
      </table>
    </div>
    <p class="source">Източник: МВР, полицейска статистика.</p>
  </section>`;
}

export default {
  id: 'security',
  eyebrow: 'Раздел · Сигурност и МВР',
  title: 'Как се справя полицията — година по година',
  lead: 'Престъпност, разкриваемост, безопасност на пътя, численост и разходи от 2015 г. насам.',
  summary: [
    'Регистрираните престъпления намаляват с 30% от 2015 г., а разкриваемостта расте до 54,2% (2025).',
    'Загиналите на пътя са 478 (2024) при 708 през 2015 г.',
    'Полицаите са около 0,45% от населението; щатните бройки в цялото МВР — около 0,8% (заетите места — около 0,73%).',
  ],
  map: { metrics: ['crimesK', 'clear'], drivesPage: true },
  defaultYear: 2025,
  defaultMetric: 'clearance',
  order: ['clearance', 'crimes', 'roads', 'police', 'staff', 'spend'],
  metrics: {
    clearance: {
      label: 'Разкриваемост', tab: 'Разкриваемост', d: 1, suffix: '%', good: 'up', pp: true,
      values: CLEARANCE,
      sub: 'Дял на криминалните престъпления с установен извършител',
      source: 'МВР, годишни бюлетини „Полицейска статистика“',
      reg: (r) => ({ values: SERIES.clear[r], cmp: CLEARANCE, sub: 'Дял на престъпленията с установен извършител (ОДМВР)', source: 'МВР, полицейска статистика по области' }),
    },
    crimes: {
      label: 'Регистрирани престъпления', tab: 'Престъпления', d: 0, suffix: '', good: 'down',
      values: CRIMES,
      sub: 'Регистрирани криминални престъпления за годината',
      source: 'МВР, годишни бюлетини „Полицейска статистика“',
      note: (v, i) => 'С икономическите: ' + fmt(CRIM_ALL[i], 0),
      reg: (r) => ({
        label: 'Престъпления на 1000 души', tab: 'Престъпления', d: 1, suffix: '',
        values: SERIES.crimes[r].map((v, i) => (v == null ? null : (v / SERIES.pop[r][i]) * 1000)),
        cmp: CRIMES.map((v, i) => (v / POPULATION[i]) * 1000),
        note: (v, i) => fmt(SERIES.crimes[r][i], 0) + ' регистрирани',
        sub: 'Регистрирани престъпления на 1000 жители', source: 'МВР; НСИ (изчислено)',
      }),
    },
    roads: {
      label: 'Загинали при ПТП', tab: 'Загинали на пътя', d: 0, suffix: '', good: 'down',
      values: [708, 708, 682, 610, 628, 463, 561, 531, 525, 478, null],
      sub: 'Загинали при пътнотранспортни произшествия', source: 'Евростат, tran_sf_roadus',
    },
    police: {
      label: 'Полицаи, % от населението', tab: 'Полицаи, % от населението', d: 3, suffix: '%', good: 'none', pp: true,
      values: [0.31192, 0.42543, 0.39847, 0.40769, 0.41098, 0.41962, 0.44575, 0.44427, 0.45163, 0.45232, null],
      sub: 'Полицейски служители като дял от населението (без останалите служители на МВР)', source: 'Евростат, crim_just_job',
      note: (v, i) => (OFFICERS[i] == null ? '' : fmt(OFFICERS[i], 0) + ' полицаи'),
    },
    staff: {
      label: 'Щатни бройки в МВР, % от населението', tab: 'Щатни бройки в МВР, %', d: 3, suffix: '%', good: 'none', pp: true,
      values: [null, null, 0.86765, null, null, null, null, null, null, 0.80016, null],
      sub: 'Всички щатни бройки в МВР (полиция, Гранична полиция, пожарна, администрация, трудови договори) като дял от населението. МВР не публикува числеността всяка година.',
      source: 'МВР, щатна численост; НСИ, население към 31.12',
      note: (v, i) => ({ 2: '61 170 щатни бройки (май 2017)', 9: '51 509 щатни бройки (края на 2024)' })[i] || '',
    },
    spend: {
      label: 'Разходи за полиция, млн. €', tab: 'Разходи за полиция', d: 0, suffix: '', good: 'none', money: true,
      values: [611.3, 517.2, 633.2, 680.4, 805.4, 829.3, 963.0, 1127.9, 1215.0, 1467.7, null],
      sub: 'Разходи на държавата за полицейски услуги (COFOG 03.1), млн. €', source: 'Евростат, gov_10a_exp',
      note: (v, i) => (GF03PCT[i] == null ? '' : 'Обществен ред и сигурност общо: ' + fmt(GF03PCT[i], 1) + '% от БВП'),
    },
  },
  actions: {
    sort: (el, { state, update }) => update({ ui: { ...state.ui, security: { ...(state.ui.security || {}), sort: el.dataset.sort } } }),
  },
  sections: [
    staffSection,
    (ctx) => `<div class="split sec-split">${regionsSection(ctx)}${typesSection()}</div>`,
  ],
  method: [
    { title: 'Регистрирани ≠ извършени', text: 'Статистиката отчита само престъпленията, за които полицията е узнала. Показваме криминалните престъпления. С икономическите общият брой за 2025 г. е 80 885.' },
    { title: 'Какво е разкриваемост', text: 'Делът на престъпленията с установен извършител. Не показва колко дела стигат до осъдителна присъда.' },
    { title: 'Полицаи по Евростат', text: 'Броят полицейски служители е по класификацията на Евростат. Стойността за 2015 г. е необичайно ниска спрямо съседните години, но Евростат не я отбелязва като грешна.' },
  ],
  sourcesNote: 'Сумите са в евро. Данните за 2025 г. от Евростат още не са публикувани за всички показатели.',
  sources: [
    { href: 'https://www.mvr.bg/programni-dokumenti-otcheti-analizi/%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0/%D0%B3%D0%BE%D0%B4%D0%B8%D1%88%D0%B5%D0%BD-%D0%B1%D1%8E%D0%BB%D0%B5%D1%82%D0%B8%D0%BD-%D0%BF%D0%BE%D0%BB%D0%B8%D1%86%D0%B5%D0%B9%D1%81%D0%BA%D0%B0-%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0', title: 'МВР — полицейска статистика', text: 'Престъпления и разкриваемост, по области' },
    { href: 'https://ec.europa.eu/eurostat/databrowser/view/crim_just_job/default/table', title: 'Евростат — crim_just_job', text: 'Полицейски служители' },
    { href: 'https://ec.europa.eu/eurostat/databrowser/view/tran_sf_roadus/default/table', title: 'Евростат — tran_sf_roadus', text: 'Загинали на пътя' },
    { href: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table', title: 'Евростат — gov_10a_exp', text: 'Разходи за полиция и обществен ред' },
    { href: 'https://clubz.bg/160988', title: 'Club Z / МВР', text: 'Щатна численост, края на 2024 г.' },
    { href: 'https://www.segabg.com/hot/category-economy/mo-i-mvr-se-izpraviha-pred-nerazreshima-zadacha-zaplatite', title: '„Сега“', text: 'Щатни и незаети места, 2026 г.' },
  ],
};
