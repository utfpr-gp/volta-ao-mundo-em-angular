import { Component, computed, inject, input } from '@angular/core';
import { Passport } from '../../../core/passport';

@Component({
  imports: [],
  selector: 'app-country-notes',
  templateUrl: './country-notes.html',
})
export class CountryNotes {
  readonly code = input.required<string>();
  protected readonly passport = inject(Passport);
  protected readonly country = computed(() => this.passport.find(this.code()));
  /** Mora no service: continua lá quando a aba troca e este componente é destruído. */
  protected readonly note = computed(() => this.passport.note(this.code()));
}
