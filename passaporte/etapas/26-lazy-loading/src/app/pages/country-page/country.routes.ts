import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { findCountry } from '../../countries';
import { CountryNotes } from './country-notes/country-notes';
import { CountryOverview } from './country-overview/country-overview';
import { CountryPage } from './country-page';
import { CountryWeather } from './country-weather/country-weather';

/** O título da página de um país depende do código que veio no endereço. */
function countryTitle(route: ActivatedRouteSnapshot): string {
  const country = findCountry(route.paramMap.get('code') ?? '');
  return country ? `${country.name} · Passaporte` : 'País não encontrado · Passaporte';
}

/** As rotas da página do país. Este arquivo, e tudo o que ele importa, só é baixado quando alguém abre um país. */
export const COUNTRY_ROUTES: Routes = [
  {
    path: '',
    component: CountryPage,
    title: countryTitle,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'visao-geral' },
      { path: 'visao-geral', component: CountryOverview },
      { path: 'clima', component: CountryWeather },
      { path: 'anotacoes', component: CountryNotes },
    ],
  },
];
