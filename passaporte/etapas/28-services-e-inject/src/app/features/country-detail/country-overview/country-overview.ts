import { Component, computed, inject, input } from '@angular/core';
import { Passport } from '../../../core/passport';

@Component({
  imports: [],
  selector: 'app-country-overview',
  templateUrl: './country-overview.html',
})
export class CountryOverview {
  /** Herdado da rota mãe, paises/:code. */
  readonly code = input.required<string>();
  protected readonly passport = inject(Passport);
  protected readonly country = computed(() => this.passport.find(this.code()));
}
