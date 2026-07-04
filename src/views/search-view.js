import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { navigate } from '../lib/router.js';
import { getAllArticleMetas, getArticleDetail, articlePlainText } from '../lib/article-api.js';

const MODULE_LABEL = { guide: '新生指南', exam: '志愿填报', growth: '自我提升' };
let indexPromise = null;
let hydratePromise = null;
let searchTimer = null;

function buildIndex() {
  if (!indexPromise) {
    indexPromise = getAllArticleMetas().then(metas => metas.map(meta => {
      const metaText = [meta.title, meta.category, meta.source, MODULE_LABEL[meta.module]].filter(Boolean).join('\n');
      return { ...meta, text: '', hay: metaText.toLowerCase(), hydrated: false };
    }));
  }
  return indexPromise;
}

function hydrateIndex(index, onProgress) {
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    let cursor = 0;
    const worker = async () => {
      while (cursor < index.length) {
        const item = index[cursor++];
        try {
          const detail = await getArticleDetail(item.id);
          item.text = articlePlainText(detail, 140000);
          item.hay = [item.title, item.category, item.source, MODULE_LABEL[item.module], item.text].filter(Boolean).join('\n').toLowerCase();
          item.hydrated = true;
          onProgress?.();
        } catch {
          item.hydrated = true;
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    onProgress?.(true);
    return index;
  })();
  return hydratePromise;
}

function scheduleHydration(index, onProgress) {
  const run = () => hydrateIndex(index, onProgress);
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 1200 });
  else setTimeout(run, 300);
}

export async function initSearchView(initialQ = '') {
  const host = document.getElementById('view-host');
  host.innerHTML = `
    <main class="app-main search-page">
      <section class="hero hero-article search-hero">
        <div class="hero-stickers" aria-hidden="true"><span>${icon('search', 22)}</span></div>
        <h1 class="hero-title">全局资料搜索</h1>
        <p class="hero-sub">搜索文章标题、正文、分类和来源文件名。不需要登录，索引只在当前浏览器中缓存。</p>
        <div class="global-search-box">
          <span class="search-icon">${icon('search', 19)}</span>
          <input id="global-search-input" class="input" type="search" placeholder="搜：转专业 / 普通话 / 计算机基础 / 高数 / 助学金" autocomplete="off" value="${escapeHtml(initialQ)}" />
        </div>
        <div class="search-scope-row" id="search-scope">
          ${['all','guide','exam','growth'].map(k => `<button class="chip active-scope${k === 'all' ? ' active' : ''}" type="button" data-scope="${k}">${k === 'all' ? '全部' : MODULE_LABEL[k]}</button>`).join('')}
        </div>
      </section>
      <section class="search-state" id="search-state">
        <div class="skeleton" style="height:18px;width:180px;margin-bottom:12px"></div>
        <div class="skeleton" style="height:96px;width:100%;margin-bottom:10px"></div>
      </section>
      <section class="search-results" id="search-results"></section>
    </main>
  `;

  const input = host.querySelector('#global-search-input');
  const scopeWrap = host.querySelector('#search-scope');
  let scope = 'all';
  const index = await buildIndex();
  host.querySelector('#search-state').innerHTML = `<div class="search-hint">已加载 ${index.length} 篇资料标题；正文索引会在后台逐步补齐。</div>`;

  const run = () => {
    const q = input.value.trim();
    renderResults(index, q, scope);
  };
  input.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(run, 120);
  });
  scopeWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-scope]');
    if (!btn) return;
    scope = btn.dataset.scope;
    scopeWrap.querySelectorAll('[data-scope]').forEach(b => b.classList.toggle('active', b === btn));
    run();
  });
  host.querySelector('#search-results').addEventListener('click', (e) => {
    const card = e.target.closest('[data-article-id]');
    if (card) navigate(`/article/${card.dataset.articleId}`);
  });
  scheduleHydration(index, () => {
    if (input.value.trim()) run();
  });
  if (initialQ) run();
  input.focus();
}

function renderResults(index, q, scope) {
  const state = document.getElementById('search-state');
  const wrap = document.getElementById('search-results');
  if (!wrap || !state) return;
  if (!q) {
    const done = index.filter(x => x.hydrated).length;
    state.innerHTML = `<div class="search-hint">输入关键词后，会同时搜索标题和已缓存正文。正文索引进度：${done}/${index.length}</div>`;
    wrap.innerHTML = '';
    return;
  }
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const rows = index
    .filter(a => scope === 'all' || a.module === scope)
    .map(a => {
      let score = 0;
      for (const t of terms) {
        if ((a.title || '').toLowerCase().includes(t)) score += 20;
        if ((a.category || '').toLowerCase().includes(t)) score += 7;
        if ((a.source || '').toLowerCase().includes(t)) score += 5;
        const count = (a.hay.match(new RegExp(escapeReg(t), 'g')) || []).length;
        score += Math.min(count, 14);
      }
      return { ...a, score };
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60);
  const done = index.filter(x => x.hydrated).length;
  state.innerHTML = `<div class="search-hint"><strong>${rows.length}</strong> 条结果 · 关键词「${escapeHtml(q)}」 · 正文索引 ${done}/${index.length}</div>`;
  wrap.innerHTML = rows.length ? rows.map(a => renderResult(a, terms)).join('') : `
    <div class="empty-state"><div class="empty-state-emoji">🔍</div><div class="empty-state-title">没搜到相关资料</div><div class="empty-state-text">换个关键词试试，例如“转专业”“普通话”“宿舍”。</div></div>
  `;
}

function renderResult(a, terms) {
  const snippet = makeSnippet(a.text || '', terms) || a.source || '';
  return `
    <button type="button" class="search-result-card" data-article-id="${a.id}">
      <div class="search-result-top">
        <span class="article-card-cat">${escapeHtml(MODULE_LABEL[a.module] || '资料')}</span>
        <span class="article-card-source">${escapeHtml(a.category || '')}</span>
        ${!a.hydrated ? '<span class="search-indexing">正文索引中</span>' : ''}
      </div>
      <h3>${highlight(a.title || '', terms)}</h3>
      <p>${highlight(snippet, terms)}</p>
      <div class="search-result-foot"><span>${icon('doc', 13)}${escapeHtml(a.source || '平台资料')}</span><span>阅读全文 ${icon('chevronRight', 13)}</span></div>
    </button>
  `;
}

function makeSnippet(text, terms) {
  if (!text) return '';
  const lower = text.toLowerCase();
  let pos = -1;
  for (const t of terms) {
    pos = lower.indexOf(t);
    if (pos >= 0) break;
  }
  if (pos < 0) return text.slice(0, 120);
  return text.slice(Math.max(0, pos - 45), Math.min(text.length, pos + 120)).replace(/^\S{0,12}/, '…');
}
function highlight(text, terms) {
  let out = escapeHtml(text || '');
  for (const t of terms) out = out.replace(new RegExp(`(${escapeReg(t)})`, 'gi'), '<mark>$1</mark>');
  return out;
}
function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
