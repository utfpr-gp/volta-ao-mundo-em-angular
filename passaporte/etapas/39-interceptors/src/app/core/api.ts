/** O endereço da API do Passaporte: o json-server rodando no seu computador, com o npm run api. */
export const API_URL = 'http://localhost:3000';

/** Diz se a requisição vai para a API do Passaporte, e não para outro site (a API de países, o Open-Meteo). */
export function isApiRequest(url: string): boolean {
  return url.startsWith(`${API_URL}/`);
}
