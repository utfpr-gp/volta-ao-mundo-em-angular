import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { BRAZILIAN_LOCALE } from '../../core/locale';
import { COUNTRIES_URL, Passport } from '../../core/passport';
import { SUPABASE } from '../../core/supabase';
import { createFakeSupabase } from '../../../testing/fake-supabase';
import { SAMPLE_COUNTRIES } from '../../../testing/passport-testing';

/** Sem o startPassport: aqui o teste decide quando os países chegam, para ver o resolver esperando. */
describe('countryResolver', () => {
  let harness: RouterTestingHarness;
  const element = () => harness.routeNativeElement as HTMLElement | null;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        BRAZILIAN_LOCALE,
        provideHttpClientTesting(),
        { provide: SUPABASE, useValue: createFakeSupabase().client },
      ],
    });
    TestBed.inject(Passport);
    harness = await RouterTestingHarness.create();
  });

  it('opens the page only after the countries arrive, already with the name in the title', async () => {
    let done = false;
    const navigation = harness.navigateByUrl('/paises/JP').then(() => (done = true));
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(done).toBe(false);
    expect(TestBed.inject(Router).url).toBe('/');

    TestBed.inject(HttpTestingController).expectOne(COUNTRIES_URL).flush(SAMPLE_COUNTRIES);
    await navigation;
    expect(element()?.querySelector('h1')?.textContent).toContain('Japão');
    expect(TestBed.inject(Title).getTitle()).toBe('Japão · Passaporte');
  });

  it('does not ask again: the second country opens at once', async () => {
    const first = harness.navigateByUrl('/paises/JP');
    await new Promise((resolve) => setTimeout(resolve));
    TestBed.inject(HttpTestingController).expectOne(COUNTRIES_URL).flush(SAMPLE_COUNTRIES);
    await first;
    await harness.navigateByUrl('/paises/BR');
    TestBed.inject(HttpTestingController).expectNone(COUNTRIES_URL);
    expect(element()?.querySelector('h1')?.textContent).toContain('Brasil');
  });

  it('opens the page with an explanation when the API of countries fails', async () => {
    const navigation = harness.navigateByUrl('/paises/JP');
    await new Promise((resolve) => setTimeout(resolve));
    TestBed.inject(HttpTestingController).expectOne(COUNTRIES_URL).flush('fora do ar', { status: 503, statusText: 'Service Unavailable' });
    await navigation;
    await TestBed.inject(ApplicationRef).whenStable();
    expect(element()?.textContent).toContain('Não foi possível carregar os países');
    expect(element()?.querySelector('nav')).toBeNull();
  });
});
