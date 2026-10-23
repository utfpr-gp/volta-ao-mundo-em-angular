import { TestBed } from '@angular/core/testing';
import { ServiceSim } from './service-sim';

describe('ServiceSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ServiceSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (selector: string) => {
      element.querySelector<HTMLButtonElement>(selector)!.click();
      await fixture.whenStable();
    };
    const mode = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('[role="group"] button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const screen = (id: string) => element.querySelector(`[data-screen="${id}"]`)!.textContent!;
    const q = (selector: string) => element.querySelector(selector)!.textContent!;
    return { click, mode, screen, q };
  };

  it('with one service, a change on one screen shows on all of them', async () => {
    const { click, screen, q } = await render();
    await click('[data-screen="lista"] button');
    expect(screen('lista')).toContain('Japão ✓');
    expect(screen('pais')).toContain('Visitado');
    expect(screen('passaporte')).toContain('4 carimbos');
    expect(q('[data-instances]')).toContain('1 objeto Passport');
  });

  it('with a copy per screen, the change stays on the screen that made it', async () => {
    const { click, mode, screen, q } = await render();
    await mode('Uma cópia');
    await click('[data-screen="lista"] button');
    expect(screen('lista')).toContain('Japão ✓');
    expect(screen('pais')).toContain('Ainda não visitado');
    expect(screen('passaporte')).toContain('3 carimbos');
    expect(q('[data-instances]')).toContain('3 objetos Passport');
  });

  it('switching the mode starts over', async () => {
    const { click, mode, screen } = await render();
    await click('[data-screen="lista"] button');
    await mode('Uma cópia');
    expect(screen('passaporte')).toContain('3 carimbos');
  });
});
