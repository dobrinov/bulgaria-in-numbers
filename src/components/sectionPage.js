// Обща страница на раздел: „Накратко“, карта, година, показатели, графика,
// допълнителни блокове, „Как да четем числата“ и източници.
//
// Описание на страница (вижте src/pages/*.js):
// {
//   id, eyebrow, title, lead, summary: [текст],
//   map?: { metrics: [ключове от MAP_METRICS], drivesPage?: true }  // drivesPage: картата филтрира показателите
//   defaultYear, defaultMetric,
//   metrics: { ключ: { label, tab?, d, suffix, good: 'up'|'down'|'none', pp?, signed?, money?, realNote?,
//                      values: [11 стойности 2015–2025], eu?, euLabel?, note?(v, i), sub, source,
//                      reg?(областИндекс) => частично описание за областта } },
//   money: true — сума в евро; графиката може да покаже и стойността без инфлацията.
//   order: [ключове], kpiTitle?: (година) => заглавие на показателите,
//   sections?: [(ctx) => html],
//   method: [{ title, text }], sources: [{ href, title, text }],
// }
import { YEARS, fmt, esc, showValue, COLORS, toReal, REAL_BASE_YEAR } from '../lib/format.js';
import { lineChart } from '../lib/charts.js';
import { renderRegionMap, renderRegionChip } from './regionMap.js';
import { OBLASTS } from '../data/oblasts.js';

export function pageContext(page, state) {
  const year = state.year ?? page.defaultYear ?? 2025;
  const yi = YEARS.indexOf(year);
  const region = page.map ? state.region : null;
  const ui = (state.ui[page.id] ||= {});
  return { page, state, year, yi: yi < 0 ? YEARS.length - 1 : yi, region, regionName: region == null ? null : OBLASTS[region].name, ui };
}

/** Показателите за избраната област (или за страната). */
export function resolveMetrics(page, ctx) {
  const drives = page.map && page.map.drivesPage && ctx.region != null;
  const out = {};
  for (const key of page.order) {
    const m = page.metrics[key];
    if (!drives) { out[key] = m; continue; }
    const r = m.reg ? m.reg(ctx.region) : null;
    out[key] = r ? { ...m, ...r, regional: true } : { ...m, nationalOnly: true };
  }
  return out;
}

function kpiCards(page, M, ctx) {
  const { yi } = ctx;
  const metricKey = ctx.state.metric[page.id] ?? page.defaultMetric ?? page.order[0];
  return page.order.map((key) => {
    const m = M[key];
    const v = m.values[yi];
    let delta = '', tone = 'muted';
    if (v == null) delta = `Няма данни за ${YEARS[yi]} г.`;
    else if (yi === 0 || m.values[yi - 1] == null) delta = 'Няма данни за предходна година';
    else {
      const p = m.values[yi - 1];
      const diff = m.pp ? v - p : ((v - p) / Math.abs(p)) * 100;
      const unit = m.pp ? (m.suffix === '%' ? ' п.п.' : '') : '%';
      delta = `${diff > 0 ? '▲' : diff < 0 ? '▼' : '■'} ${fmt(Math.abs(diff), (m.d ?? 0) >= 3 ? 3 : 1)}${unit} спрямо ${YEARS[yi - 1]}`;
      const better = m.good === 'up' ? diff > 0 : m.good === 'down' ? diff < 0 : null;
      tone = better === null || diff === 0 ? 'muted' : better ? 'good' : 'bad';
    }
    let note = v != null && m.note ? m.note(v, yi) : '';
    if (m.money && ctx.state.real && v != null && yi < YEARS.length - 1) {
      const real = toReal(m.values);
      const p = yi > 0 ? real[yi - 1] : null;
      let rd = '';
      if (p != null && !m.pp) {
        const d = ((real[yi] - p) / Math.abs(p)) * 100;
        rd = ` (${d > 0 ? '▲' : d < 0 ? '▼' : '■'} ${fmt(Math.abs(d), 1)}% реално)`;
      }
      note = [note, `В цени от ${REAL_BASE_YEAR} г.: ${showValue(m, real[yi])}${rd}`].filter(Boolean).join(' · ');
    } else if (m.money && ctx.state.real && v != null && yi > 0 && m.values[yi - 1] != null && !m.pp) {
      const real = toReal(m.values);
      const d = ((real[yi] - real[yi - 1]) / Math.abs(real[yi - 1])) * 100;
      note = [note, `Без инфлацията: ${d > 0 ? '▲' : d < 0 ? '▼' : '■'} ${fmt(Math.abs(d), 1)}% спрямо ${YEARS[yi - 1]}`].filter(Boolean).join(' · ');
    }
    if (m.regional && m.cmp && m.cmp[yi] != null) note = [note, 'България: ' + showValue(m, m.cmp[yi])].filter(Boolean).join(' · ');
    else if (m.eu && m.eu[yi] != null) note = [note, (m.euLabel || 'ЕС') + ': ' + showValue(m, m.eu[yi])].filter(Boolean).join(' · ');
    const badge = m.regional ? `<span class="badge badge-region">${esc(ctx.regionName)}</span>`
      : m.nationalOnly ? '<span class="badge badge-national">Само за цялата страна</span>' : '';
    return `
      <button type="button" class="kpi${key === metricKey ? ' is-on' : ''}" data-action="metric" data-key="${key}" aria-pressed="${key === metricKey}">
        <span class="kpi-label">${esc(m.label)}</span>
        <span class="kpi-value num">${esc(showValue(m, v))}</span>
        <span class="kpi-delta tone-${tone} num">${esc(delta)}</span>
        ${note ? `<span class="kpi-note num">${esc(note)}</span>` : ''}
        ${badge}
      </button>`;
  }).join('');
}

function trendChart(page, M, ctx) {
  const key = ctx.state.metric[page.id] ?? page.defaultMetric ?? page.order[0];
  const m = M[key];
  const cmp = m.cmp || m.eu || null;
  const missing = YEARS.filter((y, i) => m.values[i] == null);
  const title = m.label + (m.regional ? ' — ' + ctx.regionName : '');
  const sub = m.sub + (m.nationalOnly ? ' Няма данни по области — показана е цялата страна.' : '');
  return `
  <section class="card" aria-labelledby="trend-h">
    <div class="card-head">
      <div>
        <h2 id="trend-h">${esc(title)}, 2015–2025</h2>
        <p class="muted">${esc(sub)}</p>
      </div>
      <div class="seg" role="group" aria-label="Показател">${page.order.map((k) =>
        `<button type="button" data-action="metric" data-key="${k}" aria-pressed="${k === key}">${esc(M[k].tab || M[k].label)}</button>`).join('')}</div>
    </div>
    ${m.money ? realToggle(m, ctx) : ''}
    ${lineChart({
      values: m.values, cmp, selectedIndex: ctx.yi, suffix: m.suffix || '',
      alt: m.money && ctx.state.real ? toReal(m.values) : null,
      altLabel: `Без инфлацията — в цени от ${REAL_BASE_YEAR} г.`,
      show: (v) => showValue(m, v), title,
      mainLabel: (m.regional ? ctx.regionName : 'България') + (m.money && ctx.state.real ? ' — в цените на съответната година' : ''),
      cmpLabel: m.cmpLabel || m.euLabel || (m.cmp ? 'България' : 'ЕС-27'),
    })}
    <p class="source">Източник: ${esc(m.source)}.${missing.length ? ` Няма данни за ${missing.join(', ')} г.` : ''}${m.limit ? ' ' + esc(m.limit) : ''}</p>
  </section>`;
}

function realToggle(m, ctx) {
  const on = ctx.state.real;
  const text = on
    ? `Зелената линия показва колко са тези суми в цените от ${REAL_BASE_YEAR} г. — т.е. каква част от ръста е реална и каква идва само от поскъпването. Изчислено с индекса на потребителските цени (ХИПЦ, Евростат).${m.realNote ? ' ' + m.realNote : ''}`
    : 'Сумите са в цените на всяка година. Включете, за да видите колко са в днешни цени.';
  return `
    <div class="real-toggle">
      <button type="button" data-action="real" aria-pressed="${on}"><span class="knob" aria-hidden="true"></span>Отчети инфлацията</button>
      <p>${esc(text)}</p>
    </div>`;
}

export function yearPicker(ctx) {
  return `
  <div class="year-picker">
    <span id="year-label">Година</span>
    <div role="group" aria-labelledby="year-label">${YEARS.map((y) =>
      `<button type="button" class="num" data-action="year" data-year="${y}" aria-pressed="${y === YEARS[ctx.yi]}">${y}</button>`).join('')}</div>
  </div>`;
}

export function summaryBox(lines) {
  return `
  <section class="summary" aria-label="Накратко">
    <span class="eyebrow-light">Накратко</span>
    <ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
  </section>`;
}

export function methodBlock(items) {
  if (!items || !items.length) return '';
  return `
  <section aria-labelledby="method-h" class="stack-lg">
    <h2 id="method-h">Как да четем числата</h2>
    <div class="grid-cards">${items.map((it) => `
      <article class="card card-sm"><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></article>`).join('')}</div>
  </section>`;
}

export function sourcesBlock(items, note = '') {
  if (!items || !items.length) return '';
  return `
  <section class="sources" aria-labelledby="src-h">
    <div><h2 id="src-h">Източници</h2>${note ? `<p>${esc(note)}</p>` : ''}</div>
    <ul>${items.map((s) => `<li><a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.title)}</a><span>${esc(s.text || '')}</span></li>`).join('')}</ul>
  </section>`;
}

export function pageHero(page) {
  return `
  <section class="hero">
    <p class="eyebrow">${esc(page.eyebrow)}</p>
    <h1>${esc(page.title)}</h1>
    <p class="lead">${esc(page.lead)}</p>
  </section>`;
}

export function renderSectionPage(page, state) {
  const ctx = pageContext(page, state);
  const M = resolveMetrics(page, ctx);
  const map = page.map ? renderRegionMap({ pageId: page.id, metrics: page.map.metrics, selected: ctx.region, mapMetric: state.mapMetric[page.id] }) : '';
  const extra = (page.sections || []).map((fn) => fn(ctx)).join('');
  return `
  ${pageHero(page)}
  ${page.summary ? summaryBox(page.summary) : ''}
  ${map}
  <section aria-labelledby="kpi-h" class="stack">
    <div class="row-between">
      <h2 id="kpi-h">${esc(page.kpiTitle ? page.kpiTitle(YEARS[ctx.yi]) : `Основни показатели за ${YEARS[ctx.yi]} г.`)}</h2>
      ${yearPicker(ctx)}
    </div>
    <p class="muted small">Изберете показател, за да видите графиката.</p>
    <div class="kpi-grid">${kpiCards(page, M, ctx)}</div>
  </section>
  ${page.order.length ? trendChart(page, M, ctx) : ''}
  ${extra}
  ${methodBlock(page.method)}
  ${sourcesBlock(page.sources, page.sourcesNote)}
  ${renderRegionChip(ctx.region)}`;
}

export { COLORS };
