import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Passport } from '../../../core/passport';
import { Transport } from '../../../core/trip';
import { NAME_PATTERN, notInFuture, today } from './trip-validators';

/** Os campos que podem mostrar uma mensagem de erro. */
type CheckedField = 'country' | 'arrival' | 'days' | 'companion';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-trip-form',
  templateUrl: './trip-form.html',
})
export class TripForm {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly passport = inject(Passport);

  protected readonly transports: { value: Transport; label: string }[] = [
    { value: 'aviao', label: '✈️ Avião' },
    { value: 'onibus', label: '🚌 Ônibus' },
    { value: 'carro', label: '🚗 Carro' },
    { value: 'navio', label: '🚢 Navio' },
  ];

  protected readonly today = today();

  /** Cada campo agora tem, ao lado do valor inicial, a lista das regras que ele precisa cumprir. */
  protected readonly form = this.formBuilder.group({
    country: ['', Validators.required], // [!code highlight]
    arrival: [today(), [Validators.required, notInFuture]], // [!code highlight]
    days: [7, [Validators.required, Validators.min(1), Validators.max(365)]], // [!code highlight]
    transport: 'aviao' as Transport,
    companion: ['', [Validators.maxLength(40), Validators.pattern(NAME_PATTERN)]], // [!code highlight]
  });

  /** A mensagem de um campo aparece quando ele tem um erro e a pessoa já passou por ele. */
  protected showError(field: CheckedField): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    // O botão desligado é a primeira barreira; este if é a garantia.
    if (this.form.invalid) {
      return;
    }
    this.passport.addTrip(this.form.getRawValue());
    this.form.reset();
  }
}
