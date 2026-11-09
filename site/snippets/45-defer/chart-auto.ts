// Tudo do Chart.js registrado de uma vez: trip-chart com 208,22 kB
import Chart from 'chart.js/auto';

// Só o que o gráfico de barras usa: trip-chart com 153,73 kB
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);
