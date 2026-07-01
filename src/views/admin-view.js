// 独立管理后台 — aggregate panel for school view rankings, comment management,
// article management, and school info override editing.
import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { navigate } from '../lib/router.js';
import { toast, confirmDialog } from '../lib/ui.js';
import {
  isAdmin, setAdmin, promptAdmin,
  topViewedSchools, getViewCount, getAllViews,
  getComments, deleteComment, getAllComments,
  getAllSchoolOverrides, deleteSchoolOverride,
} from '../lib/store.js';
import { getAllSchools, refreshMergedSchools } from '../lib/data.js';

const MODULE_LABEL = { guide: '新生指南', exam: '志愿填报', growth: '自我提升' };
const ADMIN_TOKEN = 'lyh20041113lyh';
const TABS = [
  { key: 'overview', label: '概览', icon: 'chart' },
  { key: 'schools', label: '学校浏览', icon: 'eye' },
  { key: 'comments', label: '评论管理', icon: 'message' },
  { key: 'articles', label: '文章管理', icon: 'book' },
  { key: 'overrides', label: '学校覆写', icon: 'edit' },
];

let state = {
  tab: 'overview',
  adminReady: false,
  articles: [],
  articleModule: 'all',
  commentsCache: null,
  overridesCache: null,
  editingArticleId: null,
};

export async function initAdminView() {
  const host = document.getElementById('view-host');
  // Gate: require admin login
  if (!isAdmin()) {
    const ok = await promptAdmin();
    if (!ok) {
      toast('密码错误或已取消');
      navigate('/');
      return;
    }
    setAdmin(true);
    window.dispatchEvent(new CustomEvent('admin-changed', { detail: true }));
  }
  state.adminReady = true;
  await getAllViews();
  try {
    state.overridesCache = await getAllSchoolOverrides();
  } catch (err) {
    console.warn('overrides load failed', err);
    state.overridesCache = {};
  }
  renderShell();
}

function renderShell() {
  const host = document.getElementById('view-host');
  host.innerHTML = `
    <main class="app-main admin-panel">
      <header class="admin-header">
        <div class="admin-header-title">
          <span class="admin-header-icon">${icon('shield', 22)}</span>
          <div>
            <h1>管理后台</h1>
            <p class="admin-header-sub">浏览统计、评论、文章与学校覆写的统一面板。</p>
          </div>
        </div>
        <button type="button" class="btn btn-secondary" id="admin-exit">${icon('x', 14)}<span>退出</span></button>
      </header>

      <nav class="admin-tabs" aria-label="管理后台标签">
        ${TABS.map(t => `
          <button type="button" class="admin-tab${state.tab === t.key ? ' active' : ''}" data-tab="${t.key}" aria-pressed="${state.tab === t.key}">
            <span class="admin-tab-icon">${icon(t.icon, 15)}</span>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </nav>

      <div id="admin-content" class="admin-content"></div>
    </main>
  `;
  host.querySelector('#admin-exit')?.addEventListener('click', () => {
    setAdmin(false);
    window.dispatchEvent(new CustomEvent('admin-changed', { detail: false }));
    navigate('/');
  });
  host.querySelectorAll('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tab = btn.dataset.tab;
      // Update active state in place instead of re-rendering the whole shell
      host.querySelectorAll('.admin-tab').forEach(b => {
        const isActive = b.dataset.tab === state.tab;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      renderTab();
    });
  });
  renderTab();
}

async function renderTab() {
  const wrap = document.getElementById('admin-content');
  if (!wrap) return;
  if (state.tab === 'overview') wrap.innerHTML = await renderOverview();
  else if (state.tab === 'schools') wrap.innerHTML = renderSchools();
  else if (state.tab === 'comments') await renderCommentsTab(wrap);
  else if (state.tab === 'articles') await renderArticlesTab(wrap);
  else if (state.tab === 'overrides') wrap.innerHTML = renderOverrides();
  bindTabEvents();
}

async function renderOverview() {
  const top = topViewedSchools(10);
  const all = getAllSchools();
  const overrides = state.overridesCache || {};
  const overrideList = Object.values(overrides);
  // Total comment count across all schools (server-backed)
  let totalComments = 0;
  try {
    const allComments = await getAllComments();
    totalComments = allComments.length;
  } catch (err) {
    console.warn('getAllComments failed', err);
  }

  const totalViews = Object.values(getAllViewSnapshot()).reduce((a, b) => a + b, 0);

  const statCards = [
    { label: '总浏览量', value: totalViews, icon: 'eye', tone: 'primary' },
    { label: '学校数', value: all.length, icon: 'building', tone: 'accent' },
    { label: '评论数', value: totalComments, icon: 'message', tone: 'success' },
    { label: '已编辑学校', value: overrideList.length, icon: 'edit', tone: 'warning' },
  ].map(c => `
    <div class="admin-stat">
      <div class="admin-stat-icon">${icon(c.icon, 18)}</div>
      <div class="admin-stat-body">
        <div class="admin-stat-num">${c.value}</div>
        <div class="admin-stat-label">${c.label}</div>
      </div>
    </div>
  `).join('');

  const topRows = top.slice(0, 8).map((t, i) => {
    const s = all.find(x => x.id === t.id);
    if (!s) return '';
    return `
      <button type="button" class="admin-row" data-school-id="${s.id}">
        <span class="admin-rank">${i + 1}</span>
        <span class="admin-row-name">${escapeHtml(s.name)}</span>
        <span class="admin-row-meta">${escapeHtml(s.province)} · ${escapeHtml(s.city || '')}</span>
        <span class="admin-row-count">${icon('eye', 13)}${t.count}</span>
      </button>
    `;
  }).join('');

  return `
    <section class="admin-section">
      <h2 class="admin-section-title">数据概览</h2>
      <div class="admin-stats">${statCards}</div>
    </section>
    <section class="admin-section">
      <h2 class="admin-section-title">浏览 TOP</h2>
      <div class="admin-rows">${topRows || '<div class="text-muted">暂无数据</div>'}</div>
    </section>
  `;
}

let viewsSnapshot = null;
function getAllViewSnapshot() {
  if (viewsSnapshot == null) {
    // topViewedSchools/getViewCount read from the same cache; just iterate ids
    const all = getAllSchools();
    const out = {};
    for (const s of all) out[s.id] = getViewCount(s.id);
    viewsSnapshot = out;
  }
  return viewsSnapshot;
}

function renderSchools() {
  const all = getAllSchools();
  const rows = all
    .map(s => ({ s, v: getViewCount(s.id) }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 50);
  const items = rows.map(({ s, v }, i) => `
    <button type="button" class="admin-row" data-school-id="${s.id}">
      <span class="admin-rank">${i + 1}</span>
      <span class="admin-row-name">${escapeHtml(s.name)}</span>
      <span class="admin-row-meta">${escapeHtml(s.province)} · ${escapeHtml(s.city || '')}</span>
      <span class="admin-row-count">${icon('eye', 13)}${v}</span>
    </button>
  `).join('');
  return `
    <section class="admin-section">
      <h2 class="admin-section-title">学校浏览量（前 50）</h2>
      <p class="admin-section-sub text-muted">点击学校可进入详情页编辑信息。</p>
      <div class="admin-rows">${items || '<div class="text-muted">暂无数据</div>'}</div>
    </section>
  `;
}

async function renderCommentsTab(wrap) {
  wrap.innerHTML = `<div class="admin-loading">${icon('eye', 16)}<span>加载评论…</span></div>`;
  try {
    // Pull all comments from the server (newest first)
    const allComments = await getAllComments();
    const all = getAllSchools();
    const schoolMap = new Map(all.map(s => [s.id, s.name]));
    const enriched = allComments.map(c => ({ ...c, schoolName: schoolMap.get(c.schoolId) || `#${c.schoolId}` }));
    enriched.sort((a, b) => b.createdAt - a.createdAt);
    state.commentsCache = enriched;
    const items = enriched.slice(0, 200).map(c => `
      <article class="admin-comment" data-comment-id="${c.id}" data-school-id="${c.schoolId}">
        <header class="admin-comment-head">
          <span class="admin-comment-author">${escapeHtml(c.author)}</span>
          <span class="admin-comment-school" data-school-id="${c.schoolId}">${escapeHtml(c.schoolName)}</span>
          <span class="admin-comment-time">${escapeHtml(new Date(c.createdAt).toLocaleString())}</span>
        </header>
        <p class="admin-comment-body">${escapeHtml(c.body)}</p>
        <footer class="admin-comment-foot">
          <button type="button" class="btn btn-secondary btn-sm" data-comment-jump="${c.id}">查看学校</button>
          <button type="button" class="btn btn-danger btn-sm" data-comment-delete="${c.id}">${icon('trash', 13)}<span>删除</span></button>
        </footer>
      </article>
    `).join('');
    wrap.innerHTML = `
      <section class="admin-section">
        <h2 class="admin-section-title">评论管理（全部学校，前 200 条）</h2>
        <p class="admin-section-sub text-muted">评论存储于服务器 SQLite，删除将永久删除并影响所有访问端。</p>
        <div class="admin-comments">${items || '<div class="text-muted">还没有评论。</div>'}</div>
      </section>
    `;
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state" style="padding: 48px 16px;">
      <div class="empty-state-title">加载失败</div>
      <div class="empty-state-text">${escapeHtml(err.message || '')}</div>
    </div>`;
  }
}

async function renderArticlesTab(wrap) {
  wrap.innerHTML = `<div class="admin-loading">${icon('eye', 16)}<span>加载文章…</span></div>`;
  try {
    const r = await fetch('/api/articles');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const list = await r.json();
    state.articles = Array.isArray(list) ? list : [];
    const moduleFilter = state.articleModule || 'all';
    const filtered = moduleFilter === 'all' ? state.articles : state.articles.filter(a => a.module === moduleFilter);
    const grouped = {};
    for (const a of filtered) {
      const key = `${a.module}/${a.category}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    }
    const groups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

    const filterBar = `
      <div class="filter-bar admin-filter-bar">
        <button type="button" class="chip${moduleFilter === 'all' ? ' active' : ''}" data-mod="all">全部 ${state.articles.length}</button>
        ${['guide', 'exam', 'growth'].map(m => {
          const n = state.articles.filter(a => a.module === m).length;
          return `<button type="button" class="chip${moduleFilter === m ? ' active' : ''}" data-mod="${m}">${MODULE_LABEL[m]} ${n}</button>`;
        }).join('')}
        <span style="flex: 1"></span>
        <button type="button" class="btn btn-primary btn-sm" id="article-new">${icon('plus', 14)}<span>新建文章</span></button>
      </div>
    `;

    const groupsHtml = groups.map(([key, items]) => {
      const [mod, cat] = key.split('/');
      return `
        <section class="admin-article-group">
          <h3 class="admin-article-group-title">${escapeHtml(MODULE_LABEL[mod] || mod)} · ${escapeHtml(cat)} <span class="text-muted">(${items.length})</span></h3>
          <div class="admin-article-items">
            ${items.map(a => `
              <div class="admin-article-item">
                <button type="button" class="admin-article-item-main" data-article-edit="${a.id}">
                  <div class="admin-article-item-title">${escapeHtml(a.title)}</div>
                  <div class="admin-article-item-meta">
                    <span>${a.raw_len || 0} 字</span>
                    ${a.source ? `<span class="dot"></span><span class="text-muted">${escapeHtml(a.source)}</span>` : ''}
                  </div>
                </button>
                <div class="admin-article-item-actions">
                  <button type="button" class="btn btn-secondary btn-sm" data-article-view="${a.id}" title="前台预览">${icon('eye', 13)}</button>
                  <button type="button" class="btn btn-danger btn-sm" data-article-delete="${a.id}" title="删除">${icon('trash', 13)}</button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');

    wrap.innerHTML = `
      <section class="admin-section">
        <h2 class="admin-section-title">文章管理</h2>
        <p class="admin-section-sub text-muted">点击文章打开编辑器，可修改标题/分类/正文 blocks。保存后前台立即生效。</p>
        ${filterBar}
        ${groupsHtml || '<div class="text-muted">暂无文章</div>'}
      </section>
    `;
  } catch (err) {
    wrap.innerHTML = `<div class="empty-state" style="padding: 48px 16px;">
      <div class="empty-state-title">加载失败</div>
      <div class="empty-state-text">${escapeHtml(err.message || '')}</div>
    </div>`;
  }
}

async function openArticleEditor(articleId) {
  let article;
  if (articleId === 'new') {
    article = { id: null, module: state.articleModule === 'all' ? 'guide' : state.articleModule, category: '', title: '', source: '', blocks: [], rawLen: 0 };
  } else {
    const r = await fetch(`/api/articles/${articleId}`);
    if (!r.ok) { toast('加载失败'); return; }
    article = await r.json();
  }
  state.editingArticleId = articleId;

  const host = document.createElement('div');
  document.body.appendChild(host);
  host.innerHTML = `
    <dialog id="article-edit-dialog" aria-label="编辑文章">
      <form class="drawer" style="max-width: 760px;" id="article-edit-form">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem; display: flex; align-items: center; gap: 8px;">
            ${icon('edit', 18)}<span>${articleId === 'new' ? '新建文章' : '编辑文章'}</span>
          </h2>
          <button type="button" class="btn-ghost" data-close>${icon('x', 20)}</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div class="field">
            <label class="field-label" for="art-module">模块</label>
            <select class="select" id="art-module">
              ${['guide', 'exam', 'growth'].map(m => `<option value="${m}" ${article.module === m ? 'selected' : ''}>${MODULE_LABEL[m]}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label class="field-label" for="art-category">分类</label>
            <input type="text" class="input" id="art-category" value="${escapeHtml(article.category || '')}" placeholder="例如 入学须知 / 志愿规则" />
          </div>
        </div>

        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="art-title">标题</label>
          <input type="text" class="input" id="art-title" value="${escapeHtml(article.title || '')}" required />
        </div>

        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="art-source">来源（可选）</label>
          <input type="text" class="input" id="art-source" value="${escapeHtml(article.source || '')}" />
        </div>

        <div class="field" style="margin-bottom: 8px;">
          <label class="field-label">正文 blocks（每行一个段落，空行 = 段落分隔）</label>
          <textarea class="textarea" id="art-blocks" style="min-height: 280px; font-family: var(--font-mono, monospace); font-size: 0.8125rem;">${escapeHtml(blocksToText(article.blocks))}</textarea>
          <div class="text-muted text-small" style="margin-top: 4px;">
            以 <code># </code> 开头 = h2，<code>## </code> = h3，<code>&gt; </code> = 引用，<code>- </code> = 无序列表项，<code>1. </code> = 有序列表项，<code>---</code> = 分隔线，<code>**文字**</code> = 加粗，其他为段落。
          </div>
        </div>

        <div style="display: flex; gap: 8px; justify-content: flex-end; position: sticky; bottom: 0; background: var(--surface); padding-top: 12px;">
          <button type="button" class="btn btn-secondary" data-close>取消</button>
          <button type="submit" class="btn btn-primary">${icon('save', 16)}<span>保存</span></button>
        </div>
      </form>
    </dialog>
  `;
  const dlg = host.querySelector('dialog');
  dlg.showModal();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  host.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('close', () => host.remove());

  host.querySelector('#article-edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const module = host.querySelector('#art-module').value;
    const category = host.querySelector('#art-category').value.trim();
    const title = host.querySelector('#art-title').value.trim();
    const source = host.querySelector('#art-source').value.trim();
    const blocksText = host.querySelector('#art-blocks').value;
    if (!title) { toast('请填写标题'); return; }
    const blocks = textToBlocks(blocksText);
    const rawLen = blocks.reduce((n, b) => n + (b.text ? b.text.length : (b.items ? b.items.reduce((m, it) => m + (it.text || '').length, 0) : 0)), 0);
    const payload = { module, category, title, source, blocks, rawLen };
    try {
      const url = articleId === 'new' ? '/api/articles' : `/api/articles/${articleId}`;
      const method = articleId === 'new' ? 'POST' : 'PUT';
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
        body: JSON.stringify(articleId === 'new' ? payload : { title, category, blocks, rawLen }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${r.status}`);
      }
      toast(articleId === 'new' ? '已创建' : '已保存');
      dlg.close();
      renderTab();
    } catch (err) {
      toast(`保存失败：${err.message}`);
    }
  });
}

function blocksToText(blocks) {
  const out = [];
  for (const b of blocks || []) {
    if (b.type === 'h2') out.push(`# ${b.text || ''}`);
    else if (b.type === 'h3') out.push(`## ${b.text || ''}`);
    else if (b.type === 'h1') out.push(`# ${b.text || ''}`);
    else if (b.type === 'quote') out.push(`> ${b.text || ''}`);
    else if (b.type === 'hr') out.push('---');
    else if (b.type === 'ul') {
      for (const it of b.items || []) out.push(`- ${inlineToText(it)}`);
    } else if (b.type === 'ol') {
      let i = 1;
      for (const it of b.items || []) out.push(`${i++}. ${inlineToText(it)}`);
    } else {
      out.push(inlineToText(b));
    }
  }
  return out.join('\n\n');
}

function inlineToText(b) {
  if (!b) return '';
  const text = b.text || '';
  const marks = (b.marks || []).slice().sort((a, c) => a.start - c.start);
  let out = '';
  let cursor = 0;
  for (const m of marks) {
    if (m.start < cursor || m.end <= m.start) continue;
    out += text.slice(cursor, m.start);
    const inner = text.slice(m.start, m.end);
    out += m.type === 'strong' ? `**${inner}**` : `*${inner}*`;
    cursor = m.end;
  }
  out += text.slice(cursor);
  return out;
}

function textToBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let idx = 0;
  let paraBuf = [];
  const flushPara = () => {
    if (!paraBuf.length) return;
    const joined = paraBuf.join('\n').trim();
    if (joined) {
      const { text: cleanText, marks } = parseInline(joined);
      blocks.push({ type: 'p', idx: idx++, text: cleanText, marks });
    }
    paraBuf = [];
  };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { flushPara(); continue; }
    let m;
    if (line === '---') { flushPara(); blocks.push({ type: 'hr', idx: idx++ }); continue; }
    if ((m = line.match(/^##\s+(.*)$/))) { flushPara(); const { text, marks } = parseInline(m[1]); blocks.push({ type: 'h3', idx: idx++, text, marks }); continue; }
    if ((m = line.match(/^#\s+(.*)$/))) { flushPara(); const { text, marks } = parseInline(m[1]); blocks.push({ type: 'h2', idx: idx++, text, marks }); continue; }
    if ((m = line.match(/^>\s+(.*)$/))) { flushPara(); const { text, marks } = parseInline(m[1]); blocks.push({ type: 'quote', idx: idx++, text, marks }); continue; }
    if ((m = line.match(/^-\s+(.*)$/))) { flushPara(); const { text, marks } = parseInline(m[1]); blocks.push({ type: 'ul', idx: idx++, items: [{ text, marks }] }); continue; }
    if ((m = line.match(/^(\d+)\.\s+(.*)$/))) { flushPara(); const { text, marks } = parseInline(m[2]); blocks.push({ type: 'ol', idx: idx++, items: [{ text, marks }] }); continue; }
    paraBuf.push(line);
  }
  flushPara();
  return blocks;
}

function parseInline(text) {
  const marks = [];
  let clean = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        const inner = text.slice(i + 2, end);
        marks.push({ type: 'strong', start: clean.length, end: clean.length + inner.length });
        clean += inner;
        i = end + 2;
        continue;
      }
    }
    if (text[i] === '*') {
      const end = text.indexOf('*', i + 1);
      if (end !== -1) {
        const inner = text.slice(i + 1, end);
        marks.push({ type: 'em', start: clean.length, end: clean.length + inner.length });
        clean += inner;
        i = end + 1;
        continue;
      }
    }
    clean += text[i++];
  }
  return { text: clean, marks };
}

function renderOverrides() {
  const all = getAllSchools();
  const overrides = state.overridesCache || {};
  const list = Object.values(overrides).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const items = list.map(o => {
    const s = all.find(x => x.id === o.id);
    const name = s ? s.name : `#${o.id}`;
    return `
      <article class="admin-override">
        <header class="admin-override-head">
          <span class="admin-override-name">${escapeHtml(name)}</span>
          <span class="admin-override-time">${o.updatedAt ? new Date(o.updatedAt).toLocaleString() : ''}</span>
        </header>
        <details class="admin-override-details">
          <summary>查看覆写字段</summary>
          <pre class="admin-override-pre">${escapeHtml(JSON.stringify(o, null, 2))}</pre>
        </details>
        <footer class="admin-override-foot">
          <button type="button" class="btn btn-secondary btn-sm" data-override-edit="${o.id}">编辑学校</button>
          <button type="button" class="btn btn-danger btn-sm" data-override-delete="${o.id}">${icon('trash', 13)}<span>删除覆写</span></button>
        </footer>
      </article>
    `;
  }).join('');
  return `
    <section class="admin-section">
      <h2 class="admin-section-title">学校信息覆写</h2>
      <p class="admin-section-sub text-muted">覆写保存于服务器 SQLite，所有访问端共享。点击「编辑学校」跳转到学校详情页进行修改。</p>
      <div class="admin-overrides">${items || '<div class="text-muted">还没有任何覆写。</div>'}</div>
    </section>
  `;
}

function bindTabEvents() {
  const wrap = document.getElementById('admin-content');
  if (!wrap) return;
  // School row click
  wrap.querySelectorAll('[data-school-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.closest('[data-comment-jump]') || e.target.closest('[data-comment-delete]')) return;
      navigate(`/school/${btn.dataset.schoolId}`);
    });
  });
  // Comment jump
  wrap.querySelectorAll('[data-comment-jump]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('[data-comment-id]');
      navigate(`/school/${card.dataset.schoolId}`);
    });
  });
  // Comment delete
  wrap.querySelectorAll('[data-comment-delete]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const card = btn.closest('[data-comment-id]');
      const id = card.dataset.commentId;
      const schoolId = card.dataset.schoolId;
      const ok = await confirmDialog({
        title: '删除这条评论？',
        message: '该操作不可撤销，评论将从服务器 SQLite 永久删除。',
        confirmText: '删除',
        danger: true,
      });
      if (!ok) return;
      await deleteComment(Number(schoolId), id);
      toast('已删除');
      card.remove();
    });
  });
  // Article edit / view / delete / new
  wrap.querySelectorAll('[data-article-edit]').forEach(btn => {
    btn.addEventListener('click', () => openArticleEditor(btn.dataset.articleEdit));
  });
  wrap.querySelectorAll('[data-article-view]').forEach(btn => {
    btn.addEventListener('click', () => window.open(`#/article/${btn.dataset.articleView}`, '_blank'));
  });
  wrap.querySelectorAll('[data-article-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.articleDelete);
      const ok = await confirmDialog({
        title: '删除这篇文章？',
        message: '该操作不可撤销，文章将从 SQLite 永久删除。',
        confirmText: '删除',
        danger: true,
      });
      if (!ok) return;
      try {
        const r = await fetch(`/api/articles/${id}`, {
          method: 'DELETE',
          headers: { 'X-Admin-Token': ADMIN_TOKEN },
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        toast('已删除');
        renderTab();
      } catch (err) {
        toast(`删除失败：${err.message}`);
      }
    });
  });
  wrap.querySelector('#article-new')?.addEventListener('click', () => openArticleEditor('new'));
  // Article module filter
  wrap.querySelectorAll('[data-mod]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.articleModule = btn.dataset.mod;
      renderTab();
    });
  });
  // Override edit / delete
  wrap.querySelectorAll('[data-override-edit]').forEach(btn => {
    btn.addEventListener('click', () => navigate(`/school/${btn.dataset.overrideEdit}`));
  });
  wrap.querySelectorAll('[data-override-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = Number(btn.dataset.overrideDelete);
      const ok = await confirmDialog({
        title: '删除这所学校的覆写？',
        message: '服务器上对这所学校的所有修改将被清除，原始数据会恢复。',
        confirmText: '删除',
        danger: true,
      });
      if (!ok) return;
      await deleteSchoolOverride(id);
      refreshMergedSchools();
      // Refresh the in-memory overrides cache so renderOverrides() reflects the deletion.
      try {
        state.overridesCache = await getAllSchoolOverrides();
      } catch (err) {
        console.warn('overrides reload failed', err);
        state.overridesCache = {};
      }
      toast('已删除覆写');
      renderTab();
    });
  });
}
