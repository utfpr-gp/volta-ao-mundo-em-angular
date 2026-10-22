import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProgressService } from '../progress/progress';
import { Passport } from './passport';

describe('Passport page', () => {
  const render = async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Passport);
    await fixture.whenStable();
    return fixture;
  };

  afterEach(() => localStorage.clear());

  it('lists the 9 tracks with one slot per chapter', async () => {
    const element = (await render()).nativeElement as HTMLElement;
    expect(element.querySelectorAll('[data-track]').length).toBe(9);
    expect(element.querySelectorAll('vm-stamp').length).toBe(50);
  });

  it('shows the count and the % of the world', async () => {
    const fixture = await render();
    const progress = TestBed.inject(ProgressService);
    progress.stamp('01-o-que-e-o-angular');
    progress.stamp('02-preparando-o-ambiente');
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
    expect(text).toContain('2 de 50 carimbos');
    expect(text).toContain('4% do mundo');
  });

  it('announces an error when importing an invalid file', async () => {
    const fixture = await render();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input[type="file"]')!;
    const file = new File(['isso não é json'], 'passaporte.json', { type: 'application/json' });
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    await vi.waitFor(async () => {
      await fixture.whenStable();
      const live = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
      expect(live?.textContent).toContain('Este arquivo não é um passaporte válido.');
    });
  });

  it('announces how many stamps were imported', async () => {
    const fixture = await render();
    const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input[type="file"]')!;
    const file = new File(
      [JSON.stringify({ version: 1, stamps: { '09-signals': '2026-10-01T10:00:00.000Z' } })],
      'meu-passaporte-angular.json',
    );
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));
    await vi.waitFor(async () => {
      await fixture.whenStable();
      const live = (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]');
      expect(live?.textContent).toContain('1 carimbo novo');
    });
  });
});
