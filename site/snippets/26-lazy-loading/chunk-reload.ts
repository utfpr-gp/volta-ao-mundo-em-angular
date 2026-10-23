import { provideRouter, withComponentInputBinding, withNavigationErrorHandler } from '@angular/router';

provideRouter(
  routes,
  withComponentInputBinding(),
  withNavigationErrorHandler((navigation) => {
    // A versão publicada mudou e o arquivo antigo não existe mais: recarregar traz a nova
    if (String(navigation.error).includes('dynamically imported module')) location.reload();
  }),
);
