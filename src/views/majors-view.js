import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { navigate } from '../lib/router.js';
import { findArticleMeta, getArticleDetail, blockPlainText } from '../lib/article-api.js';

const FAV_KEY = 'lcode:majors:favorites';
const QUICK = ['计算机', '安全工程', '临床医学', '法学', '会计', '机械', '电气', '土木', '汉语言', '金融'];
let majorIndexPromise = null;

function readFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch { return []; }
}
function writeFavs(list) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(list.slice(0, 80))); } catch {}
}

async function buildMajorIndex() {
  if (majorIndexPromise) return majorIndexPromise;
  majorIndexPromise = (async () => {
    const meta = await findArticleMeta(a => /306个专业详细介绍|专业详细介绍/.test(a.title || ''));
    if (!meta) throw new Error('没有找到专业介绍资料');
    const article = await getArticleDetail(meta.id);
    const rows = [];
    for (const b of article.blocks || []) {
      const text = blockPlainText(b).replace(/\s+/g, ' ').trim();
      if (text.length < 8) continue;
      rows.push({ idx: b.idx ?? rows.length, text, lower: text.toLowerCase() });
    }
    return { article, rows };
  })();
  return majorIndexPromise;
}

export async function initMajorsView(initialQ = '') {
  const host = document.getElementById('view-host');
  host.innerHTML = `
    <main class="app-main majors-page">
      <section class="hero hero-article majors-hero">
        <div class="hero-stickers" aria-hidden="true"><span>${icon('book', 22)}</span></div>
        <h1 class="hero-title">专业查询</h1>
        <p class="hero-sub">从“306 个专业详细介绍、学生/毕业生分享”中检索专业体验；不需要账号，收藏保存在本机。</p>
        <div class="global-search-box">
          <span class="search-icon">${icon('search', 19)}</span>
          <input id="major-search-input" class="input" type="search" placeholder="搜专业：计算机 / 安全工程 / 临床医学 / 法学" autocomplete="off" value="${escapeHtml(initialQ)}" />
        </div>
        <div class="search-scope-row quick-major-row">
          ${QUICK.map(q => `<button type="button" class="chip" data-major-chip="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('')}
        </div>
      </section>
      <section id="major-favs" class="major-favs"></section>
      <section id="major-state" class="search-state"><div class="skeleton" style="height:18px;width:180px;margin-bottom:12px"></div><div class="skeleton" style="height:110px;width:100%"></div></section>
      <section id="major-results" class="major-results"></section>
    </main>
  `;

  let data;
  try { data = await buildMajorIndex(); }
  catch (err) {
    host.querySelector('#major-state').innerHTML = `<div class="empty-state"><div class="empty-state-title">专业资料加载失败</div><div class="empty-state-text">${escapeHtml(err.message || '未知错误')}</div></div>`;
    return;
  }

  const input = host.querySelector('#major-search-input');
  const state = host.querySelector('#major-state');
  const results = host.querySelector('#major-results');
  let timer = null;

  const renderFavs = () => {
    const favs = readFavs();
    const wrap = host.querySelector('#major-favs');
    wrap.innerHTML = favs.length ? `
      <div class="major-fav-card">
        <strong>本机收藏</strong>
        <div>${favs.map(f => `<button type="button" class="chip" data-major-chip="${escapeHtml(f)}">${escapeHtml(f)}</button>`).join('')}</div>
      </div>
    ` : '';
  };

  const run = () => {
    const q = input.value.trim();
    if (!q) {
      state.innerHTML = `<div class="search-hint">已载入 ${data.rows.length} 段专业资料，输入专业名或点击上方快捷词。</div>`;
      results.innerHTML = renderStarter(data.article.id);
      return;
    }
    const rows = searchMajorRows(data.rows, q).slice(0, 40);
    state.innerHTML = `<div class="search-hint"><strong>${rows.length}</strong> 条专业体验片段 · 关键词「${escapeHtml(q)}」</div>`;
    results.innerHTML = rows.length ? rows.map(r => renderMajorCard(r, q, data.article.id)).join('') : `
      <div class="empty-state"><div class="empty-state-emoji">🎓</div><div class="empty-state-title">没找到这个专业</div><div class="empty-state-text">可以试试简称、学科大类或少输入几个字。</div></div>
    `;
  };

  host.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-major-chip]');
    if (chip) {
      input.value = chip.dataset.majorChip;
      run();
      input.focus();
      return;
    }
    const fav = e.target.closest('[data-fav-major]');
    if (fav) {
      const name = fav.dataset.favMajor;
      const list = readFavs();
      const next = list.includes(name) ? list.filter(x => x !== name) : [name, ...list];
      writeFavs(next);
      renderFavs();
      run();
      return;
    }
    const open = e.target.closest('[data-open-article]');
    if (open) navigate(`/article/${open.dataset.openArticle}`);
  });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 120); });
  renderFavs();
  run();
  input.focus();
}

function searchMajorRows(rows, q) {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return rows.map(row => {
    let score = 0;
    for (const t of terms) {
      const pos = row.lower.indexOf(t);
      if (pos >= 0) score += 20 + Math.max(0, 20 - Math.floor(pos / 40));
      const count = (row.lower.match(new RegExp(escapeReg(t), 'g')) || []).length;
      score += Math.min(count * 4, 20);
    }
    return { ...row, score };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);
}

function renderStarter(articleId) {
  return `
    <div class="major-starter">
      <div class="major-starter-card">
        <h3>怎么用？</h3>
        <p>输入专业名称、学科方向、就业关键词，就能看到原资料中的学生/毕业生分享片段。</p>
      </div>
      <button type="button" class="major-starter-card as-button" data-open-article="${articleId}">
        <h3>打开完整原文</h3>
        <p>如果想从头浏览 306 个专业，也可以直接看完整文章。</p>
      </button>
    </div>
  `;
}

function renderMajorCard(row, q, articleId) {
  const title = guessMajorTitle(row.text, q);
  const snippet = makeSnippet(row.text, q);
  const favs = readFavs();
  const fav = favs.includes(title);
  return `
    <article class="major-card">
      <div class="major-card-top">
        <h3>${escapeHtml(title)}</h3>
        <button type="button" class="chip major-fav-btn${fav ? ' active' : ''}" data-fav-major="${escapeHtml(title)}">${fav ? '已收藏' : '收藏'}</button>
      </div>
      <p>${highlight(snippet, q)}</p>
      <div class="major-card-actions">
        <span class="text-muted text-small">资料段落 #${row.idx}</span>
        <button type="button" class="btn btn-secondary btn-sm" data-open-article="${articleId}">打开完整原文 ${icon('chevronRight', 13)}</button>
      </div>
    </article>
  `;
}

function guessMajorTitle(text, q) {
  const cleanQ = q.trim();
  const around = text.slice(Math.max(0, text.indexOf(cleanQ) - 16), text.indexOf(cleanQ) + cleanQ.length + 18);
  const patterns = [
    /([\u4e00-\u9fa5]{2,14}工程)/,
    /([\u4e00-\u9fa5]{2,14}学)/,
    /([\u4e00-\u9fa5]{2,14}专业)/,
    /([\u4e00-\u9fa5]{2,14})(?:毕业之后|就业|学些什么|好不好)/,
  ];
  for (const re of patterns) {
    const m = around.match(re) || text.slice(0, 80).match(re);
    if (m) return m[1].replace(/专业$/, '专业');
  }
  return cleanQ.length <= 18 ? cleanQ : cleanQ.slice(0, 18);
}

function makeSnippet(text, q) {
  const lower = text.toLowerCase();
  const term = q.toLowerCase().split(/\s+/).filter(Boolean)[0] || q.toLowerCase();
  const pos = lower.indexOf(term);
  if (pos < 0) return text.slice(0, 220);
  return text.slice(Math.max(0, pos - 70), Math.min(text.length, pos + 260)).replace(/^\S{0,16}/, '…');
}
function highlight(text, q) {
  let out = escapeHtml(text || '');
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  for (const t of terms) out = out.replace(new RegExp(`(${escapeReg(t)})`, 'gi'), '<mark>$1</mark>');
  return out;
}
function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
