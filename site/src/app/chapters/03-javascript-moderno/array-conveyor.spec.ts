import { TestBed } from '@angular/core/testing';
import { ArrayConveyor, SAMPLE, runPipeline } from './array-conveyor';

describe('runPipeline (modelo da esteira)', () => {
  it('with no filter and the whole object, nothing changes', () => {
    const result = runPipeline('all', 'object');
    expect(result.filtered.length).toBe(SAMPLE.length);
    expect(result.code).toBe('countries');
  });

  it('filters the visited countries', () => {
    const result = runPipeline('visited', 'object');
    expect(result.filtered.every((country) => country.visited)).toBe(true);
    expect(result.code).toBe('countries.filter((c) => c.visited)');
  });

  it('maps to names after filtering by region', () => {
    const result = runPipeline('americas', 'name');
    expect(result.output).toEqual(['Brasil', 'Argentina', 'Canadá']);
    expect(result.code).toBe("countries.filter((c) => c.region === 'Américas').map((c) => c.name)");
  });

  it('maps to flag and name', () => {
    expect(runPipeline('visited', 'label').output[0]).toBe('🇧🇷 Brasil');
  });
});

describe('ArrayConveyor', () => {
  it('shows the generated code and the result, and announces changes', async () => {
    const fixture = TestBed.createComponent(ArrayConveyor);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const pick = async (group: string, value: string) => {
      element.querySelector<HTMLInputElement>(`input[name="${group}"][value="${value}"]`)!.click();
      await fixture.whenStable();
    };
    await pick('filtro', 'visited');
    await pick('mapa', 'name');
    expect(element.querySelector('[data-code]')!.textContent).toContain('.filter((c) => c.visited).map((c) => c.name)');
    expect(element.querySelector('[data-result]')!.textContent).toContain("'Brasil'");
    expect(element.querySelector('[aria-live="polite"]')!.textContent).toContain('4 países passaram pelo filter');
  });

  it('uses native radio groups with legends (keyboard works without extra code)', async () => {
    const fixture = TestBed.createComponent(ArrayConveyor);
    await fixture.whenStable();
    const legends = [...(fixture.nativeElement as HTMLElement).querySelectorAll('fieldset legend')].map((l) => l.textContent);
    expect(legends.join(' ')).toContain('filter');
    expect(legends.join(' ')).toContain('map');
  });
});
