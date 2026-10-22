import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { neighbors } from '../catalog/catalog';
import { InlineCode } from '../shared/inline-code';

/** Os links para o capítulo anterior e o próximo, no fim de cada capítulo. */
@Component({
  selector: 'vm-chapter-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InlineCode],
  host: { class: 'block' },
  template: `
    <nav aria-label="Capítulos vizinhos" class="grid gap-4 sm:grid-cols-2">
      @if (around().previous; as previous) {
        <a [routerLink]="['/capitulos', previous.slug]" class="group rounded-card border border-line bg-surface-raised p-5 no-underline hover:border-link">
          <span class="text-sm font-bold text-ink-muted">
            ← Capítulo {{ previous.number }}@if (!previous.published) { · em breve}
          </span>
          <span class="mt-1 block font-bold text-ink group-hover:text-link [&_code]:font-mono"><vm-inline-code [text]="previous.question" /></span>
        </a>
      } @else {
        <span aria-hidden="true"></span>
      }
      @if (around().next; as next) {
        <a [routerLink]="['/capitulos', next.slug]" class="group rounded-card border border-line bg-surface-raised p-5 text-right no-underline hover:border-link">
          <span class="text-sm font-bold text-ink-muted">
            Próxima parada: capítulo {{ next.number }}@if (!next.published) { · em breve} →
          </span>
          <span class="mt-1 block font-bold text-ink group-hover:text-link [&_code]:font-mono"><vm-inline-code [text]="next.question" /></span>
        </a>
      }
    </nav>
  `,
})
export class ChapterNav {
  readonly slug = input.required<string>();
  protected readonly around = computed(() => neighbors(this.slug()));
}
