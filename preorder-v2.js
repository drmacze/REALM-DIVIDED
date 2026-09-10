(() => {
  const button = document.querySelector('[data-preorder-action]');
  const toast = document.querySelector('.preorder-toast');
  const returnLinks = document.querySelectorAll('[data-return-realm]');
  const AUDIO = 'assets/blendertimer-medieval-kingdoms-598387.mp3';
  let toastTimer = 0;

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3400);
  };

  if (button) {
    if (localStorage.getItem('rd_preorder_interest_v1') === '1') button.classList.add('is-confirmed');
    button.addEventListener('click', () => {
      localStorage.setItem('rd_preorder_interest_v1', '1');
      button.classList.add('is-confirmed');
      showToast('Pre-order tercatat — $0 / Free. Terima kasih telah mendukung Realm Divided.');
    });
  }

  returnLinks.forEach(link => link.addEventListener('click', (event) => {
    event.preventDefault();
    try { sessionStorage.setItem('rd_resume_music_once', '1'); } catch (_) {}
    const audio = new Audio(AUDIO);
    audio.loop = true;
    audio.volume = 0.36;
    audio.play().catch(() => {});
    window.setTimeout(() => { location.href = 'index.html?resumeMusic=1'; }, 180);
  }));
})();
