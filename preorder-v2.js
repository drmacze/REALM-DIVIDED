(() => {
  const LOGO = 'https://res.cloudinary.com/vitjnhhb/image/upload/v1789066659/realm-divided/realm-divided-logo.jpg';
  const AUDIO = 'assets/blendertimer-medieval-kingdoms-598387.mp3';
  const PREORDER_KEY = 'rd_preorder_interest_v1';
  const PREORDER_COOKIE = 'rd_preorder_recorded';
  const RESUME_KEY = 'rd_resume_music_once';

  document.querySelectorAll('[data-logo]').forEach(img => { img.src = LOGO; });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const button = document.querySelector('[data-preorder-action]');
  const toast = document.querySelector('.preorder-toast');
  const returnLinks = document.querySelectorAll('[data-return-realm]');
  let toastTimer = 0;
  let returning = false;

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

  const startReturnSoundtrack = () => {
    safeSet('rd_music_enabled_v1', '1');
    try {
      sessionStorage.setItem(RESUME_KEY, '1');
      sessionStorage.setItem('rd_return_music_v1', '1');
    } catch (_) {}

    let player = document.getElementById('rd-return-soundtrack');
    if (!player) {
      player = document.createElement('audio');
      player.id = 'rd-return-soundtrack';
      player.src = AUDIO;
      player.preload = 'auto';
      player.loop = true;
      player.playsInline = true;
      player.volume = 0.42;
      document.body.appendChild(player);
    }

    try {
      if (player.paused) player.currentTime = 0;
      const promise = player.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    } catch (_) {}
  };

  const returnToRealm = event => {
    event.preventDefault();
    if (returning) return;
    returning = true;

    // This call is intentionally synchronous inside the user's click/tap.
    // iOS Safari treats this as a valid media user gesture.
    startReturnSoundtrack();

    event.currentTarget.classList.add('is-returning');

    let canGoBack = false;
    try {
      if (document.referrer) {
        const ref = new URL(document.referrer);
        canGoBack = ref.origin === location.origin && ref.pathname.includes('/REALM-DIVIDED') && !ref.pathname.endsWith('/preorder.html');
      }
    } catch (_) {}

    window.setTimeout(() => {
      if (canGoBack && history.length > 1) {
        history.back();
        // Fallback for browsers that do not restore the previous document.
        window.setTimeout(() => {
          if (document.visibilityState === 'visible') location.href = 'index.html?resumeMusic=1';
        }, 1100);
      } else {
        location.href = 'index.html?resumeMusic=1';
      }
    }, 420);
  };

  returnLinks.forEach(link => link.addEventListener('click', returnToRealm));
})();