import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

const BREAKPOINTS = [
  { name: 'sm', min: 640 },
  { name: 'md', min: 768 },
  { name: 'lg', min: 1024 },
  { name: 'xl', min: 1280 },
];

const PRESETS = [
  { label: '📱 Celular', width: 390 },
  { label: '📟 Tablet', width: 820 },
  { label: '💻 Computador', width: 1280 },
];

const MIN = 320;
const MAX = 1440;

/** Simulador do capítulo 20: arraste a largura da tela e veja quais prefixos valem e como o Passaporte se reorganiza. */
@Component({
  selector: 'vm-viewport-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A tela que estica</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Arraste a largura da tela. Cada prefixo do Tailwind liga quando a tela alcança o tamanho dele, e continua ligado daí para cima.
        </span>
      </figcaption>

      <div class="flex flex-wrap items-center gap-2">
        @for (preset of presets; track preset.width) {
          <button
            type="button"
            class="rounded-full border px-3 py-1 text-sm font-bold"
            [class]="width() === preset.width ? 'border-challenge bg-challenge text-on-primary' : 'border-line bg-surface-raised text-ink'"
            (click)="width.set(preset.width)"
          >
            {{ preset.label }}
          </button>
        }
      </div>

      <label class="mt-4 block text-ink">
        <span class="font-extrabold">Largura da tela: {{ width() }} px</span>
        <input
          type="range"
          class="mt-1 block w-full accent-challenge"
          [min]="min"
          [max]="max"
          step="10"
          [value]="width()"
          (input)="width.set(+$any($event.target).value)"
        />
      </label>

      <div class="relative mt-1 h-6 text-xs font-bold text-ink-muted" aria-hidden="true">
        @for (point of breakpoints; track point.name) {
          <span
            class="absolute -translate-x-1/2 border-l border-line pl-1"
            [class.text-challenge]="width() >= point.min"
            [style.left.%]="position(point.min)"
          >
            {{ point.name }}
          </span>
        }
      </div>

      <p data-breakpoint class="mt-2 font-mono text-sm text-ink">
        Prefixos ligados: <strong>sem prefixo</strong>
        @for (name of active(); track name) {
          + <strong class="text-challenge">{{ name }}:</strong>
        }
      </p>

      <div class="mt-4 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div class="overflow-hidden rounded-2xl border border-line bg-surface p-2">
          <div
            data-mock
            [attr.data-columns]="pageColumns()"
            [attr.data-menu]="menu()"
            [attr.data-list-columns]="listColumns()"
            [attr.data-featured]="featured()"
            class="min-w-36 rounded-xl border-2 border-ink/30 bg-surface-raised transition-[width] duration-200"
            [style.width.%]="(width() / max) * 100"
          >
            <div class="flex items-center justify-between rounded-t-[10px] bg-primary px-2 py-1.5 text-on-primary">
              <span class="h-2 w-10 rounded-full bg-highlight"></span>
              @if (menu() === 'botao') {
                <span class="text-xs font-bold">☰</span>
              } @else {
                <span class="flex gap-1"><span class="h-1.5 w-6 rounded-full bg-on-primary/70"></span><span class="h-1.5 w-8 rounded-full bg-on-primary/70"></span></span>
              }
            </div>
            <div class="grid gap-1.5 p-1.5" [class]="pageColumns() === 2 ? 'grid-cols-[2fr_3fr]' : 'grid-cols-1'">
              <div class="flex flex-col gap-1.5">
                <div class="h-8 rounded-md bg-primary"></div>
                <div class="flex gap-1 rounded-md border border-highlight p-1" [class]="featured() === 'linha' ? 'flex-row items-center' : 'flex-col'">
                  <span class="h-3 w-4 shrink-0 rounded-sm bg-stamp/70"></span>
                  <span class="flex flex-1 flex-col gap-0.5"><span class="h-1.5 w-full rounded-full bg-ink/30"></span><span class="h-1.5 w-2/3 rounded-full bg-ink/20"></span></span>
                </div>
              </div>
              <div class="grid gap-1 rounded-md border border-line p-1" [class]="listColumns() === 2 ? 'grid-cols-2' : 'grid-cols-1'">
                @for (item of [1, 2, 3, 4]; track item) {
                  <span class="h-3 rounded-sm border border-line bg-surface"></span>
                }
              </div>
            </div>
          </div>
        </div>

        <ul class="flex flex-col gap-2 text-sm text-ink">
          @for (rule of rules(); track rule.name) {
            <li [attr.data-rule]="rule.name" class="rounded-xl border border-line bg-surface-raised px-3 py-2">
              <code class="block font-mono text-xs text-ink-muted">{{ rule.code }}</code>
              <span [class.font-bold]="rule.changed">{{ rule.effect }}</span>
            </li>
          }
        </ul>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ViewportLab {
  protected readonly presets = PRESETS;
  protected readonly breakpoints = BREAKPOINTS;
  protected readonly min = MIN;
  protected readonly max = MAX;
  protected readonly width = signal(390);

  protected readonly active = computed(() => BREAKPOINTS.filter((point) => this.width() >= point.min).map((point) => point.name));
  private readonly from = (name: string) => this.active().includes(name);

  protected readonly pageColumns = computed(() => (this.from('md') ? 2 : 1));
  protected readonly menu = computed(() => (this.from('md') ? 'links' : 'botao'));
  protected readonly listColumns = computed(() => (this.from('sm') && !this.from('md') ? 2 : 1));
  protected readonly featured = computed(() => (this.from('lg') ? 'linha' : 'coluna'));

  protected readonly rules = computed(() => [
    {
      name: 'pagina',
      code: 'grid md:grid-cols-[2fr_3fr]',
      effect: this.pageColumns() === 2 ? 'Página em duas colunas: placar e destaque à esquerda, lista à direita.' : 'Página em uma coluna: um bloco embaixo do outro.',
      changed: this.pageColumns() === 2,
    },
    {
      name: 'menu',
      code: 'md:hidden (botão) · hidden md:flex (links)',
      effect: this.menu() === 'links' ? 'O botão ☰ some; os links aparecem lado a lado.' : 'O botão ☰ aparece; os links ficam escondidos atrás dele.',
      changed: this.menu() === 'links',
    },
    {
      name: 'lista',
      code: 'grid sm:grid-cols-2 md:grid-cols-1',
      effect:
        this.listColumns() === 2
          ? 'Lista em duas colunas: a tela inteira é dela.'
          : this.from('md')
            ? 'Lista volta a uma coluna: agora ela divide a tela com o placar.'
            : 'Lista em uma coluna.',
      changed: this.from('sm'),
    },
    {
      name: 'destaque',
      code: '@media (min-width: 64rem)',
      effect: this.featured() === 'linha' ? 'No destaque, a bandeira fica ao lado do texto.' : 'No destaque, a bandeira fica em cima do texto.',
      changed: this.featured() === 'linha',
    },
  ]);

  protected readonly announcement = computed(() => {
    const names = this.active();
    return `${this.width()} pixels. ${names.length ? `Prefixos ligados: ${names.join(', ')}.` : 'Só as classes sem prefixo valem.'}`;
  });

  protected position(width: number): number {
    return ((width - MIN) / (MAX - MIN)) * 100;
  }
}
