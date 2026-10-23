import { TestBed } from '@angular/core/testing';
import { FolderSorter } from './folder-sorter';

describe('FolderSorter', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(FolderSorter);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const place = async (piece: string, folder: string) => {
      const select = element.querySelector<HTMLSelectElement>(`select[data-piece="${piece}"]`)!;
      select.value = folder;
      select.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };
    const verdict = (piece: string) => element.querySelector(`[data-verdict="${piece}"]`)!.textContent!;
    const summary = () => element.querySelector('[data-summary]')!.textContent!;
    return { place, verdict, summary };
  };

  it('starts with nothing in place', async () => {
    const { summary } = await render();
    expect(summary()).toContain('0 de 10');
  });

  it('counts every piece put in the right folder', async () => {
    const { place, summary } = await render();
    const answers: Record<string, string> = {
      header: 'core', footer: 'core', 'not-found': 'core', countries: 'core',
      'flag-pipe': 'shared', panel: 'shared',
      'country-list': 'features/countries', 'country-page': 'features/country-detail',
      'country-weather': 'features/country-detail', 'about-page': 'features/about',
    };
    for (const [piece, folder] of Object.entries(answers)) await place(piece, folder);
    expect(summary()).toContain('10 de 10');
  });

  it('a piece used by two features, inside one of them, breaks the rule', async () => {
    const { place, verdict } = await render();
    await place('flag-pipe', 'features/countries');
    expect(verdict('flag-pipe')).toContain('uma feature importando outra');
  });

  it('the header inside a feature works, but is in the wrong place', async () => {
    const { place, verdict } = await render();
    await place('header', 'features/countries');
    expect(verdict('header')).toContain('Funciona, mas');
  });
});
