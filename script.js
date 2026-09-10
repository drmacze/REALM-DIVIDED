// Realm Divided — stable homepage boot
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const resetHomePosition = () => {
  if (location.hash) return;
  window.scrollTo(0, 0);
  try { window.realmLenis?.scrollTo(0, { immediate: true, force: true }); } catch (_) {}
};
resetHomePosition();
window.addEventListener('pageshow', resetHomePosition, { passive: true });

const ASSETS={logo:'https://res.cloudinary.com/vitjnhhb/image/upload/v1789066659/realm-divided/realm-divided-logo.jpg'};
document.querySelectorAll('[data-logo]').forEach(img=>{img.src=ASSETS.logo});

const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}))}
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==item)other.open=false})}));
const video=document.querySelector('.hero-video');
if(video){const play=()=>{if(!video.classList.contains('video-unavailable'))video.play().catch(()=>{})};document.addEventListener('visibilitychange',()=>{if(!document.hidden)play()})}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

// Resume soundtrack after the explicit Return to the Realm gesture from pre-order.
(()=>{const s=document.createElement('script');s.src='music-resume.js?v=rd15';s.defer=true;document.head.appendChild(s)})();
