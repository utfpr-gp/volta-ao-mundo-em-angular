import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ViewKind = 'mission' | 'idea' | 'inside' | 'code' | 'pitfalls' | 'challenge' | 'further';

export interface ViewInfo {
  kind: ViewKind;
  id: string;
  icon: string;
  label: string;
  /** Classes de cor do rótulo e da bolha do ícone, escritas por extenso para o Tailwind encontrá-las. */
  text: string;
  bubble: string;
}

/** As visões de todo capítulo, na ordem de leitura. */
export const VIEWS: readonly ViewInfo[] = [
  { kind: 'mission', id: 'missao', icon: '🎯', label: 'A missão', text: 'text-mission', bubble: 'bg-mission/12' },
  { kind: 'idea', id: 'ideia', icon: '💡', label: 'A ideia', text: 'text-idea', bubble: 'bg-idea/14' },
  { kind: 'inside', id: 'por-dentro', icon: '🔬', label: 'Por dentro', text: 'text-inside', bubble: 'bg-inside/12' },
  { kind: 'code', id: 'mao-no-codigo', icon: '🛠️', label: 'Mão no código', text: 'text-code', bubble: 'bg-code/12' },
  { kind: 'pitfalls', id: 'armadilhas', icon: '⚠️', label: 'Armadilhas', text: 'text-pitfall', bubble: 'bg-pitfall/12' },
  { kind: 'challenge', id: 'desafio', icon: '🏁', label: 'Desafio', text: 'text-challenge', bubble: 'bg-challenge/12' },
  { kind: 'further', id: 'para-ir-alem', icon: '📚', label: 'Para ir além', text: 'text-link', bubble: 'bg-link/12' },
];

/** Uma das sete visões do capítulo: a seção com ícone, rótulo, título e link para o próprio endereço. */
@Component({
  selector: 'vm-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  host: { class: 'block' },
  template: `
    <section [id]="info().id" [attr.data-view]="info().kind" [attr.aria-labelledby]="info().id + '-titulo'" class="mt-14 scroll-mt-28 first:mt-10">
      <div class="not-prose mb-5 flex items-center gap-4">
        <span aria-hidden="true" class="grid size-12 shrink-0 place-items-center rounded-full text-2xl" [class]="info().bubble">
          {{ info().icon }}
        </span>
        <div>
          <p class="text-[13px] font-extrabold uppercase tracking-[0.18em]" [class]="info().text">{{ info().label }}</p>
          <h2 [id]="info().id + '-titulo'" class="group text-[1.65rem] font-extrabold leading-tight text-ink">
            {{ title() }}
            <a
              [routerLink]="[]"
              [fragment]="info().id"
              class="ml-1 text-ink-muted no-underline opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              [attr.aria-label]="'Link para a seção ' + info().label"
            >#</a>
          </h2>
        </div>
      </div>
      <ng-content />
    </section>
  `,
})
export class View {
  readonly kind = input.required<ViewKind>();
  readonly title = input.required<string>();

  protected readonly info = computed(() => VIEWS.find((view) => view.kind === this.kind())!);
}
