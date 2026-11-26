import { TestBed } from '@angular/core/testing';
import { AuthError } from '@supabase/supabase-js';
import { createFakeSupabase, fakeSession, FakeSupabase, provideFakeSupabase } from '../../testing/fake-supabase';
import { Auth } from './auth';

describe('Auth', () => {
  let fake: FakeSupabase;
  let auth: Auth;

  beforeEach(() => {
    fake = createFakeSupabase();
    TestBed.configureTestingModule({ providers: [provideFakeSupabase(fake)] });
    auth = TestBed.inject(Auth);
  });

  it('starts ready and signed out when there is no saved session', () => {
    expect(auth.ready()).toBe(true);
    expect(auth.signedIn()).toBe(false);
  });

  it('follows the session announced by Supabase', () => {
    fake.emit('SIGNED_IN', fakeSession('ana@exemplo.com'));
    expect(auth.user()?.email).toBe('ana@exemplo.com');

    fake.emit('SIGNED_OUT', null);
    expect(auth.signedIn()).toBe(false);
  });

  it('translates a wrong password into Portuguese', async () => {
    fake.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new AuthError('Invalid login credentials', 400, 'invalid_credentials'),
    });

    expect(await auth.signIn('ana@exemplo.com', 'errada')).toEqual({ status: 'error', message: 'E-mail ou senha incorretos.' });
  });

  it('asks to confirm the e-mail when sign-up creates the account without a session', async () => {
    fake.auth.signUp.mockResolvedValue({ data: { user: {}, session: null }, error: null });

    expect(await auth.signUp('bia@exemplo.com', 'senha-boa')).toEqual({ status: 'confirm-email' });
  });

  it('uses a generic message for an error it does not know, such as the server being offline', async () => {
    fake.auth.signInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: new AuthError('Failed to fetch') });

    const outcome = await auth.signIn('ana@exemplo.com', 'senha-boa');
    expect(outcome).toEqual({ status: 'error', message: 'Não foi possível falar com o servidor agora. Tente de novo em instantes.' });
  });
});
