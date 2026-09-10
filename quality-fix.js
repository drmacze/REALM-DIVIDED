(() => {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  const source = video.querySelector('source');
  if (!source) return;

  const candidates = [
    'assets/realm-divided-cinematic.mp4',
    'realm-divided-cinematic.mp4'
  ];
  let candidateIndex = 0;

  const markUnavailable = () => video.classList.add('video-unavailable');
  const markReady = () => {
    video.classList.remove('video-unavailable');
    document.body.classList.add('video-ready');
  };

  markUnavailable();

  async function tryNextSource() {
    if (candidateIndex >= candidates.length) {
      markUnavailable();
      return;
    }

    const url = candidates[candidateIndex++];
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      const length = Number(response.headers.get('content-length') || 0);
      if (!response.ok || (length > 0 && length < 1024)) {
        return tryNextSource();
      }
    } catch (_) {
      return tryNextSource();
    }

    source.src = `${url}?v=${Date.now()}`;
    video.load();
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  video.addEventListener('loadeddata', markReady);
  video.addEventListener('canplay', markReady);
  source.addEventListener('error', () => {
    markUnavailable();
    tryNextSource();
  });
  video.addEventListener('error', () => {
    markUnavailable();
    tryNextSource();
  });

  tryNextSource();
})();
