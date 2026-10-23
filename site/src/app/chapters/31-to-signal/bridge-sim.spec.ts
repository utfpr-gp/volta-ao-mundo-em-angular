import { TestBed } from '@angular/core/testing';
import { BridgeSim } from './bridge-sim';

describe('BridgeSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(BridgeSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const emissions = () => [...element.querySelectorAll('[data-emission]')].map((e) => e.textContent!.trim());
    const q = (selector: string) => element.querySelector(selector)!.textContent!;
    return { click, emissions, q };
  };

  it('three sets in a row reach the Observable as one value: the last', async () => {
    const { click, emissions } = await render();
    await click('três vezes seguidas');
    expect(emissions()).toEqual(["'jap'"]);
  });

  it('the clock subscribes when it appears and unsubscribes when it goes away', async () => {
    const { click, q } = await render();
    expect(q('[data-active]')).toContain('0');
    await click('Mostrar o relógio');
    expect(q('[data-active]')).toContain('1');
    await click('Esconder o relógio');
    expect(q('[data-active]')).toContain('0');
  });
});
