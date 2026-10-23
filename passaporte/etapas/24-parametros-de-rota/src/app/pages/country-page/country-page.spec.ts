import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { BRAZILIAN_LOCALE } from '../../locale';
import { CountryPage } from './country-page';

describe('CountryPage', () => {
  let harness: RouterTestingHarness;
  const element = () => harness.routeNativeElement as HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding()), BRAZILIAN_LOCALE] });
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => vi.restoreAllMocks());

  it('receives the code from the address in an input', async () => {
    await harness.navigateByUrl('/paises/JP', CountryPage);
    expect(element().querySelector('h1')?.textContent).toContain('Japão');
    expect(element().textContent).toContain('Tóquio');
    expect(TestBed.inject(Title).getTitle()).toBe('Japão · Passaporte');
  });

  it('accepts the code in lower case', async () => {
    await harness.navigateByUrl('/paises/pt');
    expect(element().querySelector('h1')?.textContent).toContain('Portugal');
  });

  it('says so when the code is not one of the countries', async () => {
    await harness.navigateByUrl('/paises/XX');
    expect(element().textContent).toContain('Não encontramos o país XX');
    expect(TestBed.inject(Title).getTitle()).toBe('País não encontrado · Passaporte');
  });

  it('navigates by code to another country, reusing the same component', async () => {
    const page = await harness.navigateByUrl('/paises/BR', CountryPage);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    [...element().querySelectorAll('button')].find((b) => b.textContent!.includes('Sortear'))!.click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Title).getTitle()).toBe('Japão · Passaporte');
    expect(element().querySelector('h1')?.textContent).toContain('Japão');
    expect(harness.routeDebugElement!.componentInstance).toBe(page);
  });
});
