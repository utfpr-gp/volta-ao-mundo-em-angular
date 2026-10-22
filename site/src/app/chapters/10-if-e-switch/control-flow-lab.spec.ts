import { TestBed } from '@angular/core/testing';
import { ControlFlowLab, levelFor } from './control-flow-lab';

describe('levelFor', () => {
  it('maps the number of countries to the traveler level', () => {
    expect([0, 1, 9, 10, 49, 50].map(levelFor)).toEqual([
      'airport', 'backpacker', 'backpacker', 'traveler', 'traveler', 'explorer',
    ]);
  });
});

describe('ControlFlowLab', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ControlFlowLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const slide = async (value: number) => {
      const range = element.querySelector<HTMLInputElement>('input[type="range"]')!;
      range.value = String(value);
      range.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const activeBranches = () => [...element.querySelectorAll('[data-branch][data-active]')].map((b) => b.getAttribute('data-branch'));
    return { fixture, element, slide, activeBranches };
  };

  it('with zero countries, the @if branch and the airport case are active', async () => {
    const { element, slide, activeBranches } = await render();
    await slide(0);
    expect(activeBranches()).toEqual(expect.arrayContaining(['if', 'airport']));
    expect(element.querySelector('[data-preview]')!.textContent).toContain('Nenhum país ainda');
  });

  it('with 25 countries, the @else branch and the traveler case are active', async () => {
    const { element, slide, activeBranches } = await render();
    await slide(25);
    expect(activeBranches()).toEqual(expect.arrayContaining(['else', 'traveler']));
    expect(element.querySelector('[data-preview]')!.textContent).toContain('25 de 195 países');
  });

  it('with 80 countries, the @default case is active', async () => {
    const { slide, activeBranches } = await render();
    await slide(80);
    expect(activeBranches()).toContain('default');
  });

  it('lists which elements are in the page (DOM) right now and announces the change', async () => {
    const { element, slide } = await render();
    await slide(0);
    expect(element.querySelector('[data-dom]')!.textContent).toContain('p.empty');
    expect(element.querySelector('[data-dom]')!.textContent).not.toContain('p.count');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('@if');
  });
});
