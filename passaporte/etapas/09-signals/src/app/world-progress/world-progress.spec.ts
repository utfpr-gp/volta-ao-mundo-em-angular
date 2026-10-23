import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorldProgress } from './world-progress';

describe('WorldProgress', () => {
  let component: WorldProgress;
  let fixture: ComponentFixture<WorldProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldProgress],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with 2 countries and 1% of the world', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.big')?.textContent).toContain('2 de 195 países');
    expect(element.textContent).toContain('1% do mundo');
  });

  it('recomputes the percentage and what is left when a country is added', async () => {
    const element = fixture.nativeElement as HTMLElement;
    for (let i = 0; i < 8; i++) element.querySelector('button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.big')?.textContent).toContain('10 de 195 países');
    expect(element.textContent).toContain('5% do mundo · faltam 185');
  });

  it('never goes below zero', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const undo = element.querySelectorAll('button')[1];
    for (let i = 0; i < 5; i++) undo.click();
    await fixture.whenStable();
    expect(element.querySelector('.big')?.textContent).toContain('0 de 195 países');
  });
});
