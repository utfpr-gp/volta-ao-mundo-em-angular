import { Component, input } from '@angular/core';
import { Country } from '../../../core/country';
import { Stamp } from '../stamp/stamp';

@Component({
  imports: [Stamp],
  selector: 'app-stamp-card',
  templateUrl: './stamp-card.html',
})
export class StampCard {
  readonly country = input.required<Country>();
}
