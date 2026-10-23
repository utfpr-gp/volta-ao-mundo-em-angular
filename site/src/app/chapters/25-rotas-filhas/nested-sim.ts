import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

const TABS = [
  { path: 'visao-geral', label: 'Visão geral', component: 'CountryOverview' },
  { path: 'clima', label: 'Clima', component: 'CountryWeather' },
  { path: 'anotacoes', label: 'Anotações', component: 'CountryNotes' },
];

/** Simulador do capítulo 25: dois outlets, um dentro do outro; trocar de aba troca só o filho. */
@Component({
  selector: 'vm-nested-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Um outlet dentro do outro</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Clique nas abas e veja quem é criado e quem é destruído. A página do país fica; só o conteúdo da aba troca.
        </span>
      </figcaption>

      <p data-address class="rounded-full border border-line bg-surface-raised px-4 py-1.5 font-mono text-sm text-ink">localhost:4200{{ url() }}</p>

      <div class="mt-4 grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div data-outer class="rounded-2xl border-2 border-dashed border-inside/50 p-3 text-ink">
          <p class="font-mono text-xs text-inside">&lt;router-outlet&gt; do App</p>
          @if (tab(); as current) {
            <div class="mt-2 rounded-xl border border-line bg-surface-raised p-3">
              <p class="font-mono text-xs font-bold">CountryPage · 🇯🇵 Japão</p>
              <div class="mt-2 flex gap-1 border-b border-line text-sm">
                @for (item of tabs; track item.path) {
                  <button
                    type="button"
                    class="-mb-px border-b-[3px] px-2 py-1 font-bold"
                    [class]="item.path === current.path ? 'border-highlight text-ink' : 'border-transparent text-ink-muted'"
                    (click)="open(item.path)"
                  >{{ item.label }}</button>
                }
              </div>
              <div data-inner class="mt-3 rounded-xl border-2 border-dashed border-challenge/50 p-3">
                <p class="font-mono text-xs text-challenge">&lt;router-outlet&gt; do CountryPage</p>
                @if (innerOutlet()) {
                  <p class="mt-2 font-mono text-sm font-bold">{{ current.component }}</p>
                } @else {
                  <p class="mt-2 text-sm text-ink-muted">(sem o outlet, nada aparece aqui)</p>
                }
              </div>
            </div>
          } @else {
            <div class="mt-2 rounded-xl border border-pitfall/40 bg-surface-raised p-3">
              <p class="font-mono text-xs font-bold">NotFoundPage</p>
              <p class="mt-1 text-sm">🧭 Esta página não existe</p>
              <button type="button" class="mt-2 rounded-full border border-line px-3 py-1 text-sm font-bold" (click)="reset()">Voltar ao Japão</button>
            </div>
          }
        </div>

        <div class="flex flex-col gap-3 text-sm text-ink">
          <ol data-log class="flex min-h-24 flex-col gap-1 rounded-xl bg-terminal p-3 font-mono text-xs text-terminal-ink">
            @for (line of log(); track $index) {
              <li>{{ line }}</li>
            }
          </ol>
          <label class="flex cursor-pointer items-center gap-2">
            <input type="checkbox" class="size-4 accent-challenge" [checked]="!innerOutlet()" (change)="innerOutlet.set(!innerOutlet())" />
            Esquecer o <code class="font-mono">router-outlet</code> do CountryPage
          </label>
          <label class="flex cursor-pointer items-center gap-2">
            <input type="checkbox" class="size-4 accent-challenge" [checked]="absolute()" (change)="absolute.set(!absolute())" />
            Links das abas começando com barra: <code class="font-mono">/clima</code>
          </label>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class NestedSim {
  protected readonly tabs = TABS;
  protected readonly url = signal('/paises/JP/visao-geral');
  protected readonly innerOutlet = signal(true);
  protected readonly absolute = signal(false);
  protected readonly log = signal<string[]>([
    "'/paises/JP' → redirectTo: 'visao-geral'",
    'CountryPage criado',
    'CountryOverview criado',
  ]);

  protected readonly tab = computed(() => {
    const match = /^\/paises\/JP\/([a-z-]+)$/.exec(this.url());
    return TABS.find((tab) => tab.path === match?.[1]);
  });

  protected readonly announcement = computed(() => {
    const tab = this.tab();
    return tab ? `${this.url()}: aba ${tab.label}.` : `${this.url()}: página não encontrada.`;
  });

  protected open(path: string): void {
    const before = this.tab();
    if (this.absolute()) {
      this.url.set('/' + path);
      this.log.set([`routerLink="/${path}": endereço absoluto, a partir da raiz`, 'nenhuma rota combina com ' + path, 'CountryPage destruído', 'NotFoundPage criado']);
      return;
    }
    const next = TABS.find((tab) => tab.path === path)!;
    this.url.set(`/paises/JP/${path}`);
    if (before?.path === path) {
      this.log.set(['mesma aba: nada muda']);
      return;
    }
    this.log.set([`routerLink="${path}": relativo à página do país`, 'CountryPage continua', `${before?.component} destruído`, `${next.component} criado`]);
  }

  protected reset(): void {
    this.url.set('/paises/JP/visao-geral');
    this.log.set(['NotFoundPage destruído', 'CountryPage criado', 'CountryOverview criado']);
  }
}
