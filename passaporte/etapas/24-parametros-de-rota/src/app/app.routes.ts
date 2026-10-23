import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { findCountry } from './countries';
import { AboutPage } from './pages/about-page/about-page';
import { CountriesPage } from './pages/countries-page/countries-page';
import { CountryPage } from './pages/country-page/country-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

/** O título da página de um país depende do código que veio no endereço. */
function countryTitle(route: ActivatedRouteSnapshot): string {
  const country = findCountry(route.paramMap.get('code') ?? '');
  return country ? `${country.name} · Passaporte` : 'País não encontrado · Passaporte';
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'paises' },
  { path: 'paises', component: CountriesPage, title: 'Países · Passaporte' },
  { path: 'paises/:code', component: CountryPage, title: countryTitle },
  { path: 'sobre', component: AboutPage, title: 'Sobre · Passaporte' },
  { path: '**', component: NotFoundPage, title: 'Página não encontrada · Passaporte' },
];
