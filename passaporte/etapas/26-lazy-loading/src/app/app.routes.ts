import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'paises' },
  {
    path: 'paises',
    loadComponent: () => import('./pages/countries-page/countries-page').then((m) => m.CountriesPage),
    title: 'Países · Passaporte',
  },
  {
    path: 'paises/:code',
    loadChildren: () => import('./pages/country-page/country.routes').then((m) => m.COUNTRY_ROUTES),
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/about-page/about-page').then((m) => m.AboutPage),
    title: 'Sobre · Passaporte',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
    title: 'Página não encontrada · Passaporte',
  },
];
