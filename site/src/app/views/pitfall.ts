import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Uma armadilha: a mensagem exata que aparece na tela ou no terminal, e como sair dela. */
@Component({
  selector: 'vm-pitfall',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-6 block' },
  template: `
    <div class="overflow-hidden rounded-2xl border border-pitfall/30 bg-surface-raised">
      <div class="flex items-center gap-2 border-b border-pitfall/20 bg-pitfall/8 px-5 py-3">
        <span aria-hidden="true">⚠️</span>
        <p class="font-extrabold text-ink">{{ title() }}</p>
      </div>
      @if (message()) {
        <div class="px-5 pt-4">
          <p class="text-xs font-extrabold uppercase tracking-[0.15em] text-pitfall">{{ where() }}</p>
          <pre class="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-surface px-4 py-3 font-mono text-[0.88rem] leading-relaxed text-ink">{{ message() }}</pre>
        </div>
      }
      <div class="prose prose-lg max-w-none px-5 py-4"><ng-content /></div>
    </div>
  `,
})
export class Pitfall {
  readonly title = input.required<string>();
  /** A mensagem real, copiada de onde ela aparece. */
  readonly message = input('');
  readonly where = input('O que aparece');
}
