import { Country } from './country';

/** Os países do Passaporte. A lista começa daqui, e a página de cada país procura aqui pelo código. */
export const COUNTRIES: Country[] = [
  { code: 'BR', name: 'Brasil', capital: 'Brasília', visited: true },
  { code: 'JP', name: 'Japão', capital: 'Tóquio', visited: false },
  { code: 'PT', name: 'Portugal', capital: 'Lisboa', visited: true },
  { code: 'IT', name: 'Itália', capital: 'Roma', visited: false },
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', visited: true },
  { code: 'CA', name: 'Canadá', capital: 'Ottawa', visited: false },
];

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find((country) => country.code === code.toUpperCase());
}

/** O clima de cada capital, com a temperatura média do ano, arredondada. */
export const CLIMATES: Record<string, { kind: string; average: number }> = {
  BR: { kind: 'Tropical de savana', average: 21 },
  JP: { kind: 'Subtropical úmido', average: 16 },
  PT: { kind: 'Mediterrâneo', average: 17 },
  IT: { kind: 'Mediterrâneo', average: 16 },
  AR: { kind: 'Subtropical úmido', average: 18 },
  CA: { kind: 'Continental úmido', average: 6 },
};
