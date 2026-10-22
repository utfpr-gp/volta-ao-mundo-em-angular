import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

// Exceção à regra dos tokens: este simulador ensina justamente as classes da paleta padrão do Tailwind.
export const CLASS_GROUPS: { id: string; label: string; options: string[] }[] = [
  { id: 'espacamento', label: 'Espaçamento interno', options: ['p-2', 'p-4', 'p-6'] },
  { id: 'cantos', label: 'Cantos', options: ['rounded-none', 'rounded-lg', 'rounded-2xl'] },
  { id: 'sombra', label: 'Sombra', options: ['shadow-none', 'shadow-md', 'shadow-xl'] },
  { id: 'fundo', label: 'Fundo e texto', options: ['bg-white text-slate-900', 'bg-amber-100 text-slate-900', 'bg-slate-900 text-white'] },
  { id: 'layout', label: 'Layout', options: ['flex-row items-center', 'flex-col items-start'] },
];

const INITIAL: Record<string, string> = {
  espacamento: 'p-4',
  cantos: 'rounded-lg',
  sombra: 'shadow-md',
  fundo: 'bg-white text-slate-900',
  layout: 'flex-row items-center',
};

/** Simulador do capítulo 13: montar o estilo de um cartão juntando classes utilitárias do Tailwind. */
@Component({
  selector: 'vm-class-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Monte o cartão com utilitários</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Cada escolha acrescenta uma classe do Tailwind. Nenhuma linha de CSS é escrita: o estilo sai das classes.
        </span>
      </figcaption>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        @for (group of groups; track group.id) {
          <fieldset class="rounded-2xl border border-line bg-surface-raised p-3">
            <legend class="px-1 text-sm font-extrabold text-ink">{{ group.label }}</legend>
            @for (option of group.options; track option) {
              <label class="mt-1 flex cursor-pointer items-center gap-2 font-mono text-xs text-ink">
                <input
                  type="radio"
                  class="size-4 accent-challenge"
                  [name]="group.id"
                  [value]="option"
                  [checked]="choices()[group.id] === option"
                  (change)="choose(group.id, option)"
                />
                {{ option }}
              </label>
            }
          </fieldset>
        }
      </div>

      <div class="mt-5 grid items-start gap-4 lg:grid-cols-2">
        <div class="rounded-2xl bg-surface p-6">
          <div data-card class="flex gap-3 border border-stone-200" [class]="classes()">
            <span class="text-3xl">🇵🇹</span>
            <strong>Portugal</strong>
            <span class="opacity-70">Lisboa</span>
          </div>
        </div>
        <div class="rounded-2xl bg-terminal p-4 font-mono text-sm text-terminal-ink">
          <p class="text-xs text-terminal-ink/70">no template</p>
          <p class="mt-1 break-words">&lt;li class="<span data-classes class="text-terminal-prompt">flex gap-3 border border-stone-200 {{ classes() }}</span>"&gt;</p>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">Classes do cartão: {{ classes() }}</p>
    </figure>
  `,
})
export class ClassBuilder {
  protected readonly groups = CLASS_GROUPS;
  protected readonly choices = signal<Record<string, string>>({ ...INITIAL });
  protected readonly classes = computed(() => CLASS_GROUPS.map((group) => this.choices()[group.id]).join(' '));

  protected choose(group: string, option: string): void {
    this.choices.update((choices) => ({ ...choices, [group]: option }));
  }
}
