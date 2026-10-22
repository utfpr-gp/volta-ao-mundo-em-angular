const country = { name: 'Itália', capital: undefined };

console.log(country.capital?.toUpperCase()); // [!code highlight]
console.log(country.capital ?? 'capital desconhecida'); // [!code highlight]
