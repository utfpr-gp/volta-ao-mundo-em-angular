const country = { name: 'Portugal', capital: 'Lisboa', population: 10_600_000 };

const { name, capital } = country; // [!code highlight]
console.log(name, capital);

const [first, second] = ['Brasil', 'Japão', 'Itália']; // [!code highlight]
console.log(first, second);
