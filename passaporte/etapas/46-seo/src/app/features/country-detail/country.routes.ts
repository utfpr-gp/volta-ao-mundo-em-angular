import { Routes } from '@angular/router';
import { CountryNotes } from './country-notes/country-notes';
import { CountryOverview } from './country-overview/country-overview';
import { CountryPage } from './country-page';
import { countryDescriptionResolver, countryResolver, countryTitleResolver } from './country-resolvers';
import { CountryWeather } from './country-weather/country-weather';

/** As rotas da página do país. Este arquivo, e tudo o que ele importa, só é baixado quando alguém abre um país. */
export const COUNTRY_ROUTES: Routes = [
  {
    path: '',
    component: CountryPage,
    // A tela só abre quando o resolver termina; o que ele devolve vira o input country da CountryPage.
    resolve: { country: countryResolver, description: countryDescriptionResolver }, // [!code highlight]
    title: countryTitleResolver,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'visao-geral' },
      { path: 'visao-geral', component: CountryOverview },
      { path: 'clima', component: CountryWeather },
      { path: 'anotacoes', component: CountryNotes },
    ],
  },
];
