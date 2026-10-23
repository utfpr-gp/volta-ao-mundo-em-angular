export const routes: Routes = [
  { path: '**', component: NotFoundPage }, // combina com tudo: as de baixo nunca são lidas
  { path: 'paises', component: CountriesPage },
  { path: 'sobre', component: AboutPage },
];
