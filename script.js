const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

/* Menu interactions are shared sitewide in mobile-nav-glass-20261012.js. */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('[data-review-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.google-review-grid');
  const cards = [...carousel.querySelectorAll('.google-review-card')];
  const previous = carousel.querySelector('[data-review-prev]');
  const next = carousel.querySelector('[data-review-next]');
  const position = carousel.querySelector('[data-review-position]');
  if (!track || !cards.length || !previous || !next || !position) return;

  const updateCarousel = () => {
    const firstVisible = Math.min(
      cards.length - 1,
      Math.round(track.scrollLeft / (cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0)))
    );
    const visibleCount = Math.max(
      1,
      Math.ceil(track.clientWidth / (cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0)))
    );
    const lastVisible = Math.min(cards.length, firstVisible + visibleCount);

    previous.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    position.textContent = `${firstVisible + 1}–${lastVisible} of ${cards.length} reviews`;
  };

  const move = (direction) => {
    const step = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
    track.scrollBy({
      left: direction * step,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', updateCarousel, { passive: true });
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
});

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

sections.forEach((section) => navObserver.observe(section));
