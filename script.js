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
  drain: {
    code: 'SERVICE / 01',
    title: 'Drain Cleaning',
    description: 'Clear buildup and restore flow in drain and sewer lines.'
  },
  camera: {
    code: 'SERVICE / 02',
    title: 'Camera Inspections',
    description: 'Inspect the line to see where a blockage or other problem is located.'
  },
  sump: {
    code: 'SERVICE / 03',
    title: 'Sump Pump Service',
    description: 'Visual system checks, pump testing and pit debris removal where included.'
  },
  roots: {
    code: 'SERVICE / 04',
    title: 'Root Treatment',
    description: 'Service for root intrusion and maintenance of affected drain or sewer lines.'
  },
  maintenance: {
    code: 'SERVICE / 05',
    title: 'Preventative Maintenance',
    description: 'Scheduled inspections and service intended to catch issues before a backup.'
  },
  dryer: {
    code: 'SERVICE / 06',
    title: 'Dryer Vent Cleaning',
    description: 'Available during a service visit or as a standalone appointment.'
  }
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
    serviceCode.textContent = item.code;
    serviceTitle.textContent = item.title;
    serviceDescription.textContent = item.description;
  });
});

const heroShell = document.querySelector('.hero-shell');
heroShell?.addEventListener('pointermove', (event) => {
  const rect = heroShell.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  heroShell.style.setProperty('--mx', x + '%');
  heroShell.style.setProperty('--my', y + '%');
});

const sections = [...document.querySelectorAll('main section[id]')];
const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((item) => item.classList.toggle('active', item.getAttribute('href') === '#' + entry.target.id));
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
