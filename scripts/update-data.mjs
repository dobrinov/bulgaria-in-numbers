#!/usr/bin/env node
// Проверява за нови или ревизирани данни на Евростат и пише отчет.
//
//   npm run update-data             → отчет в data/update-report.md (+ data/update-report.json)
//   npm run update-data -- --apply  → също записва промените в src/pages/*.js
//
// Само показатели от scripts/sources.mjs (EUROSTAT) се обновяват автоматично.
// Останалите (НСИ, МВР, ВСС, НОИ…) се изброяват в отчета за ръчна проверка.
import { registerHooks } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { EUROSTAT, MANUAL } from './sources.mjs';

// Страниците внасят CSS; в Node го заменяме с празен модул.
registerHooks({
  load(url, context, next) {
    if (url.endsWith('.css')) return { format: 'module', source: 'export default "";', shortCircuit: true };
    return next(url, context);
  },
});

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const API = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/';
const { YEARS } = await import('../src/lib/format.js');

/** Сваля ред от Евростат и връща { година: стойност }. */
async function fetchSeries(src) {
  const geo = src.field === 'eu' ? 'EU27_2020' : 'BG';
  const q = new URLSearchParams({ format: 'JSON', lang: 'EN', geo, sinceTimePeriod: String(YEARS[0]) });
  for (const [k, v] of Object.entries(src.params)) q.append(k, v);
  const url = API + src.dataset + '?' + q;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  const js = await res.json();
  if (js.error) throw new Error(JSON.stringify(js.error).slice(0, 200));
  const ids = js.id, sizes = js.size;
  const extra = ids.filter((d, i) => d !== 'time' && sizes[i] > 1);
  if (extra.length) {
    const opts = extra.map((d) => `${d}=${Object.keys(js.dimension[d].category.index).join('|')}`).join('; ');
    throw new Error(`Нееднозначен филтър — добавете в params: ${opts}`);
  }
  const ti = ids.indexOf('time');
  const stride = sizes.slice(ti + 1).reduce((a, b) => a * b, 1);
  const out = {};
  for (const [label, pos] of Object.entries(js.dimension.time.category.index)) {
    let year = Number(label.slice(0, 4));
    if (src.semester && !label.endsWith(src.semester)) continue;
    const v = js.value[String(pos * stride)];
    if (v == null) continue;
    let val = v * (src.scale ?? 1);
    val = Number(val.toFixed(src.round ?? 2));
    out[year] = val;
  }
  return { values: out, updated: js.updated, url };
}

async function loadPages() {
  const { PAGES } = await import('../src/pages/index.js');
  return PAGES;
}

const near = (a, b) => a != null && b != null && Math.abs(a - b) <= Math.max(0.051, Math.abs(b) * 0.0005);

const pages = await loadPages();
const results = [];
for (const src of EUROSTAT) {
  const page = pages[src.page];
  const metric = page && page.metrics && page.metrics[src.key];
  const field = src.field || 'values';
  const label = `${src.page}.${src.key}${field === 'eu' ? ' (ЕС)' : ''}`;
  if (!metric || !metric[field]) {
    results.push({ label, src, status: 'missing', note: 'Няма такъв показател в сайта' });
    continue;
  }
  try {
    const { values, updated, url } = await fetchSeries(src);
    const current = metric[field];
    const changes = [];
    YEARS.forEach((y, i) => {
      const fresh = values[y];
      if (fresh == null) return;
      if (current[i] == null) changes.push({ year: y, old: null, new: fresh, kind: 'нова година' });
      else if (!near(current[i], fresh)) changes.push({ year: y, old: current[i], new: fresh, kind: 'ревизия' });
    });
    const newer = Object.keys(values).map(Number).filter((y) => y > YEARS[YEARS.length - 1]);
    results.push({ label, src, field, status: changes.length ? 'changed' : 'ok', changes, newer, updated, url });
  } catch (e) {
    results.push({ label, src, status: 'error', note: e.message });
  }
  process.stdout.write('.');
}
process.stdout.write('\n');

// Запис на промените в src/pages/<страница>.js (само масиви от числа).
const applied = [];
if (APPLY) {
  const byPage = {};
  for (const r of results.filter((x) => x.status === 'changed')) (byPage[r.src.page] ||= []).push(r);
  for (const [pageId, rs] of Object.entries(byPage)) {
    const file = path.join(ROOT, 'src/pages', pageId + '.js');
    let text = await readFile(file, 'utf8');
    for (const r of rs) {
      const metric = pages[pageId].metrics[r.src.key];
      const oldArr = metric[r.field];
      // Търси числов масив с дължина YEARS, който е равен на текущите стойности,
      // евентуално в друга мерна единица (напр. млн. вместо млрд.): литерал × k = стойност.
      const re = /\[((?:\s*(?:-?\d+(?:\.\d+)?|null)\s*,){10,}\s*(?:-?\d+(?:\.\d+)?|null)\s*)\]/g;
      let done = false;
      text = text.replace(re, (whole, body) => {
        if (done) return whole;
        const raw = body.split(',').map((s) => s.trim());
        const nums = raw.map((s) => (s === 'null' ? null : Number(s)));
        if (nums.length !== oldArr.length) return whole;
        const k = [1, 0.001, 1000, 100, 0.01].find((f) => nums.every((n, i) => (n == null && oldArr[i] == null) || (n != null && oldArr[i] != null && near(n * f, oldArr[i]))));
        if (k == null) return whole;
        done = true;
        const decimals = Math.max(...raw.map((s) => (s.includes('.') ? s.split('.')[1].length : 0)));
        const next = nums.slice();
        for (const c of r.changes) next[YEARS.indexOf(c.year)] = Number((c.new / k).toFixed(decimals + (k === 1 ? 1 : 0)));
        return `[${next.map((v) => (v == null ? 'null' : v)).join(', ')}]`;
      });
      if (done) applied.push(r.label);
      else r.applyNote = 'Масивът не е намерен (стойностите се изчисляват) — обновете ръчно.';
    }
    await writeFile(file, text);
  }
}

// Отчет
const changed = results.filter((r) => r.status === 'changed');
const errors = results.filter((r) => r.status !== 'ok' && r.status !== 'changed');
const newer = [...new Set(results.flatMap((r) => r.newer || []))].sort();
const md = [];
md.push(`# Отчет за обновяване на данните — ${new Date().toISOString().slice(0, 10)}`, '');
md.push(`Проверени редове от Евростат: ${results.length}. С промени: ${changed.length}. Проблеми: ${errors.length}.`);
if (APPLY) md.push(`Записани автоматично: ${applied.length}.`);
md.push('');
if (newer.length) md.push(`> **Има данни за нова година (${newer.join(', ')}).** Добавете я в YEARS (src/lib/format.js) и удължете всички масиви — вижте UPDATING.md.`, '');
md.push('## Промени от Евростат', '');
if (!changed.length) md.push('Няма промени.', '');
for (const r of changed) {
  md.push(`### ${r.label} — ${r.src.dataset}`);
  for (const c of r.changes) md.push(`- ${c.year}: ${c.old ?? '—'} → **${c.new}** (${c.kind})`);
  if (r.applyNote) md.push(`- ⚠ ${r.applyNote}`);
  md.push('');
}
if (errors.length) {
  md.push('## Проблеми', '');
  for (const r of errors) md.push(`- **${r.label}** (${r.src.dataset}): ${r.note}`);
  md.push('');
}
md.push('## За ръчна проверка (няма API)', '');
md.push('| Какво | Откъде | Къде в сайта | Кога излиза |', '|---|---|---|---|');
for (const m of MANUAL) md.push(`| ${m.what} | ${m.where} | ${m.files.join('<br>')} | ${m.when} |`);
md.push('', 'След промени: обновете текстовете „Накратко“, началната страница (src/pages/home.js) и пуснете `npm test` и `npm run build`.');

await mkdir(path.join(ROOT, 'data'), { recursive: true });
await writeFile(path.join(ROOT, 'data/update-report.md'), md.join('\n') + '\n');
await writeFile(path.join(ROOT, 'data/update-report.json'), JSON.stringify(results.map(({ src, ...r }) => ({ ...r, dataset: src.dataset, params: src.params })), null, 2));
console.log(`Готово: ${changed.length} с промени, ${errors.length} проблема. Отчет: data/update-report.md`);
