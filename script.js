document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const services = {
  drain: ['SERVICE / 01', 'Drain Cleaning', 'Clear buildup and restore flow in accessible drain and sewer lines.'],
  camera: ['SERVICE / 02', 'Camera Inspection', 'Use a drain camera to view accessible line conditions and locate visible trouble areas.'],
  maintenance: ['SERVICE / 03', 'Drain Maintenance', 'Routine drain service intended to help keep accessible lines moving and reduce recurring buildup.'],
  dryer: ['SERVICE / 04', 'Dryer Vent Cleaning', 'Clean accessible dryer vent runs to help improve airflow and remove lint buildup.']
};

const serviceCode = document.getElementById('serviceCode');
const serviceTitle = document.getElementById('serviceTitle');
const serviceDescription = document.getElementById('serviceDescription');

document.querySelectorAll('.service-tab').forEach((button) => {
  button.addEventListener('click', () => {
    const item = services[button.dataset.service];
    if (!item) return;

    document.querySelectorAll('.service-tab').forEach((tab) => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });

    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    serviceCode.textContent = item[0];
    serviceTitle.textContent = item[1];
    serviceDescription.textContent = item[2];
  });
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
