import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Strategy = 'performance' | 'freshness';
type Source = 'cache' | 'rede' | 'falha';

/**
 * Simulador do capítulo 47: o service worker entre o app e a rede, com as duas estratégias de um dataGroup. Segue o que o
 * ngsw-worker.js do Angular 22 faz: `performance` usa a cópia guardada sem consultar a rede; `freshness` vai à rede e só cai
 * na cópia quando a rede falha ou demora.
 */
@Component({
  selector: 'vm-cache-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">De onde vem a resposta</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          O app pede a lista de países. Escolha a estratégia do grupo de dados, ligue e desligue a internet, mude os dados no
          servidor, e veja quem responde: o cache do service worker ou a rede.
        </span>
      </figcaption>

      <div class="grid gap-4 text-ink sm:grid-cols-2 [&>*]:min-w-0">
        <fieldset class="flex flex-col gap-1">
          <legend class="mb-1 text-sm font-bold">A estratégia</legend>
          @for (option of strategies; track option) {
            <label class="flex items-center gap-2 font-mono text-sm">
              <input type="radio" name="sim-strategy" [value]="option" [checked]="strategy() === option" (change)="strategy.set(option)" />
              {{ option }}
            </label>
          }
        </fieldset>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            data-online
            class="self-start rounded-full border border-line px-3 py-1.5 text-sm font-bold text-ink"
            [attr.aria-pressed]="online()"
            (click)="toggleOnline()"
          >
            Internet: {{ online() ? 'ligada' : 'desligada' }}
          </button>
          <div class="flex flex-wrap gap-2">
            <button type="button" data-request class="rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-on-primary" (click)="request()">
              Pedir a lista
            </button>
            <button type="button" data-change class="rounded-full border border-line px-3 py-1.5 text-sm font-bold text-ink" (click)="changeServer()">
              Mudar os dados no servidor
            </button>
            <button type="button" data-clear class="rounded-full border border-line px-3 py-1.5 text-sm font-bold text-ink" (click)="clearCache()">
              Limpar o cache
            </button>
          </div>
        </div>
      </div>

      <ol class="mt-4 grid gap-2 text-center text-sm font-bold text-ink sm:grid-cols-3">
        <li class="rounded-2xl border border-line bg-surface-raised p-3">📱 O app</li>
        <li data-cache class="rounded-2xl border p-3" [class]="source() === 'cache' ? 'border-inside bg-inside/15' : 'border-line bg-surface-raised'">
          🗄️ Service worker
          <span class="block font-normal text-ink-muted">cache: {{ cached() === null ? 'vazio' : 'versão ' + cached() }}</span>
        </li>
        <li data-network class="rounded-2xl border p-3" [class]="source() === 'rede' ? 'border-inside bg-inside/15' : 'border-line bg-surface-raised'">
          🌐 Servidor
          <span class="block font-normal text-ink-muted">{{ online() ? 'dados na versão ' + server() : 'fora de alcance' }}</span>
        </li>
      </ol>

      <p data-result aria-live="polite" class="mt-3 min-h-12 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        {{ result() }}
      </p>
    </figure>
  `,
})
export class CacheSim {
  protected readonly strategies: readonly Strategy[] = ['performance', 'freshness'];
  protected readonly strategy = signal<Strategy>('performance');
  protected readonly online = signal(true);
  protected readonly server = signal(1);
  protected readonly cached = signal<number | null>(null);
  protected readonly source = signal<Source | null>(null);
  protected readonly result = signal('Nenhum pedido ainda. Comece por "Pedir a lista".');

  protected request(): void {
    const cached = this.cached();
    const useCacheFirst = this.strategy() === 'performance' && cached !== null;
    if (!useCacheFirst && this.online()) {
      this.cached.set(this.server());
      this.answer('rede', `Veio da rede: a lista na versão ${this.server()}. O service worker guardou uma cópia.`);
    } else if (cached !== null) {
      const old = cached < this.server() ? ` O servidor já está na versão ${this.server()}.` : '';
      const why = useCacheFirst ? 'Nenhum pedido saiu para a rede.' : 'A rede falhou, e o service worker usou a cópia.';
      this.answer('cache', `Veio do cache: a lista na versão ${cached}. ${why}${old}`);
    } else {
      this.answer('falha', 'Falhou: sem internet e sem cópia guardada. O app recebe um erro.');
    }
  }

  protected toggleOnline(): void {
    this.online.update((on) => !on);
  }

  protected changeServer(): void {
    this.server.update((version) => version + 1);
    this.answer(null, `Alguém mudou os dados: o servidor agora está na versão ${this.server()}.`);
  }

  protected clearCache(): void {
    this.cached.set(null);
    this.answer(null, 'O cache ficou vazio.');
  }

  private answer(source: Source | null, text: string): void {
    this.source.set(source);
    this.result.set(text);
  }
}
