import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'paises' },
  {
    path: 'paises',
    loadComponent: () => import('./features/countries/countries-page/countries-page').then((m) => m.CountriesPage),
    title: 'Países · Passaporte',
  },
  {
    path: 'paises/:code',
    loadChildren: () => import('./features/country-detail/country.routes').then((m) => m.COUNTRY_ROUTES),
  },
  {
    path: 'passaporte',
    loadComponent: () => import('./features/passport/passport-page/passport-page').then((m) => m.PassportPage),
    title: 'Meu passaporte · Passaporte',
  },
  {
    path: 'sobre',
    loadComponent: () => import('./features/about/about-page/about-page').then((m) => m.AboutPage),
    title: 'Sobre · Passaporte',
  },
  {
    path: '**',
    loadComponent: () => import('./core/not-found-page/not-found-page').then((m) => m.NotFoundPage),
    title: 'Página não encontrada · Passaporte',
  },
];
