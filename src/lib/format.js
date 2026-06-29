// Semantic helpers: translate raw values into tag classes & display labels.

export function yesNoValue(v) {
  if (v === 'yes') return { cls: 'tag-yes', label: '有' };
  if (v === 'no') return { cls: 'tag-no', label: '无' };
  if (v === 'partial') return { cls: 'tag-partial', label: '部分有' };
  if (v == null) return { cls: 'tag-neutral', label: '—' };
  return { cls: 'tag-neutral', label: String(v) };
}

export function priceValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('较贵') || s.includes('贵')) return { cls: 'tag-no', label: s };
  if (s.includes('便宜')) return { cls: 'tag-yes', label: s };
  if (s.includes('一般') || s.includes('适中')) return { cls: 'tag-partial', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function trafficValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('非常方便')) return { cls: 'tag-yes', label: s };
  if (s.includes('比较方便') || s.includes('方便')) return { cls: 'tag-yes', label: s };
  if (s.includes('一般')) return { cls: 'tag-partial', label: s };
  if (s.includes('不方便') || s.includes('较差')) return { cls: 'tag-no', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function distanceValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('在市区')) return { cls: 'tag-yes', label: s };
  if (s.includes('不在市区')) return { cls: 'tag-partial', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function checkDormValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('不查')) return { cls: 'tag-yes', label: s };
  if (s.includes('很少')) return { cls: 'tag-yes', label: s };
  if (s.includes('有时')) return { cls: 'tag-partial', label: s };
  if (s.includes('严') || s.includes('经常')) return { cls: 'tag-no', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function powerOffValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('不断电')) return { cls: 'tag-yes', label: '不断电' };
  if (s.includes('断电')) return { cls: 'tag-partial', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function netOffValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('不断网')) return { cls: 'tag-yes', label: '不断网' };
  if (s.includes('断网')) return { cls: 'tag-no', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function roomSizeValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  return { cls: 'tag-info', label: String(v) + '人间' };
}

export function netSpeedValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('好') || s.includes('快')) return { cls: 'tag-yes', label: s };
  if (s.includes('一般')) return { cls: 'tag-partial', label: s };
  if (s.includes('差') || s.includes('慢') || s.includes('无')) return { cls: 'tag-no', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function netPriceValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '—' };
  const s = String(v);
  if (s.includes('免费')) return { cls: 'tag-yes', label: s };
  if (s.includes('低')) return { cls: 'tag-yes', label: s };
  if (s.includes('贵') || s.includes('高')) return { cls: 'tag-no', label: s };
  if (s.includes('一般')) return { cls: 'tag-partial', label: s };
  return { cls: 'tag-neutral', label: s };
}

export function curfewValue(v) {
  if (!v) return { cls: 'tag-neutral', label: '无门禁' };
  return { cls: 'tag-info', label: String(v) };
}

export function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} 天前`;
  const sameYear = d.getFullYear() === now.getFullYear();
  const pad = n => String(n).padStart(2, '0');
  const base = `${d.getMonth() + 1}月${d.getDate()}日`;
  return sameYear ? base : `${d.getFullYear()}年${base}`;
}

export function renderTag(val) {
  const t = yesNoValue(val);
  return `<span class="tag ${t.cls}">${escapeHtml(t.label)}</span>`;
}

export function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
