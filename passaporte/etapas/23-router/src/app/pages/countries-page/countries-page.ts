import { Component } from '@angular/core';
import { CountryList } from '../../country-list/country-list';
import { FeaturedCountry } from '../../featured-country/featured-country';
import { WorldProgress } from '../../world-progress/world-progress';

@Component({
  imports: [WorldProgress, FeaturedCountry, CountryList],
  selector: 'app-countries-page',
  templateUrl: './countries-page.html',
})
export class CountriesPage {}
