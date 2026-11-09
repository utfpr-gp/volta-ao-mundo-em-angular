import { TestBed } from '@angular/core/testing';
import { DeferSim } from './defer-sim';

describe('DeferSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(DeferSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const press = async (label: string) => {
      [...element.querySelectorAll('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const choose = async (selector: string) => {
      element.querySelector<HTMLInputElement>(selector)!.click();
      await fixture.whenStable();
    };
    const log = () => [...element.querySelectorAll('[data-log] li')].map((li) => li.textContent!.trim());
    const state = () => element.querySelector('[data-state]')!.textContent!.trim();
    return { press, choose, log, state };
  };

  it('with on viewport, downloads only when the chart enters the screen', async () => {
    const { press, log, state } = await render();
    await press('Abrir');
    expect(log().join(' ')).not.toContain('baixa');
    expect(state()).toContain('@placeholder');
    await press('Clicar');
    expect(state()).toContain('@placeholder');
    await press('Rolar');
    expect(log()).toContain('on viewport: baixa o trip-chart, 153,73 kB');
    expect(state()).toContain('o gráfico');
  });

  it('with on idle, downloads and shows as soon as the browser is idle', async () => {
    const { press, choose, log, state } = await render();
    await choose('input[value="idle"]');
    await press('Abrir');
    expect(log()).toContain('o navegador ficou ocioso: baixa o trip-chart, 153,73 kB');
    expect(state()).toContain('o gráfico');
  });

  it('with prefetch on idle, downloads early and shows at once on the interaction', async () => {
    const { press, choose, log } = await render();
    await choose('input[value="interaction"]');
    await choose('#sim-prefetch');
    await press('Abrir');
    expect(log()).toContain('prefetch on idle: baixa já, mas ainda não mostra: baixa o trip-chart, 153,73 kB');
    await press('Clicar');
    expect(log().at(-1)).toBe('on interaction: o código já estava aqui, e o gráfico aparece na hora');
  });
});
