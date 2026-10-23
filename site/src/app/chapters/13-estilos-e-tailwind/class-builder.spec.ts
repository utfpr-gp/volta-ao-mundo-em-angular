import { TestBed } from '@angular/core/testing';
import { CLASS_GROUPS, ClassBuilder } from './class-builder';

describe('ClassBuilder', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ClassBuilder);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const pick = async (group: string, value: string) => {
      element.querySelector<HTMLInputElement>(`input[name="${group}"][value="${value}"]`)!.click();
      await fixture.whenStable();
    };
    return { fixture, element, pick };
  };

  it('has one native radio group per kind of utility', async () => {
    const { element } = await render();
    expect(element.querySelectorAll('fieldset').length).toBe(CLASS_GROUPS.length);
  });

  it('builds the class string and applies it to the preview card', async () => {
    const { element, pick } = await render();
    await pick('cantos', 'rounded-2xl');
    await pick('sombra', 'shadow-xl');
    const classes = element.querySelector('[data-classes]')!.textContent!;
    expect(classes).toContain('rounded-2xl');
    expect(classes).toContain('shadow-xl');
    const card = element.querySelector('[data-card]')!;
    expect(card.classList.contains('rounded-2xl')).toBe(true);
    expect(card.classList.contains('shadow-xl')).toBe(true);
  });

  it('announces the new class string', async () => {
    const { element, pick } = await render();
    await pick('fundo', 'bg-slate-900 text-white');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('bg-slate-900 text-white');
  });
});
