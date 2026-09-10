(() => {
  const AUDIO = 'assets/blendertimer-medieval-kingdoms-598387.mp3';
  const RESUME_KEY = 'rd_resume_music_once';
  let armed = false;
  let islandTimer = 0;

  const safeGetSession = key => { try { return sessionStorage.getItem(key); } catch (_) { return null; } };
  const safeSetLocal = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };

  const wantsResume = () => {
    const params = new URLSearchParams(location.search);
    return params.get('resumeMusic') === '1' || safeGetSession(RESUME_KEY) === '1' || safeGetSession('rd_return_music_v1') === '1';
  };

  const clearResume = () => {
    try {
      sessionStorage.removeItem(RESUME_KEY);
      sessionStorage.removeItem('rd_return_music_v1');
    } catch (_) {}
    const params = new URLSearchParams(location.search);
    if (params.get('resumeMusic') === '1') {
      const clean = new URL(location.href);
      clean.searchParams.delete('resumeMusic');
      history.replaceState(history.state, '', clean.pathname + clean.search + clean.hash);
    }
  };

  const ensurePlayer = () => {
    let player = document.getElementById('rd-soundtrack');
    if (!player) {
      player = document.createElement('audio');
      player.id = 'rd-soundtrack';
      player.src = AUDIO;
      player.preload = 'auto';
      player.loop = true;
      player.playsInline = true;
      player.setAttribute('playsinline', '');
      player.volume = 0.42;
      document.body.appendChild(player);
    } else {
      player.loop = true;
      player.playsInline = true;
      player.setAttribute('playsinline', '');
      if (!player.src) player.src = AUDIO;
      if (player.volume === 0) player.volume = 0.42;
    }
    return player;
  };

  const showIsland = () => {
    let island = document.querySelector('.rd-music-island');
    if (!island) {
      island = document.createElement('div');
      island.className = 'rd-music-island';
      island.setAttribute('role', 'status');
      island.setAttribute('aria-live', 'polite');
      island.innerHTML = '<div class="rd-music-mark" aria-hidden="true"><i></i><i></i><i></i></div><div class="rd-music-copy"><small>Now playing</small><strong>Realm Divided - Song</strong></div>';
      document.body.appendChild(island);
    }
    clearTimeout(islandTimer);
    requestAnimationFrame(() => island.classList.add('is-open'));
    islandTimer = window.setTimeout(() => island.classList.remove('is-open'), 5200);
  };

  const cleanupGestures = () => {
    if (!armed) return;
    armed = false;
    ['pointerdown','pointerup','touchstart','touchend','click','keydown'].forEach(type => {
      window.removeEventListener(type, resumeFromGesture, true);
    });
  };

  const markPlaying = () => {
    safeSetLocal('rd_music_enabled_v1', '1');
    showIsland();
    clearResume();
    cleanupGestures();
  };

  const playNow = async () => {
    if (!wantsResume()) return false;
    const player = ensurePlayer();

    if (!player.paused && !player.ended) {
      markPlaying();
      return true;
    }

    try {
      const promise = player.play();
      if (promise && typeof promise.then === 'function') await promise;
      markPlaying();
      return true;
    } catch (_) {
      return false;
    }
  };

  async function resumeFromGesture() {
    await playNow();
  }

  const armGestureFallback = () => {
    if (armed || !wantsResume()) return;
    armed = true;
    ['pointerdown','pointerup','touchstart','touchend','click','keydown'].forEach(type => {
      window.addEventListener(type, resumeFromGesture, { capture: true, passive: type.startsWith('touch') || type.startsWith('pointer') });
    });
  };

  const attemptResume = async () => {
    if (!wantsResume()) return false;
    const ok = await playNow();
    if (!ok) armGestureFallback();
    return ok;
  };

  const scheduleAttempts = () => {
    if (!wantsResume()) return;
    [20, 180, 520, 1100].forEach(delay => window.setTimeout(attemptResume, delay));
  };

  window.addEventListener('pageshow', scheduleAttempts);
  window.addEventListener('focus', () => { if (wantsResume()) attemptResume(); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && wantsResume()) attemptResume();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleAttempts, { once: true });
  } else {
    scheduleAttempts();
  }

  window.RealmMusicResume = { play: attemptResume, player: ensurePlayer };
})();