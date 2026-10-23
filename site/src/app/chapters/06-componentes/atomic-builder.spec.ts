import { TestBed } from '@angular/core/testing';
import { AtomicBuilder, LEVELS } from './atomic-builder';

describe('AtomicBuilder', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(AtomicBuilder);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const pick = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('[data-levels] button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const active = () => [...element.querySelectorAll('[data-piece][data-active]')].map((piece) => piece.getAttribute('data-piece'));
    return { fixture, element, pick, active };
  };

  it('has the five levels of Atomic Design, in order', () => {
    expect(LEVELS.map((level) => level.label)).toEqual(['Átomos', 'Moléculas', 'Organismos', 'Template', 'Página']);
  });

  it('atoms highlight the smallest pieces: flag, name, capital, logo and links', async () => {
    const { pick, active } = await render();
    await pick('Átomos');
    expect(active()).toEqual(expect.arrayContaining(['logo', 'link', 'flag', 'name', 'capital']));
    expect(active()).not.toContain('card');
  });

  it('molecules highlight the country cards and the menu', async () => {
    const { pick, active } = await render();
    await pick('Moléculas');
    expect(new Set(active())).toEqual(new Set(['card', 'menu']));
  });

  it('organisms highlight header, list and footer, and the tree shows the components', async () => {
    const { element, pick, active } = await render();
    await pick('Organismos');
    expect(new Set(active())).toEqual(new Set(['header', 'list', 'footer']));
    expect(element.querySelector('[data-tree]')!.textContent).toContain('CountryList');
  });

  it('the template hides the real data and the page shows it', async () => {
    const { element, pick } = await render();
    await pick('Template');
    expect(element.querySelector('[data-screen]')!.textContent).not.toContain('Brasil');
    await pick('Página');
    expect(element.querySelector('[data-screen]')!.textContent).toContain('Brasil');
  });

  it('announces the level description', async () => {
    const { element, pick } = await render();
    await pick('Moléculas');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('Moléculas');
    expect(element.querySelector('[data-levels] button[aria-pressed="true"]')!.textContent).toContain('Moléculas');
  });
});
