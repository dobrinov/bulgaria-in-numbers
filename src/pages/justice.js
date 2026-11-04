// Правосъдие — ВСС, НСИ, Евростат, Transparency International.
import './justice.css';
import { YEARS, fmt } from '../lib/format.js';

const PRIS = [7408, 7345, 6988, 6651, 6448, 6251, 5873, 5577, 5526, 5440, null];
const JUDG = [2225, 2255, 2235, 2223, 2215, 2185, 2192, 2188, 2234, 2280, null];
const CONV = [27787, 28301, 25800, 23973, 23389, 21889, 24121, 24047, 23037, 21821, null];
const CPIRANK = ['27', '27', '27', '27', '27', '25–27', '27', '26', '26', '26', '26–27'];
// ВСС: дела за разглеждане, свършени, свършени до 3 месеца
const ALL = [676830, 686483, 738687, 719079, 722265, 644441, 682873, 639903, 650399, 680513, 673571];
const DONE = [567498, 574983, 617909, 590267, 588132, 508023, 550209, 511632, 527613, 551304, 544035];
const FAST = [480632, 471557, 519448, 491163, 479556, 417062, 441718, 409262, 422263, 451701, 442176];

function courtsSection(ctx) {
  const mx = Math.max(...ALL);
  const w = (v) => ((v / mx) * 100).toFixed(1) + '%';
  return `
  <section class="card" aria-labelledby="courts-h">
    <div class="card-head"><div>
      <h2 id="courts-h">Натовареност на съдилищата</h2>
      <p class="muted">Дела за разглеждане и свършени дела годишно — апелативни, окръжни, районни, военни и административни съдилища (без ВКС и ВАС).</p>
    </div></div>
    <p class="legend">
      <span><i class="sw" style="background:#A9C1F5"></i>За разглеждане</span>
      <span><i class="sw" style="background:var(--accent)"></i>Свършени</span>
      <span><i class="sw" style="background:var(--ink)"></i>Свършени до 3 месеца</span>
    </p>
    <ol class="jus-courts">${YEARS.map((y, i) => `
      <li${y === ctx.year ? ' class="is-on"' : ''}>
        <span class="num">${y}</span>
        <span class="jus-bar" aria-hidden="true">
          <span style="width:${w(ALL[i])};background:#A9C1F5"></span>
          <span style="width:${w(DONE[i])};background:var(--accent)"></span>
          <span style="width:${w(FAST[i])};background:var(--ink)"></span>
        </span>
        <span class="num"><strong>${fmt(DONE[i], 0)}</strong> от ${fmt(ALL[i], 0)}</span>
      </li>`).join('')}</ol>
    <p class="source">Източник: Висш съдебен съвет, обобщени статистически таблици за всяка година.</p>
  </section>`;
}

export default {
  id: 'justice',
  eyebrow: 'Държава · Правосъдие',
  title: 'Съдилища, присъди и доверие',
  lead: 'Колко дела гледат съдилищата и колко бързо, колко души се осъждат и лежат в затвора, и колко вярват хората в независимостта на съда.',
  summary: [
    'Само 27% от хората смятат съдилищата за независими (2025) — при 54% средно за ЕС.',
    'Индексът за възприятие на корупцията е 40 от 100 — последно или предпоследно място в ЕС.',
    'Около 81% от свършените дела са приключили до 3 месеца (включително бързите заповедни производства).',
  ],
  map: { metrics: ['conv', 'crimesK', 'clear'] },
  defaultYear: 2024,
  defaultMetric: 'trust',
  order: ['trust', 'cpi', 'fast', 'conv', 'bribe', 'prison', 'judges'],
  metrics: {
    trust: {
      label: 'Доверие в независимостта на съда', d: 0, suffix: '%', good: 'up', pp: true,
      values: [null, 23, 26, 30, 34, 37, 31, 31, 30, 24, 27], eu: [null, 50, 54, 54, 54, 54, 54, 53, 53, 52, 54], euLabel: 'Средно за ЕС',
      sub: 'Дял на хората, които оценяват независимостта на съда като добра', source: 'Евростат, sdg_16_40 (Евробарометър)',
    },
    cpi: {
      label: 'Индекс за възприятие на корупцията', d: 0, suffix: '', good: 'up', pp: true,
      values: [41, 41, 43, 42, 43, 44, 42, 43, 45, 43, 40], eu: [65.0, 64.0, 64.0, 64.1, 63.9, 63.7, 63.7, 63.6, 63.6, 62.3, 62.2], euLabel: 'Средно за ЕС',
      sub: 'Скала 0–100, по-високо = по-малко корупция (неправителствен индекс)', source: 'Transparency International, CPI',
      note: (v, i) => 'Място в ЕС: ' + CPIRANK[i] + ' от 27',
    },
    fast: {
      label: 'Дела, свършени до 3 месеца', d: 0, suffix: '%', good: 'up', pp: true,
      values: FAST.map((v, i) => (v / DONE[i]) * 100),
      sub: 'Дял на делата, свършени в срок до 3 месеца, от всички свършени', source: 'Висш съдебен съвет',
      note: (v, i) => fmt(DONE[i], 0) + ' свършени дела',
    },
    conv: {
      label: 'Осъдени на 100 000 души', d: 0, suffix: '', good: 'none',
      values: [385.8, 395.6, 363.3, 340.0, 334.1, 314.9, 348.7, 371.0, 357.3, 338.6, null],
      sub: 'Лица с влязла в сила присъда на 100 000 жители', source: 'НСИ; Евростат, crim_just_sex',
      note: (v, i) => (CONV[i] == null ? '' : fmt(CONV[i], 0) + ' осъдени'),
    },
    bribe: {
      label: 'Осъдени за подкуп', d: 0, suffix: '', good: 'none',
      values: [78, 119, 111, 136, 108, 81, 83, 58, 86, 60, null],
      sub: 'Осъдени по чл. 301–307 от Наказателния кодекс', source: 'НСИ, Престъпления и осъдени лица',
    },
    prison: {
      label: 'Затворници на 100 000 души', d: 0, suffix: '', good: 'none',
      values: [102.86, 102.67, 98.40, 94.34, 92.11, 89.92, 84.91, 81.55, 85.70, 84.40, null],
      sub: 'Лишени от свобода на 100 000 жители', source: 'Евростат, crim_pris_age',
      note: (v, i) => (PRIS[i] == null ? '' : fmt(PRIS[i], 0) + ' затворници'),
    },
    judges: {
      label: 'Съдии на 100 000 души', d: 1, suffix: '', good: 'none',
      values: [30.89, 31.52, 31.47, 31.53, 31.64, 31.43, 31.69, 33.75, 34.65, 35.37, null],
      sub: 'Професионални съдии на 100 000 жители', source: 'Евростат, crim_just_job',
      note: (v, i) => (JUDG[i] == null ? '' : fmt(JUDG[i], 0) + ' съдии'),
    },
  },
  sections: [courtsSection],
  method: [
    { title: 'Индекс за възприятие на корупцията', text: 'Изготвя се от неправителствената организация „Прозрачност без граници“, не от официалната статистика. Скала 0–100: по-високо значи по-малко корупция.' },
    { title: 'Доверие в съда', text: 'Дял на хората, които оценяват независимостта на съдилищата като „много“ или „доста добра“ — Евробарометър, използван в Европейското табло за правосъдието. Годината е на проучването.' },
    { title: 'Осъдени за подкуп', text: 'Няма официална категория „корупция“. Най-близкият показател са осъдените по чл. 301–307 от Наказателния кодекс (подкуп).' },
  ],
  sourcesNote: 'ВСС, НСИ, Евростат, „Прозрачност без граници“.',
  sources: [
    { href: 'https://vss.justice.bg/page/view/1082', title: 'Висш съдебен съвет — статистика', text: 'Натовареност на съдилищата' },
    { href: 'https://www.nsi.bg/en/file/32003/CRIMES2024.pdf', title: 'НСИ — Престъпления и осъдени лица', text: 'Осъдени, включително за подкуп' },
    { href: 'https://ec.europa.eu/eurostat/databrowser/view/crim_pris_age/default/table', title: 'Евростат — crim_pris_age, crim_just_job, sdg_16_40', text: 'Затвори, съдии, доверие в съда' },
    { href: 'https://www.transparency.org/en/cpi/2025', title: 'Transparency International — CPI', text: 'Индекс за възприятие на корупцията' },
  ],
};
