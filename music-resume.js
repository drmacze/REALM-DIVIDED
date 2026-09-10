(() => {
  const params = new URLSearchParams(location.search);
  let shouldResume = params.get('resumeMusic') === '1';
  try { shouldResume = shouldResume || sessionStorage.getItem('rd_resume_music_once') === '1'; } catch (_) {}
  if (!shouldResume) return;
  try { sessionStorage.removeItem('rd_resume_music_once'); } catch (_) {}

  const attempt = async () => {
    try {
      const ok = await window.RealmOnboarding?.playMusic?.();
      if (ok) cleanup();
      return ok;
    } catch (_) { return false; }
  };
  const cleanup = () => {
    window.removeEventListener('pointerdown', attempt, true);
    window.removeEventListener('touchstart', attempt, true);
    window.removeEventListener('keydown', attempt, true);
  };
  window.setTimeout(async () => {
    const ok = await attempt();
    if (!ok) {
      window.addEventListener('pointerdown', attempt, true);
      window.addEventListener('touchstart', attempt, true);
      window.addEventListener('keydown', attempt, true);
    }
  }, 120);
})();
