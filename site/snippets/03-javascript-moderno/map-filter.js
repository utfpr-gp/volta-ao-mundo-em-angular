const countries = [
  { name: 'Brasil', region: 'Américas', visited: true },
  { name: 'Japão', region: 'Ásia', visited: false },
  { name: 'Portugal', region: 'Europa', visited: true },
];

const visitedNames = countries
  .filter((c) => c.visited) // [!code highlight]
  .map((c) => c.name); // [!code highlight]

const japan = countries.find((c) => c.name === 'Japão');

console.log(visitedNames);
console.log(japan.region);
