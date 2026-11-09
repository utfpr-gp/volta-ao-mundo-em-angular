import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { AppErrorHandler } from './core/app-error-handler';
import { authInterceptor } from './core/http/auth-interceptor';
import { errorInterceptor } from './core/http/error-interceptor';
import { loadingInterceptor } from './core/http/loading-interceptor';
import { BRAZILIAN_LOCALE } from './core/locale';
import { SeoTitleStrategy } from './core/seo-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    // Os erros que escapam (um throw num setTimeout, uma Promise rejeitada sem catch) também vão para o ErrorHandler.
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    provideRouter(routes, withComponentInputBinding()),
    // O título de cada rota vira também a descrição e as tags de compartilhamento.
    { provide: TitleStrategy, useClass: SeoTitleStrategy }, // [!code highlight]
    // A ordem da lista é a ordem do caminho de ida: a requisição passa primeiro pelo loading, depois pelo auth, depois pelo error.
    provideHttpClient(withInterceptors([loadingInterceptor, authInterceptor, errorInterceptor])),
    BRAZILIAN_LOCALE,
    // O navegador aproveita o HTML que veio pronto do build, em vez de desenhar a página de novo.
    provideClientHydration(withEventReplay()), // [!code highlight]
  ],
};
