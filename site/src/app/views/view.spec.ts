import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VIEWS, View } from './view';

describe('View', () => {
  const render = async (kind: string, title: string) => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(View);
    fixture.componentRef.setInput('kind', kind);
    fixture.componentRef.setInput('title', title);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('view kind "pitfalls" renders id "armadilhas" and label "Armadilhas"', async () => {
    const element = await render('pitfalls', 'Os erros mais comuns');
    expect(element.querySelector('section')?.id).toBe('armadilhas');
    expect(element.textContent).toContain('Armadilhas');
    expect(element.querySelector('h2')?.textContent).toContain('Os erros mais comuns');
  });

  it('the h2 is labelled by the section and has a link to its own address', async () => {
    const element = await render('idea', 'Pense num restaurante');
    const link = element.querySelector('h2 a');
    expect(link?.getAttribute('href')).toMatch(/#ideia$/);
    expect(link?.getAttribute('aria-label')).toBe('Link para a seção A ideia');
  });

  it('declares the 7 views in reading order with icon and label', () => {
    expect(VIEWS.map((view) => [view.id, view.icon, view.label])).toEqual([
      ['missao', '🎯', 'A missão'],
      ['ideia', '💡', 'A ideia'],
      ['por-dentro', '🔬', 'Por dentro'],
      ['mao-no-codigo', '🛠️', 'Mão no código'],
      ['armadilhas', '⚠️', 'Armadilhas'],
      ['desafio', '🏁', 'Desafio'],
      ['para-ir-alem', '📚', 'Para ir além'],
    ]);
  });
});
