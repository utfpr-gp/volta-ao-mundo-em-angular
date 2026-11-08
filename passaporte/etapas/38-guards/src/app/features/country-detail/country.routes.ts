import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Passport } from '../../core/passport';
import { CountryNotes } from './country-notes/country-notes';
import { CountryOverview } from './country-overview/country-overview';
import { CountryPage } from './country-page';
import { CountryWeather } from './country-weather/country-weather';

/**
 * O título da página de um país depende do código que veio no endereço. O Router chama esta função num contexto de
 * injeção. Se os países ainda não chegaram da API, o título fica com o código.
 */
function countryTitle(route: ActivatedRouteSnapshot): string {
  const code = (route.paramMap.get('code') ?? '').toUpperCase();
  const country = inject(Passport).find(code);
  return `${country?.name ?? code} · Passaporte`;
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
