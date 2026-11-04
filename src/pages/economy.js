// Икономика — Евростат, НСИ, НОИ.
import './economy.css';
import { SERIES } from '../data/oblasts.js';
import { barList, stackedBar } from '../lib/charts.js';
import { YEARS, EUR, POPULATION, fmt } from '../lib/format.js';

const toEur = (xs) => xs.map((v) => v / EUR);

// БВП в текущи цени, млрд. € (Евростат, nama_10_gdp) — винаги за цялата страна.
const GDP = [45.797, 48.751, 52.501, 56.076, 61.179, 62.003, 71.400, 86.336, 95.101, 105.279, 116.549];
const UNEMP = [10.1, 8.6, 7.2, 6.2, 5.2, 6.1, 5.2, 4.2, 4.3, 4.2, 3.5];
const WAGE = toEur([878, 948, 1037, 1146, 1267, 1391, 1561, 1770, 2040, 2325, 31239 / 12]);

// Евростат nama_10_gdp, % от БВП
const HH = [61.5, 59.9, 59.7, 59.0, 58.6, 57.5, 57.5, 57.5, 56.8, 56.6, 57.3];
const GOVC = [16.1, 15.6, 15.6, 16.5, 16.8, 19.3, 18.9, 18.2, 18.4, 19.7, 21.0];
const INV = [21.0, 19.0, 19.8, 21.3, 20.7, 20.3, 20.8, 22.7, 19.7, 20.3, 22.4];
const EXPO = [63.8, 63.9, 67.0, 65.8, 64.3, 56.3, 61.8, 69.8, 62.2, 56.6, 50.8];
const IMPO = [63.0, 58.9, 62.6, 63.2, 61.0, 53.8, 59.3, 68.7, 57.5, 53.6, 51.9];

// Евростат nama_10_a10, % от брутната добавена стойност
const AGR = [4.7, 4.7, 4.7, 3.9, 3.7, 4.4, 6.2, 4.2, 2.9, 2.7, 2.8];
const IND = [23.5, 24.5, 23.8, 21.9, 21.1, 21.0, 17.4, 22.4, 21.2, 19.5, 18.7];
const MAN = [15.8, 16.7, 16.3, 15.7, 15.9, 15.5, 10.7, 11.9, 15.1, 14.4, 13.1];
const CON = [4.4, 3.9, 4.1, 4.2, 4.4, 4.3, 3.8, 4.5, 4.8, 4.8, 5.5];
const SRV = [67.4, 66.9, 67.4, 70.0, 70.8, 70.3, 72.6, 68.9, 71.1, 73.0, 73.0];

const sgn = (v, d) => (v < 0 ? '−' : '') + fmt(Math.abs(v), d);

function expenditure({ yi }) {
  const gdp = GDP[yi];
  const parts = [
    ['Потребление на домакинствата', HH[yi], '#163A9E'],
    ['Потребление на държавата', GOVC[yi], '#5B84E8'],
    ['Инвестиции (вкл. запаси)', INV[yi], '#A9C1F5'],
    ['Нетен износ (износ − внос)', EXPO[yi] - IMPO[yi], '#B45309'],
  ];
  const sum = parts.reduce((s, p) => s + p[1], 0);
  parts.push(['Други (нетърговски организации, стат. разлика)', 100 - sum, '#C5CCD8']);
  const rows = parts.map(([label, s, color]) => ({
    label, value: s, color, swatch: color,
    display: `<strong>${sgn(s, 1)}%</strong> · ${sgn((s * gdp) / 100, 1)} млрд. €`,
  }));
  return `
  <section class="card" aria-labelledby="exp-h">
    <div class="card-head"><div>
      <h2 id="exp-h">За какво се харчи БВП, ${YEARS[yi]} г.</h2>
      <p class="muted">Дял от БВП и сума от общо <strong class="num">${fmt(gdp, 1)} млрд. €</strong></p>
    </div></div>
    ${barList(rows)}
    <p class="source num">Износ ${fmt(EXPO[yi], 1)}% · Внос ${fmt(IMPO[yi], 1)}% от БВП. Източник: Евростат, nama_10_gdp.</p>
  </section>`;
}

function sectors({ yi }) {
  const parts = [
    ['Услуги', SRV[yi], '#163A9E'],
    ['Промишленост (без строителство)', IND[yi], '#5B84E8'],
    ['Строителство', CON[yi], '#B45309'],
    ['Селско стопанство, гори, риба', AGR[yi], '#E8A867'],
  ];
  return `
  <section class="card" aria-labelledby="sec-h">
    <div class="card-head"><div>
      <h2 id="sec-h">Кои сектори го създават, ${YEARS[yi]} г.</h2>
      <p class="muted">Дял от брутната добавена стойност</p>
    </div></div>
    ${stackedBar(parts.map(([label, value, color]) => ({ label, value, color })))}
    <ul class="eco-parts">${parts.map(([name, s, color]) => `
      <li><i class="sw" style="background:${color}" aria-hidden="true"></i><span>${name}</span><strong class="num">${fmt(s, 1)}%</strong></li>`).join('')}
    </ul>
    <p class="source num">От промишлеността преработващата е ${fmt(MAN[yi], 1)}%. Услугите са изчислени като остатък. Източник: Евростат, nama_10_a10.</p>
  </section>`;
}

export default {
  id: 'economy',
  eyebrow: 'Раздел · Икономика',
  title: 'Растеж, работа, цени и заплати',
  lead: 'Брутен вътрешен продукт, безработица, инфлация и средна заплата от 2015 г. насам. Сумите са в евро.',
  summary: [
    'БВП е 116,5 млрд. € (2025) — 2,5 пъти повече от 2015 г. в текущи цени.',
    'Безработицата е 3,5% — най-ниската за периода.',
    'Инфлацията стигна 13% през 2022 г. и падна до 3,5% през 2025 г.',
  ],
  map: { metrics: ['gdp', 'unemp', 'wage', 'ent'], drivesPage: true },
  defaultYear: 2025,
  defaultMetric: 'gdp',
  order: ['gdp', 'unemployment', 'inflation', 'wage', 'maxIns'],
  metrics: {
    gdp: {
      label: 'БВП, млрд. €', tab: 'БВП', d: 1, suffix: '', good: 'up',
      values: GDP,
      sub: 'Брутен вътрешен продукт в текущи цени, млрд. евро', source: 'Евростат, nama_10_gdp (2024–2025 г. може да бъдат ревизирани)',
      reg: (r) => ({
        label: 'БВП на човек', tab: 'БВП на човек', values: SERIES.gdp[r], d: 0, suffix: ' €',
        cmp: GDP.map((v, i) => (v * 1e9) / POPULATION[i]), cmpLabel: 'България (изчислено)',
        sub: 'БВП на човек в евро', source: 'Евростат, nama_10r_3gdp',
      }),
    },
    unemployment: {
      label: 'Безработица', tab: 'Безработица', d: 1, suffix: '%', good: 'down', pp: true,
      values: UNEMP,
      sub: 'Коефициент на безработица, 15–74 г. (прекъсване на реда в 2019 и 2024 г.)', source: 'Евростат, une_rt_a (Наблюдение на работната сила)',
      reg: (r) => ({
        values: SERIES.unemp[r], cmp: UNEMP,
        note: (v, i) => (SERIES.unempFlag[r][i] ? '* малка извадка — ненадеждно (НСИ)' : ''),
        sub: 'Коефициент на безработица в областта', source: 'НСИ, Наблюдение на работната сила по области',
      }),
    },
    inflation: {
      label: 'Инфлация', tab: 'Инфлация', d: 1, suffix: '%', good: 'down', pp: true, signed: true,
      values: [-1.1, -1.3, 1.2, 2.6, 2.5, 1.2, 2.8, 13.0, 8.6, 2.6, 3.5],
      sub: 'Средногодишна промяна на хармонизирания индекс на потребителските цени (ХИПЦ)', source: 'Евростат, prc_hicp_aind',
    },
    wage: {
      label: 'Средна заплата, €', tab: 'Заплата', d: 0, suffix: ' €', good: 'up',
      values: WAGE,
      sub: 'Средна месечна брутна заплата, евро. 2025 г.: предварителната годишна заплата на НСИ (31 239 лв.), разделена на 12', source: 'НСИ, Статистически годишник 2025 и справочник 2026',
      reg: (r) => ({
        values: SERIES.wageBgn[r].map((v) => (v == null ? null : v / 12 / EUR)), cmp: WAGE,
        sub: 'Средна брутна заплата, € на месец (годишната, разделена на 12)', source: 'НСИ, наети и заплати по области',
      }),
    },
    maxIns: {
      label: 'Максимален осигурителен доход, €', tab: 'Макс. осигурителен доход', d: 0, suffix: ' €', good: 'none',
      values: toEur([2600, 2600, 2600, 2600, 3000, 3000, 3000, 3400, 3400, 3750, 4130]),
      sub: 'Месечен таван на осигурителния доход, в сила към 31 декември (преизчислен от лева)',
      source: 'Закон за бюджета на ДОО за съответната година; НОИ',
    },
  },
  // Структурата на БВП е само за цялата страна.
  sections: [(ctx) => `<div class="split">${expenditure(ctx)}${sectors(ctx)}</div>`],
  method: [
    { title: 'Дълг и ревизии', text: 'НСИ преразглежда дълга за минали години. Показваме последната публикувана стойност за всяка година.' },
    { title: 'Номинални стойности', text: 'БВП и заплатите са в текущи цени. Част от ръста им идва от инфлацията, затова ги сравнявайте с нея.' },
    { title: 'Безработица', text: 'Коефициентът е по Наблюдението на работната сила на НСИ, а не по регистрите на бюрата по труда.' },
    { title: 'Лева и евро', text: 'Всички суми са в евро. Стойностите до 2025 г. са преизчислени от лева по фиксирания курс 1,95583 лв. за 1 €.' },
  ],
  sourcesNote: 'Тримесечните данни се обновяват след всяка публикация на НСИ.',
  sources: [
    { href: 'https://www.nsi.bg/en/press-release/notification-tables-for-debt-and-deficit-for-general-government-sector-2024-final-data-8820', title: 'НСИ — дефицит и дълг', text: 'Дълг на сектор „Държавно управление“' },
    { href: 'https://www.nsi.bg', title: 'НСИ', text: 'БВП, работна сила, инфлация, заплати' },
    { href: 'https://www.nssi.bg', title: 'НОИ', text: 'Максимален осигурителен доход' },
    { href: 'https://ec.europa.eu/eurostat', title: 'Евростат', text: 'Сравнение с другите държави в ЕС' },
  ],
};
