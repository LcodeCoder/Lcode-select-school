// Local storage-backed store for school overrides + comments.
// Schools are keyed by id; comments are keyed by schoolId.

import { icon } from './icons.js';

const SCHOOL_KEY = 'dorm:school-overrides';
const COMMENT_KEY = 'dorm:comments';
const ADMIN_KEY = 'dorm:admin';
const THEME_KEY = 'dorm:theme';
const ADMIN_PASSWORD = 'lyh20041113lyh';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed', e);
  }
}

// ===== School overrides =====
export function getSchoolOverrides() {
  return readJSON(SCHOOL_KEY, {});
}

export function getSchoolOverride(id) {
  return getSchoolOverrides()[id] || null;
}

export function saveSchoolOverride(id, patch) {
  const all = getSchoolOverrides();
  const prev = all[id] || {};
  all[id] = { ...prev, ...patch, id, updatedAt: Date.now() };
  writeJSON(SCHOOL_KEY, all);
  return all[id];
}

export function deleteSchoolOverride(id) {
  const all = getSchoolOverrides();
  delete all[id];
  writeJSON(SCHOOL_KEY, all);
}

export function isSchoolEdited(id) {
  return !!getSchoolOverrides()[id];
}

// ===== Comments =====
export function getComments(schoolId) {
  const all = readJSON(COMMENT_KEY, {});
  return (all[schoolId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

export function addComment(schoolId, { author, body }) {
  const all = readJSON(COMMENT_KEY, {});
  const list = all[schoolId] || [];
  const comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    schoolId,
    author: (author || '匿名').trim().slice(0, 24) || '匿名',
    body: body.trim().slice(0, 600),
    createdAt: Date.now(),
  };
  list.push(comment);
  all[schoolId] = list;
  writeJSON(COMMENT_KEY, all);
  return comment;
}

export function updateComment(schoolId, commentId, { author, body }) {
  const all = readJSON(COMMENT_KEY, {});
  const list = all[schoolId] || [];
  const idx = list.findIndex(c => c.id === commentId);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    author: (author || '匿名').trim().slice(0, 24) || '匿名',
    body: body.trim().slice(0, 600),
    updatedAt: Date.now(),
  };
  all[schoolId] = list;
  writeJSON(COMMENT_KEY, all);
  return list[idx];
}

export function deleteComment(schoolId, commentId) {
  const all = readJSON(COMMENT_KEY, {});
  const list = (all[schoolId] || []).filter(c => c.id !== commentId);
  all[schoolId] = list;
  writeJSON(COMMENT_KEY, all);
}

export function countComments(schoolId) {
  return getComments(schoolId).length;
}

// ===== Admin mode =====
export function isAdmin() {
  return sessionStorage.getItem(ADMIN_KEY) === '1';
}

export function setAdmin(on) {
  if (on) sessionStorage.setItem(ADMIN_KEY, '1');
  else sessionStorage.removeItem(ADMIN_KEY);
}

// ===== Theme =====
// 'light' | 'dark' | 'system'
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'system';
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme();
}

export function applyTheme() {
  const t = getTheme();
  const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

export function isDarkActive() {
  return document.documentElement.dataset.theme === 'dark';
}

export function promptAdmin() {
  return new Promise((resolve) => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    host.innerHTML = `
      <dialog id="admin-login-dialog" aria-label="管理员登录">
        <form class="drawer" style="max-width: 360px;" id="admin-login-form">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <span style="color: var(--primary);">${icon('shield', 22)}</span>
            <h2 style="font-size: 1.0625rem; font-weight: 600;">进入管理员模式</h2>
          </div>
          <p style="color: var(--muted); font-size: 0.8125rem; line-height: 1.6; margin-bottom: 14px;">输入管理员密码以编辑学校信息或管理评论。</p>
          <div class="field" style="margin-bottom: 16px;">
            <label class="field-label" for="admin-password">管理员密码</label>
            <input type="password" class="input" id="admin-password" autocomplete="off" autofocus required />
          </div>
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button type="button" class="btn btn-secondary" data-close>取消</button>
            <button type="submit" class="btn btn-primary">进入</button>
          </div>
        </form>
      </dialog>
    `;
    const dlg = host.querySelector('dialog');
    dlg.showModal();
    const cleanup = () => { dlg.remove(); host.remove(); };
    const finish = (val) => { cleanup(); resolve(val); };
    dlg.addEventListener('click', (e) => { if (e.target === dlg) finish(false); });
    host.querySelector('[data-close]').addEventListener('click', () => finish(false));
    host.querySelector('#admin-login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const v = host.querySelector('#admin-password').value;
      finish(v === ADMIN_PASSWORD);
    });
    dlg.addEventListener('close', () => { if (host.isConnected) finish(false); });
  });
}
