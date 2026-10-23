import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceSim } from './resource-sim';

describe('ResourceSim', () => {
  let fixture: ComponentFixture<ResourceSim>;
  let element: HTMLElement;
  const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    await fixture.whenStable();
  };
  // Sem whenStable no clique: ele esperaria o carregamento terminar, e o teste não veria o loading.
  const click = async (label: string) => {
    [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.trim().startsWith(label))!.click();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
  };
  const status = () => element.querySelector('[data-status="ativo"]')?.textContent?.trim();
  const q = (selector: string) => element.querySelector(selector)!.textContent!;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ResourceSim);
    fixture.componentRef.setInput('delay', 30);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('stays idle with no country, then loads and resolves', async () => {
    expect(status()).toBe('idle');
    await click('🇯🇵 Japão');
    expect(status()).toBe('loading');
    await settle();
    expect(status()).toBe('resolved');
    expect(q('[data-value]')).toContain('Tóquio');
  });

  it('goes to error when the API is down, and value() would throw', async () => {
    await click('API fora do ar');
    await click('🇯🇵 Japão');
    await settle();
    expect(status()).toBe('error');
    expect(q('[data-value]')).toContain('lança um erro');
  });

  it('cancels the request on its way when the params change', async () => {
    await click('🇯🇵 Japão');
    await click('🇮🇸 Islândia');
    await settle();
    expect(q('[data-log]')).toContain('cancelada');
    expect(q('[data-value]')).toContain('Reykjavík');
  });

  it('a value written by hand puts the resource in the local state', async () => {
    await click('🇯🇵 Japão');
    await settle();
    await click('set(');
    expect(status()).toBe('local');
  });

  it('reload() shows reloading while keeping the old value', async () => {
    await click('🇯🇵 Japão');
    await settle();
    await click('reload()');
    expect(status()).toBe('reloading');
    expect(q('[data-value]')).toContain('Tóquio');
    await settle();
    expect(status()).toBe('resolved');
  });
});
