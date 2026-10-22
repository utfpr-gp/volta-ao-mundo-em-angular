import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, InjectionToken, PLATFORM_ID, inject, signal } from '@angular/core';

/** A parte da API do Pagefind que o site usa. */
export interface PagefindApi {
  options(options: Record<string, unknown>): Promise<void>;
  search(query: string): Promise<{
    results: { data(): Promise<{ url: string; excerpt: string; meta: { title?: string } }> }[];
  }>;
}

export interface SearchHit {
  /** Caminho para o routerLink, sem o baseHref. */
  path: string;
  title: string;
  /** Trecho com os termos encontrados entre <mark>, gerado no build a partir do próprio conteúdo. */
  excerpt: string;
}

/**
 * Carrega o índice da busca, gerado pelo Pagefind depois do build. No `ng serve` ele não
 * existe, e a busca avisa que só funciona no site publicado.
 */
export const PAGEFIND_LOADER = new InjectionToken<() => Promise<PagefindApi>>('PAGEFIND_LOADER', {
  factory: () => {
    const document = inject(DOCUMENT);
    return () => import(/* @vite-ignore */ new URL('pagefind/pagefind.js', document.baseURI).href);
  },
});

const MAX_RESULTS = 10;

export function toRouterPath(url: string, basePath: string): string {
  const withoutBase = basePath !== '/' && url.startsWith(basePath) ? url.slice(basePath.length - 1) : url;
  const path = withoutBase.replace(/\/+$/, '');
  return path || '/';
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly loader = inject(PAGEFIND_LOADER);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private api: Promise<PagefindApi | null> | null = null;

  private readonly state = signal<boolean | null>(null);
  /** null enquanto carrega; false quando o índice não existe. */
  readonly available = this.state.asReadonly();

  async search(query: string): Promise<SearchHit[]> {
    if (!query.trim()) return [];
    const api = await this.load();
    if (!api) return [];
    const { results } = await api.search(query.trim());
    const basePath = new URL(this.document.baseURI).pathname;
    const pages = await Promise.all(results.slice(0, MAX_RESULTS).map((result) => result.data()));
    return pages.map((page) => ({
      path: toRouterPath(page.url, basePath),
      title: page.meta.title ?? page.url,
      excerpt: page.excerpt,
    }));
  }

  private load(): Promise<PagefindApi | null> {
    this.api ??= (async () => {
      if (!this.isBrowser) return null;
      try {
        const api = await this.loader();
        await api.options({ excerptLength: 24 });
        this.state.set(true);
        return api;
      } catch {
        this.state.set(false);
        return null;
      }
    })();
    return this.api;
  }
}
