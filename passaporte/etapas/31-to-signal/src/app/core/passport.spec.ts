import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { answerPassportRequests, SAMPLE_PASSPORT } from '../../testing/passport-testing';
import { COUNTRIES_URL, Passport, PASSPORT_URL } from './passport';

describe('Passport', () => {
  let passport: Passport;
  let http: HttpTestingController;

  beforeEach(() => {
    // Sem provideHttpClient(): no Angular 22, o HttpClient já está disponível. Só a rede é trocada pela de teste.
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    passport = TestBed.inject(Passport);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the countries and the saved passport, and is loading until they arrive', () => {
    expect(passport.status()).toBe('carregando');
    answerPassportRequests();
    expect(passport.status()).toBe('pronto');
    expect(passport.countries()).toHaveLength(6);
    expect(passport.find('BR')?.visited).toBe(true);
    expect(passport.find('JP')?.visited).toBe(false);
    expect(passport.visitedCount()).toBe(3);
  });

  it('shows an error when the countries do not arrive, and tries again on load()', () => {
    http.expectOne(COUNTRIES_URL).flush('fora do ar', { status: 503, statusText: 'Service Unavailable' });
    http.expectOne(PASSPORT_URL).flush(SAMPLE_PASSPORT);
    expect(passport.status()).toBe('erro');
    passport.load();
    expect(passport.status()).toBe('carregando');
    answerPassportRequests();
    expect(passport.status()).toBe('pronto');
  });

  it('saves the whole passport with PUT when a country is marked', () => {
    answerPassportRequests();
    passport.toggleVisited('JP');
    const request = http.expectOne(PASSPORT_URL);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ visited: ['BR', 'PT', 'AR', 'JP'], notes: {} });
    request.flush(request.request.body);
    expect(passport.saveFailed()).toBe(false);
  });

  it('warns when the local server is off, and keeps working in memory', () => {
    http.expectOne(COUNTRIES_URL).flush([]);
    http.expectOne(PASSPORT_URL).error(new ProgressEvent('error'));
    expect(passport.saveFailed()).toBe(true);
    passport.toggleVisited('JP');
    http.expectOne(PASSPORT_URL).error(new ProgressEvent('error'));
    expect(passport.visitedCount()).toBe(1);
  });

  it('keeps one note per country, and saves it only after the typing stops', () => {
    vi.useFakeTimers();
    answerPassportRequests();
    for (const text of ['C', 'Co', 'Com', 'Comer lámen']) {
      passport.saveNote('jp', text);
      vi.advanceTimersByTime(100);
    }
    expect(passport.note('JP')).toBe('Comer lámen');
    http.expectNone(PASSPORT_URL);
    vi.advanceTimersByTime(500);
    expect(http.expectOne(PASSPORT_URL).request.body).toEqual({ visited: ['BR', 'PT', 'AR'], notes: { JP: 'Comer lámen' } });
    vi.useRealTimers();
  });

  it('keeps saving notes after one save fails', () => {
    vi.useFakeTimers();
    answerPassportRequests();
    passport.saveNote('JP', 'primeira');
    vi.advanceTimersByTime(500);
    http.expectOne(PASSPORT_URL).error(new ProgressEvent('error'));
    expect(passport.saveFailed()).toBe(true);
    passport.saveNote('JP', 'segunda');
    vi.advanceTimersByTime(500);
    http.expectOne(PASSPORT_URL).flush({});
    expect(passport.saveFailed()).toBe(false);
    vi.useRealTimers();
  });

  it('cancels a note save still on its way when a newer one starts (switchMap)', () => {
    vi.useFakeTimers();
    answerPassportRequests();
    passport.saveNote('JP', 'primeira');
    vi.advanceTimersByTime(500);
    const first = http.expectOne(PASSPORT_URL);
    passport.saveNote('JP', 'segunda');
    vi.advanceTimersByTime(500);
    expect(first.cancelled).toBe(true);
    http.expectOne(PASSPORT_URL).flush({});
    vi.useRealTimers();
  });

  it('hides a country from the list only in memory, without saving', () => {
    answerPassportRequests();
    passport.remove('CA');
    expect(passport.find('CA')).toBeUndefined();
    http.expectNone(PASSPORT_URL);
  });
});
