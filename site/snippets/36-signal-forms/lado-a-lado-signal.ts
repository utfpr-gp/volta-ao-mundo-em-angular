// Capítulo 36, Signal Forms: a regra e a frase, juntas, no schema.
tripForm = form(this.trip, (path) => {
  required(path.days, { message: 'Diga quantos dias durou a viagem.' });
  min(path.days, 1, { message: 'A viagem tem de durar de 1 a 365 dias.' });
  max(path.days, 365, { message: 'A viagem tem de durar de 1 a 365 dias.' });
});
