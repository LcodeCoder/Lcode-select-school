// Inline SVG icon set. 24px viewBox, 1.5px stroke, currentColor.
// Each export returns an SVG string. Caller decides size via CSS.

const wrap = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;

export const icons = {
  search: wrap('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  filter: wrap('<path d="M4 5h16M7 12h10M10 19h4"/>'),
  back: wrap('<path d="m15 18-6-6 6-6"/>'),
  home: wrap('<path d="M3 12 12 4l9 8v8h-6v-5h-6v5H3z"/>'),
  chevronRight: wrap('<path d="m9 18 6-6-6-6"/>'),
  chevronDown: wrap('<path d="m6 9 6 6 6-6"/>'),
  x: wrap('<path d="M18 6 6 18M6 6l12 12"/>'),
  plus: wrap('<path d="M12 5v14M5 12h14"/>'),
  edit: wrap('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
  trash: wrap('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),
  save: wrap('<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>'),
  message: wrap('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/>'),
  pin: wrap('<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>'),
  bed: wrap('<path d="M2 9V5M2 19v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6M2 17h20M6 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>'),
  ac: wrap('<rect x="3" y="6" width="18" height="9" rx="1.5"/><path d="M6 9v3M10 9v3M14 9v3M18 9v3M7 18l-1 2M12 18v2M17 18l1 2"/>'),
  bath: wrap('<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5H4a1 1 0 0 0 0 2h1l3 3M4 11h16M5 11v3a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-3M7 18l-1 3M17 18l1 3"/>'),
  laundry: wrap('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6h.01M12 6h.01"/>'),
  power: wrap('<path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0"/>'),
  wifi: wrap('<path d="M5 12.55a11 11 0 0 1 14 0M8.5 16.1a6 6 0 0 1 7 0M12 19.5h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/>'),
  metro: wrap('<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M8 19l-2 3M16 19l2 3"/><circle cx="9" cy="15" r="1"/><circle cx="15" cy="15" r="1"/>'),
  cart: wrap('<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 2h3l3 13h12l2-8H6"/>'),
  bike: wrap('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17 9 9h5l3 8M9 9l-2 5M14 9l-3 5"/>'),
  book: wrap('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14ZM4 19.5V21h16"/>'),
  clock: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  building: wrap('<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21V12h6v9M9 7h.01M15 7h.01M9 11h.01M15 11h.01"/>'),
  check: wrap('<path d="M20 6 9 17l-5-5"/>'),
  alert: wrap('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/>'),
  info: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 8v.01M11 12h1v4h1"/>'),
  user: wrap('<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a7 7 0 0 1 14 0v1"/>'),
  settings: wrap('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'),
  shield: wrap('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>'),
  sun: wrap('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>'),
  moon: wrap('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>'),
  package: wrap('<path d="m7.5 4.27 9 5.15M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>'),
  eye: wrap('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
  flame: wrap('<path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.7.8-2.5C8 9 8.5 10 9.5 10.5 9 8 10.5 5 12 2Z"/><path d="M8.5 14a3.5 3.5 0 1 0 7 0c0-1-.3-2-1-2.5.3 1.5-.7 2.5-2 2.5-.5-1.5-2-2-3-1.5-.3.5-.5 1-.5 1.5Z"/>'),
  vs: wrap('<path d="M7 9 3 12l4 3M17 9l4 3-4 3M14 6l-4 12"/>'),
  trophy: wrap('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v5a6 6 0 0 1-12 0V4ZM9 21h6M10 17v4M14 17v4"/>'),
  chart: wrap('<path d="M3 21h18M7 17V9M12 17V5M17 17v-7"/>'),
  swap: wrap('<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>'),
  zap: wrap('<path d="M13 2 4 14h7l-2 8 9-12h-7l2-8Z"/>'),
};

export function icon(name, size = 20) {
  const svg = icons[name] || icons.info;
  return svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
}
