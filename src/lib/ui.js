// Simple toast + confirm dialog helpers using <dialog>.
import { escapeHtml } from './format.js';

const toastWrap = document.createElement('div');
toastWrap.className = 'toast-wrap';
document.body.appendChild(toastWrap);

export function toast(message, ms = 2400) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  toastWrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = `opacity 200ms var(--ease)`;
    setTimeout(() => el.remove(), 220);
  }, ms);
}

// Promise-based confirm dialog
export function confirmDialog({ title, message, confirmText = '确认', cancelText = '取消', danger = false }) {
  return new Promise((resolve) => {
    const dlg = document.createElement('dialog');
    dlg.innerHTML = `
      <form method="dialog" class="drawer" style="max-width: 420px;">
        <h3 style="font-size: 1.0625rem; margin-bottom: 8px;">${escapeHtml(title)}</h3>
        <p style="color: var(--muted); font-size: 0.875rem; line-height: 1.6; margin-bottom: 20px;">${escapeHtml(message)}</p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button type="button" data-act="cancel" class="btn btn-secondary">${escapeHtml(cancelText)}</button>
          <button type="button" data-act="confirm" class="btn ${danger ? 'btn-danger' : 'btn-primary'}">${escapeHtml(confirmText)}</button>
        </div>
      </form>
    `;
    document.body.appendChild(dlg);
    dlg.showModal();
    const close = (val) => {
      dlg.close();
      dlg.remove();
      resolve(val);
    };
    dlg.querySelector('[data-act="cancel"]').addEventListener('click', () => close(false));
    dlg.querySelector('[data-act="confirm"]').addEventListener('click', () => close(true));
    dlg.addEventListener('close', () => {
      if (dlg.isConnected) close(false);
    });
  });
}
