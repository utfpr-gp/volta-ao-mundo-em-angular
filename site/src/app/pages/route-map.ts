import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TRACKS, chaptersOfTrack } from '../catalog/catalog';
import { ProgressService } from '../progress/progress';

interface Point {
  x: number;
  y: number;
}

/** As paradas da viagem, uma por trilha, na ordem do livro. */
const STOPS: Point[] = [
  { x: 60, y: 330 },
  { x: 150, y: 262 },
  { x: 92, y: 172 },
  { x: 196, y: 108 },
  { x: 308, y: 160 },
  { x: 372, y: 72 },
  { x: 480, y: 118 },
  { x: 512, y: 230 },
  { x: 430, y: 318 },
];

/** Um caminho suave (Catmull-Rom convertido em curvas de Bézier) que passa por todos os pontos. */
export function smoothPath(points: Point[]): string {
  const [first, ...rest] = points;
  let d = `M ${first.x} ${first.y}`;
  for (let i = 0; i < rest.length; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const ROUTE = smoothPath(STOPS);

/** O mapa da volta ao mundo: as nove trilhas como paradas de uma rota de avião. */
@Component({
  selector: 'vm-route-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  styles: `
    .plane {
      offset-rotate: auto;
      offset-distance: 0%;
    }
    @media (prefers-reduced-motion: no-preference) {
      .plane {
        animation: fly 18s ease-in-out infinite;
      }
      .route {
        animation: dash 1.4s linear infinite;
      }
    }
    @keyframes fly {
      0% { offset-distance: 0%; opacity: 0; }
      4% { opacity: 1; }
      92% { opacity: 1; }
      100% { offset-distance: 100%; opacity: 0; }
    }
    @keyframes dash {
      to { stroke-dashoffset: -24; }
    }
  `,
  template: `
    <svg viewBox="0 0 580 400" class="h-auto w-full" role="img" aria-label="Mapa da viagem: as nove trilhas do livro, do Embarque à Produção">
      <defs>
        <pattern id="mapa-grade" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" class="stroke-on-primary/10" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="580" height="400" rx="24" fill="url(#mapa-grade)" />
      <g class="text-on-primary/10" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="290" cy="200" r="150" />
        <ellipse cx="290" cy="200" rx="62" ry="150" />
        <path d="M140 200h300M160 130h260M160 270h260" />
      </g>
      <path [attr.d]="route" fill="none" class="route stroke-highlight" stroke-width="3" stroke-dasharray="8 4" stroke-linecap="round" />
      @for (stop of stops(); track stop.id) {
        <g [attr.transform]="'translate(' + stop.x + ' ' + stop.y + ')'">
          <circle r="25" class="fill-primary-soft" [class]="stop.visited ? 'stroke-highlight' : 'stroke-on-primary/40'" stroke-width="3" />
          <text y="8" font-size="22" text-anchor="middle">{{ stop.emoji }}</text>
          <text y="44" font-size="13" font-weight="800" text-anchor="middle" class="fill-on-primary">{{ stop.name }}</text>
        </g>
      }
      <g class="plane" [style.offset-path]="planePath">
        <g transform="rotate(90) translate(-14 -14)">
          <path
            d="M14 1.5c1.3 0 2.2 1.4 2.2 3v6.3l9.3 5.4v2.6l-9.3-2.8v5.3l2.8 2.1V26L14 24.6 9 26v-2.6l2.8-2.1V16l-9.3 2.8v-2.6l9.3-5.4V4.5c0-1.6.9-3 2.2-3Z"
            class="fill-on-primary"
          />
        </g>
      </g>
    </svg>
  `,
})
export class RouteMap {
  private readonly progress = inject(ProgressService);
  protected readonly route = ROUTE;
  protected readonly planePath = `path('${ROUTE}')`;
  protected readonly stops = computed(() => {
    const stamps = this.progress.stamps();
    return TRACKS.map((track, index) => ({
      ...STOPS[index],
      id: track.id,
      emoji: track.emoji,
      name: track.name,
      visited: chaptersOfTrack(track.id).some((chapter) => chapter.slug in stamps),
    }));
  });
}
