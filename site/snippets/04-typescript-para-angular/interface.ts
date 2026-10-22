interface Country {
  code: string;
  name: string;
  capital: string;
  population: number;
  visited: boolean;
  rating?: number; // [!code highlight]
}

const brazil: Country = {
  code: 'BR',
  name: 'Brasil',
  capital: 'Brasília',
  population: 213_000_000,
  visited: true,
};
