import { Component, computed, input } from '@angular/core';
import { findCountry } from '../../../countries';

@Component({
  imports: [],
  selector: 'app-country-overview',
  templateUrl: './country-overview.html',
})
export class CountryOverview {
  /** Herdado da rota mãe, paises/:code. */
  readonly code = input.required<string>();
  protected readonly country = computed(() => findCountry(this.code()));
}
