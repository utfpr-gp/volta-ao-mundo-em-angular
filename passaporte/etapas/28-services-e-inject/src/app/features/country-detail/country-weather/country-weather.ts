import { Component, computed, inject, input } from '@angular/core';
import { CLIMATES } from '../../../core/countries';
import { Passport } from '../../../core/passport';

@Component({
  imports: [],
  selector: 'app-country-weather',
  templateUrl: './country-weather.html',
})
export class CountryWeather {
  readonly code = input.required<string>();
  private readonly passport = inject(Passport);
  protected readonly country = computed(() => this.passport.find(this.code()));
  protected readonly climate = computed(() => CLIMATES[this.code().toUpperCase()]);
}
