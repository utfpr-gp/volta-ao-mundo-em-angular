import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { isApiRequest } from '../api';
import { ApiStatus } from './api-status';

/** Num lugar só, o app fica sabendo se a API do Passaporte respondeu. Quem fez a requisição continua recebendo o erro. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req.url)) return next(req);
  const status = inject(ApiStatus);

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) status.failed.set(false);
    }),
    catchError((error: HttpErrorResponse) => {
      status.failed.set(true);
      return throwError(() => error);
    }),
  );
};
