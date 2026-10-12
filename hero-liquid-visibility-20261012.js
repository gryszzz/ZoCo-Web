/* Hide redundant mobile floating controls only while the three action cards
   are visible. Those same review and estimate actions are available on cards. */
(() => {
  const section = document.querySelector('body.home-page .zoco-hero-pathways');
  if (!section || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('zoco-shortcuts-onscreen', entry.isIntersecting);
  }, { threshold:0, rootMargin:'0px 0px 8% 0px' });
  observer.observe(section);
})();
