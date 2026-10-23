import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type LayerId = 'livro' | 'grade' | 'cartao' | 'carimbo' | 'nome';

interface Layer {
  id: LayerId;
  name: string;
  depth: number;
  figmaType: string;
  /** Átomo, molécula, organismo, ou nada quando a camada não vira componente. */
  kind: string | null;
  component: string | null;
  figma: [string, string][];
  tokens: [string, string][];
  classes: string;
  note: string;
}

const LAYERS: Layer[] = [
  {
    id: 'livro',
    name: 'Livro de carimbos',
    depth: 0,
    figmaType: 'Instância do componente Painel',
    kind: 'organismo',
    component: 'StampBook',
    figma: [
      ['Auto layout', 'vertical · espaço 16 · margem 20'],
      ['Preenchimento', '#FFFFFF'],
      ['Borda', '1 px #E7E1D3'],
      ['Cantos', '12'],
    ],
    tokens: [
      ['#FFFFFF', '--color-card'],
      ['#E7E1D3', '--color-line'],
      ['12', '--radius-card'],
    ],
    classes: '(as do Panel, que já existe)',
    note: 'O protótipo usa uma instância do Painel: no código, o StampBook reaproveita o Panel do capítulo 17 com ng-content.',
  },
  {
    id: 'grade',
    name: 'Grade',
    depth: 1,
    figmaType: 'Frame',
    kind: null,
    component: null,
    figma: [['Auto layout', 'grade · 3 colunas · espaço 12']],
    tokens: [],
    classes: 'grid grid-cols-3 gap-3',
    note: 'Esta camada não vira componente: é só a arrumação dos cartões, e fica no template do StampBook.',
  },
  {
    id: 'cartao',
    name: 'Cartão de carimbo',
    depth: 2,
    figmaType: 'Componente',
    kind: 'molécula',
    component: 'StampCard',
    figma: [
      ['Auto layout', 'vertical · centro · espaço 8 · margem 12'],
      ['Preenchimento', '#FBF8F1'],
      ['Cantos', '12'],
    ],
    tokens: [
      ['#FBF8F1', '--color-surface'],
      ['12', '--radius-card'],
    ],
    classes: 'flex flex-col items-center gap-2 rounded-card bg-surface p-3',
    note: 'Auto layout vertical é um flex em coluna. O espaço vira gap, a margem vira padding: 8 px é gap-2, 12 px é p-3.',
  },
  {
    id: 'carimbo',
    name: 'Carimbo',
    depth: 3,
    figmaType: 'Componente com a variante "Carimbado"',
    kind: 'átomo',
    component: 'Stamp',
    figma: [
      ['Tamanho', '64 × 64'],
      ['Cantos', '9999 (círculo)'],
      ['Borda', '2 px tracejada #C8102E'],
      ['Rotação', '-8°'],
      ['Texto', 'Courier New · negrito · 14'],
    ],
    tokens: [
      ['#C8102E', '--color-stamp'],
      ['Courier New', '--font-stamp (token novo)'],
    ],
    classes: 'size-16 rounded-full border-2 border-dashed border-stamp -rotate-8 font-stamp text-sm font-bold text-stamp',
    note: 'A variante do Figma vira um input: o mesmo componente, com duas aparências.',
  },
  {
    id: 'nome',
    name: 'Nome do país',
    depth: 3,
    figmaType: 'Texto',
    kind: null,
    component: null,
    figma: [
      ['Texto', 'negrito · 14'],
      ['Cor', '#1E2430'],
    ],
    tokens: [['#1E2430', '--color-ink']],
    classes: 'text-sm font-bold text-ink',
    note: 'Um texto solto não vira componente: é um <strong> dentro do StampCard, com o nome vindo do input.',
  },
];

const SAMPLE = [
  { code: 'BR', name: 'Brasil' },
  { code: 'JP', name: 'Japão' },
  { code: 'PT', name: 'Portugal' },
];

/** Simulador do capítulo 21: um protótipo com camadas, e a tradução de cada camada para Angular e Tailwind. */
@Component({
  selector: 'vm-proto-inspector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Do Figma para o código</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha uma camada do protótipo. À esquerda, o que o Figma mostra no painel de inspeção; à direita, o que isso vira no Angular.
        </span>
      </figcaption>

      <div class="grid gap-4 lg:grid-cols-[13rem_1fr]">
        <nav aria-label="Camadas do protótipo" class="rounded-2xl border border-line bg-surface-raised p-2">
          <p class="px-2 pb-1 text-xs font-extrabold uppercase tracking-wider text-ink-muted">Camadas</p>
          @for (layer of layers; track layer.id) {
            <button
              type="button"
              [attr.data-layer]="layer.id"
              [attr.aria-pressed]="selected().id === layer.id"
              class="flex w-full items-center gap-1.5 rounded-lg py-1 pr-2 text-left text-sm"
              [class]="selected().id === layer.id ? 'bg-inside font-bold text-on-primary' : 'text-ink hover:bg-inside/10'"
              [style.padding-left.rem]="0.5 + layer.depth * 0.75"
              (click)="selectedId.set(layer.id)"
            >
              <span aria-hidden="true">{{ layer.component ? '◆' : layer.figmaType === 'Texto' ? 'T' : '#' }}</span>
              {{ layer.name }}
            </button>
          }
        </nav>

        <div
          class="flex items-center justify-center rounded-2xl border border-line p-4"
          style="background-color: var(--color-surface); background-image: radial-gradient(var(--color-line) 1px, transparent 1px); background-size: 14px 14px"
          aria-hidden="true"
        >
          <div class="w-full max-w-sm rounded-xl border border-line bg-surface-raised p-4" [class]="ring('livro')">
            <p class="mb-3 border-b border-line pb-2 font-extrabold text-ink">🛂 Meus carimbos</p>
            <div class="grid grid-cols-3 gap-2 rounded-lg" [class]="ring('grade')">
              @for (country of sample; track country.code; let first = $first) {
                <div class="flex flex-col items-center gap-1.5 rounded-lg bg-surface p-2" [class]="first ? ring('cartao') : ''">
                  @let isStamped = first ? stamped() : country.code !== 'JP';
                  <span
                    [attr.data-stamp-preview]="first ? '' : null"
                    [attr.data-stamped]="isStamped"
                    class="flex size-12 items-center justify-center rounded-full border-2 border-dashed font-mono text-xs font-bold"
                    [class]="(isStamped ? 'border-stamp text-stamp -rotate-8 ' : 'border-line text-ink-muted ') + (first ? ring('carimbo') : '')"
                  >
                    {{ isStamped ? country.code : '?' }}
                  </span>
                  <strong class="text-xs text-ink" [class]="first ? ring('nome') : ''">{{ country.name }}</strong>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <p class="text-xs font-extrabold uppercase tracking-wider text-ink-muted">No Figma</p>
          <p class="mt-1 font-extrabold">{{ selected().name }}</p>
          <p class="text-sm text-ink-muted">{{ selected().figmaType }}</p>
          <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            @for (row of selected().figma; track row[0]) {
              <dt class="font-bold">{{ row[0] }}</dt>
              <dd>{{ row[1] }}</dd>
            }
          </dl>
          @if (selected().id === 'carimbo') {
            <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Variante Carimbado">
              <button type="button" class="rounded-full border px-3 py-1 text-sm font-bold" [class]="variantClass(true)" (click)="stamped.set(true)">Carimbado: sim</button>
              <button type="button" class="rounded-full border px-3 py-1 text-sm font-bold" [class]="variantClass(false)" (click)="stamped.set(false)">Carimbado: não</button>
            </div>
          }
          @if (selected().tokens.length) {
            <ul data-tokens class="mt-3 flex flex-col gap-1 text-sm">
              @for (token of selected().tokens; track token[0]) {
                <li><code class="font-mono">{{ token[0] }}</code> → <code class="font-mono font-bold text-inside">{{ token[1] }}</code></li>
              }
            </ul>
          }
        </div>

        <div data-angular class="rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <p class="text-xs font-extrabold uppercase tracking-wider text-ink-muted">No Angular</p>
          @if (selected().component) {
            <p class="mt-1 font-extrabold">
              {{ selected().component }}
              <span class="ml-1 rounded-full bg-inside/12 px-2 py-0.5 text-xs text-inside">{{ selected().kind }}</span>
            </p>
          } @else {
            <p class="mt-1 font-extrabold">Esta camada não vira componente</p>
          }
          <pre class="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-terminal p-3 font-mono text-xs leading-relaxed text-terminal-ink">{{ code() }}</pre>
          <p class="mt-3 text-sm">{{ selected().note }}</p>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ProtoInspector {
  protected readonly layers = LAYERS;
  protected readonly sample = SAMPLE;
  protected readonly selectedId = signal<LayerId>('livro');
  protected readonly stamped = signal(true);

  protected readonly selected = computed(() => LAYERS.find((layer) => layer.id === this.selectedId())!);

  protected readonly code = computed(() => {
    const layer = this.selected();
    if (layer.id === 'livro') return '<app-stamp-book [countries]="countries()" />';
    if (layer.id === 'carimbo') return `<app-stamp [code]="'BR'" [stamped]="${this.stamped()}" />\n\nclass="${layer.classes}"`;
    if (layer.id === 'cartao') return `<app-stamp-card [country]="country" />\n\nclass="${layer.classes}"`;
    return `class="${layer.classes}"`;
  });

  protected readonly announcement = computed(() => {
    const layer = this.selected();
    return layer.component ? `${layer.name}: vira o componente ${layer.component}, um ${layer.kind}.` : `${layer.name}: não vira componente.`;
  });

  protected ring(id: LayerId): string {
    return this.selectedId() === id ? 'ring-2 ring-inside ring-offset-2 ring-offset-surface' : '';
  }

  protected variantClass(value: boolean): string {
    return this.stamped() === value ? 'border-inside bg-inside text-on-primary' : 'border-line bg-surface text-ink';
  }
}
