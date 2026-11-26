import { RenderMode, ServerRoute } from '@angular/ssr';
import { COUNTRIES_URL } from './core/passport';

/** Os códigos dos países, perguntados à API no build. */
async function countryCodes(): Promise<{ code: string }[]> {
  const countries: { code: string }[] = await (await fetch(COUNTRIES_URL)).json();
  return countries.map((country) => ({ code: country.code }));
}

/**
 * Como cada rota sai no build. Prerender: o HTML completo da página, gerado uma vez, para o Google e para quem abre o
 * link. Client: só o index.html de sempre, e o navegador monta a página (telas de quem entrou não interessam ao Google).
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'paises', renderMode: RenderMode.Prerender },
  // Uma página por país: o build pergunta à API quais são, e gera /paises/BR/visao-geral, /paises/JP/visao-geral…
  { path: 'paises/:code/visao-geral', renderMode: RenderMode.Prerender, getPrerenderParams: countryCodes },
  // /paises/JP só redireciona para a visão geral: o build gera a página de redirecionamento.
  { path: 'paises/:code', renderMode: RenderMode.Prerender, getPrerenderParams: countryCodes },
  { path: 'sobre', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
