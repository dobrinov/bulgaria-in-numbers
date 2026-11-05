// SVG графики, генерирани като HTML низ.
import { YEARS, fmt, esc, COLORS } from './format.js';

/** „Кръгли“ деления на скалата от min до max (винаги включва 0). */
export function niceScale(values) {
  const known = values.filter((v) => v != null);
  const rawHi = Math.max(0, ...known);
  const rawLo = Math.min(0, ...known);
  const span = (rawHi - rawLo) * 1.1 || 1;
  const mag = Math.pow(10, Math.floor(Math.log10(span / 4)));
  const step = [1, 2, 2.5, 5, 10].map((s) => s * mag).find((s) => span / s <= 4.5) || 10 * mag;
  const lo = Math.floor(rawLo / step) * step;
  const hi = Math.ceil((rawHi * 1.08) / step) * step || step;
  const isInt = (x) => Math.abs(x - Math.round(x)) < 1e-9;
  const dec = isInt(step) ? 0 : isInt(step * 10) ? 1 : isInt(step * 100) ? 2 : 3;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v / step) * step);
  return { lo, hi, ticks, dec };
}

/**
 * Линейна графика по години.
 * opts: { values, cmp?, cmpLabel?, mainLabel, selectedIndex, show(v), suffix, title }
 */
export function lineChart(opts) {
  const { values, cmp = null, alt = null, altLabel = '', selectedIndex, show, suffix = '', mainLabel = 'България', cmpLabel = 'ЕС-27', title = '' } = opts;
  const W = 800, H = 320, L = 70, R = 20, T = 30, B = 270;
  const { lo, hi, ticks, dec } = niceScale(values.concat(cmp || [], alt || []));
  const X = (i) => L + 10 + (i * (W - L - R - 20)) / (YEARS.length - 1);
  const Y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
  const path = (xs) => xs.map((v, i) => (v == null ? null : [i, v])).filter(Boolean)
    .map(([i, v], n, arr) => (n > 0 && arr[n - 1][0] === i - 1 ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
  const idx = values.map((v, i) => i).filter((i) => values[i] != null);
  const contiguous = idx.length > 1 && idx[idx.length - 1] - idx[0] === idx.length - 1;
  const zero = Y(Math.max(lo, 0));
  const area = contiguous && !alt
    ? `M${X(idx[0])},${zero} ` + idx.map((i) => `L${X(i).toFixed(1)},${Y(values[i]).toFixed(1)}`).join(' ') + ` L${X(idx[idx.length - 1])},${zero} Z`
    : '';

  const grid = ticks.map((v) => `
    <line x1="${L}" x2="${W - R}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="${v === 0 && lo < 0 ? '#8792A6' : COLORS.grid}" />
    <text x="${L - 8}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end" class="tick">${esc(fmt(v, dec) + suffix)}</text>`).join('');
  const years = YEARS.map((y, i) => `<text x="${X(i).toFixed(1)}" y="${B + 24}" text-anchor="middle" class="tick${i === selectedIndex ? ' tick-on' : ''}">${y}</text>`).join('');
  // Етикетите на двете линии са от външната им страна, за да не се застъпват.
  const altGap = (i) => (alt && alt[i] != null ? Math.abs(Y(alt[i]) - Y(values[i])) : 0);
  const dots = idx.map((i) => {
    const v = values[i];
    const on = i === selectedIndex;
    const below = alt ? alt[i] != null && alt[i] > v * (v >= 0 ? 1.0001 : 0.9999)
      : cmp != null && cmp[i] != null && cmp[i] > v && v >= 0;
    const ly = below ? Y(v) + (on ? 24 : 20) : Y(v) - (on ? 12 : 9);
    return `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="${on ? 6 : 3.5}" fill="${on ? 'var(--accent)' : '#fff'}" stroke="var(--accent)" stroke-width="2" />
      <text x="${X(i).toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" class="val${on ? ' val-on' : ''}">${esc(show(v))}</text>`;
  }).join('');
  const altDots = alt ? alt.map((a, i) => {
    if (a == null || values[i] == null || altGap(i) < 16) return '';
    const on = i === selectedIndex;
    const ly = a > values[i] ? Y(a) - (on ? 12 : 9) : Y(a) + (on ? 24 : 20);
    return `<circle cx="${X(i).toFixed(1)}" cy="${Y(a).toFixed(1)}" r="${on ? 5 : 3}" fill="${on ? COLORS.real : '#fff'}" stroke="${COLORS.real}" stroke-width="2" />
      <text x="${X(i).toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" class="val val-real${on ? ' val-on' : ''}">${esc(show(a))}</text>`;
  }).join('') : '';
  const sel = selectedIndex >= 0 ? `<line x1="${X(selectedIndex)}" x2="${X(selectedIndex)}" y1="${T - 10}" y2="${B}" stroke="${COLORS.ink}" stroke-dasharray="3 4" />` : '';

  return `
  <div class="legend">
    <span><i class="swatch-line"></i>${esc(mainLabel)}</span>
    ${alt ? `<span><i class="swatch-real"></i>${esc(altLabel)}</span>` : ''}
    ${cmp ? `<span><i class="swatch-dash"></i>${esc(cmpLabel)}</span>` : ''}
  </div>
  <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">
    ${grid}${sel}
    ${area ? `<path d="${area}" fill="var(--accent)" fill-opacity="0.08" />` : ''}
    ${cmp ? `<path d="${path(cmp)}" fill="none" stroke="#64748B" stroke-width="2" stroke-dasharray="6 5" />` : ''}
    ${alt ? `<path d="${path(alt)}" fill="none" stroke="${COLORS.real}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />` : ''}
    <path d="${path(values)}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
    ${altDots}${dots}${years}
  </svg>`;
}

/**
 * Диаграма на разсейване с линия на тренда.
 * points: [{ x, y, label, highlight? }]
 */
export function scatterChart({ points, xLabel, yLabel, xDec = 0, yDec = 0, ySuffix = '', fit }) {
  const W = 800, H = 460, L = 80, R = 30, T = 20, B = 400;
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const pad = (a, b) => (b - a) * 0.08 || 1;
  const x0 = Math.min(...xs) - pad(Math.min(...xs), Math.max(...xs));
  const x1 = Math.max(...xs) + pad(Math.min(...xs), Math.max(...xs));
  const y0 = Math.min(...ys) - pad(Math.min(...ys), Math.max(...ys));
  const y1 = Math.max(...ys) + pad(Math.min(...ys), Math.max(...ys));
  const SX = (v) => L + ((v - x0) / (x1 - x0)) * (W - L - R);
  const SY = (v) => B - ((v - y0) / (y1 - y0)) * (B - T);
  const steps = [0, 1, 2, 3, 4];
  const grid = steps.map((k) => {
    const yv = y0 + ((y1 - y0) * k) / 4, xv = x0 + ((x1 - x0) * k) / 4;
    return `<line x1="${L}" x2="${W - R}" y1="${SY(yv)}" y2="${SY(yv)}" stroke="${COLORS.grid}" />
      <text x="${L - 8}" y="${SY(yv) + 4}" text-anchor="end" class="tick">${fmt(yv, yDec)}${ySuffix}</text>
      <line x1="${SX(xv)}" x2="${SX(xv)}" y1="${T}" y2="${B}" stroke="#EEF1F5" />
      <text x="${SX(xv)}" y="${B + 22}" text-anchor="middle" class="tick">${fmt(xv, xDec)}</text>`;
  }).join('');
  const line = fit ? `<path d="M${SX(x0)},${SY(fit.intercept + fit.slope * x0)} L${SX(x1)},${SY(fit.intercept + fit.slope * x1)}" stroke="${COLORS.ink}" stroke-width="1.5" stroke-dasharray="6 5" fill="none" />` : '';
  const dots = points.map((p) => `
    <circle cx="${SX(p.x)}" cy="${SY(p.y)}" r="7" fill="${p.highlight ? COLORS.worse : 'var(--accent)'}" fill-opacity="0.85" stroke="#fff" stroke-width="1.5"><title>${esc(p.label)}</title></circle>
    <text x="${SX(p.x) + 10}" y="${SY(p.y) + 4}" class="plab">${esc(p.label)}</text>`).join('');
  return `
  <p class="axis-label">↑ ${esc(yLabel)}</p>
  <svg class="chart" viewBox="0 0 ${W} ${H + 10}" role="img" aria-label="${esc(yLabel + ' спрямо ' + xLabel)}">
    <defs><clipPath id="sc-clip"><rect x="${L}" y="${T}" width="${W - L - R}" height="${B - T}" /></clipPath></defs>
    ${grid}<g clip-path="url(#sc-clip)">${line}</g>${dots}
  </svg>
  <p class="axis-label axis-x">${esc(xLabel)} →</p>`;
}

/** Хоризонтални ленти: [{ label, value, display, color?, sub? }]. */
export function barList(rows, { max } = {}) {
  const m = max ?? Math.max(...rows.map((r) => Math.abs(r.value)));
  return `<ul class="bars">${rows.map((r) => `
    <li>
      <div class="bar-head"><span>${r.swatch ? `<i class="sw" style="background:${r.swatch}"></i>` : ''}${esc(r.label)}</span><span class="num">${r.display}</span></div>
      <span class="bar"><span style="width:${((Math.abs(r.value) / m) * 100).toFixed(1)}%;background:${r.color || 'var(--ink)'}"></span></span>
      ${r.sub ? `<span class="bar-sub">${esc(r.sub)}</span>` : ''}
    </li>`).join('')}</ul>`;
}

/** Една лента, разделена на части: [{ value, color, label }]. */
export function stackedBar(parts, height = 28) {
  const total = parts.reduce((s, p) => s + Math.max(0, p.value), 0);
  return `<div class="stackbar" style="height:${height}px" aria-hidden="true">${parts.map((p) =>
    `<span title="${esc(p.label || '')}" style="width:${((Math.max(0, p.value) / total) * 100).toFixed(2)}%;background:${p.color}"></span>`).join('')}</div>`;
}
