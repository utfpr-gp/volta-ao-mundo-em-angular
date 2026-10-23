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
  '13-estilos-e-tailwind': () => import('./13-estilos-e-tailwind/chapter').then((m) => m.Chapter13),
  '14-design-tokens': () => import('./14-design-tokens/chapter').then((m) => m.Chapter14),
  '15-input-e-output': () => import('./15-input-e-output/chapter').then((m) => m.Chapter15),
  '16-model': () => import('./16-model/chapter').then((m) => m.Chapter16),
  '17-ng-content': () => import('./17-ng-content/chapter').then((m) => m.Chapter17),
  '18-view-child': () => import('./18-view-child/chapter').then((m) => m.Chapter18),
  '19-ciclo-de-vida': () => import('./19-ciclo-de-vida/chapter').then((m) => m.Chapter19),
  '20-layout-responsivo': () => import('./20-layout-responsivo/chapter').then((m) => m.Chapter20),
  '21-do-prototipo-ao-componente': () => import('./21-do-prototipo-ao-componente/chapter').then((m) => m.Chapter21),
  '22-bibliotecas-de-componentes': () => import('./22-bibliotecas-de-componentes/chapter').then((m) => m.Chapter22),
  '23-router': () => import('./23-router/chapter').then((m) => m.Chapter23),
  '24-parametros-de-rota': () => import('./24-parametros-de-rota/chapter').then((m) => m.Chapter24),
  '25-rotas-filhas': () => import('./25-rotas-filhas/chapter').then((m) => m.Chapter25),
  '26-lazy-loading': () => import('./26-lazy-loading/chapter').then((m) => m.Chapter26),
  '27-organizacao-por-funcionalidades': () =>
    import('./27-organizacao-por-funcionalidades/chapter').then((m) => m.Chapter27),
  '28-services-e-inject': () => import('./28-services-e-inject/chapter').then((m) => m.Chapter28),
  '29-http-client': () => import('./29-http-client/chapter').then((m) => m.Chapter29),
  '30-rxjs': () => import('./30-rxjs/chapter').then((m) => m.Chapter30),
  '31-to-signal': () => import('./31-to-signal/chapter').then((m) => m.Chapter31),
};
