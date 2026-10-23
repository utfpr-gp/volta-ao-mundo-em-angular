import { BRAZILIAN_LOCALE } from '../../../core/locale';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { startPassport } from '../../../../testing/passport-testing';
import { provideRouter } from '@angular/router';
import { CountryList } from './country-list';
import { Passport } from '../../../core/passport';

describe('CountryList', () => {
  let fixture: ComponentFixture<CountryList>;
  let element: HTMLElement;
  const names = () => [...element.querySelectorAll('app-country-card strong')].map((name) => name.textContent);
  const click = async (selector: string, index = 0) => {
    element.querySelectorAll<HTMLButtonElement>(selector)[index].click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryList],
      providers: [provideRouter([]), provideHttpClientTesting()],
    }).compileComponents();
    startPassport();
    fixture = TestBed.createComponent(CountryList);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders one card per country with @for', () => {
    expect(names()).toEqual(['Brasil', 'Japão', 'Portugal', 'Itália', 'Argentina', 'Canadá']);
    expect(element.querySelector('footer')?.textContent).toContain('6 de 6 países');
  });

  it('filters the visited and the wishlist countries', async () => {
    await click('app-panel div button', 1);
    expect(names()).toEqual(['Brasil', 'Portugal', 'Argentina']);
    await click('app-panel div button', 2);
    expect(names()).toEqual(['Japão', 'Itália', 'Canadá']);
  });

  it('removes a country and shows @empty when nothing is left', async () => {
    await click('app-panel div button', 2);
    for (let i = 0; i < 3; i++) await click('li button[aria-label]');
    expect(element.querySelector('ul li')?.textContent).toContain('Nenhum país aqui ainda.');
    expect(element.querySelector('footer')?.textContent).toContain('0 de 3 países');
  });

  it('marks a country as visited when the card asks', async () => {
    const japan = () => element.querySelectorAll('li')[1];
    expect(japan().textContent).toContain('Japão');
    expect(japan().textContent).toContain('Visitar');
    japan().querySelector<HTMLButtonElement>('button:not([aria-label])')!.click();
    await fixture.whenStable();
    expect(japan().textContent).toContain('Visitado ✓');
  });

  it('changes the passport, so every screen sees the same countries', async () => {
    element.querySelectorAll('li')[1].querySelector<HTMLButtonElement>('button:not([aria-label])')!.click();
    await click('li button[aria-label]', 5);
    const passport = TestBed.inject(Passport);
    expect(passport.find('JP')?.visited).toBe(true);
    expect(passport.find('CA')).toBeUndefined();
  });

  describe('search', () => {
    const type = (text: string) => {
      const input = element.querySelector<HTMLInputElement>('input[type="search"]')!;
      input.value = text;
      input.dispatchEvent(new Event('input'));
    };

    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('waits for the typing to stop, then shows only the matching countries', () => {
      type('ja');
      type('jap');
      fixture.detectChanges();
      expect(names()).toHaveLength(6);
      vi.advanceTimersByTime(300);
      fixture.detectChanges();
      expect(names()).toEqual(['Japão']);
    });

    it('ignores accents and capital letters', () => {
      type('JAPAO');
      vi.advanceTimersByTime(300);
      fixture.detectChanges();
      expect(names()).toEqual(['Japão']);
    });

    it('ignores a search with a single letter', () => {
      type('b');
      vi.advanceTimersByTime(300);
      fixture.detectChanges();
      expect(names()).toHaveLength(6);
    });

    it('says so when nothing matches', () => {
      type('xyz');
      vi.advanceTimersByTime(300);
      fixture.detectChanges();
      expect(element.querySelector('ul li')?.textContent).toContain('Nenhum país aqui ainda.');
    });
  });
});
