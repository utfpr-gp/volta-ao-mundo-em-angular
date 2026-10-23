import { BRAZILIAN_LOCALE } from '../../../core/locale';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Passport } from '../../../core/passport';
import { WorldProgress } from './world-progress';

describe('WorldProgress', () => {
  let fixture: ComponentFixture<WorldProgress>;
  let element: HTMLElement;
  let passport: Passport;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldProgress],
      providers: [BRAZILIAN_LOCALE, provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(WorldProgress);
    element = fixture.nativeElement as HTMLElement;
    passport = TestBed.inject(Passport);
    await fixture.whenStable();
  });

  it('counts the countries visited in the passport', () => {
    expect(element.querySelector('.big')?.textContent).toContain('3 de 195 países');
    expect(element.textContent).toContain('1,54% do mundo · faltam 192');
  });

  it('follows the passport when a country is marked somewhere else', async () => {
    passport.toggleVisited('JP');
    await fixture.whenStable();
    expect(element.querySelector('.big')?.textContent).toContain('4 de 195 países');
  });

  it('shows the empty message and the airport level when nothing is visited (@if and @switch)', async () => {
    for (const code of ['BR', 'PT', 'AR']) passport.toggleVisited(code);
    await fixture.whenStable();
    expect(element.querySelector('.big')?.textContent).toContain('Nenhum país ainda');
    expect(element.querySelector('.level')?.textContent).toContain('no aeroporto');
    expect((element.querySelector('.fill') as HTMLElement).style.width).toBe('0%');
  });

  it('links to the stamps page', () => {
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/passaporte');
  });
});
