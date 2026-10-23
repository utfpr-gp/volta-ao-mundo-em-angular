import { TestBed } from '@angular/core/testing';
import { LibraryPicker } from './library-picker';

describe('LibraryPicker', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(LibraryPicker);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const check = async (label: string) => {
      [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!.click();
      await fixture.whenStable();
    };
    const ranking = () => [...element.querySelectorAll('[data-library]')].map((li) => (li as HTMLElement).dataset['library']);
    const card = (name: string) => element.querySelector(`[data-library="${name}"]`)!.textContent!;
    return { element, check, ranking, card };
  };

  it('starts with no needs checked and every library in the list', async () => {
    const { ranking, element } = await render();
    expect(ranking()).toHaveLength(5);
    expect(element.querySelector('[data-hint]')!.textContent).toContain('Marque');
  });

  it('a ready-made look puts Material and PrimeNG on top', async () => {
    const { check, ranking } = await render();
    await check('visual pronto');
    expect(ranking().slice(0, 2).sort()).toEqual(['material', 'primeng']);
  });

  it('Tailwind plus editing the code puts Spartan first', async () => {
    const { check, ranking } = await render();
    await check('já usa Tailwind');
    await check('editar o código');
    expect(ranking()[0]).toBe('spartan');
  });

  it('warns about the PrimeNG license for a large company', async () => {
    const { check, card } = await render();
    expect(card('primeng')).not.toContain('licença paga');
    await check('empresa grande');
    expect(card('primeng')).toContain('licença paga');
  });
});
