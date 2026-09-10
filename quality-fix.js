(() => {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  const source = video.querySelector('source');
  const markUnavailable = () => video.classList.add('video-unavailable');
  const markReady = () => video.classList.remove('video-unavailable');

  // Keep the sharp CSS medieval fallback visible until a real trailer is available.
  markUnavailable();
  video.addEventListener('canplay', markReady, { once: true });
  video.addEventListener('loadeddata', markReady, { once: true });
  video.addEventListener('error', markUnavailable);
  if (source) source.addEventListener('error', markUnavailable);

  const p = video.play();
  if (p && typeof p.catch === 'function') p.catch(markUnavailable);
})();
