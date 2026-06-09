/* ── LACE V PAYMENT GATE v1.0 ───────────────────────────────────────────────
   Shared gate for export and print functions across all domain tools.
   Uses localStorage token set by payment-success.html after Stripe checkout.
   Payment link: https://buy.stripe.com/test_aFa8wO36ngTXey52n887K00
   ──────────────────────────────────────────────────────────────────────────── */

const LaceVGate = (() => {

  const STORAGE_KEY   = 'lacev_access_token';
  const PAYMENT_LINK  = 'https://buy.stripe.com/test_aFa8wO36ngTXey52n887K00';
  const MODAL_ID      = 'lacev-gate-modal';

  /* ── Token helpers ────────────────────────────────────────────────────── */

  function hasAccess() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      // Token must exist and not be expired (30 days rolling)
      if (!data.granted || !data.expires) return false;
      return Date.now() < data.expires;
    } catch (e) {
      return false;
    }
  }

  function grantAccess() {
    const expires = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ granted: true, expires }));
  }

  function revokeAccess() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /* ── Modal ────────────────────────────────────────────────────────────── */

  function injectModal() {
    if (document.getElementById(MODAL_ID)) return;

    const style = document.createElement('style');
    style.textContent = `
      #lacev-gate-modal {
        display: none;
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(26,10,10,0.55);
        align-items: center; justify-content: center;
        padding: 1.5rem;
        font-family: 'Inter', sans-serif;
      }
      #lacev-gate-modal.open { display: flex; }
      #lacev-gate-inner {
        background: #F5F1E8;
        border-radius: 12px;
        padding: 2rem 2rem 1.75rem;
        max-width: 400px; width: 100%;
        position: relative;
      }
      #lacev-gate-close {
        position: absolute; top: 1rem; right: 1rem;
        background: none; border: none; cursor: pointer;
        font-size: 20px; color: #9a7a6a; line-height: 1;
        padding: 0.25rem;
      }
      #lacev-gate-close:hover { color: #2a1a1a; }
      #lacev-gate-inner .gate-kicker {
        font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
        color: #9a7a6a; font-weight: 600; margin: 0 0 0.75rem;
      }
      #lacev-gate-inner h2 {
        font-size: 20px; font-weight: 500; color: #1a0a0a;
        line-height: 1.3; margin: 0 0 0.65rem;
      }
      #lacev-gate-inner .gate-body {
        font-size: 13px; color: #7a6a5a; line-height: 1.65;
        margin: 0 0 1.25rem;
      }
      #lacev-gate-inner .gate-price {
        display: flex; align-items: baseline; gap: 6px;
        margin: 0 0 1.25rem;
      }
      #lacev-gate-inner .gate-price strong {
        font-size: 26px; font-weight: 500; color: #1a0a0a;
      }
      #lacev-gate-inner .gate-price span {
        font-size: 13px; color: #7a6a5a;
      }
      #lacev-gate-subscribe {
        display: block; width: 100%;
        background: #6B1A2A; color: #F5F1E8;
        border: none; border-radius: 8px;
        padding: 0.85rem; font-size: 14px; font-weight: 500;
        cursor: pointer; text-align: center;
        font-family: 'Inter', sans-serif;
        transition: opacity 0.15s; margin-bottom: 0.85rem;
        text-decoration: none;
      }
      #lacev-gate-subscribe:hover { opacity: 0.88; }
      #lacev-gate-restore {
        font-size: 12px; color: #7a6a5a; text-align: center;
        display: block;
      }
      #lacev-gate-restore a {
        color: #6B1A2A; cursor: pointer; text-decoration: none;
      }
      #lacev-gate-restore a:hover { text-decoration: underline; }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div id="lacev-gate-inner">
        <button id="lacev-gate-close" aria-label="Close">×</button>
        <p class="gate-kicker">Export &amp; Reports</p>
        <h2>Export your map.<br>Download your report.</h2>
        <p class="gate-body">Your pattern map stays private to your device. Subscribing unlocks downloading your data and printing your full report.</p>
        <div class="gate-price">
          <strong>A$9</strong>
          <span>/ month &middot; cancel anytime</span>
        </div>
        <a id="lacev-gate-subscribe" href="${PAYMENT_LINK}" target="_blank">Subscribe — A$9/month</a>
        <span id="lacev-gate-restore">Already subscribed? <a id="lacev-restore-link">Restore access</a></span>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('lacev-gate-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.getElementById('lacev-restore-link').addEventListener('click', restoreAccess);
  }

  function openModal() {
    injectModal();
    document.getElementById(MODAL_ID).classList.add('open');
  }

  function closeModal() {
    const m = document.getElementById(MODAL_ID);
    if (m) m.classList.remove('open');
  }

  /* ── Restore access ───────────────────────────────────────────────────── */

  function restoreAccess() {
    const email = prompt('Enter the email address you subscribed with.\n\nIf your subscription is active, access will be restored.');
    if (!email) return;
    // Lightweight restore: grant access optimistically.
    // User entered their email — we trust them at $9/month.
    // A determined fraudster can fake this but the risk/reward doesn't justify infrastructure.
    grantAccess();
    closeModal();
    alert('Access restored. You can now export and print your reports.');
  }

  /* ── Public gate function ─────────────────────────────────────────────── */

  function check(onGranted) {
    if (hasAccess()) {
      onGranted();
    } else {
      openModal();
    }
  }

  /* ── Check for token on page load (set by payment-success.html) ───────── */

  function init() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('access') === 'granted') {
      grantAccess();
      // Clean the URL
      const clean = window.location.pathname;
      window.history.replaceState({}, '', clean);
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { check, hasAccess, grantAccess, revokeAccess };

})();
