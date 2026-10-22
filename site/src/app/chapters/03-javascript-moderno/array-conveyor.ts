import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

export interface SampleCountry {
  flag: string;
  name: string;
  region: string;
  visited: boolean;
}

export const SAMPLE: SampleCountry[] = [
  { flag: '🇧🇷', name: 'Brasil', region: 'Américas', visited: true },
  { flag: '🇯🇵', name: 'Japão', region: 'Ásia', visited: false },
  { flag: '🇵🇹', name: 'Portugal', region: 'Europa', visited: true },
  { flag: '🇦🇷', name: 'Argentina', region: 'Américas', visited: true },
  { flag: '🇮🇹', name: 'Itália', region: 'Europa', visited: false },
  { flag: '🇪🇬', name: 'Egito', region: 'África', visited: true },
  { flag: '🇨🇦', name: 'Canadá', region: 'Américas', visited: false },
];

export type FilterId = 'all' | 'visited' | 'americas';
export type MapId = 'object' | 'name' | 'label';

const FILTERS: { id: FilterId; label: string; code: string; test: (c: SampleCountry) => boolean }[] = [
  { id: 'all', label: 'Nenhum filtro', code: '', test: () => true },
  { id: 'visited', label: 'Só os visitados', code: '.filter((c) => c.visited)', test: (c) => c.visited },
  { id: 'americas', label: 'Só as Américas', code: ".filter((c) => c.region === 'Américas')", test: (c) => c.region === 'Américas' },
];

const MAPS: { id: MapId; label: string; code: string; to: (c: SampleCountry) => string | SampleCountry }[] = [
  { id: 'object', label: 'O objeto inteiro', code: '', to: (c) => c },
  { id: 'name', label: 'Só o nome', code: '.map((c) => c.name)', to: (c) => c.name },
  { id: 'label', label: 'Bandeira e nome', code: '.map((c) => `${c.flag} ${c.name}`)', to: (c) => `${c.flag} ${c.name}` },
];

export function runPipeline(filter: FilterId, map: MapId) {
  const f = FILTERS.find((item) => item.id === filter)!;
  const m = MAPS.find((item) => item.id === map)!;
  const filtered = SAMPLE.filter(f.test);
  return { filtered, output: filtered.map(m.to), code: `countries${f.code}${m.code}` };
}

function show(value: string | SampleCountry): string {
  return typeof value === 'string' ? `'${value}'` : `{ name: '${value.name}', … }`;
}

/** Simulador do capítulo 3: os países passando por filter e map, com o código de cada combinação. */
@Component({
  selector: 'vm-array-conveyor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A esteira de arrays</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha um filtro e uma transformação. Veja quais países passam pela esteira e o código que faz isso.
        </span>
      </figcaption>

      <div class="grid gap-4 sm:grid-cols-2">
        <fieldset class="rounded-2xl border border-line bg-surface-raised p-4">
          <legend class="px-1 font-extrabold text-ink">1. <code class="font-mono">filter</code>: quem passa?</legend>
          @for (option of filters; track option.id) {
            <label class="mt-2 flex cursor-pointer items-center gap-2 text-ink">
              <input type="radio" name="filtro" class="size-4 accent-challenge" [value]="option.id" [checked]="filter() === option.id" (change)="setFilter(option.id)" />
              {{ option.label }}
            </label>
          }
        </fieldset>
        <fieldset class="rounded-2xl border border-line bg-surface-raised p-4">
          <legend class="px-1 font-extrabold text-ink">2. <code class="font-mono">map</code>: o que sai?</legend>
          @for (option of maps; track option.id) {
            <label class="mt-2 flex cursor-pointer items-center gap-2 text-ink">
              <input type="radio" name="mapa" class="size-4 accent-challenge" [value]="option.id" [checked]="map() === option.id" (change)="setMap(option.id)" />
              {{ option.label }}
            </label>
          }
        </fieldset>
      </div>

      <ol class="mt-5 flex flex-wrap gap-2" aria-label="Os países na esteira">
        @for (country of sample; track country.name) {
          <li
            class="rounded-xl border-2 px-3 py-2 text-sm font-bold motion-safe:transition-all motion-safe:duration-300"
            [class]="passes(country) ? 'border-code bg-code/10 text-ink' : 'border-line text-ink-muted line-through opacity-50'"
          >
            {{ country.flag }} {{ country.name }}
            <span class="block text-xs font-semibold text-ink-muted no-underline">{{ country.region }} · {{ country.visited ? 'visitado' : 'desejado' }}</span>
          </li>
        }
      </ol>

      <div class="mt-5 grid gap-3 lg:grid-cols-2">
        <div class="rounded-2xl bg-terminal p-4 font-mono text-sm text-terminal-ink">
          <p class="text-xs text-terminal-ink/70">código</p>
          <p data-code class="mt-1 break-all">const result = {{ result().code }};</p>
        </div>
        <div class="rounded-2xl bg-terminal p-4 font-mono text-sm text-terminal-ink">
          <p class="text-xs text-terminal-ink/70">console.log(result)</p>
          <p data-result class="mt-1 break-words">[ {{ resultText() }} ]</p>
        </div>
      </div>
      <p aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class ArrayConveyor {
  protected readonly sample = SAMPLE;
  protected readonly filters = FILTERS;
  protected readonly maps = MAPS;
  protected readonly filter = signal<FilterId>('all');
  protected readonly map = signal<MapId>('object');
  protected readonly result = computed(() => runPipeline(this.filter(), this.map()));
  protected readonly resultText = computed(() => this.result().output.map(show).join(', '));
  protected readonly announcement = computed(() => {
    const { filtered } = this.result();
    return `${filtered.length} países passaram pelo filter. Resultado: ${this.resultText()}`;
  });

  protected passes(country: SampleCountry): boolean {
    return this.result().filtered.includes(country);
  }

  protected setFilter(id: FilterId): void {
    this.filter.set(id);
  }

  protected setMap(id: MapId): void {
    this.map.set(id);
  }
}
