import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface SimRoute {
  id: string;
  path: string;
  code: string;
  redirectTo?: string;
  page?: 'paises' | 'sobre' | 'nao-encontrada';
  title?: string;
}

const ROUTES: SimRoute[] = [
  { id: 'vazia', path: '', code: "{ path: '', pathMatch: 'full', redirectTo: 'paises' }", redirectTo: 'paises' },
  { id: 'paises', path: 'paises', code: "{ path: 'paises', component: CountriesPage }", page: 'paises', title: 'Países · Passaporte' },
  { id: 'sobre', path: 'sobre', code: "{ path: 'sobre', component: AboutPage }", page: 'sobre', title: 'Sobre · Passaporte' },
  { id: 'coringa', path: '**', code: "{ path: '**', component: NotFoundPage }", page: 'nao-encontrada', title: 'Página não encontrada · Passaporte' },
];

/** Simulador do capítulo 23: um navegador em miniatura, com a tabela de rotas acendendo a rota escolhida. */
@Component({
  selector: 'vm-router-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O Router por dentro</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Digite um endereço ou clique nos links. O Router lê as rotas de cima para baixo e fica com a primeira que combina.
        </span>
      </figcaption>

      <div class="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div class="overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-sm">
          <div class="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
            <span data-tab class="truncate rounded-t-lg border border-b-0 border-line bg-surface-raised px-3 py-1 text-xs font-bold text-ink">{{ title() }}</span>
            <span data-reloads class="ml-auto shrink-0 text-xs text-ink-muted">recarregamentos: {{ reloads() }}</span>
          </div>
          <form class="flex gap-2 border-b border-line px-3 py-2" (submit)="$event.preventDefault(); navigate(draft(), false)">
            <label class="sr-only" for="vm-router-sim-url">Endereço</label>
            <span data-address class="sr-only">{{ url() }}</span>
            <input
              id="vm-router-sim-url"
              type="text"
              class="min-w-0 flex-1 rounded-full border border-line bg-surface px-3 py-1 font-mono text-sm text-ink"
              [value]="draft()"
              (input)="draft.set($any($event.target).value)"
            />
            <button type="submit" class="rounded-full bg-primary px-3 py-1 text-sm font-bold text-on-primary">Ir</button>
          </form>

          <div class="flex items-center justify-between bg-primary px-3 py-2 text-sm text-on-primary">
            <strong>🌐 Passaporte</strong>
            <span class="flex gap-3">
              @for (link of links; track link.path) {
                <button type="button" class="underline-offset-2 hover:underline" [class.font-extrabold]="url() === link.path" (click)="follow(link.path)">{{ link.label }}</button>
              }
            </span>
          </div>

          <div data-page class="min-h-36 p-4 text-ink">
            @switch (page()) {
              @case ('paises') {
                <p class="font-extrabold">🌍 Países</p>
                <p data-state class="mt-1 text-sm text-ink-muted">{{ visited() }} visitado{{ visited() === 1 ? '' : 's' }} nesta sessão</p>
                <button type="button" class="mt-2 rounded-full border border-line px-3 py-1 text-sm font-bold" (click)="visited.update((v) => v + 1)">Visitar</button>
              }
              @case ('sobre') {
                <p class="font-extrabold">Sobre o Passaporte</p>
                <p class="mt-1 text-sm text-ink-muted">O app que guarda os países que você visitou.</p>
              }
              @default {
                <p class="font-extrabold">🧭 Esta página não existe</p>
                <p class="mt-1 text-sm text-ink-muted">O endereço não combinou com nenhuma rota de verdade.</p>
              }
            }
          </div>
        </div>

        <div class="flex flex-col gap-3 text-ink">
          <ol class="flex flex-col gap-1.5">
            @for (route of routes(); track route.id) {
              <li
                [attr.data-route]="route.id"
                [attr.data-matched]="matched()?.id === route.id"
                class="rounded-lg border px-2 py-1.5 font-mono text-xs"
                [class]="matched()?.id === route.id ? 'border-challenge bg-challenge/10 font-bold' : redirectedFrom()?.id === route.id ? 'border-inside bg-inside/8' : 'border-line bg-surface-raised'"
              >
                {{ route.code }}
              </li>
            }
          </ol>
          <ol data-log class="flex flex-col gap-1 rounded-xl bg-terminal p-3 font-mono text-xs text-terminal-ink">
            @for (line of log(); track $index) {
              <li>{{ line }}</li>
            }
          </ol>
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" class="size-4 accent-challenge" [checked]="useHref()" (change)="useHref.set(!useHref())" />
            Links com <code class="font-mono">href</code> em vez de <code class="font-mono">routerLink</code>
          </label>
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" class="size-4 accent-challenge" [checked]="wildcardFirst()" (change)="wildcardFirst.set(!wildcardFirst())" />
            Pôr a rota <code class="font-mono">**</code> em primeiro lugar
          </label>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class RouterSim {
  protected readonly links = [
    { path: '/paises', label: 'Países' },
    { path: '/sobre', label: 'Sobre' },
  ];
  protected readonly url = signal('/paises');
  protected readonly draft = signal('/paises');
  protected readonly visited = signal(0);
  protected readonly reloads = signal(0);
  protected readonly useHref = signal(false);
  protected readonly wildcardFirst = signal(false);
  protected readonly log = signal<string[]>(["'paises' combinou com a rota { path: 'paises' }"]);
  protected readonly redirectedFrom = signal<SimRoute | null>(null);

  protected readonly routes = computed(() =>
    this.wildcardFirst() ? [ROUTES[3], ...ROUTES.slice(0, 3)] : ROUTES,
  );

  protected readonly matched = computed(() => this.match(this.url().replace(/^\//, '')));
  protected readonly page = computed(() => this.matched()?.page ?? 'nao-encontrada');
  protected readonly title = computed(() => this.matched()?.title ?? 'Passaporte');
  protected readonly announcement = computed(() => `Endereço ${this.url()}. Aba: ${this.title()}.`);

  /** Um clique num link do cabeçalho: com routerLink, só a tela troca; com href, a página inteira recarrega. */
  protected follow(path: string): void {
    this.navigate(path, this.useHref());
  }

  protected navigate(target: string, reload: boolean): void {
    const path = target.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    const lines: string[] = [];
    if (reload) {
      this.reloads.update((n) => n + 1);
      this.visited.set(0);
      lines.push('href: o navegador pede a página de novo ao servidor', 'o app recomeça do zero: os dados da memória somem');
    }
    let route = this.match(path);
    this.redirectedFrom.set(null);
    if (route?.redirectTo !== undefined) {
      lines.push(`'${path}' combinou com { path: '${route.path}' }, que tem redirectTo: '${route.redirectTo}'`);
      this.redirectedFrom.set(route);
      route = this.match(route.redirectTo);
    }
    const finalPath = this.redirectedFrom() ? this.redirectedFrom()!.redirectTo! : path;
    lines.push(`'${finalPath}' combinou com a rota { path: '${route?.path}' }`);
    if (!reload) lines.push('routerLink: só o conteúdo do <router-outlet> troca');
    this.url.set('/' + finalPath);
    this.draft.set('/' + finalPath);
    this.log.set(lines);
  }

  private match(path: string): SimRoute | undefined {
    return this.routes().find((route) => route.path === '**' || route.path === path);
  }
}
