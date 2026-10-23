import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export type Level = 'airport' | 'backpacker' | 'traveler' | 'explorer';

export function levelFor(count: number): Level {
  if (count === 0) return 'airport';
  if (count < 10) return 'backpacker';
  if (count < 50) return 'traveler';
  return 'explorer';
}

const LEVEL_TEXT: Record<Level, string> = {
  airport: '✈️ Nível: no aeroporto',
  backpacker: '🎒 Nível: mochileiro',
  traveler: '🧳 Nível: viajante',
  explorer: '🌍 Nível: explorador do mundo',
};

const ON = 'bg-highlight/30 ring-2 ring-highlight';
const OFF = 'opacity-45';

/** Simulador do capítulo 10: um controle deslizante decide qual ramo do @if e qual caso do @switch aparecem. */
@Component({
  selector: 'vm-control-flow-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Qual ramo aparece?</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Arraste o controle e veja qual bloco do template vale para cada número de países, e o que sai da página.
        </span>
      </figcaption>

      <label class="block font-bold text-ink">
        visitedCount = {{ count() }}
        <input
          type="range"
          min="0"
          max="80"
          class="mt-2 block w-full accent-challenge"
          [value]="count()"
          (input)="set($any($event.target).valueAsNumber ?? +$any($event.target).value)"
          aria-describedby="lab-ajuda"
        />
      </label>
      <p id="lab-ajuda" class="text-sm text-ink-muted">Use as setas do teclado para mudar de um em um.</p>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <pre class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-sm leading-relaxed text-terminal-ink"><span data-branch="if" [attr.data-active]="count() === 0 ? '' : null" class="block rounded px-1" [class]="count() === 0 ? on : off">&#64;if (visitedCount() === 0) &#123;
  &lt;p class="empty"&gt;Nenhum país ainda&lt;/p&gt;</span><span data-branch="else" [attr.data-active]="count() > 0 ? '' : null" class="block rounded px-1" [class]="count() > 0 ? on : off">&#125; &#64;else &#123;
  &lt;p class="count"&gt;{{ '{{' }} visitedCount() {{ '}}' }} de 195 países&lt;/p&gt;
&#125;</span>
&#64;switch (level()) &#123;
<span data-branch="airport" [attr.data-active]="level() === 'airport' ? '' : null" class="block rounded px-1" [class]="level() === 'airport' ? on : off">  &#64;case ('airport') &#123; no aeroporto &#125;</span><span data-branch="backpacker" [attr.data-active]="level() === 'backpacker' ? '' : null" class="block rounded px-1" [class]="level() === 'backpacker' ? on : off">  &#64;case ('backpacker') &#123; mochileiro &#125;</span><span data-branch="traveler" [attr.data-active]="level() === 'traveler' ? '' : null" class="block rounded px-1" [class]="level() === 'traveler' ? on : off">  &#64;case ('traveler') &#123; viajante &#125;</span><span data-branch="default" [attr.data-active]="level() === 'explorer' ? '' : null" class="block rounded px-1" [class]="level() === 'explorer' ? on : off">  &#64;default &#123; explorador do mundo &#125;</span>&#125;</pre>

        <div class="flex flex-col gap-3">
          <div data-preview class="rounded-2xl bg-primary p-4 text-on-primary">
            @if (count() === 0) {
              <p class="text-xl font-extrabold">Nenhum país ainda</p>
            } @else {
              <p class="text-xl font-extrabold">{{ count() }} de 195 países</p>
            }
            <p class="mt-1 font-bold text-highlight">{{ levelText() }}</p>
          </div>
          <div data-dom class="rounded-2xl border border-line bg-surface-raised p-4 font-mono text-sm text-ink">
            <p class="font-sans text-xs font-bold uppercase tracking-wider text-ink-muted">Na página agora</p>
            <p>{{ count() === 0 ? 'p.empty' : 'p.count' }}</p>
            <p>texto do nível: {{ level() }}</p>
            <p class="mt-1 font-sans text-xs text-ink-muted">O ramo que não vale não fica escondido: ele nem existe na página.</p>
          </div>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ControlFlowLab {
  protected readonly on = ON;
  protected readonly off = OFF;
  protected readonly count = signal(3);
  protected readonly level = computed(() => levelFor(this.count()));
  protected readonly levelText = computed(() => LEVEL_TEXT[this.level()]);
  protected readonly announcement = computed(
    () =>
      `visitedCount ${this.count()}: vale o ramo ${this.count() === 0 ? '@if' : '@else'} e o caso ${this.level() === 'explorer' ? '@default' : this.level()} do @switch.`,
  );

  protected set(value: number): void {
    this.count.set(Number.isFinite(value) ? value : 0);
  }
}
