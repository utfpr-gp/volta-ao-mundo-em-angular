// Imita um servidor: entrega o país depois de meio segundo.
function fetchCountry(name) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name, capital: 'Brasília' }), 500);
  });
}

async function show() {
  console.log('Buscando...');
  const country = await fetchCountry('Brasil'); // [!code highlight]
  console.log(`${country.name}: ${country.capital}`);
}

show();
