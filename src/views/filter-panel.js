import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';

export function renderFilterPanel(state, facets) {
  // Province chips
  const provinceChips = (facets.provinces || []).map(p => `
    <button type="button" class="chip" data-filter="province" data-value="${escapeHtml(p)}" aria-pressed="${state.province === p}">${escapeHtml(p)}</button>
  `).join('');

  const cityTypeChips = (facets.cityTypes || []).map(c => `
    <button type="button" class="chip" data-filter="cityType" data-value="${escapeHtml(c)}" aria-pressed="${state.cityType === c}">${escapeHtml(c)}</button>
  `).join('');

  const levelChips = (facets.levels || []).map(l => `
    <button type="button" class="chip" data-filter="level" data-value="${escapeHtml(l)}" aria-pressed="${state.level === l}">${escapeHtml(l)}</button>
  `).join('');

  const natureChips = (facets.natures || []).map(n => `
    <button type="button" class="chip" data-filter="nature" data-value="${escapeHtml(n)}" aria-pressed="${state.nature === n}">${escapeHtml(n)}</button>
  `).join('');

  const roomSizeChips = (facets.roomSizes || []).map(r => `
    <button type="button" class="chip" data-filter="roomSize" data-value="${escapeHtml(r)}" aria-pressed="${state.roomSize === r}">${escapeHtml(r)}人间</button>
  `).join('');

  const yesNo = (key, val, label) => {
    const opts = [
      { v: 'yes', label: '有' },
      { v: 'no', label: '无' },
      { v: 'partial', label: '部分有' },
    ];
    return opts.map(o => `
      <button type="button" class="chip" data-filter="${key}" data-value="${o.v}" aria-pressed="${val === o.v}">${o.label}</button>
    `).join('');
  };

  const onOff = (key, val, label) => {
    return `
      <button type="button" class="chip" data-filter="${key}" data-value="no" aria-pressed="${val === 'no'}">不断${label}</button>
      <button type="button" class="chip" data-filter="${key}" data-value="yes" aria-pressed="${val === 'yes'}">会断${label}</button>
    `;
  };

  return `
    <dialog id="filter-dialog" aria-label="筛选条件">
      <div class="drawer">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">筛选</h2>
          <button type="button" class="btn-ghost" data-close-filter aria-label="关闭">${icon('x', 20)}</button>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">省份</div>
          <div class="filter-chips">${provinceChips || '<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">城市等级</div>
          <div class="filter-chips">${cityTypeChips || '<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">办学层次</div>
          <div class="filter-chips">${levelChips || '<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">办学性质</div>
          <div class="filter-chips">${natureChips || '<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">几人间</div>
          <div class="filter-chips">${roomSizeChips || '<span class="text-muted text-small">无数据</span>'}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">上床下桌</div>
          <div class="filter-chips">${yesNo('bedDesk', state.bedDesk)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">宿舍空调</div>
          <div class="filter-chips">${yesNo('dormAC', state.dormAC)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">独立卫浴</div>
          <div class="filter-chips">${yesNo('privateBath', state.privateBath)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">地铁</div>
          <div class="filter-chips">${yesNo('subway', state.subway)}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">夜间断电</div>
          <div class="filter-chips">${onOff('nightPowerOff', state.nightPowerOff, '电')}</div>
        </div>

        <div class="filter-group">
          <div class="filter-group-title">夜间断网</div>
          <div class="filter-chips">${onOff('nightNetOff', state.nightNetOff, '网')}</div>
        </div>

        <div class="filter-actions">
          <button type="button" class="btn btn-secondary" style="flex: 1;" data-clear-all>清除全部</button>
          <button type="button" class="btn btn-primary" style="flex: 2;" data-close-filter>查看结果</button>
        </div>
      </div>
    </dialog>
  `;
}
