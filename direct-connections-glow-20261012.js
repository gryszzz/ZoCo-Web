/* Subtle pointer-following highlight for ZoCo's four contact links.
   Decorative only: no click interception, no tracking, no external requests.
   Touch devices and reduced-motion settings use the CSS-only design. */
(() => {
  const supportsPointerGlow = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  );
  if (!supportsPointerGlow.matches) return;

  const cards = document.querySelectorAll('body.home-page .hero .quick-connect a.quick-tile');
  cards.forEach((card) => {
    let rect;
    const setHighlight = (event) => {
      rect = rect || card.getBoundingClientRect();
      card.style.setProperty('--zoco-pointer-x', `${Math.round(event.clientX - rect.left)}px`);
      card.style.setProperty('--zoco-pointer-y', `${Math.round(event.clientY - rect.top)}px`);
    };
    const clearHighlight = () => {
      rect = undefined;
      card.style.removeProperty('--zoco-pointer-x');
      card.style.removeProperty('--zoco-pointer-y');
    };
    card.addEventListener('pointerenter', setHighlight, {passive:true});
    card.addEventListener('pointermove', setHighlight, {passive:true});
    card.addEventListener('pointerleave', clearHighlight, {passive:true});
    card.addEventListener('blur', clearHighlight);
  });
})();
