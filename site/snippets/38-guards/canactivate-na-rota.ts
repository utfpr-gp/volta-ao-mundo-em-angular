{
  path: 'passaporte',
  canActivate: [authGuard],
  loadComponent: () => import('./features/passport/passport-page/passport-page').then((m) => m.PassportPage),
},
