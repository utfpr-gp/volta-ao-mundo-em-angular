import { TestBed } from '@angular/core/testing';
import { QueryLab } from './query-lab';

describe('QueryLab', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(QueryLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const run = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('[data-actions] button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    return { element, run };
  };

  it('focus() moves the cursor to the field found by viewChild', async () => {
    const { element, run } = await render();
    await run("country().nativeElement.focus()");
    expect(document.activeElement).toBe(element.querySelector('#query-country'));
  });

  it('reading .value shows what is in the field', async () => {
    const { element, run } = await render();
    await run('note().nativeElement.value');
    expect(element.querySelector('[data-result]')!.textContent).toContain('Comer ramen');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('Comer ramen');
  });
});
