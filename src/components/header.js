// Горна лента: лого, къде се намираме и бутон „Раздели“.
import { GROUPS, findPage } from '../pages/registry.js';
import { esc } from '../lib/format.js';
import { hashFor } from '../lib/state.js';

export function renderHeader(state) {
  const cur = findPage(state.route);
  const crumb = cur ? `${cur.group} › ${cur.label}` : '';
  const open = state.navOpen;
  const panel = open ? `
    <nav id="nav-panel" class="nav-panel" aria-label="Всички раздели">
      <div class="wrap nav-grid">
        ${GROUPS.map((g) => `
          <div class="nav-group">
            <span class="eyebrow-dark">${esc(g.label)}</span>
            ${g.pages.map((p) => `
              <a href="${hashFor(p.id)}" class="nav-link${p.id === state.route ? ' is-current' : ''}"${p.id === state.route ? ' aria-current="page"' : ''}>
                <strong>${esc(p.label)}</strong><span>${esc(p.desc)}</span>
              </a>`).join('')}
          </div>`).join('')}
        <div class="nav-group">
          <span class="eyebrow-dark">Начало</span>
          <a href="${hashFor('home')}" class="nav-link${state.route === 'home' ? ' is-current' : ''}"><strong>Начало</strong><span>Обзор на всички раздели</span></a>
        </div>
      </div>
    </nav>` : '';
  return `
  <header class="site-header">
    <div class="wrap header-row">
      <a class="logo" href="${hashFor('home')}">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><rect x="1" y="1" width="30" height="30" rx="6" fill="none" stroke="#fff" stroke-width="2"/><path d="M8 22 L13 15 L18 18 L24 9" fill="none" stroke="#8FB0FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>България в цифри</span>
      </a>
      <span class="crumb">${esc(crumb)}</span>
      <button type="button" class="nav-toggle${open ? ' is-open' : ''}" data-action="toggle-nav" aria-expanded="${open}" aria-controls="nav-panel">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="${open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}"/></svg>
        ${open ? 'Затвори' : 'Раздели'}
      </button>
    </div>
    ${panel}
  </header>`;
}
