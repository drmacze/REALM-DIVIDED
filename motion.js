(() => {
  if (!window.Lenis || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger, Lenis } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('motion-enhanced', 'cinematic-v2');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const clamp = gsap.utils.clamp;

  const lenis = new Lenis({
    autoRaf: false,
    lerp: coarse ? 0.082 : 0.065,
    smoothWheel: true,
    syncTouch: coarse,
    syncTouchLerp: 0.075,
    touchInertiaExponent: 1.65,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.02,
    anchors: { offset: -72 },
    overscroll: true,
    stopInertiaOnNavigate: true
  });

  window.realmLenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const make = (tag, className, parent = document.body) => {
    const el = document.createElement(tag);
    el.className = className;
    el.setAttribute('aria-hidden', 'true');
    parent.appendChild(el);
    return el;
  };

  const progress = make('div', 'rd-scroll-progress');
  const orb = make('div', 'rd-scroll-orb');
  const chapter = make('div', 'rd-chapter');
  chapter.textContent = 'Realm Divided';
  const velocityBar = make('div', 'rd-velocity-bar');

  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroMedia = document.querySelector('.hero-video');
  const story = document.querySelector('.scroll-story');
  const storySticky = document.querySelector('.story-sticky');
  const storyStage = document.querySelector('.story-stage');
  const storyRings = document.querySelector('.story-rings');
  const header = document.querySelector('.site-header');

  if (hero) {
    make('div', 'hero-interactive-light', hero);
    make('div', 'hero-scanlines', hero);
  }

  if (storySticky) {
    make('div', 'story-light', storySticky);
    const cross = make('div', 'story-crosshair', storySticky);
    cross.innerHTML = '<i></i><i></i>';
    const final = make('div', 'story-final', storyStage || storySticky);
    final.innerHTML = '<span>THE CROWN IS GONE</span><strong>CHOOSE YOUR ALLEGIANCE</strong>';
    const particles = make('div', 'story-particles', storySticky);
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--i', i);
      p.style.setProperty('--x', `${8 + ((i * 37) % 84)}%`);
      p.style.setProperty('--y', `${8 + ((i * 53) % 82)}%`);
      p.style.setProperty('--s', `${1 + (i % 3)}px`);
      particles.appendChild(p);
    }
  }

  document.documentElement.style.setProperty('--rd-pointer-x', '50%');
  document.documentElement.style.setProperty('--rd-pointer-y', '50%');
  document.documentElement.style.setProperty('--rd-px', '0');
  document.documentElement.style.setProperty('--rd-py', '0');

  const stageRotX = storyStage ? gsap.quickTo(storyStage, 'rotationX', { duration: .75, ease: 'power3.out' }) : null;
  const stageRotY = storyStage ? gsap.quickTo(storyStage, 'rotationY', { duration: .75, ease: 'power3.out' }) : null;
  const ringsX = storyRings ? gsap.quickTo(storyRings, 'x', { duration: .8, ease: 'power3.out' }) : null;
  const ringsY = storyRings ? gsap.quickTo(storyRings, 'y', { duration: .8, ease: 'power3.out' }) : null;
  const heroX = heroContent ? gsap.quickTo(heroContent, 'x', { duration: .9, ease: 'power3.out' }) : null;
  const mediaX = heroMedia ? gsap.quickTo(heroMedia, 'x', { duration: 1.15, ease: 'power3.out' }) : null;

  function applyPointer(clientX, clientY) {
    const nx = clamp(-1, 1, (clientX / window.innerWidth - .5) * 2);
    const ny = clamp(-1, 1, (clientY / window.innerHeight - .5) * 2);
    document.documentElement.style.setProperty('--rd-pointer-x', `${clientX}px`);
    document.documentElement.style.setProperty('--rd-pointer-y', `${clientY}px`);
    document.documentElement.style.setProperty('--rd-px', nx.toFixed(3));
    document.documentElement.style.setProperty('--rd-py', ny.toFixed(3));
    if (reduced) return;
    if (stageRotX) stageRotX(-ny * (coarse ? 1.6 : 3.4));
    if (stageRotY) stageRotY(nx * (coarse ? 1.8 : 4.2));
    if (ringsX) ringsX(nx * (coarse ? 6 : 16));
    if (ringsY) ringsY(ny * (coarse ? 5 : 12));
    if (heroX) heroX(nx * (coarse ? 3 : 10));
    if (mediaX) mediaX(nx * (coarse ? -2 : -8));
  }

  window.addEventListener('pointermove', e => applyPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) applyPointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  window.addEventListener('pointerdown', e => {
    if (reduced) return;
    const pulse = make('span', 'rd-tap-pulse');
    pulse.style.left = `${e.clientX}px`;
    pulse.style.top = `${e.clientY}px`;
    gsap.fromTo(pulse, { scale: .2, opacity: .65 }, { scale: 5, opacity: 0, duration: .75, ease: 'power2.out', onComplete: () => pulse.remove() });
  }, { passive: true });

  const velocitySet = velocityBar ? gsap.quickTo(velocityBar, 'scaleY', { duration: .18, ease: 'power2.out' }) : null;
  const stageSkew = storyStage ? gsap.quickTo(storyStage, 'skewY', { duration: .28, ease: 'power2.out' }) : null;

  lenis.on('scroll', ({ progress: p, velocity = 0, direction = 0 }) => {
    const v = clamp(0, 30, Math.abs(velocity));
    gsap.set(progress, { scaleY: clamp(0, 1, p || 0) });
    if (header) header.classList.toggle('is-scrolled', (p || 0) > .008);
    document.documentElement.style.setProperty('--rd-scroll-velocity', v.toFixed(2));
    document.documentElement.style.setProperty('--rd-scroll-direction', String(direction || 0));
    if (!reduced) {
      if (orb) gsap.to(orb, { opacity: v > .8 ? .82 : 0, scale: .55 + v / 13, duration: .22, overwrite: true });
      if (velocitySet) velocitySet(clamp(.08, 1, v / 18));
      if (stageSkew) stageSkew(clamp(-1.1, 1.1, velocity * .06));
    }
  });

  function splitChars(el) {
    if (!el) return [];
    if (el.dataset.split === 'true') return [...el.querySelectorAll('.char')];
    const label = el.getAttribute('aria-label') || el.textContent.trim();
    const chars = [...el.textContent];
    el.textContent = '';
    el.setAttribute('aria-label', label);
    el.dataset.split = 'true';
    return chars.map(char => {
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

  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .from('.hero .eyebrow', { y: 24, opacity: 0, duration: .72 })
    .from('.hero-crest', { y: 20, scale: .68, rotate: -4, opacity: 0, duration: .82 }, '-=.42')
    .from('.hero-kicker', { y: 18, opacity: 0, duration: .58 }, '-=.46')
    .from('.hero h1 span', { yPercent: 95, rotateX: -30, opacity: 0, duration: .92 }, '-=.38')
    .from('.hero h1 strong', { yPercent: 105, rotateX: -30, opacity: 0, duration: 1 }, '-=.8')
    .from('.hero-copy', { y: 28, opacity: 0, duration: .68 }, '-=.55')
    .from('.hero-actions .btn', { y: 22, opacity: 0, stagger: .08, duration: .52 }, '-=.45')
    .from('.hero-note,.scroll-cue', { opacity: 0, y: 12, duration: .48 }, '-=.28');

  if (hero) {
    const heroTL = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .32 }
    });
    heroTL
      .to('.hero-content', { yPercent: -22, scale: .82, opacity: .06, filter: 'blur(4px)', ease: 'none' }, 0)
      .to('.hero h1', { scale: 1.22, letterSpacing: '.04em', ease: 'none' }, 0)
      .to('.hero-video,.hero-fallback', { yPercent: 12, scale: 1.2, filter: 'saturate(.8) contrast(1.08) brightness(.72)', ease: 'none' }, 0)
      .to('.hero-vignette', { opacity: 1, ease: 'none' }, 0)
      .to('.hero-interactive-light', { opacity: .18, scale: 1.25, ease: 'none' }, 0)
      .to('.scroll-cue', { y: 38, opacity: 0, ease: 'none' }, 0);
  }

  const oneChars = splitChars(document.querySelector('.story-word-one'));
  const fiveChars = splitChars(document.querySelector('.story-word-two'));
  const dividedChars = splitChars(document.querySelector('.story-word-three'));

  if (story) {
    gsap.set('.story-word-one,.story-word-two,.story-word-three', { opacity: 1 });
    gsap.set(oneChars, { opacity: 0, yPercent: 70, z: -120, rotateX: -35 });
    gsap.set(fiveChars, { opacity: 0, yPercent: 110, z: -160, rotateX: -50 });
    gsap.set(dividedChars, { opacity: 0, yPercent: 115, z: -200, rotateX: -55 });
    gsap.set('.story-caption,.story-factions,.story-final', { opacity: 0 });

    const storyTL = gsap.timeline({
      scrollTrigger: {
        trigger: story,
        start: 'top top',
        end: 'bottom bottom',
        scrub: .26,
        invalidateOnRefresh: true
      }
    });

    storyTL
      .to(oneChars, { opacity: 1, yPercent: 0, z: 0, rotateX: 0, stagger: .028, duration: .9, ease: 'power3.out' }, 0)
      .fromTo('.story-kicker', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .55 }, .08)
      .to('.story-grid', { rotate: 3, scale: 1.24, opacity: .19, duration: 2.1, ease: 'none' }, 0)
      .to('.story-rings i:nth-child(1)', { scale: 1.38, opacity: .24, duration: 1.75, ease: 'none' }, .15)
      .to('.story-rings i:nth-child(2)', { scale: 1.75, opacity: .17, duration: 1.9, ease: 'none' }, .15)
      .to('.story-rings i:nth-child(3)', { scale: 2.25, opacity: .08, duration: 2, ease: 'none' }, .15)
      .to('.story-word-one', { scale: 1.12, duration: .6, ease: 'power2.inOut' }, .85)
      .to('.story-kicker', { opacity: 0, y: -50, duration: .42 }, 1.05)
      .to('.story-word-one', { scale: coarse ? 5.5 : 7.4, opacity: 0, filter: 'blur(5px)', duration: 1.05, ease: 'power2.in' }, 1.3)
      .to(fiveChars, { opacity: 1, yPercent: 0, z: 0, rotateX: 0, stagger: .025, duration: .92, ease: 'power3.out' }, 1.95)
      .fromTo('.story-factions span', { y: 70, scale: .45, opacity: 0, rotate: -10 }, { y: 0, scale: 1, opacity: 1, rotate: 0, stagger: .075, duration: .8, ease: 'back.out(1.4)' }, 2.2)
      .to('.story-factions', { opacity: 1, duration: .18 }, 2.2)
      .fromTo('.story-caption', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .62, ease: 'power2.out' }, 2.5)
      .to('.story-word-two', { scale: 1.24, letterSpacing: '.012em', duration: .8, ease: 'power2.inOut' }, 2.9)
      .to('.story-factions span', { y: i => i % 2 ? -12 : 12, rotate: i => i % 2 ? 2 : -2, duration: .8, stagger: .04, ease: 'sine.inOut' }, 3)
      .to('.story-word-two,.story-factions,.story-caption', { opacity: 0, y: -54, filter: 'blur(3px)', duration: .68, ease: 'power2.in' }, 3.65)
      .to(dividedChars, { opacity: 1, yPercent: 0, z: 0, rotateX: 0, stagger: .022, duration: .9, ease: 'power3.out' }, 3.95)
      .to('.story-word-three', { scale: 1.06, duration: .5 }, 4.4)
      .to('.story-rings i', { scale: i => 1.2 + i * .65, opacity: .07, duration: 1.2, stagger: .05, ease: 'none' }, 4.25)
      .to('.story-word-three', { scale: coarse ? 2.25 : 3.05, letterSpacing: '.025em', opacity: .11, filter: 'blur(2px)', duration: 1.15, ease: 'power2.in' }, 4.85)
      .fromTo('.story-final', { opacity: 0, y: 35, scale: .94 }, { opacity: 1, y: 0, scale: 1, duration: .72, ease: 'power3.out' }, 5.2)
      .to('.story-grid', { scale: 1.62, rotate: -2, opacity: .06, duration: 1.3, ease: 'none' }, 5.05)
      .to('.story-final', { letterSpacing: '.045em', duration: .8, ease: 'none' }, 5.55);

    ScrollTrigger.create({
      trigger: story,
      start: 'top 72%',
      end: 'bottom 28%',
      onEnter: () => gsap.to(chapter, { opacity: 1, duration: .3 }),
      onLeave: () => gsap.to(chapter, { opacity: 0, duration: .3 }),
      onEnterBack: () => gsap.to(chapter, { opacity: 1, duration: .3 }),
      onLeaveBack: () => gsap.to(chapter, { opacity: 0, duration: .3 })
    });
  }

  document.querySelectorAll('.section-heading').forEach(heading => {
    const parts = heading.querySelectorAll(':scope > .kicker, :scope > h2, :scope > p');
    gsap.fromTo(parts,
      { y: 58, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: .08, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 84%', once: true } }
    );
    const h2 = heading.querySelector('h2');
    if (h2) gsap.fromTo(h2, { scale: .8 }, { scale: 1.07, ease: 'none', scrollTrigger: { trigger: heading, start: 'top 94%', end: 'bottom 28%', scrub: .55 } });
  });

  gsap.fromTo('.lore-card',
    { y: 92, rotateX: 12, opacity: 0, scale: .93 },
    { y: 0, rotateX: 0, opacity: 1, scale: 1, duration: 1, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.lore-grid', start: 'top 84%', once: true } }
  );
  gsap.to('.lore-card:nth-child(1)', { yPercent: -9, rotateZ: -1.2, ease: 'none', scrollTrigger: { trigger: '.lore-grid', start: 'top bottom', end: 'bottom top', scrub: .72 } });
  gsap.to('.lore-card:nth-child(2)', { yPercent: 6, scale: 1.04, ease: 'none', scrollTrigger: { trigger: '.lore-grid', start: 'top bottom', end: 'bottom top', scrub: .72 } });
  gsap.to('.lore-card:nth-child(3)', { yPercent: -6, rotateZ: 1.2, ease: 'none', scrollTrigger: { trigger: '.lore-grid', start: 'top bottom', end: 'bottom top', scrub: .72 } });

  const factionSection = document.querySelector('.factions-section');
  const factionRow = document.querySelector('.faction-row');
  const factionCards = [...document.querySelectorAll('.faction-card')];
  if (factionSection && factionRow && factionCards.length) {
    gsap.fromTo(factionCards,
      { y: 85, opacity: 0, scale: .9, rotateY: -7 },
      { y: 0, opacity: 1, scale: 1, rotateY: 0, duration: .9, stagger: .075, ease: 'power3.out', scrollTrigger: { trigger: factionSection, start: 'top 88%', once: true } }
    );

    const factionTravel = () => Math.max(0, factionRow.scrollWidth - window.innerWidth + window.innerWidth * .1);
    const railTween = gsap.to(factionRow, {
      x: () => -factionTravel(),
      ease: 'none',
      scrollTrigger: {
        trigger: factionSection,
        start: 'top top',
        end: () => `+=${Math.max(900, factionTravel() * 1.12)}`,
        pin: true,
        scrub: .35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
          const center = window.innerWidth / 2;
          factionCards.forEach(card => {
            const r = card.getBoundingClientRect();
            const d = Math.abs((r.left + r.width / 2) - center);
            card.classList.toggle('is-active', d < r.width * .55);
          });
        }
      }
    });

    factionCards.forEach((card, i) => {
      gsap.to(card, {
        rotateZ: i % 2 ? .8 : -.8,
        yPercent: i % 2 ? 5 : -6,
        ease: 'none',
        scrollTrigger: { trigger: factionSection, start: 'top top', end: () => railTween.scrollTrigger.end, scrub: .7 }
      });
    });
  }

  const cinematic = document.querySelector('.cinematic-break');
  if (cinematic) {
    const cinematicTL = gsap.timeline({
      scrollTrigger: { trigger: cinematic, start: 'top top', end: '+=135%', pin: true, scrub: .36, anticipatePin: 1 }
    });
    cinematicTL
      .fromTo(cinematic, { clipPath: 'inset(10% 6% 10% 6%)', scale: .9, borderRadius: 32 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, borderRadius: 0, duration: 1, ease: 'power2.out' }, 0)
      .fromTo('.cinematic-art', { scale: 1.28, yPercent: -7, rotate: -1 }, { scale: 1.02, yPercent: 4, rotate: .4, duration: 2.5, ease: 'none' }, 0)
      .fromTo('.cinematic-copy', { yPercent: 38, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .85, ease: 'power3.out' }, .38)
      .fromTo('.cinematic-copy h2', { scale: .68, transformOrigin: '0% 50%' }, { scale: 1, duration: .72, ease: 'power2.out' }, .5)
      .to('.cinematic-copy h2', { scale: coarse ? 2.65 : 3.7, xPercent: coarse ? -18 : -30, opacity: .04, filter: 'blur(2px)', duration: 1.15, ease: 'power2.in' }, 1.35)
      .to('.cinematic-copy p,.cinematic-copy span', { y: -60, opacity: 0, duration: .62 }, 1.5);
  }

  gsap.fromTo('.dev-panel', { y: 88, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'power3.out', scrollTrigger: { trigger: '.dev-panel', start: 'top 84%', once: true } });
  gsap.fromTo('.dev-list > div', { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: .64, stagger: .075, ease: 'power2.out', scrollTrigger: { trigger: '.dev-list', start: 'top 87%', once: true } });
  gsap.fromTo('.faq-list details', { x: 42, opacity: 0 }, { x: 0, opacity: 1, duration: .7, stagger: .065, ease: 'power2.out', scrollTrigger: { trigger: '.faq-list', start: 'top 86%', once: true } });
  gsap.fromTo('.preorder-inner > *', { y: 42, opacity: 0, scale: .97 }, { y: 0, opacity: 1, scale: 1, duration: .76, stagger: .075, ease: 'power3.out', scrollTrigger: { trigger: '.preorder-inner', start: 'top 82%', once: true } });
  gsap.fromTo('.preorder-inner', { scale: .86 }, { scale: 1.03, ease: 'none', scrollTrigger: { trigger: '.preorder-cta', start: 'top bottom', end: 'center center', scrub: .6 } });

  if (!coarse) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .14;
        const y = (e.clientY - r.top - r.height / 2) * .18;
        gsap.to(btn, { x, y, duration: .28, ease: 'power2.out' });
      });
      btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1,.5)' }));
    });

    [...document.querySelectorAll('.lore-card,.faction-card')].forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - .5;
        const ny = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--card-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--card-y', `${e.clientY - r.top}px`);
        gsap.to(card, { rotationY: nx * 6, rotationX: -ny * 5, duration: .32, ease: 'power2.out', transformPerspective: 900 });
      });
      card.addEventListener('pointerleave', () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: .55, ease: 'power3.out' }));
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  window.addEventListener('resize', () => ScrollTrigger.refresh());
})();