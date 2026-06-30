import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const DB_PATH = process.env.DB_PATH || join(ROOT, 'data', 'views.db');
const PORT = Number(process.env.PORT) || 80;

await mkdir(dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec('CREATE TABLE IF NOT EXISTS views (school_id INTEGER PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0)');

const incrementStmt = db.prepare(
  'INSERT INTO views (school_id, count) VALUES (?, 1) ON CONFLICT(school_id) DO UPDATE SET count = count + 1 RETURNING count'
);
const allStmt = db.prepare('SELECT school_id, count FROM views');

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

function sendJson(res, status, body) {
  const payload = Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': payload.length,
  });
  res.end(payload);
}

function sendText(res, status, msg) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(msg);
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
    const buf = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };

    if (urlPath.startsWith('/assets/')) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else if (urlPath.startsWith('/data/')) {
      headers['Cache-Control'] = 'public, max-age=86400';
    } else if (filePath.endsWith('index.html')) {
      headers['Cache-Control'] = 'no-cache';
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

  return serveStatic(req, res, path);
});

server.listen(PORT, () => {
  console.log(`server listening on :${PORT} (db: ${DB_PATH})`);
});
