// Проверки на страниците и на регистъра с източници. Пускане: npm test
import { registerHooks } from 'node:module';
import test from 'node:test';
import assert from 'node:assert/strict';

// Страниците внасят CSS; в Node го заменяме с празен модул.
registerHooks({
  load(url, context, next) {
    if (url.endsWith('.css')) return { format: 'module', source: 'export default "";', shortCircuit: true };
    return next(url, context);
  },
});

const { PAGES } = await import('../src/pages/index.js');
const { YEARS } = await import('../src/lib/format.js');
const { EUROSTAT } = await import('../scripts/sources.mjs');
const { GROUPS } = await import('../src/pages/registry.js');

test('всяка страница от менюто съществува', () => {
  for (const g of GROUPS) for (const p of g.pages) assert.ok(PAGES[p.id], p.id);
});

test('всеки показател има стойност за всяка година', () => {
  for (const page of Object.values(PAGES)) {
    if (!page.metrics) continue;
    for (const key of page.order) {
      const m = page.metrics[key];
      assert.ok(m, `${page.id}.${key} е в order, но не и в metrics`);
      assert.equal(m.values.length, YEARS.length, `${page.id}.${key}.values`);
      if (m.eu) assert.equal(m.eu.length, YEARS.length, `${page.id}.${key}.eu`);
      assert.ok(m.label && m.source, `${page.id}.${key} без label/source`);
    }
  }
});

test('регистърът с източници сочи към съществуващи показатели', () => {
  for (const s of EUROSTAT) {
    const m = PAGES[s.page]?.metrics?.[s.key];
    assert.ok(m, `${s.page}.${s.key}`);
    assert.ok(m[s.field || 'values'], `${s.page}.${s.key}.${s.field || 'values'}`);
  }
});
