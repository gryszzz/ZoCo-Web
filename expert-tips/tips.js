const search = document.querySelector('#tips-search');
const filters = [...document.querySelectorAll('[data-tip-filter]')];
const guides = [...document.querySelectorAll('.tip-guide[data-tip-topic]')];
const topicLinks = [...document.querySelectorAll('.tips-toc [data-tip-topic]')];
const results = document.querySelector('#tips-results');
let selectedTopic = 'all';

function updateTips() {
  const query = search.value.trim().toLocaleLowerCase();
  let visibleCount = 0;

  guides.forEach((guide) => {
    const topicMatch = selectedTopic === 'all' || guide.dataset.tipTopic === selectedTopic;
    const searchMatch = !query || guide.textContent.toLocaleLowerCase().includes(query);
    const visible = topicMatch && searchMatch;
    guide.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  topicLinks.forEach((link) => {
    const guide = document.querySelector(link.getAttribute('href'));
    link.hidden = !guide || guide.hidden;
  });

  results.textContent = query || selectedTopic !== 'all'
    ? `Showing ${visibleCount} of ${guides.length} tips`
    : `Showing all ${guides.length} tips`;
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    selectedTopic = button.dataset.tipFilter;
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    updateTips();
  });
});

search.addEventListener('input', updateTips);
updateTips();
