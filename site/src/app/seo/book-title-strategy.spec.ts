import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BookTitleStrategy } from './book-title-strategy';

@Component({ template: '' })
class Blank {}

describe('BookTitleStrategy', () => {
  let harness: RouterTestingHarness;
  let document: Document;
  const meta = (selector: string) => document.head.querySelector(`meta[${selector}]`)?.getAttribute('content');
  const jsonLd = () => JSON.parse(document.head.querySelector('script#jsonld')!.textContent!);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', title: 'Volta ao Mundo em Angular', component: Blank, data: { kind: 'page', description: 'Início.' } },
          { path: 'capitulos/09-signals', title: 'Como usar signals?', component: Blank, data: { kind: 'chapter', slug: '09-signals', description: 'Signals.' } },
          { path: 'capitulos/50-pwabuilder', title: 'Como usar o PWABuilder?', component: Blank, data: { kind: 'coming-soon', slug: '50-pwabuilder', description: 'Em breve.' } },
          { path: 'sobre', title: 'Sobre o livro', component: Blank, data: { kind: 'page', description: 'Sobre.' } },
          { path: '**', title: 'Destino não encontrado', component: Blank, data: { kind: 'not-found', description: 'Nada.' } },
        ]),
        { provide: TitleStrategy, useClass: BookTitleStrategy },
      ],
    });
    harness = await RouterTestingHarness.create();
    document = TestBed.inject(DOCUMENT);
  });

  it('produces "<pergunta> · Volta ao Mundo em Angular" for chapters', async () => {
    await harness.navigateByUrl('/capitulos/09-signals');
    expect(document.title).toBe('Como usar signals? · Volta ao Mundo em Angular');
    expect(meta('name="description"')).toBe('Signals.');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(/\/capitulos\/09-signals\/$/);
  });

  it('produces "Volta ao Mundo em Angular" alone for the home, with Course JSON-LD', async () => {
    await harness.navigateByUrl('/');
    expect(document.title).toBe('Volta ao Mundo em Angular');
    expect(jsonLd()['@type']).toBe('Course');
    expect(jsonLd().author.name).toBe('Roni Fabio Banaszewski');
    expect(jsonLd().inLanguage).toBe('pt-BR');
  });

  it('describes a chapter as a LearningResource part of the course', async () => {
    await harness.navigateByUrl('/capitulos/09-signals');
    expect(jsonLd()['@type']).toBe('LearningResource');
    expect(jsonLd().isPartOf['@type']).toBe('Course');
  });

  it('coming-soon and not-found pages get noindex; regular pages do not', async () => {
    await harness.navigateByUrl('/capitulos/50-pwabuilder');
    expect(meta('name="robots"')).toBe('noindex');
    await harness.navigateByUrl('/nao/existe');
    expect(meta('name="robots"')).toBe('noindex');
    await harness.navigateByUrl('/sobre');
    expect(meta('name="robots"')).toBeUndefined();
  });

  it('ignores query string and fragment in the canonical URL', async () => {
    await harness.navigateByUrl('/sobre?x=1#licencas');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(/\/sobre\/$/);
  });
});
