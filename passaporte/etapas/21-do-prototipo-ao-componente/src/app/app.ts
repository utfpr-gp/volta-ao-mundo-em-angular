import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryList } from './country-list/country-list';
import { FeaturedCountry } from './featured-country/featured-country';
import { Footer } from './footer/footer';
import { Header } from './header/header';
import { WorldProgress } from './world-progress/world-progress';

@Component({
  imports: [RouterOutlet, Header, WorldProgress, FeaturedCountry, CountryList, Footer],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Passaporte');
}
