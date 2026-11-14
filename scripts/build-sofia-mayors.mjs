import { readFileSync, writeFileSync } from 'node:fs';

const [src, out] = process.argv.slice(2);
const md = readFileSync(src, 'utf8').split('\n');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s) =>
  esc(s)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
const slug = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
const badge = (cell) =>
  cell.replace(/(^|[\s/→,(])([ДМСТО])(?=$|[\s/→,)(])/g, (m, p, l) => `${p}<span class="ev ev-${l}">${l}</span>`);
const num = (v) => v.toFixed(1).replace('.', ',');

// ---------- data for the custom visuals ----------
const mayors = [
  { name: 'Стефан Софиянски', key: 'Софиянски', term: '1995 – 2005', score: 3.8, sub: [6, 2, 5, 3, 3, 4] },
  { name: 'Бойко Борисов', key: 'Борисов', term: '2005 – 2009', score: 4.8, sub: [7, 3, 6, 4, 4, 5] },
  { name: 'Йорданка Фандъкова', key: 'Фандъкова', term: '2009 – 2023', score: 5.5, sub: [8, 5, 6, 4, 4, 6] },
  { name: 'Васил Терзиев', key: 'Терзиев', term: '2023 – (предварителна)', score: 5.2, sub: [5, 5, 6, 5, 5, 5] },
];
const mayorCrit = ['Инфраструктура', 'Отпадъци, въздух', 'Финанси и дълг', 'Почтеност', 'Градоустройство', 'Основни услуги'];
const councils = [
  ['1995–1999', 4.0, [2, 4, 3, 7]], ['1999–2003', 3.8, [2, 4, 2, 7]], ['2003–2007', 3.0, [3, 3, 3, 3]], ['2007–2011', 5.3, [4, 5, 4, 8]],
  ['2011–2015', 5.8, [4, 6, 5, 8]], ['2015–2019', 5.0, [3, 5, 5, 7]], ['2019–2023', 4.3, [3, 4, 4, 6]], ['2023–2027*', 3.3, [3, 4, 4, 2]],
];
const councilCrit = ['Контрол', 'Ключови решения', 'Почтеност', 'Стабилност'];

const C = { right: '#2F7FD1', rad: '#8CC0F0', bsp: '#D62828', gerb: '#12355B', ssd: '#F2A33A', ger: '#8DB634', ndsv: '#E8C400', ataka: '#5B3A29', vmro: '#8B1E3F', ppdb: '#6A4C93', vaz: '#2E7D4F', itn: '#17A2B8', kod: '#7FA8D9', other: '#9A9A9A' };
const seats = [
  ['1995', 'Софиянски', 'medium', [['ОДО (водена от СДС)', 31, C.right], ['Коалиция на БСП', 23, C.bsp], ['„Народен съюз“', 5, C.ger], ['ББ', 1, C.other], ['БКП', 1, C.other]]],
  ['1999', 'Софиянски', 'medium', [['ОДС', 27, C.right], ['БДС „Радикали“', 11, C.rad], ['БСП', 14, C.bsp], ['„Другите за София“', 7, C.ssd], ['БРСП', 1, C.other], ['Независим', 1, C.other]]],
  ['2003', 'Софиянски → Борисов', 'high', [['БСП', 19, C.bsp], ['СДС', 16, C.right], ['ССД (Софиянски)', 15, C.ssd], ['„Гергьовден“–БЗНС-НС–ДП', 7, C.ger], ['НДСВ', 4, C.ndsv]]],
  ['2007', 'Борисов → Фандъкова', 'high', [['ГЕРБ', 33, C.gerb], ['БСП', 12, C.bsp], ['„Обединение за София“ (СДС+ДСБ)', 11, C.right], ['„Атака“', 3, C.ataka], ['НДСВ', 2, C.ndsv]]],
  ['2011', 'Фандъкова', 'high', [['ГЕРБ', 33, C.gerb], ['БСП', 15, C.bsp], ['Синята коалиция', 8, C.right], ['„Атака“', 2, C.ataka], ['НДСВ', 2, C.ndsv], ['ВМРО', 1, C.vmro]]],
  ['2015', 'Фандъкова', 'high', [['ГЕРБ', 30, C.gerb], ['Реформаторски блок', 11, C.right], ['БСП', 7, C.bsp], ['ВМРО', 3, C.vmro], ['„Сердика“', 3, C.other], ['„Глас народен“', 2, C.other], ['„Движение 21“', 2, C.other], ['„Атака“', 2, C.ataka], ['Зелените', 1, C.vaz]]],
  ['2019', 'Фандъкова', 'high', [['ГЕРБ–СДС', 27, C.gerb], ['БСП', 15, C.bsp], ['„Демократична България“', 12, C.right], ['ВМРО', 4, C.vmro], ['„Атака“', 2, C.ataka], ['Борис Бонев (незав.)', 1, C.other]]],
  ['2023', 'Терзиев', 'high', [['ПП–ДБ–„Спаси София“', 23, C.ppdb], ['ГЕРБ–СДС', 14, C.gerb], ['БСП', 9, C.bsp], ['„Възраждане“', 8, C.vaz], ['ИТН', 3, C.itn], ['КОД / „Синя София“', 3, C.kod], ['ВМРО', 1, C.vmro]]],
];
const confLabel = { medium: 'средна достоверност', high: 'висока достоверност' };
for (const [y, , , p] of seats) {
  const sum = p.reduce((a, x) => a + x[1], 0);
  if (sum !== 61) throw new Error(`seats ${y} sum to ${sum}`);
}

const tone = (v) => (v >= 7 ? 'hi' : v >= 5 ? 'mid' : v >= 4 ? 'low' : 'bad');
const bars = (vals, labels) =>
  vals.map((v, i) => `<div class="bar"><span class="bl">${labels[i]}</span><span class="bt"><i class="t-${tone(v)}" style="width:${v * 10}%"></i></span><b>${v}</b></div>`).join('');

const scoreboardHtml = `
<div class="cards">${mayors.map((m) => `
  <a class="card" href="#@@${m.key}">
    <div class="ch"><div><h4>${m.name}</h4><p>${m.term}</p></div><div class="score t-${tone(m.score)}">${num(m.score)}<small>/10</small></div></div>
    ${bars(m.sub, mayorCrit)}
  </a>`).join('')}
</div>
<h4 class="sub">Общински съвети (по мандат)</h4>
<div class="cards c4">${councils.map(([t, s, sub]) => `
  <div class="card">
    <div class="ch"><div><h4>${t}</h4></div><div class="score sm t-${tone(s)}">${num(s)}<small>/10</small></div></div>
    ${bars(sub, councilCrit)}
  </div>`).join('')}
</div>
<p class="note">* предварителна оценка — мандатът не е приключил. Оценките са преценка на този доклад по описаните по-горе критерии, а не официална мярка. Таблиците по-долу повтарят същите числа.</p>`;

const seatsHtml = `
<div class="seats">${seats.map(([y, mayor, conf, parties]) => `
  <div class="srow">
    <div class="sy"><b>${y}</b><span>${mayor}</span><span class="conf conf-${conf}">${confLabel[conf]}</span></div>
    <div class="sbarwrap">
      <div class="sbar" role="img" aria-label="${y}: ${esc(parties.map((p) => `${p[0]} ${p[1]}`).join(', '))}">
        ${parties.map(([n, k, c]) => `<span style="flex:${k};background:${c}" title="${esc(n)}: ${k} мандата">${k >= 3 ? k : ''}</span>`).join('')}
        <em class="maj" title="Граница на мнозинството: 31 от 61"></em>
      </div>
      <div class="sleg">${parties.map(([n, k, c]) => `<span><i style="background:${c}"></i>${esc(n)} <b>${k}</b></span>`).join('')}</div>
    </div>
  </div>`).join('')}
  <p class="note">Всяка лента показва 61-те мандата според изборния резултат; пунктирът отбелязва мнозинството от 31. Цветовете групират сродни партии (синьо: десницата, произлязла от СДС; тъмносиньо: ГЕРБ; червено: БСП).</p>
</div>`;

// ---------- markdown → html ----------
let html = '';
let title = '';
let lede = '';
const toc = [];
let lastH3 = '';
let pendingVisual = null;
let i = 0;
const isTable = (l) => l.startsWith('|');
const cells = (l) => l.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());

while (i < md.length) {
  const l = md[i];
  if (!l.trim()) { i++; continue; }
  if (l.startsWith('# ')) { title = l.slice(2).trim(); i++; continue; }
  if (l.startsWith('## ')) {
    const t = l.slice(3).trim();
    const id = slug(t);
    toc.push([id, t]);
    html += `</section><section id="${id}"><h2>${inline(t)}</h2>`;
    lastH3 = '';
    i++; continue;
  }
  if (l.startsWith('### ')) {
    const t = l.slice(4).trim();
    lastH3 = t;
    const cls = /^Какво се получи/.test(t) ? ' class="good"' : /^Какво не се получи/.test(t) ? ' class="bad"' : '';
    html += `<h3 id="${slug(t)}"${cls}>${inline(t)}</h3>`;
    if (t === 'Класиране') html += scoreboardHtml;
    if (t.startsWith('Разпределение на мандатите')) pendingVisual = seatsHtml;
    i++; continue;
  }
  if (isTable(l)) {
    const rows = [];
    while (i < md.length && isTable(md[i])) { rows.push(cells(md[i])); i++; }
    const head = rows[0];
    const body = rows.slice(2);
    const evCol = head.findIndex((h) => h === 'Доказателство');
    let kind = '';
    if (head[0] === 'Добро' || /^Какво се получи/.test(lastH3)) kind = ' good';
    if (head[0] === 'Лошо' || /^Какво не се получи/.test(lastH3)) kind = ' bad';
    if (pendingVisual) { html += pendingVisual; pendingVisual = null; }
    html += `<div class="tw${kind}"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>`;
    for (const r of body) {
      html += '<tr>' + head.map((_, c) => {
        let v = inline(r[c] ?? '');
        if (c === evCol) v = badge(v);
        return `<td${c === evCol ? ' class="evc"' : ''}>${v}</td>`;
      }).join('') + '</tr>';
    }
    html += '</tbody></table></div>';
    continue;
  }
  if (l.startsWith('- ')) {
    html += '<ul>';
    while (i < md.length && md[i].startsWith('- ')) { html += `<li>${inline(md[i].slice(2))}</li>`; i++; }
    html += '</ul>';
    continue;
  }
  if (!lede) { lede = inline(l); i++; continue; }
  html += `<p>${inline(l)}</p>`;
  i++;
}
html = html.replace(/^<\/section>/, '') + '</section>';
if (/\]\(/.test(html)) throw new Error('unconverted markdown link left in output');
for (const m of mayors) {
  const hit = toc.find(([, t]) => t.startsWith(m.key));
  if (!hit) throw new Error(`no section heading starts with ${m.key}`);
  html = html.replaceAll(`#@@${m.key}`, `#${hit[0]}`);
}
const badgeCount = (html.match(/class="ev ev-/g) || []).length;
if (badgeCount < 100) throw new Error(`only ${badgeCount} evidence badges — check the Доказателство column and labels`);

const short = (t) => t.replace(/\s*[:(—].*$/, '').trim();
const nav = toc.map(([id, t]) => `<a href="#${id}">${esc(short(t))}</a>`).join('');

const page = `<!doctype html>
<html lang="bg">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Кметовете и СОС на София, 1995–2026</title>
<meta name="description" content="Оценка на кметовете и общинските съвети на София от 1995 г. насам, основана на документи и данни: какво свърши всеки добре и зле, как бяха разпределени 61-те мандата в СОС и твърдите показатели зад оценките.">
<link rel="canonical" href="https://dobrinov.github.io/bulgaria-in-numbers/sofia-mayors.html">
<meta property="og:type" content="article">
<meta property="og:locale" content="bg_BG">
<meta property="og:site_name" content="България в цифри">
<meta property="og:title" content="Кметовете и СОС на София, 1995–2026">
<meta property="og:description" content="Четирима кмета и осем общински съвета, оценени по документи и данни.">
<meta property="og:url" content="https://dobrinov.github.io/bulgaria-in-numbers/sofia-mayors.html">
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="./apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,700;0,900;1,400&amp;display=swap">
<style>
:root{--bg:#FFFDF4;--ink:#111;--mut:#5b5b55;--line:#e4dfc9;--yel:#FFE11A;--teal:#1E9C8C;--good:#0F6B2E;--bad:#B3261E;--card:#fff}
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:400 17px/1.6 Rubik,Arial,sans-serif;overflow-x:hidden}
a{color:inherit;text-decoration-color:var(--teal);text-underline-offset:2px}a:hover{color:var(--good)}
header{background:var(--ink);color:#fff;padding:44px 20px 40px}
.wrap{max-width:1080px;margin:0 auto}
.back{display:inline-block;color:var(--yel);font-weight:700;font-size:15px;text-decoration:none;margin-bottom:18px}.back:hover{color:#fff;text-decoration:underline}
.kick{margin:0 0 14px;color:var(--yel);font-weight:700;font-style:italic}
h1{margin:0;font-weight:900;font-size:clamp(38px,7vw,84px);line-height:1;letter-spacing:-2px;text-wrap:balance}
.meta{margin:18px 0 0;color:#cfcfc6;font-size:15px}
.stripe{height:12px;background:var(--teal)}
nav{position:sticky;top:0;z-index:5;background:var(--yel);border-bottom:3px solid var(--ink);overflow-x:auto;white-space:nowrap}
nav .wrap{display:flex;gap:4px;padding:8px 16px}
nav a{font-weight:700;font-size:14px;text-decoration:none;padding:6px 10px;border-radius:6px}
nav a:hover{background:var(--ink);color:var(--yel)}
main{padding:0 16px 80px}
.lede{font-size:19px;line-height:1.6;margin:36px 0 0;padding:22px 24px;background:var(--card);border:3px solid var(--ink);border-radius:12px;box-shadow:6px 6px 0 var(--ink)}
section{scroll-margin-top:60px}
h2{font-weight:900;font-size:clamp(26px,3.6vw,40px);line-height:1.12;letter-spacing:-.5px;margin:64px 0 16px;padding-top:20px;border-top:6px solid var(--ink);text-wrap:balance}
h3{font-weight:700;font-size:22px;line-height:1.25;margin:38px 0 12px;scroll-margin-top:60px}
h3.good{color:var(--good)}h3.bad{color:var(--bad)}
h4{margin:0;font-size:18px;font-weight:700}h4.sub{margin:30px 0 12px}
p{margin:0 0 14px;max-width:78ch}
ul{max-width:100%;padding-left:20px}li{margin-bottom:10px;overflow-wrap:anywhere}
.tw{overflow-x:auto;margin:14px 0 22px;border:2px solid var(--ink);border-radius:10px;background:var(--card)}
.tw.good{border-top:8px solid var(--good)}.tw.bad{border-top:8px solid var(--bad)}
table{border-collapse:collapse;width:100%;min-width:640px;font-size:15px;line-height:1.45}
th{background:var(--ink);color:#fff;text-align:left;font-weight:700;padding:9px 12px;vertical-align:bottom}
td{padding:9px 12px;border-top:1px solid var(--line);vertical-align:top}
tbody tr:nth-child(even) td{background:#fbf8ea}
td:first-child{min-width:260px}
td.evc{white-space:nowrap;min-width:0}
.ev{display:inline-block;min-width:22px;text-align:center;font-weight:700;font-size:12px;border-radius:5px;padding:1px 5px;color:#fff}
.ev-Д{background:#0F6B2E}.ev-М{background:#2F5FA8}.ev-С{background:#9A6B00}.ev-Т{background:#B3261E}.ev-О{background:#6b6b6b}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:8px 0}
.card{display:block;text-decoration:none;background:var(--card);border:3px solid var(--ink);border-radius:12px;padding:16px;box-shadow:4px 4px 0 var(--ink)}
a.card:hover{color:inherit;transform:translate(-1px,-1px);box-shadow:6px 6px 0 var(--teal)}
.ch{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:12px}
.ch p{margin:2px 0 0;color:var(--mut);font-size:14px}
.score{font-weight:900;font-size:44px;line-height:1;white-space:nowrap}.score.sm{font-size:32px}
.score small{font-size:14px;font-weight:500;color:var(--mut)}
.score.t-hi,.score.t-mid{color:var(--good)}.score.t-low{color:#9A6B00}.score.t-bad{color:var(--bad)}
.bar{display:grid;grid-template-columns:minmax(0,1fr) 70px 18px;align-items:center;gap:8px;font-size:13px;margin-top:5px}
.bl{color:var(--mut);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bt{height:9px;background:#ece7d2;border-radius:5px;overflow:hidden}
.bt i{display:block;height:100%}
i.t-hi{background:#0F6B2E}i.t-mid{background:#1E9C8C}i.t-low{background:#E0A100}i.t-bad{background:#B3261E}
.bar b{text-align:right}
.note{color:var(--mut);font-size:14px;margin-top:10px}
.seats{margin:10px 0 24px;background:var(--card);border:3px solid var(--ink);border-radius:12px;padding:18px;box-shadow:4px 4px 0 var(--ink)}
.srow{display:grid;grid-template-columns:150px minmax(0,1fr);gap:14px;padding:12px 0;border-top:1px solid var(--line)}
.srow:first-child{border-top:0;padding-top:0}
.sy b{display:block;font-size:26px;font-weight:900;line-height:1}
.sy span{display:block;font-size:13px;color:var(--mut)}
.conf{margin-top:4px;font-weight:700}.conf-medium{color:#9A6B00!important}.conf-high{color:var(--good)!important}
.sbar{position:relative;display:flex;gap:2px;height:34px;border-radius:6px;overflow:hidden}
.sbar span{display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;min-width:3px}
.maj{position:absolute;left:calc(31 / 61 * 100%);top:0;bottom:0;width:0;border-left:3px dashed #fff;mix-blend-mode:difference}
.sleg{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:8px;font-size:13px}
.sleg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px}
footer{background:var(--ink);color:#cfcfc6;padding:28px 20px;font-size:14px}
@media (max-width:640px){body{font-size:16px}.srow{grid-template-columns:1fr;gap:8px}.lede{font-size:17px;padding:16px}}
@media print{nav{display:none}.card,.seats,.lede{box-shadow:none}}
</style>
</head>
<body>
<header><div class="wrap">
  <a class="back" href="./">← България в цифри</a>
  <p class="kick">Кметовете на София и Столичният общински съвет, 1995 – 2026, оценени по доказателствата</p>
  <h1>${esc(title)}</h1>
  <p class="meta">Към 14 ноември 2026 г. · оценките са преценка на доклада по обявени критерии, а не официална мярка · всяко число води към източника си</p>
</div></header>
<div class="stripe"></div>
<nav><div class="wrap">${nav}</div></nav>
<main><div class="wrap">
<p class="lede">${lede}</p>
${html}
</div></main>
<footer><div class="wrap">Съставено от публични документи: доклади на Сметната палата, отчети за бюджета и дълга на Столична община, документи на СОС, Евростат, съдебни решения и медийни публикации. Етикети за доказателствата: <span class="ev ev-Д">Д</span> документирано · <span class="ev ev-М">М</span> медийна информация · <span class="ev ev-С">С</span> самоотчет на общината · <span class="ev ev-Т">Т</span> твърдение или обвинение · <span class="ev ev-О">О</span> само откъс от търсачка.</div></footer>
</body>
</html>
`;
writeFileSync(out, page);
console.log('ok', page.length, 'bytes;', toc.length, 'sections;', (page.match(/<table>/g) || []).length, 'tables;', (page.match(/<a href="http/g) || []).length, 'links');
