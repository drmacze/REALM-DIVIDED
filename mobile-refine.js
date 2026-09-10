(() => {
  const mobile = window.matchMedia('(max-width:899px)');
  if (!mobile.matches || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  const section = document.querySelector('.factions-section');
  const viewport = document.querySelector('.faction-viewport');
  const row = document.querySelector('.faction-row');
  const cards = [...document.querySelectorAll('.faction-card')];
  if (!section || !viewport || !row || !cards.length) return;

  cards.forEach((card, i) => {
    card.dataset.roman = card.querySelector('.sigil')?.textContent?.trim() || String(i + 1);
  });

  // motion.js also creates faction ScrollTriggers. Remove every one of those
  // before building the dedicated mobile rail so there can only be one pin.
  const clearFactionMotion = () => {
    ScrollTrigger.getAll().forEach(st => {
      const trigger = st.trigger;
      const pin = st.pin;
      const belongs =
        trigger === section || trigger === viewport || trigger === row ||
        pin === section || pin === viewport || pin === row ||
        (trigger instanceof Element && section.contains(trigger));

      if (belongs) {
        try { st.animation?.kill(); } catch (_) {}
        try { st.kill(true); } catch (_) {}
      }
    });

    // Clear transforms left behind by killed desktop/generic rail animations.
    gsap.set(row, { clearProps: 'transform' });
    gsap.set(cards, { clearProps: 'transform,opacity,filter' });
    cards.forEach(card => card.classList.remove('is-active'));
  };

  clearFactionMotion();

  let railTween = null;
  let firstCenter = 0;
  let lastCenter = 0;

  const measure = () => {
    // Positions are measured inside the row before any translate is applied.
    firstCenter = cards[0].offsetLeft + cards[0].offsetWidth / 2;
    const last = cards[cards.length - 1];
    lastCenter = last.offsetLeft + last.offsetWidth / 2;
  };

  const centerX = () => window.innerWidth / 2;
  const startX = () => centerX() - firstCenter;
  const endX = () => centerX() - lastCenter;
  const travel = () => Math.max(1, Math.abs(endX() - startX()));

  const setActiveFromViewport = () => {
    const center = window.innerWidth / 2;
    let activeIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - center);
      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = i;
      }
    });

    cards.forEach((card, i) => card.classList.toggle('is-active', i === activeIndex));
  };

  const buildRail = () => {
    if (railTween) {
      try { railTween.scrollTrigger?.kill(true); } catch (_) {}
      try { railTween.kill(); } catch (_) {}
      railTween = null;
    }

    clearFactionMotion();
    measure();
    gsap.set(row, { x: startX() });
    gsap.set(cards, { opacity: 1, y: 0, yPercent: 0, rotate: 0, rotateY: 0, scale: 1 });

    // Keep the section itself exactly one visual scene high while pinned.
    section.classList.add('mobile-faction-pinned');

    railTween = gsap.to(row, {
      x: () => endX(),
      ease: 'none',
      scrollTrigger: {
        id: 'rd-mobile-faction-rail',
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 1.35, travel() * 1.02)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.32,
        invalidateOnRefresh: true,
        onUpdate: setActiveFromViewport,
        onRefreshInit: () => {
          gsap.set(row, { clearProps: 'transform' });
          measure();
        },
        onRefresh: () => {
          gsap.set(row, { x: startX() });
          setActiveFromViewport();
        }
      }
    });

    setActiveFromViewport();
  };

  const ready = () => {
    buildRail();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(ready));
  } else {
    requestAnimationFrame(ready);
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!mobile.matches) return;
      buildRail();
      ScrollTrigger.refresh();
    }, 180);
  }, { passive: true });
})();