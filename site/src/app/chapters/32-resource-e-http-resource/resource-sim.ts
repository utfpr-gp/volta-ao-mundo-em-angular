import { ChangeDetectionStrategy, Component, computed, input, resource, ResourceStatus, signal } from '@angular/core';

interface Weather {
  capital: string;
  temperature: number;
  unit: '°C' | '°F';
}

const CAPITALS: Record<string, { capital: string; celsius: number }> = {
  JP: { capital: 'Tóquio', celsius: 18 },
  IS: { capital: 'Reykjavík', celsius: 1 },
};

const STATUSES: ResourceStatus[] = ['idle', 'loading', 'reloading', 'resolved', 'error', 'local'];

/** Simulador do capítulo 32: um resource() de verdade, com um loader de mentirinha que demora e pode falhar. */
@Component({
  selector: 'vm-resource-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A vida de um resource</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Um resource() de verdade, com um carregamento de mentirinha que demora um pouco. Escolha o país, troque a unidade, derrube a API e veja o status mudar.
        </span>
      </figcaption>

      <div class="flex flex-wrap gap-2">
        @for (option of countries; track option.code) {
          <button
            type="button"
            class="rounded-full border px-3 py-1 text-sm font-bold"
            [class]="code() === option.code ? 'border-challenge bg-challenge text-on-primary' : 'border-line bg-surface-raised text-ink'"
            (click)="code.set(option.code)"
          >{{ option.label }}</button>
        }
        <button type="button" class="rounded-full border border-line bg-surface-raised px-3 py-1 text-sm font-bold text-ink" (click)="unit.set(unit() === '°C' ? '°F' : '°C')">
          Unidade: {{ unit() }}
        </button>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        <button type="button" class="rounded-full border border-line bg-surface-raised px-3 py-1 font-mono text-sm text-ink" (click)="weather.reload()">reload()</button>
        <button type="button" class="rounded-full border border-line bg-surface-raised px-3 py-1 font-mono text-sm text-ink" (click)="setLocal()">
          {{ 'set({ …, temperature: 30 })' }}
        </button>
        <button
          type="button"
          class="rounded-full border px-3 py-1 text-sm font-bold"
          [class]="apiDown() ? 'border-pitfall bg-pitfall/10 text-pitfall' : 'border-line bg-surface-raised text-ink'"
          [attr.aria-pressed]="apiDown()"
          (click)="apiDown.set(!apiDown())"
        >API fora do ar</button>
      </div>

      <div class="mt-4 flex flex-wrap gap-1.5" aria-label="Status do resource">
        @for (name of statuses; track name) {
          <span
            [attr.data-status]="weather.status() === name ? 'ativo' : null"
            class="rounded-full border px-3 py-1 font-mono text-xs"
            [class]="weather.status() === name ? 'border-challenge bg-challenge font-bold text-on-primary' : 'border-line text-ink-muted'"
          >{{ name }}</span>
        }
      </div>

      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <dl data-value class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-2xl border border-line bg-surface-raised p-4 font-mono text-sm text-ink">
          <dt class="font-bold">isLoading()</dt><dd>{{ weather.isLoading() }}</dd>
          <dt class="font-bold">hasValue()</dt><dd>{{ weather.hasValue() }}</dd>
          <dt class="font-bold">value()</dt>
          <dd>{{ weather.hasValue() ? shown() : weather.error() ? 'lança um erro' : 'undefined' }}</dd>
          <dt class="font-bold">error()</dt><dd>{{ weather.error()?.message ?? 'undefined' }}</dd>
        </dl>
        <ol data-log class="flex flex-col gap-1 rounded-2xl bg-terminal p-3 font-mono text-xs text-terminal-ink">
          @for (line of log(); track $index) {
            <li>{{ line }}</li>
          } @empty {
            <li class="opacity-70">nenhum carregamento ainda</li>
          }
        </ol>
      </div>
      <p data-announce aria-live="polite" class="sr-only">Status: {{ weather.status() }}.</p>
    </figure>
  `,
})
export class ResourceSim {
  /** Quanto o carregamento de mentirinha demora, em milissegundos. */
  readonly delay = input(1200);

  protected readonly countries = [
    { code: 'JP', label: '🇯🇵 Japão' },
    { code: 'IS', label: '🇮🇸 Islândia' },
  ];
  protected readonly statuses = STATUSES;
  protected readonly code = signal<string | undefined>(undefined);
  protected readonly unit = signal<'°C' | '°F'>('°C');
  protected readonly apiDown = signal(false);
  protected readonly log = signal<string[]>([]);

  protected readonly weather = resource({
    // Sem país, params devolve undefined, e o resource fica idle.
    params: () => {
      const code = this.code();
      return code ? { code, unit: this.unit() } : undefined;
    },
    loader: ({ params, abortSignal }) =>
      new Promise<Weather>((resolve, reject) => {
        const label = `${params.code} em ${params.unit}`;
        this.write(`▶ carregando ${label}`);
        const timer = setTimeout(() => {
          if (this.apiDown()) {
            this.write(`✗ ${label}: a API não respondeu`);
            reject(new Error('A API não respondeu'));
            return;
          }
          const { capital, celsius } = CAPITALS[params.code];
          this.write(`✓ ${label}: pronto`);
          resolve({ capital, unit: params.unit, temperature: params.unit === '°C' ? celsius : Math.round(celsius * 1.8 + 32) });
        }, this.delay());
        abortSignal.addEventListener('abort', () => {
          clearTimeout(timer);
          this.write(`✕ ${label}: cancelada`);
        });
      }),
  });

  protected readonly shown = computed(() => {
    const value = this.weather.hasValue() ? this.weather.value() : undefined;
    return value ? `${value.capital}: ${value.temperature} ${value.unit}` : '';
  });

  protected setLocal(): void {
    const current = this.weather.hasValue() ? this.weather.value() : undefined;
    this.weather.set({ capital: current?.capital ?? 'Tóquio', unit: this.unit(), temperature: 30 });
  }

  private write(line: string): void {
    this.log.update((lines) => [...lines.slice(-5), line]);
  }
}
