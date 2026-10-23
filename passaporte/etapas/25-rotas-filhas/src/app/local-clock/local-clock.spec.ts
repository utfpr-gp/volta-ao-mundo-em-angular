import { TestBed } from '@angular/core/testing';
import { LocalClock } from './local-clock';

describe('LocalClock', () => {
  afterEach(() => vi.useRealTimers());

  it('starts ticking on init and stops when destroyed', async () => {
    vi.useFakeTimers({ now: new Date('2026-10-22T12:00:00Z') });
    const fixture = TestBed.createComponent(LocalClock);
    fixture.componentRef.setInput('city', 'Tóquio');
    fixture.componentRef.setInput('timeZone', 'Asia/Tokyo');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('21:00:00');
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(element.textContent).toContain('21:00:02');
    expect(vi.getTimerCount()).toBe(1);
    fixture.destroy();
    expect(vi.getTimerCount()).toBe(0);
  });
});
