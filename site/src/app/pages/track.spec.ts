import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Track } from './track';

describe('Track page', () => {
  const render = async (id: string) => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Track);
    fixture.componentRef.setInput('trilha', id);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('shows NotFound content for an unknown id', async () => {
    const element = await render('atlantida');
    expect(element.textContent).toContain('Este destino não está no mapa');
  });

  it('lists its chapters in order, each linking to the chapter, with its stamp', async () => {
    const element = await render('dados');
    const items = element.querySelectorAll('[data-chapter-item]');
    expect(items.length).toBe(6);
    expect(items[0].querySelector('a')?.getAttribute('href')).toBe('/capitulos/28-services-e-inject');
    expect(items[0].querySelector('vm-stamp')).toBeTruthy();
  });

  it('says the quick reference grows with each published chapter when none is published', async () => {
    const element = await render('producao');
    expect(element.textContent).toContain('A referência rápida desta trilha cresce a cada capítulo publicado.');
  });

  it('marks unpublished chapters as "Em breve"', async () => {
    const element = await render('producao');
    expect(element.querySelector('[data-chapter-item]')?.textContent).toContain('Em breve');
  });

  it('links to the previous and next tracks', async () => {
    const element = await render('dados');
    const nav = element.querySelector('nav[aria-label="Outras trilhas"]')!;
    expect([...nav.querySelectorAll('a')].map((link) => link.getAttribute('href'))).toEqual([
      '/trilhas/navegacao',
      '/trilhas/formularios',
    ]);
  });

  it('keeps the quick reference inside the searchable area', async () => {
    const element = await render('dados');
    expect(element.querySelector('[data-pagefind-body] #referencia-rapida')).toBeTruthy();
  });
});
