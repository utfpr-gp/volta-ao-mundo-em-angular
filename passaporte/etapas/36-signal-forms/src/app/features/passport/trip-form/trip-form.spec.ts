import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Passport, PASSPORT_URL } from '../../../core/passport';
import { startPassport } from '../../../../testing/passport-testing';
import { TripForm } from './trip-form';

describe('TripForm', () => {
  let fixture: ComponentFixture<TripForm>;
  let element: HTMLElement;
  let passport: Passport;
  const field = <T extends HTMLElement>(name: string) => element.querySelector<T>(`#trip-${name}`)!;
  // Com [formField], o [value] do rádio vai para o HTML: dá para achar o rádio pelo valor.
  const radio = (value: string) => element.querySelector<HTMLInputElement>(`input[type="radio"][value="${value}"]`)!;
  const button = () => element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const error = (name: string) => element.querySelector(`#trip-${name}-error`)?.textContent?.trim();
  const type = (name: string, value: string) => {
    const input = field<HTMLInputElement | HTMLSelectElement>(name);
    input.value = value;
    // O [formField] escuta o evento input, que o navegador dispara também no select.
    input.dispatchEvent(new Event('input'));
  };
  /** Sair do campo: é o blur que marca o campo como tocado. */
  const leave = (name: string) => field(name).dispatchEvent(new Event('blur'));

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
    expect(radio('aviao').checked).toBe(true);
  });

  it('turns the schema rules into the HTML attributes of each field', () => {
    expect(field('country').hasAttribute('required')).toBe(true);
    expect(field('days').getAttribute('min')).toBe('1');
    expect(field('days').getAttribute('max')).toBe('365');
    expect(field('companion').getAttribute('maxlength')).toBe('40');
    expect(element.querySelector('form')!.hasAttribute('novalidate')).toBe(true);
  });

  it('starts with the button off and the hint, but with no error message', () => {
    expect(button().disabled).toBe(true);
    expect(element.querySelector('#trip-form-hint')).not.toBeNull();
    expect(element.querySelectorAll('[id$="-error"]')).toHaveLength(0);
  });

  it('shows the country message only after leaving the field empty', async () => {
    leave('country');
    await fixture.whenStable();
    expect(error('country')).toBe('Escolha para qual país você viajou.');
    expect(field('country').getAttribute('aria-invalid')).toBe('true');
    expect(field('country').getAttribute('aria-describedby')).toBe('trip-country-error');
  });

  it('explains the days rule: required, then from 1 to 365', async () => {
    type('days', '');
    leave('days');
    await fixture.whenStable();
    expect(error('days')).toBe('Diga quantos dias durou a viagem.');
    type('days', '0');
    await fixture.whenStable();
    expect(error('days')).toBe('A viagem tem de durar de 1 a 365 dias.');
    type('days', '400');
    await fixture.whenStable();
    expect(error('days')).toBe('A viagem tem de durar de 1 a 365 dias.');
    type('days', '12');
    await fixture.whenStable();
    expect(error('days')).toBeUndefined();
  });

  it('refuses an arrival in the future', async () => {
    type('arrival', '2999-01-01');
    leave('arrival');
    await fixture.whenStable();
    expect(error('arrival')).toContain('não pode ser depois de hoje');
  });

  it('accepts names with accents and apostrophes, and refuses digits in the companion', async () => {
    type('companion', 'Ana2');
    leave('companion');
    await fixture.whenStable();
    expect(error('companion')).toContain('Use só letras');
    type('companion', "João d'Ávila");
    await fixture.whenStable();
    expect(error('companion')).toBeUndefined();
    type('companion', 'A'.repeat(41));
    await fixture.whenStable();
    expect(error('companion')).toBe('Use no máximo 40 letras.');
  });

  it('turns the button on when the form is valid, sends the trip and starts over', async () => {
    type('country', 'JP');
    type('arrival', '2026-04-03');
    type('days', '12');
    radio('navio').click();
    type('companion', 'Ana');
    await fixture.whenStable();
    expect(button().disabled).toBe(false);
    expect(element.querySelector('#trip-form-hint')).toBeNull();
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(passport.trips()).toEqual([{ country: 'JP', arrival: '2026-04-03', days: 12, transport: 'navio', companion: 'Ana' }]);
    expect(passport.find('JP')?.visited).toBe(true);
    expect(TestBed.inject(HttpTestingController).expectOne(PASSPORT_URL).request.body.trips).toHaveLength(1);
    expect(field<HTMLInputElement>('days').value).toBe('7');
    expect(field<HTMLSelectElement>('country').value).toBe('');
    expect(radio('aviao').checked).toBe(true);
    // O reset devolve os campos a "não tocados": nenhuma mensagem fica na tela.
    expect(element.querySelectorAll('[id$="-error"]')).toHaveLength(0);
  });

  it('does not send an invalid trip, but marks the fields so the messages show up', async () => {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(passport.trips()).toEqual([]);
    expect(error('country')).toBe('Escolha para qual país você viajou.');
  });
});
