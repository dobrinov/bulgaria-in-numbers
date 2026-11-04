// Начална страница: какво показват данните и всички теми по групи.
import { GROUPS } from './registry.js';
import { esc } from '../lib/format.js';
import { hashFor } from '../lib/state.js';

// Водещо число за всяка тема (официални стойности от съответния раздел).
const HEADLINES = {
  population: { value: '6 423 207', caption: 'души към 31.12.2025 г.', badge: 'НСИ' },
  income: { value: '66%', caption: 'от средния за ЕС БВП на човек по покупателна способност, 2024 г. (49% през 2015 г.)', badge: 'Евростат' },
  health: { value: '75,8 г.', caption: 'продължителност на живота, 2024 г. (ЕС: 81,5)', badge: 'Евростат' },
  regions: { value: '×5,3', caption: 'разлика в БВП на човек между София и Сливен, 2024 г.', badge: 'НСИ, Евростат, МВР' },
  economy: { value: '116,5 млрд. €', caption: 'БВП, 2025 г. — 2,5 пъти повече от 2015 г. в текущи цени (без отчитане на инфлацията)', badge: 'Евростат' },
  budget: { value: '29,9%', caption: 'държавен дълг към БВП, 2025 г. (34,8 млрд. €)', badge: 'НСИ' },
  taxes: { value: '30,6%', caption: 'от БВП са данъци и осигуровки, 2025 г. (35,6 млрд. €)', badge: 'Евростат' },
  admin: { value: '133 275', caption: 'заети щатни места в държавната администрация, вкл. МВР, края на 2025 г.', badge: 'Министерски съвет' },
  security: { value: '54,2%', caption: 'разкриваемост на престъпленията, 2025 г.', badge: 'МВР' },
  justice: { value: '27%', caption: 'смятат съда за независим, 2025 г. (ЕС: 54%)', badge: 'Евростат, ВСС' },
  energy: { value: '13,6 ц./kWh', caption: 'ток за домакинствата, 2025 г. (ЕС: 29,0) — в евро, без отчитане на доходите', badge: 'Евростат' },
  links: { value: '2015 = 100', caption: 'сравнете всички показатели на една графика', badge: '' },
};

const FACTS = [
  { v: '−10,2%', tone: 'bad', page: 'population', label: 'Население', text: 'от 7,15 на 6,42 млн. души, заради отрицателен естествен прираст и преброяването от 2021 г.' },
  { v: '+5,1%', tone: 'muted', page: 'admin', label: 'Администрация', text: 'заетите щатни места (вкл. МВР) растат от 126 808 на 133 275 (2016 → 2025), докато населението намалява с 9,6%.' },
  { v: '×2,1', tone: 'good', page: 'links', label: 'Реална заплата', text: 'средната заплата расте почти 3 пъти, а цените — с 42%.' },
  { v: '−30%', tone: 'good', page: 'security', label: 'Регистрирани престъпления', text: 'намаляват (може да се дължи и на по-малко подадени сигнали), а разкриваемостта расте от 40,1% на 54,2%.' },
  { v: '−4,0%', tone: 'bad', page: 'budget', label: 'Бюджет', text: 'дефицит всяка година от 2020 г.; през 2025 г. е над тавана на ЕС от 3% от БВП.' },
  { v: '9,3 → 12,3%', tone: 'muted', page: 'admin', label: 'Заплати на всички наети от държавата', text: 'учители, лекари, полицаи, военни, администрация — като дял от БВП растат по-бързо от икономиката.' },
];

const arrow = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

function topicCard(p) {
  const h = HEADLINES[p.id];
  const dark = p.id === 'links';
  return `
    <a class="topic${dark ? ' dark' : ''}" href="${hashFor(p.id)}">
      <span class="topic-title">${esc(p.label)}<span class="tone-good">${arrow}</span></span>
      <span class="topic-value num">${esc(h.value)}</span>
      <span class="topic-caption">${esc(h.caption)}</span>
      ${h.badge ? `<span class="badge badge-official">Официални данни · ${esc(h.badge)}</span>` : ''}
      <span class="topic-caption">${esc(p.desc)}</span>
    </a>`;
}

export default {
  id: 'home',
  render: () => `
  <section class="hero">
    <p class="eyebrow">Отворени данни за страната</p>
    <h1>Как се променя България — година по година</h1>
    <p class="lead">Население, доходи, здраве, бюджет и държава от 2015 г. насам, събрани от НСИ, Евростат, МВР и други официални източници. Всяко число показва откъде идва.</p>
    <div class="row-wrap">
      <a class="btn" href="${hashFor('regions')}">Моята област →</a>
      <a class="btn-outline" href="${hashFor('links')}">Какво се променя заедно</a>
    </div>
  </section>

  <section class="card" aria-labelledby="facts-h">
    <div class="card-head">
      <div><h2 id="facts-h">Какво показват данните, 2015 → 2025</h2></div>
      <a class="link-strong" href="${hashFor('links')}">Всички връзки и корелации →</a>
    </div>
    <ol class="facts">${FACTS.map((f) => `
      <li><strong class="num tone-${f.tone}">${esc(f.v)}</strong>
        <span><a href="${hashFor(f.page)}">${esc(f.label)}</a>: ${esc(f.text)}</span></li>`).join('')}
    </ol>
  </section>

  <section aria-labelledby="topics-h" class="stack-lg">
    <h2 id="topics-h">Теми</h2>
    ${GROUPS.map((g) => `
      <div class="topic-group">
        <header><h3>${esc(g.label)}</h3><span class="muted">${esc(g.desc)}</span></header>
        <div class="topic-grid">${g.pages.map(topicCard).join('')}</div>
      </div>`).join('')}
  </section>

  <section class="card" aria-labelledby="how-h">
    <div class="grid-cards">
      <div class="stack"><h2 id="how-h">Как работи сайтът</h2>
        <p class="muted">Всеки раздел показва показателите за избрана година, промяната спрямо предходната и тенденцията от 2015 г. Изберете област на картата — изборът се запазва, докато го изчистите.</p></div>
      <div class="stack"><span class="badge badge-official">Официални данни</span>
        <p class="muted">Стойността е от публикация на НСИ, Евростат или съответното ведомство.</p></div>
      <div class="stack"><span class="badge badge-estimate">Оценка</span>
        <p class="muted">Изчислена от официални данни по описан метод, например дългът по правителства.</p></div>
    </div>
  </section>`,
};
