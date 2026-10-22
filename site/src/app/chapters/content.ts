import { CHAPTER_01 } from './01-o-que-e-o-angular/content';
import type { ChapterContent } from './types';

/** Resumo, trechos essenciais, desafio e links de cada capítulo publicado. A chave é o slug. */
export const CONTENT: Partial<Record<string, ChapterContent>> = {
  '01-o-que-e-o-angular': CHAPTER_01,
};
