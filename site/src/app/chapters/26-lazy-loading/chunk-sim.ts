import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Mode = 'eager' | 'lazy' | 'preload';
type Page = 'paises' | 'pais' | 'sobre';

/** Tamanhos medidos com ng build nas etapas 25 (tudo no main) e 26 (sob demanda) do Passaporte. */
const EAGER = [
  { name: 'main', size: 277.44 },
  { name: 'styles', size: 14.14 },
];
const LAZY_START = [
  { name: 'main', size: 257.99 },
  { name: 'styles', size: 14.14 },
];
const PAGE_CHUNKS: Record<Page, { name: string; size: number }[]> = {
  paises: [
    { name: 'countries-page', size: 16.34 },
    { name: 'countries.ts', size: 0.97 },
  ],
  pais: [
    { name: 'country-routes', size: 5.29 },
    { name: 'countries.ts', size: 0.97 },
  ],
  sobre: [{ name: 'about-page', size: 0.81 }],
};

interface Download {
  name: string;
  size: number;
  when: string;
}

/** Simulador do capítulo 26: o que o navegador baixa ao abrir o app e a cada tela, com e sem lazy loading. */
@Component({
  selector: 'vm-chunk-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O que o navegador baixa</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Os tamanhos são os do build de verdade do Passaporte. Escolha o modo, navegue pelas telas e veja cada arquivo chegar.
        </span>
      </figcaption>

      <div class="flex flex-wrap gap-2" role="group" aria-label="Modo de carregamento">
        @for (option of modes; track option.value) {
          <button
            type="button"
            class="rounded-full border px-3 py-1 text-sm font-bold"
            [class]="mode() === option.value ? 'border-challenge bg-challenge text-on-primary' : 'border-line bg-surface-raised text-ink'"
            [attr.aria-pressed]="mode() === option.value"
            (click)="start(option.value)"
          >{{ option.label }}</button>
        }
      </div>

      <div class="mt-4 grid gap-5 lg:grid-cols-[16rem_1fr]">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-bold text-ink">Navegar para:</p>
          @for (page of pages; track page.value) {
            <button
              type="button"
              class="rounded-xl border-2 px-3 py-2 text-left font-bold"
              [class]="current() === page.value ? 'border-highlight bg-surface-raised text-ink' : 'border-line bg-surface-raised text-ink-muted'"
              (click)="open(page.value)"
            >{{ page.label }}</button>
          }
        </div>
        <div class="rounded-2xl border border-line bg-surface-raised p-3 text-ink">
          <p class="mb-2 text-xs font-extrabold uppercase tracking-wider text-ink-muted">Rede · arquivos baixados</p>
          <ol class="flex flex-col gap-1 font-mono text-sm">
            @for (file of downloads(); track file.name) {
              <li [attr.data-file]="file.name" class="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg px-2 py-1" [class]="file.when === 'agora' ? 'bg-challenge/10' : ''">
                <span>{{ file.name }} <span class="text-xs text-ink-muted">· {{ file.when }}</span></span>
                <span class="text-right">{{ format(file.size) }} kB</span>
                <span class="col-span-2 h-1.5 rounded-full bg-inside/70" [style.width.%]="(file.size / 280) * 100"></span>
              </li>
            }
          </ol>
          <p data-total class="mt-3 border-t border-line pt-2 text-sm font-bold">Total baixado: {{ format(total()) }} kB</p>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ChunkSim {
  protected readonly modes: { value: Mode; label: string }[] = [
    { value: 'eager', label: 'Tudo no main' },
    { value: 'lazy', label: 'Sob demanda' },
    { value: 'preload', label: 'Sob demanda + pré-carregar' },
  ];
  protected readonly pages: { value: Page; label: string }[] = [
    { value: 'paises', label: '📋 Países' },
    { value: 'pais', label: '🇯🇵 Japão' },
    { value: 'sobre', label: 'ℹ️ Sobre' },
  ];

  protected readonly mode = signal<Mode>('lazy');
  protected readonly current = signal<Page>('paises');
  protected readonly downloads = signal<Download[]>([]);
  protected readonly total = computed(() => this.downloads().reduce((sum, file) => sum + file.size, 0));
  protected readonly announcement = signal('');

  constructor() {
    this.start('lazy');
  }

  protected start(mode: Mode): void {
    this.mode.set(mode);
    this.current.set('paises');
    if (mode === 'eager') {
      this.downloads.set(EAGER.map((file) => ({ ...file, when: 'ao abrir' })));
      this.announcement.set('Tudo no main: o app inteiro chega ao abrir.');
      return;
    }
    const opening = [...LAZY_START, ...PAGE_CHUNKS.paises].map((file) => ({ ...file, when: 'ao abrir' }));
    this.downloads.set(opening);
    if (mode === 'preload') {
      for (const page of ['pais', 'sobre'] as Page[]) this.fetch(page, 'em segundo plano');
    }
    this.announcement.set(`Ao abrir: ${opening.length} arquivos.`);
  }

  protected open(page: Page): void {
    this.current.set(page);
    if (this.mode() === 'eager') {
      this.announcement.set('Nada a baixar: já estava tudo no main.');
      return;
    }
    const added = this.fetch(page, 'agora');
    this.announcement.set(added ? `Baixou ${added} arquivo novo.` : 'Nada a baixar: esta tela já tinha chegado.');
  }

  protected format(size: number): string {
    return size.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  /** Baixa o que a tela precisa e ainda não chegou. Devolve quantos arquivos novos vieram. */
  private fetch(page: Page, when: string): number {
    const have = new Set(this.downloads().map((file) => file.name));
    const missing = PAGE_CHUNKS[page].filter((file) => !have.has(file.name));
    this.downloads.update((files) => [...files.map((file) => (file.when === 'agora' ? { ...file, when: 'antes' } : file)), ...missing.map((file) => ({ ...file, when }))]);
    return missing.length;
  }
}
