import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { startPassport, tripsRequest } from '../../../../testing/passport-testing';
import { Passport } from '../../../core/passport';
import { Trip } from '../../../core/trip';
import { PassportPage } from './passport-page';

const PORTUGAL: Trip = { id: 1, country: 'PT', arrival: '2025-07-10', days: 5, transport: 'aviao', companion: '' };
const JAPAN: Trip = { id: 2, country: 'JP', arrival: '2026-04-03', days: 12, transport: 'navio', companion: 'Ana' };

describe('PassportPage', () => {
  const render = async (trips: Trip[] = []) => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    await startPassport(undefined, undefined, trips);
    const fixture = TestBed.createComponent(PassportPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const items = () => [...element.querySelector('section')!.querySelectorAll('li')].map((li) => li.textContent!.replace(/\s+/g, ' ').trim());
    const button = (label: string) => element.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
    return { fixture, element, items, button };
  };

  it('shows the stamps of the passport, and follows its changes', async () => {
    const { fixture, element } = await render();
    const footer = () => element.querySelector('footer')!.textContent!;
    expect(footer()).toContain('3 de 6 carimbos');
    TestBed.inject(Passport).toggleVisited('JP');
    await fixture.whenStable();
    expect(footer()).toContain('4 de 6 carimbos');
  });

  it('shows the diary, newest trip first', async () => {
    const { items } = await render([PORTUGAL, JAPAN]);
    expect(items()[0]).toContain('Japão');
    expect(items()[0]).toContain('03/04/2026 · 12 dias · 🚢 navio · com Ana');
    expect(items()[1]).toContain('Portugal');
  });

  it('puts a trip in the form to edit, and moves the focus there', async () => {
    const { fixture, element, button } = await render([JAPAN]);
    button('Editar a viagem: Japão').click();
    await fixture.whenStable();
    expect(element.querySelector('app-trip-form h2')!.textContent).toContain('Editar viagem');
    expect(element.querySelector<HTMLInputElement>('#trip-days')!.value).toBe('12');
    expect(document.activeElement?.id).toBe('trip-country');
  });

  it('deletes a trip after Supabase confirms', async () => {
    const { fixture, items, button } = await render([PORTUGAL, JAPAN]);
    button('Apagar a viagem: Portugal').click();
    TestBed.inject(HttpTestingController).expectOne(tripsRequest('DELETE')).flush(null, { status: 204, statusText: 'No Content' });
    await fixture.whenStable();
    expect(items()).toHaveLength(1);
    expect(items()[0]).toContain('Japão');
  });

  it('keeps the trip when the delete fails', async () => {
    const { fixture, items, button } = await render([JAPAN]);
    button('Apagar a viagem: Japão').click();
    TestBed.inject(HttpTestingController).expectOne(tripsRequest('DELETE')).error(new ProgressEvent('error'));
    await fixture.whenStable();
    expect(items()[0]).toContain('Japão');
  });
});
