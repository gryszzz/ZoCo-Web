const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  menuButton.textContent = open ? 'Close ×' : 'Menu +';
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation menu');
    if (menuButton) menuButton.textContent = 'Menu +';
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
  drain: ['SERVICE / 01', 'Drain Cleaning', 'Clear buildup and restore flow in accessible drain and sewer lines.', '/assets/services/drain-cleaning.jpg', 'Powered drain snake clearing a pipe through a cleanout.'],
  camera: ['SERVICE / 02', 'Camera Inspection', 'Use a drain camera to view accessible line conditions and locate visible trouble areas.', '/assets/services/camera-inspection.jpg', 'Technician feeding an inspection camera into a drain line while viewing the pipe interior.'],
  maintenance: ['SERVICE / 03', 'Drain Maintenance', 'Routine care helps keep accessible drains clear and moving.', '/assets/services/drain-maintenance.jpg', 'Technician checking and maintaining residential under-sink drain piping.'],
  dryer: ['SERVICE / 04', 'Dryer Vent Cleaning', 'Clean accessible dryer vent runs to help improve airflow and remove lint buildup.', '/assets/services/dryer-vent-cleaning.jpg', 'Rotary brush removing lint from a metal dryer vent duct.']
};

const serviceCode = document.getElementById('serviceCode');
const serviceTitle = document.getElementById('serviceTitle');
const serviceDescription = document.getElementById('serviceDescription');
const serviceImage = document.getElementById('serviceImage');
const serviceDisplay = document.querySelector('.service-display');

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
    serviceImage.alt = item[4];
    serviceImage.src = item[3];
    serviceDisplay.dataset.service = button.dataset.service;
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
