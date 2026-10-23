import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StampBook } from './stamp-book';

describe('StampBook', () => {
  let fixture: ComponentFixture<StampBook>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StampBook] }).compileComponents();
    fixture = TestBed.createComponent(StampBook);
    fixture.componentRef.setInput('countries', [
      { code: 'BR', name: 'Brasil', capital: 'Brasília', visited: true },
      { code: 'JP', name: 'Japão', capital: 'Tóquio', visited: false },
      { code: 'PT', name: 'Portugal', capital: 'Lisboa', visited: true },
    ]);
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('shows one stamp card per country, inside the panel', () => {
    expect(element.querySelectorAll('app-stamp-card')).toHaveLength(3);
    expect(element.querySelector('header')?.textContent).toContain('Meus carimbos');
  });

  it('stamps only the visited countries and counts them', () => {
    const labels = [...element.querySelectorAll('[role="img"]')].map((stamp) => stamp.getAttribute('aria-label'));
    expect(labels).toEqual(['Carimbo de BR', 'Ainda sem carimbo', 'Carimbo de PT']);
    expect(element.querySelector('footer')?.textContent).toContain('2 de 3 carimbos');
  });
});
