function fetchCountry(name) {
  return new Promise((resolve) => setTimeout(() => resolve({ name }), 500));
}

const country = fetchCountry('Brasil');
console.log(country);
