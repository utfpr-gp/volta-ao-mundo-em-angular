import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { startPassport } from '../../../../testing/passport-testing';
import { Passport } from '../../../core/passport';
import { PassportPage } from './passport-page';

describe('PassportPage', () => {
  it('shows the stamps of the passport, and follows its changes', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    await startPassport();
    const fixture = TestBed.createComponent(PassportPage);
    await fixture.whenStable();
    const footer = () => (fixture.nativeElement as HTMLElement).querySelector('footer')!.textContent!;
    expect(footer()).toContain('3 de 6 carimbos');
    TestBed.inject(Passport).toggleVisited('JP');
    await fixture.whenStable();
    expect(footer()).toContain('4 de 6 carimbos');
  });

  it('shows the diary, newest trip first', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    await startPassport(undefined, {
      visited: ['JP', 'PT'],
      notes: {},
      trips: [
        { country: 'PT', arrival: '2025-07-10', days: 5, transport: 'aviao', companion: '' },
        { country: 'JP', arrival: '2026-04-03', days: 12, transport: 'navio', companion: 'Ana' },
      ],
    });
    const fixture = TestBed.createComponent(PassportPage);
    await fixture.whenStable();
    const items = [...(fixture.nativeElement as HTMLElement).querySelectorAll('section li')].map((li) => li.textContent!.replace(/\s+/g, ' ').trim());
    expect(items[0]).toContain('Japão');
    expect(items[0]).toContain('03/04/2026 · 12 dias · 🚢 navio · com Ana');
    expect(items[1]).toContain('Portugal');
  });
});
