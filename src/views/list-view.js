import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { renderSchoolCard, renderSkeletonList, renderEmptyState } from './school-card.js';
import { renderFilterChips } from './filter-chips.js';
import { renderFilterPanel } from './filter-panel.js';
import { countComments } from '../lib/store.js';
import { navigate } from '../lib/router.js';
import { isAdmin } from '../lib/store.js';

const PAGE_SIZE = 20;

const defaultState = () => ({
  q: '',
  province: '',
  city: '',
  cityType: '',
  level: '',
  nature: '',
  bedDesk: '',
  dormAC: '',
  privateBath: '',
  subway: '',
  roomSize: '',
  nightPowerOff: '',
  nightNetOff: '',
  sort: 'default',
  page: 1,
});

let state = defaultState();
let allSchools = [];
let filtered = [];

export function setState(patch) {
  state = { ...state, ...patch };
  applyFilter();
  renderResultsOnly();
  syncFilterChipsUI();
}

export function getState() { return state; }

export async function initView(schools, facets) {
  allSchools = schools;
  state.facets = facets;
  applyFilter();
  renderAll();
}

function applyFilter() {
  const q = state.q.trim().toLowerCase();
  filtered = allSchools.filter(s => {
    if (q) {
      const hay = `${s.name} ${s.province} ${s.city} ${s.address || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (state.province && s.province !== state.province) return false;
    if (state.city && s.city !== state.city) return false;
    if (state.cityType && s.cityType !== state.cityType) return false;
    if (state.level && s.level !== state.level) return false;
    if (state.nature && s.nature !== state.nature) return false;
    const f = s.facilities || {};
    if (state.bedDesk && f.bedDesk !== state.bedDesk) return false;
    if (state.dormAC && f.dormAC !== state.dormAC) return false;
    if (state.privateBath && f.privateBath !== state.privateBath) return false;
    if (state.subway) {
      const v = (s.around || {}).subway;
      if (state.subway === 'yes' && v !== 'yes') return false;
      if (state.subway === 'no' && v !== 'no') return false;
      if (state.subway === 'partial' && v !== 'partial') return false;
    }
    if (state.roomSize) {
      const sizes = String(f.roomSize || '').split(/[、,，]/).map(x => x.trim());
      if (!sizes.includes(state.roomSize)) return false;
    }
    if (state.nightPowerOff === 'no' && !(f.nightPowerOff || '').includes('不断电')) return false;
    if (state.nightPowerOff === 'yes' && (f.nightPowerOff || '').includes('不断电')) return false;
    if (state.nightNetOff === 'no' && !(f.nightNetOff || '').includes('不断网')) return false;
    if (state.nightNetOff === 'yes' && (f.nightNetOff || '').includes('不断网')) return false;
    return true;
  });

  if (state.sort === 'comments') {
    filtered.sort((a, b) => countComments(b.id) - countComments(a.id));
  } else if (state.sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans'));
  }
}

function renderAll() {
  const host = document.getElementById('view-host');
  const listHtml = `
    <main class="app-main">
      <section class="hero">
        <h1 class="hero-title">查宿舍，挑学校</h1>
        <p class="hero-sub">三千所院校的宿舍与设施一目了然。搜索、筛选、读评论，在 90 秒内排出你的短名单。</p>
      </section>

      <section class="search-section">
        <div class="search">
          <span class="search-icon">${icon('search', 20)}</span>
          <input type="search" id="search-input" class="input" placeholder="学校名 / 城市 / 地址关键字" enterkeyhint="search" autocomplete="off" />
        </div>
        ${renderFilterChips(state)}
      </section>

      <div class="result-meta">
        <div class="count">
          <span><strong class="num">${filtered.length}</strong> 所学校</span>
          <select class="select" id="sort-select" style="height: 32px; font-size: 0.8125rem; padding: 0 28px 0 10px; width: auto; min-width: 110px;" aria-label="排序">
            <option value="default">默认排序</option>
            <option value="comments" ${state.sort === 'comments' ? 'selected' : ''}>评论最多</option>
            <option value="name" ${state.sort === 'name' ? 'selected' : ''}>校名 A→Z</option>
          </select>
        </div>
      </div>

      <div id="results"></div>
      <div id="pager"></div>
    </main>
  `;
  host.innerHTML = listHtml;
  bindList();
  renderResultsOnly();
}

function renderResultsOnly() {
  const results = document.getElementById('results');
  const pager = document.getElementById('pager');
  if (!results) return;

  if (filtered.length === 0) {
    results.innerHTML = renderEmptyState({
      title: '没有匹配的学校',
      text: '试着清掉一两个筛选项，或者把搜索关键字缩短一些。',
      actionLabel: '清除全部筛选',
      actionId: 'empty-clear',
    });
    document.getElementById('empty-clear')?.addEventListener('click', clearAll);
    if (pager) pager.innerHTML = '';
    return;
  }

  const start = (state.page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  results.innerHTML = `<div class="school-list">${pageItems.map(s => renderSchoolCard(s, countComments(s.id))).join('')}</div>`;

  // Bind card click
  results.querySelectorAll('[data-school-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(`/school/${btn.dataset.schoolId}`);
    });
  });

  // Render pager
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (pager) {
    if (totalPages <= 1) {
      pager.innerHTML = '';
    } else {
      const cur = state.page;
      const pages = [];
      const push = (p, label = p, disabled = false, active = false) => {
        pages.push(`<button class="pager-btn${active ? ' active' : ''}" ${disabled ? 'disabled' : ''} data-page="${p}">${label}</button>`);
      };
      push(Math.max(1, cur - 1), '上一页', cur === 1);
      const startPage = Math.max(1, cur - 2);
      const endPage = Math.min(totalPages, cur + 2);
      if (startPage > 1) { push(1); if (startPage > 2) pages.push('<span class="text-muted">…</span>'); }
      for (let p = startPage; p <= endPage; p++) push(p, p, false, p === cur);
      if (endPage < totalPages) { if (endPage < totalPages - 1) pages.push('<span class="text-muted">…</span>'); push(totalPages); }
      push(Math.min(totalPages, cur + 1), '下一页', cur === totalPages);
      pager.innerHTML = `<div class="pager">${pages.join('')}</div>`;
      pager.querySelectorAll('[data-page]').forEach(b => {
        b.addEventListener('click', () => {
          state.page = Number(b.dataset.page);
          renderResultsOnly();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }
  }
}

function syncFilterChipsUI() {
  // re-render the chip bar without re-rendering whole list (cheap)
  const bar = document.querySelector('.search-section .filter-bar');
  if (bar) bar.outerHTML = renderFilterChips(state);
  bindFilterBar();
  const sortSel = document.getElementById('sort-select');
  if (sortSel) sortSel.value = state.sort;
  const metaCount = document.querySelector('.result-meta .count strong');
  if (metaCount) metaCount.textContent = filtered.length;
}

function bindList() {
  const input = document.getElementById('search-input');
  if (input) {
    let timer;
    input.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.q = e.target.value;
        state.page = 1;
        applyFilter();
        renderResultsOnly();
        syncFilterChipsUI();
      }, 180);
    });
    input.value = state.q;
  }
  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    applyFilter();
    renderResultsOnly();
  });
  bindFilterBar();
}

function bindFilterBar() {
  document.getElementById('open-filter')?.addEventListener('click', openFilter);
  document.querySelectorAll('[data-filter-clear]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.filterClear;
      state[key] = '';
      state.page = 1;
      applyFilter();
      renderResultsOnly();
      syncFilterChipsUI();
    });
  });
  document.getElementById('clear-all-filters')?.addEventListener('click', clearAll);
}

function clearAll() {
  const keep = { q: state.q, sort: state.sort, page: 1, facets: state.facets };
  state = { ...defaultState(), ...keep };
  applyFilter();
  renderResultsOnly();
  syncFilterChipsUI();
}

function openFilter() {
  // Render panel into a container
  let panelHost = document.getElementById('filter-panel-host');
  if (!panelHost) {
    panelHost = document.createElement('div');
    panelHost.id = 'filter-panel-host';
    document.body.appendChild(panelHost);
  }
  panelHost.innerHTML = renderFilterPanel(state, state.facets || {});
  const dlg = panelHost.querySelector('dialog');
  dlg.showModal();
  // Click on backdrop closes
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  panelHost.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.filter;
      const val = btn.dataset.value;
      if (state[key] === val) {
        state[key] = '';
      } else {
        state[key] = val;
      }
      state.page = 1;
      // Update visual state of chips in panel
      panelHost.querySelectorAll(`[data-filter="${key}"]`).forEach(b => {
        b.setAttribute('aria-pressed', String(state[key] === b.dataset.value));
      });
      applyFilter();
      // Don't close — let user see the result count if they want
    });
  });
  panelHost.querySelector('[data-close-filter]')?.addEventListener('click', () => dlg.close());
  panelHost.querySelector('[data-clear-all]')?.addEventListener('click', () => {
    const keep = { q: state.q, sort: state.sort, page: 1, facets: state.facets };
    state = { ...defaultState(), ...keep };
    applyFilter();
    // refresh panel chips
    panelHost.innerHTML = renderFilterPanel(state, state.facets || {});
    // re-bind (simpler: just close and reopen)
    dlg.close();
    openFilter();
  });
  dlg.addEventListener('close', () => {
    renderResultsOnly();
    syncFilterChipsUI();
  });
}
