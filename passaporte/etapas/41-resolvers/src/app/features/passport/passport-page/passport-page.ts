import { DatePipe } from '@angular/common';
import { Component, computed, inject, viewChild } from '@angular/core';
import { Passport } from '../../../core/passport';
import { Trip } from '../../../core/trip';
import { FlagPipe } from '../../../shared/flag-pipe';
import { StampBook } from '../stamp-book/stamp-book';
import { TripForm } from '../trip-form/trip-form';

const TRANSPORT_LABELS = { aviao: '✈️ avião', onibus: '🚌 ônibus', carro: '🚗 carro', navio: '🚢 navio' };

@Component({
  imports: [StampBook, TripForm, DatePipe, FlagPipe],
  selector: 'app-passport-page',
  templateUrl: './passport-page.html',
})
export class PassportPage {
  protected readonly passport = inject(Passport);
  protected readonly transportLabels = TRANSPORT_LABELS;
  private readonly form = viewChild.required(TripForm);

  /** O diário, da viagem mais recente para a mais antiga, com o nome de cada país. */
  protected readonly diary = computed(() =>
    [...this.passport.trips()]
      .sort((a, b) => b.arrival.localeCompare(a.arrival))
      .map((trip) => ({ trip, name: this.passport.find(trip.country)?.name ?? trip.country })),
  );

  protected edit(trip: Trip): void {
    this.form().edit(trip);
  }

  protected async remove(trip: Trip): Promise<void> {
    try {
      await this.passport.deleteTrip(trip.id!);
    } catch {
      // O aviso de que o Supabase não respondeu é do errorInterceptor; a viagem continua no diário.
    }
  }
}
