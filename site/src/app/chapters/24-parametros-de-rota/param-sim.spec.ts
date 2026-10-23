import { TestBed } from '@angular/core/testing';
import { ParamSim } from './param-sim';

describe('ParamSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ParamSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const go = async (url: string) => {
      const input = element.querySelector<HTMLInputElement>('input[type="text"]')!;
      input.value = url;
      input.dispatchEvent(new Event('input'));
      element.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };
    const toggle = async (label: string) => {
      [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!.click();
      await fixture.whenStable();
    };
    const q = (selector: string) => element.querySelector(selector)!.textContent!;
    return { go, toggle, q };
  };

  it('matches :code against the address and hands the value to the input', async () => {
    const { go, q } = await render();
    await go('/paises/JP');
    expect(q('[data-segments]')).toContain("'JP'");
    expect(q('[data-input]')).toContain("code() → 'JP'");
    expect(q('[data-screen]')).toContain('Japão');
  });

  it('reuses the component when only the code changes', async () => {
    const { go, q } = await render();
    await go('/paises/JP');
    await go('/paises/PT');
    expect(q('[data-screen]')).toContain('Portugal');
    expect(q('[data-created]')).toContain('1');
    await go('/sobre');
    await go('/paises/BR');
    expect(q('[data-created]')).toContain('2');
  });

  it('without withComponentInputBinding, the required input never arrives', async () => {
    const { go, toggle, q } = await render();
    await toggle('withComponentInputBinding');
    await go('/paises/JP');
    expect(q('[data-screen]')).toContain('NG0950');
  });

  it('copying the code only once leaves the screen behind the address', async () => {
    const { go, toggle, q } = await render();
    await toggle('ngOnInit');
    await go('/paises/JP');
    expect(q('[data-input]')).toContain("'JP'");
    expect(q('[data-screen]')).toContain('Brasil');
  });
});
