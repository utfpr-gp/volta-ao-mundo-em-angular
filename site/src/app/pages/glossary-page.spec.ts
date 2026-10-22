import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GLOSSARY } from '../glossary/glossary';
import { GlossaryPage } from './glossary-page';

describe('GlossaryPage', () => {
  it('lists every term with an anchor and a link to its chapter, inside the searchable area', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(GlossaryPage);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const terms = element.querySelectorAll('[data-pagefind-body] dt');
    expect(terms.length).toBe(Object.keys(GLOSSARY).length);
    const spa = element.querySelector('dt#spa')!;
    expect(spa.textContent).toContain('SPA');
    expect(element.querySelector('dd a[href="/capitulos/01-o-que-e-o-angular"]')).toBeTruthy();
  });

  it('has a letter index linking to the groups', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(GlossaryPage);
    await fixture.whenStable();
    const index = (fixture.nativeElement as HTMLElement).querySelector('nav[aria-label="Letras"]')!;
    expect(index.querySelectorAll('a').length).toBeGreaterThan(3);
  });
});
