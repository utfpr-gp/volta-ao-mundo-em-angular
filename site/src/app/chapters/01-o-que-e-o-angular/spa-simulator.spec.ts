import { TestBed } from '@angular/core/testing';
import { SpaSimulator, initialSide, navigate } from './spa-simulator';

describe('navigate (modelo do simulador)', () => {
  it('on the traditional side, a click redraws header, content and footer and downloads a whole HTML page', () => {
    const side = navigate(initialSide('traditional'), 'visitados');
    expect(side.redrawn).toEqual(['header', 'content', 'footer']);
    expect(side.requests.at(-1)).toEqual({ path: '/visitados', kind: 'HTML', kb: 48 });
    expect(side.section).toBe('visitados');
  });

  it('on the SPA side, a click redraws only the content and downloads JSON', () => {
    const side = navigate(initialSide('spa'), 'visitados');
    expect(side.redrawn).toEqual(['content']);
    expect(side.requests.at(-1)).toEqual({ path: '/api/visitados', kind: 'JSON', kb: 2 });
  });

  it('the SPA pays more on the first visit and the traditional total grows faster after it', () => {
    let traditional = initialSide('traditional');
    let spa = initialSide('spa');
    expect(spa.totalKb).toBeGreaterThan(traditional.totalKb);
    for (const section of ['visitados', 'desejados', 'paises', 'visitados', 'desejados'] as const) {
      traditional = navigate(traditional, section);
      spa = navigate(spa, section);
    }
    expect(traditional.totalKb).toBeGreaterThan(spa.totalKb);
  });
});

describe('SpaSimulator', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(SpaSimulator);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const side = (mode: string) => element.querySelector(`[data-side="${mode}"]`)!;
    const click = async (mode: string, label: string) => {
      const button = [...side(mode).querySelectorAll<HTMLButtonElement>('nav button')].find((b) => b.textContent!.includes(label))!;
      button.click();
      await fixture.whenStable();
    };
    return { fixture, element, side, click };
  };

  it('clicking "Visitados" on the traditional side marks header, content and footer as redrawn and logs an HTML request', async () => {
    const { side, click } = await render();
    await click('traditional', 'Visitados');
    expect([...side('traditional').querySelectorAll('[data-redrawn]')].map((el) => el.getAttribute('data-region'))).toEqual([
      'header',
      'content',
      'footer',
    ]);
    expect(side('traditional').querySelector('ol')!.textContent).toContain('GET /visitados');
    expect(side('traditional').querySelector('ol')!.textContent).toContain('HTML');
  });

  it('clicking "Visitados" on the SPA side marks only the content as redrawn and logs a JSON request', async () => {
    const { side, click } = await render();
    await click('spa', 'Visitados');
    expect([...side('spa').querySelectorAll('[data-redrawn]')].map((el) => el.getAttribute('data-region'))).toEqual(['content']);
    expect(side('spa').querySelector('ol')!.textContent).toContain('GET /api/visitados');
  });

  it('shows the total transferred on each side', async () => {
    const { side, click } = await render();
    await click('traditional', 'Visitados');
    expect(side('traditional').textContent).toContain('96 KB');
  });

  it('every click announces what happened in an aria-live region', async () => {
    const { element, click } = await render();
    await click('traditional', 'Desejados');
    expect(element.querySelector('[aria-live="polite"]')!.textContent).toContain('página inteira');
    await click('spa', 'Desejados');
    expect(element.querySelector('[aria-live="polite"]')!.textContent).toContain('só os dados');
  });

  it('the redraw is shown by an outline, and the flash only plays with motion-safe', async () => {
    const { side, click } = await render();
    await click('spa', 'Visitados');
    const content = side('spa').querySelector('[data-redrawn]')!;
    expect(content.className).toMatch(/\bring-4\b/);
    expect(content.className).toMatch(/motion-safe:animate-redraw/);
    expect(content.className).not.toMatch(/(^|\s)animate-redraw/);
  });

  it('all controls are buttons; "Recomeçar" resets both sides', async () => {
    const { element, side, click, fixture } = await render();
    await click('traditional', 'Visitados');
    await click('spa', 'Visitados');
    const reset = [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes('Recomeçar'))!;
    reset.click();
    await fixture.whenStable();
    expect(side('traditional').querySelectorAll('ol li').length).toBe(1);
    expect(side('spa').querySelectorAll('ol li').length).toBe(1);
    expect(element.querySelectorAll('[data-redrawn]').length).toBe(0);
    expect(element.querySelectorAll('nav button').length).toBe(6);
  });

  it('the current section button is marked with aria-current', async () => {
    const { side, click } = await render();
    await click('spa', 'Desejados');
    expect(side('spa').querySelector('nav button[aria-current="true"]')!.textContent).toContain('Desejados');
  });
});
