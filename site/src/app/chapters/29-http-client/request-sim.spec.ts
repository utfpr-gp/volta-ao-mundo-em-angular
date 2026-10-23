import { TestBed } from '@angular/core/testing';
import { RequestSim } from './request-sim';

describe('RequestSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(RequestSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const toggle = async (label: string) => {
      [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!.click();
      await fixture.whenStable();
    };
    const rows = () => [...element.querySelectorAll('[data-request]')].map((r) => r.textContent!.replace(/\s+/g, ' ').trim());
    const q = (selector: string) => element.querySelector(selector)!.textContent!;
    return { click, toggle, rows, q };
  };

  it('opening the app sends two GETs and the screen gets the countries', async () => {
    const { click, rows, q } = await render();
    await click('Abrir o app');
    expect(rows()).toHaveLength(2);
    expect(rows()[0]).toContain('GET');
    expect(rows()[0]).toContain('200');
    expect(q('[data-state]')).toContain("status: 'pronto'");
    expect(q('[data-screen]')).toContain('195 países');
  });

  it('marking a country sends a PUT with the whole passport', async () => {
    const { click, rows } = await render();
    await click('Abrir o app');
    await click('Marcar o Japão');
    expect(rows().at(-1)).toContain('PUT');
    expect(rows().at(-1)).toContain('"JP"');
  });

  it('with the API down, the list shows the error and the retry button', async () => {
    const { click, toggle, rows, q } = await render();
    await toggle('API fora do ar');
    await click('Abrir o app');
    expect(rows()[0]).toContain('503');
    expect(q('[data-state]')).toContain("status: 'erro'");
    expect(q('[data-screen]')).toContain('Tentar de novo');
  });

  it('with json-server off, the passport is not saved and the warning appears', async () => {
    const { click, toggle, rows, q } = await render();
    await toggle('json-server desligado');
    await click('Abrir o app');
    expect(rows()[1]).toContain('falhou');
    expect(q('[data-state]')).toContain('saveFailed: true');
    expect(q('[data-screen]')).toContain('Não foi possível salvar');
  });

  it('without subscribe, nothing leaves the browser', async () => {
    const { click, toggle, rows, q } = await render();
    await toggle('subscribe');
    await click('Abrir o app');
    expect(rows()).toHaveLength(0);
    expect(q('[data-state]')).toContain("status: 'carregando'");
  });
});
