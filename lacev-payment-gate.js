/* ── MAPPING CLARITY PAYMENT GATE v2.0 ──────────────────────────────────────
   One-time unlock for export and print functions.
   Token issued and verified server-side via Railway backend.
   Product:      Clarity Map — US$9.99 one-time
   Payment link: https://buy.stripe.com/test_fZu5kC5evdHL4Xv7Hs87K02
   Price ID:     price_1Tgeu3CFrQQKByC6goINNKCA
   Updated:      2026-06-12
   ──────────────────────────────────────────────────────────────────────────── */

const LaceVGate = (() => {

  const STORAGE_KEY  = 'claritymap_access_token';
  const PAYMENT_LINK = 'https://buy.stripe.com/test_fZu5kC5evdHL4Xv7Hs87K02';
  const BACKEND      = 'https://lacev-backend-production.up.railway.app';
  const MODAL_ID     = 'lacev-gate-modal';

  /* ── Token helpers ────────────────────────────────────────────────────── */

  function getToken() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data.token || null;
    } catch (e) {
      return null;
    }
  }

  function storeToken(token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, granted: true, purchased: Date.now() }));
  }

  function revokeAccess() {
    localStorage.removeItem(STORAGE_KEY);
  }

  async function verifyToken(token) {
    try {
      const res = await fetch(BACKEND + '/token/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.valid;
    } catch (e) {
      return false;
    }
  }

  async function hasAccess() {
    const token = getToken();
    if (!token) return false;
    return await verifyToken(token);
  }

  /* ── Modal ────────────────────────────────────────────────────────────── */

  function injectModal() {
    if (document.getElementById(MODAL_ID)) return;

    const style = document.createElement('style');
    style.textContent = `
      #lacev-gate-modal {
        display: none;
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(28,20,16,0.6);
        align-items: center; justify-content: center;
        padding: 1.5rem;
        font-family: 'Inter', ui-sans-serif, sans-serif;
      }
      #lacev-gate-modal.open { display: flex; }
      #lacev-gate-inner {
        background: #F7F3EE;
        border: 1px solid #E0D8CE;
        border-radius: 12px;
        padding: 2rem 2rem 1.75rem;
        max-width: 400px; width: 100%;
        position: relative;
      }
      #lacev-gate-close {
        position: absolute; top: 1rem; right: 1rem;
        background: none; border: none; cursor: pointer;
        font-size: 20px; color: #B09A8A; line-height: 1;
        padding: 0.25rem;
      }
      #lacev-gate-close:hover { color: #1C1410; }
      #lacev-gate-inner .gate-kicker {
        font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
        color: #B09A8A; font-weight: 600; margin: 0 0 0.75rem;
      }
      #lacev-gate-inner h2 {
        font-size: 20px; font-weight: 500; color: #1C1410;
        line-height: 1.3; margin: 0 0 0.65rem;
      }
      #lacev-gate-inner .gate-body {
        font-size: 13px; color: #6A5A4A; line-height: 1.65;
        margin: 0 0 1.25rem;
      }
      #lacev-gate-inner .gate-price {
        display: flex; align-items: baseline; gap: 6px;
        margin: 0 0 1.25rem;
      }
      #lacev-gate-inner .gate-price strong {
        font-size: 26px; font-weight: 500; color: #1C1410;
      }
      #lacev-gate-inner .gate-price span {
        font-size: 13px; color: #6A5A4A;
      }
      #lacev-gate-subscribe {
        display: block; width: 100%;
        background: #7A4A5A; color: #F7F3EE;
        border: none; border-radius: 8px;
        padding: 0.85rem; font-size: 14px; font-weight: 500;
        cursor: pointer; text-align: center;
        font-family: 'Inter', ui-sans-serif, sans-serif;
        transition: opacity 0.15s; margin-bottom: 0.85rem;
        text-decoration: none;
      }
      #lacev-gate-subscribe:hover { opacity: 0.88; }
      #lacev-gate-restore {
        font-size: 12px; color: #9A8070; text-align: center;
        display: block;
      }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div id="lacev-gate-inner">
        <button id="lacev-gate-close" aria-label="Close">×</button>
        <p class="gate-kicker">Export &amp; Reports</p>
        <h2>Download your map.<br>Keep it with you.</h2>
        <p class="gate-body">Your map stays private to your device. A one-time payment unlocks downloading your data and printing your full report — permanently, on this device.</p>
        <div class="gate-price">
          <strong>US$9.99</strong>
          <span>· one-time payment</span>
        </div>
        <a id="lacev-gate-subscribe" href="${PAYMENT_LINK}" target="_blank">Unlock — US$9.99</a>
        <span id="lacev-gate-restore">Already purchased? Use the link from your confirmation email to restore access on this device.</span>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('lacev-gate-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function openModal() {
    injectModal();
    document.getElementById(MODAL_ID).classList.add('open');
  }

  function closeModal() {
    const m = document.getElementById(MODAL_ID);
    if (m) m.classList.remove('open');
  }

  /* ── Public gate function ─────────────────────────────────────────────── */

  async function check(onGranted) {
    if (await hasAccess()) {
      onGranted();
    } else {
      openModal();
    }
  }

  return { check, hasAccess, getToken, storeToken, revokeAccess };

})();
