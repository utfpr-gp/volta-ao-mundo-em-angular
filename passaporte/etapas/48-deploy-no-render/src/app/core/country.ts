/** Um país como a API do livro entrega. */
export interface ApiCountry {
  code: string;
  name: string;
  capital: string;
  population: number;
  /** Latitude e longitude da capital. */
  lat: number;
  lon: number;
}

/** Um país no Passaporte: os dados da API e se você já esteve lá. */
export interface Country extends ApiCountry {
  visited: boolean;
}
