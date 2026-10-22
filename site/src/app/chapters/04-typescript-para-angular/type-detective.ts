import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface Option {
  code: string;
  /** null quando o TypeScript aceita; senão, a mensagem real do compilador (tsc 6.0). */
  error: string | null;
  why: string;
}

interface Scenario {
  context: string;
  before: string;
  after: string;
  options: Option[];
}

/** Casos com as mensagens copiadas da saída real do tsc, compilando cada linha. */
export const SCENARIOS: Scenario[] = [
  {
    context: 'let population: number = 213_000_000;',
    before: 'population = ',
    after: ';',
    options: [
      {
        code: "'213 milhões'",
        error: "error TS2322: Type 'string' is not assignable to type 'number'.",
        why: 'Entre aspas é texto (string), e a variável só aceita número.',
      },
      { code: '213_000_000', error: null, why: 'Um número numa variável do tipo number.' },
    ],
  },
  {
    context: 'interface Country { code: string; name: string; capital: string; population: number; visited: boolean; rating?: number; }',
    before: "const peru: Country = { code: 'PE', name: 'Peru', ",
    after: 'population: 34_000_000, visited: false };',
    options: [
      { code: "capital: 'Lima', ", error: null, why: 'Todas as propriedades obrigatórias estão lá; rating é opcional.' },
      {
        code: '',
        error:
          "error TS2741: Property 'capital' is missing in type '{ code: string; name: string; population: number; visited: false; }' but required in type 'Country'.",
        why: 'A interface exige capital, e ela não foi informada.',
      },
    ],
  },
  {
    context: "type Status = 'visited' | 'wishlist';",
    before: 'let tripStatus: Status = ',
    after: ';',
    options: [
      { code: "'visited'", error: null, why: 'Um dos dois valores permitidos.' },
      {
        code: "'visitado'",
        error: "error TS2820: Type '\"visitado\"' is not assignable to type 'Status'. Did you mean '\"visited\"'?",
        why: 'Só valem exatamente os textos do tipo; o compilador até sugere o certo.',
      },
      { code: "'wishlist'", error: null, why: 'O outro valor permitido.' },
    ],
  },
  {
    context: 'function percentOfWorld(visited: number, total: number): number { … }',
    before: 'percentOfWorld(',
    after: ', 195);',
    options: [
      { code: '12', error: null, why: 'O parâmetro visited é um número.' },
      {
        code: "'12'",
        error: "error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.",
        why: 'As aspas transformam o 12 em texto.',
      },
    ],
  },
  {
    context: "const chile: Country = { code: 'CL', name: 'Chile', capital: 'Santiago', population: 19_600_000, visited: true };",
    before: 'console.log(chile.',
    after: ');',
    options: [
      {
        code: 'nome',
        error: "error TS2339: Property 'nome' does not exist on type 'Country'.",
        why: 'A propriedade se chama name, em inglês; o TypeScript pega o erro antes de rodar.',
      },
      { code: 'name', error: null, why: 'name existe na interface Country.' },
    ],
  },
];

/** Simulador do capítulo 4: escolha um valor e veja se o TypeScript aceita, com a mensagem real do compilador. */
@Component({
  selector: 'vm-type-detective',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5 flex flex-wrap items-start justify-between gap-3">
        <span>
          <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
          <span class="block text-xl font-extrabold text-ink">Detetive de tipos</span>
          <span class="mt-1 block max-w-2xl text-ink-muted">
            Escolha o que vai na lacuna e veja o que o compilador diz. As mensagens são as reais do TypeScript.
          </span>
        </span>
        <span class="rounded-full bg-surface-raised px-3 py-1 text-sm font-bold text-ink-muted">Caso {{ index() + 1 }} de {{ scenarios.length }}</span>
      </figcaption>

      <div class="rounded-2xl bg-terminal p-4 font-mono text-sm leading-relaxed text-terminal-ink">
        <p class="text-terminal-ink/70">{{ scenario().context }}</p>
        <p class="mt-2 break-words">
          {{ scenario().before }}<span
            class="rounded px-1"
            [class]="chosen() === null ? 'bg-terminal-ink/15' : chosenOption()?.error ? 'bg-stamp/40' : 'bg-terminal-prompt/30'"
          >{{ chosen() === null ? '______' : chosenOption()?.code || '(nada)' }}</span>{{ scenario().after }}
        </p>
      </div>

      <div data-options class="mt-4 flex flex-wrap gap-2" role="group" aria-label="O que vai na lacuna?">
        @for (option of scenario().options; track $index) {
          <button
            type="button"
            class="rounded-xl border-2 px-4 py-2 font-mono text-sm font-bold"
            [class]="chosen() === $index ? 'border-challenge bg-challenge/10 text-ink' : 'border-line bg-surface-raised text-ink hover:border-challenge/60'"
            [attr.aria-pressed]="chosen() === $index"
            (click)="choose($index)"
          >
            {{ option.code || '(deixar sem)' }}
          </button>
        }
      </div>

      @if (chosenOption(); as option) {
        <div data-verdict class="mt-4 rounded-2xl p-4" [class]="option.error ? 'bg-pitfall/10' : 'bg-code/10'">
          <p class="font-extrabold" [class]="option.error ? 'text-pitfall' : 'text-code'">
            {{ option.error ? '✗ O TypeScript recusa' : '✓ O TypeScript aceita' }}
          </p>
          @if (option.error) {
            <p class="mt-2 break-words rounded-xl bg-surface-raised px-3 py-2 font-mono text-sm text-ink">{{ option.error }}</p>
          }
          <p class="mt-2 text-ink">{{ option.why }}</p>
        </div>
      }

      <div class="mt-4 flex justify-end">
        <button type="button" data-next class="rounded-full bg-primary px-5 py-2 font-bold text-on-primary hover:bg-primary-soft" (click)="next()">
          {{ index() === scenarios.length - 1 ? 'Recomeçar' : 'Próximo caso →' }}
        </button>
      </div>
      <p aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class TypeDetective {
  protected readonly scenarios = SCENARIOS;
  protected readonly index = signal(0);
  protected readonly chosen = signal<number | null>(null);
  protected readonly scenario = computed(() => SCENARIOS[this.index()]);
  protected readonly chosenOption = computed(() => {
    const chosen = this.chosen();
    return chosen === null ? null : this.scenario().options[chosen];
  });
  protected readonly announcement = computed(() => {
    const option = this.chosenOption();
    if (!option) return '';
    return option.error ? `O TypeScript recusa. ${option.error} ${option.why}` : `O TypeScript aceita. ${option.why}`;
  });

  protected choose(option: number): void {
    this.chosen.set(option);
  }

  protected next(): void {
    this.index.update((index) => (index + 1) % SCENARIOS.length);
    this.chosen.set(null);
  }
}
