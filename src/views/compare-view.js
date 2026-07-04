import { icon } from '../lib/icons.js';
import { escapeHtml, yesNoValue, priceValue, trafficValue, distanceValue, powerOffValue, netOffValue, checkDormValue, netSpeedValue, netPriceValue, curfewValue } from '../lib/format.js';
import { navigate } from '../lib/router.js';
import { getAllSchools } from '../lib/data.js';

const COMPARE_KEY = 'lcode:compare-schools';
const MAX_COMPARE = 4;

function tagFor(val, kind) {
  let t;
  if (kind === 'price') t = priceValue(val);
  else if (kind === 'traffic') t = trafficValue(val);
  else if (kind === 'distance') t = distanceValue(val);
  else if (kind === 'powerOff') t = powerOffValue(val);
  else if (kind === 'netOff') t = netOffValue(val);
  else if (kind === 'checkDorm') t = checkDormValue(val);
  else if (kind === 'netSpeed') t = netSpeedValue(val);
  else if (kind === 'netPrice') t = netPriceValue(val);
  else if (kind === 'curfew') t = curfewValue(val);
  else t = yesNoValue(val);
  return `<span class="tag ${t.cls}">${escapeHtml(t.label)}</span>`;
}

function cmpCell(val, kind) {
  if (val == null || val === '') return `<span class="cmp-cell cmp-cell-empty">—</span>`;
  if (kind === 'roomSize') return `<span class="cmp-cell"><span class="tag tag-info">${escapeHtml(String(val))}人间</span></span>`;
  if (kind) return `<span class="cmp-cell">${tagFor(val, kind)}</span>`;
  return `<span class="cmp-cell cmp-cell-text">${escapeHtml(String(val))}</span>`;
}

function rowsFor(schools) {
  return [
    { group: '基础信息', items: [
      { label: '省份', vals: schools.map(s => s.province) },
      { label: '城市', vals: schools.map(s => s.city) },
      { label: '城市等级', vals: schools.map(s => s.cityType) },
      { label: '办学层次', vals: schools.map(s => s.level) },
      { label: '办学性质', vals: schools.map(s => s.nature) },
      { label: '地址', vals: schools.map(s => s.address) },
    ]},
    { group: '宿舍与设施', items: [
      { label: '上床下桌', vals: schools.map(s => s.facilities?.bedDesk), kind: 'tag' },
      { label: '几人间', vals: schools.map(s => s.facilities?.roomSize), kind: 'roomSize' },
      { label: '宿舍空调', vals: schools.map(s => s.facilities?.dormAC), kind: 'tag' },
      { label: '教室空调', vals: schools.map(s => s.facilities?.classAC), kind: 'tag' },
      { label: '独立卫浴', vals: schools.map(s => s.facilities?.privateBath), kind: 'tag' },
      { label: '洗澡热水时段', vals: schools.map(s => s.facilities?.hotWater) },
      { label: '通宵自习室', vals: schools.map(s => s.facilities?.nightStudy) },
      { label: '夜间断电', vals: schools.map(s => s.facilities?.nightPowerOff), kind: 'powerOff' },
      { label: '夜间断网', vals: schools.map(s => s.facilities?.nightNetOff), kind: 'netOff' },
      { label: '校园网速度', vals: schools.map(s => s.facilities?.netSpeed), kind: 'netSpeed' },
      { label: '校园网价格', vals: schools.map(s => s.facilities?.netPrice), kind: 'netPrice' },
      { label: '大一带电脑', vals: schools.map(s => s.facilities?.bringPC), kind: 'tag' },
      { label: '查寝情况', vals: schools.map(s => s.facilities?.checkDorm), kind: 'checkDorm' },
      { label: '晚归门禁', vals: schools.map(s => s.facilities?.curfew), kind: 'curfew' },
    ]},
    { group: '周边生活', items: [
      { label: '地铁', vals: schools.map(s => s.around?.subway), kind: 'tag' },
      { label: '市区距离', vals: schools.map(s => s.around?.cityDistance), kind: 'distance' },
      { label: '交通便利', vals: schools.map(s => s.around?.traffic), kind: 'traffic' },
      { label: '点外卖', vals: schools.map(s => s.around?.takeout), kind: 'tag' },
      { label: '食堂价格', vals: schools.map(s => s.around?.canteenPrice), kind: 'price' },
      { label: '超市价格', vals: schools.map(s => s.around?.storePrice), kind: 'price' },
      { label: '收发快递', vals: schools.map(s => s.around?.delivery) },
      { label: '共享单车', vals: schools.map(s => s.around?.sharedBike) },
    ]},
  ];
}

function saveSelected(ids) {
  try { localStorage.setItem(COMPARE_KEY, JSON.stringify(ids.slice(0, MAX_COMPARE))); } catch {}
}
function readSelected() {
  try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]').map(Number).filter(Boolean); } catch { return []; }
}

export function initCompareLabView(initialIds = []) {
  const host = document.getElementById('view-host');
  const all = getAllSchools();
  let selected = Array.from(new Set((initialIds.length ? initialIds : readSelected()).map(Number))).slice(0, MAX_COMPARE);
  selected = selected.filter(id => all.some(s => s.id === id));

  const render = () => {
    saveSelected(selected);
    const schools = selected.map(id => all.find(s => s.id === id)).filter(Boolean);
    host.innerHTML = `
      <main class="app-main compare-lab-page">
        <section class="cmp-hero compare-lab-hero">
          <div class="cmp-hero-icon">${icon('vs', 28)}</div>
          <h1 class="cmp-hero-title">学校对比增强版</h1>
          <p class="cmp-hero-sub">最多一次对比 4 所学校。选择记录只保存在当前浏览器，不需要用户表。</p>
        </section>
        <section class="compare-picker-card">
          <div class="compare-selected">
            ${schools.length ? schools.map(s => selectedSchoolPill(s)).join('') : '<div class="compare-empty-slot">先搜索并添加学校（至少 2 所）</div>'}
          </div>
          <div class="global-search-box compare-school-search">
            <span class="search-icon">${icon('search', 19)}</span>
            <input id="compare-search-input" class="input" type="search" placeholder="搜索学校名 / 省份 / 城市" autocomplete="off" />
          </div>
          <div id="compare-candidates" class="compare-candidates">${renderCandidates(all, selected, '')}</div>
          <div class="compare-lab-actions">
            <button type="button" class="btn btn-secondary" id="clear-compare">清空</button>
            <button type="button" class="btn btn-primary" id="start-compare" ${selected.length < 2 ? 'disabled' : ''}>${icon('vs', 15)}<span>开始对比</span></button>
          </div>
        </section>
      </main>
    `;
    bind();
  };

  const bind = () => {
    const input = host.querySelector('#compare-search-input');
    const candidates = host.querySelector('#compare-candidates');
    input?.addEventListener('input', () => { candidates.innerHTML = renderCandidates(all, selected, input.value.trim().toLowerCase()); bindCandidateButtons(candidates); });
    bindCandidateButtons(candidates);
    host.querySelectorAll('[data-remove-school]').forEach(btn => btn.addEventListener('click', () => { selected = selected.filter(id => id !== Number(btn.dataset.removeSchool)); render(); }));
    host.querySelector('#clear-compare')?.addEventListener('click', () => { selected = []; render(); });
    host.querySelector('#start-compare')?.addEventListener('click', () => navigate(`/compare/${selected.join('/')}`));
  };
  const bindCandidateButtons = (wrap) => {
    wrap?.querySelectorAll('[data-add-school]').forEach(btn => btn.addEventListener('click', () => {
      const id = Number(btn.dataset.addSchool);
      if (selected.includes(id)) selected = selected.filter(x => x !== id);
      else if (selected.length < MAX_COMPARE) selected = [...selected, id];
      render();
    }));
  };

  render();
}

function selectedSchoolPill(s) {
  return `
    <div class="compare-selected-pill">
      <div><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.province || '')} · ${escapeHtml(s.city || '')}</span></div>
      <button type="button" class="btn-ghost" data-remove-school="${s.id}" aria-label="移除 ${escapeHtml(s.name)}">${icon('x', 16)}</button>
    </div>
  `;
}

function renderCandidates(all, selected, q) {
  const filtered = all.filter(s => {
    if (!q) return true;
    return `${s.name} ${s.province} ${s.city} ${s.level} ${s.nature}`.toLowerCase().includes(q);
  }).slice(0, 80);
  return filtered.map(s => {
    const on = selected.includes(s.id);
    const f = s.facilities || {};
    return `
      <button type="button" class="compare-candidate${on ? ' selected' : ''}" data-add-school="${s.id}">
        <div><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.province || '')} · ${escapeHtml(s.city || '')}${s.cityType ? ` · ${escapeHtml(s.cityType)}` : ''}</span></div>
        <div class="compare-candidate-tags">
          ${f.dormAC === 'yes' ? '<span class="tag tag-yes">空调</span>' : ''}
          ${f.privateBath === 'yes' ? '<span class="tag tag-yes">独卫</span>' : ''}
          ${f.bedDesk === 'yes' ? '<span class="tag tag-yes">上床下桌</span>' : ''}
          <span class="chip">${on ? '已加入' : '加入'}</span>
        </div>
      </button>
    `;
  }).join('') || '<div class="empty-state"><div class="empty-state-title">没有匹配学校</div></div>';
}

export function renderCompareMultiView(schools) {
  const rows = rowsFor(schools);
  const colStyle = `grid-template-columns: 118px repeat(${schools.length}, minmax(190px, 1fr));`;
  return `
    <main class="app-main compare-multi-page">
      <div class="detail-back-row">
        <a href="#/compare-lab" class="detail-back" data-compare-lab>${icon('back', 16)}<span>重新选择</span></a>
        <button type="button" class="btn btn-secondary btn-sm" id="copy-compare-link">复制对比链接</button>
      </div>
      <section class="cmp-hero">
        <div class="cmp-hero-icon">${icon('vs', 28)}</div>
        <h1 class="cmp-hero-title">学校对比</h1>
        <p class="cmp-hero-sub">横向对比 ${schools.length} 所学校的基础信息、宿舍与生活条件。</p>
      </section>
      <section class="compare-summary-grid">
        ${schools.map(s => summaryCard(s)).join('')}
      </section>
      <section class="cmp-table cmp-table-multi">
        <div class="cmp-head-row cmp-head-row-multi" style="${colStyle}">
          <div class="cmp-label-col"></div>
          ${schools.map(s => `<div class="cmp-school-col"><div class="cmp-school-head"><div class="cmp-school-name">${escapeHtml(s.name)}</div><div class="cmp-school-meta">${escapeHtml(s.province || '')} · ${escapeHtml(s.city || '')}</div><a class="chip" href="#/school/${s.id}">看详情</a></div></div>`).join('')}
        </div>
        ${rows.map(group => `
          <div class="cmp-group">
            <div class="cmp-group-title">${escapeHtml(group.group)}</div>
            ${group.items.map(item => `
              <div class="cmp-row cmp-row-multi" style="${colStyle}">
                <div class="cmp-label">${escapeHtml(item.label)}</div>
                ${item.vals.map(v => `<div class="cmp-cell-a">${cmpCell(v, item.kind)}</div>`).join('')}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </section>
    </main>
  `;
}

export function bindCompareMultiView(schools) {
  saveSelected(schools.map(s => s.id));
  document.querySelector('[data-compare-lab]')?.addEventListener('click', (e) => { e.preventDefault(); navigate('/compare-lab'); });
  document.getElementById('copy-compare-link')?.addEventListener('click', async () => {
    const url = location.href;
    try { await navigator.clipboard.writeText(url); }
    catch { window.prompt('复制这个链接', url); }
  });
}

function summaryCard(s) {
  const f = s.facilities || {};
  const a = s.around || {};
  return `
    <article class="compare-summary-card">
      <h3>${escapeHtml(s.name)}</h3>
      <p>${escapeHtml(s.province || '')} · ${escapeHtml(s.city || '')}${s.level ? ` · ${escapeHtml(s.level)}` : ''}</p>
      <div>
        ${f.dormAC === 'yes' ? '<span class="tag tag-yes">宿舍空调</span>' : ''}
        ${f.privateBath === 'yes' ? '<span class="tag tag-yes">独卫</span>' : ''}
        ${f.roomSize ? `<span class="tag tag-info">${escapeHtml(String(f.roomSize))}人间</span>` : ''}
        ${a.subway === 'yes' ? '<span class="tag tag-yes">地铁</span>' : ''}
      </div>
    </article>
  `;
}
