(() => {
  const isMobile = window.matchMedia('(max-width:899px)');
  if (!isMobile.matches) return;

  const section = document.querySelector('.factions-section');
  const viewport = document.querySelector('.faction-viewport');
  const row = document.querySelector('.faction-row');
  const cards = [...document.querySelectorAll('.faction-card')];
  if (!section || !viewport || !row || !cards.length) return;

  cards.forEach((card, i) => {
    const roman = card.querySelector('.sigil')?.textContent?.trim() || String(i + 1);
    card.dataset.roman = roman;
  });

  function releaseFactionPin(){
    if (window.ScrollTrigger) {
      ScrollTrigger.getAll().forEach(st => {
        const trigger = st.trigger;
        const belongs = trigger === section || trigger === row || (trigger && section.contains(trigger));
        if (belongs) {
          try { st.animation?.kill(); } catch(e) {}
          try { st.kill(true); } catch(e) {}
        }
      });
      try { ScrollTrigger.refresh(); } catch(e) {}
    }
    if (window.gsap) {
      gsap.set(row, { clearProps:'transform' });
      gsap.set(cards, { clearProps:'transform,opacity,filter' });
    } else {
      row.style.transform = '';
      cards.forEach(card => { card.style.transform=''; card.style.opacity='1'; });
    }
  }

  requestAnimationFrame(() => requestAnimationFrame(releaseFactionPin));
  window.addEventListener('load', () => setTimeout(releaseFactionPin, 80), { once:true });

  const nav = document.createElement('div');
  nav.className = 'mobile-faction-nav';
  nav.setAttribute('aria-label','Faction gallery navigation');
  const count = document.createElement('span');
  count.className = 'mobile-faction-count';
  section.appendChild(nav);
  section.appendChild(count);

  const dots = cards.map((card, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Show faction ${i + 1}`);
    btn.addEventListener('click', () => card.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' }));
    nav.appendChild(btn);
    return btn;
  });

  let active = -1;
  function updateActive(){
    const box = viewport.getBoundingClientRect();
    const center = box.left + box.width / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs((r.left + r.width / 2) - center);
      if (d < bestDist) { best = i; bestDist = d; }
    });
    if (best === active) return;
    active = best;
    cards.forEach((card, i) => card.classList.toggle('is-active', i === best));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === best));
    count.textContent = `${String(best + 1).padStart(2,'0')}  /  ${String(cards.length).padStart(2,'0')}`;
  }

  let raf = 0;
  viewport.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateActive);
  }, { passive:true });
  window.addEventListener('resize', updateActive, { passive:true });
  setTimeout(updateActive, 100);
})();