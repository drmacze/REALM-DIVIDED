(() => {
  // Physically remove the hero UI the clean layout no longer uses.
  document.querySelector('.site-header .menu-toggle')?.remove();
  document.querySelectorAll('.hero .eyebrow,.hero .hero-copy,.hero .hero-actions,.hero .hero-note').forEach(el => el.remove());

  const devRelease = [...document.querySelectorAll('.dev-list > div')].find(row => row.querySelector('b')?.textContent.trim() === 'Public Release');
  if (devRelease) {
    const value = devRelease.querySelector('span');
    if (value) value.textContent = 'September 2026';
  }

  const preorderCopy = document.querySelector('.preorder-inner > p:not(.kicker)');
  if (preorderCopy) preorderCopy.textContent = 'Standard pre-order is free. Reserve your place in the realm ahead of the September 2026 release.';

  document.querySelectorAll('.faq-list details').forEach(item => {
    const summary = item.querySelector('summary');
    if (summary?.textContent.includes('Can I pre-order now?')) {
      const p = item.querySelector('p');
      if (p) p.textContent = 'Yes. The Standard pre-order is $0 / Free, with release planned for September 2026.';
    }
  });
})();
