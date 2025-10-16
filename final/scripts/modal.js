// scripts/modal.js
// accessible modal module: creates modal in provided root and manages focus + keyboard
let modalRoot;
let lastFocused;

export function initModal(root = document.body) {
  modalRoot = root;
}

export function openModal(med) {
  if (!modalRoot) initModal(document.body);
  lastFocused = document.activeElement;

  // create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.tabIndex = -1;
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(med.name)} details">
      <div class="modal-header">
        <h2>${escapeHtml(med.name)}</h2>
        <button class="close-btn" aria-label="Close dialog">✕</button>
      </div>
      <div class="modal-body">
        <img src="${med.image}" alt="${escapeHtml(med.name)}" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;"/>
        <p><strong>Dosage:</strong> ${escapeHtml(med.dosage)}</p>
        <p><strong>Uses:</strong> ${escapeHtml(med.uses)}</p>
        <p><strong>Side effects:</strong> ${escapeHtml(med.sideEffects)}</p>
        <p><strong>Warnings:</strong> ${escapeHtml(med.warnings)}</p>
      </div>
    </div>
  `;
  modalRoot.appendChild(backdrop);

  const modal = backdrop.querySelector('.modal');
  const closeBtn = backdrop.querySelector('.close-btn');

  // focus handling
  const focusable = getFocusableElements(modal);
  let firstFocusable = focusable[0] || closeBtn;
  let lastFocusable = focusable[focusable.length - 1] || closeBtn;

  function trapTab(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function close() {
    backdrop.remove();
    document.removeEventListener('keydown', trapTab);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  document.addEventListener('keydown', trapTab);
  firstFocusable.focus();
}

function getFocusableElements(parent) {
  return Array.from(parent.querySelectorAll('a[href],button,textarea,input,select,[tabindex]:not([tabindex="-1"])'))
    .filter(el => !el.hasAttribute('disabled'));
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export { openModal as default };