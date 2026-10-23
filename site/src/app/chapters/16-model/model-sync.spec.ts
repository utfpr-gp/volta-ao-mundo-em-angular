import { TestBed } from '@angular/core/testing';
import { ModelSync } from './model-sync';

describe('ModelSync', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ModelSync);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const parentValue = () => element.querySelector('[data-parent-value]')!.textContent!.trim();
    const lit = () => element.querySelectorAll('[data-child] button[aria-pressed="true"]').length;
    return { fixture, element, parentValue, lit };
  };

  it('clicking a star in the child changes the parent value (child → parent)', async () => {
    const { fixture, element, parentValue } = await render();
    element.querySelectorAll<HTMLButtonElement>('[data-child] button')[3].click();
    await fixture.whenStable();
    expect(parentValue()).toBe('rating = 4');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('filho → pai');
  });

  it('the parent buttons change the stars in the child (parent → child)', async () => {
    const { fixture, element, lit } = await render();
    element.querySelector<HTMLButtonElement>('[data-parent] button[data-more]')!.click();
    await fixture.whenStable();
    expect(lit()).toBe(3);
    expect(element.querySelector('[data-announce]')!.textContent).toContain('pai → filho');
  });

  it('never goes above 5 or below 0', async () => {
    const { fixture, element, parentValue } = await render();
    const less = element.querySelector<HTMLButtonElement>('[data-parent] button[data-less]')!;
    for (let i = 0; i < 4; i++) less.click();
    await fixture.whenStable();
    expect(parentValue()).toBe('rating = 0');
  });
});
