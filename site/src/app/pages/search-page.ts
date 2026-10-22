import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, input, linkedSignal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SearchHit, SearchService } from '../search/search';

const TYPING_PAUSE_MS = 250;

@Component({
  selector: 'vm-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-12 sm:px-8">
      <h1 class="text-4xl font-extrabold sm:text-5xl">Buscar no livro</h1>
      <form role="search" class="mt-6" (submit)="$event.preventDefault(); run(query())">
        <label for="campo-busca" class="mb-2 block font-bold text-ink-muted">O que você procura?</label>
        <div class="flex items-center gap-3 rounded-2xl border-2 border-line bg-surface-raised px-4 focus-within:border-link">
          <svg aria-hidden="true" viewBox="0 0 24 24" class="size-6 shrink-0 text-ink-muted" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="campo-busca"
            type="search"
            autocomplete="off"
            placeholder="signals, rotas, formulário, deploy…"
            class="w-full bg-transparent py-4 text-lg text-ink outline-none placeholder:text-ink-muted"
            [value]="query()"
            (input)="typed($any($event.target).value)"
          />
        </div>
      </form>

      <div aria-live="polite" class="mt-8">
        @if (search.available() === false) {
          <p class="rounded-2xl border border-line bg-surface-raised p-5 text-ink-muted">
            A busca funciona no site publicado. Aqui, no ambiente de desenvolvimento, o índice da busca ainda não foi gerado:
            rode <code class="font-mono">npm run build</code> para criá-lo.
          </p>
        } @else if (searched() && !hits().length) {
          <p class="rounded-2xl border border-line bg-surface-raised p-5">
            Nada encontrado para “{{ searched() }}”. Tente outra palavra ou veja o <a routerLink="/glossario">glossário</a>.
          </p>
        } @else if (hits().length) {
          <p class="mb-4 text-sm font-bold text-ink-muted">
            {{ hits().length }} {{ hits().length === 1 ? 'resultado' : 'resultados' }} para “{{ searched() }}”
          </p>
        }
      </div>

      @if (hits().length) {
        <ol class="flex flex-col gap-3">
          @for (hit of hits(); track hit.path) {
            <li>
              <a [routerLink]="hit.path" class="block rounded-2xl border border-line bg-surface-raised p-5 no-underline hover:border-link">
                <span class="block text-lg font-extrabold text-ink">{{ hit.title }}</span>
                <span class="mt-1 block text-ink-muted [&_mark]:rounded [&_mark]:bg-highlight/35 [&_mark]:px-0.5 [&_mark]:text-ink" [innerHTML]="hit.excerpt"></span>
              </a>
            </li>
          }
        </ol>
      }
    </div>
  `,
})
export class SearchPage {
  private readonly router = inject(Router);
  protected readonly search = inject(SearchService);

  /** O termo vindo da URL (?q=), para links de busca poderem ser compartilhados. */
  readonly q = input<string>();

  protected readonly query = linkedSignal(() => this.q() ?? '');
  protected readonly hits = signal<SearchHit[]>([]);
  protected readonly searched = signal('');
  private timer: ReturnType<typeof setTimeout> | undefined;
  private latest = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    afterNextRender(() => {
      if (this.query()) void this.run(this.query());
    });
  }

  protected typed(value: string): void {
    this.query.set(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      void this.router.navigate([], { queryParams: { q: value || null }, replaceUrl: true });
      void this.run(value);
    }, TYPING_PAUSE_MS);
  }

  protected async run(value: string): Promise<void> {
    const request = ++this.latest;
    const hits = await this.search.search(value);
    // Respostas que chegam fora de ordem (quem digita rápido) são descartadas.
    if (request !== this.latest) return;
    this.hits.set(hits);
    this.searched.set(value.trim());
  }
}
