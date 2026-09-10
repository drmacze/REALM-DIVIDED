const ASSETS = {
  logo: 'https://res.cloudinary.com/vitjnhhb/image/upload/v1789066659/realm-divided/realm-divided-logo.jpg',
  banner: 'https://res.cloudinary.com/vitjnhhb/image/upload/v1789066927/realm-divided/realm-divided-banner.jpg'
};

// Replace temporary local artwork references with hosted project artwork.
document.querySelectorAll('img[src="assets/realm-divided-logo.webp"]').forEach((img) => {
  img.src = ASSETS.logo;
});

document.querySelectorAll('img[src="assets/realm-divided-banner.webp"]').forEach((img) => {
  img.src = ASSETS.banner;
});

const heroBackground = document.querySelector('.hero-bg');
if (heroBackground) {
  heroBackground.style.backgroundImage = `url('${ASSETS.banner}')`;
}

const favicon = document.querySelector('link[rel="icon"]');
if (favicon) favicon.href = ASSETS.logo;

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.faq-list details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
