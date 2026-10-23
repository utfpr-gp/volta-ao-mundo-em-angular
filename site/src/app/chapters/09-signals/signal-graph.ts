import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Path = 'visited' | 'name' | null;

const TOTAL = 195;

/**
 * Simulador do capítulo 9: um grafo com signals de verdade. O pulso mostra o caminho de cada mudança,
 * e o contador mostra que o computed só recalcula quando um signal que ele lê muda.
 */
@Component({
  selector: 'vm-signal-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  styles: `
    .wire {
      position: relative;
      height: 4px;
      border-radius: 999px;
      background: var(--color-primary-soft);
    }
    .pulse {
      position: absolute;
      top: -5px;
      left: 0;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--color-highlight);
      opacity: 0;
    }
    @media (prefers-reduced-motion: no-preference) {
      .pulse.go {
        animation: travel 0.5s linear forwards;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .pulse.go {
        left: calc(100% - 14px);
        opacity: 1;
      }
    }
    @keyframes travel {
      0% { left: 0; opacity: 1; }
      100% { left: calc(100% - 14px); opacity: 1; }
    }
  `,
  template: `
    <figure class="rounded-[22px] bg-primary p-5 text-on-primary sm:p-7">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-highlight">Simulador</span>
        <span class="block text-xl font-extrabold">signal → computed → tela</span>
        <span class="mt-1 block max-w-2xl text-on-primary-muted">
          Este simulador roda com signals de verdade. Mude os valores e veja o caminho de cada mudança.
        </span>
      </figcaption>

      <div class="grid items-center gap-3 md:grid-cols-[1fr_3rem_1fr_3rem_1.3fr]">
        <div class="flex flex-col gap-3">
          <div data-node="visited" class="rounded-2xl border-2 bg-primary-soft p-3 text-center" [class]="nodeClass('visited')">
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary-muted">signal</p>
            <p class="font-mono text-lg font-semibold">visited = {{ visited() }}</p>
          </div>
          <div data-node="name" class="rounded-2xl border-2 bg-primary-soft p-3 text-center" [class]="nodeClass('name')">
            <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary-muted">signal</p>
            <p class="font-mono text-lg font-semibold">name = '{{ name() }}'</p>
          </div>
        </div>

        @for (tick of [ticks()]; track tick) {
          <div class="wire hidden md:block" aria-hidden="true"><span class="pulse" [class.go]="path() === 'visited'"></span></div>
        }

        <div data-node="percent" class="rounded-2xl border-2 bg-primary-soft p-3 text-center" [class]="nodeClass('visited')">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-on-primary-muted">computed</p>
          <p class="font-mono text-lg font-semibold">percent = {{ percent() }}%</p>
          <p data-runs class="mt-1 text-xs text-on-primary-muted">recalculado {{ runs }} {{ runs === 1 ? 'vez' : 'vezes' }}</p>
        </div>

        @for (tick of [ticks()]; track tick) {
          <div class="wire hidden md:block" aria-hidden="true"><span class="pulse" [class.go]="path() !== null"></span></div>
        }

        <div data-node="screen" class="rounded-2xl border-2 border-highlight bg-surface-raised p-3 text-center text-ink">
          <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">tela</p>
          <p class="font-bold">Passaporte de {{ name() }}</p>
          <p class="text-sm">{{ visited() }} países · {{ percent() }}% do mundo</p>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap items-end gap-3">
        <button type="button" class="rounded-full bg-highlight px-4 py-2 font-extrabold text-primary" (click)="visitOneMore()">＋ Visitei mais um</button>
        <button type="button" class="rounded-full border border-on-primary-muted/60 px-4 py-2 font-bold text-on-primary" (click)="undo()">Desfazer</button>
        <label class="flex flex-col text-sm text-on-primary-muted">
          Nome no passaporte
          <input #field class="mt-1 rounded-lg bg-primary-soft px-3 py-1.5 text-on-primary" [value]="name()" (input)="rename(field.value)" />
        </label>
      </div>
      <p class="mt-4 text-sm text-on-primary-muted">
        Repare no contador do computed: mudar o nome atualiza a tela, mas não faz a porcentagem ser recalculada, porque ela não lê
        <code class="font-mono">name()</code>.
      </p>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class SignalGraph {
  protected readonly visited = signal(3);
  protected readonly name = signal('Ana');
  protected runs = 0;
  protected readonly percent = computed(() => {
    this.runs++;
    return Math.round((this.visited() / TOTAL) * 100);
  });

  protected readonly path = signal<Path>(null);
  protected readonly ticks = signal(0);
  protected readonly announcement = signal('');

  protected nodeClass(node: 'visited' | 'name'): string {
    return this.path() === node ? 'border-highlight' : 'border-on-primary-muted/30';
  }

  protected visitOneMore(): void {
    this.visited.update((count) => count + 1);
    this.flow('visited', 'Mudança em visited: o caminho foi visited → percent → tela. O computed recalculou.');
  }

  protected undo(): void {
    this.visited.update((count) => Math.max(count - 1, 0));
    this.flow('visited', 'Mudança em visited: o caminho foi visited → percent → tela. O computed recalculou.');
  }

  protected rename(value: string): void {
    this.name.set(value);
    this.flow('name', 'Mudança em name: o caminho foi direto name → tela. O computed não recalculou.');
  }

  private flow(path: Path, message: string): void {
    this.path.set(path);
    this.ticks.update((tick) => tick + 1);
    this.announcement.set(message);
  }
}
