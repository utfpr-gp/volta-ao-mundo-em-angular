import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { COUNTRIES_URL, Passport, PASSPORT_URL } from '../app/core/passport';
import { Trip } from '../app/core/trip';

/** Seis países, com os dados no formato da API do livro. */
export const SAMPLE_COUNTRIES = [
  { code: 'BR', name: 'Brasil', capital: 'Brasília', population: 214211951, lat: -15.7939, lon: -47.8828 },
  { code: 'JP', name: 'Japão', capital: 'Tóquio', population: 123802000, lat: 35.6894, lon: 139.6917 },
  { code: 'PT', name: 'Portugal', capital: 'Lisboa', population: 10347892, lat: 38.7253, lon: -9.15 },
  { code: 'IT', name: 'Itália', capital: 'Roma', population: 58850717, lat: 41.8933, lon: 12.4828 },
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', population: 47327407, lat: -34.6033, lon: -58.3817 },
  { code: 'CA', name: 'Canadá', capital: 'Ottawa', population: 36991981, lat: 45.4247, lon: -75.695 },
];

export const SAMPLE_PASSPORT: { visited: string[]; notes: Record<string, string>; trips?: Trip[] } = {
  visited: ['BR', 'PT', 'AR'],
  notes: {},
};

/**
 * Cria o Passport e responde, no lugar da rede, às duas requisições dele. Os httpResource só pedem os dados quando o
 * Angular roda os efeitos (o TestBed.tick), e só entregam a resposta depois que o app se estabiliza (o whenStable).
 */
export async function startPassport(countries = SAMPLE_COUNTRIES, saved = SAMPLE_PASSPORT): Promise<Passport> {
  localStorage.clear();
  const passport = TestBed.inject(Passport);
  TestBed.tick();
  const http = TestBed.inject(HttpTestingController);
  http.expectOne(COUNTRIES_URL).flush(countries);
  http.expectOne(PASSPORT_URL).flush(saved);
  await TestBed.inject(ApplicationRef).whenStable();
  return passport;
}
