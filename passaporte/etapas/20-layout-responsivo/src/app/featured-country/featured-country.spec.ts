import { BRAZILIAN_LOCALE } from '../locale';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedCountry } from './featured-country';

describe('FeaturedCountry', () => {
  let component: FeaturedCountry;
  let fixture: ComponentFixture<FeaturedCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCountry],
      providers: [BRAZILIAN_LOCALE],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedCountry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the stamp only when visited (@if / @else)', async () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.stamp')).toBeNull();
    element.querySelector('button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.stamp')?.textContent).toContain('Carimbado');
    expect(element.querySelector('button.secondary')?.textContent).toContain('Desmarcar');
  });

  it('counts the letters while typing and saves the note on Enter', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector('input')!;
    input.value = 'Comer ramen';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(element.querySelector('.hint')?.textContent).toContain('11 letras');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();
    expect(element.querySelector('.saved')?.textContent).toContain('Comer ramen');
    expect(element.textContent).not.toContain('nenhuma ainda');
  });

  it('formats the population and the capital with pipes', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Capital: TÓQUIO · 123.000.000 habitantes');
  });

  it('keeps the rating in sync with the stars (two-way binding with model)', async () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector('button')!.click();
    await fixture.whenStable();
    element.querySelectorAll<HTMLButtonElement>('app-star-rating button')[2].click();
    await fixture.whenStable();
    expect(element.textContent).toContain('Sua nota: 3 de 5');
  });

  it('moves the focus to the note field after marking as visited (viewChild)', async () => {
    const element = fixture.nativeElement as HTMLElement;
    element.querySelector('button')!.click();
    await fixture.whenStable();
    expect(document.activeElement).toBe(element.querySelector('input'));
  });
});
