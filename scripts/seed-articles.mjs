// Seed articles from scripts/materials-out/articles.json into SQLite.
// Run with: node scripts/seed-articles.mjs
import { DatabaseSync } from 'node:sqlite';
import { readFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const DB_PATH = process.env.DB_PATH || join(root, 'data', 'views.db');
const SRC_PATH = resolve(root, 'scripts', 'materials-out', 'articles.json');

if (!existsSync(SRC_PATH)) {
  console.error(`Missing ${SRC_PATH}. Run "node scripts/parse-materials.mjs" first.`);
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);
db.exec(`
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
`);

const raw = await readFile(SRC_PATH, 'utf8');
const articles = JSON.parse(raw);

const clearStmt = db.prepare('DELETE FROM articles');
const insStmt = db.prepare(`
  INSERT INTO articles (module, category, title, source, ord, blocks_json, raw_len)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

db.exec('BEGIN;');
clearStmt.run();
let inserted = 0;
for (const a of articles) {
  insStmt.run(
    a.module,
    a.category,
    a.title,
    a.source || null,
    a.order || 0,
    JSON.stringify(a.blocks || []),
    a.rawLen || 0
  );
  inserted++;
}
db.exec('COMMIT;');

console.log(`Seeded ${inserted} articles into ${DB_PATH}`);
const counts = db.prepare(`SELECT module, COUNT(*) as n FROM articles GROUP BY module`).all();
for (const r of counts) console.log(`  ${r.module}: ${r.n}`);
