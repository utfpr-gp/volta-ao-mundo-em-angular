import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Session } from '@supabase/supabase-js';
import { createFakeSupabase, fakeSession, provideFakeSupabase } from '../../../testing/fake-supabase';
import { API_URL } from '../api';
import { Auth } from '../auth';
import { environment } from '../../../environments/environment';
import { COUNTRIES_URL, PASSPORTS_URL } from '../passport';
import { ApiStatus } from './api-status';
import { authInterceptor } from './auth-interceptor';
import { errorInterceptor } from './error-interceptor';
import { Loading } from './loading';
import { loadingInterceptor } from './loading-interceptor';

describe('interceptors', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  /** O mesmo registro do app.config.ts; o provideHttpClientTesting vem depois e troca só a rede. */
  const setup = (session: Session | null = fakeSession(), fake = createFakeSupabase({ session })) => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor, errorInterceptor])),
        provideHttpClientTesting(),
        provideFakeSupabase(fake),
      ],
    });
    TestBed.inject(Auth);
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  };

  afterEach(() => backend.verify());

  /** O authInterceptor espera a sessão (uma Promise) antes de soltar a requisição para a API: deixe a Promise andar. */
  const settle = () => new Promise((resolve) => setTimeout(resolve));

  describe('authInterceptor', () => {
    it('sends the token of whoever signed in to the Passport API', async () => {
      setup();
      http.get(PASSPORTS_URL).subscribe();
      await settle();
      const request = backend.expectOne(PASSPORTS_URL);
      expect(request.request.headers.get('Authorization')).toBe('Bearer token-de-teste');
      expect(request.request.headers.get('apikey')).toBe(environment.supabasePublishableKey);
      request.flush({});
    });

    it('waits for the saved session to be read before sending the first request', async () => {
      const fake = createFakeSupabase({ manualStart: true });
      setup(null, fake);
      http.get(PASSPORTS_URL).subscribe();
      await settle();
      backend.expectNone(PASSPORTS_URL);

      fake.emit('INITIAL_SESSION', fakeSession());
      await settle();
      const request = backend.expectOne(PASSPORTS_URL);
      expect(request.request.headers.get('Authorization')).toBe('Bearer token-de-teste');
      request.flush({});
    });

    it('never sends the token to another site', async () => {
      setup();
      http.get(COUNTRIES_URL).subscribe();
      await settle();
      const request = backend.expectOne(COUNTRIES_URL);
      expect(request.request.headers.has('Authorization')).toBe(false);
      expect(request.request.headers.has('apikey')).toBe(false);
      request.flush([]);
    });

    it('sends only the project key when nobody signed in', async () => {
      setup(null);
      http.get(PASSPORTS_URL).subscribe();
      await settle();
      const request = backend.expectOne(PASSPORTS_URL);
      expect(request.request.headers.has('Authorization')).toBe(false);
      expect(request.request.headers.get('apikey')).toBe(environment.supabasePublishableKey);
      request.flush({});
    });

    it('does not trust a look-alike address', async () => {
      setup();
      http.get(`${API_URL}-falsa/passports`).subscribe();
      await settle();
      const request = backend.expectOne(`${API_URL}-falsa/passports`);
      expect(request.request.headers.has('Authorization')).toBe(false);
      request.flush({});
    });
  });

  describe('loadingInterceptor', () => {
    it('is busy while a request is on the way, and stops when the answer arrives', async () => {
      setup();
      const loading = TestBed.inject(Loading);
      expect(loading.busy()).toBe(false);
      http.get(COUNTRIES_URL).subscribe();
      http.get(PASSPORTS_URL).subscribe();
      expect(loading.busy()).toBe(true);
      await settle();
      backend.expectOne(COUNTRIES_URL).flush([]);
      expect(loading.busy()).toBe(true);
      backend.expectOne(PASSPORTS_URL).flush({});
      expect(loading.busy()).toBe(false);
    });

    it('stops on an error, too', async () => {
      setup();
      http.get(PASSPORTS_URL).subscribe({ error: () => {} });
      await settle();
      backend.expectOne(PASSPORTS_URL).error(new ProgressEvent('error'));
      expect(TestBed.inject(Loading).busy()).toBe(false);
    });

    it('stops when the request is canceled', async () => {
      setup();
      const subscription = http.get(PASSPORTS_URL).subscribe();
      await settle();
      const request = backend.expectOne(PASSPORTS_URL);
      subscription.unsubscribe();
      expect(request.cancelled).toBe(true);
      expect(TestBed.inject(Loading).busy()).toBe(false);
    });
  });

  describe('errorInterceptor', () => {
    it('marks the API as failed, and the caller still gets the error', async () => {
      setup();
      const errors: unknown[] = [];
      http.put(PASSPORTS_URL, {}).subscribe({ error: (error) => errors.push(error) });
      await settle();
      backend.expectOne(PASSPORTS_URL).error(new ProgressEvent('error'));
      expect(TestBed.inject(ApiStatus).failed()).toBe(true);
      expect(errors).toHaveLength(1);
    });

    it('clears the warning when the API answers again', async () => {
      setup();
      const status = TestBed.inject(ApiStatus);
      http.put(PASSPORTS_URL, {}).subscribe({ error: () => {} });
      await settle();
      backend.expectOne(PASSPORTS_URL).flush('fora do ar', { status: 500, statusText: 'Internal Server Error' });
      expect(status.failed()).toBe(true);
      http.put(PASSPORTS_URL, {}).subscribe();
      await settle();
      backend.expectOne(PASSPORTS_URL).flush({});
      expect(status.failed()).toBe(false);
    });

    it('does not blame the Passport API for another site', async () => {
      setup();
      http.get(COUNTRIES_URL).subscribe({ error: () => {} });
      await settle();
      backend.expectOne(COUNTRIES_URL).error(new ProgressEvent('error'));
      expect(TestBed.inject(ApiStatus).failed()).toBe(false);
    });
  });
});
