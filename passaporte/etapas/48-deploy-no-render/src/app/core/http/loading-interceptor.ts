import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Loading } from './loading';

/** Conta cada requisição que sai e desconta quando ela termina: com resposta, com erro ou cancelada. */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(Loading);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};
