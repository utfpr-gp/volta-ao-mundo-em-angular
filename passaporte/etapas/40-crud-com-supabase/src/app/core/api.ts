import { environment } from '../../environments/environment';

/** O endereço da API do Passaporte: a API REST do seu projeto no Supabase, que dá acesso às tabelas. */
export const API_URL = `${environment.supabaseUrl}/rest/v1`; // [!code highlight]

/** Diz se a requisição vai para a API do Passaporte, e não para outro site (a API de países, o Open-Meteo). */
export function isApiRequest(url: string): boolean {
  return url.startsWith(`${API_URL}/`);
}
