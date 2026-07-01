// Tiny hash router. Routes:
//   #/                       → list
//   #/school/:id             → detail
//   #/compare/:id1/:id2      → compare
//   #/about                  → about
//   #/guide | #/exam | #/growth  → articles (module list)
//   #/article/:id            → article detail
//   #/admin                  → admin panel

function parse() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash || hash === '/' || hash === '') return { name: 'list', params: {} };
  const parts = hash.split('/').filter(Boolean); // ['school','123']
  if (parts[0] === 'school' && parts[1]) {
    return { name: 'detail', params: { id: decodeURIComponent(parts[1]) } };
  }
  if (parts[0] === 'compare' && parts[1] && parts[2]) {
    return { name: 'compare', params: { a: decodeURIComponent(parts[1]), b: decodeURIComponent(parts[2]) } };
  }
  if (parts[0] === 'about') return { name: 'about', params: {} };
  if (parts[0] === 'admin') return { name: 'admin', params: {} };
  if (['guide', 'exam', 'growth'].includes(parts[0])) {
    return { name: 'articles', params: { module: parts[0] } };
  }
  if (parts[0] === 'article' && parts[1]) {
    return { name: 'article', params: { id: decodeURIComponent(parts[1]) } };
  }
  return { name: 'list', params: {} };
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
    // force re-emit
    for (const fn of listeners) fn(current);
  } else {
    location.hash = path;
  }
}
