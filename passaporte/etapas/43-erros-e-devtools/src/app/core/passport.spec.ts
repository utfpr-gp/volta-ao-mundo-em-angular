import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { createFakeSupabase, fakeSession, FakeSupabase } from '../../testing/fake-supabase';
import { SUPABASE } from './supabase';
import { paramsOf, passportsGet, passportsUpsert, SAMPLE_PASSPORT, startPassport, tripsRequest } from '../../testing/passport-testing';
import { copyKey, COUNTRIES_URL, Passport } from './passport';
import { Trip } from './trip';

const JAPAN: Trip = { id: 1, country: 'JP', arrival: '2026-10-01', days: 10, transport: 'aviao', companion: '' };

describe('Passport', () => {
  /** Pedido só quando precisa: o overrideProvider de cada teste tem de vir antes do primeiro inject. */
  const http = { expectOne: (...a: Parameters<HttpTestingController['expectOne']>) => TestBed.inject(HttpTestingController).expectOne(...a),
    expectNone: (...a: Parameters<HttpTestingController['expectNone']>) => TestBed.inject(HttpTestingController).expectNone(...a) };
  const stable = () => TestBed.inject(ApplicationRef).whenStable();

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClientTesting()] });
  });

  afterEach(() => vi.useRealTimers());

  describe('without anyone signed in', () => {
    beforeEach(() => TestBed.overrideProvider(SUPABASE, { useValue: createFakeSupabase().client }));

    it('asks only for the countries: the passport and the trips stay idle', async () => {
      const passport = TestBed.inject(Passport);
      TestBed.tick();
      http.expectOne(COUNTRIES_URL).flush([]);
      http.expectNone(passportsGet);
      http.expectNone(tripsRequest('GET'));
      await stable();
      expect(passport.visitedCount()).toBe(0);
      expect(passport.trips()).toEqual([]);
    });

    it('marks a country only in this visit, and sends nothing', async () => {
      const passport = TestBed.inject(Passport);
      TestBed.tick();
      http.expectOne(COUNTRIES_URL).flush([]);
      passport.toggleVisited('JP');
      expect(passport.visitedCount()).toBe(1);
      http.expectNone(passportsUpsert);
    });
  });

  it('merges the countries of the API with the visited ones of the saved passport', async () => {
    const passport = await startPassport();
    expect(passport.countries()).toHaveLength(6);
    expect(passport.find('BR')?.visited).toBe(true);
    expect(passport.find('JP')?.visited).toBe(false);
    expect(passport.visitedCount()).toBe(3);
  });

  it('asks Supabase for the right columns, and for the trips from the most recent', async () => {
    TestBed.overrideProvider(SUPABASE, { useValue: createFakeSupabase({ session: fakeSession() }).client });
    TestBed.inject(Passport);
    TestBed.tick();
    http.expectOne(COUNTRIES_URL).flush([]);
    expect(paramsOf(http.expectOne(passportsGet))).toEqual({ select: 'visited,notes' });
    expect(paramsOf(http.expectOne(tripsRequest('GET')))).toEqual({ select: 'id,country,arrival,days,transport,companion', order: 'arrival.desc' });
  });

  it('starts empty when the person has no passport saved yet', async () => {
    const passport = await startPassport(undefined, null);
    expect(passport.visitedCount()).toBe(0);
  });

  it('goes to the error state when the API of countries fails, and reload() asks again', async () => {
    TestBed.overrideProvider(SUPABASE, { useValue: createFakeSupabase().client });
    const passport = TestBed.inject(Passport);
    TestBed.tick();
    http.expectOne(COUNTRIES_URL).flush('fora do ar', { status: 503, statusText: 'Service Unavailable' });
    await stable();
    expect(passport.catalog.status()).toBe('error');
    passport.reloadCountries();
    TestBed.tick();
    http.expectOne(COUNTRIES_URL).flush([]);
    await stable();
    expect(passport.catalog.status()).toBe('resolved');
  });

  it('saves the passport with an upsert: POST with resolution=merge-duplicates', async () => {
    const passport = await startPassport();
    passport.toggleVisited('JP');
    const request = http.expectOne(passportsUpsert);
    expect(request.request.headers.get('Prefer')).toBe('resolution=merge-duplicates');
    expect(request.request.body).toEqual({ visited: ['BR', 'PT', 'AR', 'JP'], notes: {} });
    request.flush(null, { status: 201, statusText: 'Created' });
  });

  it('keeps working in memory when Supabase does not answer', async () => {
    const passport = await startPassport();
    passport.toggleVisited('JP');
    http.expectOne(passportsUpsert).error(new ProgressEvent('error'));
    expect(passport.visitedCount()).toBe(4);
  });

  it('saves a note only after the typing stops, and survives a failed save', async () => {
    const passport = await startPassport();
    vi.useFakeTimers();
    passport.saveNote('jp', 'primeira');
    vi.advanceTimersByTime(500);
    http.expectOne(passportsUpsert).error(new ProgressEvent('error'));
    passport.saveNote('jp', 'Comer lámen');
    vi.advanceTimersByTime(500);
    expect(http.expectOne(passportsUpsert).request.body).toEqual({ visited: ['BR', 'PT', 'AR'], notes: { JP: 'Comer lámen' } });
    expect(passport.note('JP')).toBe('Comer lámen');
  });

  it('hides a country from the list only in memory: the resource goes to the local state', async () => {
    const passport = await startPassport();
    passport.remove('CA');
    expect(passport.find('CA')).toBeUndefined();
    expect(passport.catalog.status()).toBe('local');
    http.expectNone(passportsUpsert);
  });

  it('does not let anyone outside write to the resource (checked by TypeScript)', async () => {
    const passport = await startPassport();
    // @ts-expect-error: o catalog exposto é um Resource somente leitura, sem set
    const attempt = () => passport.catalog.set([]);
    expect(attempt).toBeTypeOf('function');
  });

  describe('the diary of trips (CRUD)', () => {
    it('C: creates a trip without the id, asks for the created row, and marks the country as visited', async () => {
      const passport = await startPassport();
      const { id: _, ...newTrip } = JAPAN;
      const done = passport.addTrip(newTrip);
      const request = http.expectOne(tripsRequest('POST'));
      expect(request.request.body).toEqual(newTrip);
      expect(request.request.headers.get('Prefer')).toBe('return=representation');
      request.flush([JAPAN], { status: 201, statusText: 'Created' });
      await done;
      expect(passport.trips()).toEqual([JAPAN]);
      expect(passport.find('JP')?.visited).toBe(true);
      http.expectOne(passportsUpsert).flush(null);
    });

    it('R: reads the trips of whoever signed in', async () => {
      const passport = await startPassport(undefined, undefined, [JAPAN]);
      expect(passport.trips()).toEqual([JAPAN]);
    });

    it('U: changes a trip with PATCH, the id in the filter and not in the body', async () => {
      const passport = await startPassport(undefined, undefined, [JAPAN]);
      const done = passport.updateTrip({ ...JAPAN, days: 12 });
      const request = http.expectOne(tripsRequest('PATCH'));
      expect(paramsOf(request)).toEqual({ id: 'eq.1', select: 'id,country,arrival,days,transport,companion' });
      expect(request.request.body).not.toHaveProperty('id');
      expect(request.request.body.days).toBe(12);
      request.flush([{ ...JAPAN, days: 12 }]);
      await done;
      expect(passport.trips()[0].days).toBe(12);
    });

    it('D: deletes a trip with the id in the filter', async () => {
      const passport = await startPassport(undefined, undefined, [JAPAN]);
      const done = passport.deleteTrip(1);
      const request = http.expectOne(tripsRequest('DELETE'));
      expect(paramsOf(request)).toEqual({ id: 'eq.1' });
      request.flush(null, { status: 204, statusText: 'No Content' });
      await done;
      expect(passport.trips()).toEqual([]);
    });

    it('keeps the trip when the delete fails, and lets the caller know', async () => {
      const passport = await startPassport(undefined, undefined, [JAPAN]);
      const done = passport.deleteTrip(1);
      http.expectOne(tripsRequest('DELETE')).error(new ProgressEvent('error'));
      await expect(done).rejects.toBeTruthy();
      expect(passport.trips()).toEqual([JAPAN]);
    });
  });

  describe('signing in and out', () => {
    let fake: FakeSupabase;

    beforeEach(() => {
      fake = createFakeSupabase();
      TestBed.overrideProvider(SUPABASE, { useValue: fake.client });
    });

    it('asks for the passport when the person signs in, and forgets it when they sign out', async () => {
      const passport = TestBed.inject(Passport);
      TestBed.tick();
      http.expectOne(COUNTRIES_URL).flush([]);
      http.expectNone(passportsGet);

      fake.emit('SIGNED_IN', fakeSession());
      TestBed.tick();
      http.expectOne(passportsGet).flush([SAMPLE_PASSPORT]);
      http.expectOne(tripsRequest('GET')).flush([JAPAN]);
      await stable();
      expect(passport.visitedCount()).toBe(3);
      expect(passport.trips()).toEqual([JAPAN]);

      fake.emit('SIGNED_OUT', null);
      TestBed.tick();
      expect(passport.visitedCount()).toBe(0);
      expect(passport.trips()).toEqual([]);
    });
  });

  describe('copy in the browser (effect)', () => {
    it('keeps a copy of the passport in localStorage, under the key of whoever signed in', async () => {
      const passport = await startPassport();
      expect(JSON.parse(localStorage.getItem(copyKey('u1'))!)).toEqual(SAMPLE_PASSPORT);
      passport.toggleVisited('JP');
      http.expectOne(passportsUpsert).flush(null);
      TestBed.tick();
      expect(JSON.parse(localStorage.getItem(copyKey('u1'))!).visited).toEqual(['BR', 'PT', 'AR', 'JP']);
    });

    it('with Supabase off, starts from the copy of that person, and never from the copy of another', async () => {
      localStorage.setItem(copyKey('u1'), JSON.stringify({ visited: ['IT'], notes: { IT: 'Coliseu' } }));
      localStorage.setItem(copyKey('outra'), JSON.stringify({ visited: ['CA', 'BR'], notes: {} }));
      TestBed.overrideProvider(SUPABASE, { useValue: createFakeSupabase({ session: fakeSession() }).client });
      const passport = TestBed.inject(Passport);
      TestBed.tick();
      http.expectOne(COUNTRIES_URL).flush([]);
      http.expectOne(passportsGet).error(new ProgressEvent('error'));
      http.expectOne(tripsRequest('GET')).error(new ProgressEvent('error'));
      await stable();
      expect(passport.visitedCount()).toBe(1);
      expect(passport.note('IT')).toBe('Coliseu');
    });

    it('ignores a broken copy', async () => {
      localStorage.setItem(copyKey('u1'), '{ isto não é JSON');
      TestBed.overrideProvider(SUPABASE, { useValue: createFakeSupabase({ session: fakeSession() }).client });
      const passport = TestBed.inject(Passport);
      expect(passport.visitedCount()).toBe(0);
    });
  });
});
