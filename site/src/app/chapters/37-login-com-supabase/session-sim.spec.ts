import { TestBed } from '@angular/core/testing';
import { SessionSim } from './session-sim';

describe('SessionSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(SessionSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const state = () => element.querySelector('[data-state]')!.textContent!.replace(/\s+/g, ' ');
    const events = () => [...element.querySelectorAll('[data-events] li')].map((li) => li.textContent!.trim());
    const announce = () => element.querySelector('[data-announce]')!.textContent!.trim();
    return { click, state, events, announce };
  };

  it('starts signed out, with nothing stored', async () => {
    const { state, events } = await render();
    expect(state()).toContain('auth.signedIn(): false');
    expect(state()).toContain('null');
    expect(events()).toEqual(['(nenhum aviso ainda)']);
  });

  it('signs in with the right password, announcing SIGNED_IN and storing the session', async () => {
    const { click, state, events, announce } = await render();
    await click('senha certa');
    expect(events()).toEqual(['SIGNED_IN']);
    expect(state()).toContain('auth.user()?.email: "ana@exemplo.com"');
    expect(state()).toContain('role: "authenticated"');
    expect(announce()).toBe('SIGNED_IN');
  });

  it('does not announce anything for a wrong password', async () => {
    const { click, state, events } = await render();
    await click('senha errada');
    expect(events()[0]).toContain('invalid_credentials');
    expect(state()).toContain('auth.signedIn(): false');
  });

  it('keeps the session across a reload, and renews the token after an hour', async () => {
    const { click, state, events } = await render();
    await click('senha certa');
    await click('Recarregar');
    expect(events()).toEqual(['SIGNED_IN', '— página recarregada —', 'INITIAL_SESSION (achou a sessão guardada)']);
    expect(state()).toContain('auth.signedIn(): true');

    await click('Passar 1 hora');
    expect(events().at(-1)).toBe('TOKEN_REFRESHED');
    expect(state()).toContain('vence: "minuto 120"');
  });

  it('forgets everything on sign out, even after a reload', async () => {
    const { click, state, events } = await render();
    await click('senha certa');
    await click('signOut()');
    await click('Recarregar');
    expect(events().slice(-2)).toEqual(['— página recarregada —', 'INITIAL_SESSION (sem sessão)']);
    expect(state()).toContain('auth.signedIn(): false');
    expect(state()).toContain('(sem token)');
  });
});
