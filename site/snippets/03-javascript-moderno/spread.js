const visited = ['Brasil', 'Argentina'];
const updated = [...visited, 'Chile']; // [!code highlight]
console.log(visited.length, updated.length);

const country = { name: 'Chile', visited: false };
const marked = { ...country, visited: true }; // [!code highlight]
console.log(country.visited, marked.visited);
