import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Version = 'before' | 'after';
type Mode = 'tab' | 'headings';

/**
 * O que a árvore de acessibilidade do Chrome entrega ao leitor de tela, na tela de países do Passaporte, antes e depois
 * do capítulo 44 (conferido nas etapas 43 e 44). Cada item é "nome, papel, estado", como um leitor de tela costuma dizer.
 */
const TAB: Record<Version, string[]> = {
  before: [
    'Buscar país, caixa de pesquisa',
    'Todos, botão',
    'Visitados, botão',
    'Desejados, botão',
    'Afeganistão, link',
    'Visitar, botão',
    'Remover Afeganistão, botão',
    'África do Sul, link',
    'Visitar, botão',
  ],
  after: [
    'Buscar país, caixa de pesquisa',
    'Filtrar países, lista. Todos, opção, selecionada, 1 de 3 (as setas trocam o filtro)',
    'Afeganistão, link',
    'Visitar Afeganistão, botão',
    'Remover Afeganistão, botão',
    'África do Sul, link',
    'Visitar África do Sul, botão',
  ],
};

const HEADINGS: Record<Version, string[]> = {
  before: ['Japão, título nível 2', '(nenhum outro título na página)'],
  after: ['Países, título nível 1', 'Japão, título nível 2', 'Países, título nível 2'],
};

const SEARCH: Record<Version, string> = {
  before: '(silêncio: a lista muda na tela, e nada é anunciado)',
  after: '1 de 195 países',
};

/** Simulador do capítulo 44: a mesma tela, ouvida em vez de vista. */
@Component({
  selector: 'vm-screen-reader-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A tela de países, sem enxergar a tela</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          O que o leitor de tela recebe da tela de países: nomes, papéis e estados, tirados da árvore de acessibilidade do
          Chrome nas etapas do Passaporte. Navegue com o Tab, ou de título em título, como quem usa um leitor de tela.
        </span>
      </figcaption>

      <fieldset class="flex flex-wrap gap-4 text-ink">
        <legend class="mb-1 text-sm font-bold">O Passaporte</legend>
        <label class="flex items-center gap-2">
          <input type="radio" name="sim-version" value="before" [checked]="version() === 'before'" (change)="choose('before')" />
          Antes deste capítulo
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" name="sim-version" value="after" [checked]="version() === 'after'" (change)="choose('after')" />
          Depois deste capítulo
        </label>
      </fieldset>

      <div class="mt-3 flex flex-wrap gap-2">
        <button type="button" class="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="next('tab')">Tab</button>
        <button type="button" class="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary" (click)="next('headings')">Próximo título</button>
        <button type="button" class="rounded-full border border-line px-4 py-1.5 text-sm font-bold text-ink" (click)="search()">Digitar "afe" na busca</button>
      </div>

      <ol data-heard class="mt-4 flex min-h-24 flex-col gap-1 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        @for (line of heard(); track $index) {
          <li><span aria-hidden="true">🔊 </span>{{ line }}</li>
        } @empty {
          <li>(aperte Tab)</li>
        }
      </ol>
      <p data-announce aria-live="polite" class="sr-only">{{ last() }}</p>
    </figure>
  `,
})
export class ScreenReaderSim {
  protected readonly version = signal<Version>('before');
  protected readonly heard = signal<string[]>([]);
  protected readonly last = computed(() => this.heard().at(-1) ?? '');
  private readonly position: Record<Mode, number> = { tab: 0, headings: 0 };

  protected choose(version: Version): void {
    this.version.set(version);
    this.position.tab = 0;
    this.position.headings = 0;
    this.heard.set([]);
  }

  protected next(mode: Mode): void {
    const list = mode === 'tab' ? TAB[this.version()] : HEADINGS[this.version()];
    const item = list[this.position[mode] % list.length];
    this.position[mode]++;
    this.heard.update((lines) => [...lines, item].slice(-6));
  }

  protected search(): void {
    this.heard.update((lines) => [...lines, SEARCH[this.version()]].slice(-6));
  }
}
