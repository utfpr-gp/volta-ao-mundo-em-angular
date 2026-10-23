import { TestBed } from '@angular/core/testing';
import { RouterSim } from './router-sim';

describe('RouterSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(RouterSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const go = async (url: string) => {
      const input = element.querySelector<HTMLInputElement>('input[type="text"]')!;
      input.value = url;
      input.dispatchEvent(new Event('input'));
      element.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLElement>('button, a')].find((b) => b.textContent!.trim() === label)!.click();
      await fixture.whenStable();
    };
    const toggle = async (label: string) => {
      [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!.click();
      await fixture.whenStable();
    };
    const q = (selector: string) => element.querySelector(selector)!.textContent!;
    return { element, go, click, toggle, q };
  };

  it('redirects the empty address and lights up the route that matched', async () => {
    const { go, q, element } = await render();
    await go('/');
    expect(q('[data-log]')).toContain('redirectTo');
    expect(q('[data-tab]')).toContain('Países · Passaporte');
    expect(element.querySelector('[data-route="paises"]')!.getAttribute('data-matched')).toBe('true');
  });

  it('a routerLink changes the page without reloading, so the data survives', async () => {
    const { click, q } = await render();
    await click('Visitar');
    expect(q('[data-state]')).toContain('1 visitado');
    await click('Sobre');
    await click('Países');
    expect(q('[data-address]')).toContain('/paises');
    expect(q('[data-state]')).toContain('1 visitado');
    expect(q('[data-reloads]')).toContain('0');
  });

  it('a plain href reloads the whole page and the data is lost', async () => {
    const { click, toggle, q } = await render();
    await toggle('href');
    await click('Visitar');
    await click('Sobre');
    await click('Países');
    expect(q('[data-reloads]')).toContain('2');
    expect(q('[data-state]')).toContain('0 visitado');
  });

  it('with ** first, every address falls into the not-found page', async () => {
    const { go, toggle, q } = await render();
    await toggle('**');
    await go('/sobre');
    expect(q('[data-page]')).toContain('Esta página não existe');
  });
});
