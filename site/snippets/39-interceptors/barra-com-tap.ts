export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(Loading);
  loading.start();
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) loading.stop(); // [!code highlight]
    }),
  );
};
