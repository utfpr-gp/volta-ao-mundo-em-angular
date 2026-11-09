import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GLOSSARY, TermName } from './glossary';

let nextId = 0;

/**
 * A primeira aparição de um termo técnico num capítulo. Ao passar o mouse ou focar com o
 * teclado, a definição aparece; o link leva ao glossário.
 *
 * A dica fica com display: none (hidden) enquanto não aparece. Com visibility: hidden, ela ocupava
 * espaço fora da tela quando o termo estava perto da borda e alargava a página no celular.
 * O aria-describedby continua valendo: o leitor de tela lê a descrição mesmo escondida.
 */
@Component({
  selector: 'vm-term',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  host: { class: 'group relative inline' },
  template: `<a
      routerLink="/glossario"
      [fragment]="name()"
      [attr.aria-describedby]="tooltipId"
      class="cursor-help font-semibold text-ink underline decoration-highlight decoration-dotted decoration-2 underline-offset-4 hover:text-link"
    ><ng-content /></a><span
      role="tooltip"
      [id]="tooltipId"
      class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-primary px-4 py-3 text-left text-sm font-normal leading-snug text-on-primary shadow-xl group-focus-within:block group-hover:block"
    ><strong class="mb-1 block text-highlight">{{ entry().term }}</strong>{{ entry().definition }}</span>`,
})
export class Term {
  readonly name = input.required<TermName>();
  protected readonly entry = computed(() => GLOSSARY[this.name()]);
  protected readonly tooltipId = `termo-${nextId++}`;
}
