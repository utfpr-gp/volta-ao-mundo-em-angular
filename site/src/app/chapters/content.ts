import { CHAPTER_01 } from './01-o-que-e-o-angular/content';
import { CHAPTER_02 } from './02-preparando-o-ambiente/content';
import { CHAPTER_03 } from './03-javascript-moderno/content';
import { CHAPTER_04 } from './04-typescript-para-angular/content';
import { CHAPTER_05 } from './05-angular-cli/content';
import { CHAPTER_06 } from './06-componentes/content';
import { CHAPTER_07 } from './07-interpolacao-e-property-binding/content';
import { CHAPTER_08 } from './08-event-binding/content';
import { CHAPTER_09 } from './09-signals/content';
import { CHAPTER_10 } from './10-if-e-switch/content';
import { CHAPTER_11 } from './11-for-e-track/content';
import { CHAPTER_12 } from './12-pipes/content';
import { CHAPTER_13 } from './13-estilos-e-tailwind/content';
import { CHAPTER_14 } from './14-design-tokens/content';
import { CHAPTER_15 } from './15-input-e-output/content';
import { CHAPTER_16 } from './16-model/content';
import { CHAPTER_17 } from './17-ng-content/content';
import { CHAPTER_18 } from './18-view-child/content';
import { CHAPTER_19 } from './19-ciclo-de-vida/content';
import { CHAPTER_20 } from './20-layout-responsivo/content';
import { CHAPTER_21 } from './21-do-prototipo-ao-componente/content';
import { CHAPTER_22 } from './22-bibliotecas-de-componentes/content';
import { CHAPTER_23 } from './23-router/content';
import { CHAPTER_24 } from './24-parametros-de-rota/content';
import { CHAPTER_25 } from './25-rotas-filhas/content';
import { CHAPTER_26 } from './26-lazy-loading/content';
import { CHAPTER_27 } from './27-organizacao-por-funcionalidades/content';
import { CHAPTER_28 } from './28-services-e-inject/content';
import { CHAPTER_29 } from './29-http-client/content';
import { CHAPTER_30 } from './30-rxjs/content';
import type { ChapterContent } from './types';

/** Resumo, trechos essenciais, desafio e links de cada capítulo publicado. A chave é o slug. */
export const CONTENT: Partial<Record<string, ChapterContent>> = {
  '01-o-que-e-o-angular': CHAPTER_01,
  '02-preparando-o-ambiente': CHAPTER_02,
  '03-javascript-moderno': CHAPTER_03,
  '04-typescript-para-angular': CHAPTER_04,
  '05-angular-cli': CHAPTER_05,
  '06-componentes': CHAPTER_06,
  '07-interpolacao-e-property-binding': CHAPTER_07,
  '08-event-binding': CHAPTER_08,
  '09-signals': CHAPTER_09,
  '10-if-e-switch': CHAPTER_10,
  '11-for-e-track': CHAPTER_11,
  '12-pipes': CHAPTER_12,
  '13-estilos-e-tailwind': CHAPTER_13,
  '14-design-tokens': CHAPTER_14,
  '15-input-e-output': CHAPTER_15,
  '16-model': CHAPTER_16,
  '17-ng-content': CHAPTER_17,
  '18-view-child': CHAPTER_18,
  '19-ciclo-de-vida': CHAPTER_19,
  '20-layout-responsivo': CHAPTER_20,
  '21-do-prototipo-ao-componente': CHAPTER_21,
  '22-bibliotecas-de-componentes': CHAPTER_22,
  '23-router': CHAPTER_23,
  '24-parametros-de-rota': CHAPTER_24,
  '25-rotas-filhas': CHAPTER_25,
  '26-lazy-loading': CHAPTER_26,
  '27-organizacao-por-funcionalidades': CHAPTER_27,
  '28-services-e-inject': CHAPTER_28,
  '29-http-client': CHAPTER_29,
  '30-rxjs': CHAPTER_30,
};
