const searchInput = document.querySelector('#game-search');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.game-card')];
const emptyState = document.querySelector('#empty-state');
const gameCount = document.querySelector('#game-count');
let activeCategory = 'todos';

function filterGames() {
  const query = (searchInput?.value || '').trim().toLocaleLowerCase('pt-BR');
  let visible = 0;
  cards.forEach((card) => {
    const title = (card.dataset.title || '').toLocaleLowerCase('pt-BR');
    const category = card.dataset.category || '';
    const matchesQuery = title.includes(query);
    const matchesCategory = activeCategory === 'todos' || category === activeCategory;
    const show = matchesQuery && matchesCategory;
    card.hidden = !show;
    if (show) visible++;
  });
  if (emptyState) emptyState.hidden = visible !== 0;
  if (gameCount) gameCount.textContent = String(visible);
}

searchInput?.addEventListener('input', filterGames);
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter || 'todos';
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filterGames();
  });
});

const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());
filterGames();
