import type { Type } from '@angular/core';

/** O componente de cada capítulo publicado, carregado sob demanda. A chave é o slug. */
export const LOADERS: Partial<Record<string, () => Promise<Type<unknown>>>> = {};
