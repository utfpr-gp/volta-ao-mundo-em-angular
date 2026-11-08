import { TestBed } from '@angular/core/testing';
import { SafetyNetSim } from './safety-net-sim';

describe('SafetyNetSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(SafetyNetSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const choose = async (id: string) => {
      element.querySelector<HTMLInputElement>(`input[value="${id}"]`)!.click();
      await fixture.whenStable();
    };
    const failed = () => [...element.querySelectorAll('[data-results] li')].filter((li) => li.textContent!.trim().startsWith('×')).length;
    const text = () => element.querySelector('[data-results]')!.textContent!;
    const summary = () => element.querySelector('[data-summary]')!.textContent!.trim();
    return { choose, failed, text, summary };
  };

  it('passes every test with the code of the stage', async () => {
    const { failed, summary } = await render();
    expect(failed()).toBe(0);
    expect(summary()).toContain('5 passed');
  });

  it('catches each planted bug with at least one test', async () => {
    const { choose, failed } = await render();
    for (const id of ['days', 'countries', 'tie', 'empty']) {
      await choose(id);
      expect(failed(), id).toBeGreaterThan(0);
    }
  });

  it('shows the real error when the empty diary breaks the function', async () => {
    const { choose, text, summary } = await render();
    await choose('empty');
    expect(text()).toContain('TypeError');
    expect(summary()).toContain('a rede pegou o defeito');
  });

  it('shows the message of the failed assertion', async () => {
    const { choose, text } = await render();
    await choose('days');
    expect(text()).toContain('expected 2 to be 17');
  });
});
