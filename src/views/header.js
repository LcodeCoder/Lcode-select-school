import { icon } from '../lib/icons.js';
import { isAdmin, setAdmin, promptAdmin, getTheme, setTheme, applyTheme, isDarkActive } from '../lib/store.js';
import { navigate, getRoute } from '../lib/router.js';
import { toast } from '../lib/ui.js';

const TABS = [
  { key: 'list', label: '查学校', href: '#/' },
  { key: 'search', label: '搜资料', href: '#/search' },
  { key: 'majors', label: '查专业', href: '#/majors' },
  { key: 'compareLab', label: '学校对比', href: '#/compare-lab' },
  { key: 'guide', label: '新生指南', href: '#/guide' },
  { key: 'exam', label: '志愿填报', href: '#/exam' },
  { key: 'growth', label: '自我提升', href: '#/growth' },
];

function activeTabKey(route) {
  if (route.name === 'articles') return route.params.module;
  if (route.name === 'search') return 'search';
  if (route.name === 'majors') return 'majors';
  if (route.name === 'compare' || route.name === 'compareLab') return 'compareLab';
  if (route.name === 'article' || route.name === 'practice') return null;
  return 'list';
}

export function renderHeader() {
  const admin = isAdmin();
  const activeKey = activeTabKey(getRoute());
  const tabsHtml = TABS.map(t => `
    <button type="button" class="tab${t.key === activeKey ? ' active' : ''}" data-tab="${t.key}" aria-pressed="${t.key === activeKey}">
      <span>${t.label}</span>
    </button>
  `).join('');
  return `
    <header class="app-header">
      <div class="app-header-inner">
        <a class="brand" href="#/" data-nav="home" aria-label="Lcode-select-school 首页">
          <span class="brand-icon">${icon('home', 26)}</span>
          <span>Lcode-select-school</span>
          <span class="brand-tag">宿舍数据</span>
        </a>
        <nav class="app-tabs" aria-label="主导航">${tabsHtml}</nav>
        <div style="flex: 1"></div>
        <button type="button" class="btn-ghost theme-toggle" id="theme-toggle" aria-label="切换主题" title="切换主题">
          <span class="icon-moon">${icon('moon', 20)}</span>
          <span class="icon-sun">${icon('sun', 20)}</span>
        </button>
        <button type="button" class="btn-ghost" id="admin-toggle" aria-pressed="${admin}" aria-label="${admin ? '退出管理员模式' : '进入管理员模式'}" title="${admin ? '退出管理员模式' : '进入管理员模式'}">
          ${admin ? icon('shield', 20) : icon('settings', 20)}
        </button>
      </div>
    </header>
  `;
}

export function bindHeader() {
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn?.addEventListener('click', () => {
    const current = getTheme();
    // If currently dark (explicit or system), switch to light; otherwise switch to dark.
    const next = isDarkActive() ? 'light' : 'dark';
    setTheme(next);
    toast(next === 'dark' ? '已切换到深色模式' : '已切换到浅色模式');
  });

  // Follow system theme changes when in 'system' mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') applyTheme();
  });

  const btn = document.getElementById('admin-toggle');
  btn?.addEventListener('click', async () => {
    if (!isAdmin()) {
      const ok = await promptAdmin();
      if (!ok) {
        toast('密码错误');
        return;
      }
      setAdmin(true);
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', '退出管理员模式');
      btn.innerHTML = icon('shield', 20);
      window.dispatchEvent(new CustomEvent('admin-changed', { detail: true }));
      navigate('/admin');
    } else {
      setAdmin(false);
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', '进入管理员模式');
      btn.innerHTML = icon('settings', 20);
      window.dispatchEvent(new CustomEvent('admin-changed', { detail: false }));
      // If currently on /admin, leave it
      if (location.hash.startsWith('#/admin')) navigate('/');
    }
  });

  const brand = document.querySelector('[data-nav="home"]');
  brand?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/');
  });

  document.querySelectorAll('.app-tabs [data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.tab;
      const tab = TABS.find(t => t.key === key);
      if (!tab) return;
      if (key === 'list') navigate('/');
      else if (key === 'compareLab') navigate('/compare-lab');
      else navigate('/' + key);
    });
  });
}

export function refreshTabs() {
  const activeKey = activeTabKey(getRoute());
  document.querySelectorAll('.app-tabs [data-tab]').forEach(btn => {
    const isActive = btn.dataset.tab === activeKey;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}
