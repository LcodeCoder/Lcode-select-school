import { normalizeArticle } from './article-normalizer.js';

let allArticlesPromise = null;
const detailCache = new Map();
const META_CACHE_KEY = 'lcode:article-metas:v1';
const DETAIL_CACHE_PREFIX = 'lcode:article-detail:v1:';
const CACHE_TTL = 30 * 60 * 1000;
const DETAIL_STORE_LIMIT = 240_000; // avoid filling localStorage with very large docs

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
    if (!raw) return null;
    const box = JSON.parse(raw);
    if (!box || box.expires < Date.now()) return null;
    return box.value;
  } catch {
    return null;
  }
}

function writeCache(key, value, { local = false } = {}) {
  try {
    const payload = JSON.stringify({ expires: Date.now() + CACHE_TTL, value });
    (local ? localStorage : sessionStorage).setItem(key, payload);
  } catch {}
}

export async function getAllArticleMetas() {
  if (!allArticlesPromise) {
    const cached = readCache(META_CACHE_KEY);
    allArticlesPromise = cached ? Promise.resolve(cached) : fetch('/api/articles')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(rows => {
        const items = Array.isArray(rows) ? rows : (rows.items || []);
        writeCache(META_CACHE_KEY, items, { local: true });
        return items;
      });
  }
  return allArticlesPromise;
}

export async function getArticleDetail(id) {
  const key = String(id);
  if (!detailCache.has(key)) {
    const cacheKey = DETAIL_CACHE_PREFIX + key;
    const cached = readCache(cacheKey);
    detailCache.set(key, cached ? Promise.resolve(normalizeArticle(cached)) : fetch(`/api/articles/${encodeURIComponent(id)}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(a => {
        const normalized = normalizeArticle(a);
        if ((normalized.rawLen || 0) <= DETAIL_STORE_LIMIT) writeCache(cacheKey, normalized);
        return normalized;
      }));
  }
  return detailCache.get(key);
}

export async function findArticleMeta(predicate) {
  const all = await getAllArticleMetas();
  return all.find(predicate) || null;
}

export function blockPlainText(block) {
  if (!block) return '';
  if (block.text) return block.text;
  if (Array.isArray(block.items)) return block.items.map(it => it.text || '').join(' ');
  return '';
}

export function articlePlainText(article, max = Infinity) {
  let out = '';
  for (const b of article?.blocks || []) {
    out += blockPlainText(b) + '\n';
    if (out.length >= max) return out.slice(0, max);
  }
  return out;
}
