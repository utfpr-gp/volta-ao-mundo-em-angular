import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { AuthError, Session } from '@supabase/supabase-js';
import { SUPABASE } from './supabase';

/** O que aconteceu ao entrar ou criar a conta: deu certo, falta confirmar o e-mail, ou deu errado (com a frase para a tela). */
export type AuthOutcome = { status: 'ok' } | { status: 'confirm-email' } | { status: 'error'; message: string };

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly supabase = inject(SUPABASE);

  /** A sessão de quem entrou, ou null. Quem a escreve é o Supabase, pelo aviso abaixo. */
  private readonly session = signal<Session | null>(null);
  /** Fica true quando o Supabase já disse se havia alguém logado (a sessão guardada no navegador foi lida). */
  readonly ready = signal(false);
  /** A mesma notícia, como Promise: quem precisa esperar, como um guard, faz await auth.whenReady(). */
  private readonly readyPromise: Promise<void>;

  readonly user = computed(() => this.session()?.user ?? null);
  readonly signedIn = computed(() => this.user() !== null);
  /** O token de acesso da sessão, que o authInterceptor põe nas requisições. O Supabase o renova sozinho. */
  readonly accessToken = computed(() => this.session()?.access_token ?? null); // [!code highlight]

  constructor() {
    let resolveReady!: () => void;
    this.readyPromise = new Promise((resolve) => (resolveReady = resolve));

    // O Supabase avisa toda mudança: a sessão lida ao abrir o app, o login, o logout, a renovação do token.
    const { data } = this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
      this.ready.set(true);
      resolveReady();
    });
    inject(DestroyRef).onDestroy(() => data.subscription.unsubscribe());
  }

  /** Resolve quando o Supabase terminou de ler a sessão guardada. Antes disso, "ninguém logado" pode ser só pressa. */
  whenReady(): Promise<void> {
    return this.readyPromise;
  }

  async signIn(email: string, password: string): Promise<AuthOutcome> {
    const { error } = await this.supabase.auth.signInWithPassword({ email, password });
    return error ? { status: 'error', message: messageFor(error) } : { status: 'ok' };
  }

  async signUp(email: string, password: string): Promise<AuthOutcome> {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) return { status: 'error', message: messageFor(error) };
    // Com a confirmação de e-mail ligada, a conta nasce sem sessão: a pessoa só entra depois de clicar no link.
    return data.session ? { status: 'ok' } : { status: 'confirm-email' };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}

/** A frase em português para cada erro do Supabase. O code é estável; a message vem em inglês e pode mudar. */
function messageFor(error: AuthError): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'E-mail ou senha incorretos.';
    case 'email_not_confirmed':
      return 'Confirme o seu e-mail antes de entrar: o link está na sua caixa de entrada.';
    case 'user_already_exists':
      return 'Já existe uma conta com este e-mail. Entre com ela.';
    case 'weak_password':
      return 'A senha é fraca demais. Use pelo menos 6 caracteres.';
    default:
      return 'Não foi possível falar com o servidor agora. Tente de novo em instantes.';
  }
}
