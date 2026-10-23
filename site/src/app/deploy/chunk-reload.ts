import { Location } from '@angular/common';
import { inject } from '@angular/core';
import type { NavigationError } from '@angular/router';

const KEY = 'vm-recarregou';

/**
 * Cada publicação troca os nomes dos arquivos do site. Uma aba aberta antes dela ainda pede
 * os arquivos antigos, que não existem mais: o capítulo não carrega. Nesse caso, recarregar a
 * página traz a versão nova.
 */
export function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : '';
  return /dynamically imported module|Importing a module script failed/.test(message);
}

interface Store {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Recarrega uma vez por endereço; se a versão nova também falhar, não entra em laço. */
export function reloadOnce(url: string, store: Store, reload: (url: string) => void): boolean {
  if (store.getItem(KEY) === url) return false;
  store.setItem(KEY, url);
  reload(url);
  return true;
}

/** Para o withNavigationErrorHandler do router; roda num contexto de injeção. */
export function reloadOnChunkError(navigation: NavigationError): void {
  if (typeof window === 'undefined' || !isChunkLoadError(navigation.error)) return;
  const url = inject(Location).prepareExternalUrl(navigation.url);
  try {
    reloadOnce(url, window.sessionStorage, (target) => window.location.assign(target));
  } catch {
    window.location.assign(url);
  }
}
