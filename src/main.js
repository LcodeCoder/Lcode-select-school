import './styles/base.css';
import './styles/components.css';
import './styles/app.css';
import { renderHeader, bindHeader, refreshTabs } from './views/header.js';
import { loadSchools, getSchoolById, getFacets } from './lib/data.js';
import { initView as initList } from './views/list-view.js';
import { renderDetailView, bindDetailView } from './views/detail-view.js';
import { initArticleListView } from './views/article-list-view.js';
import { initArticleDetailView } from './views/article-detail-view.js';
import { initAdminView } from './views/admin-view.js';
import { initSearchView } from './views/search-view.js';
import { initPracticeView } from './views/practice-view.js';
import { initMajorsView } from './views/majors-view.js';
import { initCompareLabView, renderCompareMultiView, bindCompareMultiView } from './views/compare-view.js';
import { isAdmin, setAdmin, applyTheme, getAllViews, incrementView } from './lib/store.js';
import { navigate, subscribe, getRoute } from './lib/router.js';
import { toast } from './lib/ui.js';
import { icon } from './lib/icons.js';


const RESUME_PROMO_URL = 'https://resume.lcode.space';
const RESUME_PROMO_SESSION_KEY = 'lcode-resume-promo-seen-v1';

function shouldShowResumePromo() {
  try {
    if (sessionStorage.getItem(RESUME_PROMO_SESSION_KEY) === '1') return false;
    sessionStorage.setItem(RESUME_PROMO_SESSION_KEY, '1');
  } catch (err) {
    // Storage may be unavailable in private modes; still show the useful prompt.
  }
  return true;
}

function showResumePromoDialog() {
  if (!shouldShowResumePromo()) return;
  if (document.querySelector('.resume-promo-dialog')) return;

  const dlg = document.createElement('dialog');
  dlg.className = 'resume-promo-dialog';
  dlg.setAttribute('aria-labelledby', 'resume-promo-title');
  dlg.setAttribute('aria-describedby', 'resume-promo-desc');
  dlg.innerHTML = `
    <div class="resume-promo-shell">
      <button type="button" class="resume-promo-close" aria-label="关闭弹窗">${icon('x', 18)}</button>
      <div class="resume-promo-visual" aria-hidden="true">
        <div class="resume-promo-sheet">
          <span class="resume-promo-avatar">简</span>
          <span class="resume-promo-line strong"></span>
          <span class="resume-promo-line"></span>
          <span class="resume-promo-line short"></span>
          <span class="resume-promo-chip">PDF</span>
        </div>
      </div>
      <div class="resume-promo-content">
        <div class="resume-promo-badge">${icon('doc', 16)}<span>免费简历工具</span></div>
        <h2 id="resume-promo-title">免费制作简历，导出不花钱</h2>
        <p id="resume-promo-desc">从校园经历、实习项目到求职亮点，按步骤填写即可生成清爽专业的中文简历，适合大学新生、实习和校招场景。</p>
        <ul class="resume-promo-points" aria-label="简历网站特色">
          <li>${icon('check', 15)}在线编辑，模板简洁易读</li>
          <li>${icon('check', 15)}免费导出，手机电脑都能用</li>
          <li>${icon('check', 15)}适合实习、社团、校招投递</li>
        </ul>
        <div class="resume-promo-actions">
          <a class="btn btn-primary resume-promo-cta" href="${RESUME_PROMO_URL}" target="_blank" rel="noopener noreferrer">立即免费制作${icon('chevronRight', 16)}</a>
          <button type="button" class="btn btn-secondary resume-promo-later">先看看学校</button>
        </div>
      </div>
    </div>
  `;

  const close = () => {
    if (dlg.open) dlg.close();
    else dlg.remove();
  };

  dlg.addEventListener('click', (event) => {
    if (event.target === dlg) close();
  });
  dlg.addEventListener('close', () => dlg.remove(), { once: true });
  dlg.querySelector('.resume-promo-close')?.addEventListener('click', close);
  dlg.querySelector('.resume-promo-later')?.addEventListener('click', close);
  dlg.querySelector('.resume-promo-cta')?.addEventListener('click', () => {
    window.setTimeout(close, 80);
  });

  document.body.appendChild(dlg);
  if (typeof dlg.showModal === 'function') {
    dlg.showModal();
  } else {
    dlg.setAttribute('open', '');
  }
}

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
  refreshTabs();
  const host = document.getElementById('view-host');
  if (route.name === 'list') {
    renderLoading();
    try {
      const data = await loadSchools();
      await getAllViews();
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
      await getAllViews();
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
      const newCount = incrementView(school.id);
      host.innerHTML = await renderDetailView(school);
      bindDetailView(school);
      const viewsSpan = host.querySelector('.detail-views span');
      if (viewsSpan) viewsSpan.textContent = newCount;
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'about') {
    host.innerHTML = `<main class="app-main"><p>关于页暂未实现。</p></main>`;
  }
  if (route.name === 'compare') {
    renderLoading();
    try {
      await loadSchools();
      const ids = route.params.ids || [route.params.a, route.params.b];
      const schools = ids.map(id => getSchoolById(id)).filter(Boolean);
      if (schools.length < 2) {
        host.innerHTML = `
          <main class="app-main">
            <div class="empty-state" style="padding: 80px 16px;">
              <div class="empty-state-title">找不到要对比的学校</div>
              <div class="empty-state-text">至少需要选择两所学校。</div>
              <button type="button" class="btn btn-primary" onclick="location.hash = '#/compare-lab'">重新选择</button>
            </div>
          </main>
        `;
        return;
      }
      host.innerHTML = renderCompareMultiView(schools.slice(0, 4));
      bindCompareMultiView(schools.slice(0, 4));
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'compareLab') {
    renderLoading();
    try {
      await loadSchools();
      initCompareLabView();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'search') {
    renderLoading();
    try {
      await initSearchView(route.params.q || '');
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'majors') {
    renderLoading();
    try {
      await initMajorsView(route.params.q || '');
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'practice') {
    renderLoading();
    try {
      await initPracticeView(route.params.id);
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'articles') {
    renderLoading();
    try {
      await initArticleListView(route.params.module);
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'article') {
    renderLoading();
    try {
      await initArticleDetailView(route.params.id);
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
  if (route.name === 'admin') {
    renderLoading();
    try {
      await initAdminView();
    } catch (err) {
      renderError(err.message || '未知错误');
    }
    return;
  }
}

function boot() {
  renderShell();
  subscribe((route) => {
    renderRoute(route);
  });
  renderRoute(getRoute());

  window.requestAnimationFrame(() => {
    window.setTimeout(showResumePromoDialog, 420);
  });

  // Re-render current view when admin mode toggles
  window.addEventListener('admin-changed', () => {
    renderRoute(getRoute());
  });
}

boot();
