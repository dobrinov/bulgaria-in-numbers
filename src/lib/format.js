// Общи константи и форматиране на числа.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
export const EUR = 1.95583; // фиксиран курс лев/евро

// Население към 31.12 по години (НСИ). Използва се за изчисления „на човек“.
export const POPULATION = [7153784, 7101859, 7050034, 7000039, 6951482, 6916548, 6838937, 6447710, 6445481, 6437360, 6423207];

export const COLORS = {
  ink: '#0F1B2D',
  accent: '#1F4FD1',
  accentDark: '#163A9E',
  worse: '#B45309',
  muted: '#4A5568',
  grid: '#E3E7EE',
  palette: ['#E8EEFC', '#A9C1F5', '#5B84E8', '#1F4FD1', '#163A9E'],
};

const nf = new Map();
/** Форматира число по български: интервал за хиляди, запетая за десетични. */
export function fmt(n, d = 0) {
  if (n == null || Number.isNaN(n)) return '—';
  const key = d;
  if (!nf.has(key)) nf.set(key, new Intl.NumberFormat('bg-BG', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' }));
  return nf.get(key).format(n);
}

/** Число със знак: +1,2 / −1,2. */
export function signed(n, d = 0) {
  if (n == null) return '—';
  return (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n), d);
}

/** Стойност на показател според описанието му ({ d, suffix, signed }). */
export function showValue(m, v) {
  if (v == null) return '—';
  return (m.signed && v > 0 ? '+' : '') + fmt(v, m.d ?? 0) + (m.suffix ?? '');
}

/** Екранира текст за HTML. */
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** Коефициент на корелация на Пиърсън и линейна регресия. */
export function correlation(xs, ys) {
  const pts = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x != null && y != null);
  const n = pts.length;
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }
  const r = sxy / Math.sqrt(sxx * syy);
  const slope = sxy / sxx;
  return { r, slope, intercept: my - slope * mx, n };
}

/** Описание на силата на корелация. */
export function strength(r) {
  const a = Math.abs(r);
  if (a < 0.3) return 'Слаба или никаква връзка';
  return (a < 0.7 ? 'Умерена ' : 'Силна ') + (r > 0 ? 'положителна връзка' : 'отрицателна връзка');
}
