// Tiny hash router. Routes:
//   #/                       → list
//   #/school/:id             → detail
//   #/compare/:id1/:id2[:id3][:id4] → compare
//   #/compare-lab            → compare picker
//   #/search[?q=xxx]         → global article search
//   #/majors                 → major search
//   #/practice/:id           → quiz/practice mode
//   #/guide | #/exam | #/growth  → articles (module list)
//   #/article/:id            → article detail
//   #/admin                  → admin panel

function splitHash() {
  const raw = location.hash.replace(/^#/, '');
  const [pathPart, queryPart = ''] = raw.split('?');
  return {
    path: pathPart || '/',
    query: new URLSearchParams(queryPart),
  };
}

function parse() {
  const { path, query } = splitHash();
  if (!path || path === '/' || path === '') return { name: 'list', params: {}, query };
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'school' && parts[1]) {
    return { name: 'detail', params: { id: decodeURIComponent(parts[1]) }, query };
  }
  if (parts[0] === 'compare' && parts.length >= 3) {
    const ids = parts.slice(1, 5).map(p => decodeURIComponent(p)).filter(Boolean);
    return { name: 'compare', params: { a: ids[0], b: ids[1], ids }, query };
  }
  if (parts[0] === 'compare-lab') return { name: 'compareLab', params: {}, query };
  if (parts[0] === 'search') return { name: 'search', params: { q: query.get('q') || '' }, query };
  if (parts[0] === 'majors') return { name: 'majors', params: { q: query.get('q') || '' }, query };
  if (parts[0] === 'practice' && parts[1]) {
    return { name: 'practice', params: { id: decodeURIComponent(parts[1]) }, query };
  }
  if (parts[0] === 'about') return { name: 'about', params: {}, query };
  if (parts[0] === 'admin') return { name: 'admin', params: {}, query };
  if (['guide', 'exam', 'growth'].includes(parts[0])) {
    return { name: 'articles', params: { module: parts[0] }, query };
  }
  if (parts[0] === 'article' && parts[1]) {
    return { name: 'article', params: { id: decodeURIComponent(parts[1]) }, query };
  }
  return { name: 'list', params: {}, query };
}

const listeners = new Set();
let current = parse();

window.addEventListener('hashchange', () => {
  current = parse();
  for (const fn of listeners) fn(current);
});

export function getRoute() {
  return current;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function navigate(path) {
  if (!path.startsWith('#')) path = '#' + path;
  if (location.hash === path) {
    current = parse();
    for (const fn of listeners) fn(current);
  } else {
    location.hash = path;
  }
}
