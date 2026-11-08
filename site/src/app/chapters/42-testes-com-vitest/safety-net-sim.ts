import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

type Transport = 'aviao' | 'onibus' | 'carro' | 'navio';
interface Trip {
  country: string;
  days: number;
  transport: Transport;
}
interface Stats {
  count: number;
  days: number;
  countries: number;
  favorite: Transport | null;
}

/** A tripStats da etapa, com um ponto de troca para cada defeito que o simulador planta. */
function makeTripStats(bug: BugId) {
  return (trips: Trip[]): Stats => {
    const uses = new Map<Transport, number>();
    for (const trip of trips) uses.set(trip.transport, (uses.get(trip.transport) ?? 0) + 1);
    const ranking = [...uses.entries()].sort((a, b) => b[1] - a[1]);
    const tie = ranking.length > 1 && ranking[0][1] === ranking[1][1];
    return {
      count: trips.length,
      days: bug === 'days' ? trips.length : trips.reduce((total, trip) => total + trip.days, 0),
      countries: bug === 'countries' ? trips.length : new Set(trips.map((trip) => trip.country)).size,
      favorite: bug === 'empty' ? ranking[0][0] : ranking.length && (bug === 'tie' || !tie) ? ranking[0][0] : null,
    };
  };
}

type BugId = 'none' | 'days' | 'countries' | 'tie' | 'empty';

const BUGS: { id: BugId; label: string; line: string }[] = [
  { id: 'none', label: 'O código como está na etapa', line: '(nenhuma mudança)' },
  { id: 'days', label: 'Somar as viagens, e não os dias', line: 'days: trips.length,' },
  { id: 'countries', label: 'Contar o país repetido duas vezes', line: 'countries: trips.length,' },
  { id: 'tie', label: 'No empate, escolher o primeiro', line: 'favorite: ranking.length ? ranking[0][0] : null,' },
  { id: 'empty', label: 'Esquecer o diário vazio', line: 'favorite: ranking[0][0],' },
];

const trip = (country: string, days: number, transport: Transport): Trip => ({ country, days, transport });

/** Os cinco testes do trip-stats.spec.ts, rodando de verdade contra a função escolhida. */
const TESTS: { name: string; run: (stats: (trips: Trip[]) => Stats) => void }[] = [
  {
    name: 'starts at zero, with no favorite transport, when there is no trip',
    run: (f) => equal(JSON.stringify(f([])), JSON.stringify({ count: 0, days: 0, countries: 0, favorite: null })),
  },
  { name: 'adds up the days of every trip', run: (f) => equal(f([trip('JP', 12, 'aviao'), trip('PT', 5, 'aviao')]).days, 17) },
  {
    name: 'counts a country visited twice only once',
    run: (f) => {
      const stats = f([trip('JP', 3, 'aviao'), trip('JP', 4, 'navio'), trip('PT', 5, 'carro')]);
      equal(stats.count, 3);
      equal(stats.countries, 2);
    },
  },
  { name: 'picks the transport used the most', run: (f) => equal(f([trip('JP', 3, 'navio'), trip('PT', 4, 'aviao'), trip('IT', 5, 'navio')]).favorite, 'navio') },
  { name: 'has no favorite when two transports tie', run: (f) => equal(f([trip('JP', 3, 'navio'), trip('PT', 4, 'aviao')]).favorite, null) },
];

function equal(received: unknown, expected: unknown): void {
  if (received !== expected) throw new Error(`expected ${JSON.stringify(received)} to be ${JSON.stringify(expected)}`);
}

/** Simulador do capítulo 42: plante um defeito na função e veja quais testes percebem. */
@Component({
  selector: 'vm-safety-net-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Os testes como rede de proteção</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha uma mudança na <code>tripStats</code>, como quem mexe no código com pressa. Os cinco testes da etapa rodam de
          verdade, aqui no navegador, contra a função mudada.
        </span>
      </figcaption>

      <fieldset class="flex flex-col gap-1 text-ink">
        <legend class="mb-1 text-sm font-bold">A mudança</legend>
        @for (option of bugs; track option.id) {
          <label class="flex items-center gap-2">
            <input type="radio" name="sim-bug" [value]="option.id" [checked]="bug() === option.id" (change)="bug.set(option.id)" />
            {{ option.label }}
          </label>
        }
      </fieldset>
      <p class="mt-3 text-sm text-ink">
        A linha mudada: <code class="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-xs wrap-anywhere">{{ line() }}</code>
      </p>

      <ol data-results class="mt-4 flex flex-col gap-1 rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">
        @for (result of results(); track result.name) {
          <li>
            <span aria-hidden="true">{{ result.ok ? '✓' : '×' }} </span>{{ result.name }}
            @if (!result.ok) {
              <span class="block pl-4 opacity-80">{{ result.error }}</span>
            }
          </li>
        }
      </ol>
      <p data-summary aria-live="polite" class="mt-3 text-sm font-bold text-ink">{{ summary() }}</p>
    </figure>
  `,
})
export class SafetyNetSim {
  protected readonly bugs = BUGS;
  protected readonly bug = signal<BugId>('none');
  protected readonly line = computed(() => BUGS.find((b) => b.id === this.bug())!.line);

  protected readonly results = computed(() => {
    const f = makeTripStats(this.bug());
    return TESTS.map((test) => {
      try {
        test.run(f);
        return { name: test.name, ok: true, error: '' };
      } catch (error) {
        return { name: test.name, ok: false, error: `${(error as Error).constructor.name}: ${(error as Error).message}` };
      }
    });
  });

  protected readonly summary = computed(() => {
    const failed = this.results().filter((r) => !r.ok).length;
    if (!failed) return 'Tests  5 passed (5): pode seguir.';
    return `Tests  ${failed} failed | ${5 - failed} passed (5): a rede pegou o defeito antes de ele chegar à tela.`;
  });
}
