import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

type RuleId = 'ancorada' | 'sem-ancoras' | 'flag-g';
type MomentId = 'sempre' | 'ao-sair' | 'ao-enviar';

const RULES: { id: RuleId; label: string; code: string; pattern: RegExp }[] = [
  { id: 'ancorada', label: 'Com ^ e $', code: "/^[\\p{L} '-]*$/u", pattern: /^[\p{L} '-]*$/u },
  { id: 'sem-ancoras', label: 'Sem ^ e $', code: "/[\\p{L} '-]+/u", pattern: /[\p{L} '-]+/u },
  { id: 'flag-g', label: 'Com a flag g', code: "/^[\\p{L} '-]+$/gu", pattern: /^[\p{L} '-]+$/gu },
];

const MOMENTS: { id: MomentId; label: string }[] = [
  { id: 'sempre', label: 'Sempre' },
  { id: 'ao-sair', label: 'Ao sair do campo (touched)' },
  { id: 'ao-enviar', label: 'Ao tentar enviar' },
];

/** Simulador do capítulo 35: um FormControl de verdade com Validators.pattern, a regra e a hora da mensagem à escolha. */
@Component({
  selector: 'vm-validation-sim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, JsonPipe],
  host: { class: 'not-prose my-8 block' },
  template: `
    <figure class="rounded-[22px] border border-inside/30 bg-inside/6 p-4 sm:p-6">
      <figcaption class="mb-5">
        <span class="block text-xs font-extrabold uppercase tracking-[0.18em] text-inside">Simulador</span>
        <span class="block text-xl font-extrabold text-ink">A regra e a hora da mensagem</span>
        <span class="mt-1 block max-w-2xl text-ink-muted">
          Um campo de verdade, com Validators.pattern. Troque a regra, escolha quando a mensagem aparece e experimente nomes como
          "Ana Maria", "Ana2" ou "Pedro d'Ávila".
        </span>
      </figcaption>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-4 rounded-2xl border border-line bg-surface-raised p-4 text-ink">
          <fieldset>
            <legend class="text-sm font-bold">A regra</legend>
            <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              @for (rule of rules; track rule.id) {
                <label class="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="rule" class="size-4 accent-challenge" [checked]="ruleId() === rule.id" (change)="chooseRule(rule.id)" />
                  {{ rule.label }}
                </label>
              }
            </div>
            <code class="mt-1 block font-mono text-xs text-ink-muted">Validators.pattern({{ currentRule().code }})</code>
          </fieldset>

          <fieldset>
            <legend class="text-sm font-bold">Quando a mensagem aparece</legend>
            <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              @for (moment of moments; track moment.id) {
                <label class="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" name="moment" class="size-4 accent-challenge" [checked]="momentId() === moment.id" (change)="momentId.set(moment.id)" />
                  {{ moment.label }}
                </label>
              }
            </div>
          </fieldset>

          <div class="flex flex-col gap-1">
            <label for="sim-companion" class="text-sm font-bold">Com quem</label>
            <input
              id="sim-companion"
              [formControl]="companion"
              [attr.aria-invalid]="showMessage() || null"
              [attr.aria-describedby]="showMessage() ? 'sim-companion-error' : null"
              class="rounded-lg border bg-surface px-3 py-1.5"
              [class]="showMessage() ? 'border-pitfall' : 'border-line'"
            />
            @if (showMessage()) {
              <p id="sim-companion-error" class="text-sm font-bold text-pitfall">Use só letras, espaços, apóstrofo e hífen.</p>
            }
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" class="rounded-full border border-line px-3 py-1 text-xs font-bold" (click)="submitted.set(true)">Tentar enviar</button>
            <button type="button" class="rounded-full border border-line px-3 py-1 font-mono text-xs font-bold" (click)="validateAgain()">
              updateValueAndValidity()
            </button>
            <button type="button" class="rounded-full border border-line px-3 py-1 text-xs font-bold" (click)="startOver()">Recomeçar</button>
          </div>
        </div>

        <pre data-state class="overflow-x-auto rounded-2xl bg-terminal p-4 font-mono text-xs leading-relaxed text-terminal-ink">value:   {{ companion.value | json }}
status:  {{ companion.status }}
errors:  {{ companion.errors | json }}

touched: {{ companion.touched }}   (já saiu do campo)
dirty:   {{ companion.dirty }}   (já digitou algo)
enviou:  {{ submitted() }}

validações deste valor: {{ validations() }}</pre>
      </div>
      <p data-announce aria-live="polite" class="sr-only">
        {{ companion.status === 'VALID' ? 'Válido' : 'Inválido' }}. {{ showMessage() ? 'Mensagem de erro à mostra.' : 'Sem mensagem.' }}
      </p>
    </figure>
  `,
})
export class ValidationSim {
  protected readonly rules = RULES;
  protected readonly moments = MOMENTS;
  protected readonly ruleId = signal<RuleId>('ancorada');
  protected readonly momentId = signal<MomentId>('ao-sair');
  protected readonly submitted = signal(false);
  /** Quantas vezes o mesmo valor foi validado: com a flag g, o resultado alterna a cada vez. */
  protected readonly validations = signal(1);

  protected readonly companion = new FormControl('', { nonNullable: true, validators: Validators.pattern(RULES[0].pattern) });

  constructor() {
    this.companion.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.validations.set(1));
  }

  protected currentRule() {
    return RULES.find((rule) => rule.id === this.ruleId())!;
  }

  protected showMessage(): boolean {
    if (this.companion.valid) {
      return false;
    }
    switch (this.momentId()) {
      case 'sempre':
        return true;
      case 'ao-sair':
        return this.companion.touched;
      case 'ao-enviar':
        return this.submitted();
    }
  }

  protected chooseRule(id: RuleId): void {
    this.ruleId.set(id);
    this.companion.setValidators(Validators.pattern(this.currentRule().pattern));
    this.companion.updateValueAndValidity();
    this.validations.set(1);
  }

  protected validateAgain(): void {
    // updateValueAndValidity roda os validadores de novo, com o mesmo valor.
    this.companion.updateValueAndValidity({ emitEvent: false });
    this.validations.update((count) => count + 1);
  }

  protected startOver(): void {
    this.companion.reset();
    this.submitted.set(false);
    this.validations.set(1);
  }
}
