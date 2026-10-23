children: [
  // sem a rota vazia com redirectTo, /paises/JP abre com a área das abas vazia
  { path: 'visao-geral', component: CountryOverview },
  { path: 'clima', component: CountryWeather },
  { path: 'anotacoes', component: CountryNotes },
],
