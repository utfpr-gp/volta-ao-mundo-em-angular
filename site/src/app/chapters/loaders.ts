import type { Type } from '@angular/core';

/** O componente de cada capítulo publicado, carregado sob demanda. A chave é o slug. */
export const LOADERS: Partial<Record<string, () => Promise<Type<unknown>>>> = {
  '01-o-que-e-o-angular': () => import('./01-o-que-e-o-angular/chapter').then((m) => m.Chapter01),
  '02-preparando-o-ambiente': () => import('./02-preparando-o-ambiente/chapter').then((m) => m.Chapter02),
  '03-javascript-moderno': () => import('./03-javascript-moderno/chapter').then((m) => m.Chapter03),
};
