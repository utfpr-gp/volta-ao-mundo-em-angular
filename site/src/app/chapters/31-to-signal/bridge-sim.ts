import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

/** Quantos relógios estão inscritos agora. Compartilhado entre o relógio e o simulador. */
const activeClocks = signal(0);

/** Um Observable que bate a cada segundo e conta quem está inscrito nele. */
function ticking(): Observable<Date> {
  return new Observable<Date>((subscriber) => {
    activeClocks.update((n) => n + 1);
    const inner = interval(1000).pipe(map(() => new Date())).subscribe(subscriber);
    return () => {
      inner.unsubscribe();
      activeClocks.update((n) => n - 1);
    };
  });
}

@Component({
  selector: 'vm-bridge-clock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="font-mono text-2xl font-extrabold">{{ time() }}</span>`,
})
class BridgeClock {
  private readonly now = toSignal(ticking(), { initialValue: new Date() });
  protected readonly time = computed(() => this.now().toLocaleTimeString('pt-BR'));
}

/** Simulador do capítulo 31: as duas direções da ponte entre signals e Observables. */
@Component({
  selector: 'vm-bridge-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BridgeClock],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A ponte entre os dois mundos</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          À esquerda, um signal vira Observable com toObservable. À direita, um Observable vira signal com toSignal. Os dois são de verdade.
        </span>
      </figcaption>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <p class="font-mono text-xs font-bold text-inside">toObservable(text)</p>
          <label class="mt-2 flex flex-col gap-1 text-sm font-bold">
            text, um signal
            <input
              type="text"
              class="rounded-lg border border-line bg-surface px-3 py-1.5 font-normal"
              [value]="text()"
              (input)="text.set($any($event.target).value)"
            />
          </label>
          <button type="button" class="mt-2 rounded-full border border-line px-3 py-1 text-sm font-bold" (click)="setThrice()">
            set('j'), set('ja'), set('jap'): três vezes seguidas
          </button>
          <p class="mt-3 text-sm font-bold">O que chegou ao Observable:</p>
          <div class="mt-1 flex min-h-8 flex-wrap gap-1.5">
            @for (value of emissions(); track $index) {
              <span data-emission class="rounded-full border border-challenge bg-challenge/10 px-2.5 py-0.5 font-mono text-xs">'{{ value }}'</span>
            }
          </div>
          <button type="button" class="mt-2 text-xs font-bold text-ink-muted underline" (click)="emissions.set([])">limpar</button>
        </div>

        <div class="rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <p class="font-mono text-xs font-bold text-inside">toSignal(interval(1000))</p>
          <button type="button" class="mt-2 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="showClock.set(!showClock())">
            {{ showClock() ? 'Esconder o relógio' : 'Mostrar o relógio' }}
          </button>
          <div class="mt-3 flex min-h-12 items-center">
            @if (showClock()) {
              <vm-bridge-clock />
            } @else {
              <span class="text-sm text-ink-muted">(relógio fora da tela)</span>
            }
          </div>
          <p data-active class="mt-2 text-sm">Inscrições ativas no interval: <strong>{{ active() }}</strong></p>
          <p class="mt-1 text-xs text-ink-muted">Nenhum subscribe, nenhum unsubscribe: o toSignal cuida dos dois.</p>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class BridgeSim {
  protected readonly text = signal('');
  protected readonly emissions = signal<string[]>([]);
  protected readonly showClock = signal(false);
  protected readonly active = activeClocks.asReadonly();
  protected readonly announcement = computed(
    () => `${this.emissions().length} valores chegaram ao Observable. ${this.active()} inscrições ativas no relógio.`,
  );

  constructor() {
    toObservable(this.text).subscribe((value) => this.emissions.update((all) => [...all, value]));
  }

  /** Três mudanças no mesmo instante: o toObservable só entrega a última. */
  protected setThrice(): void {
    this.emissions.set([]);
    this.text.set('j');
    this.text.set('ja');
    this.text.set('jap');
  }
}
