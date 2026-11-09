import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
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
  protected readonly trip = signal<Trip>(blankTrip());
  /** Uma viagem que já tem id veio do banco: o formulário está editando, e não registrando. */
  protected readonly editing = computed(() => this.trip().id !== undefined);
  /** O último envio falhou (o Supabase não respondeu, ou recusou). */
  protected readonly saveFailed = signal(false);

  private readonly countrySelect = viewChild.required<ElementRef<HTMLSelectElement>>('country');

  /** O formulário: o form() espelha o modelo, campo por campo, e o schema diz as regras de cada um. */
  protected readonly tripForm = form(
    this.trip,
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
        // Só roda quando todas as regras passam. Agora há um servidor: o action espera a resposta dele.
        action: async (field) => {
          const trip = field().value();
          try {
            await (this.editing() ? this.passport.updateTrip(trip) : this.passport.addTrip(trip));
            this.saveFailed.set(false);
            field().reset(blankTrip());
          } catch {
            // O que a pessoa digitou fica no formulário, para ela tentar de novo.
            this.saveFailed.set(true);
          }
        },
      },
    },
  );

  /** Chamado pelo diário: põe a viagem no formulário, para editar, e leva o foco até ele. */
  edit(trip: Trip): void {
    this.tripForm().reset({ ...trip });
    this.saveFailed.set(false);
    this.countrySelect().nativeElement.focus();
  }

  /** Desiste da edição: o formulário volta a ser o de registrar. */
  protected cancel(): void {
    this.tripForm().reset(blankTrip());
    this.saveFailed.set(false);
  }

  /** A mensagem de um campo: a do primeiro erro, quando ele é inválido e a pessoa já passou por ele. */
  protected errorOf(field: FieldTree<unknown>): string | undefined {
    const state = field();
    return state.invalid() && state.touched() ? state.errors()[0]?.message : undefined;
  }
}
