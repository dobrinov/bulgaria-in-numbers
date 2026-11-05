// Проверки на данните и на общата логика. Пускане: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { GEO } from '../src/data/geo.js';
import { OBLASTS, LATEST, SERIES } from '../src/data/oblasts.js';
import { YEARS, fmt, signed, correlation, POPULATION } from '../src/lib/format.js';
import { niceScale } from '../src/lib/charts.js';

test('28 области в един и същ ред навсякъде', () => {
  assert.equal(OBLASTS.length, 28);
  assert.equal(GEO.length, 28);
  for (const [k, arr] of Object.entries(LATEST)) assert.equal(arr.length, 28, `LATEST.${k}`);
  for (const [k, rows] of Object.entries(SERIES)) {
    assert.equal(rows.length, 28, `SERIES.${k}`);
    for (const r of rows) assert.equal(r.length, YEARS.length, `SERIES.${k} години`);
  }
  assert.equal(OBLASTS[0].nuts, 'BG311');
  assert.equal(OBLASTS[18].name, 'София (столица)');
});

test('сборът на населението по области е населението на страната', () => {
  const total = LATEST.pop.reduce((s, v) => s + v, 0);
  assert.equal(total, POPULATION[POPULATION.length - 1]);
});

test('естественият прираст по области е раждания минус умирания (числа)', () => {
  for (const row of SERIES.natural) for (const v of row) assert.ok(v == null || Number.isInteger(v));
});

test('форматиране по български', () => {
  // Intl използва непрекъсваем интервал за хилядите
  assert.equal(fmt(6423207).replace(/\s/g, ' '), '6 423 207');
  assert.equal(fmt(54.18, 1), '54,2');
  assert.equal(signed(-10.2, 1), '−10,2');
});

test('кръгла скала включва 0 и стъпката е „кръгла“', () => {
  const s = niceScale([7153784, 6423207]);
  assert.equal(s.ticks[0], 0);
  assert.deepEqual(s.ticks.slice(0, 3), [0, 2000000, 4000000]);
  const neg = niceScale([-4, 2.1]);
  assert.ok(neg.lo < 0 && neg.ticks.includes(0));
});

test('корелация', () => {
  const { r } = correlation([1, 2, 3, 4], [2, 4, 6, 8]);
  assert.ok(Math.abs(r - 1) < 1e-9);
});

test('toReal преизчислява в цени от последната година', async () => {
  const { toReal, HICP_INDEX, YEARS } = await import('../src/lib/format.js');
  assert.equal(HICP_INDEX.length, YEARS.length);
  const r = toReal([100, null, 100, 100, 100, 100, 100, 100, 100, 100, 100]);
  assert.equal(r[10], 100);
  assert.equal(r[1], null);
  assert.ok(Math.abs(r[0] - 142.5) < 1e-9);
});
