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

  it('shows the country data from the class', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h2')?.textContent).toBe('Japão');
    expect(element.querySelector('img')?.getAttribute('src')).toBe('https://flagcdn.com/w160/jp.png');
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('Bandeira do Japão');
    expect(element.querySelector('button')?.disabled).toBe(false);
  });
});
