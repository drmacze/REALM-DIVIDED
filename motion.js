(() => {
  if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger, Lenis } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-enhanced');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const lenis = new Lenis({
    lerp: coarse ? 0.115 : 0.085,
    smoothWheel: true,
    syncTouch: coarse,
    syncTouchLerp: 0.075,
    touchInertiaExponent: 1.45,
    wheelMultiplier: 0.9,
    touchMultiplier: 1,
    anchors: { offset: -72 },
    overscroll: true,
    stopInertiaOnNavigate: true,
    respectReducedMotion: true
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

  const header = document.querySelector('.site-header');
  lenis.on('scroll', ({ progress: p, velocity }) => {
    gsap.set(progress, { scaleY: Math.max(0, Math.min(1, p || 0)) });
    if (header) header.classList.toggle('is-scrolled', (p || 0) > 0.008);
    if (!reduced && orb) {
      const v = Math.min(Math.abs(velocity || 0), 24);
      gsap.to(orb, { opacity: v > 0.8 ? 0.8 : 0, scale: 0.6 + v / 18, duration: 0.3, overwrite: true });
    }
  });

  if (reduced) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    ScrollTrigger.refresh();
    return;
  }

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.hero .eyebrow', { y: 22, opacity: 0, duration: 0.75 })
    .from('.hero-crest', { y: 20, scale: 0.72, opacity: 0, duration: 0.85 }, '-=.48')
    .from('.hero-kicker', { y: 18, opacity: 0, duration: 0.65 }, '-=.5')
    .from('.hero h1 span', { yPercent: 85, rotateX: -26, opacity: 0, duration: 0.95 }, '-=.42')
    .from('.hero h1 strong', { yPercent: 95, rotateX: -28, opacity: 0, duration: 1.05 }, '-=.82')
    .from('.hero-copy', { y: 24, opacity: 0, duration: 0.75 }, '-=.58')
    .from('.hero-actions .btn', { y: 18, opacity: 0, stagger: 0.09, duration: 0.58 }, '-=.5')
    .from('.hero-note,.scroll-cue', { opacity: 0, y: 10, duration: 0.55 }, '-=.3');

  const heroTL = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
  });
  heroTL
    .to('.hero-content', { yPercent: -12, scale: 0.965, opacity: 0.45, ease: 'none' }, 0)
    .to('.hero-video,.hero-fallback', { yPercent: 7, scale: 1.07, ease: 'none' }, 0)
    .to('.hero-vignette', { opacity: 0.92, ease: 'none' }, 0)
    .to('.scroll-cue', { y: 22, opacity: 0, ease: 'none' }, 0);

  document.querySelectorAll('.section-heading').forEach((heading) => {
    const parts = heading.querySelectorAll(':scope > .kicker, :scope > h2, :scope > p');
    gsap.fromTo(parts,
      { y: 44, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.05, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 84%', once: true }
      }
    );
  });

  gsap.fromTo('.lore-card',
    { y: 76, rotateX: 8, opacity: 0, scale: 0.98 },
    {
      y: 0, rotateX: 0, opacity: 1, scale: 1, duration: 1.05, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.lore-grid', start: 'top 83%', once: true }
    }
  );

  gsap.fromTo('.faction-card',
    { y: 92, opacity: 0, scale: 0.955 },
    {
      y: 0, opacity: 1, scale: 1, duration: 1.05, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.faction-row', start: 'top 86%', once: true }
    }
  );

  gsap.to('.faction-card:nth-child(odd)', {
    yPercent: -5,
    ease: 'none',
    scrollTrigger: { trigger: '.faction-row', start: 'top bottom', end: 'bottom top', scrub: 1.1 }
  });
  gsap.to('.faction-card:nth-child(even)', {
    yPercent: 4,
    ease: 'none',
    scrollTrigger: { trigger: '.faction-row', start: 'top bottom', end: 'bottom top', scrub: 1.1 }
  });

  const cinematic = document.querySelector('.cinematic-break');
  if (cinematic) {
    gsap.fromTo(cinematic,
      { clipPath: 'inset(8% 5% 8% 5%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: cinematic, start: 'top 92%', end: 'top 30%', scrub: 0.85 }
      }
    );
    gsap.fromTo('.cinematic-copy',
      { yPercent: 28, opacity: 0.2 },
      {
        yPercent: -5, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: cinematic, start: 'top 88%', end: 'bottom 38%', scrub: 0.8 }
      }
    );
    gsap.fromTo('.cinematic-art',
      { scale: 1.08, yPercent: -4 },
      {
        scale: 1.01, yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: cinematic, start: 'top bottom', end: 'bottom top', scrub: 1 }
      }
    );
  }

  gsap.fromTo('.dev-panel',
    { y: 70, opacity: 0, scale: 0.975 },
    {
      y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.dev-panel', start: 'top 84%', once: true }
    }
  );

  gsap.fromTo('.dev-list > div',
    { x: -24, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: '.dev-list', start: 'top 87%', once: true }
    }
  );

  gsap.fromTo('.faq-list details',
    { x: 34, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.72, stagger: 0.07, ease: 'power2.out',
      scrollTrigger: { trigger: '.faq-list', start: 'top 86%', once: true }
    }
  );

  gsap.fromTo('.preorder-inner > *',
    { y: 36, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.82, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.preorder-inner', start: 'top 82%', once: true }
    }
  );

  gsap.matchMedia().add('(min-width: 900px)', () => {
    gsap.to('.realm-section .ornament', {
      y: -26, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.realm-section', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.preorder-inner img', {
      rotate: 7, scale: 1.08, ease: 'none',
      scrollTrigger: { trigger: '.preorder-cta', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();
