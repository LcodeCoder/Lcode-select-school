import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname, normalize, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { normalizeArticle } from '../src/lib/article-normalizer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const DB_PATH = process.env.DB_PATH || join(ROOT, 'data', 'views.db');
const PORT = Number(process.env.PORT) || 80;

const API_CACHE_TTL = Number(process.env.API_CACHE_TTL_MS) || 5 * 60 * 1000;
const STATIC_CACHE_TTL = Number(process.env.STATIC_CACHE_TTL_MS) || 10 * 60 * 1000;
const apiCache = new Map();
const staticCache = new Map();

await mkdir(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);

// Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS views (
    school_id INTEGER PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    source TEXT,
    ord INTEGER NOT NULL DEFAULT 0,
    blocks_json TEXT NOT NULL,
    raw_len INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_articles_module ON articles(module);
  CREATE INDEX IF NOT EXISTS idx_articles_module_cat ON articles(module, category);
  CREATE TABLE IF NOT EXISTS module_views (
    module TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS school_overrides (
    school_id INTEGER PRIMARY KEY,
    patch_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    school_id INTEGER NOT NULL,
    author TEXT NOT NULL DEFAULT '匿名',
    body TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
  );
  CREATE INDEX IF NOT EXISTS idx_comments_school ON comments(school_id);
`);

// Auto-seed articles on first run. SEED_PATH points at articles.json baked
// into the image (or the local scripts/materials-out path during dev).
const SEED_PATH = process.env.SEED_PATH || join(ROOT, 'scripts', 'materials-out', 'articles.json');
try {
  const n = db.prepare('SELECT COUNT(*) AS n FROM articles').get().n;
  if (n === 0) {
    const raw = await readFile(SEED_PATH, 'utf8');
    const articles = JSON.parse(raw);
    const insArt = db.prepare(
      `INSERT INTO articles (module, category, title, source, ord, blocks_json, raw_len) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    db.exec('BEGIN;');
    let seeded = 0;
    for (const a of articles) {
      insArt.run(
        a.module, a.category, a.title, a.source || null, a.order || 0,
        JSON.stringify(a.blocks || []), a.rawLen || 0
      );
      seeded++;
    }
    db.exec('COMMIT;');
    console.log(`Seeded ${seeded} articles from ${SEED_PATH}`);
  } else {
    console.log(`articles already populated (${n} rows), skip seed`);
  }
} catch (err) {
  console.warn(`article seed skipped: ${err.message}`);
}

// Prepared statements — school views
const incrementStmt = db.prepare(
  'INSERT INTO views (school_id, count) VALUES (?, 1) ON CONFLICT(school_id) DO UPDATE SET count = count + 1 RETURNING count'
);
const allStmt = db.prepare('SELECT school_id, count FROM views');

// Articles
const articleByIdStmt = db.prepare('SELECT * FROM articles WHERE id = ?');
const articleListStmt = db.prepare(
  `SELECT id, module, category, title, source, ord, raw_len, created_at FROM articles WHERE module = ? ORDER BY ord, id`
);
const articleCategoriesStmt = db.prepare(
  `SELECT category, COUNT(*) as n FROM articles WHERE module = ? GROUP BY category ORDER BY MIN(ord), category`
);
const articleUpdateStmt = db.prepare(
  `UPDATE articles SET title = ?, category = ?, blocks_json = ?, raw_len = ? WHERE id = ?`
);
const articleDeleteStmt = db.prepare('DELETE FROM articles WHERE id = ?');
const articleCreateStmt = db.prepare(
  `INSERT INTO articles (module, category, title, source, ord, blocks_json, raw_len) VALUES (?, ?, ?, ?, ?, ?, ?)`
);

// Simple admin token check — same password as client-side promptAdmin.
const ADMIN_TOKEN = 'lyh20041113lyh';
function isAdminReq(req) {
  return req.headers['x-admin-token'] === ADMIN_TOKEN;
}

// Module views (per whole-module counter)
const incrementModuleStmt = db.prepare(
  'INSERT INTO module_views (module, count) VALUES (?, 1) ON CONFLICT(module) DO UPDATE SET count = count + 1 RETURNING count'
);
const allModuleViewsStmt = db.prepare('SELECT module, count FROM module_views');

// School overrides
const allOverridesStmt = db.prepare('SELECT school_id, patch_json, updated_at FROM school_overrides');
const overrideByIdStmt = db.prepare('SELECT school_id, patch_json, updated_at FROM school_overrides WHERE school_id = ?');
const upsertOverrideStmt = db.prepare(`
  INSERT INTO school_overrides (school_id, patch_json, updated_at) VALUES (?, ?, datetime('now'))
  ON CONFLICT(school_id) DO UPDATE SET patch_json = excluded.patch_json, updated_at = datetime('now')
`);
const deleteOverrideStmt = db.prepare('DELETE FROM school_overrides WHERE school_id = ?');

// Comments
const commentsBySchoolStmt = db.prepare('SELECT * FROM comments WHERE school_id = ? ORDER BY created_at DESC');
const allCommentsStmt = db.prepare('SELECT * FROM comments ORDER BY created_at DESC LIMIT 500');
const commentByIdStmt = db.prepare('SELECT * FROM comments WHERE id = ?');
const insertCommentStmt = db.prepare(
  'INSERT INTO comments (id, school_id, author, body, created_at) VALUES (?, ?, ?, ?, ?)'
);
const updateCommentStmt = db.prepare(
  'UPDATE comments SET author = ?, body = ?, updated_at = ? WHERE id = ?'
);
const deleteCommentStmt = db.prepare('DELETE FROM comments WHERE id = ?');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

function sendJson(res, status, body, extraHeaders = {}) {
  const payload = Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': payload.length,
    ...extraHeaders,
  });
  res.end(payload);
}

function getApiCache(key) {
  const hit = apiCache.get(key);
  if (!hit || hit.expires < Date.now()) {
    apiCache.delete(key);
    return null;
  }
  return hit.body;
}

function setApiCache(key, body, ttl = API_CACHE_TTL) {
  apiCache.set(key, { body, expires: Date.now() + ttl });
  return body;
}

function clearArticleCache() {
  for (const key of apiCache.keys()) {
    if (key.startsWith('articles:')) apiCache.delete(key);
  }
}

function cachedJson(res, key, producer, ttl) {
  const cached = getApiCache(key);
  if (cached) return sendJson(res, 200, cached, { 'Cache-Control': 'private, max-age=60', 'X-Cache': 'HIT' });
  const body = setApiCache(key, producer(), ttl);
  return sendJson(res, 200, body, { 'Cache-Control': 'private, max-age=60', 'X-Cache': 'MISS' });
}

function contentDisposition(filename) {
  const safe = basename(filename || 'download').replace(/[\r\n"]/g, '_');
  return `attachment; filename*=UTF-8''${encodeURIComponent(safe)}`;
}

function articleSourceCandidates(source) {
  const file = basename(String(source || '').trim());
  if (!file) return [];
  const envDirs = String(process.env.ARTICLE_SOURCE_DIRS || '')
    .split(process.platform === 'win32' ? ';' : ':')
    .map(s => s.trim())
    .filter(Boolean);
  const roots = [
    ...envDirs,
    join(ROOT, 'public', 'materials'),
    join(ROOT, 'public', 'originals'),
    join(ROOT, 'materials'),
    join(ROOT, 'scripts', 'materials-out', 'originals'),
  ];
  return roots.map(dir => join(dir, file));
}

async function sendArticleDownload(res, row) {
  const source = row?.source || '';
  const fileName = basename(source);
  if (!fileName) return sendJson(res, 404, { error: 'no source file' });

  for (const candidate of articleSourceCandidates(source)) {
    try {
      const s = await stat(candidate);
      if (!s.isFile()) continue;
      const buf = await readFile(candidate);
      const ext = extname(candidate).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Length': buf.length,
        'Content-Disposition': contentDisposition(fileName),
        'Cache-Control': 'private, max-age=3600',
      });
      return res.end(buf);
    } catch {}
  }

  return sendJson(res, 404, {
    error: 'source file not found',
    message: `原文件「${fileName}」没有随当前项目打包。可把原始资料放到 public/materials/，或设置 ARTICLE_SOURCE_DIRS 后重启服务。`,
  });
}

function sendText(res, status, msg) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(msg);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

async function serveStatic(req, res, urlPath) {
  // Prevent path traversal
  const safe = normalize('.' + urlPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(DIST, safe);

  // SPA fallback for unknown routes
  try {
    const s = await stat(filePath);
    if (s.isDirectory()) {
      filePath = join(filePath, 'index.html');
    }
  } catch {
    filePath = join(DIST, 'index.html');
  }

  try {
    const ext = extname(filePath).toLowerCase();
    const cacheable = STATIC_CACHE_TTL > 0
      && !filePath.endsWith('index.html')
      && (urlPath.startsWith('/assets/') || urlPath.startsWith('/data/') || ['.js', '.css', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2'].includes(ext));
    const cacheKey = filePath;
    const cached = cacheable ? staticCache.get(cacheKey) : null;
    if (cached && cached.expires > Date.now()) {
      res.writeHead(200, { ...cached.headers, 'X-Static-Cache': 'HIT' });
      return res.end(cached.buf);
    }
    if (cached) staticCache.delete(cacheKey);

    const buf = await readFile(filePath);
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': buf.length,
    };

    if (urlPath.startsWith('/assets/')) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else if (urlPath.startsWith('/data/')) {
      headers['Cache-Control'] = 'public, max-age=86400';
    } else if (filePath.endsWith('index.html')) {
      headers['Cache-Control'] = 'no-cache';
    }

    if (cacheable) {
      staticCache.set(cacheKey, { buf, headers: { ...headers }, expires: Date.now() + STATIC_CACHE_TTL });
      headers['X-Static-Cache'] = 'MISS';
    }

    res.writeHead(200, headers);
    res.end(buf);
  } catch {
    sendText(res, 404, 'Not found');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;

  // CORS-friendly: handle preflight quickly
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' });
    return res.end();
  }

  // ===== School views =====
  if (req.method === 'POST' && path.startsWith('/api/views/')) {
    const idStr = path.slice('/api/views/'.length);
    const schoolId = Number(idStr);
    if (!Number.isInteger(schoolId) || schoolId <= 0) {
      return sendJson(res, 400, { error: 'invalid school id' });
    }
    try {
      const row = incrementStmt.get(schoolId);
      const count = row ? Number(row.count) : 0;
      return sendJson(res, 200, { schoolId, count });
    } catch (err) {
      console.error('increment failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'GET' && path === '/api/views') {
    const rows = allStmt.all();
    const out = {};
    for (const r of rows) out[r.school_id] = Number(r.count);
    return sendJson(res, 200, out);
  }

  // ===== Module views (新生指南 / 志愿填报 整页浏览量) =====
  if (req.method === 'POST' && path.startsWith('/api/module-views/')) {
    const mod = decodeURIComponent(path.slice('/api/module-views/'.length));
    if (!['guide', 'exam', 'growth'].includes(mod)) {
      return sendJson(res, 400, { error: 'invalid module' });
    }
    try {
      const row = incrementModuleStmt.get(mod);
      const count = row ? Number(row.count) : 0;
      return sendJson(res, 200, { module: mod, count });
    } catch (err) {
      console.error('module increment failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'GET' && path === '/api/module-views') {
    const rows = allModuleViewsStmt.all();
    const out = {};
    for (const r of rows) out[r.module] = Number(r.count);
    return sendJson(res, 200, out);
  }

  // ===== Articles (新生指南 / 志愿填报 内容) =====
  // GET /api/articles?module=guide   → list metadata (no blocks)
  // GET /api/articles/:id            → full article with blocks_json parsed
  // GET /api/articles?module=guide&category=入学须知  → filtered list
  if (req.method === 'GET' && path === '/api/articles') {
    const mod = url.searchParams.get('module') || '';
    const cat = url.searchParams.get('category') || '';
    if (!mod) {
      // No module: return all (metadata only)
      return cachedJson(res, 'articles:all', () => db.prepare(
        `SELECT id, module, category, title, source, ord, raw_len, created_at FROM articles ORDER BY module, ord, id`
      ).all());
    }
    try {
      const cacheKey = `articles:list:${mod}:${cat}`;
      return cachedJson(res, cacheKey, () => {
        const rows = cat
          ? db.prepare(
              `SELECT id, module, category, title, source, ord, raw_len, created_at FROM articles WHERE module = ? AND category = ? ORDER BY ord, id`
            ).all(mod, cat)
          : articleListStmt.all(mod);
        const cats = articleCategoriesStmt.all(mod);
        return { items: rows, categories: cats };
      });
    } catch (err) {
      console.error('article list failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'GET' && path.startsWith('/api/articles/') && path.endsWith('/download')) {
    const idStr = path.slice('/api/articles/'.length, -'/download'.length);
    const id = Number(idStr);
    if (!Number.isInteger(id) || id <= 0) {
      return sendJson(res, 400, { error: 'invalid article id' });
    }
    try {
      const row = articleByIdStmt.get(id);
      if (!row) return sendJson(res, 404, { error: 'not found' });
      return await sendArticleDownload(res, row);
    } catch (err) {
      console.error('article download failed', err);
      return sendJson(res, 500, { error: 'download failed' });
    }
  }

  if (req.method === 'GET' && path.startsWith('/api/articles/')) {
    const idStr = path.slice('/api/articles/'.length);
    const id = Number(idStr);
    if (!Number.isInteger(id) || id <= 0) {
      return sendJson(res, 400, { error: 'invalid article id' });
    }
    try {
      const row = articleByIdStmt.get(id);
      if (!row) return sendJson(res, 404, { error: 'not found' });
      const cacheKey = `articles:detail:${id}`;
      return cachedJson(res, cacheKey, () => {
        let blocks = [];
        try { blocks = JSON.parse(row.blocks_json || '[]'); } catch {}
        return normalizeArticle({
          id: row.id,
          module: row.module,
          category: row.category,
          title: row.title,
          source: row.source,
          ord: row.ord,
          rawLen: row.raw_len,
          createdAt: row.created_at,
          blocks,
        });
      });
    } catch (err) {
      console.error('article get failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  // ===== Article mutation (admin only) =====
  // PUT  /api/articles/:id    → update title/category/blocks
  // DELETE /api/articles/:id  → delete article
  // POST /api/articles        → create new article
  if (req.method === 'PUT' && path.startsWith('/api/articles/')) {
    if (!isAdminReq(req)) return sendJson(res, 401, { error: 'unauthorized' });
    const id = Number(path.slice('/api/articles/'.length));
    if (!Number.isInteger(id) || id <= 0) return sendJson(res, 400, { error: 'invalid id' });
    const body = await readJsonBody(req);
    const title = String(body.title || '').trim();
    const category = String(body.category || '').trim();
    const blocks = Array.isArray(body.blocks) ? body.blocks : [];
    const rawLen = Number(body.rawLen) || blocks.reduce((n, b) => n + (b.text ? b.text.length : (b.items ? b.items.reduce((m, it) => m + (it.text || '').length, 0) : 0)), 0);
    if (!title) return sendJson(res, 400, { error: 'title required' });
    try {
      const row = articleByIdStmt.get(id);
      if (!row) return sendJson(res, 404, { error: 'not found' });
      articleUpdateStmt.run(title, category || row.category, JSON.stringify(blocks), rawLen, id);
      clearArticleCache();
      return sendJson(res, 200, { id, ok: true });
    } catch (err) {
      console.error('article update failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'DELETE' && path.startsWith('/api/articles/')) {
    if (!isAdminReq(req)) return sendJson(res, 401, { error: 'unauthorized' });
    const id = Number(path.slice('/api/articles/'.length));
    if (!Number.isInteger(id) || id <= 0) return sendJson(res, 400, { error: 'invalid id' });
    try {
      articleDeleteStmt.run(id);
      clearArticleCache();
      return sendJson(res, 200, { id, ok: true });
    } catch (err) {
      console.error('article delete failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'POST' && path === '/api/articles') {
    if (!isAdminReq(req)) return sendJson(res, 401, { error: 'unauthorized' });
    const body = await readJsonBody(req);
    const module = String(body.module || '').trim();
    const title = String(body.title || '').trim();
    const category = String(body.category || '').trim();
    const source = String(body.source || '').trim() || null;
    const ord = Number(body.ord) || 0;
    const blocks = Array.isArray(body.blocks) ? body.blocks : [];
    if (!module || !['guide', 'exam', 'growth'].includes(module)) {
      return sendJson(res, 400, { error: 'invalid module' });
    }
    if (!title) return sendJson(res, 400, { error: 'title required' });
    const rawLen = Number(body.rawLen) || blocks.reduce((n, b) => n + (b.text ? b.text.length : (b.items ? b.items.reduce((m, it) => m + (it.text || '').length, 0) : 0)), 0);
    try {
      const info = articleCreateStmt.run(module, category, title, source, ord, JSON.stringify(blocks), rawLen);
      clearArticleCache();
      return sendJson(res, 200, { id: Number(info.lastInsertRowid), ok: true });
    } catch (err) {
      console.error('article create failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  // ===== School overrides =====
  // GET    /api/school-overrides        → all overrides (map schoolId → patch)
  // GET    /api/school-overrides/:id    → single override
  // PUT    /api/school-overrides/:id    → upsert override (admin)
  // DELETE /api/school-overrides/:id    → delete override (admin)
  if (req.method === 'GET' && path === '/api/school-overrides') {
    try {
      const rows = allOverridesStmt.all();
      const out = {};
      for (const r of rows) {
        try { out[r.school_id] = { ...JSON.parse(r.patch_json), id: r.school_id, updatedAt: r.updated_at }; } catch {}
      }
      return sendJson(res, 200, out);
    } catch (err) {
      console.error('override list failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'GET' && path.startsWith('/api/school-overrides/')) {
    const id = Number(path.slice('/api/school-overrides/'.length));
    if (!Number.isInteger(id) || id <= 0) return sendJson(res, 400, { error: 'invalid id' });
    const row = overrideByIdStmt.get(id);
    if (!row) return sendJson(res, 404, { error: 'not found' });
    try {
      const patch = JSON.parse(row.patch_json);
      return sendJson(res, 200, { ...patch, id: row.school_id, updatedAt: row.updated_at });
    } catch {
      return sendJson(res, 500, { error: 'bad patch json' });
    }
  }

  if (req.method === 'PUT' && path.startsWith('/api/school-overrides/')) {
    if (!isAdminReq(req)) return sendJson(res, 401, { error: 'unauthorized' });
    const id = Number(path.slice('/api/school-overrides/'.length));
    if (!Number.isInteger(id) || id <= 0) return sendJson(res, 400, { error: 'invalid id' });
    const body = await readJsonBody(req);
    // Merge with existing patch so partial edits accumulate
    const existing = overrideByIdStmt.get(id);
    let merged = {};
    if (existing) {
      try { merged = JSON.parse(existing.patch_json); } catch {}
    }
    merged = { ...merged, ...body };
    // Deep-merge facilities/around one level
    if (body.facilities || merged.facilities) {
      merged.facilities = { ...(merged.facilities || {}), ...(body.facilities || {}) };
    }
    if (body.around || merged.around) {
      merged.around = { ...(merged.around || {}), ...(body.around || {}) };
    }
    // Drop empty-string fields (treated as "no change")
    const cleaned = {};
    for (const [k, v] of Object.entries(merged)) {
      if (v === '' || v == null) continue;
      cleaned[k] = v;
    }
    try {
      upsertOverrideStmt.run(id, JSON.stringify(cleaned));
      return sendJson(res, 200, { id, ok: true });
    } catch (err) {
      console.error('override upsert failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'DELETE' && path.startsWith('/api/school-overrides/')) {
    if (!isAdminReq(req)) return sendJson(res, 401, { error: 'unauthorized' });
    const id = Number(path.slice('/api/school-overrides/'.length));
    if (!Number.isInteger(id) || id <= 0) return sendJson(res, 400, { error: 'invalid id' });
    try {
      deleteOverrideStmt.run(id);
      return sendJson(res, 200, { id, ok: true });
    } catch (err) {
      console.error('override delete failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  // ===== Comments =====
  // GET    /api/comments          → all comments (newest first, capped 500)
  // GET    /api/comments?schoolId=X → comments for one school
  // POST   /api/comments          → create (body: schoolId, author, body)
  // PUT    /api/comments/:id      → update (body: author, body)
  // DELETE /api/comments/:id      → delete
  if (req.method === 'GET' && path === '/api/comments') {
    const schoolId = url.searchParams.get('schoolId');
    if (schoolId) {
      const id = Number(schoolId);
      if (!Number.isInteger(id) || id <= 0) return sendJson(res, 400, { error: 'invalid schoolId' });
      try {
        const rows = commentsBySchoolStmt.all(id);
        return sendJson(res, 200, rows.map(formatCommentRow));
      } catch (err) {
        console.error('comments by school failed', err);
        return sendJson(res, 500, { error: 'db error' });
      }
    }
    try {
      const rows = allCommentsStmt.all();
      return sendJson(res, 200, rows.map(formatCommentRow));
    } catch (err) {
      console.error('comments list failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'POST' && path === '/api/comments') {
    const body = await readJsonBody(req);
    const schoolId = Number(body.schoolId);
    if (!Number.isInteger(schoolId) || schoolId <= 0) return sendJson(res, 400, { error: 'invalid schoolId' });
    const author = String(body.author || '匿名').trim().slice(0, 24) || '匿名';
    const text = String(body.body || '').trim().slice(0, 600);
    if (!text) return sendJson(res, 400, { error: 'body required' });
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = Date.now();
    try {
      insertCommentStmt.run(id, schoolId, author, text, createdAt);
      return sendJson(res, 200, formatCommentRow(commentByIdStmt.get(id)));
    } catch (err) {
      console.error('comment insert failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'PUT' && path.startsWith('/api/comments/')) {
    if (!isAdminReq(req)) return sendJson(res, 401, { error: 'unauthorized' });
    const id = path.slice('/api/comments/'.length);
    const body = await readJsonBody(req);
    const author = String(body.author || '匿名').trim().slice(0, 24) || '匿名';
    const text = String(body.body || '').trim().slice(0, 600);
    if (!text) return sendJson(res, 400, { error: 'body required' });
    try {
      const existing = commentByIdStmt.get(id);
      if (!existing) return sendJson(res, 404, { error: 'not found' });
      updateCommentStmt.run(author, text, Date.now(), id);
      return sendJson(res, 200, formatCommentRow(commentByIdStmt.get(id)));
    } catch (err) {
      console.error('comment update failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  if (req.method === 'DELETE' && path.startsWith('/api/comments/')) {
    if (!isAdminReq(req)) return sendJson(res, 401, { error: 'unauthorized' });
    const id = path.slice('/api/comments/'.length);
    try {
      deleteCommentStmt.run(id);
      return sendJson(res, 200, { id, ok: true });
    } catch (err) {
      console.error('comment delete failed', err);
      return sendJson(res, 500, { error: 'db error' });
    }
  }

  return serveStatic(req, res, path);
});

function formatCommentRow(r) {
  return {
    id: r.id,
    schoolId: r.school_id,
    author: r.author,
    body: r.body,
    createdAt: r.created_at,
    updatedAt: r.updated_at || null,
  };
}

server.listen(PORT, () => {
  console.log(`server listening on :${PORT} (db: ${DB_PATH})`);
});
