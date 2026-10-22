import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { PAGEFIND_LOADER } from '../search/search';
import { fakePagefind } from '../search/fake-pagefind';
import { SearchPage } from './search-page';

const PAGES = [
  { url: '/capitulos/01-o-que-e-o-angular/', title: 'O que é o Angular', excerpt: 'uma <mark>SPA</mark> carrega uma vez' },
];

describe('SearchPage', () => {
  const render = async (loader: () => Promise<unknown>, q?: string) => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: PAGEFIND_LOADER, useValue: loader }] });
    const fixture = TestBed.createComponent(SearchPage);
    if (q) fixture.componentRef.setInput('q', q);
    await fixture.whenStable();
    return fixture;
  };
  const text = (fixture: { nativeElement: HTMLElement }) => fixture.nativeElement.textContent!.replace(/\s+/g, ' ');

  it('says "A busca funciona no site publicado." when the index cannot be loaded', async () => {
    const fixture = await render(() => Promise.reject(new Error('404')), 'spa');
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(text(fixture)).toContain('A busca funciona no site publicado.');
    });
  });

  it('?q= on load fills the field and runs the search', async () => {
    const fixture = await render(async () => fakePagefind(PAGES), 'spa');
    await vi.waitFor(async () => {
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector<HTMLInputElement>('input[type="search"]')!.value).toBe('spa');
      expect(element.querySelector('ol a')?.getAttribute('href')).toBe('/capitulos/01-o-que-e-o-angular');
      expect(element.querySelector('ol mark')?.textContent).toBe('SPA');
    });
  });

  it('empty result → friendly message pointing to the glossary', async () => {
    const fixture = await render(async () => fakePagefind(PAGES), 'xyzw');
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(text(fixture)).toContain('Nada encontrado para “xyzw”. Tente outra palavra ou veja o glossário.');
    });
  });

  it('typing updates ?q= without adding history entries', async () => {
    const fixture = await render(async () => fakePagefind(PAGES));
    vi.useFakeTimers();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input[type="search"]')!;
    input.value = 'spa';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(400);
    vi.useRealTimers();
    expect(navigate).toHaveBeenCalledWith([], expect.objectContaining({ queryParams: { q: 'spa' }, replaceUrl: true }));
  });
});
