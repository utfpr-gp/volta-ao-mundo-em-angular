import { Component, inject, input, signal } from '@angular/core';
import { email, FieldTree, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth';

type Mode = 'entrar' | 'criar';

interface Credentials {
  email: string;
  password: string;
}

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.html',
})
export class SignInPage {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  /** O ?voltar=/passaporte do endereço: para onde ir depois de entrar. Chega aqui pelo withComponentInputBinding(). */
  protected readonly returnUrl = input<string | undefined>(undefined, { alias: 'voltar' });

  /** A mesma tela serve para entrar e para criar a conta: só muda o que o botão faz. */
  protected readonly mode = signal<Mode>('entrar');
  /** A resposta do servidor: um erro, ou o aviso de que falta confirmar o e-mail. */
  protected readonly feedback = signal<{ kind: 'error' | 'info'; text: string } | null>(null);

  protected readonly credentials = signal<Credentials>({ email: '', password: '' });

  protected readonly signInForm = form(
    this.credentials,
    (path) => {
      required(path.email, { message: 'Informe o seu e-mail.' });
      email(path.email, { message: 'Digite um e-mail válido, como ana@exemplo.com.' });
      required(path.password, { message: 'Informe a sua senha.' });
      minLength(path.password, 6, { message: 'A senha tem pelo menos 6 caracteres.' });
    },
    {
      submission: {
        action: async (field) => {
          const { email, password } = field().value();
          this.feedback.set(null);
          const outcome =
            this.mode() === 'entrar' ? await this.auth.signIn(email, password) : await this.auth.signUp(email, password);

          if (outcome.status === 'ok') {
            await this.router.navigateByUrl(safeReturnUrl(this.returnUrl()));
          } else if (outcome.status === 'confirm-email') {
            this.feedback.set({ kind: 'info', text: `Conta criada. Enviamos um link de confirmação para ${email}.` });
            this.mode.set('entrar');
          } else {
            this.feedback.set({ kind: 'error', text: outcome.message });
          }
        },
      },
    },
  );

  protected switchMode(): void {
    this.mode.update((mode) => (mode === 'entrar' ? 'criar' : 'entrar'));
    this.feedback.set(null);
  }

  protected errorOf(field: FieldTree<unknown>): string | undefined {
    const state = field();
    return state.invalid() && state.touched() ? state.errors()[0]?.message : undefined;
  }
}

/**
 * O endereço de volta vem da URL, e qualquer um escreve uma URL. Só vale um caminho deste app, como /paises/JP;
 * qualquer outra coisa, como https://outro-site.com, vira /passaporte.
 */
export function safeReturnUrl(url: string | undefined): string {
  return url?.startsWith('/') && !url.startsWith('//') ? url : '/passaporte';
}
