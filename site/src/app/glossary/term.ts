import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GLOSSARY, TermName } from './glossary';

let nextId = 0;

/**
 * A primeira aparição de um termo técnico num capítulo. Ao passar o mouse ou focar com o
 * teclado, a definição aparece; o link leva ao glossário.
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
      class="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-72 -translate-x-1/2 rounded-xl bg-primary px-4 py-3 text-left text-sm font-normal leading-snug text-on-primary opacity-0 shadow-xl motion-safe:transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
    ><strong class="mb-1 block text-highlight">{{ entry().term }}</strong>{{ entry().definition }}</span>`,
})
export class Term {
  readonly name = input.required<TermName>();
  protected readonly entry = computed(() => GLOSSARY[this.name()]);
  protected readonly tooltipId = `termo-${nextId++}`;
}
