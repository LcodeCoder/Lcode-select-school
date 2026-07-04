import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';
import { navigate } from '../lib/router.js';
import { getArticleDetail, blockPlainText } from '../lib/article-api.js';

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

function storageKey(id) { return `lcode:practice:${id}`; }
function readProgress(id) {
  try { return JSON.parse(localStorage.getItem(storageKey(id)) || '{}') || {}; } catch { return {}; }
}
function saveProgress(id, progress) {
  try { localStorage.setItem(storageKey(id), JSON.stringify(progress)); } catch {}
}

function cleanQuestionText(text) {
  return text
    .replace(/[（(]\s*([A-F])\s*[）)]/i, '（　）')
    .replace(/答案\s*[:：]?\s*[A-F].*$/i, '')
    .trim();
}

function answerFrom(text) {
  const m = String(text || '').match(/[（(]\s*([A-F])\s*[）)]|答案\s*[:：]?\s*([A-F])/i);
  return m ? String(m[1] || m[2]).toUpperCase() : '';
}

function parseQuestions(article) {
  const lines = [];
  for (const b of article.blocks || []) {
    const t = blockPlainText(b).replace(/\s+/g, ' ').trim();
    if (!t) continue;
    // Some imported exam docs still have question + options in one paragraph.
    const split = t
      .replace(/\s+([A-F][.．、:：)])/g, '\n$1')
      .replace(/\s+(\d{1,4}[．.、])/g, '\n$1')
      .split('\n')
      .map(x => x.trim())
      .filter(Boolean);
    lines.push(...split);
  }

  const qs = [];
  let cur = null;
  for (const line of lines) {
    const qMatch = line.match(/^(\d{1,4})[．.、]\s*(.+)$/);
    const optMatch = line.match(/^([A-F])[.．、:：)]\s*(.+)$/i);
    if (qMatch) {
      if (cur && cur.text) qs.push(cur);
      cur = {
        no: Number(qMatch[1]),
        text: cleanQuestionText(qMatch[2]),
        options: [],
        answer: answerFrom(qMatch[2]),
        raw: qMatch[2],
      };
      continue;
    }
    if (optMatch && cur) {
      const label = optMatch[1].toUpperCase();
      cur.options.push({ label, text: optMatch[2].trim() });
      continue;
    }
    const ans = answerFrom(line);
    if (ans && cur && !cur.answer) cur.answer = ans;
    else if (cur && !cur.options.length && line.length < 80) cur.text += ` ${line}`;
  }
  if (cur && cur.text) qs.push(cur);

  return qs
    .filter(q => q.text && (q.options.length >= 2 || q.answer))
    .map((q, i) => ({ ...q, idx: i, no: q.no || i + 1 }));
}

export async function initPracticeView(id) {
  const host = document.getElementById('view-host');
  host.innerHTML = `
    <main class="app-main practice-page">
      <div class="school-list mt-6"><div class="card" style="padding:16px"><div class="skeleton" style="height:24px;width:50%;margin-bottom:12px"></div><div class="skeleton" style="height:220px;width:100%"></div></div></div>
    </main>
  `;
  let article;
  try { article = await getArticleDetail(id); }
  catch (err) {
    host.innerHTML = `<main class="app-main"><div class="empty-state"><div class="empty-state-title">题库加载失败</div><div class="empty-state-text">${escapeHtml(err.message || '未知错误')}</div></div></main>`;
    return;
  }
  const questions = parseQuestions(article);
  if (!questions.length) {
    host.innerHTML = `<main class="app-main"><div class="empty-state"><div class="empty-state-emoji">📝</div><div class="empty-state-title">没有解析到题目</div><div class="empty-state-text">这篇文章可能不是标准选择题格式。</div><button class="btn btn-primary" id="back-article">返回原文</button></div></main>`;
    host.querySelector('#back-article')?.addEventListener('click', () => navigate(`/article/${id}`));
    return;
  }

  const progress = readProgress(id);
  let current = Math.min(Math.max(Number(progress.current) || 0, 0), questions.length - 1);
  let answered = progress.answered || {};
  let showAnswer = false;

  const render = () => {
    const q = questions[current];
    const saved = answered[q.idx] || null;
    const doneCount = Object.keys(answered).length;
    const correctCount = Object.values(answered).filter(x => x?.correct).length;
    const pct = Math.round((doneCount / questions.length) * 100);
    host.innerHTML = `
      <main class="app-main practice-page">
        <div class="detail-back-row">
          <a href="#/article/${article.id}" class="detail-back" id="practice-back">${icon('back', 16)}<span>返回原文</span></a>
        </div>
        <section class="practice-hero">
          <div>
            <div class="article-module-pill">题库模式</div>
            <h1>${escapeHtml(article.title)}</h1>
            <p>题目和选项已拆开显示，答案默认隐藏；练习记录只保存在你的浏览器。</p>
          </div>
          <div class="practice-stats">
            <strong>${doneCount}/${questions.length}</strong>
            <span>已做 · 正确 ${correctCount}</span>
          </div>
        </section>
        <section class="practice-progress" aria-label="练习进度"><span style="width:${pct}%"></span></section>
        <section class="practice-card">
          <div class="practice-card-top">
            <span class="practice-no">第 ${current + 1} / ${questions.length} 题</span>
            ${q.answer ? `<span class="practice-answer-pill${showAnswer || saved ? ' visible' : ''}">答案：${escapeHtml(q.answer)}</span>` : '<span class="practice-answer-pill">暂无答案</span>'}
          </div>
          <h2>${escapeHtml(q.text)}</h2>
          <div class="practice-options">
            ${q.options.map(opt => renderOption(opt, q.answer, saved)).join('') || `<div class="text-muted">这题没有解析到选项，可点击“显示答案”查看。</div>`}
          </div>
          <div class="practice-reveal${showAnswer || saved ? ' show' : ''}">
            ${q.answer ? `正确答案：<strong>${escapeHtml(q.answer)}</strong>${saved ? ` · 你选择：<strong>${escapeHtml(saved.choice)}</strong>` : ''}` : '原文未提供明确答案'}
          </div>
        </section>
        <div class="practice-actions">
          <button class="btn btn-secondary" id="prev-q" ${current === 0 ? 'disabled' : ''}>${icon('back', 14)}<span>上一题</span></button>
          <button class="btn btn-secondary" id="show-answer">${icon('eye', 14)}<span>${showAnswer || saved ? '隐藏/重看答案' : '显示答案'}</span></button>
          <button class="btn btn-secondary" id="random-q">${icon('swap', 14)}<span>随机一题</span></button>
          <button class="btn btn-primary" id="next-q" ${current === questions.length - 1 ? 'disabled' : ''}><span>下一题</span>${icon('chevronRight', 14)}</button>
        </div>
      </main>
    `;
    bind();
  };

  const setCurrent = (idx) => {
    current = Math.min(Math.max(idx, 0), questions.length - 1);
    progress.current = current;
    saveProgress(id, { ...progress, current, answered });
    showAnswer = false;
    render();
  };

  const bind = () => {
    host.querySelector('#practice-back')?.addEventListener('click', (e) => { e.preventDefault(); navigate(`/article/${id}`); });
    host.querySelector('#prev-q')?.addEventListener('click', () => setCurrent(current - 1));
    host.querySelector('#next-q')?.addEventListener('click', () => setCurrent(current + 1));
    host.querySelector('#random-q')?.addEventListener('click', () => setCurrent(Math.floor(Math.random() * questions.length)));
    host.querySelector('#show-answer')?.addEventListener('click', () => { showAnswer = !showAnswer; render(); });
    host.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = questions[current];
        const choice = btn.dataset.choice;
        answered = { ...answered, [q.idx]: { choice, correct: q.answer ? choice === q.answer : false, at: Date.now() } };
        saveProgress(id, { ...progress, current, answered });
        showAnswer = true;
        render();
      });
    });
  };

  render();
}

function renderOption(opt, answer, saved) {
  let cls = '';
  if (saved) {
    if (answer && opt.label === answer) cls = ' is-correct';
    else if (opt.label === saved.choice) cls = ' is-wrong';
  }
  return `
    <button type="button" class="practice-option${cls}" data-choice="${escapeHtml(opt.label)}">
      <span class="practice-option-label">${escapeHtml(opt.label)}</span>
      <span>${escapeHtml(opt.text)}</span>
    </button>
  `;
}
