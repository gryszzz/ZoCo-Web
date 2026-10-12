/* Shared mobile menu state for ZoCo homepage and all interior pages.
   Preserve ordinary anchor links, native <details>, keyboard access and scrolling. */
(() => {
  const homepageButton = document.querySelector('.site-header .menu-btn');
  const homepageNav = document.querySelector('.site-header .nav-links');
  const interiorMenu = document.querySelector('.zoco-interior-header__mobile');
  const interiorSummary = interiorMenu?.querySelector('summary');
  const homeMobile = window.matchMedia('(max-width: 1100px)');
  const innerMobile = window.matchMedia('(max-width: 1170px)');
  if (!homepageButton && !interiorMenu) return;

  const homeOpen = () => Boolean(homepageNav?.classList.contains('open'));
  const innerOpen = () => Boolean(interiorMenu?.open);
  const reflectBackdrop = () => document.body.classList.toggle('zoco-menu-open', homeOpen() || innerOpen());
  const setHomeOpen = (open) => {
    if (!homepageNav || !homepageButton) return;
    homepageNav.classList.toggle('open', open);
    homepageButton.setAttribute('aria-expanded', String(open));
    homepageButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    homepageButton.textContent = open ? 'Close' : 'Menu';
    reflectBackdrop();
  };
  homepageButton?.addEventListener('click', () => setHomeOpen(!homeOpen()));
  homepageNav?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setHomeOpen(false));
  });

  if (interiorMenu) {
    interiorMenu.addEventListener('toggle', reflectBackdrop);
    interiorMenu.querySelectorAll('nav a').forEach((a) => {
      a.addEventListener('click', () => {
        interiorMenu.open = false;
        reflectBackdrop();
      });
    });
  }

  document.addEventListener('pointerdown', (event) => {
    if (homeOpen() && !event.target.closest('.site-header')) setHomeOpen(false);
    if (innerOpen() && !event.target.closest('.zoco-interior-header')) {
      interiorMenu.open = false;
      reflectBackdrop();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (homeOpen()) {
      setHomeOpen(false);
      homepageButton.focus({ preventScroll: true });
    }
    if (innerOpen()) {
      interiorMenu.open = false;
      reflectBackdrop();
      interiorSummary?.focus({ preventScroll: true });
    }
  });

  window.addEventListener('resize', () => {
    if (!homeMobile.matches && homeOpen()) setHomeOpen(false);
    if (!innerMobile.matches && innerOpen()) {
      interiorMenu.open = false;
      reflectBackdrop();
    }
  }, { passive: true });
})();
