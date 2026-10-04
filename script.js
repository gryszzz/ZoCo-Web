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
  drain: ['SERVICE / 01', 'Drain Cleaning', 'Clear buildup and restore flow in drain and sewer lines.'],
  camera: ['SERVICE / 02', 'Camera Inspections', 'Inspect the line to see where a blockage or other problem is located.'],
  sump: ['SERVICE / 03', 'Sump Pump Service', 'Visual system checks, pump testing and pit debris removal where included.'],
  roots: ['SERVICE / 04', 'Root Treatment', 'Service for root intrusion and maintenance of affected drain or sewer lines.'],
  maintenance: ['SERVICE / 05', 'Preventative Maintenance', 'Scheduled inspections and service intended to catch issues before a backup.'],
  dryer: ['SERVICE / 06', 'Dryer Vent Cleaning', 'Available during a service visit or as a standalone appointment.']
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

const heroShell = document.querySelector('.hero-shell');
heroShell?.addEventListener('pointermove', (event) => {
  const rect = heroShell.getBoundingClientRect();
  heroShell.style.setProperty('--mx', (((event.clientX - rect.left) / rect.width) * 100) + '%');
  heroShell.style.setProperty('--my', (((event.clientY - rect.top) / rect.height) * 100) + '%');
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

const toast = document.querySelector('.toast');
let toastTimer;
document.querySelectorAll('.placeholder-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    clearTimeout(toastTimer);
    toast.textContent = (link.dataset.placeholder || 'Link') + ' is ready to add.';
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  });
});
