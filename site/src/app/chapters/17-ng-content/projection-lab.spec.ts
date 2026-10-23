import { TestBed } from '@angular/core/testing';
import { ProjectionLab } from './projection-lab';

describe('ProjectionLab', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ProjectionLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const pick = async (value: string) => {
      element.querySelector<HTMLInputElement>(`input[name="conteudo"][value="${value}"]`)!.click();
      await fixture.whenStable();
    };
    return { fixture, element, pick };
  };

  it('projects the chosen content into the same frame', async () => {
    const { element, pick } = await render();
    expect(element.querySelector('[data-frame] [data-slot="body"]')!.textContent).toContain('Brasil');
    await pick('note');
    expect(element.querySelector('[data-frame] [data-slot="body"]')!.textContent).toContain('Comer ramen');
    expect(element.querySelector('[data-code]')!.textContent).toContain('<textarea');
  });

  it('turning the title off leaves the title slot empty', async () => {
    const { fixture, element } = await render();
    element.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    await fixture.whenStable();
    expect(element.querySelector('[data-frame] [data-slot="title"]')!.textContent!.trim()).toBe('');
    expect(element.querySelector('[data-code]')!.textContent).not.toContain('panel-title');
  });
});
