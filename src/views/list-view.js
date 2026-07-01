import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { renderSchoolCard, renderSkeletonList, renderEmptyState } from './school-card.js';
import { renderFilterChips } from './filter-chips.js';
import { renderFilterPanel } from './filter-panel.js';
import { topViewedSchools, getViewCount, getAllComments } from '../lib/store.js';
import { navigate } from '../lib/router.js';
import { isAdmin } from '../lib/store.js';
import { getAllSchools } from '../lib/data.js';

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
// Comment counts cache (schoolId → count). Filled asynchronously after the
// list renders so comment-sort/card badges don't block the page paint.
let commentCounts = {};
let commentCountsLoaded = false;
let commentCountsInFlight = null;

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
  // Kick off comment count load in the background — cards/sort will refresh
  // when the data lands.
  loadCommentCounts();
}

async function loadCommentCounts() {
  if (commentCountsInFlight) return commentCountsInFlight;
  commentCountsInFlight = (async () => {
    try {
      const all = await getAllComments();
      const map = {};
      for (const c of all) map[c.schoolId] = (map[c.schoolId] || 0) + 1;
      commentCounts = map;
      commentCountsLoaded = true;
      // If the user is currently on a comment-sorted view, re-sort and re-render.
      if (state.sort === 'comments') {
        applyFilter();
        renderResultsOnly();
      } else {
        // Just refresh the badges on visible cards.
        refreshCommentBadges();
      }
    } catch (err) {
      console.warn('comment counts load failed', err);
    } finally {
      commentCountsInFlight = null;
    }
  })();
  return commentCountsInFlight;
}

function refreshCommentBadges() {
  document.querySelectorAll('[data-comment-count]').forEach(span => {
    const id = Number(span.dataset.commentCount);
    span.textContent = commentCounts[id] || 0;
  });
}

function schoolHay(s) {
  const f = s.facilities || {};
  const a = s.around || {};
  const parts = [
    s.name, s.province, s.city, s.address || '',
    // facility tags (values are 'yes'/'no'/'partial' or labels like '较贵')
    f.dormAC === 'yes' ? '空调 有空调' : f.dormAC === 'partial' ? '部分有空调 空调' : '',
    f.bedDesk === 'yes' ? '上床下桌' : f.bedDesk === 'partial' ? '部分上床下桌 上床下桌' : '',
    f.privateBath === 'yes' ? '卫浴 独立卫浴' : f.privateBath === 'partial' ? '部分卫浴 卫浴' : '',
    a.subway === 'yes' ? '地铁 地铁直达' : a.subway === 'partial' ? '部分地铁 地铁' : '',
    f.roomSize ? `${f.roomSize}人间 ${f.roomSize}人` : '',
    f.nightPowerOff || '',
    f.nightNetOff || '',
    f.netSpeed || '',
    f.netPrice || '',
    f.curfew || '',
    s.level || '', s.nature || '', s.cityType || '',
  ];
  return parts.filter(Boolean).join(' ');
}

function applyFilter() {
  const q = state.q.trim().toLowerCase();
  filtered = allSchools.filter(s => {
    if (q) {
      const hay = schoolHay(s).toLowerCase();
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
    if (!commentCountsLoaded) {
      // Fall back to views sort until comment counts land; the re-render will
      // be triggered by loadCommentCounts().
      filtered.sort((a, b) => getViewCount(b.id) - getViewCount(a.id));
    } else {
      filtered.sort((a, b) => (commentCounts[b.id] || 0) - (commentCounts[a.id] || 0));
    }
  } else if (state.sort === 'views') {
    filtered.sort((a, b) => getViewCount(b.id) - getViewCount(a.id));
  } else if (state.sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans'));
  }
}

function renderHotBoard() {
  const top = topViewedSchools(5);
  if (top.length === 0) return '';
  const all = getAllSchools();
  const rankColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
  const items = top.map((t, i) => {
    const s = all.find(x => x.id === t.id);
    if (!s) return '';
    const rank = i + 1;
    const color = rankColors[i] || 'var(--muted-2)';
    return `
      <button type="button" class="hot-item" data-school-id="${s.id}">
        <span class="hot-rank" style="color: ${color};">${rank}</span>
        <span class="hot-name">${escapeHtml(s.name)}</span>
        <span class="hot-views">${icon('eye', 14)}<span>${t.count}</span></span>
      </button>
    `;
  }).join('');
  return `
    <section class="hot-board" aria-label="热搜学校排名">
      <div class="hot-board-head">
        <div class="hot-board-title">
          <span class="hot-board-icon">${icon('flame', 18)}</span>
          <span>热搜学校 TOP 5</span>
        </div>
        <span class="hot-board-sub">按浏览次数排序</span>
      </div>
      <div class="hot-board-list">${items}</div>
    </section>
  `;
}

function renderNotices() {
  const items = [
    {
      icon: 'book',
      tone: 'primary',
      title: '免费简历网站',
      text: '一站式简历制作工具，免费导出，帮你轻松搞定求职第一步。',
      action: { label: '立即访问', href: 'https://resume.lcode.space', external: true },
    },
    {
      icon: 'message',
      tone: 'accent',
      title: '详细无偿高考咨询',
      text: '志愿填报、专业选择、宿舍与校园生活，一对一免费答疑，扫码即可添加。',
      action: { label: '查看个人二维码', image: 'qy.jpg' },
    },
  ];
  const cards = items.map((n) => {
    const actionHtml = n.action
      ? n.action.image
        ? `<button type="button" class="notice-action" data-notice-image="${n.action.image}">${escapeHtml(n.action.label)}${icon('chevronRight', 16)}</button>`
        : `<a class="notice-action" href="${escapeHtml(n.action.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(n.action.label)}${icon('chevronRight', 16)}</a>`
      : '';
    return `
      <article class="notice-card notice-${n.tone}" data-tone="${n.tone}">
        <div class="notice-icon">${icon(n.icon, 20)}</div>
        <div class="notice-body">
          <h3 class="notice-title">${escapeHtml(n.title)}</h3>
          <p class="notice-text">${escapeHtml(n.text)}</p>
        </div>
        ${actionHtml}
      </article>
    `;
  }).join('');
  return `
    <section class="notices" aria-label="公告通知">
      <div class="notices-head">
        <span class="notices-title">${icon('info', 16)}<span>公告</span></span>
        <span class="notices-sub">精选服务 · 全部免费</span>
      </div>
      <div class="notices-list">${cards}</div>
    </section>
  `;
}

function bindNotices() {
  document.querySelectorAll('[data-notice-image]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.noticeImage;
      const dlg = document.createElement('dialog');
      dlg.className = 'notice-dialog';
      dlg.innerHTML = `
        <div class="notice-dialog-inner">
          <button type="button" class="notice-dialog-close" aria-label="关闭">${icon('x', 20)}</button>
          <div class="notice-dialog-head">
            <span class="notice-dialog-badge">${icon('message', 16)}</span>
            <div>
              <div class="notice-dialog-title">详细无偿高考咨询</div>
              <div class="notice-dialog-sub">扫描下方二维码，添加企业微信</div>
            </div>
          </div>
          <div class="notice-dialog-img-wrap">
            <img src="${src}" alt="qy.jpg 咨询二维码" />
          </div>
          <p class="notice-dialog-tip">长按或右键保存图片，随时扫码添加</p>
        </div>
      `;
      document.body.appendChild(dlg);
      dlg.showModal();
      const close = () => { dlg.close(); setTimeout(() => dlg.remove(), 60); };
      dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
      dlg.querySelector('.notice-dialog-close').addEventListener('click', close);
      dlg.addEventListener('close', () => { if (dlg.isConnected) close(); });
    });
  });
}

function renderAll() {
  const host = document.getElementById('view-host');
  const listHtml = `
    <main class="app-main">
      <section class="hero">
        <div class="hero-stickers" aria-hidden="true"><span>🛏️</span><span>🚿</span><span>📶</span></div>
        <h1 class="hero-title">查宿舍，挑学校</h1>
        <p class="hero-sub">三千所院校的宿舍与设施一目了然。搜索、筛选、读评论，在 90 秒内排出你的短名单。</p>
      </section>

      ${renderNotices()}

      ${renderHotBoard()}

      <section class="search-section">
        <div class="search">
          <span class="search-icon">${icon('search', 20)}</span>
          <input type="search" id="search-input" class="input" placeholder="学校名 / 城市 / 空调 / 上床下桌 / 卫浴 / 地铁 …" enterkeyhint="search" autocomplete="off" />
        </div>
        ${renderFilterChips(state)}
      </section>

      <div class="result-meta">
        <div class="count">
          <span><strong class="num">${filtered.length}</strong> 所学校</span>
          <select class="select" id="sort-select" style="height: 32px; font-size: 0.8125rem; padding: 0 28px 0 10px; width: auto; min-width: 110px;" aria-label="排序">
            <option value="default">默认排序</option>
            <option value="views" ${state.sort === 'views' ? 'selected' : ''}>浏览最多</option>
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
  bindHotBoard();
  bindNotices();
  renderResultsOnly();
}

function bindHotBoard() {
  document.querySelectorAll('.hot-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(`/school/${btn.dataset.schoolId}`);
    });
  });
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

  results.innerHTML = `<div class="school-list">${pageItems.map(s => renderSchoolCard(s, commentCounts[s.id] || 0)).join('')}</div>`;

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
