import type { SnippetId } from '../../generated/snippets';

export interface Alternative {
  /** O texto da alternativa; trechos de código entre crases. */
  text: string;
  correct?: true;
  /** Por que esta alternativa está certa ou errada. Toda alternativa tem a sua. */
  explanation: string;
}

export interface Question {
  prompt: string;
  snippet?: SnippetId;
  alternatives: Alternative[];
}

export interface ChapterContent {
  /** O "Resumo de 1 minuto": de 3 a 6 frases curtas. */
  summary: string[];
  /** Os trechos que entram na referência rápida da trilha. */
  essentials: SnippetId[];
  questions: Question[];
  links: { label: string; url: string }[];
}
