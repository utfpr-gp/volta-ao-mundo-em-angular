import { Component, computed, input } from '@angular/core';
import { Country } from '../country';
import { Panel } from '../panel/panel';
import { StampCard } from '../stamp-card/stamp-card';

@Component({
  imports: [Panel, StampCard],
  selector: 'app-stamp-book',
  templateUrl: './stamp-book.html',
})
export class StampBook {
  readonly countries = input.required<Country[]>();
  protected readonly stamped = computed(() => this.countries().filter((country) => country.visited).length);
}
