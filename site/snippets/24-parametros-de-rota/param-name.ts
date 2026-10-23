// Na rota, o parâmetro se chama id...
{ path: 'paises/:id', component: CountryPage }

// ...mas, no componente, o input se chama code: os nomes precisam ser iguais.
readonly code = input.required<string>();
