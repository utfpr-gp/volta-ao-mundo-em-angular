import { BRAZILIAN_LOCALE } from './core/locale';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './core/http/auth-interceptor';
import { errorInterceptor } from './core/http/error-interceptor';
import { loadingInterceptor } from './core/http/loading-interceptor';
import { COUNTRIES_URL } from './core/passport';
import { passportsGet, startPassport, tripsRequest } from '../testing/passport-testing';
import { createFakeSupabase, fakeSession, provideFakeSupabase } from '../testing/fake-supabase';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { ErrorReport } from './core/error-report';
import { routes } from './app.routes';

describe('App', () => {
  let harness: RouterTestingHarness;
  const text = () => (harness.routeNativeElement as HTMLElement).textContent!;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), BRAZILIAN_LOCALE, provideHttpClientTesting()] });
    await startPassport();
    harness = await RouterTestingHarness.create();
  });

  it('sends the empty address to the countries page', async () => {
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Title).getTitle()).toBe('Países · Passaporte');
    expect((harness.routeNativeElement as HTMLElement).querySelectorAll('app-country-card').length).toBe(6);
  });

  it('shows the about page at /sobre, with its own title', async () => {
    await harness.navigateByUrl('/sobre');
    expect(text()).toContain('Sobre o Passaporte');
    expect(TestBed.inject(Title).getTitle()).toBe('Sobre · Passaporte');
  });

  it('shows the not-found page for an address that does not exist', async () => {
    await harness.navigateByUrl('/paizes');
    expect(text()).toContain('Esta página não existe');
    expect(TestBed.inject(Title).getTitle()).toBe('Página não encontrada · Passaporte');
  });

  it('keeps the header and the footer around every page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-header')?.textContent).toContain('Passaporte');
    expect(element.querySelector('router-outlet')).not.toBeNull();
    expect(element.querySelector('app-footer')).not.toBeNull();
  });
});

describe('App with the interceptors of app.config', () => {
  it('shows the loading bar while the data comes, and the warning when Supabase does not answer', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        BRAZILIAN_LOCALE,
        provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
        provideFakeSupabase(createFakeSupabase({ session: fakeSession() })),
      ],
    });
    localStorage.clear();
    const fixture = TestBed.createComponent(App);
    const element = fixture.nativeElement as HTMLElement;
    // Com requisição pendente, o whenStable() esperaria para sempre: o tick() roda os efeitos e desenha a tela.
    TestBed.tick();
    await new Promise((resolve) => setTimeout(resolve)); // o authInterceptor espera a sessão antes de soltar o GET do passaporte
    const http = TestBed.inject(HttpTestingController);
    expect(element.querySelector('[role="progressbar"]')).not.toBeNull();

    http.expectOne(COUNTRIES_URL).flush([]);
    http.expectOne(passportsGet).error(new ProgressEvent('error'));
    http.expectOne(tripsRequest('GET')).error(new ProgressEvent('error'));
    await fixture.whenStable();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('O Supabase não respondeu');
  });
});

describe('App error warning', () => {
  it('shows the warning when the ErrorReport says so, and hides it with Fechar', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), BRAZILIAN_LOCALE, provideHttpClientTesting()] });
    await startPassport();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[role="alert"]')).toBeNull();

    TestBed.inject(ErrorReport).show();
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')!.textContent).toContain('Algo deu errado nesta tela');

    [...element.querySelectorAll('[role="alert"] button')].find((b) => b.textContent!.includes('Fechar'))!.dispatchEvent(new Event('click'));
    await fixture.whenStable();
    expect(element.querySelector('[role="alert"]')).toBeNull();
  });
});
