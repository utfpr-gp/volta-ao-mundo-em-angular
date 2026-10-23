import { ApplicationConfig } from '@angular/core';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme: { preset: Aura },
      license: 'SUA-CHAVE-DA-PRIMEUI',
    }),
  ],
};
