import { TestBed } from '@angular/core/testing';
import { ValidationSim } from './validation-sim';

describe('ValidationSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ValidationSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const input = () => element.querySelector<HTMLInputElement>('#sim-companion')!;
    const type = async (value: string) => {
      input().value = value;
      input().dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const leave = async () => {
      input().dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    const choose = async (label: string) => {
      [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!.click();
      await fixture.whenStable();
    };
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const state = () => element.querySelector('[data-state]')!.textContent!.replace(/\s+/g, ' ');
    const message = () => element.querySelector('#sim-companion-error');
    const announce = () => element.querySelector('[data-announce]')!.textContent!.trim();
    return { type, leave, choose, click, state, message, announce, input };
  };

  it('with ^ and $, refuses a digit anywhere and shows the message only after leaving the field', async () => {
    const { type, leave, state, message, input, announce } = await render();
    await type('Ana2');
    expect(state()).toContain('status: INVALID');
    expect(message()).toBeNull();
    await leave();
    expect(message()?.textContent).toContain('Use só letras');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(announce()).toContain('Mensagem de erro à mostra');
  });

  it('accepts accents and apostrophes', async () => {
    const { type, state } = await render();
    await type("Pedro d'Ávila");
    expect(state()).toContain('status: VALID');
  });

  it('without ^ and $, a single letter is enough, so "Ana2" passes', async () => {
    const { type, choose, state } = await render();
    await choose('Sem ^ e $');
    await type('Ana2');
    expect(state()).toContain('status: VALID');
  });

  it('with the g flag, validating the same value again flips the result', async () => {
    const { type, choose, click, state } = await render();
    await choose('Com a flag g');
    await type('Ana');
    const first = state().includes('status: VALID');
    await click('updateValueAndValidity()');
    expect(state().includes('status: VALID')).toBe(!first);
    expect(state()).toContain('validações deste valor: 2');
    await click('updateValueAndValidity()');
    expect(state().includes('status: VALID')).toBe(first);
  });

  it('chooses the moment of the message: always, or only after trying to send', async () => {
    const { type, choose, click, message } = await render();
    await choose('Sempre');
    await type('Ana2');
    expect(message()).not.toBeNull();
    await choose('Ao tentar enviar');
    expect(message()).toBeNull();
    await click('Tentar enviar');
    expect(message()).not.toBeNull();
    await click('Recomeçar');
    expect(message()).toBeNull();
  });
});
