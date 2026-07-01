import { icon } from '../lib/icons.js';
import { escapeHtml, yesNoValue, priceValue, trafficValue, distanceValue, roomSizeValue, powerOffValue, netOffValue } from '../lib/format.js';

function tagFor(val, kind) {
  let t;
  if (kind === 'price') t = priceValue(val);
  else if (kind === 'traffic') t = trafficValue(val);
  else if (kind === 'distance') t = distanceValue(val);
  else if (kind === 'roomSize') t = roomSizeValue(val);
  else if (kind === 'powerOff') t = powerOffValue(val);
  else if (kind === 'netOff') t = netOffValue(val);
  else t = yesNoValue(val);
  return `<span class="tag ${t.cls}">${escapeHtml(t.label)}</span>`;
}

function labeledTag(label, val, kind) {
  return `<span class="labeled-tag">${escapeHtml(label)}${tagFor(val, kind)}</span>`;
}

export function renderSchoolCard(school, commentCount = 0) {
  const f = school.facilities || {};
  const a = school.around || {};

  const tags = [];
  if (f.dormAC) tags.push(labeledTag('空调', f.dormAC));
  if (f.bedDesk) tags.push(labeledTag('上床下桌', f.bedDesk));
  if (f.roomSize) tags.push(`<span class="labeled-tag">${escapeHtml(String(f.roomSize))}人间</span>`);
  if (f.privateBath) tags.push(labeledTag('卫浴', f.privateBath));
  if (a.subway) tags.push(labeledTag('地铁', a.subway));
  if (f.nightPowerOff) {
    const t = powerOffValue(f.nightPowerOff);
    if (t.cls !== 'tag-neutral') tags.push(`<span class="labeled-tag">夜间${escapeHtml(t.label)}</span>`);
  }

  const meta = [];
  if (school.province) meta.push(school.province);
  if (school.city) meta.push(school.city);
  if (school.cityType) meta.push(`<span class="tag tag-neutral">${escapeHtml(school.cityType)}</span>`);
  if (school.nature) meta.push(`<span class="tag tag-neutral">${escapeHtml(school.nature)}</span>`);

  return `
    <button type="button" class="school-card" data-school-id="${school.id}">
      <div class="school-card-head">
        <div>
          <div class="school-card-name">${escapeHtml(school.name)}</div>
          <div class="school-card-meta">${meta.join('<span class="dot"></span>')}</div>
        </div>
        ${school.edited ? `<span class="tag tag-info">已编辑</span>` : ''}
      </div>
      ${tags.length ? `<div class="school-card-tags">${tags.join('')}</div>` : ''}
      <div class="school-card-foot">
        <span class="comment-count"><span class="comment-emoji" aria-hidden="true">💬</span><span data-comment-count="${school.id}">${commentCount}</span></span>
        <span class="arrow">看详情 ${icon('chevronRight', 14)}</span>
      </div>
    </button>
  `;
}

export function renderSkeletonList(count = 5) {
  return Array.from({ length: count }).map(() => `
    <div class="card" style="padding: 14px 16px;">
      <div class="skeleton" style="height: 18px; width: 60%; margin-bottom: 8px;"></div>
      <div class="skeleton" style="height: 12px; width: 40%; margin-bottom: 12px;"></div>
      <div style="display: flex; gap: 6px;">
        <div class="skeleton" style="height: 20px; width: 60px;"></div>
        <div class="skeleton" style="height: 20px; width: 60px;"></div>
        <div class="skeleton" style="height: 20px; width: 60px;"></div>
      </div>
    </div>
  `).join('');
}

export function renderEmptyState({ title, text, actionLabel, actionId }) {
  return `
    <div class="empty-state">
      <div class="empty-state-emoji" aria-hidden="true">🔍</div>
      <div class="empty-state-icon">${icon('info', 48)}</div>
      <div class="empty-state-title">${escapeHtml(title)}</div>
      <div class="empty-state-text">${escapeHtml(text)}</div>
      ${actionLabel ? `<button type="button" class="btn btn-primary" id="${actionId}">${escapeHtml(actionLabel)}</button>` : ''}
    </div>
  `;
}
