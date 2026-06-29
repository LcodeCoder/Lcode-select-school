import { icon } from '../lib/icons.js';
import { escapeHtml } from '../lib/format.js';

export function renderFilterChips(state) {
  const active = [];
  if (state.province) active.push({ key: 'province', label: state.province });
  if (state.city) active.push({ key: 'city', label: state.city });
  if (state.cityType) active.push({ key: 'cityType', label: state.cityType });
  if (state.level) active.push({ key: 'level', label: state.level });
  if (state.nature) active.push({ key: 'nature', label: state.nature });
  if (state.bedDesk) active.push({ key: 'bedDesk', label: '上床下桌' });
  if (state.dormAC) active.push({ key: 'dormAC', label: '宿舍空调' });
  if (state.privateBath) active.push({ key: 'privateBath', label: '独立卫浴' });
  if (state.subway) active.push({ key: 'subway', label: '地铁' });
  if (state.roomSize) active.push({ key: 'roomSize', label: `${state.roomSize}人间` });
  if (state.nightPowerOff === 'no') active.push({ key: 'nightPowerOff', label: '不断电' });
  if (state.nightNetOff === 'no') active.push({ key: 'nightNetOff', label: '不断网' });

  const chipsHtml = active.map(c => `
    <button type="button" class="chip" data-filter-clear="${c.key}" aria-pressed="true">
      ${escapeHtml(c.label)}
      <span class="chip-x" aria-hidden="true">${icon('x', 12)}</span>
    </button>
  `).join('');

  const filterBtn = `
    <button type="button" class="chip" id="open-filter" aria-haspopup="dialog">
      ${icon('filter', 16)}
      <span>筛选</span>
      ${active.length ? `<span style="font-variant-numeric: tabular-nums;">${active.length}</span>` : ''}
    </button>
  `;

  return `
    <div class="filter-bar">
      ${filterBtn}
      ${chipsHtml}
      ${active.length ? `<button type="button" class="chip" id="clear-all-filters" style="color: var(--accent); border-color: color-mix(in oklch, var(--accent) 30%, transparent);">清除全部</button>` : ''}
    </div>
  `;
}
