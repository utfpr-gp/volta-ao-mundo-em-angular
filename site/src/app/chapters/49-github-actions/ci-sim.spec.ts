import { TestBed } from '@angular/core/testing';
import { CiSim, outcome } from './ci-sim';

describe('outcome', () => {
  it('publishes the broken commit with On Commit, and skips it after the checks', () => {
    expect(outcome('teste', 'commit').live).toBe('com defeito');
    expect(outcome('teste', 'checksPass').live).toBe('anterior');
    expect(outcome('teste', 'checksPass').steps.map((step) => step.mark)).toEqual(['ok', 'ok', 'ok', 'falhou', 'pulado']);
  });

  it('publishes the green commit, and nothing without checks', () => {
    expect(outcome('verde', 'checksPass').live).toBe('nova');
    expect(outcome('sem-ci', 'checksPass')).toMatchObject({ steps: [], live: 'anterior' });
    expect(outcome('sem-ci', 'commit').live).toBe('nova');
  });
});

describe('CiSim', () => {
  it('announces what goes live as the choices change', async () => {
    const fixture = TestBed.createComponent(CiSim);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const result = () => element.querySelector('[data-result]')!.textContent!.trim();
    expect(element.querySelector('[data-result]')!.getAttribute('aria-live')).toBe('polite');
    expect(result()).toContain('com o defeito');
    element.querySelector<HTMLInputElement>('input[value="checksPass"]')!.click();
    await fixture.whenStable();
    expect(result()).toContain('a versão anterior');
    expect(element.querySelector('[data-mark="falhou"]')!.textContent).toContain('npm test');
  });
});
