// Данъци — Евростат, НОИ, НАП.
import './taxes.css';
import { stackedBar } from '../lib/charts.js';
import { YEARS, POPULATION, fmt } from '../lib/format.js';

// Евростат gov_10a_taxag, сектор S13_S212, млн. €
const T = {
  total: [13219, 14228, 15667, 16682, 18677, 18789, 21889, 26736, 28341, 31907, 35622],
  pct: [28.9, 29.2, 29.8, 29.7, 30.5, 30.3, 30.7, 31.0, 29.8, 30.3, 30.6],
  vat: [4046, 4417, 4873, 5128, 5656, 5635, 6671, 7786, 8324, 9749, 11122],
  pit: [1404, 1533, 1762, 1879, 2056, 2152, 2402, 2672, 3159, 3606, 4270],
  cit: [997, 1089, 1210, 1267, 1415, 1325, 2022, 2509, 2726, 3038, 3258],
  excise: [2414, 2495, 2576, 2506, 2838, 2742, 2951, 2874, 3341, 3507, 3787],
  social: [3562, 3768, 4324, 4865, 5427, 5625, 6296, 7098, 8055, 9285, 10638],
  customs: [74, 99, 94, 121, 114, 109, 217, 221, 170, 169, 195],
};
const bn = (xs) => xs.map((v) => v / 1000);
const SRC = 'Евростат, gov_10a_taxag (данъци и осигуровки, сектор „Държавно управление“)';
const mk = (label, tab, key, sub) => ({ label, tab, d: 2, suffix: '', good: 'none', values: bn(T[key]), source: SRC, sub });

// [данък, ставка, кой го плаща, проверка, вид на значката]
const RATES = [
  ['Данък върху доходите на физическите лица', '10%', 'Всеки с облагаем доход: заплата, наем, хонорари. Плосък данък, без необлагаем минимум.', 'НАП', 'official'],
  ['Корпоративен данък', '10%', 'Фирмите, върху печалбата. Непроменен от 2007 г.', 'ОИСР', 'official'],
  ['ДДС', '20% · 9%', 'Всички, чрез цените на стоките и услугите. 9% за хотелиерство, а също за книги и бебешки храни.', '9% — за проверка', 'estimate'],
  ['Данък върху дивидентите', '5%', 'Собствениците на дялове, при разпределяне на печалба.', 'За проверка', 'estimate'],
  ['Осигуровки — работник', '13,78%', 'Наетите по трудов договор (III категория, родени след 1959 г.): ДОО 8,38% + УПФ 2,2% + здравни 3,2%.', 'НОИ, НАП', 'official'],
  ['Осигуровки — работодател', '18,52% + ТЗПБ', 'Работодателят: ДОО 10,92% + УПФ 2,8% + здравни 4,8%, плюс вноска за трудова злополука според дейността.', 'НОИ, НАП', 'official'],
  ['Акцизи и мита', 'по вид стока', 'Всички, чрез цената на горива, тютюн, алкохол, ток. Митата — при внос извън ЕС.', '—', 'national'],
];

// Осигурени лица (НОИ, отчет за ДОО 2024), % от населението към 31.12.2024 г.
const WHO = [
  ['Всички осигурени', 44.0, '44,0%', '2 831 696 души'],
  ['По трудов договор', 37.6, '37,6%', '2 420 370 души'],
  ['Самоосигуряващи се', 3.8, '3,8%', '245 015 души'],
  ['Държавни служители по Закона за държавния служител', 1.0, '1,0%', '63 622 души'],
];

function revenueMix({ yi }) {
  const total = T.total[yi];
  const parts = [
    ['ДДС', T.vat[yi], '#163A9E'],
    ['Осигуровки', T.social[yi], '#5B84E8'],
    ['Данък върху доходите', T.pit[yi], '#A9C1F5'],
    ['Корпоративен данък', T.cit[yi], '#0F1B2D'],
    ['Акцизи', T.excise[yi], '#B45309'],
    ['Мита', T.customs[yi], '#E8A867'],
  ];
  const named = parts.reduce((s, p) => s + p[1], 0);
  parts.push(['Други данъци', total - named, '#C5CCD8']);
  return `
  <section class="card" aria-labelledby="mix-h">
    <div class="card-head"><div>
      <h2 id="mix-h">От какво идват приходите, ${YEARS[yi]} г.</h2>
      <p class="muted">Дял от всички данъци и осигуровки: <strong class="num">${fmt(total / 1000, 2)} млрд. €</strong></p>
    </div></div>
    ${stackedBar(parts.map(([label, value, color]) => ({ label, value, color })))}
    <ul class="tax-parts">${parts.map(([name, v, color]) => `
      <li><i class="sw" style="background:${color}" aria-hidden="true"></i><span>${name}</span>
        <span class="num"><strong>${fmt((v / total) * 100, 1)}%</strong> · ${fmt(v / 1000, 2)} млрд. €</span></li>`).join('')}
    </ul>
    <p class="source">Източник: Евростат, gov_10a_taxag. Митата отиват предимно в бюджета на ЕС.</p>
  </section>`;
}

const rates = () => `
  <section class="card" aria-labelledby="rates-h">
    <div class="card-head"><div>
      <h2 id="rates-h">Ставки, 2025 г.</h2>
      <p class="muted">Колко е всеки данък и кой го плаща.</p>
    </div></div>
    <div class="table-scroll">
      <table class="data tax-rates">
        <thead><tr>
          <th scope="col">Данък</th><th scope="col">Ставка</th><th scope="col">Кой го плаща</th><th scope="col">Проверка</th>
        </tr></thead>
        <tbody>${RATES.map(([name, rate, who, check, kind]) => `
          <tr>
            <th scope="row">${name}</th>
            <td class="num">${rate}</td>
            <td>${who}</td>
            <td><span class="badge badge-${kind}">${check}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;

const whoPays = () => `
  <section class="stack" aria-labelledby="who-h">
    <div class="card-head"><div>
      <h2 id="who-h">Кой плаща, 2024 г.</h2>
      <p class="muted">Осигурени лица в държавното обществено осигуряване (средно месечно) като дял от населението към 31.12.2024 г. (6 437 360 души). ДДС и акцизите плащат всички чрез цените.</p>
    </div></div>
    <div class="tax-who">${WHO.map(([label, pct, share, people]) => `
      <div class="card card-sm">
        <span class="tax-who-label">${label}</span>
        <span class="tax-who-value num">${share}</span>
        <span class="muted small num">${people}</span>
        <span class="bar" aria-hidden="true"><span style="width:${pct}%"></span></span>
      </div>`).join('')}
    </div>
    <div class="tax-facts">
      <span><strong class="num">70,0</strong> пенсии на 100 осигурени (2024 г.)</span>
      <span>Подадени декларации за доходите: <strong>[БРОЙ]</strong> — очаква данни от НАП</span>
      <span>Фирми, платили корпоративен данък: <strong>[БРОЙ]</strong> — очаква данни от НАП</span>
    </div>
    <span class="badge badge-official">Официални данни · НОИ, отчет за ДОО 2024; НСИ, население</span>
  </section>`;

export default {
  id: 'taxes',
  eyebrow: 'Раздел · Данъци',
  title: 'Колко данъци плащаме и кой ги плаща',
  lead: 'Ставки, събрани приходи по видове данъци и колко хора плащат осигуровки.',
  summary: [
    'Данъците и осигуровките носят 35,6 млрд. € (2025), или 30,6% от БВП.',
    'Най-голям е приходът от ДДС — 31% от всички, следван от осигуровките (30%).',
    'Данъкът върху доходите и корпоративният данък са плоски — по 10%.',
  ],
  map: { metrics: ['ent', 'wage'] },
  defaultYear: 2025,
  defaultMetric: 'total',
  kpiTitle: (y) => `Събрани приходи за ${y} г.`,
  order: ['total', 'pct', 'vat', 'social', 'pit', 'cit', 'excise'],
  metrics: {
    total: {
      ...mk('Всички приходи, млрд. €', 'Общо', 'total', 'Данъци и осигуровки общо, млрд. €'),
      note: (v, yi) => '≈ ' + fmt((v * 1e9) / POPULATION[yi], 0) + ' € на човек',
    },
    pct: {
      label: 'Данъчна тежест, % от БВП', tab: '% от БВП', d: 1, suffix: '%', good: 'none', pp: true,
      values: T.pct, source: SRC, sub: 'Всички данъци и осигуровки като дял от БВП',
    },
    vat: mk('ДДС, млрд. €', 'ДДС', 'vat', 'Приходи от данък добавена стойност, млрд. €'),
    social: mk('Осигуровки, млрд. €', 'Осигуровки', 'social', 'Социални и здравни осигуровки, млрд. €'),
    pit: mk('Данък върху доходите, млрд. €', 'Данък върху доходите', 'pit', 'Данък върху доходите на физическите лица, млрд. €'),
    cit: mk('Корпоративен данък, млрд. €', 'Корпоративен', 'cit', 'Данък върху печалбата на фирмите, млрд. €'),
    excise: mk('Акцизи, млрд. €', 'Акцизи', 'excise', 'Акцизи върху горива, тютюн, алкохол и др., млрд. €'),
  },
  sections: [revenueMix, rates, whoPays],
  method: [
    { title: 'Данъци и осигуровки заедно', text: '„Всички приходи“ включват данъците и социалните и здравните осигуровки по методологията на Евростат.' },
    { title: 'Осигурени ≠ данъкоплатци', text: 'Броят осигурени е най-близкият официален показател за това колко хора плащат данък върху доходите. Пенсионерите, учениците и безработните не са осигурени, но плащат ДДС и акцизи.' },
    { title: 'На човек', text: 'Сумата на човек е общият приход, разделен на населението към края на годината по НСИ.' },
  ],
  sourcesNote: 'Приходите са в евро по данни на Евростат. Данните на Министерството на финансите в лева ще бъдат добавени при следващото обновяване.',
  sources: [
    { href: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_taxag/default/table', title: 'Евростат — gov_10a_taxag', text: 'Данъчни приходи по вид' },
    { href: 'https://nssi.bg/wp-content/uploads/DOO_2024.pdf', title: 'НОИ — отчет за ДОО 2024', text: 'Осигурени лица' },
    { href: 'https://nssi.bg/wp-content/uploads/Trudov_dogovor_vnoski.pdf', title: 'НОИ — осигурителни вноски', text: 'Ставки по години' },
    { href: 'https://nra.bg/wps/wcm/connect/agency/site/taxes/danak-vurhu-dohodite-na-fizicheski-lica', title: 'НАП', text: 'Данък върху доходите, здравни вноски' },
  ],
};
