import { BRAZILIAN_LOCALE } from '../../../core/locale';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorldProgress } from './world-progress';

describe('WorldProgress', () => {
  let component: WorldProgress;
  let fixture: ComponentFixture<WorldProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorldProgress],
      providers: [BRAZILIAN_LOCALE],
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
    expect(element.textContent).toContain('1,03% do mundo');
  });

  it('recomputes the percentage and what is left when a country is added', async () => {
    const element = fixture.nativeElement as HTMLElement;
    for (let i = 0; i < 8; i++) element.querySelector('button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.big')?.textContent).toContain('10 de 195 países');
    expect(element.textContent).toContain('5,13% do mundo · faltam 185');
  });

  it('never goes below zero', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const undo = element.querySelectorAll('button')[1];
    for (let i = 0; i < 5; i++) undo.click();
    await fixture.whenStable();
    expect(element.querySelector('.big')?.textContent).toContain('Nenhum país ainda');
    expect((element.querySelector('.fill') as HTMLElement).style.width).toBe('0%');
  });

  it('shows the empty message and the airport level at zero (@if and @switch)', async () => {
    const element = fixture.nativeElement as HTMLElement;
    const undo = element.querySelectorAll('button')[1];
    undo.click();
    undo.click();
    await fixture.whenStable();
    expect(element.querySelector('.big')?.textContent).toContain('Nenhum país ainda');
    expect(element.querySelector('.level')?.textContent).toContain('no aeroporto');
  });

  it('becomes a traveler at 10 countries', async () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.level')?.textContent).toContain('mochileiro');
    for (let i = 0; i < 8; i++) element.querySelector('button')!.click();
    await fixture.whenStable();
    expect(element.querySelector('.level')?.textContent).toContain('viajante');
  });
});
