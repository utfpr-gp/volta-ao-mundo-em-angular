import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SAMPLE_PASSPORT, startPassport } from '../../testing/passport-testing';
import { COUNTRIES_URL, Passport, PASSPORT_URL } from './passport';

describe('Passport', () => {
  let http: HttpTestingController;
  const stable = () => TestBed.inject(ApplicationRef).whenStable();

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => vi.useRealTimers());

  it('is loading until the countries and the saved passport arrive', async () => {
    const passport = TestBed.inject(Passport);
    TestBed.tick();
    expect(passport.catalog.isLoading()).toBe(true);
    http.expectOne(COUNTRIES_URL).flush([]);
    http.expectOne(PASSPORT_URL).flush(SAMPLE_PASSPORT);
    await stable();
    expect(passport.catalog.status()).toBe('resolved');
  });

  it('merges the countries of the API with the visited ones of the saved passport', async () => {
    const passport = await startPassport();
    expect(passport.countries()).toHaveLength(6);
    expect(passport.find('BR')?.visited).toBe(true);
    expect(passport.find('JP')?.visited).toBe(false);
    expect(passport.visitedCount()).toBe(3);
  });

  it('goes to the error state when the API fails, and reload() asks again', async () => {
    const passport = TestBed.inject(Passport);
    TestBed.tick();
    http.expectOne(COUNTRIES_URL).flush('fora do ar', { status: 503, statusText: 'Service Unavailable' });
    http.expectOne(PASSPORT_URL).flush(SAMPLE_PASSPORT);
    await stable();
    expect(passport.catalog.status()).toBe('error');
    expect(passport.countries()).toEqual([]);
    passport.reloadCountries();
    TestBed.tick();
    http.expectOne(COUNTRIES_URL).flush([]);
    await stable();
    expect(passport.catalog.status()).toBe('resolved');
  });

  it('saves the whole passport with PUT when a country is marked', async () => {
    const passport = await startPassport();
    passport.toggleVisited('JP');
    const request = http.expectOne(PASSPORT_URL);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ visited: ['BR', 'PT', 'AR', 'JP'], notes: {} });
    request.flush(request.request.body);
    expect(passport.saveFailed()).toBe(false);
  });

  it('warns when the local server is off, and keeps working in memory', async () => {
    const passport = TestBed.inject(Passport);
    TestBed.tick();
    http.expectOne(COUNTRIES_URL).flush([]);
    http.expectOne(PASSPORT_URL).error(new ProgressEvent('error'));
    await stable();
    expect(passport.saveFailed()).toBe(true);
    passport.toggleVisited('JP');
    http.expectOne(PASSPORT_URL).error(new ProgressEvent('error'));
    expect(passport.visitedCount()).toBe(1);
    expect(passport.saveFailed()).toBe(true);
  });

  it('saves a note only after the typing stops, and survives a failed save', async () => {
    const passport = await startPassport();
    vi.useFakeTimers();
    passport.saveNote('jp', 'primeira');
    vi.advanceTimersByTime(500);
    http.expectOne(PASSPORT_URL).error(new ProgressEvent('error'));
    passport.saveNote('jp', 'Comer lámen');
    vi.advanceTimersByTime(500);
    expect(http.expectOne(PASSPORT_URL).request.body).toEqual({ visited: ['BR', 'PT', 'AR'], notes: { JP: 'Comer lámen' } });
    expect(passport.note('JP')).toBe('Comer lámen');
  });

  it('hides a country from the list only in memory: the resource goes to the local state', async () => {
    const passport = await startPassport();
    passport.remove('CA');
    expect(passport.find('CA')).toBeUndefined();
    expect(passport.catalog.status()).toBe('local');
    http.expectNone(PASSPORT_URL);
  });

  it('does not let anyone outside write to the resource (checked by TypeScript)', async () => {
    const passport = await startPassport();
    // @ts-expect-error: o catalog exposto é um Resource somente leitura, sem set
    const attempt = () => passport.catalog.set([]);
    expect(attempt).toBeTypeOf('function');
  });
});
