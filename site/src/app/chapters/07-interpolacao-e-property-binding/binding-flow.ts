import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

type Line = 'name' | 'capital' | 'disabled' | 'click' | 'input' | 'typed';

const ACTIVE = 'bg-highlight/30 ring-2 ring-highlight';

/**
 * Simulador dos capítulos 7 e 8: os dois sentidos do binding.
 * No modo property, os dados descem da classe para a tela; no modo event, os eventos sobem da tela para a classe.
 */
@Component({
  selector: 'vm-binding-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">
          {{ mode() === 'property' ? 'Da classe para a tela' : 'Da tela para a classe, e de volta' }}
        </span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          @if (mode() === 'property') {
            Mude os valores na classe, à esquerda, e veja qual linha do template leva cada um para a tela.
          } @else {
            Clique no botão e digite no campo da tela, à direita, e veja o evento chegar à classe.
          }
        </span>
      </figcaption>

      <div class="grid gap-4 lg:grid-cols-3">
        <section class="rounded-2xl bg-terminal p-4 font-mono text-sm text-terminal-ink" aria-labelledby="sim-classe">
          <h4 id="sim-classe" class="text-xs text-terminal-ink/70">classe (featured-country.ts)</h4>
          @if (mode() === 'property') {
            <div class="mt-3 flex flex-col gap-3">
              <label class="flex flex-col gap-1">
                <span>name =</span>
                <input id="classe-name" class="rounded bg-terminal-ink/10 px-2 py-1 text-terminal-ink" [value]="name()" (input)="setName($any($event.target).value)" />
              </label>
              <label class="flex flex-col gap-1">
                <span>capital =</span>
                <input id="classe-capital" class="rounded bg-terminal-ink/10 px-2 py-1 text-terminal-ink" [value]="capital()" (input)="setCapital($any($event.target).value)" />
              </label>
              <label class="flex items-center gap-2">
                <input id="classe-visited" type="checkbox" class="size-4" [checked]="visited()" (change)="setVisited($any($event.target).checked)" />
                <span>visited = {{ visited() }}</span>
              </label>
            </div>
          } @else {
            <pre data-class class="mt-3 whitespace-pre-wrap leading-relaxed">visited: {{ visited() }}
typed: '{{ typed() }}'

markVisited() {{ '{' }}
  this.visited = true;
{{ '}' }}

onType(text) {{ '{' }}
  this.typed = text;
{{ '}' }}</pre>
          }
        </section>

        <section class="rounded-2xl border border-line bg-surface-raised p-4 font-mono text-sm" aria-labelledby="sim-template">
          <h4 id="sim-template" class="text-xs text-ink-muted">template (featured-country.html)</h4>
          <ul class="mt-3 flex flex-col gap-2 text-ink">
            @if (mode() === 'property') {
              <li data-line="name" [attr.data-active]="active() === 'name' ? '' : null" class="rounded px-2 py-1" [class]="lineClass('name')">&lt;h2&gt;{{ '{{' }} country.name {{ '}}' }}&lt;/h2&gt;</li>
              <li data-line="capital" [attr.data-active]="active() === 'capital' ? '' : null" class="rounded px-2 py-1" [class]="lineClass('capital')">Capital: {{ '{{' }} country.capital {{ '}}' }}</li>
              <li data-line="disabled" [attr.data-active]="active() === 'disabled' ? '' : null" class="rounded px-2 py-1" [class]="lineClass('disabled')">&lt;button [disabled]="country.visited"&gt;</li>
            } @else {
              <li data-line="click" [attr.data-active]="active() === 'click' ? '' : null" class="rounded px-2 py-1" [class]="lineClass('click')">&lt;button (click)="markVisited()"&gt;</li>
              <li data-line="input" [attr.data-active]="active() === 'input' ? '' : null" class="rounded px-2 py-1" [class]="lineClass('input')">&lt;input #note (input)="onType(note.value)"&gt;</li>
              <li data-line="typed" [attr.data-active]="active() === 'input' ? '' : null" class="rounded px-2 py-1" [class]="lineClass('input')">Você digitou: {{ '{{' }} typed {{ '}}' }}</li>
            }
          </ul>
          <p class="mt-3 text-center font-sans text-2xl text-challenge" aria-hidden="true">{{ mode() === 'property' ? '⬇ classe → tela' : '⬆ tela → classe' }}</p>
        </section>

        <section data-preview class="rounded-2xl border-2 border-highlight bg-surface-raised p-4" aria-labelledby="sim-tela">
          <h4 id="sim-tela" class="text-xs font-bold uppercase tracking-wider text-ink-muted">tela</h4>
          <h2 class="mt-2 text-xl font-extrabold text-ink" [class]="active() === 'name' ? 'rounded ' + highlight : ''">{{ name() }}</h2>
          <p class="text-ink" [class]="active() === 'capital' ? 'rounded ' + highlight : ''">Capital: {{ capital() }}</p>
          <button
            type="button"
            class="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary disabled:opacity-40"
            [disabled]="mode() === 'property' && visited()"
            (click)="markVisited()"
          >
            {{ visited() ? 'Visitado ✓' : 'Marcar como visitado' }}
          </button>
          @if (mode() === 'event') {
            <label class="mt-3 block text-sm text-ink">
              Anotação
              <input class="mt-1 w-full rounded-lg border border-line bg-surface px-2 py-1 text-ink" (input)="type($any($event.target).value)" />
            </label>
            <p class="mt-2 text-sm text-ink">Você digitou: {{ typed() }}</p>
          }
        </section>
      </div>
      <p data-announce aria-live="polite" class="sr-only">{{ announcement() }}</p>
    </figure>
  `,
})
export class BindingFlow {
  readonly mode = input<'property' | 'event'>('property');

  protected readonly highlight = ACTIVE;
  protected readonly name = signal('Japão');
  protected readonly capital = signal('Tóquio');
  protected readonly visited = signal(false);
  protected readonly typed = signal('');
  protected readonly active = signal<Line | null>(null);
  protected readonly announcement = signal('');
  protected readonly modeLabel = computed(() => (this.mode() === 'property' ? 'classe → tela' : 'tela → classe'));

  protected lineClass(line: Line): string {
    return this.active() === line ? ACTIVE : '';
  }

  protected setName(value: string): void {
    this.name.set(value);
    this.mark('name', `classe → tela: name mudou para "${value}", e a interpolação atualizou o título.`);
  }

  protected setCapital(value: string): void {
    this.capital.set(value);
    this.mark('capital', `classe → tela: capital mudou para "${value}", e a interpolação atualizou o texto.`);
  }

  protected setVisited(value: boolean): void {
    this.visited.set(value);
    this.mark('disabled', `classe → tela: visited virou ${value}, e o property binding [disabled] ${value ? 'desligou' : 'religou'} o botão.`);
  }

  protected markVisited(): void {
    if (this.mode() !== 'event') return;
    this.visited.set(true);
    this.mark('click', 'tela → classe: o evento click chamou markVisited(), e visited virou true na classe.');
  }

  protected type(value: string): void {
    this.typed.set(value);
    this.mark('input', `tela → classe: o evento input levou "${value}" para a classe, e a interpolação o trouxe de volta.`);
  }

  private mark(line: Line, message: string): void {
    this.active.set(line);
    this.announcement.set(message);
  }
}
