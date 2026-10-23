import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { COUNTRIES_URL, Passport, PASSPORT_URL } from '../app/core/passport';

/** Seis países, com os dados no formato da API do livro. */
export const SAMPLE_COUNTRIES = [
  { code: 'BR', name: 'Brasil', capital: 'Brasília', population: 214211951 },
  { code: 'JP', name: 'Japão', capital: 'Tóquio', population: 123802000 },
  { code: 'PT', name: 'Portugal', capital: 'Lisboa', population: 10347892 },
  { code: 'IT', name: 'Itália', capital: 'Roma', population: 58850717 },
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', population: 47327407 },
  { code: 'CA', name: 'Canadá', capital: 'Ottawa', population: 36991981 },
];

export const SAMPLE_PASSPORT = { visited: ['BR', 'PT', 'AR'], notes: {} as Record<string, string> };

/** Responde, no lugar da rede, às duas requisições que o Passport faz ao nascer. */
export function answerPassportRequests(countries = SAMPLE_COUNTRIES, saved = SAMPLE_PASSPORT): void {
  const http = TestBed.inject(HttpTestingController);
  http.expectOne(COUNTRIES_URL).flush(countries);
  http.expectOne(PASSPORT_URL).flush(saved);
}

/** Cria o Passport e já responde às requisições dele, antes de qualquer tela pedir o service. */
export function startPassport(countries = SAMPLE_COUNTRIES, saved = SAMPLE_PASSPORT): Passport {
  const passport = TestBed.inject(Passport);
  answerPassportRequests(countries, saved);
  return passport;
}
