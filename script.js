const ASSETS={logo:'https://res.cloudinary.com/vitjnhhb/image/upload/v1789066659/realm-divided/realm-divided-logo.jpg'};
document.querySelectorAll('[data-logo]').forEach(img=>{img.src=ASSETS.logo});

// Load clean homepage refinements without touching the restored Factions scroll engine.
(()=>{if(!document.querySelector('link[data-home-clean]')){const l=document.createElement('link');l.rel='stylesheet';l.href='home-clean.css?v=rd13';l.dataset.homeClean='1';document.head.appendChild(l)}})();

const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}))}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==item)other.open=false})}));
const video=document.querySelector('.hero-video');
if(video){const play=()=>{if(!video.classList.contains('video-unavailable'))video.play().catch(()=>{})};document.addEventListener('visibilitychange',()=>{if(!document.hidden)play()})}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

// Progressive enhancement: load the motion stack only after the core page is usable.
(() => {
  const loadScript=(src)=>new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(s=>s.src===src);
    if(existing){if(existing.dataset.loaded==='true')return resolve();existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return}
    const s=document.createElement('script');s.src=src;s.defer=true;s.crossOrigin='anonymous';s.onload=()=>{s.dataset.loaded='true';resolve()};s.onerror=reject;document.head.appendChild(s);
  });
  (async()=>{
    try{
      await loadScript('https://unpkg.com/lenis@1.3.26/dist/lenis.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js');
      await loadScript('motion.js');
    }catch(err){console.warn('Realm Divided motion stack unavailable; native scrolling remains active.',err)}
  })();
})();

// Resume soundtrack after the explicit Return to the Realm gesture from pre-order.
(()=>{const s=document.createElement('script');s.src='music-resume.js?v=rd13';s.defer=true;document.head.appendChild(s)})();
