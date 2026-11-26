import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

/** Só deixa passar quem entrou. Quem não entrou vai para /entrar, levando no endereço a página para onde queria ir. */
export const authGuard: CanActivateFn = async (_route, state) => {
  // Os inject() vêm antes do await: depois dele, o Angular já não está "criando" nada, e o inject() falha.
  const auth = inject(Auth);
  const router = inject(Router);

  await auth.whenReady();
  if (auth.signedIn()) return true;
  return router.createUrlTree(['/entrar'], { queryParams: { voltar: state.url } });
};

/** O contrário: a tela de entrar é para quem ainda não entrou. Quem já entrou vai direto para o passaporte. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  await auth.whenReady();
  return auth.signedIn() ? router.createUrlTree(['/passaporte']) : true;
};
