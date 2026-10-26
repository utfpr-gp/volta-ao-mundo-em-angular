import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Passport, PASSPORT_URL } from '../../../core/passport';
import { startPassport } from '../../../../testing/passport-testing';
import { TripForm } from './trip-form';

describe('TripForm', () => {
  let fixture: ComponentFixture<TripForm>;
  let element: HTMLElement;
  let passport: Passport;
  const field = <T extends HTMLElement>(name: string) => element.querySelector<T>(`[formControlName="${name}"]`)!;
  // Num rádio com formControlName, o [value] vai para a diretiva do formulário, e não para o HTML: acha-se pelo texto.
  const radio = (label: string) =>
    [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!;
  const type = (name: string, value: string) => {
    const input = field<HTMLInputElement | HTMLSelectElement>(name);
    input.value = value;
    input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input'));
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    passport = await startPassport();
    fixture = TestBed.createComponent(TripForm);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('starts with today as the arrival, 7 days and by plane', () => {
    const today = new Date();
    const expected = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
    expect(field<HTMLInputElement>('arrival').value).toBe(expected);
    expect(field<HTMLInputElement>('days').value).toBe('7');
    expect(radio('Avião').checked).toBe(true);
  });

  it('lists the countries of the passport in the select', () => {
    const options = [...field<HTMLSelectElement>('country').options].map((option) => option.textContent!.trim());
    expect(options).toContain('Japão');
    expect(options).toHaveLength(7);
  });

  it('sends the typed values to the passport, marks the country and starts over', async () => {
    type('country', 'JP');
    type('arrival', '2026-04-03');
    type('days', '12');
    radio('Navio').click();
    type('companion', 'Ana');
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(passport.trips()).toEqual([{ country: 'JP', arrival: '2026-04-03', days: 12, transport: 'navio', companion: 'Ana' }]);
    expect(passport.find('JP')?.visited).toBe(true);
    expect(TestBed.inject(HttpTestingController).expectOne(PASSPORT_URL).request.body.trips).toHaveLength(1);
    expect(field<HTMLInputElement>('days').value).toBe('7');
    expect(field<HTMLSelectElement>('country').value).toBe('');
  });
});
