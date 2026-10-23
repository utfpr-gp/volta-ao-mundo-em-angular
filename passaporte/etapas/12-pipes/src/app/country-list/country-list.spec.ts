import { BRAZILIAN_LOCALE } from '../locale';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryList } from './country-list';

describe('CountryList', () => {
  let fixture: ComponentFixture<CountryList>;
  let element: HTMLElement;
  const names = () => [...element.querySelectorAll('.card strong')].map((name) => name.textContent);
  const click = async (selector: string, index = 0) => {
    element.querySelectorAll<HTMLButtonElement>(selector)[index].click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CountryList] }).compileComponents();
    fixture = TestBed.createComponent(CountryList);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders one card per country with @for', () => {
    expect(names()).toEqual(['Brasil', 'Japão', 'Portugal', 'Itália', 'Argentina', 'Canadá']);
    expect(element.querySelector('.count')?.textContent).toContain('6 de 6 países');
  });

  it('filters the visited and the wishlist countries', async () => {
    await click('.filters button', 1);
    expect(names()).toEqual(['Brasil', 'Portugal', 'Argentina']);
    await click('.filters button', 2);
    expect(names()).toEqual(['Japão', 'Itália', 'Canadá']);
  });

  it('removes a country and shows @empty when nothing is left', async () => {
    await click('.filters button', 2);
    for (let i = 0; i < 3; i++) await click('.remove');
    expect(element.querySelector('.empty')?.textContent).toContain('Nenhum país aqui ainda.');
    expect(element.querySelector('.count')?.textContent).toContain('0 de 3 países');
  });
});
