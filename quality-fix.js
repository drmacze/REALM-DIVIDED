(() => {
  const video = document.querySelector('.hero-video');
  if (video) {
    const markUnavailable = () => video.classList.add('video-unavailable');
    video.addEventListener('error', markUnavailable, { once: true });
    const source = video.querySelector('source');
    if (source) source.addEventListener('error', markUnavailable, { once: true });
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }
})();
