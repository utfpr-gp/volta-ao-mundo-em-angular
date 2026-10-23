import { Routes } from '@angular/router';
import { AboutPage } from './pages/about-page/about-page';
import { CountriesPage } from './pages/countries-page/countries-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'paises' },
  { path: 'paises', component: CountriesPage, title: 'Países · Passaporte' },
  { path: 'sobre', component: AboutPage, title: 'Sobre · Passaporte' },
  { path: '**', component: NotFoundPage, title: 'Página não encontrada · Passaporte' },
];
