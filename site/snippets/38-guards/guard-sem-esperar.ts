export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.signedIn()) return true; // [!code highlight]
  return router.createUrlTree(['/entrar'], { queryParams: { voltar: state.url } });
};
