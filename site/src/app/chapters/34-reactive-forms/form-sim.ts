import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

/** Simulador do capítulo 34: um formulário de verdade, com o estado do FormGroup à mostra. */
@Component({
  selector: 'vm-form-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, JsonPipe],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">O formulário por dentro</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Um FormGroup de verdade. Preencha os campos ou use os botões, e veja o que o formulário sabe sobre si mesmo.
        </span>
      </figcaption>

      <div class="grid gap-4 lg:grid-cols-2">
        <form [formGroup]="form" class="flex flex-col gap-3 rounded-2xl border border-line bg-surface-raised p-4 text-ink" (submit)="$event.preventDefault()">
          <label class="flex flex-col gap-1 text-sm font-bold">
            País
            <input formControlName="country" class="rounded-lg border border-line bg-surface px-3 py-1.5 font-normal" />
          </label>
          @if (asText()) {
            <label class="flex flex-col gap-1 text-sm font-bold">
              Quantos dias <span class="font-mono text-xs text-pitfall">type="text"</span>
              <input type="text" formControlName="days" class="rounded-lg border border-pitfall/60 bg-surface px-3 py-1.5 font-normal" />
            </label>
          } @else {
            <label class="flex flex-col gap-1 text-sm font-bold">
              Quantos dias
              <input type="number" formControlName="days" class="rounded-lg border border-line bg-surface px-3 py-1.5 font-normal" />
            </label>
          }
          <label class="flex flex-col gap-1 text-sm font-bold">
            Com quem
            <input formControlName="companion" class="rounded-lg border border-line bg-surface px-3 py-1.5 font-normal" />
          </label>
          <div class="flex flex-wrap gap-2 pt-1">
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="form.patchValue({ days: 15 })">
              {{ 'patchValue({ days: 15 })' }}
            </button>
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="fillAll()">
              {{ "setValue({ …todos })" }}
            </button>
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="form.reset()">reset()</button>
          </div>
          <label class="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" class="size-4 accent-challenge" [checked]="asText()" (change)="asText.set(!asText())" />
            Trocar o campo de dias para <code class="font-mono">type="text"</code>
          </label>
        </form>

        <pre data-state class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">form.value = {{ form.value | json }}

dirty: {{ form.dirty }}     (alguém mudou algo)
touched: {{ form.touched }}   (alguém entrou e saiu de um campo)

typeof days: {{ typeOfDays() }}</pre>
      </div>
      <p data-announce aria-live="polite" class="sr-only">dirty: {{ form.dirty }}. Dias: {{ form.value.days }}.</p>
    </figure>
  `,
})
export class FormSim {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly asText = signal(false);

  protected readonly form = this.formBuilder.group({
    country: '',
    days: 7,
    companion: '',
  });

  protected typeOfDays(): string {
    return typeof this.form.value.days;
  }

  protected fillAll(): void {
    this.form.setValue({ country: 'Japão', days: 12, companion: 'Ana' });
  }
}
