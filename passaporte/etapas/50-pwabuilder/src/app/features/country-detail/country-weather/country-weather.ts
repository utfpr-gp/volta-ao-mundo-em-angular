import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { Passport } from '../../../core/passport';
import { describeWeather } from './weather-description';

/** A Open-Meteo: previsão do tempo gratuita, sem cadastro e sem chave. */
export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/** O pedaço da resposta da Open-Meteo que a aba usa. */
interface Forecast {
  current: { time: string; temperature_2m: number; weather_code: number };
  current_units: { temperature_2m: string };
}

@Component({
  imports: [DecimalPipe],
  selector: 'app-country-weather',
  templateUrl: './country-weather.html',
})
export class CountryWeather {
  readonly code = input.required<string>();
  private readonly passport = inject(Passport);
  protected readonly country = computed(() => this.passport.find(this.code()));
  protected readonly unit = signal<'celsius' | 'fahrenheit'>('celsius');

  /**
   * O tempo agora na capital. A requisição depende de dois signals, o país e a unidade: quando um deles muda, o
   * httpResource cancela a requisição anterior, se ainda estiver a caminho, e faz outra.
   */
  protected readonly weather = httpResource<Forecast>(() => {
    const country = this.country();
    if (!country) return undefined; // sem país, sem requisição: o resource fica parado
    return {
      url: FORECAST_URL,
      params: {
        latitude: country.lat,
        longitude: country.lon,
        current: 'temperature_2m,weather_code',
        temperature_unit: this.unit(),
      },
    };
  });

  protected readonly description = computed(() =>
    this.weather.hasValue() ? describeWeather(this.weather.value().current.weather_code) : '',
  );
}
