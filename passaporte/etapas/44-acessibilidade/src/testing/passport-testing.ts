import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { COUNTRIES_URL, Passport, PASSPORTS_URL, TRIPS_URL } from '../app/core/passport';
import { SUPABASE } from '../app/core/supabase';
import { Trip } from '../app/core/trip';
import { createFakeSupabase, fakeSession } from './fake-supabase';

/** Seis países, com os dados no formato da API do livro. */
export const SAMPLE_COUNTRIES = [
  { code: 'BR', name: 'Brasil', capital: 'Brasília', population: 214211951, lat: -15.7939, lon: -47.8828 },
  { code: 'JP', name: 'Japão', capital: 'Tóquio', population: 123802000, lat: 35.6894, lon: 139.6917 },
  { code: 'PT', name: 'Portugal', capital: 'Lisboa', population: 10347892, lat: 38.7253, lon: -9.15 },
  { code: 'IT', name: 'Itália', capital: 'Roma', population: 58850717, lat: 41.8933, lon: 12.4828 },
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', population: 47327407, lat: -34.6033, lon: -58.3817 },
  { code: 'CA', name: 'Canadá', capital: 'Ottawa', population: 36991981, lat: 45.4247, lon: -75.695 },
];

/** A linha da tabela passports, como a API do Supabase devolve (sem o user_id, que o app não pede). */
export const SAMPLE_PASSPORT = { visited: ['BR', 'PT', 'AR'], notes: {} as Record<string, string> };

/** As requisições do Passport, pelo método e pela tabela (a URL tem também os parâmetros do Supabase). */
export const passportsGet = (r: { url: string; method: string }) => r.url === PASSPORTS_URL && r.method === 'GET';
export const passportsUpsert = (r: { url: string; method: string }) => r.url === PASSPORTS_URL && r.method === 'POST';
export const tripsRequest = (method: string) => (r: { url: string; method: string }) => r.url === TRIPS_URL && r.method === method;

/** O que veio na requisição, para conferir os parâmetros do Supabase (id=eq.1, select, order). */
export const paramsOf = (request: TestRequest) => Object.fromEntries(request.request.params.keys().map((k) => [k, request.request.params.get(k)]));

/**
 * Cria o Passport com a Ana logada e responde, no lugar da rede, às três requisições dele: os países, o passaporte e
 * as viagens. Os httpResource só pedem os dados quando o Angular roda os efeitos (o TestBed.tick), e só entregam a
 * resposta depois que o app se estabiliza (o whenStable). Chame antes de qualquer inject.
 */
export async function startPassport(
  countries = SAMPLE_COUNTRIES,
  saved: typeof SAMPLE_PASSPORT | null = SAMPLE_PASSPORT,
  trips: Trip[] = [],
): Promise<Passport> {
  localStorage.clear();
  TestBed.overrideProvider(SUPABASE, { useValue: createFakeSupabase({ session: fakeSession() }).client });
  const passport = TestBed.inject(Passport);
  TestBed.tick();
  const http = TestBed.inject(HttpTestingController);
  http.expectOne(COUNTRIES_URL).flush(countries);
  http.expectOne(passportsGet).flush(saved ? [saved] : []);
  http.expectOne(tripsRequest('GET')).flush(trips);
  await TestBed.inject(ApplicationRef).whenStable();
  return passport;
}
