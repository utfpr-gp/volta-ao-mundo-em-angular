import { TestBed } from '@angular/core/testing';
import { ScreenReaderSim } from './screen-reader-sim';

describe('ScreenReaderSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ScreenReaderSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const press = async (label: string, times = 1) => {
      for (let i = 0; i < times; i++) {
        [...element.querySelectorAll('button')].find((b) => b.textContent!.includes(label))!.click();
        await fixture.whenStable();
      }
    };
    const choose = async (value: string) => {
      element.querySelector<HTMLInputElement>(`input[value="${value}"]`)!.click();
      await fixture.whenStable();
    };
    const heard = () => [...element.querySelectorAll('[data-heard] li')].map((li) => li.textContent!.replace('🔊', '').trim());
    const announced = () => element.querySelector('[data-announce]')!.textContent!.trim();
    return { press, choose, heard, announced };
  };

  it('before the chapter, says only "Visitar", with no country', async () => {
    const { press, heard } = await render();
    await press('Tab', 6);
    expect(heard().at(-1)).toBe('Visitar, botão');
  });

  it('after the chapter, names the country and tells which filter is on', async () => {
    const { press, choose, heard, announced } = await render();
    await choose('after');
    await press('Tab', 2);
    expect(heard().at(-1)).toContain('Todos, opção, selecionada');
    await press('Tab', 2);
    expect(heard().at(-1)).toBe('Visitar Afeganistão, botão');
    expect(announced()).toBe('Visitar Afeganistão, botão');
  });

  it('finds the page title among the headings only after the chapter', async () => {
    const { press, choose, heard } = await render();
    await press('Próximo título');
    expect(heard().at(-1)).toBe('Japão, título nível 2');
    await choose('after');
    await press('Próximo título');
    expect(heard().at(-1)).toBe('Países, título nível 1');
  });

  it('announces the search result only after the chapter', async () => {
    const { press, choose, heard } = await render();
    await press('Digitar');
    expect(heard().at(-1)).toContain('silêncio');
    await choose('after');
    await press('Digitar');
    expect(heard().at(-1)).toBe('1 de 195 países');
  });
});
