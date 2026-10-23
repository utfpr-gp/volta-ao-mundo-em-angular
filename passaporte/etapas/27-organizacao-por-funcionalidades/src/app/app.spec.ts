import { BRAZILIAN_LOCALE } from './core/locale';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  let harness: RouterTestingHarness;
  const text = () => (harness.routeNativeElement as HTMLElement).textContent!;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), BRAZILIAN_LOCALE] });
    harness = await RouterTestingHarness.create();
  });

  it('sends the empty address to the countries page', async () => {
    await harness.navigateByUrl('/');
    expect(TestBed.inject(Title).getTitle()).toBe('Países · Passaporte');
    expect((harness.routeNativeElement as HTMLElement).querySelectorAll('app-country-card').length).toBe(6);
  });

  it('shows the about page at /sobre, with its own title', async () => {
    await harness.navigateByUrl('/sobre');
    expect(text()).toContain('Sobre o Passaporte');
    expect(TestBed.inject(Title).getTitle()).toBe('Sobre · Passaporte');
  });

  it('shows the not-found page for an address that does not exist', async () => {
    await harness.navigateByUrl('/paizes');
    expect(text()).toContain('Esta página não existe');
    expect(TestBed.inject(Title).getTitle()).toBe('Página não encontrada · Passaporte');
  });

  it('keeps the header and the footer around every page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-header')?.textContent).toContain('Passaporte');
    expect(element.querySelector('router-outlet')).not.toBeNull();
    expect(element.querySelector('app-footer')).not.toBeNull();
  });
});
