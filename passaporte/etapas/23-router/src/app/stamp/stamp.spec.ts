import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Stamp } from './stamp';

describe('Stamp', () => {
  let fixture: ComponentFixture<Stamp>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Stamp] }).compileComponents();
    fixture = TestBed.createComponent(Stamp);
    fixture.componentRef.setInput('code', 'BR');
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('starts empty: the default of the stamped input is false', () => {
    expect(element.textContent?.trim()).toBe('?');
    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Ainda sem carimbo');
  });

  it('shows the country code in the stamped variant', async () => {
    fixture.componentRef.setInput('stamped', true);
    await fixture.whenStable();
    expect(element.textContent?.trim()).toBe('BR');
    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Carimbo de BR');
    expect(element.querySelector('.border-stamp')).not.toBeNull();
  });
});
