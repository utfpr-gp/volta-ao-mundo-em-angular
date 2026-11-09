import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, pattern } from '@angular/forms/signals';
import { NAME_PATTERN, notInFuture, today } from './trip-validators';

/** Um formulário de um campo só, com a regra que se quer testar. O form() precisa de um contexto de injeção. */
function arrivalForm(value: string) {
  return TestBed.runInInjectionContext(() => form(signal(value), (path) => notInFuture(path, { message: 'no futuro' })));
}

function nameForm(value: string) {
  return TestBed.runInInjectionContext(() => form(signal(value), (path) => pattern(path, NAME_PATTERN)));
}

describe('trip validators', () => {
  it('notInFuture accepts today and the past, and refuses tomorrow', () => {
    expect(arrivalForm(today())().errors()).toEqual([]);
    expect(arrivalForm('2020-02-29')().errors()).toEqual([]);
    expect(arrivalForm('2999-01-01')().errors()).toEqual([expect.objectContaining({ kind: 'futureDate', message: 'no futuro' })]);
  });

  it('notInFuture leaves the empty field to required', () => {
    expect(arrivalForm('')().valid()).toBe(true);
  });

  it('NAME_PATTERN accepts any alphabet, spaces, apostrophes, hyphens and the empty field', () => {
    for (const name of ['', 'Ana', 'Ana Maria', "Pedro d'Ávila", 'Jean-Luc', 'Zoë', 'Søren']) {
      expect(nameForm(name)().valid(), name).toBe(true);
    }
  });

  it('NAME_PATTERN refuses digits and symbols anywhere in the text', () => {
    for (const name of ['Ana2', '2Ana', 'Ana!', 'ana@mail.com']) {
      expect(nameForm(name)().getError('pattern'), name).toBeDefined();
    }
  });
});
