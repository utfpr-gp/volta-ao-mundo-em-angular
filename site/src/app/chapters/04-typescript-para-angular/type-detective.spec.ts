import { TestBed } from '@angular/core/testing';
import { SCENARIOS, TypeDetective } from './type-detective';

describe('SCENARIOS (detetive de tipos)', () => {
  it('every scenario has at least one accepted and one rejected option, and every rejection has a real TS message', () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.options.some((option) => option.error === null)).toBe(true);
      const rejected = scenario.options.filter((option) => option.error !== null);
      expect(rejected.length).toBeGreaterThan(0);
      for (const option of rejected) expect(option.error).toMatch(/^error TS\d{4}: /);
    }
  });
});

describe('TypeDetective', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(TypeDetective);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const choose = async (label: string) => {
      const button = [...element.querySelectorAll<HTMLButtonElement>('[data-options] button')].find((b) =>
        b.textContent!.includes(label),
      )!;
      button.click();
      await fixture.whenStable();
    };
    return { fixture, element, choose };
  };

  it('accepting a valid value says so', async () => {
    const { element, choose } = await render();
    await choose('213_000_000');
    expect(element.querySelector('[aria-live="polite"]')!.textContent).toContain('O TypeScript aceita');
  });

  it('a wrong value shows the real compiler message', async () => {
    const { element, choose } = await render();
    await choose("'213 milhões'");
    expect(element.querySelector('[data-verdict]')!.textContent).toContain(
      "error TS2322: Type 'string' is not assignable to type 'number'.",
    );
  });

  it('moves to the next case and shows the progress', async () => {
    const { fixture, element } = await render();
    expect(element.textContent).toContain(`Caso 1 de ${SCENARIOS.length}`);
    element.querySelector<HTMLButtonElement>('[data-next]')!.click();
    await fixture.whenStable();
    expect(element.textContent).toContain(`Caso 2 de ${SCENARIOS.length}`);
  });
});
