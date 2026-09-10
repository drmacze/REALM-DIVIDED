(() => {
  const params = new URLSearchParams(location.search);
  let shouldResume = params.get('resumeMusic') === '1';
  try { shouldResume = shouldResume || sessionStorage.getItem('rd_resume_music_once') === '1'; } catch (_) {}
  if (!shouldResume) return;
  try { sessionStorage.removeItem('rd_resume_music_once'); } catch (_) {}

  let tries = 0;
  const maxTries = 30;
  const cleanup = () => {
    window.removeEventListener('pointerdown', attempt, true);
    window.removeEventListener('touchstart', attempt, true);
    window.removeEventListener('keydown', attempt, true);
  };
  const attempt = async () => {
    try {
      if (!window.RealmOnboarding?.playMusic) return false;
      const ok = await window.RealmOnboarding.playMusic();
      if (ok) cleanup();
      return !!ok;
    } catch (_) { return false; }
  };
  const retry = async () => {
    tries += 1;
    const ok = await attempt();
    if (ok) return;
    if (tries < maxTries) return window.setTimeout(retry, 120);
    window.addEventListener('pointerdown', attempt, true);
    window.addEventListener('touchstart', attempt, true);
    window.addEventListener('keydown', attempt, true);
  };
  window.setTimeout(retry, 80);
})();
