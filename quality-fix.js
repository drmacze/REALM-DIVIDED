(() => {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  const source = video.querySelector('source');
  const trailerPath = 'assets/gemini_generated_video_228E3EF6.mp4';

  const markUnavailable = () => {
    video.classList.add('video-unavailable');
    document.body.classList.remove('video-ready');
  };

  const markReady = () => {
    video.classList.remove('video-unavailable');
    document.body.classList.add('video-ready');
  };

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  if (source) source.src = trailerPath;
  else video.src = trailerPath;

  video.addEventListener('loadeddata', markReady, { once: true });
  video.addEventListener('canplay', markReady, { once: true });
  video.addEventListener('error', markUnavailable);
  if (source) source.addEventListener('error', markUnavailable);

  video.load();
  const tryPlay = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };
  tryPlay();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
})();
