import { CHAPTER_01 } from './01-o-que-e-o-angular/content';
import { CHAPTER_02 } from './02-preparando-o-ambiente/content';
import { CHAPTER_03 } from './03-javascript-moderno/content';
import { CHAPTER_04 } from './04-typescript-para-angular/content';
import { CHAPTER_05 } from './05-angular-cli/content';
import type { ChapterContent } from './types';

/** Resumo, trechos essenciais, desafio e links de cada capítulo publicado. A chave é o slug. */
export const CONTENT: Partial<Record<string, ChapterContent>> = {
  '01-o-que-e-o-angular': CHAPTER_01,
  '02-preparando-o-ambiente': CHAPTER_02,
  '03-javascript-moderno': CHAPTER_03,
  '04-typescript-para-angular': CHAPTER_04,
  '05-angular-cli': CHAPTER_05,
};
