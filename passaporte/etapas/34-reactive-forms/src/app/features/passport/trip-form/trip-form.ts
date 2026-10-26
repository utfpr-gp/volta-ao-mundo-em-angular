import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Passport } from '../../../core/passport';
import { Transport } from '../../../core/trip';

/** A data de hoje no fuso de quem usa o app, no formato que o campo de data espera: AAAA-MM-DD. */
function today(): string {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

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

  /** O formulário: um FormGroup com um FormControl para cada campo, cada um com o seu valor inicial. */
  protected readonly form = this.formBuilder.group({
    country: '',
    arrival: today(),
    days: 7,
    transport: 'aviao' as Transport,
    companion: '',
  });

  protected submit(): void {
    this.passport.addTrip(this.form.getRawValue());
    // Com o NonNullableFormBuilder, o reset volta aos valores iniciais, e não a null.
    this.form.reset();
  }
}
