import type { PagefindApi } from './search';

/** Um Pagefind de mentira para os testes: procura o termo no trecho de cada página. */
export function fakePagefind(pages: { url: string; title?: string; excerpt: string }[]): PagefindApi {
  return {
    options: async () => undefined,
    search: async (query: string) => ({
      results: pages
        .filter((page) => page.excerpt.toLowerCase().includes(query.toLowerCase()))
        .map((page) => ({
          data: async () => ({ url: page.url, excerpt: page.excerpt, meta: page.title ? { title: page.title } : {} }),
        })),
    }),
  };
}
