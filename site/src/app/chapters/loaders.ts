import type { Type } from '@angular/core';

/** O componente de cada capítulo publicado, carregado sob demanda. A chave é o slug. */
export const LOADERS: Partial<Record<string, () => Promise<Type<unknown>>>> = {
  '01-o-que-e-o-angular': () => import('./01-o-que-e-o-angular/chapter').then((m) => m.Chapter01),
  '02-preparando-o-ambiente': () => import('./02-preparando-o-ambiente/chapter').then((m) => m.Chapter02),
  '03-javascript-moderno': () => import('./03-javascript-moderno/chapter').then((m) => m.Chapter03),
  '04-typescript-para-angular': () => import('./04-typescript-para-angular/chapter').then((m) => m.Chapter04),
  '05-angular-cli': () => import('./05-angular-cli/chapter').then((m) => m.Chapter05),
  '06-componentes': () => import('./06-componentes/chapter').then((m) => m.Chapter06),
  '07-interpolacao-e-property-binding': () =>
    import('./07-interpolacao-e-property-binding/chapter').then((m) => m.Chapter07),
  '08-event-binding': () => import('./08-event-binding/chapter').then((m) => m.Chapter08),
  '09-signals': () => import('./09-signals/chapter').then((m) => m.Chapter09),
  '10-if-e-switch': () => import('./10-if-e-switch/chapter').then((m) => m.Chapter10),
  '11-for-e-track': () => import('./11-for-e-track/chapter').then((m) => m.Chapter11),
  '12-pipes': () => import('./12-pipes/chapter').then((m) => m.Chapter12),
};
