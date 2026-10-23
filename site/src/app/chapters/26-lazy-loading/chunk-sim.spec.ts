import { TestBed } from '@angular/core/testing';
import { ChunkSim } from './chunk-sim';

describe('ChunkSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ChunkSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim() === label)!.click();
      await fixture.whenStable();
    };
    const files = () => [...element.querySelectorAll('[data-file]')].map((li) => (li as HTMLElement).dataset['file']);
    const q = (selector: string) => element.querySelector(selector)!.textContent!;
    return { click, files, q };
  };

  it('with lazy loading, opening the app downloads main, the styles and the first page', async () => {
    const { files, q } = await render();
    expect(files()).toEqual(['main', 'styles', 'countries-page', 'countries.ts']);
    expect(q('[data-total]')).toContain('289,4 kB');
  });

  it('downloads a page the first time it opens, and never again', async () => {
    const { click, files } = await render();
    await click('🇯🇵 Japão');
    expect(files().at(-1)).toBe('country-routes');
    const count = files().length;
    await click('📋 Países');
    await click('🇯🇵 Japão');
    expect(files()).toHaveLength(count);
  });

  it('without lazy loading, everything comes in main and navigation downloads nothing', async () => {
    const { click, files, q } = await render();
    await click('Tudo no main');
    expect(files()).toEqual(['main', 'styles']);
    expect(q('[data-total]')).toContain('291,6 kB');
    await click('ℹ️ Sobre');
    expect(files()).toEqual(['main', 'styles']);
  });

  it('with preloading, the other pages come in the background after the app opens', async () => {
    const { click, files, q } = await render();
    await click('Sob demanda + pré-carregar');
    expect(files()).toContain('about-page');
    expect(files()).toContain('country-routes');
    expect(q('[data-file="about-page"]')).toContain('em segundo plano');
  });
});
