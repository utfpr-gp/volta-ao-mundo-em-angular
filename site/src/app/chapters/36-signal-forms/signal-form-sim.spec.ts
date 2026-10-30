import { TestBed } from '@angular/core/testing';
import { SignalFormSim } from './signal-form-sim';

describe('SignalFormSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(SignalFormSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const input = (id: string) => element.querySelector<HTMLInputElement>(`#sim-${id}`)!;
    const type = async (id: string, value: string) => {
      input(id).value = value;
      input(id).dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const leave = async (id: string) => {
      input(id).dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const state = () => element.querySelector('[data-state]')!.textContent!.replace(/\s+/g, ' ');
    const message = (id: string) => element.querySelector(`#sim-${id}-error`)?.textContent?.trim();
    const announce = () => element.querySelector('[data-announce]')!.textContent!.replace(/\s+/g, ' ').trim();
    const submitResult = () => element.querySelector('[data-submit]')?.textContent?.trim();
    return { type, leave, click, state, message, announce, input, submitResult };
  };

  it('writes what is typed into the model, and an empty number field becomes null', async () => {
    const { type, state, announce } = await render();
    await type('companion', 'Ana');
    expect(state()).toContain('"companion": "Ana"');
    await type('days', '');
    expect(state()).toContain('"days": null');
    expect(state()).toContain("errors: ['required']");
    expect(announce()).toContain('Formulário inválido');
  });

  it('shows the message of the schema only after leaving the field', async () => {
    const { type, leave, message, input } = await render();
    await type('companion', 'Ana2');
    expect(message('companion')).toBeUndefined();
    await leave('companion');
    expect(message('companion')).toBe('Use só letras, espaços, apóstrofo e hífen.');
    expect(input('companion').getAttribute('aria-invalid')).toBe('true');
  });

  it('changes the fields when the model changes', async () => {
    const { click, input, state, announce } = await render();
    await click('trip.set(exemplo)');
    expect(input('days').value).toBe('12');
    expect(input('companion').value).toBe('Ana Maria');
    expect(announce()).toContain('Modelo: 12 dias, com Ana Maria. Formulário válido.');
    await click('days().value.set(0)');
    expect(input('days').value).toBe('0');
    expect(state()).toContain("errors: ['min']");
  });

  it('submit() refuses an invalid form and marks the fields as touched', async () => {
    const { click, message, submitResult, state } = await render();
    await click('days().value.set(0)');
    expect(message('days')).toBeUndefined();
    await click('submit(tripForm)');
    expect(submitResult()).toContain('devolveu false');
    expect(message('days')).toBe('A viagem tem de durar de 1 a 365 dias.');
    expect(state()).toContain('touched: true');
  });

  it('submit() runs the action when the form is valid, and reset() starts over', async () => {
    const { click, submitResult, input, state, message } = await render();
    await click('trip.set(exemplo)');
    await click('submit(tripForm)');
    expect(submitResult()).toContain('devolveu true');
    await click('days().value.set(0)');
    await click('reset()');
    expect(input('days').value).toBe('7');
    expect(input('companion').value).toBe('');
    expect(state()).not.toContain('touched: true');
    expect(message('days')).toBeUndefined();
    expect(submitResult()).toBeUndefined();
  });
});
