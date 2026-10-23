import { TestBed } from '@angular/core/testing';
import { TokenEditor } from './token-editor';

describe('TokenEditor', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(TokenEditor);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const preview = () => element.querySelector<HTMLElement>('[data-preview]')!;
    return { fixture, element, preview };
  };

  it('starts with the Passaporte tokens on the preview', async () => {
    const { preview, element } = await render();
    expect(preview().style.getPropertyValue('--sim-primary')).toBe('#12263A');
    expect(element.querySelector('[data-tokens]')!.textContent).toContain('--color-primary: #12263A;');
  });

  it('changing the primary color updates every place that uses the token', async () => {
    const { fixture, element, preview } = await render();
    element.querySelector<HTMLInputElement>('input[name="primaria"][value="#1E5A3C"]')!.click();
    await fixture.whenStable();
    expect(preview().style.getPropertyValue('--sim-primary')).toBe('#1E5A3C');
    expect(element.querySelector('[data-tokens]')!.textContent).toContain('--color-primary: #1E5A3C;');
  });

  it('the radius slider changes the radius token', async () => {
    const { fixture, element, preview } = await render();
    const range = element.querySelector<HTMLInputElement>('input[type="range"]')!;
    range.value = '20';
    range.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(preview().style.getPropertyValue('--sim-radius')).toBe('20px');
  });

  it('dark mode swaps the values of the same tokens, not the names', async () => {
    const { fixture, element, preview } = await render();
    const before = preview().style.getPropertyValue('--sim-surface');
    element.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    await fixture.whenStable();
    expect(preview().style.getPropertyValue('--sim-surface')).not.toBe(before);
    expect(element.querySelector('[data-announce]')!.textContent).toContain('escuro');
  });
});
