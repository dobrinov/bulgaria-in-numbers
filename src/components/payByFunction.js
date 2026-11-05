// Колко плаща държавата на наетите си по области (COFOG): образование, сигурност, отбрана, здраве, култура…
import { PBF_YEARS, PAY_BY_FUNCTION, PAY_TOTAL, GDP_BN } from '../data/payByFunction.js';
import { HICP_INDEX, fmt, esc } from '../lib/format.js';

const times = (v) => '×' + fmt(v, 1);

function spark(values, i) {
  const W = 90, H = 26, max = Math.max(...values);
  const pts = values.map((v, k) => `${((k / (values.length - 1)) * W).toFixed(1)},${(H - 2 - (v / max) * (H - 4)).toFixed(1)}`);
  const [x, y] = pts[i].split(',');
  return `<svg class="pbf-spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="1.6" /><circle cx="${x}" cy="${y}" r="2.6" fill="var(--accent)" /></svg>`;
}

export function payByFunctionSection(ctx) {
  const last = PBF_YEARS.length - 1;
  const i = PBF_YEARS.includes(ctx.year) ? PBF_YEARS.indexOf(ctx.year) : ctx.year < PBF_YEARS[0] ? 0 : last;
  const year = PBF_YEARS[i];
  const sortKey = (ctx.ui && ctx.ui.pbfSort) || 'amount';
  const price = HICP_INDEX[i] / HICP_INDEX[0];
  const growth = (vals) => vals[i] / vals[0];
  const rows = PAY_BY_FUNCTION.slice().sort((a, b) => (sortKey === 'growth' ? growth(b.values) - growth(a.values) : b.values[i] - a.values[i]));
  const max = Math.max(...PAY_BY_FUNCTION.map((f) => f.values[i]));
  const total = PAY_TOTAL[i];

  const row = (f, child) => {
    const g = growth(f.values);
    return `
      <li class="${child ? 'is-child' : ''}">
        <span class="pbf-name">${esc(f.name)}</span>
        <span class="bar" aria-hidden="true"><span style="width:${((f.values[i] / max) * 100).toFixed(1)}%;background:${child ? '#A9C1F5' : 'var(--accent)'}"></span></span>
        <span class="pbf-val num"><strong>${fmt(f.values[i] / 1000, 2)} млрд. €</strong><small>${fmt((f.values[i] / total) * 100, 1)}% от всички</small></span>
        ${i > 0 ? `<span class="pbf-growth num"><strong>${times(g)}</strong><small>реално ${times(g / price)}</small></span>${spark(f.values, i)}` : ''}
      </li>`;
  };

  const fastest = PAY_BY_FUNCTION.slice().sort((a, b) => growth(b.values) - growth(a.values))[0];
  const facts = i > 0 ? [
    `За заплати и осигуровки на наетите си държавата плаща <strong>${fmt(total / 1000, 2)} млрд. €</strong> през ${year} г. — <strong>${times(growth(PAY_TOTAL))}</strong> повече от ${PBF_YEARS[0]} г. За същото време цените растат ${times(price)}, а БВП — ${times(growth(GDP_BN))}.`,
    `Най-бързо растат разходите за заплати в „${esc(fastest.name.toLowerCase())}“ — ${times(growth(fastest.values))} (от ${fmt(fastest.values[0], 0)} млн. € на ${fmt(fastest.values[i], 0)} млн. €).`,
    `Полиция: ${times(growth(PAY_BY_FUNCTION[1].parts[0].values))}, съдилища и прокуратура: ${times(growth(PAY_BY_FUNCTION[1].parts[1].values))}, отбрана: ${times(growth(PAY_BY_FUNCTION.find((f) => f.code === 'GF02').values))}, образование: ${times(growth(PAY_BY_FUNCTION[0].values))}.`,
  ] : [];
  const note = year !== ctx.year ? `<p class="small budget-warn">Евростат публикува разбивката по области до ${PBF_YEARS[last]} г. — показваме ${year} г.</p>` : '';

  return `
  <section class="card pbf" aria-labelledby="pbf-h">
    <div class="card-head">
      <div>
        <h2 id="pbf-h">Заплати на наетите от държавата по области, ${year} г.</h2>
        <p class="muted">Заплати и осигуровки за сметка на работодателя, които държавата плаща на хората, работещи в образование, сигурност, отбрана, здравеопазване, култура и т.н.</p>
      </div>
      <div class="seg" role="group" aria-label="Подреждане">
        <button type="button" data-action="pbf-sort" data-sort="amount" aria-pressed="${sortKey === 'amount'}">По сума</button>
        <button type="button" data-action="pbf-sort" data-sort="growth" aria-pressed="${sortKey === 'growth'}">По ръст от ${PBF_YEARS[0]}</button>
      </div>
    </div>
    ${note}
    ${facts.length ? `<div class="summary-facts"><ul>${facts.map((f) => `<li>${f}</li>`).join('')}</ul></div>` : ''}
    <ol class="pbf-rows">
      <li class="pbf-head" aria-hidden="true"><span>Област</span><span></span><span>${year} г.</span>${i > 0 ? `<span>Ръст от ${PBF_YEARS[0]}</span><span>${PBF_YEARS[0]}–${year}</span>` : ''}</li>
      ${rows.map((f) => row(f, false) + (f.parts ? f.parts.map((p) => row(p, true)).join('') : '')).join('')}
    </ol>
    <p class="small muted">„Реално“ — след като се извади поскъпването на живота (ХИПЦ). Броят на наетите по тези области не се публикува, затова не показваме средна заплата за всяка област. Тук са само наетите в сектор „Държавно управление“: държавните болници и фирми са търговски дружества и не влизат — затова в здравеопазването не са повечето лекари и медицински сестри.</p>
    <p class="source">Източник: Евростат, gov_10a_exp (COFOG), D1 — възнаграждения на наетите, сектор „Държавно управление“, ${PBF_YEARS[0]}–${PBF_YEARS[last]} г.</p>
  </section>`;
}

export const PBF_ACTIONS = {
  'pbf-sort': (el, { state, update }) => update({ ui: { ...state.ui, [state.route]: { ...(state.ui[state.route] || {}), pbfSort: el.dataset.sort } } }),
};
