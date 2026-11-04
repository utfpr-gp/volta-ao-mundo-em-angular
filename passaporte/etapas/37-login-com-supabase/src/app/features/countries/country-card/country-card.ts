import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Country } from '../../../core/country';
import { FlagPipe } from '../../../shared/flag-pipe';

@Component({
  imports: [FlagPipe, RouterLink],
  selector: 'app-country-card',
  templateUrl: './country-card.html',
})
export class CountryCard {
  readonly country = input.required<Country>();
  readonly position = input(0);

  readonly toggled = output<string>();
  readonly removed = output<string>();
}
