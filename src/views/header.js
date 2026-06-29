import { icon } from '../lib/icons.js';
import { isAdmin, setAdmin, promptAdmin, getTheme, setTheme, applyTheme, isDarkActive } from '../lib/store.js';
import { navigate, getRoute } from '../lib/router.js';
import { toast } from '../lib/ui.js';

export function renderHeader() {
  const admin = isAdmin();
  return `
    <header class="app-header">
      <div class="app-header-inner">
        <a class="brand" href="#/" data-nav="home" aria-label="Lcode-select-school 首页">
          <span class="brand-icon">${icon('home', 26)}</span>
          <span>Lcode-select-school</span>
          <span class="brand-tag">宿舍数据</span>
        </a>
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
    const next = !isAdmin();
    if (next) {
      const ok = await promptAdmin();
      if (!ok) {
        toast('密码错误');
        return;
      }
    }
    setAdmin(next);
    btn.setAttribute('aria-pressed', String(next));
    btn.setAttribute('aria-label', next ? '退出管理员模式' : '进入管理员模式');
    btn.innerHTML = next ? icon('shield', 20) : icon('settings', 20);
    // Force re-render of current view
    const e = new CustomEvent('admin-changed', { detail: next });
    window.dispatchEvent(e);
  });

  const brand = document.querySelector('[data-nav="home"]');
  brand?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/');
  });
}
