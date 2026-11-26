import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, Provider } from '@angular/core';

// Ensina ao Angular como se escrevem números, datas e moedas no Brasil.
registerLocaleData(localePt);

export const BRAZILIAN_LOCALE: Provider = { provide: LOCALE_ID, useValue: 'pt-BR' };
