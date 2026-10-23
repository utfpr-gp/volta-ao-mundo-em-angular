import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryCard } from './country-card';

describe('CountryCard', () => {
  let fixture: ComponentFixture<CountryCard>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CountryCard] }).compileComponents();
    fixture = TestBed.createComponent(CountryCard);
    fixture.componentRef.setInput('country', { code: 'JP', name: 'Japão', capital: 'Tóquio', visited: false });
    fixture.componentRef.setInput('position', 2);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('shows the country received through the input', () => {
    expect(element.querySelector('strong')?.textContent).toBe('Japão');
    expect(element.textContent).toContain('🇯🇵');
    expect(element.textContent).toContain('Visitar');
  });

  it('emits the country code through the outputs', () => {
    const toggled: string[] = [];
    const removed: string[] = [];
    fixture.componentInstance.toggled.subscribe((code) => toggled.push(code));
    fixture.componentInstance.removed.subscribe((code) => removed.push(code));
    const [visit, remove] = element.querySelectorAll('button');
    visit.click();
    remove.click();
    expect(toggled).toEqual(['JP']);
    expect(removed).toEqual(['JP']);
  });
});
