// Schools data loader. Merges base JSON with localStorage overrides.
import { getSchoolOverride } from './store.js';

let cache = null;
let loadPromise = null;

export async function loadSchools() {
  if (cache) return cache;
  if (loadPromise) return loadPromise;
  loadPromise = fetch('data/schools.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      cache = data;
      return data;
    })
    .catch(err => {
      loadPromise = null;
      throw err;
    });
  return loadPromise;
}

export function getSchoolById(id) {
  if (!cache) return null;
  const numId = Number(id);
  const base = cache.schools.find(s => s.id === numId);
  if (!base) return null;
  const override = getSchoolOverride(numId);
  return mergeSchool(base, override);
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
