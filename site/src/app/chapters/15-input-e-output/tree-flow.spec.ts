import { TestBed } from '@angular/core/testing';
import { TreeFlow } from './tree-flow';

describe('TreeFlow', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(TreeFlow);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const visit = async (code: string) => {
      element.querySelector<HTMLButtonElement>(`[data-child="${code}"] button`)!.click();
      await fixture.whenStable();
    };
    return { element, visit };
  };

  it('shows the parent array and one child card per country', async () => {
    const { element } = await render();
    expect(element.querySelectorAll('[data-child]').length).toBe(3);
    expect(element.querySelector('[data-parent]')!.textContent).toContain("{ code: 'JP', visited: false }");
  });

  it('a click in a child goes up as an output, the parent updates, and the new value comes down as an input', async () => {
    const { element, visit } = await render();
    await visit('JP');
    expect(element.querySelector('[data-parent]')!.textContent).toContain("{ code: 'JP', visited: true }");
    expect(element.querySelector('[data-child="JP"]')!.textContent).toContain('Visitado ✓');
    const log = element.querySelector('[data-log]')!.textContent!;
    expect(log).toContain("↑ output: toggled.emit('JP')");
    expect(log).toContain('↓ input: [country]');
  });

  it('announces the round trip', async () => {
    const { element, visit } = await render();
    await visit('BR');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('subiu');
  });
});
