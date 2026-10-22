import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryList } from './country-list/country-list';
import { FeaturedCountry } from './featured-country/featured-country';
import { Footer } from './footer/footer';
import { Header } from './header/header';

@Component({
  imports: [RouterOutlet, Header, FeaturedCountry, CountryList, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Passaporte');
}
