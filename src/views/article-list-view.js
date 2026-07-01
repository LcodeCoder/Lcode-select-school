import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { navigate } from '../lib/router.js';
import { getAllModuleViews, incrementModuleView, getModuleView } from '../lib/store.js';

const MODULE_META = {
  guide: { label: '新生指南', sub: '入学须知、物品准备、学业规划，一站式打包给新生。', icon: 'book', accent: 'primary' },
  exam: { label: '志愿填报', sub: '平行志愿、专业解读、估分策略，搞懂填志愿不踩坑。', icon: 'trophy', accent: 'accent' },
  growth: { label: '自我提升', sub: '学科基础、外语学习、考证规划，老生经验合集。', icon: 'chart', accent: 'success' },
};

const CATEGORY_FALLBACK = {
  guide: '入学须知',
  exam: '填报策略',
  growth: '学业提升',
};

let state = { module: '', category: '' };
let cache = null; // { items, categories }

export async function initArticleListView(module) {
  state = { module, category: '' };
  if (!cache || cache.module !== module) {
    cache = null;
  }
  await getAllModuleViews();
  // increment only on first entry (not when filtering) — check if we already counted
  if (!sessionStorage.getItem(`dorm:mv-counted:${module}`)) {
    incrementModuleView(module);
    sessionStorage.setItem(`dorm:mv-counted:${module}`, '1');
  }
  await loadAndRender();
}

async function loadAndRender() {
  const host = document.getElementById('view-host');
  const meta = MODULE_META[state.module] || { label: '文章', sub: '', icon: 'book', accent: 'primary' };
  const viewCount = getModuleView(state.module);

  host.innerHTML = `
    <main class="app-main">
      <section class="hero hero-article">
        <div class="hero-stickers" aria-hidden="true"><span>${icon(meta.icon, 22)}</span></div>
        <h1 class="hero-title">${escapeHtml(meta.label)}</h1>
        <p class="hero-sub">${escapeHtml(meta.sub)}</p>
        <div class="hero-meta">
          <span class="detail-views">${icon('eye', 14)}<span>${viewCount}</span></span>
        </div>
      </section>

      <div class="result-meta">
        <div class="count">
          <strong class="num" id="article-count">—</strong>
          <span class="text-muted text-small"> 篇文章</span>
        </div>
      </div>

      <div id="category-chips" class="article-chips"></div>
      <div id="article-list" class="article-list"></div>
    </main>
  `;

  try {
    const url = `/api/articles?module=${encodeURIComponent(state.module)}${state.category ? `&category=${encodeURIComponent(state.category)}` : ''}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    cache = { module: state.module, ...data };

    const countEl = document.getElementById('article-count');
    if (countEl) countEl.textContent = (data.items || []).length;

    renderChips(data.categories || []);
    renderList(data.items || [], state.module);
  } catch (err) {
    const list = document.getElementById('article-list');
    if (list) {
      list.innerHTML = `<div class="empty-state" style="padding: 64px 16px;">
        <div class="empty-state-title">加载失败</div>
        <div class="empty-state-text">${escapeHtml(err.message || '未知错误')}</div>
        <button type="button" class="btn btn-primary" onclick="location.reload()">重新加载</button>
      </div>`;
    }
  }
}

function renderChips(categories) {
  const wrap = document.getElementById('category-chips');
  if (!wrap) return;
  if (!categories || categories.length === 0) { wrap.innerHTML = ''; return; }
  const allBtn = `
    <button type="button" class="chip${state.category === '' ? ' active' : ''}" data-cat="" aria-pressed="${state.category === ''}">
      全部
    </button>
  `;
  const chips = categories.map(c => `
    <button type="button" class="chip${state.category === c.category ? ' active' : ''}" data-cat="${escapeHtml(c.category)}" aria-pressed="${state.category === c.category}">
      ${escapeHtml(c.category)}
      <span class="text-muted text-small" style="margin-left: 4px;">${c.n}</span>
    </button>
  `).join('');
  wrap.innerHTML = `<div class="filter-bar">${allBtn}${chips}</div>`;
  wrap.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      loadAndRender();
    });
  });
}

function renderList(items, module) {
  const wrap = document.getElementById('article-list');
  if (!wrap) return;
  if (items.length === 0) {
    wrap.innerHTML = `<div class="empty-state" style="padding: 64px 16px;">
      <div class="empty-state-emoji" aria-hidden="true">📄</div>
      <div class="empty-state-title">没有匹配的文章</div>
      <div class="empty-state-text">试着切换到「全部」分类，或稍后再来看看。</div>
    </div>`;
    return;
  }
  wrap.innerHTML = items.map(a => renderCard(a, module)).join('');
  wrap.querySelectorAll('[data-article-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(`/article/${btn.dataset.articleId}`);
    });
  });
}

function readingTimeLabel(rawLen) {
  const mins = Math.max(1, Math.ceil((rawLen || 0) / 500));
  if (mins < 60) return `${mins} 分钟`;
  return `${Math.round(mins / 60 * 10) / 10} 小时`;
}

function charsLabel(rawLen) {
  const n = rawLen || 0;
  if (n >= 10000) return `${(n / 10000).toFixed(1)} 万字`;
  if (n >= 1000) return `${Math.round(n / 1000)}k 字`;
  return `${n} 字`;
}

function renderCard(a, module) {
  const chars = charsLabel(a.raw_len || 0);
  const reading = readingTimeLabel(a.raw_len || 0);
  const fallbackCat = CATEGORY_FALLBACK[module] || '文章';
  const category = a.category || fallbackCat;
  return `
    <button type="button" class="article-card" data-article-id="${a.id}">
      <div class="article-card-bar" aria-hidden="true"></div>
      <div class="article-card-body">
        <div class="article-card-tags">
          <span class="article-card-cat">${escapeHtml(category)}</span>
        </div>
        <h3 class="article-card-title">${escapeHtml(a.title)}</h3>
        <div class="article-card-meta">
          <span class="article-card-meta-item">${icon('doc', 13)}<span>${chars}</span></span>
          <span class="dot"></span>
          <span class="article-card-meta-item">${icon('clock', 13)}<span>约 ${reading}</span></span>
        </div>
        <div class="article-card-foot">
          <span class="article-card-read">阅读全文</span>
          <span class="article-card-arrow" aria-hidden="true">${icon('chevronRight', 14)}</span>
        </div>
      </div>
    </button>
  `;
}

