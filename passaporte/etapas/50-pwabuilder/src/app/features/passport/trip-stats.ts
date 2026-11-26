import { Transport, Trip } from '../../core/trip';

/** O resumo do diário: quantas viagens, quantos dias fora, quantos países diferentes e o transporte favorito. */
export interface TripStats {
  count: number;
  days: number;
  countries: number;
  /** O transporte usado mais vezes; null se não há viagem ou se dois empatam. */
  favorite: Transport | null;
}

/** Uma função pura: o mesmo diário dá sempre o mesmo resumo, sem ler nem mudar nada fora dela. */
export function tripStats(trips: Trip[]): TripStats {
  const uses = new Map<Transport, number>();
  for (const trip of trips) uses.set(trip.transport, (uses.get(trip.transport) ?? 0) + 1);

  const ranking = [...uses.entries()].sort((a, b) => b[1] - a[1]);
  const tie = ranking.length > 1 && ranking[0][1] === ranking[1][1];

  return {
    count: trips.length,
    days: trips.reduce((total, trip) => total + trip.days, 0),
    countries: new Set(trips.map((trip) => trip.country)).size,
    favorite: ranking.length && !tie ? ranking[0][0] : null,
  };
}
