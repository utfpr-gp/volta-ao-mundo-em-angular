import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

/** Simulador do capítulo 33: o que o effect faz, quando ele roda, e por que o computed é melhor para derivar valores. */
@Component({
  selector: 'vm-effect-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">effect ou computed?</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          O signal visited conta países visitados. Um computed calcula a porcentagem do mundo; um effect salva no "navegador"; e outro effect copia o valor num signal, do jeito que não se deve.
        </span>
      </figcaption>

      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="visitOne()">＋ Visitar mais um</button>
        <button type="button" class="rounded-full border border-line bg-surface-raised px-4 py-1.5 text-sm font-bold text-ink" (click)="visitThree()">
          ＋3: três vezes visited.update(...), de uma vez
        </button>
        <button type="button" class="rounded-full border border-line bg-surface-raised px-4 py-1.5 text-sm font-bold text-ink" (click)="reset()">Zerar</button>
      </div>

      <p data-snapshot class="mt-3 rounded-xl border border-line bg-surface-raised px-3 py-2 font-mono text-sm text-ink">
        No instante do clique → computed: {{ snapshot().computed }} · cópia por effect: {{ snapshot().mirror }}{{ snapshot().computed !== snapshot().mirror ? ' (atrasada!)' : '' }}
      </p>

      <div class="mt-4 grid gap-3 md:grid-cols-3">
        <div class="rounded-2xl border border-challenge bg-surface-raised p-3 text-ink">
          <p class="font-mono text-xs font-bold text-challenge">computed</p>
          <p class="mt-1 font-mono text-xs text-ink-muted">tenPercent = computed(() => visited() * 10)</p>
          <p class="mt-2 text-2xl font-extrabold">{{ tenPercent() }}</p>
          <p class="text-xs text-ink-muted">Sempre certo, na hora em que alguém lê.</p>
        </div>
        <div class="rounded-2xl border border-inside bg-surface-raised p-3 text-ink">
          <p class="font-mono text-xs font-bold text-inside">effect: salvar fora</p>
          <p class="mt-1 font-mono text-xs text-ink-muted">effect(() => localStorage.setItem(...))</p>
          <p data-saved class="mt-2 break-all font-mono text-sm">{{ saved() }}</p>
          <p data-effect-runs class="text-xs text-ink-muted">O effect rodou {{ runs() }} {{ runs() === 1 ? 'vez' : 'vezes' }}.</p>
        </div>
        <div class="rounded-2xl border border-pitfall/50 bg-surface-raised p-3 text-ink">
          <p class="font-mono text-xs font-bold text-pitfall">effect: copiar num signal (evite)</p>
          <p class="mt-1 font-mono text-xs text-ink-muted">effect(() => mirror.set(visited() * 10))</p>
          <p data-mirror class="mt-2 text-2xl font-extrabold">{{ mirror() }}</p>
          <p class="text-xs text-ink-muted">Chega ao valor certo, mas um passo depois.</p>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">Visitados: {{ visited() }}. O effect rodou {{ runs() }} vezes.</p>
    </figure>
  `,
})
export class EffectSim {
  protected readonly visited = signal(0);
  protected readonly tenPercent = computed(() => this.visited() * 10);
  /** O "localStorage" de mentirinha que o effect escreve. */
  protected readonly saved = signal('');
  protected readonly runs = signal(0);
  protected readonly mirror = signal(0);
  protected readonly snapshot = signal({ computed: 0, mirror: 0 });

  constructor() {
    effect(() => {
      const text = JSON.stringify({ visited: this.visited() });
      // untracked não é preciso aqui: saved e runs não são lidos para decidir quando o effect roda.
      this.saved.set(text);
      this.runs.update((n) => n + 1);
    });
    effect(() => this.mirror.set(this.visited() * 10));
  }

  protected visitOne(): void {
    this.visited.update((n) => n + 1);
    this.snapshot.set({ computed: this.tenPercent(), mirror: this.mirror() });
  }

  protected visitThree(): void {
    this.visited.update((n) => n + 1);
    this.visited.update((n) => n + 1);
    this.visited.update((n) => n + 1);
    this.snapshot.set({ computed: this.tenPercent(), mirror: this.mirror() });
  }

  protected reset(): void {
    this.visited.set(0);
    this.snapshot.set({ computed: 0, mirror: 0 });
  }
}
