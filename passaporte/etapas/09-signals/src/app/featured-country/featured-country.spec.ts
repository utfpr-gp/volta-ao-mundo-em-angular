import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedCountry } from './featured-country';

describe('FeaturedCountry', () => {
  let component: FeaturedCountry;
  let fixture: ComponentFixture<FeaturedCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCountry],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedCountry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles the visited button on click', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const button = element.querySelector('button')!;
    expect(button.textContent).toContain('Marcar como visitado');
    button.click();
    await fixture.whenStable();
    expect(button.textContent).toContain('Visitado ✓');
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
  });
});
