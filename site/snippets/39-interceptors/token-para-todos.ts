export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  // sem o if (!isApiRequest(req.url)): o token vai para qualquer endereço // [!code highlight]
  return from(auth.whenReady()).pipe(
    switchMap(() => {
      const token = auth.accessToken();
      if (!token) return next(req);
      return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    }),
  );
};
