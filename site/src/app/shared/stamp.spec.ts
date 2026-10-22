import { TestBed } from '@angular/core/testing';
import { chapterBySlug } from '../catalog/catalog';
import { Stamp, formatStampDate } from './stamp';

describe('Stamp', () => {
  const render = async (date: string | null, state?: 'coming-soon') => {
    const fixture = TestBed.createComponent(Stamp);
    fixture.componentRef.setInput('chapter', chapterBySlug('09-signals'));
    fixture.componentRef.setInput('date', date);
    if (state) fixture.componentRef.setInput('state', state);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('shows the number and the short title, and describes an empty slot', async () => {
    const element = await render(null);
    expect(element.textContent).toContain('9');
    expect(element.textContent).toContain('SIGNALS');
    expect(element.querySelector('svg')?.getAttribute('aria-label')).toBe('Capítulo 9, Signals: ainda sem carimbo');
  });

  it('shows the date in dd/MM/yyyy and the stamped look when conquered', async () => {
    const element = await render('2026-10-01T15:00:00.000Z');
    expect(element.textContent).toContain('01/10/2026');
    expect(element.querySelector('[data-stamped]')).toBeTruthy();
    expect(element.querySelector('svg')?.getAttribute('aria-label')).toBe('Capítulo 9, Signals: carimbado em 01/10/2026');
  });

  it('describes a chapter that is not written yet', async () => {
    const element = await render(null, 'coming-soon');
    expect(element.querySelector('svg')?.getAttribute('aria-label')).toBe('Capítulo 9, Signals: em breve');
  });
});

describe('formatStampDate', () => {
  it('formats an ISO date as dd/MM/yyyy', () => {
    expect(formatStampDate('2026-03-07T12:00:00.000Z')).toBe('07/03/2026');
  });
});
