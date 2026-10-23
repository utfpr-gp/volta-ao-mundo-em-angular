import { TestBed } from '@angular/core/testing';
import { EffectSim } from './effect-sim';

describe('EffectSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(EffectSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const q = (selector: string) => element.querySelector(selector)!.textContent!.replace(/\s+/g, ' ');
    return { click, q };
  };

  it('runs the effect once when the signal changes three times in a row', async () => {
    const { click, q } = await render();
    expect(q('[data-effect-runs]')).toContain('1');
    await click('de uma vez');
    expect(q('[data-effect-runs]')).toContain('2');
    expect(q('[data-saved]')).toContain('"visited":3');
  });

  it('computed is right at the moment of the click; the copy made by an effect is late', async () => {
    const { click, q } = await render();
    await click('Visitar mais um');
    expect(q('[data-snapshot]')).toContain('computed: 10');
    expect(q('[data-snapshot]')).toContain('cópia por effect: 0');
    expect(q('[data-mirror]')).toContain('10');
  });
});
