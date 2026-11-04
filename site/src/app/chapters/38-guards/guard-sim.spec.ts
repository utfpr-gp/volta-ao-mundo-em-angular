import { TestBed } from '@angular/core/testing';
import { GuardSim } from './guard-sim';

describe('GuardSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(GuardSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const check = async (selector: string) => {
      element.querySelector<HTMLInputElement>(selector)!.click();
      await fixture.whenStable();
    };
    const trace = () => [...element.querySelectorAll('[data-trace] li')].map((li) => li.textContent!.trim());
    return { click, check, trace, element };
  };

  it('sends whoever is signed out to /entrar, with the way back', async () => {
    const { click, trace } = await render();
    await click('abrir /passaporte');
    expect(trace()).toContain('authGuard: devolve UrlTree → /entrar?voltar=%2Fpassaporte');
    expect(trace().at(-1)).toBe('guestGuard: devolve true, a tela de entrar abre');
  });

  it('lets Ana in, and sends her away from /entrar', async () => {
    const { click, check, trace } = await render();
    await check('input[name="sim-person"]:not(:checked)');
    await click('abrir /passaporte');
    expect(trace().at(-1)).toBe('authGuard: devolve true, a tela abre');

    await click('abrir /entrar');
    expect(trace()).toContain('guestGuard: esperou a sessão, a Ana está logada → /passaporte');
    expect(trace().at(-1)).toBe('authGuard: devolve true, a tela abre');
  });

  it('opens a page without a guard straight away', async () => {
    const { click, trace } = await render();
    await click('abrir /paises');
    expect(trace().at(-1)).toBe('/paises: sem guard, a tela abre');
  });

  it('decides too early when it does not wait and the token expired', async () => {
    const { click, check, trace } = await render();
    await check('input[name="sim-person"]:not(:checked)');
    await check('#sim-expired');
    await check('#sim-wait');
    await click('abrir /passaporte');
    expect(trace()).toContain('authGuard: não esperou; a sessão ainda não chegou, e signedIn() vale false');
    expect(trace().at(-1)).toContain('depois de passar pela tela de entrar');
  });

  it('decides right when it waits, even with the token expired', async () => {
    const { click, check, trace } = await render();
    await check('input[name="sim-person"]:not(:checked)');
    await check('#sim-expired');
    await click('abrir /passaporte');
    expect(trace()).toEqual(['navegar para /passaporte', 'authGuard: esperou o whenReady(); signedIn() vale true', 'authGuard: devolve true, a tela abre']);
  });
});
