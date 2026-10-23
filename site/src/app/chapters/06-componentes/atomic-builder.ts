import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Piece = 'logo' | 'link' | 'menu' | 'header' | 'flag' | 'name' | 'capital' | 'card' | 'list' | 'footer';
type LevelId = 'atoms' | 'molecules' | 'organisms' | 'template' | 'page';

export const LEVELS: { id: LevelId; label: string; pieces: Piece[]; about: string; tree: string }[] = [
  {
    id: 'atoms',
    label: 'Átomos',
    pieces: ['logo', 'link', 'flag', 'name', 'capital'],
    about: 'Átomos: as peças que não dá para dividir mais. Uma bandeira, um nome, um link. Sozinhas, quase não dizem nada.',
    tree: 'bandeira · nome · capital · logo · link',
  },
  {
    id: 'molecules',
    label: 'Moléculas',
    pieces: ['card', 'menu'],
    about: 'Moléculas: átomos juntos com um propósito. Bandeira, nome e capital viram o cartão de um país; dois links viram o menu.',
    tree: 'cartão de país = bandeira + nome + capital\nmenu = link + link',
  },
  {
    id: 'organisms',
    label: 'Organismos',
    pieces: ['header', 'list', 'footer'],
    about: 'Organismos: partes inteiras da tela, feitas de moléculas e átomos. No Passaporte, cada uma virou um componente Angular.',
    tree: 'App\n├── Header       (logo + menu)\n├── CountryList  (cartões de país)\n└── Footer',
  },
  {
    id: 'template',
    label: 'Template',
    pieces: [],
    about: 'Template: o esqueleto da tela, com os organismos no lugar, mas sem os dados de verdade. Mostra só a estrutura.',
    tree: 'cabeçalho\nárea principal: lista de ___\nrodapé',
  },
  {
    id: 'page',
    label: 'Página',
    pieces: [],
    about: 'Página: o template com os dados reais. É o que a pessoa vê: Brasil, Japão e Portugal na lista.',
    tree: 'a tela pronta, com dados',
  },
];

const COUNTRIES = [
  { flag: '🇧🇷', name: 'Brasil', capital: 'Brasília' },
  { flag: '🇯🇵', name: 'Japão', capital: 'Tóquio' },
  { flag: '🇵🇹', name: 'Portugal', capital: 'Lisboa' },
];

const ON = 'outline outline-3 outline-offset-2 outline-highlight bg-highlight/20 motion-safe:transition-all';

/** Simulador do capítulo 6: a tela do Passaporte desmontada em átomos, moléculas, organismos, template e página. */
@Component({
  selector: 'vm-atomic-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A química da tela</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha um nível e veja quais partes da tela do Passaporte pertencem a ele.
        </span>
      </figcaption>

      <div data-levels class="flex flex-wrap gap-2" role="group" aria-label="Níveis do Atomic Design">
        @for (level of levels; track level.id; let i = $index) {
          <button
            type="button"
            class="rounded-full border-2 px-4 py-1.5 text-sm font-bold"
            [class]="current().id === level.id ? 'border-challenge bg-challenge text-on-primary' : 'border-line bg-surface-raised text-ink hover:border-challenge/60'"
            [attr.aria-pressed]="current().id === level.id"
            (click)="select(level.id)"
          >
            {{ i + 1 }}. {{ level.label }}
          </button>
        }
      </div>

      <div class="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div data-screen class="overflow-hidden rounded-2xl border border-line bg-surface text-sm" aria-hidden="true">
          <div data-piece="header" [attr.data-active]="on('header')" [class]="cls('header')" class="flex items-center justify-between bg-primary px-4 py-3 text-on-primary">
            <span data-piece="logo" [attr.data-active]="on('logo')" [class]="cls('logo')" class="rounded font-extrabold">🛂 Passaporte</span>
            <span data-piece="menu" [attr.data-active]="on('menu')" [class]="cls('menu')" class="flex gap-3 rounded">
              <span data-piece="link" [attr.data-active]="on('link')" [class]="cls('link')" class="rounded text-on-primary-muted underline">Países</span>
              <span data-piece="link" [attr.data-active]="on('link')" [class]="cls('link')" class="rounded text-on-primary-muted underline">Meu passaporte</span>
            </span>
          </div>
          <div data-piece="list" [attr.data-active]="on('list')" [class]="cls('list')" class="m-3 flex flex-col gap-2 rounded-xl p-2">
            <span class="font-extrabold text-ink">{{ isTemplate() ? 'Lista de ___' : 'Países' }}</span>
            @for (country of countries; track country.name) {
              <span data-piece="card" [attr.data-active]="on('card')" [class]="cls('card')" class="flex items-center gap-3 rounded-xl border border-line bg-surface-raised px-3 py-2">
                @if (isTemplate()) {
                  <span class="h-5 w-7 rounded bg-line"></span>
                  <span class="h-3 w-20 rounded bg-line"></span>
                  <span class="ml-auto h-3 w-14 rounded bg-line"></span>
                } @else {
                  <span data-piece="flag" [attr.data-active]="on('flag')" [class]="cls('flag')" class="rounded text-xl">{{ country.flag }}</span>
                  <span data-piece="name" [attr.data-active]="on('name')" [class]="cls('name')" class="rounded font-bold text-ink">{{ country.name }}</span>
                  <span data-piece="capital" [attr.data-active]="on('capital')" [class]="cls('capital')" class="ml-auto rounded text-ink-muted">{{ country.capital }}</span>
                }
              </span>
            }
          </div>
          <div data-piece="footer" [attr.data-active]="on('footer')" [class]="cls('footer')" class="px-4 py-2 text-center text-xs text-ink-muted">
            {{ isTemplate() ? '___' : 'Passaporte · 195 países para conhecer' }}
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <p class="rounded-2xl bg-surface-raised p-4 text-ink">{{ current().about }}</p>
          <pre data-tree class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-sm leading-relaxed text-terminal-ink">{{ current().tree }}</pre>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ current().about }}</p>
    </figure>
  `,
})
export class AtomicBuilder {
  protected readonly levels = LEVELS;
  protected readonly countries = COUNTRIES;
  private readonly selected = signal<LevelId>('page');
  protected readonly current = computed(() => LEVELS.find((level) => level.id === this.selected())!);
  protected readonly isTemplate = computed(() => this.selected() === 'template');

  protected select(id: LevelId): void {
    this.selected.set(id);
  }

  protected on(piece: Piece): '' | null {
    return this.current().pieces.includes(piece) ? '' : null;
  }

  protected cls(piece: Piece): string {
    return this.current().pieces.includes(piece) ? ON : '';
  }
}
