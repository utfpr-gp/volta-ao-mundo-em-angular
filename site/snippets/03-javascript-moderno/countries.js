export const COUNTRIES = [
  { name: 'Brasil', region: 'Américas', visited: true },
  { name: 'Japão', region: 'Ásia', visited: false },
];

export function countVisited(countries) {
  return countries.filter((c) => c.visited).length;
}
