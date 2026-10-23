import { TestBed } from '@angular/core/testing';
import { MarbleSim } from './marble-sim';

describe('MarbleSim', () => {
  const render = async () => {
    const fixture = TestBed.createComponent(MarbleSim);
    await fixture.whenStable();
    vi.useFakeTimers();
    const element = fixture.nativeElement as HTMLElement;
    const click = (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      fixture.detectChanges();
    };
    const toggle = (label: string) => {
      [...element.querySelectorAll('label')].find((l) => l.textContent!.includes(label))!.querySelector('input')!.click();
      fixture.detectChanges();
    };
    const row = (name: string) => [...element.querySelectorAll(`[data-row="${name}"] [data-marble]`)].map((m) => m.textContent!.trim());
    const wait = (ms: number) => {
      vi.advanceTimersByTime(ms);
      fixture.detectChanges();
    };
    return { click, toggle, row, wait };
  };

  afterEach(() => vi.useRealTimers());

  it('with debounceTime, five keys become one search and one request', async () => {
    const { click, row, wait } = await render();
    click('Digitar');
    wait(500 + 300);
    expect(row('teclas')).toHaveLength(5);
    expect(row('debounce')).toEqual(['japao']);
    wait(800);
    expect(row('requisicoes')).toEqual(['japao ✓']);
  });

  it('without debounceTime and with switchMap, the older requests are cancelled', async () => {
    const { click, toggle, row, wait } = await render();
    toggle('debounceTime');
    click('Digitar');
    wait(500 + 800);
    const requests = row('requisicoes');
    expect(requests).toHaveLength(5);
    expect(requests.filter((r) => r.endsWith('✕'))).toHaveLength(4);
    expect(requests.at(-1)).toBe('japao ✓');
  });

  it('with mergeMap, every request goes to the end', async () => {
    const { click, toggle, row, wait } = await render();
    toggle('debounceTime');
    toggle('mergeMap');
    click('Digitar');
    wait(500 + 800);
    expect(row('requisicoes').filter((r) => r.endsWith('✓'))).toHaveLength(5);
  });
});
