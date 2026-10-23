import { TestBed } from '@angular/core/testing';
import { Passport } from './passport';

describe('Passport', () => {
  let passport: Passport;

  beforeEach(() => {
    passport = TestBed.inject(Passport);
  });

  it('starts with the six countries, three of them visited', () => {
    expect(passport.countries()).toHaveLength(6);
    expect(passport.visitedCount()).toBe(3);
  });

  it('is the same object for everyone who injects it', () => {
    expect(TestBed.inject(Passport)).toBe(passport);
  });

  it('marks and unmarks a country, and the count follows', () => {
    passport.toggleVisited('JP');
    expect(passport.find('JP')?.visited).toBe(true);
    expect(passport.visitedCount()).toBe(4);
    passport.toggleVisited('jp');
    expect(passport.find('JP')?.visited).toBe(false);
  });

  it('removes a country', () => {
    passport.remove('CA');
    expect(passport.find('CA')).toBeUndefined();
    expect(passport.countries()).toHaveLength(5);
  });

  it('keeps one note per country', () => {
    passport.saveNote('JP', 'Comer lámen');
    expect(passport.note('JP')).toBe('Comer lámen');
    expect(passport.note('PT')).toBe('');
  });

  it('does not let anyone outside change the countries directly', () => {
    expect('set' in passport.countries).toBe(false);
  });
});
