(() => {
  if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger, Lenis } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-enhanced');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const lenis = new Lenis({
    autoRaf: false,
    lerp: coarse ? 0.09 : 0.072,
    smoothWheel: true,
    syncTouch: coarse,
    syncTouchLerp: 0.08,
    touchInertiaExponent: 1.55,
    wheelMultiplier: 0.92,
    touchMultiplier: 1.04,
    anchors: { offset: -72 },
    overscroll: true,
    stopInertiaOnNavigate: true
  });

  window.realmLenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const progress = document.createElement('div');
  progress.className = 'rd-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  const orb = document.createElement('div');
  orb.className = 'rd-scroll-orb';
  orb.setAttribute('aria-hidden', 'true');
  document.body.appendChild(orb);

  const chapter = document.createElement('div');
  chapter.className = 'rd-chapter';
  chapter.setAttribute('aria-hidden', 'true');
  chapter.textContent = 'Realm Divided';
  document.body.appendChild(chapter);

  const header = document.querySelector('.site-header');
  const story = document.querySelector('.scroll-story');

  lenis.on('scroll', ({ progress: p, velocity }) => {
    gsap.set(progress, { scaleY: Math.max(0, Math.min(1, p || 0)) });
    if (header) header.classList.toggle('is-scrolled', (p || 0) > 0.008);
    if (!reduced) {
      const v = Math.min(Math.abs(velocity || 0), 28);
      document.documentElement.style.setProperty('--rd-scroll-velocity', String(v));
      if (orb) gsap.to(orb, { opacity: v > 0.9 ? 0.8 : 0, scale: 0.55 + v / 16, duration: 0.24, overwrite: true });
    }
  });

  function splitChars(el) {
    if (!el || el.dataset.split === 'true') return [];
    const label = el.getAttribute('aria-label') || el.textContent.trim();
    const chars = [...el.textContent];
    el.textContent = '';
    el.setAttribute('aria-label', label);
    el.dataset.split = 'true';
    return chars.map((char) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.setAttribute('aria-hidden', 'true');
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      el.appendChild(span);
      return span;
    });
  }

  if (reduced) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    ScrollTrigger.refresh();
    return;
  }

  /* Short opening sequence. */
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.hero .eyebrow', { y: 24, opacity: 0, duration: 0.72 })
    .from('.hero-crest', { y: 20, scale: 0.68, rotate: -4, opacity: 0, duration: 0.82 }, '-=.42')
    .from('.hero-kicker', { y: 18, opacity: 0, duration: 0.58 }, '-=.46')
    .from('.hero h1 span', { yPercent: 95, rotateX: -30, opacity: 0, duration: 0.92 }, '-=.38')
    .from('.hero h1 strong', { yPercent: 105, rotateX: -30, opacity: 0, duration: 1 }, '-=.8')
    .from('.hero-copy', { y: 28, opacity: 0, duration: 0.68 }, '-=.55')
    .from('.hero-actions .btn', { y: 22, opacity: 0, stagger: 0.08, duration: 0.52 }, '-=.45')
    .from('.hero-note,.scroll-cue', { opacity: 0, y: 12, duration: 0.48 }, '-=.28');

  /* Hero becomes a moving layer instead of a static first screen. */
  const heroTL = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.45 }
  });
  heroTL
    .to('.hero-content', { yPercent: -18, scale: 0.88, opacity: 0.12, ease: 'none' }, 0)
    .to('.hero h1', { scale: 1.15, letterSpacing: '0.03em', ease: 'none' }, 0)
    .to('.hero-video,.hero-fallback', { yPercent: 10, scale: 1.15, ease: 'none' }, 0)
    .to('.hero-vignette', { opacity: 1, ease: 'none' }, 0)
    .to('.scroll-cue', { y: 34, opacity: 0, ease: 'none' }, 0);

  /* Lenis-style pinned typography story: zoom through the words as scroll advances. */
  const fiveChars = splitChars(document.querySelector('.story-word-two'));
  const dividedChars = splitChars(document.querySelector('.story-word-three'));
  if (story) {
    const storyTL = gsap.timeline({
      scrollTrigger: {
        trigger: story,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.38,
        invalidateOnRefresh: true
      }
    });

    gsap.set('.story-word-one', { scale: 0.48, opacity: 0, letterSpacing: '0.04em' });
    gsap.set(fiveChars, { yPercent: 120, rotate: 9, opacity: 0 });
    gsap.set(dividedChars, { yPercent: 125, rotateX: -45, opacity: 0 });
    gsap.set('.story-caption,.story-factions', { opacity: 0 });

    storyTL
      .to('.story-word-one', { scale: 1, opacity: 1, letterSpacing: '-0.045em', duration: 1.2, ease: 'power2.out' }, 0)
      .to('.story-grid', { rotate: 5, scale: 1.35, opacity: 0.2, duration: 3.8, ease: 'none' }, 0)
      .to('.story-rings i:nth-child(1)', { scale: 1.6, opacity: 0.18, duration: 2.2, ease: 'none' }, 0.2)
      .to('.story-rings i:nth-child(2)', { scale: 2.1, opacity: 0.1, duration: 2.3, ease: 'none' }, 0.2)
      .to('.story-rings i:nth-child(3)', { scale: 2.8, opacity: 0, duration: 2.4, ease: 'none' }, 0.2)
      .to('.story-kicker', { y: -70, opacity: 0, duration: 0.7 }, 0.85)
      .to('.story-word-one', { scale: 7.2, opacity: 0, letterSpacing: '0.02em', duration: 1.45, ease: 'power2.in' }, 1.15)
      .to(fiveChars, { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.035, duration: 0.95, ease: 'power3.out' }, 2.3)
      .fromTo('.story-factions span', { y: 80, scale: 0.5, opacity: 0, rotate: -8 }, { y: 0, scale: 1, opacity: 1, rotate: 0, stagger: 0.09, duration: 0.9, ease: 'back.out(1.5)' }, 2.65)
      .to('.story-factions', { opacity: 1, duration: 0.25 }, 2.65)
      .to('.story-caption', { opacity: 1, y: -8, duration: 0.7 }, 2.95)
      .to('.story-word-two', { scale: 1.45, letterSpacing: '0.015em', duration: 1.1, ease: 'power2.inOut' }, 3.25)
      .to('.story-word-two,.story-factions,.story-caption', { opacity: 0, y: -70, duration: 0.72, ease: 'power2.in' }, 4.05)
      .to(dividedChars, { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.028, duration: 1, ease: 'power3.out' }, 4.45)
      .to('.story-word-three', { opacity: 1, scale: 1, duration: 0.3 }, 4.45)
      .to('.story-word-three', { scale: 2.6, letterSpacing: '0.03em', opacity: 0.2, duration: 1.6, ease: 'power2.in' }, 5.35)
      .to('.story-grid', { scale: 1.7, rotate: -2, opacity: 0.05, duration: 1.3, ease: 'none' }, 5.45);

    ScrollTrigger.create({
      trigger: story,
      start: 'top 72%',
      end: 'bottom 28%',
      onEnter: () => gsap.to(chapter, { opacity: 1, duration: 0.3 }),
      onLeave: () => gsap.to(chapter, { opacity: 0, duration: 0.3 }),
      onEnterBack: () => gsap.to(chapter, { opacity: 1, duration: 0.3 }),
      onLeaveBack: () => gsap.to(chapter, { opacity: 0, duration: 0.3 })
    });
  }

  /* Section copy gets scroll-linked scale rather than only entrance fades. */
  document.querySelectorAll('.section-heading').forEach((heading) => {
    const parts = heading.querySelectorAll(':scope > .kicker, :scope > h2, :scope > p');
    gsap.fromTo(parts,
      { y: 55, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 84%', once: true } }
    );
    const h2 = heading.querySelector('h2');
    if (h2) gsap.fromTo(h2, { scale: 0.82 }, { scale: 1.06, ease: 'none', scrollTrigger: { trigger: heading, start: 'top 92%', end: 'bottom 30%', scrub: 0.7 } });
  });

  gsap.fromTo('.lore-card',
    { y: 90, rotateX: 10, opacity: 0, scale: 0.94 },
    { y: 0, rotateX: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.11, ease: 'power3.out', scrollTrigger: { trigger: '.lore-grid', start: 'top 84%', once: true } }
  );

  gsap.to('.lore-card:nth-child(1)', { yPercent: -8, rotateZ: -1.1, ease: 'none', scrollTrigger: { trigger: '.lore-grid', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  gsap.to('.lore-card:nth-child(2)', { yPercent: 5, scale: 1.035, ease: 'none', scrollTrigger: { trigger: '.lore-grid', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  gsap.to('.lore-card:nth-child(3)', { yPercent: -5, rotateZ: 1.1, ease: 'none', scrollTrigger: { trigger: '.lore-grid', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

  /* The five factions become a pinned horizontal journey. */
  const factionSection = document.querySelector('.factions-section');
  const factionRow = document.querySelector('.faction-row');
  if (factionSection && factionRow) {
    gsap.fromTo('.faction-card',
      { y: 85, opacity: 0, scale: 0.92, rotateY: -5 },
      { y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: factionSection, start: 'top 88%', once: true } }
    );

    const factionTravel = () => Math.max(0, factionRow.scrollWidth - window.innerWidth + window.innerWidth * 0.12);
    gsap.to(factionRow, {
      x: () => -factionTravel(),
      ease: 'none',
      scrollTrigger: {
        trigger: factionSection,
        start: 'top top',
        end: () => `+=${Math.max(900, factionTravel() * 1.08)}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    gsap.to('.faction-card:nth-child(odd)', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: factionSection, start: 'top top', end: 'bottom top', scrub: 0.8 } });
    gsap.to('.faction-card:nth-child(even)', { yPercent: 5, ease: 'none', scrollTrigger: { trigger: factionSection, start: 'top top', end: 'bottom top', scrub: 0.8 } });
  }

  /* Cinematic panel expands to occupy the screen, then its headline zooms through the viewer. */
  const cinematic = document.querySelector('.cinematic-break');
  if (cinematic) {
    const cinematicTL = gsap.timeline({
      scrollTrigger: {
        trigger: cinematic,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 0.5,
        anticipatePin: 1
      }
    });
    cinematicTL
      .fromTo(cinematic, { clipPath: 'inset(8% 5% 8% 5%)', scale: 0.92, borderRadius: 28 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, borderRadius: 0, duration: 1.1, ease: 'power2.out' }, 0)
      .fromTo('.cinematic-art', { scale: 1.22, yPercent: -5 }, { scale: 1.03, yPercent: 4, duration: 2.3, ease: 'none' }, 0)
      .fromTo('.cinematic-copy', { yPercent: 35, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.45)
      .fromTo('.cinematic-copy h2', { scale: 0.72, transformOrigin: '0% 50%' }, { scale: 1, duration: 0.8, ease: 'power2.out' }, 0.55)
      .to('.cinematic-copy h2', { scale: coarse ? 2.5 : 3.4, xPercent: coarse ? -18 : -28, opacity: 0.05, duration: 1.05, ease: 'power2.in' }, 1.45)
      .to('.cinematic-copy p,.cinematic-copy span', { y: -55, opacity: 0, duration: 0.6 }, 1.55);
  }

  gsap.fromTo('.dev-panel',
    { y: 88, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.dev-panel', start: 'top 84%', once: true } }
  );
  gsap.fromTo('.dev-list > div',
    { x: -32, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.62, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: '.dev-list', start: 'top 87%', once: true } }
  );

  gsap.fromTo('.faq-list details',
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.68, stagger: 0.065, ease: 'power2.out', scrollTrigger: { trigger: '.faq-list', start: 'top 86%', once: true } }
  );

  const preorderTL = gsap.timeline({ scrollTrigger: { trigger: '.preorder-cta', start: 'top 82%', end: 'bottom 72%', scrub: 0.5 } });
  preorderTL
    .fromTo('.preorder-inner img', { scale: 0.45, rotate: -10, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.9 })
    .fromTo('.preorder-inner h2', { scale: 0.72, y: 45, opacity: 0 }, { scale: 1.12, y: 0, opacity: 1, duration: 1 }, 0.2)
    .fromTo('.preorder-inner .kicker,.preorder-inner>p,.preorder-inner .btn', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.75 }, 0.35);

  gsap.matchMedia().add('(min-width: 900px)', () => {
    gsap.to('.realm-section .ornament', { y: -38, opacity: 0.2, rotate: 4, ease: 'none', scrollTrigger: { trigger: '.realm-section', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  });

  const video = document.querySelector('.hero-video');
  video?.addEventListener('loadedmetadata', () => ScrollTrigger.refresh(), { once: true });
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  window.addEventListener('resize', () => ScrollTrigger.refresh());
})();