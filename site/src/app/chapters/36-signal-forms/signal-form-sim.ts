import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FieldTree, form, FormField, max, min, pattern, required, submit } from '@angular/forms/signals';

interface SimTrip {
  /** Um campo de número apagado vale null. */
  days: number | null;
  companion: string;
}

const BLANK: SimTrip = { days: 7, companion: '' };
const EXAMPLE: SimTrip = { days: 12, companion: 'Ana Maria' };

/** Simulador do capítulo 36: um formulário de verdade com Signal Forms, com o modelo e o estado de cada campo à mostra. */
@Component({
  selector: 'vm-signal-form-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, JsonPipe],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O modelo e o formulário</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Dois campos de verdade, ligados com [formField] a um signal. Digite nos campos e veja o modelo mudar; use os botões para
          mudar o modelo e veja os campos mudarem.
        </span>
      </figcaption>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-4 rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <div class="flex flex-col gap-1">
            <label for="sim-days" class="text-sm font-bold">Quantos dias</label>
            <input
              id="sim-days"
              type="number"
              [formField]="tripForm.days"
              [attr.aria-invalid]="errorOf(tripForm.days) ? true : null"
              [attr.aria-describedby]="errorOf(tripForm.days) ? 'sim-days-error' : null"
              class="rounded-lg border bg-surface px-3 py-1.5"
              [class]="errorOf(tripForm.days) ? 'border-pitfall' : 'border-line'"
            />
            @if (errorOf(tripForm.days); as message) {
              <p id="sim-days-error" class="text-sm font-bold text-pitfall">{{ message }}</p>
            }
          </div>

          <div class="flex flex-col gap-1">
            <label for="sim-companion" class="text-sm font-bold">Com quem</label>
            <input
              id="sim-companion"
              [formField]="tripForm.companion"
              [attr.aria-invalid]="errorOf(tripForm.companion) ? true : null"
              [attr.aria-describedby]="errorOf(tripForm.companion) ? 'sim-companion-error' : null"
              class="rounded-lg border bg-surface px-3 py-1.5"
              [class]="errorOf(tripForm.companion) ? 'border-pitfall' : 'border-line'"
            />
            @if (errorOf(tripForm.companion); as message) {
              <p id="sim-companion-error" class="text-sm font-bold text-pitfall">{{ message }}</p>
            }
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="fillExample()">
              trip.set(exemplo)
            </button>
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="setZeroDays()">
              days().value.set(0)
            </button>
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="trySubmit()">
              submit(tripForm)
            </button>
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="startOver()">
              reset()
            </button>
          </div>
          @if (lastSubmit(); as result) {
            <p data-submit class="text-sm text-ink-muted">{{ result }}</p>
          }
        </div>

        <pre data-state class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">trip(): {{ trip() | json }}

tripForm.days()
  value:   {{ tripForm.days().value() | json }}
  valid:   {{ tripForm.days().valid() }}
  touched: {{ tripForm.days().touched() }}   dirty: {{ tripForm.days().dirty() }}
  errors:  {{ kinds(tripForm.days) }}

tripForm.companion()
  value:   {{ tripForm.companion().value() | json }}
  valid:   {{ tripForm.companion().valid() }}
  touched: {{ tripForm.companion().touched() }}   dirty: {{ tripForm.companion().dirty() }}
  errors:  {{ kinds(tripForm.companion) }}

tripForm().valid(): {{ tripForm().valid() }}</pre>
      </div>
      <p data-announce aria-live="polite" class="sr-only">
        Modelo: {{ trip().days ?? 'sem' }} dias, com {{ trip().companion || 'ninguém' }}.
        {{ tripForm().valid() ? 'Formulário válido.' : 'Formulário inválido.' }}
      </p>
    </figure>
  `,
})
export class SignalFormSim {
  protected readonly trip = signal<SimTrip>({ ...BLANK });

  protected readonly tripForm = form(this.trip, (path) => {
    required(path.days, { message: 'Diga quantos dias durou a viagem.' });
    min(path.days, 1, { message: 'A viagem tem de durar de 1 a 365 dias.' });
    max(path.days, 365, { message: 'A viagem tem de durar de 1 a 365 dias.' });
    pattern(path.companion, /^[\p{L} '-]*$/u, { message: 'Use só letras, espaços, apóstrofo e hífen.' });
  });

  protected readonly lastSubmit = signal('');

  protected errorOf(field: FieldTree<unknown>): string | undefined {
    const state = field();
    return state.invalid() && state.touched() ? state.errors()[0]?.message : undefined;
  }

  protected kinds(field: FieldTree<unknown>): string {
    const kinds = field()
      .errors()
      .map((error) => `'${error.kind}'`);
    return kinds.length ? `[${kinds.join(', ')}]` : '[]';
  }

  protected fillExample(): void {
    // Mudar o modelo muda os campos: o form() lê o mesmo signal.
    this.trip.set({ ...EXAMPLE });
  }

  protected setZeroDays(): void {
    this.tripForm.days().value.set(0);
  }

  protected async trySubmit(): Promise<void> {
    const sent = await submit(this.tripForm, async () => undefined);
    this.lastSubmit.set(
      sent ? 'submit() devolveu true: o action rodou.' : 'submit() devolveu false: os campos ficaram tocados, e o action não rodou.',
    );
  }

  protected startOver(): void {
    this.tripForm().reset({ ...BLANK });
    this.lastSubmit.set('');
  }
}
