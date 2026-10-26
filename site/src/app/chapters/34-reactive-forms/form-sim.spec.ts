import { TestBed } from '@angular/core/testing';
import { FormSim } from './form-sim';

describe('FormSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(FormSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const type = async (name: string, value: string) => {
      const input = element.querySelector<HTMLInputElement>(`[formControlName="${name}"]`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const state = () => element.querySelector('[data-state]')!.textContent!.replace(/\s+/g, ' ');
    return { element, fixture, type, click, state };
  };

  it('shows the value and marks the form as dirty when someone types', async () => {
    const { type, state } = await render();
    expect(state()).toContain('dirty: false');
    await type('country', 'Islândia');
    expect(state()).toContain('"country": "Islândia"');
    expect(state()).toContain('dirty: true');
  });

  it('patchValue changes only some fields; reset goes back to the start', async () => {
    const { click, state } = await render();
    await click('patchValue');
    expect(state()).toContain('"days": 15');
    expect(state()).toContain('"country": ""');
    await click('reset()');
    expect(state()).toContain('"days": 7');
  });

  it('with type="text", the number of days arrives as text', async () => {
    const { element, fixture, type, state } = await render();
    [...element.querySelectorAll('label')].find((l) => l.textContent!.includes('type="text"'))!.querySelector('input')!.click();
    await fixture.whenStable();
    await type('days', '12');
    expect(state()).toContain('"days": "12"');
    expect(state()).toContain('string');
  });
});
