export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Auth).accessToken(); // [!code highlight]
  if (!token || !isApiRequest(req.url)) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
