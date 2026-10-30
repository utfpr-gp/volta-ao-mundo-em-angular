// Sem ^ e $, a regex procura um pedaço que combine, em qualquer lugar do texto.
// "Ana2" tem "Ana", então passa.
companion: ['', Validators.pattern(/[\p{L} '-]+/u)],
