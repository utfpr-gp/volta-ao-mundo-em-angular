import { Component, computed, input, signal } from '@angular/core';
import { findCountry } from '../../../core/countries';

@Component({
  imports: [],
  selector: 'app-country-notes',
  templateUrl: './country-notes.html',
})
export class CountryNotes {
  readonly code = input.required<string>();
  protected readonly country = computed(() => findCountry(this.code()));
  /** Mora no componente: some quando a aba troca e o componente é destruído. */
  protected readonly note = signal('');
}
