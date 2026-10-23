import { TestBed } from '@angular/core/testing';
import { LifecycleLab } from './lifecycle-lab';

describe('LifecycleLab', () => {
  afterEach(() => vi.useRealTimers());

  const render = async () => {
    const fixture = TestBed.createComponent(LifecycleLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const click = async (label: string) => {
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!.click();
      await fixture.whenStable();
    };
    const log = () => element.querySelector('[data-log]')!.textContent!;
    return { fixture, element, click, log };
  };

  it('logs the life of the child: created, initialized, destroyed', async () => {
    const { click, log } = await render();
    await click('Mostrar o relógio');
    expect(log()).toContain('constructor');
    expect(log()).toContain('ngOnInit');
    await click('Esconder o relógio');
    expect(log()).toContain('onDestroy');
  });

  it('without cleanup, the interval keeps ticking after the child is gone', async () => {
    const { fixture, element, log } = await render();
    vi.useFakeTimers();
    const button = (label: string) =>
      [...element.querySelectorAll<HTMLButtonElement>('button')].find((b) => b.textContent!.includes(label))!;
    element.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click();
    fixture.detectChanges();
    button('Mostrar o relógio').click();
    fixture.detectChanges();
    button('Esconder o relógio').click();
    fixture.detectChanges();
    vi.advanceTimersByTime(3000);
    fixture.detectChanges();
    expect(log()).toContain('tique depois de destruído');
  });
});
