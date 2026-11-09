// No console do navegador: um erro que ninguém trata
setTimeout(() => {
  throw new Error('Um erro de teste, lançado no console');
});
