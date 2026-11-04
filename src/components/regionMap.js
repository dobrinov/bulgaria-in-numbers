// Карта на 28-те области с панел за избраната област.
import { GEO, MAP_W, MAP_H } from '../data/geo.js';
import { OBLASTS, LATEST } from '../data/oblasts.js';
import { fmt, esc, EUR, COLORS } from '../lib/format.js';

const N = OBLASTS.length;
const NAT_POP = 6423207;

/** Показатели по области (последна година). */
export const MAP_METRICS = {
  gdp: { label: 'БВП на човек, 2024', unit: ' €', d: 0, nat: 16300, good: 'up', scale: [1000, 1, 'хил. € на човек'], src: 'Евростат, nama_10r_3gdp', values: LATEST.gdp },
  wage: { label: 'Средна месечна заплата, 2024', unit: ' €', d: 0, nat: 27898 / EUR / 12, good: 'up', scale: [1, 0, '€ на месец, бруто'], src: 'НСИ (годишната заплата ÷ 12)', values: LATEST.wage.map((v) => v / 12) },
  dpop: { label: 'Промяна на населението 2015–2025', unit: '%', d: 1, nat: -10.2, good: 'up', signed: true, scale: [1, 1, 'промяна, %'], src: 'НСИ', values: LATEST.dpop },
  unemp: { label: 'Безработица, 2025', unit: '%', d: 1, nat: 3.5, good: 'down', scale: [1, 1, 'безработица, %'], src: 'НСИ (* малка извадка)', values: LATEST.unemp, flags: LATEST.unempFlag },
  crimesK: { label: 'Престъпления на 1000 души, 2025', unit: '', d: 1, nat: (70075 / NAT_POP) * 1000, good: 'down', scale: [1, 1, 'на 1000 души'], src: 'МВР; НСИ', values: LATEST.crimes.map((c, i) => (c / LATEST.pop[i]) * 1000) },
  clear: { label: 'Разкриваемост, 2025', unit: '%', d: 1, nat: 54.18, good: 'up', scale: [1, 0, 'разкриваемост, %'], src: 'МВР', values: LATEST.clear },
  pop: { label: 'Население, 31.12.2025', unit: '', d: 0, nat: NAT_POP, good: 'none', scale: [1000, 0, 'хил. жители'], src: 'НСИ', values: LATEST.pop },
  life: { label: 'Продължителност на живота, 2023–2025', unit: ' г.', d: 1, nat: 75.86, good: 'up', scale: [1, 1, 'години'], src: 'НСИ', values: LATEST.life },
  docs: { label: 'Лекари на 100 000 души, 2025', unit: '', d: 0, nat: 473.4, good: 'up', scale: [1, 0, 'на 100 000 души'], src: 'НСИ', values: LATEST.docs },
  beds: { label: 'Болнични легла на 100 000 души, 2025', unit: '', d: 0, nat: 885.3, good: 'none', scale: [1, 0, 'на 100 000 души'], src: 'НСИ (изчислено)', values: LATEST.beds },
  infant: { label: 'Детска смъртност, 2025', unit: '‰', d: 1, nat: 4.6, good: 'down', scale: [1, 1, 'на 1000 живородени'], src: 'НСИ (малките числа силно варират)', values: LATEST.infant },
  tert: { label: 'С висше образование, % от населението 7+ г., преброяване 2021', unit: '%', d: 1, nat: 25.5, good: 'up', scale: [1, 1, '% от населението 7+ г.'], src: 'НСИ, преброяване 2021', values: LATEST.tert },
  ent: { label: 'Фирми на 1000 души, 2023', unit: '', d: 1, nat: 62.7, good: 'up', scale: [1, 0, 'на 1000 души'], src: 'Евростат, bd_hgnace_r (изчислено)', values: LATEST.ent },
  conv: { label: 'Осъдени на 100 000 души, 2025', unit: '', d: 0, nat: 329.5, good: 'none', scale: [1, 0, 'на 100 000 души'], src: 'НСИ, по район на окръжния съд', values: LATEST.conv },
  fuel: { label: 'Продадено гориво, л на човек, 2025', unit: ' л', d: 0, nat: 699.5, good: 'none', scale: [1, 0, 'литра на човек'], src: 'НСИ/НАП, по място на продажба', values: LATEST.fuel },
};

const valueText = (m, v) => (m.signed && v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v), m.d) + m.unit;

/** Място (1 = най-добро) сред 28-те области. */
export function rankOf(key, i) {
  const m = MAP_METRICS[key];
  const order = [...Array(N).keys()].sort((a, b) => (m.good === 'down' ? m.values[a] - m.values[b] : m.values[b] - m.values[a]));
  return order.indexOf(i) + 1;
}

/** Ред в панела за една област и показател. */
export function detailRow(key, i) {
  const m = MAP_METRICS[key];
  if (i == null) return { label: m.label, value: valueText(m, m.nat), cmp: '', tone: 'muted' };
  const v = m.values[i];
  const flag = m.flags && m.flags[i] ? '*' : '';
  if (key === 'pop') return { label: m.label, value: valueText(m, v), cmp: fmt((v / NAT_POP) * 100, 1) + '% от страната', tone: 'muted' };
  const above = v >= m.nat;
  if (m.good === 'none') return { label: m.label, value: valueText(m, v), cmp: (above ? 'над' : 'под') + ' средното за страната', tone: 'muted' };
  const better = m.good === 'up' ? above : !above;
  return { label: m.label, value: valueText(m, v) + flag, cmp: `${rankOf(key, i)}-о място · ${above ? 'над' : 'под'} средното`, tone: better ? 'good' : 'bad' };
}

/**
 * opts: { pageId, metrics: [...keys], selected: index|null, mapMetric,
 *         highlight?: [индекси за допълнително очертаване], panelExtra?: html в панела }
 */
export function renderRegionMap({ pageId, metrics, selected, mapMetric, highlight = [], panelExtra = '' }) {
  const keys = metrics.filter((k) => MAP_METRICS[k]);
  const key = keys.includes(mapMetric) ? mapMetric : keys[0];
  const m = MAP_METRICS[key];
  const [div, dec, unit] = m.scale;
  const sorted = [...m.values].sort((a, b) => a - b);
  const q = [0.2, 0.4, 0.6, 0.8].map((p) => sorted[Math.floor(p * (N - 1))]);
  const bucket = (v) => (v <= q[0] ? 0 : v <= q[1] ? 1 : v <= q[2] ? 2 : v <= q[3] ? 3 : 4);
  const short = (v) => (m.signed && v > 0 ? '+' : v < 0 ? '−' : '') + fmt(Math.abs(v) / div, dec);
  const edges = [sorted[0], ...q, sorted[N - 1]];

  const marked = (i) => i === selected || highlight.includes(i);
  const order = [...Array(N).keys()].sort((a, b) => marked(a) - marked(b));
  const paths = order.map((i) => {
    const b = bucket(m.values[i]);
    const on = marked(i);
    return `<path d="${GEO[i][0]}" fill="${COLORS.palette[b]}" stroke="${on ? COLORS.worse : '#fff'}" stroke-width="${i === selected ? 4 : on ? 3 : 1}" stroke-linejoin="round" data-action="pick-region" data-id="${i}"><title>${esc(OBLASTS[i].name)}: ${esc(valueText(m, m.values[i]))}</title></path>`;
  }).join('');
  const labels = order.map((i) => {
    const b = bucket(m.values[i]);
    return `<text x="${GEO[i][1]}" y="${GEO[i][2] + 4}" text-anchor="middle" class="map-val" fill="${b >= 3 ? '#fff' : COLORS.ink}">${short(m.values[i])}${m.flags && m.flags[i] ? '*' : ''}</text>`;
  }).join('');
  const options = [...Array(N).keys()].sort((a, b) => OBLASTS[a].name.localeCompare(OBLASTS[b].name, 'bg'))
    .map((i) => `<option value="${i}"${i === selected ? ' selected' : ''}>${esc(OBLASTS[i].name)}</option>`).join('');
  const rows = keys.map((k) => detailRow(k, selected));

  return `
  <section class="card map-card" aria-labelledby="map-h-${pageId}">
    <div class="card-head">
      <div>
        <h2 id="map-h-${pageId}">По области: ${esc(m.label)}</h2>
        <p class="muted">Кликнете върху област или я изберете от списъка. Без избор се показва цялата страна.</p>
      </div>
      ${pageId !== 'regions' ? '<a class="link-strong" href="#/regions">Всички показатели по области →</a>' : ''}
    </div>
    ${keys.length > 1 ? `<div class="seg" role="group" aria-label="Показател на картата">${keys.map((k) =>
      `<button type="button" data-action="map-metric" data-key="${k}" aria-pressed="${k === key}">${esc(MAP_METRICS[k].label)}</button>`).join('')}</div>` : ''}
    <div class="map-layout">
      <div class="map-wrap">
        <svg class="map" viewBox="0 0 ${MAP_W} ${MAP_H}" role="img" aria-label="Карта на България по области: ${esc(m.label)}">${paths}${labels}</svg>
        <div class="map-legend"><strong>${esc(unit)}:</strong>${COLORS.palette.map((c, i) =>
          `<span><i class="sw" style="background:${c}"></i>${short(edges[i])} – ${short(edges[i + 1])}</span>`).join('')}</div>
      </div>
      <aside class="map-panel">
        <label for="region-select-${pageId}">Област</label>
        <select id="region-select-${pageId}" data-action="select-region">
          <option value=""${selected == null ? ' selected' : ''}>България — общо</option>${options}
        </select>
        <h3>${selected == null ? 'България — общо' : esc(OBLASTS[selected].name)}</h3>
        <p class="muted small">${selected == null ? 'Стойности за цялата страна' : 'Място от 1 (най-добро) до 28'}</p>
        <dl>${rows.map((r) => `<div><dt>${esc(r.label)}</dt><dd><strong>${esc(r.value)}</strong><span class="tone-${r.tone}">${esc(r.cmp)}</span></dd></div>`).join('')}</dl>
        ${panelExtra}
        ${selected != null ? '<button type="button" class="btn-ghost" data-action="clear-region">← Цялата страна</button>' : ''}
      </aside>
    </div>
    <p class="source">Източник: ${esc([...new Set(keys.map((k) => MAP_METRICS[k].src))].join('; '))}. Граници: Евростат GISCO, NUTS 3.</p>
  </section>`;
}

/** Плаваща лента с избраната област. */
export function renderRegionChip(selected) {
  if (selected == null) return '';
  return `
  <div class="region-chip" role="status">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8FB0FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
    <span>Област: <strong>${esc(OBLASTS[selected].name)}</strong></span>
    <button type="button" data-action="clear-region" aria-label="Изчисти избора на област">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      Цялата страна
    </button>
  </div>`;
}
