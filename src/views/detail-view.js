import { icon } from '../lib/icons.js';
import {
  escapeHtml, yesNoValue, priceValue, trafficValue, distanceValue,
  roomSizeValue, powerOffValue, netOffValue, checkDormValue,
  netSpeedValue, netPriceValue, curfewValue, formatTime
} from '../lib/format.js';
import {
  getComments, addComment, updateComment, deleteComment,
  getSchoolOverride, saveSchoolOverride, deleteSchoolOverride,
  isSchoolEdited, isAdmin,
} from '../lib/store.js';
import { navigate } from '../lib/router.js';
import { confirmDialog, toast } from '../lib/ui.js';

function row(label, value, opts = {}) {
  if (value == null || value === '') {
    return `<div class="data-row"><span class="data-key">${escapeHtml(label)}</span><span class="data-val data-val-text text-muted">—</span></div>`;
  }
  if (opts.raw) {
    return `<div class="data-row"><span class="data-key">${escapeHtml(label)}</span><span class="data-val data-val-text">${escapeHtml(value)}</span></div>`;
  }
  if (opts.tag) {
    return `<div class="data-row"><span class="data-key">${escapeHtml(label)}</span><span class="data-val">${value}</span></div>`;
  }
  return `<div class="data-row"><span class="data-key">${escapeHtml(label)}</span><span class="data-val data-val-text">${escapeHtml(value)}</span></div>`;
}

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

export function renderDetailView(school) {
  const admin = isAdmin();
  const edited = isSchoolEdited(school.id);
  const f = school.facilities || {};
  const a = school.around || {};
  const comments = getComments(school.id);

  const facilitiesHtml = `
    <div class="data-grid">
      ${row('上床下桌', tagFor(f.bedDesk), { tag: true })}
      ${row('几人间', f.roomSize ? `<span class="tag tag-info">${escapeHtml(String(f.roomSize))}人间</span>` : null, { tag: true })}
      ${row('宿舍空调', tagFor(f.dormAC), { tag: true })}
      ${row('教室空调', tagFor(f.classAC), { tag: true })}
      ${row('独立卫浴', tagFor(f.privateBath), { tag: true })}
      ${row('洗澡热水时段', f.hotWater, { raw: true })}
      ${row('洗衣机', f.laundry, { raw: true })}
      ${row('通宵自习室', f.nightStudy, { raw: true })}
      ${row('宿舍限电', f.powerLimit, { raw: true })}
      ${row('夜间断电', tagFor(f.nightPowerOff, 'powerOff'), { tag: true })}
      ${row('夜间断网', tagFor(f.nightNetOff, 'netOff'), { tag: true })}
      ${row('校园网速度', tagFor(f.netSpeed, 'netSpeed'), { tag: true })}
      ${row('校园网价格', tagFor(f.netPrice, 'netPrice'), { tag: true })}
      ${row('大一带电脑', tagFor(f.bringPC), { tag: true })}
      ${row('查寝情况', tagFor(f.checkDorm, 'checkDorm'), { tag: true })}
      ${row('晚归门禁', tagFor(f.curfew, 'curfew'), { tag: true })}
      ${row('早晚自习', f.selfStudy, { raw: true })}
      ${row('晨跑要求', f.morningRun, { raw: true })}
      ${row('跑步打卡', f.runCheck, { raw: true })}
    </div>
  `;

  const aroundHtml = `
    <div class="data-grid">
      ${row('地铁', tagFor(a.subway), { tag: true })}
      ${row('市区距离', tagFor(a.cityDistance, 'distance'), { tag: true })}
      ${row('交通便利', tagFor(a.traffic, 'traffic'), { tag: true })}
      ${row('点外卖', tagFor(a.takeout), { tag: true })}
      ${row('食堂价格', tagFor(a.canteenPrice, 'price'), { tag: true })}
      ${row('超市价格', tagFor(a.storePrice, 'price'), { tag: true })}
      ${row('收发快递', a.delivery, { raw: true })}
      ${row('共享单车', a.sharedBike, { raw: true })}
    </div>
  `;

  const commentsHtml = comments.length
    ? comments.map(c => renderComment(c, admin)).join('')
    : `<div class="empty-state" style="padding: 32px 16px;">
         <div class="empty-state-icon">${icon('message', 36)}</div>
         <div class="empty-state-text">还没有评论。住过这所学校？留下第一条。</div>
       </div>`;

  const commentFormHtml = `
    <form class="comment-form" id="comment-form">
      <div class="comment-form-row">
        <input type="text" class="input" id="comment-author" placeholder="昵称（可选）" maxlength="24" />
      </div>
      <textarea class="textarea" id="comment-body" placeholder="留下你真实住过这所学校的体验，3 句话就够。" maxlength="600" required></textarea>
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <span class="text-muted text-small"><span id="char-count">0</span> / 600</span>
        <button type="submit" class="btn btn-primary">${icon('plus', 16)}<span>发表评论</span></button>
      </div>
    </form>
  `;

  return `
    <main class="app-main">
      <a href="#/" class="detail-back" data-back>${icon('back', 16)}<span>返回列表</span></a>

      <div class="detail-header">
        <h1 class="detail-name">${escapeHtml(school.name)}</h1>
        <div class="detail-meta">
          ${school.province ? `<span>${escapeHtml(school.province)}</span><span class="dot"></span>` : ''}
          ${school.city ? `<span>${escapeHtml(school.city)}</span><span class="dot"></span>` : ''}
          ${school.cityType ? `<span class="tag tag-neutral">${escapeHtml(school.cityType)}</span>` : ''}
          ${school.level ? `<span>${escapeHtml(school.level)}</span>` : ''}
          ${school.nature ? `<span class="tag tag-neutral">${escapeHtml(school.nature)}</span>` : ''}
          ${edited ? `<span class="tag tag-info">已编辑</span>` : ''}
        </div>
        ${school.address ? `<div class="text-muted text-small" style="margin-top: 4px; display: flex; align-items: center; gap: 6px;">${icon('pin', 14)}<span>${escapeHtml(school.address)}</span></div>` : ''}
        ${school.multiCampus ? `<div class="text-muted text-small" style="display: flex; align-items: center; gap: 6px;">${icon('building', 14)}<span>${escapeHtml(school.multiCampus)}</span></div>` : ''}
      </div>

      ${admin ? renderAdminBar(edited) : ''}

      <section class="detail-section">
        <h2 class="detail-section-title">${icon('bed', 18)}<span>宿舍与设施</span></h2>
        ${facilitiesHtml}
      </section>

      <section class="detail-section">
        <h2 class="detail-section-title">${icon('metro', 18)}<span>周边生活</span></h2>
        ${aroundHtml}
      </section>

      <section class="detail-section">
        <h2 class="detail-section-title">
          ${icon('message', 18)}<span>评论</span>
          <span class="count num">${comments.length}</span>
        </h2>
        ${commentFormHtml}
        <div class="comment-list mt-4" id="comment-list">
          ${commentsHtml}
        </div>
      </section>
    </main>
  `;
}

function renderAdminBar(edited) {
  return `
    <div class="admin-bar">
      <span>${icon('shield', 16)}<strong>管理员模式</strong>·编辑会保存在本机</span>
      <div class="admin-bar-actions">
        <button type="button" class="btn btn-secondary" id="edit-school" style="height: 32px; padding: 0 12px; font-size: 0.8125rem;">${icon('edit', 14)}<span>编辑</span></button>
        ${edited ? `<button type="button" class="btn btn-danger" id="reset-school" style="height: 32px; padding: 0 12px; font-size: 0.8125rem;">${icon('trash', 14)}<span>还原</span></button>` : ''}
      </div>
    </div>
  `;
}

function renderComment(c, admin) {
  const initial = (c.author || '?').slice(0, 1).toUpperCase();
  return `
    <article class="comment-card" data-comment-id="${c.id}">
      <header class="comment-head">
        <div class="comment-author">
          <span class="comment-avatar">${escapeHtml(initial)}</span>
          <span>${escapeHtml(c.author)}</span>
        </div>
        <time class="comment-time" datetime="${new Date(c.createdAt).toISOString()}">${formatTime(c.createdAt)}</time>
      </header>
      <div class="comment-body">${escapeHtml(c.body)}</div>
      ${admin ? `
        <div class="comment-actions">
          <button type="button" class="comment-action" data-act="edit">${icon('edit', 12)}<span>编辑</span></button>
          <button type="button" class="comment-action danger" data-act="delete">${icon('trash', 12)}<span>删除</span></button>
        </div>
      ` : ''}
    </article>
  `;
}

export function bindDetailView(school) {
  // Back
  document.querySelector('[data-back]')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/');
  });

  // Comment form
  const form = document.getElementById('comment-form');
  const body = document.getElementById('comment-body');
  const charCount = document.getElementById('char-count');
  body?.addEventListener('input', () => { charCount.textContent = body.value.length; });
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.getElementById('comment-author').value;
    const text = body.value.trim();
    if (!text) { toast('写两句再发吧'); return; }
    addComment(school.id, { author, body: text });
    toast('已发表');
    refreshComments(school);
    body.value = '';
    charCount.textContent = '0';
  });

  // Comment edit/delete (admin only)
  document.querySelectorAll('[data-comment-id]').forEach(card => {
    const cid = card.dataset.commentId;
    card.querySelector('[data-act="delete"]')?.addEventListener('click', async () => {
      const ok = await confirmDialog({
        title: '删除评论？',
        message: '这条评论会从本机永久删除。',
        confirmText: '删除',
        danger: true,
      });
      if (!ok) return;
      deleteComment(school.id, cid);
      toast('已删除');
      refreshComments(school);
    });
    card.querySelector('[data-act="edit"]')?.addEventListener('click', () => {
      openCommentEditor(school, cid);
    });
  });

  // Admin: edit school
  document.getElementById('edit-school')?.addEventListener('click', () => openSchoolEditor(school));
  document.getElementById('reset-school')?.addEventListener('click', async () => {
    const ok = await confirmDialog({
      title: '还原学校数据？',
      message: '你在本机对这所学校的编辑会被清除，恢复到 Excel 原始数据。',
      confirmText: '还原',
      danger: true,
    });
    if (!ok) return;
    deleteSchoolOverride(school.id);
    toast('已还原');
    window.dispatchEvent(new CustomEvent('admin-changed', { detail: isAdmin() }));
    // re-navigate to refresh
    navigate(`/school/${school.id}`);
  });
}

function refreshComments(school) {
  const list = document.getElementById('comment-list');
  if (!list) return;
  const admin = isAdmin();
  const comments = getComments(school.id);
  if (comments.length === 0) {
    list.innerHTML = `<div class="empty-state" style="padding: 32px 16px;">
      <div class="empty-state-icon">${icon('message', 36)}</div>
      <div class="empty-state-text">还没有评论。住过这所学校？留下第一条。</div>
    </div>`;
    return;
  }
  list.innerHTML = comments.map(c => renderComment(c, admin)).join('');
  // rebind
  list.querySelectorAll('[data-comment-id]').forEach(card => {
    const cid = card.dataset.commentId;
    card.querySelector('[data-act="delete"]')?.addEventListener('click', async () => {
      const ok = await confirmDialog({ title: '删除评论？', message: '这条评论会从本机永久删除。', confirmText: '删除', danger: true });
      if (!ok) return;
      deleteComment(school.id, cid);
      toast('已删除');
      refreshComments(school);
    });
    card.querySelector('[data-act="edit"]')?.addEventListener('click', () => openCommentEditor(school, cid));
  });
  // Update count in heading
  const countEl = document.querySelector('.detail-section-title .count');
  if (countEl) countEl.textContent = comments.length;
}

function openCommentEditor(school, commentId) {
  const existing = getComments(school.id).find(c => c.id === commentId);
  if (!existing) return;
  const host = document.createElement('div');
  document.body.appendChild(host);
  host.innerHTML = `
    <dialog id="comment-edit-dialog" aria-label="编辑评论">
      <form class="drawer" style="max-width: 480px;" id="comment-edit-form">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">编辑评论</h2>
          <button type="button" class="btn-ghost" data-close>${icon('x', 20)}</button>
        </div>
        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="edit-author">昵称</label>
          <input type="text" class="input" id="edit-author" maxlength="24" value="${escapeHtml(existing.author)}" />
        </div>
        <div class="field" style="margin-bottom: 16px;">
          <label class="field-label" for="edit-body">评论</label>
          <textarea class="textarea" id="edit-body" maxlength="600" required>${escapeHtml(existing.body)}</textarea>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" data-close>取消</button>
          <button type="submit" class="btn btn-primary">保存</button>
        </div>
      </form>
    </dialog>
  `;
  const dlg = host.querySelector('dialog');
  dlg.showModal();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  host.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('close', () => host.remove());
  host.querySelector('#comment-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const author = host.querySelector('#edit-author').value;
    const body = host.querySelector('#edit-body').value.trim();
    if (!body) { toast('写两句再保存'); return; }
    updateComment(school.id, commentId, { author, body });
    toast('已保存');
    dlg.close();
    refreshComments(school);
  });
}

function openSchoolEditor(school) {
  const override = getSchoolOverride(school.id) || {};
  const f = { ...school.facilities, ...override.facilities };
  const a = { ...school.around, ...override.around };
  const base = { ...school, ...override };

  const fields = [
    { group: '基础信息', items: [
      { k: 'name', label: '学校名称', val: base.name || '' },
      { k: 'province', label: '省份', val: base.province || '' },
      { k: 'city', label: '城市', val: base.city || '' },
      { k: 'cityType', label: '城市等级', val: base.cityType || '' },
      { k: 'level', label: '层次', val: base.level || '' },
      { k: 'nature', label: '性质', val: base.nature || '' },
      { k: 'address', label: '地址', val: base.address || '' },
      { k: 'multiCampus', label: '多校区', val: base.multiCampus || '' },
    ]},
    { group: '宿舍与设施', items: [
      { k: 'facilities.bedDesk', label: '上床下桌', val: f.bedDesk || '', type: 'enum', opts: ['', 'yes', 'no', 'partial'] },
      { k: 'facilities.roomSize', label: '几人间', val: f.roomSize || '' },
      { k: 'facilities.dormAC', label: '宿舍空调', val: f.dormAC || '', type: 'enum', opts: ['', 'yes', 'no', 'partial'] },
      { k: 'facilities.classAC', label: '教室空调', val: f.classAC || '', type: 'enum', opts: ['', 'yes', 'no', 'partial'] },
      { k: 'facilities.privateBath', label: '独立卫浴', val: f.privateBath || '', type: 'enum', opts: ['', 'yes', 'no', 'partial'] },
      { k: 'facilities.hotWater', label: '洗澡热水时段', val: f.hotWater || '' },
      { k: 'facilities.laundry', label: '洗衣机', val: f.laundry || '' },
      { k: 'facilities.nightStudy', label: '通宵自习室', val: f.nightStudy || '' },
      { k: 'facilities.powerLimit', label: '宿舍限电', val: f.powerLimit || '' },
      { k: 'facilities.nightPowerOff', label: '夜间断电', val: f.nightPowerOff || '' },
      { k: 'facilities.nightNetOff', label: '夜间断网', val: f.nightNetOff || '' },
      { k: 'facilities.netSpeed', label: '校园网速度', val: f.netSpeed || '' },
      { k: 'facilities.netPrice', label: '校园网价格', val: f.netPrice || '' },
      { k: 'facilities.bringPC', label: '大一带电脑', val: f.bringPC || '', type: 'enum', opts: ['', 'yes', 'no', 'partial'] },
      { k: 'facilities.checkDorm', label: '查寝情况', val: f.checkDorm || '' },
      { k: 'facilities.curfew', label: '晚归门禁', val: f.curfew || '' },
      { k: 'facilities.selfStudy', label: '早晚自习', val: f.selfStudy || '' },
      { k: 'facilities.morningRun', label: '晨跑要求', val: f.morningRun || '' },
      { k: 'facilities.runCheck', label: '跑步打卡', val: f.runCheck || '' },
    ]},
    { group: '周边生活', items: [
      { k: 'around.subway', label: '地铁', val: a.subway || '', type: 'enum', opts: ['', 'yes', 'no', 'partial'] },
      { k: 'around.cityDistance', label: '市区距离', val: a.cityDistance || '' },
      { k: 'around.traffic', label: '交通便利', val: a.traffic || '' },
      { k: 'around.takeout', label: '点外卖', val: a.takeout || '', type: 'enum', opts: ['', 'yes', 'no', 'partial'] },
      { k: 'around.canteenPrice', label: '食堂价格', val: a.canteenPrice || '' },
      { k: 'around.storePrice', label: '超市价格', val: a.storePrice || '' },
      { k: 'around.delivery', label: '收发快递', val: a.delivery || '' },
      { k: 'around.sharedBike', label: '共享单车', val: a.sharedBike || '' },
    ]},
  ];

  const enumLabel = v => v === 'yes' ? '有' : v === 'no' ? '无' : v === 'partial' ? '部分有' : '（空）';

  const renderField = (item) => {
    const id = 'edit-' + item.k.replace(/\./g, '-');
    if (item.type === 'enum') {
      const opts = item.opts.map(o => `<option value="${o}" ${item.val === o ? 'selected' : ''}>${enumLabel(o)}</option>`).join('');
      return `
        <div class="field" style="margin-bottom: 12px;">
          <label class="field-label" for="${id}">${escapeHtml(item.label)}</label>
          <select class="select" id="${id}" data-k="${item.k}">${opts}</select>
        </div>
      `;
    }
    return `
      <div class="field" style="margin-bottom: 12px;">
        <label class="field-label" for="${id}">${escapeHtml(item.label)}</label>
        <input type="text" class="input" id="${id}" data-k="${item.k}" value="${escapeHtml(item.val)}" />
      </div>
    `;
  };

  const host = document.createElement('div');
  document.body.appendChild(host);
  host.innerHTML = `
    <dialog id="school-edit-dialog" aria-label="编辑学校信息">
      <form class="drawer" style="max-width: 640px;" id="school-edit-form">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 1.0625rem;">编辑 · ${escapeHtml(school.name)}</h2>
          <button type="button" class="btn-ghost" data-close>${icon('x', 20)}</button>
        </div>
        <div style="max-height: 60vh; overflow-y: auto; padding-right: 4px;">
          ${fields.map(g => `
            <div style="margin-bottom: 20px;">
              <div class="filter-group-title">${escapeHtml(g.group)}</div>
              ${g.items.map(renderField).join('')}
            </div>
          `).join('')}
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; position: sticky; bottom: 0; background: var(--surface); padding-top: 12px;">
          <button type="button" class="btn btn-secondary" data-close>取消</button>
          <button type="submit" class="btn btn-primary">${icon('save', 16)}<span>保存</span></button>
        </div>
      </form>
    </dialog>
  `;
  const dlg = host.querySelector('dialog');
  dlg.showModal();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  host.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('close', () => host.remove());

  host.querySelector('#school-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const patch = { facilities: {}, around: {} };
    host.querySelectorAll('[data-k]').forEach(input => {
      const k = input.dataset.k;
      const v = input.value;
      const set = (obj, path, val) => {
        const parts = path.split('.');
        let cur = obj;
        for (let i = 0; i < parts.length - 1; i++) {
          cur[parts[i]] = cur[parts[i]] || {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = val;
      };
      set(patch, k, v);
    });
    // also pull top-level fields
    ['name', 'province', 'city', 'cityType', 'level', 'nature', 'address', 'multiCampus'].forEach(k => {
      const input = host.querySelector(`[data-k="${k}"]`);
      if (input) patch[k] = input.value;
    });
    saveSchoolOverride(school.id, patch);
    toast('已保存到本机');
    dlg.close();
    // Trigger re-render
    window.dispatchEvent(new CustomEvent('admin-changed', { detail: isAdmin() }));
    navigate(`/school/${school.id}`);
  });
}
