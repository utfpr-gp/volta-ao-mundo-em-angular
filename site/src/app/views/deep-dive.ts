import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Uma caixa recolhível "Aprofundando". Usa o <details> nativo: o conteúdo fica no HTML
 * pré-gerado, então a busca e os buscadores o encontram, e o teclado funciona sem código.
 */
@Component({
  selector: 'vm-deep-dive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-6 block' },
  template: `
    <details class="group rounded-2xl border border-line bg-surface-raised open:shadow-sm">
      <summary class="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-5 py-4 font-bold text-ink hover:bg-surface [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" class="grid size-8 place-items-center rounded-full bg-inside/12 text-inside">🧭</span>
        <span>Aprofundando: {{ title() }}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" class="ml-auto size-5 text-ink-muted motion-safe:transition-transform group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div class="prose prose-lg max-w-none border-t border-line px-5 py-4">
        <ng-content />
      </div>
    </details>
  `,
})
export class DeepDive {
  readonly title = input.required<string>();
}
