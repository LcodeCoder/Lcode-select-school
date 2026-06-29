import './styles/base.css';
import './styles/components.css';
import './styles/app.css';
import { renderHeader, bindHeader } from './views/header.js';
import { loadSchools, getSchoolById, getFacets } from './lib/data.js';
import { initView as initList } from './views/list-view.js';
import { renderDetailView, bindDetailView } from './views/detail-view.js';
import { getComments, addComment, updateComment, deleteComment, getSchoolOverride, saveSchoolOverride, deleteSchoolOverride, isAdmin, setAdmin, applyTheme } from './lib/store.js';
import { navigate, subscribe, getRoute } from './lib/router.js';
import { toast } from './lib/ui.js';

// Apply theme before any view renders to avoid flash
applyTheme();

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = renderHeader() + `<div id="view-host"></div>`;
  bindHeader();
}

function renderLoading() {
  const host = document.getElementById('view-host');
  host.innerHTML = `
    <main class="app-main">
      <div class="school-list mt-6">
        ${Array.from({ length: 6 }).map(() => `
          <div class="card" style="padding: 14px 16px;">
            <div class="skeleton" style="height: 18px; width: 60%; margin-bottom: 8px;"></div>
            <div class="skeleton" style="height: 12px; width: 40%; margin-bottom: 12px;"></div>
            <div style="display: flex; gap: 6px;">
              <div class="skeleton" style="height: 20px; width: 60px;"></div>
              <div class="skeleton" style="height: 20px; width: 60px;"></div>
              <div class="skeleton" style="height: 20px; width: 60px;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

function renderError(message) {
  const host = document.getElementById('view-host');
  host.innerHTML = `
    <main class="app-main">
      <div class="empty-state" style="padding: 80px 16px;">
        <div class="empty-state-icon">${''}</div>
        <div class="empty-state-title">数据加载失败</div>
        <div class="empty-state-text">${message}</div>
        <button type="button" class="btn btn-primary" onclick="location.reload()">重新加载</button>
      </div>
    </main>
  `;
}

async function renderRoute(route) {
  const host = document.getElementById('view-host');
  if (route.name === 'list') {
    renderLoading();
    try {
      const data = await loadSchools();
      await initList(data.schools, data.facets);
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'detail') {
    renderLoading();
    try {
      await loadSchools();
      const school = getSchoolById(route.params.id);
      if (!school) {
        host.innerHTML = `
          <main class="app-main">
            <div class="empty-state" style="padding: 80px 16px;">
              <div class="empty-state-title">找不到这所学校</div>
              <div class="empty-state-text">它可能不在数据集里，或者链接有问题。</div>
              <button type="button" class="btn btn-primary" onclick="location.hash = '#/'">返回列表</button>
            </div>
          </main>
        `;
        return;
      }
      host.innerHTML = renderDetailView(school);
      bindDetailView(school);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'about') {
    host.innerHTML = `<main class="app-main"><p>关于页暂未实现。</p></main>`;
  }
}

function boot() {
  renderShell();
  subscribe((route) => {
    renderRoute(route);
  });
  renderRoute(getRoute());

  // Re-render current view when admin mode toggles
  window.addEventListener('admin-changed', () => {
    renderRoute(getRoute());
  });
}

boot();
