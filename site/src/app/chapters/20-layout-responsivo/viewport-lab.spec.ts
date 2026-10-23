import { TestBed } from '@angular/core/testing';
import { ViewportLab } from './viewport-lab';

describe('ViewportLab', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(ViewportLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const setWidth = async (width: number) => {
      const slider = element.querySelector<HTMLInputElement>('input[type="range"]')!;
      slider.value = String(width);
      slider.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const breakpoint = () => element.querySelector('[data-breakpoint]')!.textContent!.trim();
    const mock = () => element.querySelector<HTMLElement>('[data-mock]')!;
    const rule = (name: string) => element.querySelector(`[data-rule="${name}"]`)!.textContent!;
    return { element, setWidth, click, breakpoint, mock, rule };
  };

  it('starts on the phone: no prefix active, menu button, one column', async () => {
    const { breakpoint, mock, rule } = await render();
    expect(breakpoint()).toContain('sem prefixo');
    expect(mock().dataset['columns']).toBe('1');
    expect(mock().dataset['menu']).toBe('botao');
    expect(rule('menu')).toContain('aparece');
  });

  it('from 640 px, sm: turns the list into two columns', async () => {
    const { setWidth, breakpoint, mock } = await render();
    await setWidth(700);
    expect(breakpoint()).toContain('sm');
    expect(mock().dataset['columns']).toBe('1');
    expect(mock().dataset['listColumns']).toBe('2');
  });

  it('from 768 px, md: splits the page, shows the links and hides the menu button', async () => {
    const { click, breakpoint, mock, rule } = await render();
    await click('Tablet');
    expect(breakpoint()).toContain('md');
    expect(mock().dataset['columns']).toBe('2');
    expect(mock().dataset['menu']).toBe('links');
    expect(mock().dataset['listColumns']).toBe('1');
    expect(rule('menu')).toContain('some');
  });

  it('from 1024 px, the featured card puts the flag beside the text', async () => {
    const { click, mock, rule } = await render();
    expect(mock().dataset['featured']).toBe('coluna');
    await click('Computador');
    expect(mock().dataset['featured']).toBe('linha');
    expect(rule('destaque')).toContain('ao lado');
  });
});
