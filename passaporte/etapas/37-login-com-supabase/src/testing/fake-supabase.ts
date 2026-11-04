import { Provider } from '@angular/core';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { vi } from 'vitest';
import { SUPABASE } from '../app/core/supabase';

type Listener = (event: AuthChangeEvent, session: Session | null) => void;

/** Uma sessão de mentira, com o mínimo que o app lê. */
export function fakeSession(email = 'ana@exemplo.com'): Session {
  return { access_token: 'token-de-teste', user: { id: 'u1', email } } as unknown as Session;
}

/**
 * Um Supabase falso: nada sai para a rede. O teste diz o que cada chamada devolve (com mockResolvedValue) e pode
 * anunciar uma mudança de sessão com emit(), como o Supabase de verdade faz pelo onAuthStateChange.
 */
export function createFakeSupabase() {
  const listeners: Listener[] = [];
  const auth = {
    onAuthStateChange: vi.fn((listener: Listener) => {
      listeners.push(listener);
      listener('INITIAL_SESSION', null);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(async () => {
      listeners.forEach((listener) => listener('SIGNED_OUT', null));
      return { error: null };
    }),
  };
  const emit = (event: AuthChangeEvent, session: Session | null) => listeners.forEach((listener) => listener(event, session));
  return { client: { auth }, auth, emit };
}

export type FakeSupabase = ReturnType<typeof createFakeSupabase>;

export function provideFakeSupabase(fake: FakeSupabase = createFakeSupabase()): Provider {
  return { provide: SUPABASE, useValue: fake.client };
}
