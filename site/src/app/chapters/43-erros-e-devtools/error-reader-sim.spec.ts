import { TestBed } from '@angular/core/testing';
import { ErrorReaderSim } from './error-reader-sim';

describe('ErrorReaderSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ErrorReaderSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (selector: string) => {
      element.querySelector<HTMLInputElement>(selector)!.click();
      await fixture.whenStable();
    };
    const marked = () => element.querySelector('[data-message] mark')?.textContent ?? null;
    const found = () => element.querySelector('[data-found]')!.textContent!.trim();
    return { click, marked, found };
  };

  it('marks the code of the error first', async () => {
    const { marked, found } = await render();
    expect(marked()).toBe('TS2551');
    expect(found()).toBe('O código do erro: TS2551');
  });

  it('marks the hint, which in TS2551 is already the fix', async () => {
    const { click, marked } = await render();
    await click('input[value="hint"]');
    expect(marked()).toBe("Did you mean 'country'?");
  });

  it('finds the place in the code, in the runtime error', async () => {
    const { click, marked } = await render();
    await click('input[value="ng0203"]');
    await click('input[value="place"]');
    expect(marked()).toContain('authGuard');
  });

  it('says when a message does not have a part, as in production', async () => {
    const { click, marked, found } = await render();
    await click('input[value="ng0203-prod"]');
    await click('input[value="problem"]');
    expect(marked()).toBeNull();
    expect(found()).toBe('O problema: esta mensagem não tem.');
  });
});
