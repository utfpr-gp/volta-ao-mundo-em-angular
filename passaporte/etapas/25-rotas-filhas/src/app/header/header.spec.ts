import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Header } from './header';
import { routes } from '../app.routes';
import { BRAZILIAN_LOCALE } from '../locale';

describe('Header', () => {
  const render = async (url: string) => {
    TestBed.configureTestingModule({ imports: [Header], providers: [provideRouter(routes), BRAZILIAN_LOCALE] });
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
});
