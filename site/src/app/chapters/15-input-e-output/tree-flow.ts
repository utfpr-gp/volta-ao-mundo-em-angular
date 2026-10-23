import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface MiniCountry {
  code: string;
  name: string;
  flag: string;
  visited: boolean;
}

/** Simulador do capítulo 15: o dado desce do pai para o filho pelo input; o evento sobe do filho para o pai pelo output. */
@Component({
  selector: 'vm-tree-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">Dados descem, eventos sobem</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Clique em "Visitar" num cartão filho e acompanhe a viagem: o aviso sobe até o pai, o pai muda o array, e o país novo desce de volta.
        </span>
      </figcaption>

      <div data-parent class="rounded-2xl bg-terminal p-4 font-mono text-sm text-terminal-ink">
        <p class="text-xs text-terminal-ink/70">pai: CountryList</p>
        <p class="mt-1">countries = [</p>
        @for (country of countries(); track country.code) {
          <p class="pl-4" [class.text-terminal-prompt]="lastCode() === country.code">
            {{ '{' }} code: '{{ country.code }}', visited: {{ country.visited }} {{ '}' }},
          </p>
        }
        <p>]</p>
      </div>

      <div class="my-2 grid grid-cols-3 text-center font-bold text-challenge" aria-hidden="true">
        @for (country of countries(); track country.code) {
          <span>{{ lastCode() === country.code ? '↑ ↓' : '↓' }}</span>
        }
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        @for (country of countries(); track country.code) {
          <div
            [attr.data-child]="country.code"
            class="rounded-2xl border-2 bg-surface-raised p-3 text-center"
            [class]="lastCode() === country.code ? 'border-highlight' : 'border-line'"
          >
            <p class="font-mono text-xs text-ink-muted">filho: &lt;app-country-card&gt;</p>
            <p class="mt-1 text-3xl">{{ country.flag }}</p>
            <p class="font-bold text-ink">{{ country.name }}</p>
            <button type="button" class="mt-2 rounded-full bg-primary px-3 py-1 text-sm font-bold text-on-primary" (click)="toggle(country.code)">
              {{ country.visited ? 'Visitado ✓' : 'Visitar' }}
            </button>
          </div>
        }
      </div>

      <ol data-log class="mt-4 flex flex-col gap-1 font-mono text-sm text-ink">
        @for (line of log(); track $index) {
          <li class="rounded-lg bg-surface-raised px-3 py-1">{{ line }}</li>
        }
      </ol>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class TreeFlow {
  protected readonly countries = signal<MiniCountry[]>([
    { code: 'BR', name: 'Brasil', flag: '🇧🇷', visited: true },
    { code: 'JP', name: 'Japão', flag: '🇯🇵', visited: false },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', visited: false },
  ]);
  protected readonly lastCode = signal<string | null>(null);
  protected readonly log = signal<string[]>([]);
  protected readonly announcement = signal('');

  protected toggle(code: string): void {
    this.countries.update((countries) =>
      countries.map((country) => (country.code === code ? { ...country, visited: !country.visited } : country)),
    );
    this.lastCode.set(code);
    this.log.set([
      `↑ output: toggled.emit('${code}')  (o filho avisa)`,
      `   pai: toggleVisited('${code}') cria um array novo`,
      `↓ input: [country] chega ao filho com o valor novo`,
    ]);
    this.announcement.set(`O aviso do ${code} subiu pelo output, o pai mudou o array e o país novo desceu pelo input.`);
  }
}
