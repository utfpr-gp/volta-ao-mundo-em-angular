import { TestBed } from '@angular/core/testing';
import { CacheSim } from './cache-sim';

describe('CacheSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(CacheSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (selector: string) => {
      element.querySelector<HTMLElement>(selector)!.click();
      await fixture.whenStable();
    };
    const result = () => element.querySelector('[data-result]')!.textContent!.trim();
    return { element, click, result };
  };

  it('answers from the network first, then from the cache with performance, even after the data changed', async () => {
    const { element, click, result } = await render();
    expect(element.querySelector('[data-result]')!.getAttribute('aria-live')).toBe('polite');
    await click('[data-request]');
    expect(result()).toContain('Veio da rede: a lista na versão 1');
    await click('[data-change]');
    await click('[data-request]');
    expect(result()).toContain('Veio do cache: a lista na versão 1');
    expect(result()).toContain('O servidor já está na versão 2');
  });

  it('goes to the network with freshness, and falls back to the cache when offline', async () => {
    const { element, click, result } = await render();
    element.querySelector<HTMLInputElement>('input[value="freshness"]')!.click();
    await click('[data-request]');
    await click('[data-change]');
    await click('[data-request]');
    expect(result()).toContain('Veio da rede: a lista na versão 2');
    await click('[data-online]');
    expect(element.querySelector('[data-online]')!.getAttribute('aria-pressed')).toBe('false');
    await click('[data-request]');
    expect(result()).toContain('A rede falhou');
  });

  it('fails offline with an empty cache', async () => {
    const { click, result } = await render();
    await click('[data-online]');
    await click('[data-request]');
    expect(result()).toContain('Falhou');
    await click('[data-online]');
    await click('[data-request]');
    await click('[data-clear]');
    expect(result()).toBe('O cache ficou vazio.');
  });
});
