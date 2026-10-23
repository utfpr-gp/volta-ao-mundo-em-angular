import { TestBed } from '@angular/core/testing';
import { NestedSim } from './nested-sim';

describe('NestedSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(NestedSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === label)!.click();
      await fixture.whenStable();
    };
    const toggle = async (label: string) => {
      [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!.click();
      await fixture.whenStable();
    };
    const q = (selector: string) => element.querySelector(selector)!.textContent!;
    return { click, toggle, q };
  };

  it('opens the overview inside the country page, one outlet inside the other', async () => {
    const { q } = await render();
    expect(q('[data-address]')).toContain('/paises/JP/visao-geral');
    expect(q('[data-outer]')).toContain('CountryPage');
    expect(q('[data-inner]')).toContain('CountryOverview');
  });

  it('switching tabs swaps only the child; the country page stays', async () => {
    const { click, q } = await render();
    await click('Clima');
    expect(q('[data-address]')).toContain('/paises/JP/clima');
    expect(q('[data-inner]')).toContain('CountryWeather');
    expect(q('[data-log]')).toContain('CountryOverview destruído');
    expect(q('[data-log]')).toContain('CountryWeather criado');
    expect(q('[data-log]')).toContain('CountryPage continua');
  });

  it('without the inner router-outlet, the tab content has nowhere to appear', async () => {
    const { toggle, q } = await render();
    await toggle('router-outlet');
    expect(q('[data-inner]')).toContain('nada aparece');
  });

  it('a tab link starting with / leaves the country and falls into the 404', async () => {
    const { toggle, click, q } = await render();
    await toggle('barra');
    await click('Clima');
    expect(q('[data-address]')).toContain('/clima');
    expect(q('[data-outer]')).toContain('NotFoundPage');
  });
});
