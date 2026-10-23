import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';

/** O filho do simulador: um relógio que registra o próprio ciclo de vida. */
@Component({
  selector: 'vm-lab-clock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="rounded-xl bg-surface-raised px-4 py-3 font-mono text-ink">🕒 {{ ticks() }} tique(s)</p>`,
})
export class LabClock implements OnInit {
  readonly log = input.required<(line: string) => void>();
  readonly cleanup = input(true);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly ticks = signal(0);
  private destroyed = false;

  constructor() {
    queueMicrotask(() => this.log()('1. constructor: o componente foi criado'));
  }

  ngOnInit(): void {
    this.log()('2. ngOnInit: os inputs chegaram; o relógio liga');
    const id = setInterval(() => {
      this.ticks.update((n) => n + 1);
      if (this.destroyed) this.log()('⚠️ tique depois de destruído: o intervalo continua vivo!');
    }, 1000);
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      if (this.cleanup()) {
        clearInterval(id);
        this.log()('3. onDestroy: o componente saiu; o relógio desliga');
      } else {
        this.log()('3. onDestroy: o componente saiu, mas ninguém desligou o relógio…');
      }
    });
  }
}

/** Simulador do capítulo 19: mostrar e esconder um componente e acompanhar o ciclo de vida dele. */
@Component({
  selector: 'vm-lifecycle-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabClock],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A vida de um componente</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Mostre e esconda o relógio com um &#64;if e leia o diário dele. Depois, desligue a limpeza e veja o que acontece.
        </span>
      </figcaption>

      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="rounded-full bg-primary px-4 py-2 font-bold text-on-primary" (click)="toggle()">
          {{ shown() ? 'Esconder o relógio' : 'Mostrar o relógio' }}
        </button>
        <label class="flex items-center gap-2 font-semibold text-ink">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="!cleanup()" (change)="cleanup.set(!$any($event.target).checked)" />
          esquecer de limpar o intervalo
        </label>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <div class="min-h-16">
          @if (shown()) {
            <vm-lab-clock [log]="logFn" [cleanup]="cleanup()" />
          } @else {
            <p class="rounded-xl border border-dashed border-line px-4 py-3 text-ink-muted">(o relógio não existe agora)</p>
          }
        </div>
        <ol data-log class="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-2xl bg-terminal p-4 font-mono text-xs text-terminal-ink" aria-live="polite">
          @for (line of lines(); track $index) {
            <li>{{ line }}</li>
          }
        </ol>
      </div>
    </figure>
  `,
})
export class LifecycleLab {
  protected readonly shown = signal(false);
  protected readonly cleanup = signal(true);
  protected readonly lines = signal<string[]>([]);
  protected readonly logFn = (line: string) => this.lines.update((lines) => [...lines.slice(-11), line]);

  protected toggle(): void {
    this.shown.update((shown) => !shown);
  }
}
