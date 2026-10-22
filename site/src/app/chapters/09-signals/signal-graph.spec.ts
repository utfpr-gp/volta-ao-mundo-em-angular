import { TestBed } from '@angular/core/testing';
import { SignalGraph } from './signal-graph';

describe('SignalGraph', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(SignalGraph);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const text = (selector: string) => element.querySelector(selector)!.textContent!.replace(/\s+/g, ' ');
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    return { fixture, element, text, click };
  };

  it('shows the signal, the computed and the screen with the initial values', async () => {
    const { text } = await render();
    expect(text('[data-node="visited"]')).toContain('visited = 3');
    expect(text('[data-node="percent"]')).toContain('percent = 2%');
    expect(text('[data-node="screen"]')).toContain('3 países · 2% do mundo');
  });

  it('a new visited country updates the computed and the screen, and the computed runs again', async () => {
    const { text, click } = await render();
    const before = text('[data-runs]');
    await click('Visitei mais um');
    expect(text('[data-node="percent"]')).toContain('percent = 2%');
    expect(text('[data-node="screen"]')).toContain('4 países');
    expect(text('[data-runs]')).not.toBe(before);
  });

  it('changing only the name does not make the computed run again', async () => {
    const { fixture, element, text } = await render();
    const before = text('[data-runs]');
    const field = element.querySelector<HTMLInputElement>('input')!;
    field.value = 'Bia';
    field.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(text('[data-node="screen"]')).toContain('Passaporte de Bia');
    expect(text('[data-runs]')).toBe(before);
  });

  it('announces which path the change took', async () => {
    const { element, click } = await render();
    await click('Visitei mais um');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('visited → percent → tela');
  });
});
