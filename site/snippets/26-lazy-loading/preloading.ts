import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules));
