import { TestBed } from '@angular/core/testing';
import { ResolverSim } from './resolver-sim';

describe('ResolverSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ResolverSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (selector: string) => {
      element.querySelector<HTMLElement>(selector)!.click();
      await fixture.whenStable();
    };
    const moments = () => [...element.querySelectorAll('[data-moments] li')].map((li) => li.textContent!.replace(/\s+/g, ' ').trim());
    const announced = () => element.querySelector('[data-announce]')!.textContent!.trim();
    return { click, moments, announced };
  };

  it('without a resolver, the page opens at once, loading, and the title keeps the code', async () => {
    const { click, moments } = await render();
    await click('button');
    expect(moments()[0]).toContain('Carregando o país…');
    expect(moments()[1]).toContain('JP · Passaporte (o título não muda mais)');
  });

  it('with a resolver, the old page stays until the data arrives, and the title is born right', async () => {
    const { click, moments, announced } = await render();
    await click('input[value="resolver"]');
    await click('button');
    expect(moments()[0]).toContain('/paises');
    expect(moments()[0]).toContain('a navegação espera o resolver');
    expect(moments()[1]).toContain('Japão · Passaporte');
    expect(announced()).toContain('O Japão, pronto de uma vez');
  });

  it('shows how each approach explains a failure of the API', async () => {
    const { click, moments } = await render();
    await click('input[value="fail"]');
    await click('button');
    expect(moments()[1]).toContain('Não encontramos o país JP');
    await click('input[value="resolver"]');
    await click('button');
    expect(moments()[1]).toContain('Não foi possível carregar os países');
  });
});
