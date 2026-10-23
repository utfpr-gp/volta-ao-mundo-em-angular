import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { findCountry } from './countries';
import { AboutPage } from './pages/about-page/about-page';
import { CountriesPage } from './pages/countries-page/countries-page';
import { CountryNotes } from './pages/country-page/country-notes/country-notes';
import { CountryOverview } from './pages/country-page/country-overview/country-overview';
import { CountryPage } from './pages/country-page/country-page';
import { CountryWeather } from './pages/country-page/country-weather/country-weather';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

/** O título da página de um país depende do código que veio no endereço. */
function countryTitle(route: ActivatedRouteSnapshot): string {
  const country = findCountry(route.paramMap.get('code') ?? '');
  return country ? `${country.name} · Passaporte` : 'País não encontrado · Passaporte';
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'paises' },
  { path: 'paises', component: CountriesPage, title: 'Países · Passaporte' },
  {
    path: 'paises/:code',
    component: CountryPage,
    title: countryTitle,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'visao-geral' },
      { path: 'visao-geral', component: CountryOverview },
      { path: 'clima', component: CountryWeather },
      { path: 'anotacoes', component: CountryNotes },
    ],
  },
  { path: 'sobre', component: AboutPage, title: 'Sobre · Passaporte' },
  { path: '**', component: NotFoundPage, title: 'Página não encontrada · Passaporte' },
];
