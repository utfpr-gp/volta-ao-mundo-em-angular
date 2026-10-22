import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface TextPart {
  code: boolean;
  text: string;
}

/** Divide um texto nas crases: o que está entre crases é código. */
export function inlineCode(text: string): TextPart[] {
  const pieces = text.split('`');
  if (pieces.length % 2 === 0) return [{ code: false, text }];
  return pieces
    .map((piece, index) => ({ code: index % 2 === 1, text: piece }))
    .filter((part) => part.text !== '');
}

/** O mesmo texto, sem as crases: para títulos de página e atributos. */
export function plainText(text: string): string {
  return text.replaceAll('`', '');
}

/** Mostra um texto do catálogo ou do conteúdo com os trechos entre crases em <code>. */
@Component({
  selector: 'vm-inline-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (part of parts(); track $index) {@if (part.code) {<code>{{ part.text }}</code>} @else {{{ part.text }}}}`,
})
export class InlineCode {
  readonly text = input.required<string>();
  protected readonly parts = computed(() => inlineCode(this.text()));
}
