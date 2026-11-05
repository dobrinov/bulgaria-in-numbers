// Заплати по сектори: държавни (обществен сектор) срещу частни работодатели, НСИ, 2020–2024.
// Използва се в „Доходи“ и „Администрация“.
import { SECTOR_YEARS, SECTORS, EMPLOYEES, ANNUAL_WAGE_BGN } from '../data/sectors.js';
import { EUR, fmt, esc } from '../lib/format.js';

const PUB_COLOR = '#163A9E';
const PRIV_COLOR = '#0F766E';
const SMALL = 1000; // под толкова наети средната заплата е неустойчива
const GOV = SECTORS.indexOf('Държавно управление и отбрана');

const monthly = (annualBgn) => (annualBgn == null ? null : annualBgn / 12 / EUR);
const pct = (a, b) => ((a - b) / b) * 100;
const lower = (name) => (name[1] && name[1] === name[1].toLowerCase() ? name[0].toLowerCase() + name.slice(1) : name);
const signedPct = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), 0) + '%';

function rowsFor(year) {
  const E = EMPLOYEES[year], W = ANNUAL_WAGE_BGN[year];
  return SECTORS.map((name, i) => ({
    i, name,
    emp: E[i][0], pubEmp: E[i][1], privEmp: E[i][2],
    wage: monthly(W[i][0]), pub: monthly(W[i][1]), priv: monthly(W[i][2]),
  }));
}

const SORTS = {
  gap: { label: 'Разлика държавни − частни', key: (r) => (r.pub != null && r.priv != null ? pct(r.pub, r.priv) : -Infinity) },
  pubEmp: { label: 'Брой наети в държавни', key: (r) => r.pubEmp ?? 0 },
  wage: { label: 'Заплата', key: (r) => Math.max(r.pub ?? 0, r.priv ?? 0) },
};

/** Кратки изводи, изчислени от данните за годината. */
function facts(rows, year) {
  const all = rows[0];
  const gov = rows[GOV];
  const comparable = rows.slice(1).filter((r) => r.pub != null && r.priv != null && r.pubEmp >= SMALL && r.privEmp >= SMALL);
  const stateMore = comparable.filter((r) => r.pub > r.priv).sort((a, b) => pct(b.pub, b.priv) - pct(a.pub, a.priv)).slice(0, 3);
  const privMore = comparable.filter((r) => r.priv > r.pub).sort((a, b) => pct(b.priv, b.pub) - pct(a.priv, a.pub)).slice(0, 3);
  const first = rowsFor(SECTOR_YEARS[0]);
  const out = [
    `Средно държавните работодатели плащат <strong>${fmt(all.pub, 0)} €</strong>, а частните — <strong>${fmt(all.priv, 0)} €</strong> на месец (${signedPct(pct(all.pub, all.priv))}).`,
    `В държавното управление и отбраната средната заплата е <strong>${fmt(gov.pub, 0)} €</strong> — с ${fmt(pct(gov.pub, all.wage), 0)}% ${gov.pub >= all.wage ? 'над' : 'под'} средната за страната (${fmt(all.wage, 0)} €). Там работят ${fmt(gov.pubEmp, 0)} души.`,
  ];
  if (stateMore.length) out.push('Най-голяма разлика в полза на държавните: ' + stateMore.map((r) =>
    `${esc(lower(r.name))} — <strong>${fmt(r.pub, 0)} €</strong> срещу ${fmt(r.priv, 0)} € (${signedPct(pct(r.pub, r.priv))})`).join('; ') + '.');
  if (privMore.length) out.push('Частните плащат повече в: ' + privMore.map((r) =>
    `${esc(lower(r.name))} (${fmt(r.priv, 0)} € срещу ${fmt(r.pub, 0)} €)`).join('; ') + '.');
  if (year !== SECTOR_YEARS[0]) {
    out.push(`От ${SECTOR_YEARS[0]} до ${year} г. заплатите в държавното управление растат с ${signedPct(pct(gov.pub, first[GOV].pub))}, `
      + `средно при държавните работодатели — с ${signedPct(pct(all.pub, first[0].pub))}, при частните — с ${signedPct(pct(all.priv, first[0].priv))}.`);
  }
  return out;
}

function dot(v, max, color, label, faded) {
  if (v == null) return '';
  return `<span class="sw-dot${faded ? ' is-faded' : ''}" style="left:${((v / max) * 100).toFixed(2)}%;background:${color}" title="${esc(label)}: ${fmt(v, 0)} €"></span>`;
}

export function sectorWagesSection(ctx) {
  const year = SECTOR_YEARS.includes(ctx.year) ? ctx.year : ctx.year < SECTOR_YEARS[0] ? SECTOR_YEARS[0] : SECTOR_YEARS[SECTOR_YEARS.length - 1];
  const sortKey = (ctx.ui && ctx.ui.sectorSort) || 'gap';
  const rows = rowsFor(year);
  const all = rows[0];
  const rest = rows.slice(1).filter((r) => r.i !== GOV).sort((a, b) => SORTS[sortKey].key(b) - SORTS[sortKey].key(a));
  const ordered = [all, rows[GOV], ...rest];
  const top = Math.max(...rows.flatMap((r) => [r.pub ?? 0, r.priv ?? 0]));
  const step = top > 3000 ? 1000 : 500;
  const max = Math.ceil((top * 1.04) / step) * step;
  const ticks = [];
  for (let v = 0; v <= max; v += step) ticks.push(v);
  const avgLeft = ((all.wage / max) * 100).toFixed(2);
  const note = year !== ctx.year ? `<p class="small budget-warn">НСИ публикува тези данни за ${SECTOR_YEARS[0]}–${SECTOR_YEARS[SECTOR_YEARS.length - 1]} г. — показваме ${year} г.</p>` : '';

  const row = (r, pinned) => {
    const smallPub = r.pubEmp != null && r.pubEmp < SMALL;
    const smallPriv = r.privEmp != null && r.privEmp < SMALL;
    const lo = Math.min(r.pub ?? Infinity, r.priv ?? Infinity), hi = Math.max(r.pub ?? 0, r.priv ?? 0);
    const link = r.pub != null && r.priv != null
      ? `<span class="sw-link" style="left:${((lo / max) * 100).toFixed(2)}%;width:${(((hi - lo) / max) * 100).toFixed(2)}%"></span>` : '';
    // Без частни наети (държавно управление) сравняваме със средната за страната.
    const gap = r.pub != null && r.priv != null ? pct(r.pub, r.priv) : r.pub != null ? pct(r.pub, all.wage) : null;
    const vsAvg = r.priv == null && r.pub != null;
    return `
      <li class="${pinned ? 'is-pinned' : ''}">
        <div class="sw-name">
          <strong>${esc(r.name)}</strong>
          <span class="num">държавни: ${r.pubEmp == null ? '—' : fmt(r.pubEmp, 0)}${smallPub ? '*' : ''} · ${vsAvg ? 'няма частни — разликата е спрямо средната за страната' : 'частни: ' + fmt(r.privEmp, 0) + (smallPriv ? '*' : '')}</span>
        </div>
        <div class="sw-track" aria-hidden="true">
          <span class="sw-avg" style="left:${avgLeft}%"></span>
          ${link}${dot(r.priv, max, PRIV_COLOR, 'Частни', smallPriv)}${dot(r.pub, max, PUB_COLOR, 'Държавни', smallPub)}
        </div>
        <div class="sw-vals num">
          <span style="color:${PUB_COLOR}">${r.pub == null ? '—' : fmt(r.pub, 0) + ' €'}</span>
          <span style="color:${PRIV_COLOR}">${r.priv == null ? '—' : fmt(r.priv, 0) + ' €'}</span>
          ${gap == null ? '<span class="sw-gap">—</span>' : `<span class="sw-gap ${gap > 0 ? 'is-up' : 'is-down'}">${signedPct(gap)}</span>`}
        </div>
      </li>`;
  };

  return `
  <section class="card sector-wages" aria-labelledby="sw-h">
    <div class="card-head">
      <div>
        <h2 id="sw-h">Заплати по сектори: държавни срещу частни работодатели, ${year} г.</h2>
        <p class="muted">Средна месечна брутна заплата в евро и брой наети — отделно за държавните (обществен сектор) и частните работодатели във всеки сектор.</p>
      </div>
      <div class="seg" role="group" aria-label="Подреждане">${Object.entries(SORTS).map(([k, s]) =>
        `<button type="button" data-action="sector-sort" data-sort="${k}" aria-pressed="${k === sortKey}">${esc(s.label)}</button>`).join('')}</div>
    </div>
    ${note}
    <div class="summary-facts"><ul>${facts(rows, year).map((f) => `<li>${f}</li>`).join('')}</ul></div>
    <div class="legend">
      <span><i class="sw-key" style="background:${PUB_COLOR}"></i>Държавни работодатели</span>
      <span><i class="sw-key" style="background:${PRIV_COLOR}"></i>Частни работодатели</span>
      <span><i class="sw-key-avg"></i>Средно за страната: ${fmt(all.wage, 0)} €</span>
    </div>
    <ol class="sw-rows">
      <li class="sw-axis" aria-hidden="true"><div></div><div class="sw-track sw-ticks">${ticks.map((t) =>
        `<span class="num" style="left:${((t / max) * 100).toFixed(2)}%">${fmt(t, 0)} €</span>`).join('')}</div><div class="sw-vals num"><span style="color:${PUB_COLOR}">Държ.</span><span style="color:${PRIV_COLOR}">Частни</span><span class="sw-gap">Разлика</span></div></li>
      ${ordered.map((r, n) => row(r, n < 2)).join('')}
    </ol>
    <p class="small muted">Брутна заплата, без осигуровките за сметка на работодателя. „Държавни“ са всички работодатели в обществения сектор — министерства, общини, училища, болници и държавни фирми (БДЖ, НЕК, ББР, БНБ и др.). * Под ${fmt(SMALL, 0)} наети — средната стойност е неустойчива. Сравнението в един сектор не отчита разликите в длъжностите, квалификацията и работното време.</p>
    <p class="source">Източник: НСИ, наети лица и средна годишна заплата по икономически дейности и сектори (Labour_2.1.1, Labour_2.2.1), ${SECTOR_YEARS[0]}–${SECTOR_YEARS[SECTOR_YEARS.length - 1]} г. Годишната заплата е разделена на 12 и преизчислена в евро по 1,95583 лв.</p>
  </section>`;
}

export const SECTOR_ACTIONS = {
  'sector-sort': (el, { state, update }) => update({ ui: { ...state.ui, [state.route]: { ...(state.ui[state.route] || {}), sectorSort: el.dataset.sort } } }),
};
