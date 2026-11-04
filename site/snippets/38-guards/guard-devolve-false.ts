export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  await auth.whenReady();
  return auth.signedIn(); // [!code highlight]
};
