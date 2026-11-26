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
  /** As opções do filtro, achadas pelo papel que o ngOption lhes dá. */
  const option = (index: number) => element.querySelectorAll<HTMLElement>('[role="option"]')[index];
  /** Os itens da lista de países (a lista do filtro também tem li). */
  const items = () => [...element.querySelectorAll<HTMLElement>('ul:not([role="listbox"]) > li')];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryList],
      providers: [provideRouter([]), provideHttpClientTesting()],
    }).compileComponents();
    await startPassport();
    fixture = TestBed.createComponent(CountryList);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders one card per country with @for', () => {
    expect(names()).toEqual(['Brasil', 'Japão', 'Portugal', 'Itália', 'Argentina', 'Canadá']);
    expect(element.querySelector('footer')?.textContent).toContain('6 de 6 países');
  });

  it('filters the visited and the wishlist countries', async () => {
    await click('[role="option"]', 1);
    expect(names()).toEqual(['Brasil', 'Portugal', 'Argentina']);
    await click('[role="option"]', 2);
    expect(names()).toEqual(['Japão', 'Itália', 'Canadá']);
  });

  it('tells assistive technologies which filter is on, and follows the arrow keys', async () => {
    expect(element.querySelector('[role="listbox"]')!.getAttribute('aria-label')).toBe('Filtrar países');
    expect(option(0).getAttribute('aria-selected')).toBe('true');
    option(0).focus();
    option(0).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(option(1).getAttribute('aria-selected')).toBe('true');
    expect(names()).toEqual(['Brasil', 'Portugal', 'Argentina']);
  });

  it('announces the count of countries in a live region', () => {
    const footer = element.querySelector('footer [role="status"]')!;
    expect(footer.textContent).toContain('6 de 6 países');
  });

  it('removes a country and shows @empty when nothing is left', async () => {
    await click('[role="option"]', 2);
    for (let i = 0; i < 3; i++) await click('li button[aria-label]');
    expect(items()[0].textContent).toContain('Nenhum país aqui ainda.');
    expect(element.querySelector('footer')?.textContent).toContain('0 de 3 países');
  });

  it('marks a country as visited when the card asks', async () => {
    const japan = () => items()[1];
    expect(japan().textContent).toContain('Japão');
    expect(japan().textContent).toContain('Visitar');
    const visit = japan().querySelector<HTMLButtonElement>('button:not([aria-label])')!;
    // O nome do botão leva o país: "Visitar Japão", e não só "Visitar".
    expect(visit.textContent!.replace(/\s+/g, ' ').trim()).toBe('Visitar Japão');
    visit.click();
    await fixture.whenStable();
    expect(japan().textContent).toContain('Visitado ✓');
  });

  it('changes the passport, so every screen sees the same countries', async () => {
    items()[1].querySelector<HTMLButtonElement>('button:not([aria-label])')!.click();
    await click('li button[aria-label]', 5);
    const passport = TestBed.inject(Passport);
    expect(passport.find('JP')?.visited).toBe(true);
    expect(passport.find('CA')).toBeUndefined();
  });

  describe('search', () => {
    // O toObservable entrega o valor quando o Angular roda os efeitos; depois, o debounceTime espera 300 ms.
    // Aqui o relógio é o de verdade: a espera é curta.
    const search = async (text: string) => {
      const input = element.querySelector<HTMLInputElement>('input[type="search"]')!;
      input.value = text;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      await new Promise((resolve) => setTimeout(resolve, 350));
      await fixture.whenStable();
    };

    it('waits for the typing to stop, then shows only the matching countries', async () => {
      const input = element.querySelector<HTMLInputElement>('input[type="search"]')!;
      input.value = 'jap';
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
      expect(names()).toHaveLength(6);
      await search('jap');
      expect(names()).toEqual(['Japão']);
    });

    it('ignores accents and capital letters', async () => {
      await search('JAPAO');
      expect(names()).toEqual(['Japão']);
    });

    it('ignores a search with a single letter', async () => {
      await search('b');
      expect(names()).toHaveLength(6);
    });

    it('says so when nothing matches', async () => {
      await search('xyz');
      expect(items()[0].textContent).toContain('Nenhum país aqui ainda.');
    });
  });
});
