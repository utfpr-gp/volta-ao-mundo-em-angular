import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { debounceTime, finalize, map, mergeMap, Observable, Subject, Subscription, switchMap, tap, timer } from 'rxjs';

type RequestState = 'caminho' | 'ok' | 'cancelada';

interface Marble {
  value: string;
  at: number;
  state?: RequestState;
}

const MARK: Record<RequestState, string> = { caminho: '…', ok: '✓', cancelada: '✕' };

/** Simulador do capítulo 30: RxJS de verdade, com cada valor desenhado na linha em que passa. */
@Component({
  selector: 'vm-marble-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A esteira do RxJS</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Digite na busca, ou aperte o botão para digitar "japao" depressa. Cada linha mostra o que passa em cada etapa do pipe; cada requisição demora 0,8 s.
        </span>
      </figcaption>

      <div class="flex flex-wrap items-end gap-3">
        <label class="flex flex-col gap-1 text-sm font-bold text-ink">
          Buscar país
          <input
            type="text"
            class="w-52 rounded-lg border border-line bg-surface-raised px-3 py-1.5 font-normal"
            [value]="text()"
            (input)="type($any($event.target).value)"
          />
        </label>
        <button type="button" class="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="autoType()">⌨ Digitar "japao" depressa</button>
        <button type="button" class="rounded-full border border-line bg-surface-raised px-4 py-1.5 text-sm font-bold text-ink" (click)="rebuild()">Limpar</button>
      </div>
      <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink">
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="debounce()" (change)="debounce.set(!debounce()); rebuild()" />
          <code class="font-mono">debounceTime(300)</code>
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="merge()" (change)="merge.set(!merge()); rebuild()" />
          Trocar o <code class="font-mono">switchMap</code> por <code class="font-mono">mergeMap</code>
        </label>
      </div>

      <pre class="mt-4 overflow-x-auto rounded-xl bg-terminal p-3 font-mono text-xs text-terminal-ink">typed.pipe(
  {{ debounce() ? 'debounceTime(300),' : '// sem debounceTime' }}
  {{ merge() ? 'mergeMap' : 'switchMap' }}((text) => buscar(text)),
)</pre>

      <div class="mt-4 flex flex-col gap-3">
        @for (line of lines; track line.id) {
          <div [attr.data-row]="line.id" class="rounded-2xl border border-line bg-surface-raised p-3">
            <p class="mb-2 font-mono text-xs font-bold text-ink-muted">{{ line.label }}</p>
            <div class="flex min-h-9 flex-wrap gap-1.5">
              @for (marble of rows[line.id](); track $index) {
                <span class="flex items-baseline gap-1 rounded-full border px-2.5 py-1 font-mono text-xs" [class]="marbleClass(marble)">
                  <span data-marble>{{ marble.value }}{{ marble.state ? ' ' + mark(marble.state) : '' }}</span>
                  <span class="text-[10px] opacity-70" aria-hidden="true">+{{ marble.at }}ms</span>
                </span>
              }
            </div>
          </div>
        }
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class MarbleSim {
  protected readonly lines = [
    { id: 'teclas', label: 'typed: cada tecla' },
    { id: 'debounce', label: 'depois do debounceTime(300)' },
    { id: 'requisicoes', label: 'requisições (✓ respondida · ✕ cancelada · … a caminho)' },
  ] as const;

  protected readonly text = signal('');
  protected readonly debounce = signal(true);
  protected readonly merge = signal(false);
  protected readonly announcement = signal('');
  protected readonly rows = {
    teclas: signal<Marble[]>([]),
    debounce: signal<Marble[]>([]),
    requisicoes: signal<Marble[]>([]),
  };

  private readonly typed = new Subject<string>();
  private subscription?: Subscription;
  private start = 0;

  constructor() {
    this.rebuild();
    inject(DestroyRef).onDestroy(() => this.subscription?.unsubscribe());
  }

  /** Monta o pipe de novo, com as opções escolhidas, e limpa as linhas. */
  protected rebuild(): void {
    this.subscription?.unsubscribe();
    this.text.set('');
    this.start = 0;
    for (const row of Object.values(this.rows)) row.set([]);
    const source = this.debounce() ? this.typed.pipe(debounceTime(300)) : this.typed;
    const flatten = this.merge() ? mergeMap : switchMap;
    this.subscription = source
      .pipe(
        tap((text) => this.rows.debounce.update((all) => [...all, this.marble(text)])),
        flatten((text: string) => this.search(text)),
      )
      .subscribe((index) => this.setState(index, 'ok'));
  }

  protected type(text: string): void {
    if (!this.start) this.start = Date.now();
    this.text.set(text);
    this.rows.teclas.update((all) => [...all, this.marble(text)]);
    this.typed.next(text);
  }

  protected autoType(): void {
    this.rebuild();
    [...'japao'].forEach((_, i, letters) => setTimeout(() => this.type(letters.slice(0, i + 1).join('')), i * 100));
  }

  protected mark(state: RequestState): string {
    return MARK[state];
  }

  protected marbleClass(marble: Marble): string {
    if (marble.state === 'ok') return 'border-challenge bg-challenge/10 text-ink';
    if (marble.state === 'cancelada') return 'border-pitfall/50 text-ink-muted line-through';
    return 'border-line bg-surface text-ink';
  }

  /** Uma busca de mentirinha, que responde em 0,8 s. Se o switchMap desistir dela, o finalize a marca como cancelada. */
  private search(text: string): Observable<number> {
    const index = this.rows.requisicoes().length;
    this.rows.requisicoes.update((all) => [...all, { ...this.marble(text), state: 'caminho' }]);
    return timer(800).pipe(
      map(() => index),
      finalize(() => {
        if (this.rows.requisicoes()[index]?.state === 'caminho') this.setState(index, 'cancelada');
      }),
    );
  }

  private setState(index: number, state: RequestState): void {
    this.rows.requisicoes.update((all) => all.map((marble, i) => (i === index ? { ...marble, state } : marble)));
    const requests = this.rows.requisicoes();
    this.announcement.set(
      `${requests.length} requisições: ${requests.filter((r) => r.state === 'ok').length} respondidas, ${requests.filter((r) => r.state === 'cancelada').length} canceladas.`,
    );
  }

  private marble(value: string): Marble {
    return { value, at: this.start ? Date.now() - this.start : 0 };
  }
}
