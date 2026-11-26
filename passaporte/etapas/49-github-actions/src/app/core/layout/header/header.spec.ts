import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Header } from './header';
import { routes } from '../../../app.routes';
import { BRAZILIAN_LOCALE } from '../../locale';
import { createFakeSupabase, fakeSession, FakeSupabase, provideFakeSupabase } from '../../../../testing/fake-supabase';

describe('Header', () => {
  let fake: FakeSupabase;

  const render = async (url: string) => {
    fake = createFakeSupabase();
    TestBed.configureTestingModule({ imports: [Header], providers: [provideRouter(routes), BRAZILIAN_LOCALE, provideFakeSupabase(fake)] });
    const harness = await RouterTestingHarness.create(url);
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    return { harness, fixture, element: fixture.nativeElement as HTMLElement };
  };

  it('links to the pages with routerLink', async () => {
    const { element } = await render('/paises');
    const links = [...element.querySelectorAll<HTMLAnchorElement>('nav a')];
    expect(links.map((link) => link.getAttribute('href'))).toContain('/sobre');
  });

  it('marks the link of the current page with aria-current', async () => {
    const { element } = await render('/sobre');
    const current = element.querySelector('a[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('Sobre');
  });

  it('opens and closes the mobile menu, and closes it after a link is clicked', async () => {
    const { element, fixture } = await render('/paises');
    const button = element.querySelector<HTMLButtonElement>('button')!;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    element.querySelector<HTMLAnchorElement>('#menu-principal a')!.click();
    await fixture.whenStable();
    expect(element.querySelector('#menu-principal')).toBeNull();
  });

  it('offers "Entrar" to whoever is signed out', async () => {
    const { element } = await render('/paises');
    expect(element.querySelector('a[href="/entrar"]')?.textContent?.trim()).toBe('Entrar');
    expect(element.querySelector('[data-account]')).toBeNull();
  });

  it('shows the e-mail and signs out with "Sair"', async () => {
    const { element, fixture, harness } = await render('/passaporte');
    fake.emit('SIGNED_IN', fakeSession('ana@exemplo.com'));
    await fixture.whenStable();
    expect(element.querySelector('[data-account]')?.textContent).toContain('ana@exemplo.com');

    [...element.querySelectorAll<HTMLButtonElement>('button')].find((button) => button.textContent?.trim() === 'Sair')!.click();
    await harness.fixture.whenStable();
    await fixture.whenStable();

    expect(fake.auth.signOut).toHaveBeenCalled();
    expect(TestBed.inject(Router).url).toBe('/paises');
    expect(element.querySelector('a[href="/entrar"]')).not.toBeNull();
  });
});
