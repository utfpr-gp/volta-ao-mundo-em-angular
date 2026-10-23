import { TestBed } from '@angular/core/testing';
import { PIPE_VALUES, PipeLab, runPipe } from './pipe-lab';

describe('runPipe (pipes de verdade, em pt-BR)', () => {
  it('formats numbers, currency and percentages the Brazilian way', () => {
    expect(runPipe('number', 123_000_000)).toBe('123.000.000');
    expect(runPipe("currency: 'BRL'", 123_000_000)).toMatch(/^R\$\s123\.000\.000,00$/);
    expect(runPipe("percent: '1.0-2'", 0.0513)).toBe('5,13%');
  });

  it('formats dates and texts', () => {
    const date = new Date(2026, 9, 22, 14, 30);
    expect(runPipe("date: 'dd/MM/yyyy'", date)).toBe('22/10/2026');
    expect(runPipe("date: 'EEEE'", date)).toBe('quinta-feira');
    expect(runPipe('titlecase', 'tóquio')).toBe('Tóquio');
  });

  it('runs the custom flag pipe', () => {
    expect(runPipe('flag', 'JP')).toBe('🇯🇵');
  });
});

describe('PipeLab', () => {
  it('shows the expression and the output for the chosen value and pipe', async () => {
    const fixture = TestBed.createComponent(PipeLab);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const valueButtons = element.querySelectorAll<HTMLButtonElement>('[data-values] button');
    expect(valueButtons.length).toBe(PIPE_VALUES.length);
    valueButtons[0].click();
    await fixture.whenStable();
    element.querySelectorAll<HTMLButtonElement>('[data-pipes] button')[0].click();
    await fixture.whenStable();
    expect(element.querySelector('[data-expression]')!.textContent).toContain('| number');
    expect(element.querySelector('[data-output]')!.textContent).toContain('123.000.000');
    expect(element.querySelector('[data-announce]')!.textContent).toContain('123.000.000');
  });
});
