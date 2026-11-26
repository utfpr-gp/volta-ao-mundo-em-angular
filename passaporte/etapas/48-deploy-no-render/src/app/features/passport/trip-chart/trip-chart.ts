import { afterNextRender, Component, computed, DestroyRef, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import { Trip } from '../../../core/trip';

// Só as peças do Chart.js que o gráfico de barras usa: o resto da biblioteca fica fora do pacote.
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

/** Dias fora de casa em cada ano, do mais antigo ao mais recente. */
export function daysPerYear(trips: Trip[]): { year: string; days: number }[] {
  const totals = new Map<string, number>();
  for (const trip of trips) {
    const year = trip.arrival.slice(0, 4);
    totals.set(year, (totals.get(year) ?? 0) + trip.days);
  }
  return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([year, days]) => ({ year, days }));
}

/** O gráfico das viagens: dias fora de casa por ano. Pesado por causa do Chart.js, e por isso carregado com @defer. */
@Component({
  selector: 'app-trip-chart',
  templateUrl: './trip-chart.html',
})
export class TripChart {
  readonly trips = input.required<Trip[]>();
  protected readonly years = computed(() => daysPerYear(this.trips()));

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart?: Chart<'bar'>;

  constructor() {
    afterNextRender(() => {
      // No navegador de mentira dos testes (jsdom), não há canvas para desenhar: a tabela continua lá.
      const context = this.canvas().nativeElement.getContext('2d');
      if (!context) return;
      const color = (token: string) => getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      this.chart = new Chart(context, {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Dias fora', data: [], backgroundColor: color('--color-highlight') }] },
        options: {
          animation: matchMedia('(prefers-reduced-motion: reduce)').matches ? false : undefined,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: color('--color-ink-muted') }, grid: { display: false } },
            y: { beginAtZero: true, ticks: { color: color('--color-ink-muted'), precision: 0 }, grid: { color: color('--color-line') } },
          },
        },
      });
      this.update();
    });

    // Quando o diário muda, o gráfico acompanha.
    effect(() => {
      this.years();
      this.update();
    });
    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }

  private update(): void {
    if (!this.chart) return;
    this.chart.data.labels = this.years().map((y) => y.year);
    this.chart.data.datasets[0].data = this.years().map((y) => y.days);
    this.chart.update();
  }
}
