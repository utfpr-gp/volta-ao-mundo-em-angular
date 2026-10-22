let total = 0;

button.addEventListener('click', () => {
  total++;
  document.querySelector('#header-count').textContent = total; // [!code highlight]
  document.querySelector('#list-count').textContent = total; // [!code highlight]
  document.querySelector('#footer-count').textContent = total; // [!code highlight]
});
