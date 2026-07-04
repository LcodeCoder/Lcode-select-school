import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { normalizeArticle, isPutonghuaTitle, pinyinPattern } from '../lib/article-normalizer.js';
import { navigate } from '../lib/router.js';

const MODULE_LABEL = { guide: '新生指南', exam: '志愿填报', growth: '自我提升' };
const READING_SPEED = 500; // chars per minute (Chinese)
const TRUNCATE_THRESHOLD = 30000; // Articles >30k chars get truncated with a "show all" toggle
const articleCache = new Map();

function formatArticleDate(s) {
  if (!s) return '';
  const d = new Date(s.replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return s;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function readingTimeLabel(rawLen) {
  const mins = Math.max(1, Math.ceil((rawLen || 0) / READING_SPEED));
  if (mins >= 60) return `${(mins / 60).toFixed(1)} 小时`;
  return `${mins} 分钟`;
}

function charsLabel(rawLen) {
  const n = rawLen || 0;
  if (n >= 10000) return `${(n / 10000).toFixed(1)} 万字`;
  if (n >= 1000) return `${Math.round(n / 1000)}k 字`;
  return `${n} 字`;
}

// Apply {type, start, end} marks to plain text by slicing and wrapping ranges.
function renderInline(text, marks, context = {}) {
  if (!text) return '';
  const sorted = (marks || []).slice().sort((a, b) => a.start - b.start);
  let out = '';
  let cursor = 0;
  for (const m of sorted) {
    if (m.start < cursor || m.end <= m.start) continue;
    out += escapeHtml(text.slice(cursor, m.start));
    const inner = escapeHtml(text.slice(m.start, m.end));
    out += m.type === 'em' ? `<em>${inner}</em>` : `<strong>${inner}</strong>`;
    cursor = m.end;
  }
  out += escapeHtml(text.slice(cursor));
  return context.pinyin ? renderRubyText(out) : out;
}

function renderRubyText(escapedText) {
  const pinyin = pinyinPattern();
  const han = '[\\u4e00-\\u9fff]{1,8}';
  const wordPair = new RegExp(`(${han})\\((${pinyin}(?:\\s*[,，、]\\s*${pinyin})*)\\)`, 'g');
  return escapedText.replace(wordPair, (_m, word, py) => {
    return `<ruby class="py-ruby"><rb>${word}</rb><rt>${py.replace(/[,，、]/g, ' ')}</rt></ruby>`;
  });
}

function renderExamInline(text) {
  const escaped = escapeHtml(text || '');
  return escaped
    .replace(/\s+(A|B|C|D)[．\.:：、)]\s*/g, '<br><span class="exam-option-label">$1.</span> ')
    .replace(/\s+(答案[:：]?\s*[^\s<]{1,24})/g, '<br><span class="exam-answer">$1</span>')
    .replace(/\s+(第\d+题)/g, '<br><strong>$1</strong>')
    .replace(/^<br>/, '');
}

function blockToHtml(b, anchorPrefix, article = {}) {
  const pinyin = isPutonghuaTitle(article.title);
  switch (b.type) {
    case 'h1':
      return `<h2 class="article-h article-h1" id="${anchorPrefix}-${b.idx}">${renderInline(b.text, b.marks, { pinyin })}</h2>`;
    case 'h2':
      return `<h2 class="article-h article-h2" id="${anchorPrefix}-${b.idx}">${renderInline(b.text, b.marks, { pinyin })}</h2>`;
    case 'h3':
      return `<h3 class="article-h article-h3" id="${anchorPrefix}-${b.idx}">${renderInline(b.text, b.marks, { pinyin })}</h3>`;
    case 'quote':
      return `<blockquote class="article-quote">${renderInline(b.text, b.marks, { pinyin })}</blockquote>`;
    case 'hr':
      return `<hr class="article-hr" />`;
    case 'ul':
      return `<ul class="article-ul">${(b.items || []).map(it => `<li>${renderInline(it.text, it.marks, { pinyin })}</li>`).join('')}</ul>`;
    case 'ol':
      return `<ol class="article-ol">${(b.items || []).map(it => `<li>${renderInline(it.text, it.marks, { pinyin })}</li>`).join('')}</ol>`;
    case 'p':
    default:
      if (b.variant === 'exam') return `<p class="article-p article-preline article-exam-p">${renderExamInline(b.text)}</p>`;
      if (b.variant === 'pinyin') return `<p class="article-p article-pinyin-p">${renderInline(b.text, b.marks, { pinyin: true })}</p>`;
      return `<p class="article-p">${renderInline(b.text, b.marks, { pinyin })}</p>`;
  }
}

function buildToc(blocks, anchorPrefix) {
  const headings = blocks.filter(b => b.type === 'h2' || b.type === 'h3');
  if (headings.length < 3) return '';
  const items = headings.map(h => {
    const cls = h.type === 'h3' ? 'article-toc-item sub' : 'article-toc-item';
    return `<a href="#${anchorPrefix}-${h.idx}" class="${cls}" data-toc-idx="${h.idx}">${escapeHtml(h.text || '')}</a>`;
  }).join('');
  return `
    <details class="article-toc">
      <summary>
        <span>${icon('list', 16)}</span>
        <span>目录</span>
        <span class="article-toc-count">${headings.length} 节</span>
      </summary>
      <nav class="article-toc-nav">${items}</nav>
    </details>
  `;
}

export async function initArticleDetailView(id) {
  const host = document.getElementById('view-host');
  host.innerHTML = renderLoading();

  let article = null;
  try {
    article = articleCache.get(String(id));
    if (!article) {
      const r = await fetch(`/api/articles/${encodeURIComponent(id)}`);
      if (!r.ok) {
        if (r.status === 404) {
          host.innerHTML = renderNotFound();
          return;
        }
        throw new Error(`HTTP ${r.status}`);
      }
      article = normalizeArticle(await r.json());
      articleCache.set(String(id), article);
    }
  } catch (err) {
    host.innerHTML = renderError(err.message || '未知错误');
    return;
  }

  const allBlocks = Array.isArray(article.blocks) ? article.blocks : [];
  const anchorPrefix = `art-${article.id}`;
  const moduleLabel = MODULE_LABEL[article.module] || '列表';
  const date = formatArticleDate(article.createdAt);
  const chars = charsLabel(article.rawLen);
  const reading = readingTimeLabel(article.rawLen);
  const tocHtml = buildToc(allBlocks, anchorPrefix);
  const isHuge = (article.rawLen || 0) > TRUNCATE_THRESHOLD;
  const visibleBlocks = isHuge ? allBlocks.slice(0, 120) : allBlocks;
  const blocksHtml = visibleBlocks.length === 0
    ? `<p class="article-p text-muted">这篇文章暂无正文内容。</p>`
    : visibleBlocks.map(b => blockToHtml(b, anchorPrefix, article)).join('\n');
  const practiceCta = /题库|考试题/.test(article.title || '') ? `
    <div class="article-tool-cta">
      <div>
        <strong>这篇适合刷题模式</strong>
        <p>题目和选项已单独拆分，答案可隐藏/显示，练习进度保存在本机浏览器。</p>
      </div>
      <button type="button" class="btn btn-primary" id="open-practice">${icon('book', 15)}<span>进入刷题模式</span></button>
    </div>
  ` : '';
  const expandNotice = isHuge ? `
    <div class="article-truncate-notice" id="truncate-notice">
      <div class="article-truncate-inner">
        <div class="article-truncate-text">
          <strong>已显示前 ${visibleBlocks.length} 段</strong>（共 ${allBlocks.length} 段，${chars}）。该文档体量巨大，先保留首屏阅读速度。
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="expand-article">${icon('chevronDown', 14)}<span>展开全部</span></button>
      </div>
    </div>
  ` : '';

  host.innerHTML = `
    <main class="app-main article-detail">
      <div class="reading-progress" id="reading-progress" aria-hidden="true"><div class="reading-progress-bar"></div></div>

      <div class="detail-back-row">
        <a href="#/${article.module}" class="detail-back" data-back="${article.module}">
          ${icon('back', 16)}<span>返回${moduleLabel}</span>
        </a>
      </div>

      <article class="article-content">
        <header class="article-head">
          <div class="article-head-tags">
            <a href="#/${article.module}" class="article-module-pill" data-back="${article.module}">${moduleLabel}</a>
            <span class="tag tag-info">${escapeHtml(article.category)}</span>
          </div>
          <h1 class="article-title">${escapeHtml(article.title)}</h1>
          <div class="article-meta">
            <span class="article-meta-item">${icon('doc', 14)}<span>${chars}</span></span>
            <span class="dot"></span>
            <span class="article-meta-item">${icon('clock', 14)}<span>约 ${reading}</span></span>
            ${date ? `<span class="dot"></span><span class="article-meta-item">${icon('calendar', 14)}<span>${date}</span></span>` : ''}
          </div>
          ${article.source ? `<div class="article-source text-muted">来源：${escapeHtml(article.source)}</div>` : ''}
        </header>

        ${tocHtml}

        ${practiceCta}

        <div class="article-body" id="article-body">
          ${blocksHtml}
        </div>

        ${expandNotice}

        <footer class="article-foot">
          <a href="#/${article.module}" class="btn btn-secondary" data-back="${article.module}">
            ${icon('back', 14)}<span>返回${moduleLabel}</span>
          </a>
        </footer>
      </article>
    </main>
  `;

  host.querySelector('#open-practice')?.addEventListener('click', () => navigate(`/practice/${article.id}`));

  // "展开全部" — render remaining blocks into the body
  if (isHuge) {
    host.querySelector('#expand-article')?.addEventListener('click', () => {
      const body = host.querySelector('#article-body');
      const notice = host.querySelector('#truncate-notice');
      if (body) {
        const rest = allBlocks.slice(visibleBlocks.length);
        body.insertAdjacentHTML('beforeend', rest.map(b => blockToHtml(b, anchorPrefix, article)).join('\n'));
      }
      notice?.remove();
    });
  }

  host.querySelectorAll('[data-back]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate('/' + el.dataset.back);
    });
  });

  // TOC smooth-scroll
  host.querySelectorAll('[data-toc-idx]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = host.querySelector(`#${anchorPrefix}-${a.dataset.tocIdx}`);
      if (target) {
        const headerOffset = 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', `#${anchorPrefix}-${a.dataset.tocIdx}`);
      }
    });
  });

  // Reading progress bar
  const progressBar = host.querySelector('#reading-progress .reading-progress-bar');
  if (progressBar) {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      progressBar.style.transform = `scaleX(${pct})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  // reset counted flag so re-entering module list counts a new view
  sessionStorage.removeItem(`dorm:mv-counted:${article.module}`);

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderLoading() {
  return `
    <main class="app-main">
      <div class="school-list mt-6">
        <div class="card" style="padding: 14px 16px;">
          <div class="skeleton" style="height: 22px; width: 50%; margin-bottom: 12px;"></div>
          <div class="skeleton" style="height: 14px; width: 30%; margin-bottom: 24px;"></div>
          <div class="skeleton" style="height: 12px; width: 90%; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 12px; width: 88%; margin-bottom: 8px;"></div>
          <div class="skeleton" style="height: 12px; width: 92%;"></div>
        </div>
      </div>
    </main>
  `;
}

function renderNotFound() {
  return `
    <main class="app-main">
      <div class="empty-state" style="padding: 80px 16px;">
        <div class="empty-state-emoji" aria-hidden="true">🔍</div>
        <div class="empty-state-title">找不到这篇文章</div>
        <div class="empty-state-text">它可能被移除，或者链接有问题。</div>
        <button type="button" class="btn btn-primary" onclick="location.hash = '#/'">回到首页</button>
      </div>
    </main>
  `;
}

function renderError(message) {
  return `
    <main class="app-main">
      <div class="empty-state" style="padding: 80px 16px;">
        <div class="empty-state-emoji" aria-hidden="true">⚠️</div>
        <div class="empty-state-title">加载失败</div>
        <div class="empty-state-text">${escapeHtml(message)}</div>
        <button type="button" class="btn btn-primary" onclick="location.reload()">重新加载</button>
      </div>
    </main>
  `;
}
