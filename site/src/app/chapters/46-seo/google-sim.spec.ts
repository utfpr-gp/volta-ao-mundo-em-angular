import { TestBed } from '@angular/core/testing';
import { GoogleSim } from './google-sim';

describe('GoogleSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(GoogleSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const choose = async (value: string) => {
      element.querySelector<HTMLInputElement>(`input[value="${value}"]`)!.click();
      await fixture.whenStable();
    };
    const type = async (selector: string, text: string) => {
      const field = element.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
      field.value = text;
      field.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    return { element, choose, type };
  };

  it('shows the empty app-root of the SPA first, and the full page after prerendering', async () => {
    const { element, choose } = await render();
    expect(element.querySelector('[data-html]')!.textContent).toContain('<app-root></app-root>');
    expect(element.querySelector('[data-verdict]')!.textContent).toContain('vazio');
    await choose('prerendered');
    expect(element.querySelector('[data-html]')!.textContent).toContain('<h1 class="text-3xl font-extrabold">Japão</h1>');
  });

  it('updates the previews while typing, and cuts a long title in the search result', async () => {
    const { element, type } = await render();
    await type('input:not([type])', 'Japão: o país do sol nascente, com templos, trens-bala e lámen · Passaporte');
    expect(element.querySelector('[data-search] .text-lg')!.textContent!.trim()).toMatch(/…$/);
    expect(element.querySelector('[data-card] .font-bold')!.textContent).toContain('trens-bala');
  });
});
