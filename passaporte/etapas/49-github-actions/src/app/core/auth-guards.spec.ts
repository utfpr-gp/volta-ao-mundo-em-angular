import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { createFakeSupabase, fakeSession, FakeSupabase, provideFakeSupabase } from '../../testing/fake-supabase';
import { Auth } from './auth';
import { authGuard, guestGuard } from './auth-guards';

@Component({ template: 'privada' })
class PrivatePage {}

@Component({ template: 'entrar' })
class SignInStub {}

describe('auth guards', () => {
  let fake: FakeSupabase;

  const setup = (options: Parameters<typeof createFakeSupabase>[0] = {}) => {
    fake = createFakeSupabase(options);
    TestBed.configureTestingModule({
      providers: [
        provideFakeSupabase(fake),
        provideRouter([
          { path: 'passaporte', canActivate: [authGuard], component: PrivatePage },
          { path: 'entrar', canActivate: [guestGuard], component: SignInStub },
        ]),
      ],
    });
  };

  it('sends whoever is signed out to /entrar, with the way back in the address', async () => {
    setup();
    const harness = await RouterTestingHarness.create('/passaporte');
    expect(TestBed.inject(Router).url).toBe('/entrar?voltar=%2Fpassaporte');
    expect(harness.routeNativeElement?.textContent).toBe('entrar');
  });

  it('lets whoever is signed in through', async () => {
    setup({ session: fakeSession() });
    const harness = await RouterTestingHarness.create('/passaporte');
    expect(harness.routeNativeElement?.textContent).toBe('privada');
  });

  it('waits for the saved session to be read before deciding', async () => {
    setup({ manualStart: true });
    TestBed.inject(Auth); // o Auth nasce e fica esperando o Supabase terminar de ler a sessão
    const harness = await RouterTestingHarness.create();
    let finished = false;
    const navigation = harness.navigateByUrl('/passaporte').then(() => (finished = true));

    await new Promise((resolve) => setTimeout(resolve));
    expect(finished).toBe(false); // o guard está esperando, e não decidiu "ninguém logado"

    fake.emit('INITIAL_SESSION', fakeSession());
    await navigation;

    expect(TestBed.inject(Router).url).toBe('/passaporte');
  });

  it('sends whoever is already signed in away from /entrar', async () => {
    setup({ session: fakeSession() });
    await RouterTestingHarness.create('/entrar');
    expect(TestBed.inject(Router).url).toBe('/passaporte');
  });
});
