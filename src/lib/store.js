// Server-backed store for school overrides, comments, views, and module views.
// SQLite is the source of truth (shared across devices). localStorage is only
// a fallback for offline/degraded mode.

import { icon } from './icons.js';

const VIEW_KEY = 'dorm:views';
const MODULE_VIEW_KEY = 'dorm:module-views';
const OVERRIDE_CACHE_KEY = 'dorm:school-overrides';
const COMMENT_CACHE_KEY = 'dorm:comments';
const ADMIN_KEY = 'dorm:admin';
const THEME_KEY = 'dorm:theme';
const ADMIN_TOKEN = 'lyh20041113lyh';
export { ADMIN_TOKEN };

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

// ===== School overrides (server-backed) =====
let overridesCache = null;

export async function getAllSchoolOverrides() {
  if (overridesCache) return overridesCache;
  try {
    const r = await fetch('/api/school-overrides');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    overridesCache = data;
    writeJSON(OVERRIDE_CACHE_KEY, data);
    return data;
  } catch {
    overridesCache = readJSON(OVERRIDE_CACHE_KEY, {});
    return overridesCache;
  }
}

export function getSchoolOverrideSync(id) {
  if (overridesCache == null) overridesCache = readJSON(OVERRIDE_CACHE_KEY, {});
  return overridesCache[id] || null;
}

export async function getSchoolOverride(id) {
  await getAllSchoolOverrides();
  return overridesCache[id] || null;
}

export async function saveSchoolOverride(id, patch) {
  // Optimistic update
  if (overridesCache == null) overridesCache = readJSON(OVERRIDE_CACHE_KEY, {});
  const prev = overridesCache[id] || {};
  overridesCache[id] = { ...prev, ...patch, id, updatedAt: new Date().toISOString() };
  writeJSON(OVERRIDE_CACHE_KEY, overridesCache);

  try {
    const r = await fetch(`/api/school-overrides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
      body: JSON.stringify(patch),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    // Re-sync from server to get the canonical merged version
    overridesCache = null;
    await getAllSchoolOverrides();
    return overridesCache[id];
  } catch (err) {
    console.warn('override save failed, kept locally', err);
    return overridesCache[id];
  }
}

export async function deleteSchoolOverride(id) {
  if (overridesCache == null) overridesCache = readJSON(OVERRIDE_CACHE_KEY, {});
  delete overridesCache[id];
  writeJSON(OVERRIDE_CACHE_KEY, overridesCache);
  try {
    await fetch(`/api/school-overrides/${id}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': ADMIN_TOKEN },
    });
  } catch (err) {
    console.warn('override delete failed', err);
  }
}

export function isSchoolEdited(id) {
  if (overridesCache == null) overridesCache = readJSON(OVERRIDE_CACHE_KEY, {});
  return !!overridesCache[id];
}

// ===== Comments (server-backed) =====
let commentsCache = null; // { schoolId: [comments] }

export async function getComments(schoolId) {
  if (commentsCache && commentsCache[schoolId]) return commentsCache[schoolId];
  try {
    const r = await fetch(`/api/comments?schoolId=${encodeURIComponent(schoolId)}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const list = await r.json();
    if (!commentsCache) commentsCache = {};
    commentsCache[schoolId] = list;
    // Persist to localStorage as fallback
    const all = readJSON(COMMENT_CACHE_KEY, {});
    all[schoolId] = list;
    writeJSON(COMMENT_CACHE_KEY, all);
    return list;
  } catch {
    const all = readJSON(COMMENT_CACHE_KEY, {});
    return (all[schoolId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
  }
}

export async function addComment(schoolId, { author, body }) {
  const payload = {
    schoolId,
    author: (author || '匿名').trim().slice(0, 24) || '匿名',
    body: body.trim().slice(0, 600),
  };
  if (!payload.body) throw new Error('body required');
  try {
    const r = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const created = await r.json();
    if (!commentsCache) commentsCache = {};
    if (!commentsCache[schoolId]) commentsCache[schoolId] = [];
    commentsCache[schoolId] = [created, ...commentsCache[schoolId]];
    return created;
  } catch (err) {
    // Fallback: keep locally only
    const all = readJSON(COMMENT_CACHE_KEY, {});
    const list = all[schoolId] || [];
    const created = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      schoolId,
      author: payload.author,
      body: payload.body,
      createdAt: Date.now(),
    };
    list.push(created);
    all[schoolId] = list;
    writeJSON(COMMENT_CACHE_KEY, all);
    if (!commentsCache) commentsCache = {};
    if (!commentsCache[schoolId]) commentsCache[schoolId] = [];
    commentsCache[schoolId] = [created, ...commentsCache[schoolId]];
    return created;
  }
}

export async function updateComment(schoolId, commentId, { author, body }) {
  try {
    const r = await fetch(`/api/comments/${encodeURIComponent(commentId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': ADMIN_TOKEN },
      body: JSON.stringify({
        author: (author || '匿名').trim().slice(0, 24) || '匿名',
        body: body.trim().slice(0, 600),
      }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const updated = await r.json();
    if (commentsCache && commentsCache[schoolId]) {
      commentsCache[schoolId] = commentsCache[schoolId].map(c => c.id === commentId ? updated : c);
    }
    return updated;
  } catch (err) {
    // Fallback: update local only
    const all = readJSON(COMMENT_CACHE_KEY, {});
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
    writeJSON(COMMENT_CACHE_KEY, all);
    if (commentsCache && commentsCache[schoolId]) {
      commentsCache[schoolId] = commentsCache[schoolId].map(c => c.id === commentId ? list[idx] : c);
    }
    return list[idx];
  }
}

export async function deleteComment(schoolId, commentId) {
  try {
    await fetch(`/api/comments/${encodeURIComponent(commentId)}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': ADMIN_TOKEN },
    });
  } catch {
    // fall through to local removal
  }
  if (commentsCache && commentsCache[schoolId]) {
    commentsCache[schoolId] = commentsCache[schoolId].filter(c => c.id !== commentId);
  }
  const all = readJSON(COMMENT_CACHE_KEY, {});
  if (all[schoolId]) {
    all[schoolId] = all[schoolId].filter(c => c.id !== commentId);
    writeJSON(COMMENT_CACHE_KEY, all);
  }
}

export async function countComments(schoolId) {
  const list = await getComments(schoolId);
  return list.length;
}

export async function getAllComments() {
  try {
    const r = await fetch('/api/comments');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch {
    const all = readJSON(COMMENT_CACHE_KEY, {});
    return Object.values(all).flat().sort((a, b) => b.createdAt - a.createdAt);
  }
}

// ===== School views (hot ranking) =====
// Server-backed via /api/views. localStorage is a fallback for offline/degraded mode.
let viewsCache = null;

export async function getAllViews() {
  if (viewsCache) return viewsCache;
  try {
    const r = await fetch('/api/views');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const cache = {};
    for (const [k, v] of Object.entries(data)) cache[Number(k)] = Number(v);
    viewsCache = cache;
    return cache;
  } catch {
    viewsCache = readJSON(VIEW_KEY, {});
    return viewsCache;
  }
}

export function getViewCount(id) {
  if (viewsCache == null) {
    viewsCache = readJSON(VIEW_KEY, {});
  }
  return viewsCache[id] || 0;
}

export function incrementView(id) {
  if (viewsCache == null) viewsCache = readJSON(VIEW_KEY, {});
  viewsCache[id] = (viewsCache[id] || 0) + 1;
  writeJSON(VIEW_KEY, viewsCache);

  fetch(`/api/views/${id}`, { method: 'POST' })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data && typeof data.count === 'number') {
        viewsCache[id] = data.count;
        writeJSON(VIEW_KEY, viewsCache);
      }
    })
    .catch(() => {/* fallback already updated locally */});

  return viewsCache[id];
}

export function topViewedSchools(limit = 5) {
  if (viewsCache == null) viewsCache = readJSON(VIEW_KEY, {});
  return Object.entries(viewsCache)
    .map(([id, count]) => ({ id: Number(id), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ===== Module views (新生指南 / 志愿填报 / 自我提升 整页浏览量) =====
// Server-backed via /api/module-views. localStorage is a fallback for offline/degraded mode.
let moduleViewsCache = null;

export async function getAllModuleViews() {
  if (moduleViewsCache) return moduleViewsCache;
  try {
    const r = await fetch('/api/module-views');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const cache = {};
    for (const [k, v] of Object.entries(data)) cache[k] = Number(v);
    moduleViewsCache = cache;
    return cache;
  } catch {
    moduleViewsCache = readJSON(MODULE_VIEW_KEY, {});
    return moduleViewsCache;
  }
}

export function getModuleView(mod) {
  if (moduleViewsCache == null) {
    moduleViewsCache = readJSON(MODULE_VIEW_KEY, {});
  }
  return moduleViewsCache[mod] || 0;
}

export function incrementModuleView(mod) {
  if (moduleViewsCache == null) moduleViewsCache = readJSON(MODULE_VIEW_KEY, {});
  moduleViewsCache[mod] = (moduleViewsCache[mod] || 0) + 1;
  writeJSON(MODULE_VIEW_KEY, moduleViewsCache);

  fetch(`/api/module-views/${encodeURIComponent(mod)}`, { method: 'POST' })
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      if (data && typeof data.count === 'number') {
        moduleViewsCache[mod] = data.count;
        writeJSON(MODULE_VIEW_KEY, moduleViewsCache);
      }
    })
    .catch(() => {/* fallback already updated locally */});

  return moduleViewsCache[mod];
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
      finish(v === ADMIN_TOKEN);
    });
    dlg.addEventListener('close', () => { if (host.isConnected) finish(false); });
  });
}
