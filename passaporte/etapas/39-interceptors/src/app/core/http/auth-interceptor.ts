import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { isApiRequest } from '../api';
import { Auth } from '../auth';

/** Põe o token de quem entrou em toda requisição para a API do Passaporte. E só para ela. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req.url)) return next(req);
  const auth = inject(Auth);

  // Ao abrir o app, a sessão guardada pode ainda não ter sido lida: espere por ela antes de olhar o token.
  return from(auth.whenReady()).pipe( // [!code highlight]
    switchMap(() => {
      const token = auth.accessToken();
      if (!token) return next(req);
      // A requisição não muda: o clone é uma cópia com o cabeçalho a mais.
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })); // [!code highlight]
    }),
  );
};
