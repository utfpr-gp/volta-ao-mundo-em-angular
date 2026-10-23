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
};
