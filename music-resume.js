(() => {
  const AUDIO = 'assets/blendertimer-medieval-kingdoms-598387.mp3';
  const RESUME_KEY = 'rd_resume_music_once';
  let armed = false;

  const wantsResume = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('resumeMusic') === '1') return true;
    try { return sessionStorage.getItem(RESUME_KEY) === '1'; } catch (_) { return false; }
  };

  const clearResume = () => {
    try { sessionStorage.removeItem(RESUME_KEY); } catch (_) {}
    if (new URLSearchParams(location.search).get('resumeMusic') === '1') {
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
      player.volume = 0.42;
      document.body.appendChild(player);
    } else {
      player.loop = true;
      player.playsInline = true;
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
    requestAnimationFrame(() => island.classList.add('is-open'));
    window.setTimeout(() => island.classList.remove('is-open'), 5200);
  };

  const cleanup = () => {
    if (!armed) return;
    armed = false;
    window.removeEventListener('pointerdown', resumeFromGesture, true);
    window.removeEventListener('touchstart', resumeFromGesture, true);
    window.removeEventListener('keydown', resumeFromGesture, true);
  };

  const playNow = async () => {
    if (!wantsResume()) return false;
    const player = ensurePlayer();
    try {
      const promise = player.play();
      if (promise && typeof promise.then === 'function') await promise;
      showIsland();
      clearResume();
      cleanup();
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
    window.addEventListener('pointerdown', resumeFromGesture, true);
    window.addEventListener('touchstart', resumeFromGesture, true);
    window.addEventListener('keydown', resumeFromGesture, true);
  };

  const attemptResume = async () => {
    if (!wantsResume()) return;
    const ok = await playNow();
    if (!ok) armGestureFallback();
  };

  window.addEventListener('pageshow', () => window.setTimeout(attemptResume, 40));
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(attemptResume, 40), { once: true });
  } else {
    window.setTimeout(attemptResume, 40);
  }
})();
