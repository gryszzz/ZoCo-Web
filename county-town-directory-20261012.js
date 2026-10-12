/* ZoCo county municipality browser. One file for both county pages.
   Nothing is submitted, tracked or transmitted until a visitor chooses contact. */
(() => {
  const directory = document.querySelector('[data-town-directory]');
  if (!directory) return;
  const search = directory.querySelector('[data-town-search]');
  const towns = [...directory.querySelectorAll('[data-town-option]')];
  const empty = directory.querySelector('[data-town-empty]');
  const selection = directory.querySelector('[data-town-selection]');
  const callout = directory.querySelector('[data-town-callout]');
  const county = directory.dataset.county || 'New Jersey';

  const updateList = () => {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let visible = 0;
    for (const town of towns) {
      town.hidden = Boolean(query && !town.dataset.town.toLocaleLowerCase().includes(query));
      if (!town.hidden) visible++;
    }
    if (empty) empty.hidden = visible > 0;
  };

  search?.addEventListener('input', updateList);
  towns.forEach((town) => {
    town.addEventListener('click', () => {
      towns.forEach((option) => option.setAttribute('aria-pressed', String(option === town)));
      const place = town.dataset.town;
      if (selection) selection.textContent = place;
      if (callout) callout.textContent = "Tell Henry you're in " + place + ", " + county + ". Describe the work so he can confirm availability.";
    });
  });
  updateList();
})();
