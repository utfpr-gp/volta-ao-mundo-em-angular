import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/http/auth-interceptor';
import { errorInterceptor } from './core/http/error-interceptor';
import { loadingInterceptor } from './core/http/loading-interceptor';
import { BRAZILIAN_LOCALE } from './core/locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // A ordem da lista é a ordem do caminho de ida: a requisição passa primeiro pelo loading, depois pelo auth, depois pelo error.
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor, errorInterceptor])), // [!code highlight]
    BRAZILIAN_LOCALE,
  ],
};
