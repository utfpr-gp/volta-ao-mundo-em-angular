import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface Request {
  method: 'GET' | 'PUT';
  url: string;
  status: string;
  body?: string;
  ok: boolean;
}

const API = '…/api/paises.json';
const LOCAL = 'localhost:3000/passport';

/** Simulador do capítulo 29: o que sai do navegador, o que volta, e como o service e a tela reagem. */
@Component({
  selector: 'vm-request-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A viagem de uma requisição</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Abra o app e acompanhe a aba Network: cada linha é uma requisição. Depois, desligue a API ou o json-server e veja o service e a tela reagirem.
        </span>
      </figcaption>

      <div class="flex flex-wrap gap-2">
        <button type="button" class="rounded-full bg-primary px-4 py-1.5 font-bold text-on-primary" (click)="open()">▶ Abrir o app</button>
        <button type="button" class="rounded-full border border-line bg-surface-raised px-4 py-1.5 font-bold text-ink disabled:opacity-50" [disabled]="status() !== 'pronto'" (click)="markJapan()">
          🇯🇵 Marcar o Japão
        </button>
      </div>
      <div class="mt-3 flex flex-col gap-1 text-sm text-ink">
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="apiDown()" (change)="apiDown.set(!apiDown())" /> API fora do ar
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="serverOff()" (change)="serverOff.set(!serverOff())" /> json-server desligado
        </label>
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="size-4 accent-challenge" [checked]="noSubscribe()" (change)="noSubscribe.set(!noSubscribe())" />
          Esquecer o <code class="font-mono">.subscribe()</code>
        </label>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div class="overflow-x-auto rounded-2xl border border-line bg-surface-raised p-3 text-ink">
          <p class="mb-2 text-xs font-extrabold uppercase tracking-wider text-ink-muted">Network</p>
          <table class="w-full font-mono text-xs">
            <thead><tr class="text-left text-ink-muted"><th class="pr-2">Método</th><th class="pr-2">Endereço</th><th>Status</th></tr></thead>
            <tbody>
              @for (request of requests(); track $index) {
                <tr data-request class="border-t border-line align-top">
                  <td class="py-1 pr-2 font-bold">{{ request.method }}</td>
                  <td class="py-1 pr-2">{{ request.url }}@if (request.body) {<span class="block text-ink-muted">{{ request.body }}</span>}</td>
                  <td class="py-1 font-bold" [class]="request.ok ? 'text-challenge' : 'text-pitfall'">{{ request.status }}</td>
                </tr>
              } @empty {
                <tr><td colspan="3" class="py-2 text-ink-muted">Nenhuma requisição ainda.</td></tr>
              }
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-3">
          <pre data-state class="rounded-2xl bg-terminal p-3 font-mono text-xs leading-relaxed text-terminal-ink">Passport
  status: '{{ status() }}'
  saveFailed: {{ saveFailed() }}
  visitedCount: {{ visited().length }}</pre>
          <div data-screen class="rounded-2xl border border-line bg-surface-raised p-3 text-sm text-ink">
            @if (saveFailed()) {
              <p class="mb-2 rounded-lg bg-highlight px-2 py-1 font-bold text-primary">⚠ Não foi possível salvar o passaporte</p>
            }
            @switch (status()) {
              @case ('carregando') { <p class="text-ink-muted">Carregando os países…</p> }
              @case ('erro') {
                <p class="font-bold">Não foi possível carregar os países.</p>
                <button type="button" class="mt-2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary" (click)="open()">Tentar de novo</button>
              }
              @default { <p>🌍 195 países · {{ visited().length }} visitados</p> }
            }
          </div>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class RequestSim {
  protected readonly apiDown = signal(false);
  protected readonly serverOff = signal(false);
  protected readonly noSubscribe = signal(false);

  protected readonly requests = signal<Request[]>([]);
  protected readonly status = signal<'carregando' | 'pronto' | 'erro'>('carregando');
  protected readonly saveFailed = signal(false);
  protected readonly visited = signal<string[]>([]);

  protected readonly announcement = computed(() => {
    const last = this.requests().at(-1);
    return last ? `${last.method} ${last.url}: ${last.status}. Status ${this.status()}.` : '';
  });

  protected open(): void {
    this.requests.set([]);
    this.status.set('carregando');
    this.saveFailed.set(false);
    this.visited.set([]);
    // Um Observable do HttpClient só faz a requisição quando alguém se inscreve nele.
    if (this.noSubscribe()) return;
    if (this.apiDown()) {
      this.log({ method: 'GET', url: API, status: '503', ok: false });
      this.status.set('erro');
    } else {
      this.log({ method: 'GET', url: API, status: '200', ok: true });
      this.status.set('pronto');
    }
    if (this.serverOff()) {
      this.log({ method: 'GET', url: LOCAL, status: 'falhou', ok: false });
      this.saveFailed.set(true);
    } else {
      this.log({ method: 'GET', url: LOCAL, status: '200', ok: true });
      this.visited.set(['BR', 'PT', 'AR']);
    }
  }

  protected markJapan(): void {
    this.visited.update((codes) => (codes.includes('JP') ? codes.filter((c) => c !== 'JP') : [...codes, 'JP']));
    const body = JSON.stringify({ visited: this.visited() });
    if (this.serverOff()) {
      this.log({ method: 'PUT', url: LOCAL, status: 'falhou', ok: false, body });
      this.saveFailed.set(true);
    } else {
      this.log({ method: 'PUT', url: LOCAL, status: '200', ok: true, body });
    }
  }

  private log(request: Request): void {
    this.requests.update((all) => [...all, request]);
  }
}
