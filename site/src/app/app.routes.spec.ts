import { Route } from '@angular/router';
import { routes } from './app.routes';
import { ComingSoon } from './chapters/coming-soon';

const find = (path: string) => routes.find((route) => route.path === path) as Route;

describe('routes', () => {
  it('creates one route per chapter at capitulos/<slug>', () => {
    expect(routes.filter((route) => route.path?.startsWith('capitulos/')).length).toBe(50);
  });

  it('chapter route title is the plain question', () => {
    expect(find('capitulos/09-signals').title).toBe(
      'Como guardar estado que atualiza a tela com signal() e computed()?',
    );
  });

  it('chapter route data carries kind, slug and the catalog description', () => {
    const data = find('capitulos/09-signals').data!;
    expect(data['slug']).toBe('09-signals');
    expect(data['description']).toMatch(/signals/);
  });

  it('unpublished chapter routes load ComingSoon and have kind coming-soon', async () => {
    const route = find('capitulos/50-pwabuilder');
    expect(route.data!['kind']).toBe('coming-soon');
    expect(await route.loadComponent!()).toBe(ComingSoon);
  });

  it('has the pages in order and the wildcard last', () => {
    const pages = routes.map((route) => route.path).filter((path) => !path?.startsWith('capitulos/'));
    expect(pages).toEqual(['', 'passaporte', 'trilhas/:trilha', 'glossario', 'busca', 'sobre', '404', '**']);
  });

  it('every route has a description for the meta tags', () => {
    for (const route of routes) expect(route.data?.['description'], route.path).toBeTruthy();
  });

  it('404 and wildcard routes are of kind not-found', () => {
    expect(find('404').data!['kind']).toBe('not-found');
    expect(find('**').data!['kind']).toBe('not-found');
  });
});
