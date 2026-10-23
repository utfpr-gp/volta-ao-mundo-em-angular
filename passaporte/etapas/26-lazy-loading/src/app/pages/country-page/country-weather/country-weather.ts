import { Component, computed, input } from '@angular/core';
import { CLIMATES, findCountry } from '../../../countries';

@Component({
  imports: [],
  selector: 'app-country-weather',
  templateUrl: './country-weather.html',
})
export class CountryWeather {
  readonly code = input.required<string>();
  protected readonly country = computed(() => findCountry(this.code()));
  protected readonly climate = computed(() => CLIMATES[this.code().toUpperCase()]);
}
