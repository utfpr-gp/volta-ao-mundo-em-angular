import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  PercentPipe,
  TitleCasePipe,
  UpperCasePipe,
  registerLocaleData,
} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

registerLocaleData(localePt);

const LOCALE = 'pt-BR';
const decimal = new DecimalPipe(LOCALE);
const currency = new CurrencyPipe(LOCALE, 'BRL');
const percent = new PercentPipe(LOCALE);
const date = new DatePipe(LOCALE);
const upper = new UpperCasePipe();
const title = new TitleCasePipe();

function flag(code: string): string {
  return [...code.toUpperCase()].map((letter) => String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65)).join('');
}

/** Roda um pipe de verdade do Angular, em pt-BR, a partir do texto que aparece depois da barra no template. */
export function runPipe(pipe: string, value: number | string | Date): string {
  switch (pipe) {
    case 'number':
      return decimal.transform(value as number) ?? '';
    case "number: '1.2-2'":
      return decimal.transform(value as number, '1.2-2') ?? '';
    case "currency: 'BRL'":
      return currency.transform(value as number, 'BRL') ?? '';
    case 'percent':
      return percent.transform(value as number) ?? '';
    case "percent: '1.0-2'":
      return percent.transform(value as number, '1.0-2') ?? '';
    case 'date':
      return date.transform(value as Date) ?? '';
    case "date: 'dd/MM/yyyy'":
      return date.transform(value as Date, 'dd/MM/yyyy') ?? '';
    case "date: 'EEEE'":
      return date.transform(value as Date, 'EEEE') ?? '';
    case "date: 'shortTime'":
      return date.transform(value as Date, 'shortTime') ?? '';
    case 'uppercase':
      return upper.transform(value as string);
    case 'titlecase':
      return title.transform(value as string);
    case 'flag':
      return flag(value as string);
    default:
      return '';
  }
}

export const PIPE_VALUES: { label: string; code: string; value: number | string | Date; pipes: string[] }[] = [
  { label: 'População', code: '123000000', value: 123_000_000, pipes: ['number', "currency: 'BRL'"] },
  { label: 'Fatia do mundo', code: '0.0513', value: 0.0513, pipes: ['percent', "percent: '1.0-2'", "number: '1.2-2'"] },
  { label: 'Data da viagem', code: 'new Date(2026, 9, 22, 14, 30)', value: new Date(2026, 9, 22, 14, 30), pipes: ['date', "date: 'dd/MM/yyyy'", "date: 'EEEE'", "date: 'shortTime'"] },
  { label: 'Capital', code: "'tóquio'", value: 'tóquio', pipes: ['uppercase', 'titlecase'] },
  { label: 'Código do país', code: "'JP'", value: 'JP', pipes: ['flag'] },
];

/** Simulador do capítulo 12: o mesmo valor passando por pipes diferentes, com os pipes reais do Angular. */
@Component({
  selector: 'vm-pipe-lab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O mesmo valor, vários formatos</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Escolha um valor e um pipe. O resultado vem dos pipes de verdade do Angular, no formato brasileiro.
        </span>
      </figcaption>

      <p class="text-sm font-bold text-ink">1. O valor</p>
      <div data-values class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Valores">
        @for (item of values; track item.label; let i = $index) {
          <button
            type="button"
            class="rounded-full border-2 px-3 py-1.5 text-sm font-bold"
            [class]="valueIndex() === i ? 'border-challenge bg-challenge text-on-primary' : 'border-line bg-surface-raised text-ink'"
            [attr.aria-pressed]="valueIndex() === i"
            (click)="chooseValue(i)"
          >
            {{ item.label }}
          </button>
        }
      </div>

      <p class="mt-4 text-sm font-bold text-ink">2. O pipe</p>
      <div data-pipes class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Pipes">
        @for (pipe of current().pipes; track pipe; let i = $index) {
          <button
            type="button"
            class="rounded-full border-2 px-3 py-1.5 font-mono text-sm"
            [class]="pipeIndex() === i ? 'border-code bg-code/12 text-ink' : 'border-line bg-surface-raised text-ink'"
            [attr.aria-pressed]="pipeIndex() === i"
            (click)="pipeIndex.set(i)"
          >
            {{ pipe }}
          </button>
        }
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl bg-terminal p-4 font-mono text-sm text-terminal-ink">
          <p class="text-xs text-terminal-ink/70">no template</p>
          <p data-expression class="mt-1 break-all">{{ '{{' }} {{ current().code }} | {{ pipe() }} {{ '}}' }}</p>
        </div>
        <div class="rounded-2xl border-2 border-highlight bg-surface-raised p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-ink-muted">na tela</p>
          <p data-output class="mt-1 text-2xl font-extrabold text-ink">{{ output() }}</p>
        </div>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ current().label }} com o pipe {{ pipe() }}: {{ output() }}</p>
    </figure>
  `,
})
export class PipeLab {
  protected readonly values = PIPE_VALUES;
  protected readonly valueIndex = signal(0);
  protected readonly pipeIndex = signal(0);
  protected readonly current = computed(() => PIPE_VALUES[this.valueIndex()]);
  protected readonly pipe = computed(() => this.current().pipes[this.pipeIndex()] ?? this.current().pipes[0]);
  protected readonly output = computed(() => runPipe(this.pipe(), this.current().value));

  protected chooseValue(index: number): void {
    this.valueIndex.set(index);
    this.pipeIndex.set(0);
  }
}
