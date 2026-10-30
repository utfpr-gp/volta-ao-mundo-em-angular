import { FormControl, Validators } from '@angular/forms';
import { NAME_PATTERN, notInFuture, today } from './trip-validators';

describe('trip validators', () => {
  it('notInFuture accepts today and the past, and refuses tomorrow', () => {
    expect(new FormControl(today(), notInFuture).errors).toBeNull();
    expect(new FormControl('2020-02-29', notInFuture).errors).toBeNull();
    expect(new FormControl('2999-01-01', notInFuture).errors).toEqual({ futureDate: { max: today() } });
  });

  it('notInFuture leaves the empty field to Validators.required', () => {
    expect(new FormControl('', notInFuture).errors).toBeNull();
  });

  it('NAME_PATTERN accepts any alphabet, spaces, apostrophes, hyphens and the empty field', () => {
    for (const name of ['', 'Ana', 'Ana Maria', "Pedro d'Ávila", 'Jean-Luc', 'Zoë', 'Søren']) {
      expect(new FormControl(name, Validators.pattern(NAME_PATTERN)).errors, name).toBeNull();
    }
  });

  it('NAME_PATTERN refuses digits and symbols anywhere in the text', () => {
    for (const name of ['Ana2', '2Ana', 'Ana!', 'ana@mail.com']) {
      expect(new FormControl(name, Validators.pattern(NAME_PATTERN)).hasError('pattern'), name).toBe(true);
    }
  });
});
