import { RenderMode, ServerRoute } from '@angular/ssr';
import { TRACKS } from './catalog/catalog';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'trilhas/:trilha',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => TRACKS.map((track) => ({ trilha: track.id })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
