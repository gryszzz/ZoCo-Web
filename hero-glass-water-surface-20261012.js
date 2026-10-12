/* ZoCo quick-action liquid glass: decorative only, desktop and mobile.
   Keeps all three original card links/buttons and scroll gestures intact. */
(() => {
  const cards = [...document.querySelectorAll('body.home-page .hero .zoco-hero-pathways__card')];
  if (cards.length !== 3) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const drops = [
    { x: 5, y: 19, size: 8, drift: 4, duration: 6.8, delay: -1.5 },
    { x: 18, y: 8, size: 5, drift: -3, duration: 8.4, delay: -4.4 },
    { x: 29, y: 16, size: 6, drift: 5, duration: 7.2, delay: -2.9 },
    { x: 41, y: 6, size: 7, drift: -3, duration: 8.1, delay: -5.6 },
    { x: 56, y: 20, size: 5, drift: 4, duration: 7.9, delay: -3.4 },
    { x: 69, y: 9, size: 7, drift: -5, duration: 8.9, delay: -6.7 },
    { x: 83, y: 15, size: 6, drift: 3, duration: 6.9, delay: -2.2 },
    { x: 95, y: 2, size: 8, drift: -3, duration: 9.4, delay: -5.1 },
    { x: 34, y: 31, size: 5, drift: 3, duration: 9.3, delay: -7.3, up: true },
    { x: 77, y: 19, size: 6, drift: -4, duration: 8.6, delay: -1.7, up: true }
  ];

  const addSurface = (card, index) => {
    const surface = document.createElement('span');
    surface.className = 'zoco-water-glass-surface';
    surface.setAttribute('aria-hidden', 'true');
    for (const [number, spec] of drops.entries()) {
      const bead = document.createElement('span');
      bead.className = 'zoco-water-bead';
      if (spec.up) bead.dataset.direction = 'up';
      bead.style.setProperty('--water-left', spec.x + '%');
      bead.style.setProperty('--water-top', spec.y + '%');
      bead.style.setProperty('--water-size', spec.size + 'px');
      bead.style.setProperty('--water-drift', spec.drift + 'px');
      bead.style.setProperty('--water-duration', spec.duration + 's');
      bead.style.setProperty('--water-delay', (spec.delay - index * 1.7 - number * .04) + 's');
      surface.append(bead);
    }
    card.prepend(surface);

    const point = (event) => {
      const bounds = card.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)),
        y: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top))
      };
    };
    const setPoint = (event) => {
      const pos = point(event);
      surface.style.setProperty('--water-x', pos.x + 'px');
      surface.style.setProperty('--water-y', pos.y + 'px');
      return pos;
    };
    card.addEventListener('pointermove', (event) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      setPoint(event);
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('zoco-water-interacted');
      surface.style.removeProperty('--water-x');
      surface.style.removeProperty('--water-y');
    });
    card.addEventListener('pointerup', (event) => {
      if (reducedMotion.matches) return;
      const pos = setPoint(event);
      const ripple = document.createElement('span');
      ripple.className = 'zoco-water-impact';
      ripple.style.setProperty('--water-touch-x', pos.x + 'px');
      ripple.style.setProperty('--water-touch-y', pos.y + 'px');
      surface.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      card.classList.remove('zoco-water-interacted');
    }, { passive: true });
    card.addEventListener('pointerdown', (event) => {
      if (reducedMotion.matches) return;
      setPoint(event);
      card.classList.add('zoco-water-interacted');
    }, { passive: true });
    card.addEventListener('pointercancel', () => card.classList.remove('zoco-water-interacted'), { passive: true });
  };

  cards.forEach(addSurface);
})();
