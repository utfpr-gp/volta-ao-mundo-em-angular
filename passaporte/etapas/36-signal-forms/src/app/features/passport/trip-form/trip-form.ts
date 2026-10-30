import { Component, inject, signal } from '@angular/core';
import { FieldTree, form, FormField, FormRoot, max, maxLength, min, pattern, required } from '@angular/forms/signals';
import { Passport } from '../../../core/passport';
import { Transport, Trip } from '../../../core/trip';
import { NAME_PATTERN, notInFuture, today } from './trip-validators';

/** A viagem em branco: é com ela que o formulário começa, e é para ela que ele volta depois de registrar. */
function blankTrip(): Trip {
  return { country: '', arrival: today(), days: 7, transport: 'aviao', companion: '' };
}

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-trip-form',
  templateUrl: './trip-form.html',
})
export class TripForm {
  protected readonly passport = inject(Passport);

  protected readonly transports: { value: Transport; label: string }[] = [
    { value: 'aviao', label: '✈️ Avião' },
    { value: 'onibus', label: '🚌 Ônibus' },
    { value: 'carro', label: '🚗 Carro' },
    { value: 'navio', label: '🚢 Navio' },
  ];

  protected readonly today = today();

  /** O modelo: um signal comum, com a viagem que está sendo preenchida. */
  protected readonly trip = signal<Trip>(blankTrip()); // [!code highlight]

  /** O formulário: o form() espelha o modelo, campo por campo, e o schema diz as regras de cada um. */
  protected readonly tripForm = form(
    this.trip, // [!code highlight]
    (path) => {
      required(path.country, { message: 'Escolha para qual país você viajou.' });
      required(path.arrival, { message: 'Informe a data de chegada.' });
      notInFuture(path.arrival, { message: 'A chegada não pode ser depois de hoje: o diário guarda viagens que já aconteceram.' });
      required(path.days, { message: 'Diga quantos dias durou a viagem.' });
      min(path.days, 1, { message: 'A viagem tem de durar de 1 a 365 dias.' });
      max(path.days, 365, { message: 'A viagem tem de durar de 1 a 365 dias.' });
      maxLength(path.companion, 40, { message: 'Use no máximo 40 letras.' });
      pattern(path.companion, NAME_PATTERN, {
        message: 'Use só letras, espaços, apóstrofo e hífen, como em "Ana Maria" ou "Pedro d\'Ávila".',
      });
    },
    {
      submission: {
        // Só roda quando todas as regras passam. É async porque devolve uma Promise: com um servidor, a chamada entraria aqui.
        action: async (field) => { // [!code highlight]
          this.passport.addTrip(field().value());
          field().reset(blankTrip());
        },
      },
    },
  );

  /** A mensagem de um campo: a do primeiro erro, quando ele é inválido e a pessoa já passou por ele. */
  protected errorOf(field: FieldTree<unknown>): string | undefined {
    const state = field();
    return state.invalid() && state.touched() ? state.errors()[0]?.message : undefined;
  }
}
