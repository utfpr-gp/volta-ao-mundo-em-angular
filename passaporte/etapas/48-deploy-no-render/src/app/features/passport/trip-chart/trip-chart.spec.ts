import { TestBed } from '@angular/core/testing';
import { Trip } from '../../../core/trip';
import { daysPerYear, TripChart } from './trip-chart';

const trip = (arrival: string, days: number): Trip => ({ country: 'JP', arrival, days, transport: 'aviao', companion: '' });

describe('daysPerYear', () => {
  it('adds up the days of each year, from the oldest', () => {
    expect(daysPerYear([trip('2026-04-03', 12), trip('2025-07-10', 5), trip('2026-06-01', 3)])).toEqual([
      { year: '2025', days: 5 },
      { year: '2026', days: 15 },
    ]);
  });
});

describe('TripChart', () => {
  // O jsdom não desenha: sem canvas, o getContext devolve null (aqui, sem o aviso que o jsdom imprimiria).
  beforeEach(() => vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null));
  afterEach(() => vi.restoreAllMocks());

  it('gives screen readers the same data in a table (jsdom has no canvas to draw)', async () => {
    const fixture = TestBed.createComponent(TripChart);
    fixture.componentRef.setInput('trips', [trip('2025-07-10', 5), trip('2026-04-03', 12)]);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('canvas')!.getAttribute('aria-hidden')).toBe('true');
    const rows = [...element.querySelectorAll('[data-chart-table] tbody tr')].map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent).join(' '));
    expect(rows).toEqual(['2025 5', '2026 12']);
  });
});
