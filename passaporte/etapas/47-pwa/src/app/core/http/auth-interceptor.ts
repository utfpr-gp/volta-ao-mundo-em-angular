import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isApiRequest } from '../api';
import { Auth } from '../auth';

/** Põe a chave do projeto e o token de quem entrou em toda requisição para a API do Passaporte. E só para ela. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req.url)) return next(req);
  const auth = inject(Auth);

  // Ao abrir o app, a sessão guardada pode ainda não ter sido lida: espere por ela antes de olhar o token.
  return from(auth.whenReady()).pipe(
    switchMap(() => {
      // A chave publicável diz de qual projeto é o pedido; o token diz quem pede. O Supabase confere os dois.
      const headers: Record<string, string> = { apikey: environment.supabasePublishableKey };
      const token = auth.accessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      return next(req.clone({ setHeaders: headers }));
    }),
  );
};
