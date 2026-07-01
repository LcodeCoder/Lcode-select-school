// Schools data loader. Server-backed overrides (SQLite) are merged into the
// cache during loadSchools(), so getSchoolById stays sync and reads pre-merged
// data. After any admin edit, call refreshMergedSchools() to re-merge.
import { getAllSchoolOverrides, getSchoolOverrideSync } from './store.js';

let cache = null;
let loadPromise = null;

export async function loadSchools() {
  if (cache) return cache;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const r = await fetch('data/schools.json');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    cache = data;
    // Merge server-backed overrides into the schools cache in place.
    try {
      const overrides = await getAllSchoolOverrides();
      if (overrides && data.schools) {
        data.schools = data.schools.map(s => {
          const ov = overrides[s.id];
          return ov ? mergeSchool(s, ov) : s;
        });
      }
    } catch (err) {
      console.warn('overrides fetch failed, using base data only', err);
    }
    return data;
  })();
  return loadPromise;
}

export function getSchoolById(id) {
  if (!cache) return null;
  const numId = Number(id);
  const base = cache.schools.find(s => s.id === numId);
  if (!base) return null;
  // If an override exists in the sync cache but hasn't been merged yet (e.g.
  // an edit happened before loadSchools completed), apply it on the fly.
  const override = getSchoolOverrideSync(numId);
  return override ? mergeSchool(base, override) : base;
}

// Re-merge overrides into the schools cache after an admin edit. Reads from
// the store's sync cache so it works even if the server is unreachable.
export function refreshMergedSchools() {
  if (!cache || !cache.schools) return;
  cache.schools = cache.schools.map(s => {
    const ov = getSchoolOverrideSync(s.id);
    return ov ? mergeSchool(s, ov) : s;
  });
}

export function mergeSchool(base, override) {
  if (!override) return base;
  const merged = { ...base, ...override };
  if (override.facilities) merged.facilities = { ...base.facilities, ...override.facilities };
  if (override.around) merged.around = { ...base.around, ...override.around };
  return merged;
}

export function getAllSchools() {
  if (!cache) return [];
  return cache.schools;
}

export function getFacets() {
  if (!cache) return null;
  return cache.facets;
}
