import { TestBed } from '@angular/core/testing';
import { fakePagefind } from './fake-pagefind';
import { PAGEFIND_LOADER, SearchService, toRouterPath } from './search';

describe('toRouterPath', () => {
  it('turns a Pagefind URL into a router path, with or without the base path', () => {
    expect(toRouterPath('/capitulos/09-signals/', '/volta-ao-mundo-em-angular/')).toBe('/capitulos/09-signals');
    expect(toRouterPath('/volta-ao-mundo-em-angular/glossario/', '/volta-ao-mundo-em-angular/')).toBe('/glossario');
    expect(toRouterPath('/', '/')).toBe('/');
  });
});

describe('SearchService', () => {
  it('loader failure → available false and search returns nothing', async () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PAGEFIND_LOADER, useValue: () => Promise.reject(new Error('404')) }],
    });
    const service = TestBed.inject(SearchService);
    expect(await service.search('signals')).toEqual([]);
    expect(service.available()).toBe(false);
  });

  it('maps Pagefind results to SearchHit with a router path and the title', async () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PAGEFIND_LOADER,
          useValue: async () =>
            fakePagefind([{ url: '/capitulos/09-signals/', title: 'Signals', excerpt: 'o <mark>signal</mark> guarda' }]),
        },
      ],
    });
    const service = TestBed.inject(SearchService);
    expect(await service.search('signal')).toEqual([
      { path: '/capitulos/09-signals', title: 'Signals', excerpt: 'o <mark>signal</mark> guarda' },
    ]);
    expect(service.available()).toBe(true);
  });

  it('a blank query returns nothing without searching', async () => {
    const api = fakePagefind([]);
    const search = vi.spyOn(api, 'search');
    TestBed.configureTestingModule({ providers: [{ provide: PAGEFIND_LOADER, useValue: async () => api }] });
    expect(await TestBed.inject(SearchService).search('   ')).toEqual([]);
    expect(search).not.toHaveBeenCalled();
  });
});
