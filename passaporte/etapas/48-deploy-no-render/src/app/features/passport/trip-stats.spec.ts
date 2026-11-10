import { Trip } from '../../core/trip';
import { tripStats } from './trip-stats';

/** Uma viagem com o mínimo: só o que cada teste precisa mudar. */
const trip = (country: string, days: number, transport: Trip['transport']): Trip => ({
  country,
  arrival: '2026-01-01',
  days,
  transport,
  companion: '',
});

describe('tripStats', () => {
  it('starts at zero, with no favorite transport, when there is no trip', () => {
    expect(tripStats([])).toEqual({ count: 0, days: 0, countries: 0, favorite: null });
  });

  it('adds up the days of every trip', () => {
    // Arrange: prepare os dados
    const trips = [trip('JP', 12, 'aviao'), trip('PT', 5, 'aviao')];
    // Act: chame o que está sendo testado
    const stats = tripStats(trips);
    // Assert: confira o resultado
    expect(stats.days).toBe(17);
  });

  it('counts a country visited twice only once', () => {
    const stats = tripStats([trip('JP', 3, 'aviao'), trip('JP', 4, 'navio'), trip('PT', 5, 'carro')]);
    expect(stats.count).toBe(3);
    expect(stats.countries).toBe(2);
  });

  it('picks the transport used the most', () => {
    const stats = tripStats([trip('JP', 3, 'navio'), trip('PT', 4, 'aviao'), trip('IT', 5, 'navio')]);
    expect(stats.favorite).toBe('navio');
  });

  it('has no favorite when two transports tie', () => {
    const stats = tripStats([trip('JP', 3, 'navio'), trip('PT', 4, 'aviao')]);
    expect(stats.favorite).toBeNull();
  });
});
