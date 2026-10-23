import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { startPassport } from '../../../testing/passport-testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { BRAZILIAN_LOCALE } from '../../core/locale';
import { CountryPage } from './country-page';
import { FORECAST_URL } from './country-weather/country-weather';
import { Passport } from '../../core/passport';

describe('CountryPage', () => {
  let harness: RouterTestingHarness;
  const element = () => harness.routeNativeElement as HTMLElement;
  const url = () => TestBed.inject(Router).url;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding()), BRAZILIAN_LOCALE, provideHttpClientTesting()],
    });
    await startPassport();
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => vi.restoreAllMocks());

  it('opens the overview tab when only the country is in the address', async () => {
    await harness.navigateByUrl('/paises/JP');
    expect(url()).toBe('/paises/JP/visao-geral');
    expect(element().querySelector('h1')?.textContent).toContain('Japão');
    expect(element().textContent).toContain('Tóquio');
    expect(TestBed.inject(Title).getTitle()).toBe('Japão · Passaporte');
  });

  it('gives each tab its own address, relative to the country', async () => {
    await harness.navigateByUrl('/paises/JP');
    const tabs = [...element().querySelectorAll<HTMLAnchorElement>('nav a')];
    expect(tabs.map((tab) => tab.getAttribute('href'))).toEqual([
      '/paises/JP/visao-geral',
      '/paises/JP/clima',
      '/paises/JP/anotacoes',
    ]);
    expect(element().querySelector('nav a[aria-current="page"]')?.textContent?.trim()).toBe('Visão geral');
  });

  describe('weather tab', () => {
    const forecast = (temperature: number, unit: string) => ({
      current: { time: '2026-10-23T23:00', temperature_2m: temperature, weather_code: 61 },
      current_units: { temperature_2m: unit },
    });
    const forecastRequest = () =>
      TestBed.inject(HttpTestingController).expectOne((request) => request.url === FORECAST_URL);

    it('asks for the weather at the capital of the country in the address', async () => {
      await harness.navigateByUrl('/paises/JP/clima');
      expect(element().textContent).toContain('Buscando o tempo');
      const request = forecastRequest();
      expect(request.request.params.get('latitude')).toBe('35.6894');
      expect(request.request.params.get('longitude')).toBe('139.6917');
      request.flush(forecast(14.1, '°C'));
      await harness.fixture.whenStable();
      expect(element().textContent).toContain('14,1 °C');
      expect(element().textContent).toContain('Chuva');
      expect(element().querySelector('nav a[aria-current="page"]')?.textContent?.trim()).toBe('Clima');
    });

    it('asks again when the unit changes', async () => {
      await harness.navigateByUrl('/paises/JP/clima');
      forecastRequest().flush(forecast(14.1, '°C'));
      await harness.fixture.whenStable();
      [...element().querySelectorAll('button')].find((b) => b.textContent!.trim() === '°F')!.click();
      // Sem whenStable aqui: ele esperaria a requisição nova, que só termina quando o teste responder.
      TestBed.tick();
      const request = forecastRequest();
      expect(request.request.params.get('temperature_unit')).toBe('fahrenheit');
      request.flush(forecast(57.4, '°F'));
      await harness.fixture.whenStable();
      expect(element().textContent).toContain('57,4 °F');
    });

    it('cancels the request still on its way when the unit changes', async () => {
      await harness.navigateByUrl('/paises/JP/clima');
      const first = forecastRequest();
      [...element().querySelectorAll('button')].find((b) => b.textContent!.trim() === '°F')!.click();
      TestBed.tick();
      expect(first.cancelled).toBe(true);
      forecastRequest().flush(forecast(57.4, '°F'));
    });

    it('shows the error and a retry button when the weather API fails', async () => {
      await harness.navigateByUrl('/paises/JP/clima');
      forecastRequest().flush('fora do ar', { status: 503, statusText: 'Service Unavailable' });
      await harness.fixture.whenStable();
      expect(element().textContent).toContain('Não foi possível buscar o tempo agora.');
    });
  });

  it('a note typed in a tab survives the tab change: it lives in the passport, not in the tab', async () => {
    await harness.navigateByUrl('/paises/JP/anotacoes');
    const area = element().querySelector('textarea')!;
    area.value = 'Comer lámen em Shinjuku';
    area.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();
    expect(element().textContent).toContain('23 letras');
    await harness.navigateByUrl('/paises/JP/clima');
    await harness.navigateByUrl('/paises/JP/anotacoes');
    expect(element().querySelector('textarea')!.value).toBe('Comer lámen em Shinjuku');
  });

  it('marks the country as visited from its own page, and the passport follows', async () => {
    await harness.navigateByUrl('/paises/JP/visao-geral');
    expect(element().textContent).toContain('Ainda não visitado');
    [...element().querySelectorAll('button')].find((b) => b.textContent!.includes('Marcar como visitado'))!.click();
    await harness.fixture.whenStable();
    expect(element().textContent).toContain('Visitado');
    expect(TestBed.inject(Passport).find('JP')?.visited).toBe(true);
  });

  it('draws another country and opens its overview', async () => {
    await harness.navigateByUrl('/paises/BR/clima', CountryPage);
    vi.spyOn(Math, 'random').mockReturnValue(0);
    [...element().querySelectorAll('button')].find((b) => b.textContent!.includes('Sortear'))!.click();
    await harness.fixture.whenStable();
    expect(url()).toBe('/paises/JP/visao-geral');
  });

  it('shows no tabs for a code that is not one of the countries', async () => {
    await harness.navigateByUrl('/paises/XX');
    expect(element().textContent).toContain('Não encontramos o país XX');
    expect(element().querySelector('nav')).toBeNull();
  });
});
