import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthError } from '@supabase/supabase-js';
import { createFakeSupabase, FakeSupabase, provideFakeSupabase } from '../../../../testing/fake-supabase';
import { safeReturnUrl, SignInPage } from './sign-in-page';

describe('SignInPage', () => {
  let fake: FakeSupabase;

  const render = async () => {
    fake = createFakeSupabase();
    TestBed.configureTestingModule({ imports: [SignInPage], providers: [provideRouter([]), provideFakeSupabase(fake)] });
    const fixture = TestBed.createComponent(SignInPage);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  };

  const type = (element: HTMLElement, selector: string, value: string) => {
    const input = element.querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  const submit = async (fixture: { whenStable(): Promise<unknown> }, element: HTMLElement) => {
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  it('does not call Supabase while the form is invalid, and shows the messages', async () => {
    const { fixture, element } = await render();
    type(element, '#sign-in-email', 'ana');
    await submit(fixture, element);

    expect(fake.auth.signInWithPassword).not.toHaveBeenCalled();
    expect(element.querySelector('#sign-in-email-error')?.textContent).toContain('e-mail válido');
    expect(element.querySelector('#sign-in-password-error')?.textContent).toContain('Informe a sua senha');
  });

  it('signs in and goes to the passport', async () => {
    const { fixture, element } = await render();
    fake.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    type(element, '#sign-in-email', 'ana@exemplo.com');
    type(element, '#sign-in-password', 'senha-boa');
    await submit(fixture, element);

    expect(fake.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'ana@exemplo.com', password: 'senha-boa' });
    expect(navigate).toHaveBeenCalledWith('/passaporte');
  });

  it('shows the error in Portuguese when the password is wrong', async () => {
    const { fixture, element } = await render();
    fake.auth.signInWithPassword.mockResolvedValue({ data: {}, error: new AuthError('x', 400, 'invalid_credentials') });

    type(element, '#sign-in-email', 'ana@exemplo.com');
    type(element, '#sign-in-password', 'errada1');
    await submit(fixture, element);

    expect(element.querySelector('[data-feedback]')?.textContent?.trim()).toBe('E-mail ou senha incorretos.');
  });

  it('creates the account in the other mode, and warns when the e-mail still needs confirming', async () => {
    const { fixture, element } = await render();
    fake.auth.signUp.mockResolvedValue({ data: { user: {}, session: null }, error: null });

    element.querySelector<HTMLButtonElement>('button[type="button"]')!.click();
    await fixture.whenStable();
    expect(element.querySelector('h1')?.textContent).toContain('Criar conta');

    type(element, '#sign-in-email', 'bia@exemplo.com');
    type(element, '#sign-in-password', 'senha-boa');
    await submit(fixture, element);

    expect(fake.auth.signUp).toHaveBeenCalledWith({ email: 'bia@exemplo.com', password: 'senha-boa' });
    expect(element.querySelector('[data-feedback]')?.textContent).toContain('link de confirmação para bia@exemplo.com');
  });

  it('goes back to the page in ?voltar after signing in', async () => {
    const { fixture, element } = await render();
    fixture.componentRef.setInput('voltar', '/paises/JP');
    fake.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    type(element, '#sign-in-email', 'ana@exemplo.com');
    type(element, '#sign-in-password', 'senha-boa');
    await submit(fixture, element);

    expect(navigate).toHaveBeenCalledWith('/paises/JP');
  });

  it('explains why it opened when it came from a guard', async () => {
    const { fixture, element } = await render();
    expect(element.querySelector('[data-redirected]')).toBeNull();

    fixture.componentRef.setInput('voltar', '/passaporte');
    await fixture.whenStable();
    expect(element.querySelector('[data-redirected]')?.textContent).toContain('só para quem entrou');
  });

  it('accepts only addresses of this app as the way back', () => {
    expect(safeReturnUrl('/paises/JP')).toBe('/paises/JP');
    expect(safeReturnUrl(undefined)).toBe('/passaporte');
    expect(safeReturnUrl('https://outro-site.com')).toBe('/passaporte');
    expect(safeReturnUrl('//outro-site.com')).toBe('/passaporte');
  });

  it('receives ?voltar from the address through the router', async () => {
    fake = createFakeSupabase();
    fake.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'entrar', component: SignInPage }], withComponentInputBinding()), provideFakeSupabase(fake)],
    });
    const harness = await RouterTestingHarness.create('/entrar?voltar=%2Fpaises%2FJP');
    const element = harness.routeNativeElement!;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    type(element, '#sign-in-email', 'ana@exemplo.com');
    type(element, '#sign-in-password', 'senha-boa');
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    await harness.fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith('/paises/JP');
  });
});
