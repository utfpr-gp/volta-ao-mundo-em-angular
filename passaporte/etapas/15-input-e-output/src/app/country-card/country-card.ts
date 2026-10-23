import { Component, input, output } from '@angular/core';
import { Country } from '../country';
import { FlagPipe } from '../flag-pipe';

@Component({
  imports: [FlagPipe],
  selector: 'app-country-card',
  templateUrl: './country-card.html',
})
export class CountryCard {
  readonly country = input.required<Country>();
  readonly position = input(0);

  readonly toggled = output<string>();
  readonly removed = output<string>();
}
