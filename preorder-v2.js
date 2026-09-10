(() => {
  const LOGO = 'https://res.cloudinary.com/vitjnhhb/image/upload/v1789066659/realm-divided/realm-divided-logo.jpg';
  const PREORDER_KEY = 'rd_preorder_interest_v1';
  const PREORDER_COOKIE = 'rd_preorder_recorded';

  document.querySelectorAll('[data-logo]').forEach(img => { img.src = LOGO; });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const button = document.querySelector('[data-preorder-action]');
  const toast = document.querySelector('.preorder-toast');
  const returnLinks = document.querySelectorAll('[data-return-realm]');
  let toastTimer = 0;

  const safeGet = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const hasCookie = name => document.cookie.split(';').some(v => v.trim().startsWith(`${name}=`));
  const setCookie = (name, value, days = 365) => {
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${Math.round(days * 86400)};SameSite=Lax`;
  };

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3400);
  };

  const isRecorded = () => safeGet(PREORDER_KEY) === '1' || hasCookie(PREORDER_COOKIE);
  const lockPreorder = () => {
    if (!button) return;
    button.classList.add('is-confirmed', 'is-locked');
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    button.textContent = 'Pre-Ordered';
  };

  if (button) {
    if (isRecorded()) lockPreorder();
    button.addEventListener('click', () => {
      if (isRecorded() || button.disabled) {
        lockPreorder();
        return;
      }
      safeSet(PREORDER_KEY, '1');
      safeSet('rd_preorder_recorded_at_v1', new Date().toISOString());
      setCookie(PREORDER_COOKIE, '1', 365);
      lockPreorder();
      showToast('Pre-order tercatat — $0 / Free. Terima kasih telah mendukung Realm Divided.');
    }, { once: true });
  }

  const returnToRealm = event => {
    event.preventDefault();
    try { sessionStorage.setItem('rd_resume_music_once', '1'); } catch (_) {}

    let canGoBack = false;
    try {
      if (document.referrer) {
        const ref = new URL(document.referrer);
        canGoBack = ref.origin === location.origin && ref.pathname.includes('/REALM-DIVIDED');
      }
    } catch (_) {}

    if (canGoBack && history.length > 1) {
      history.back();
      window.setTimeout(() => {
        if (document.visibilityState === 'visible') location.href = 'index.html?resumeMusic=1';
      }, 900);
    } else {
      location.href = 'index.html?resumeMusic=1';
    }
  };

  returnLinks.forEach(link => link.addEventListener('click', returnToRealm));
})();
