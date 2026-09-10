(() => {
  if (!window.matchMedia('(max-width:899px)').matches) return;

  const cards = [...document.querySelectorAll('.faction-card')];
  cards.forEach((card, i) => {
    const roman = card.querySelector('.sigil')?.textContent?.trim() || String(i + 1);
    card.dataset.roman = roman;
  });

  const refresh = () => {
    if (window.ScrollTrigger) {
      try { window.ScrollTrigger.refresh(); } catch (e) {}
    }
  };

  if (document.fonts?.ready) document.fonts.ready.then(() => setTimeout(refresh, 60));
  window.addEventListener('load', () => setTimeout(refresh, 120), { once: true });
})();