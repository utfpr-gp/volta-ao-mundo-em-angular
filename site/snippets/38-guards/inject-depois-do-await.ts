export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(Auth);

  await auth.whenReady();
  const router = inject(Router); // [!code highlight]
  if (auth.signedIn()) return true;
  return router.createUrlTree(['/entrar'], { queryParams: { voltar: state.url } });
};
