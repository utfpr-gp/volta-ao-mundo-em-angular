import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChapterNav } from './chapter-nav';

describe('ChapterNav', () => {
  const render = async (slug: string) => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ChapterNav);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('links to the previous and next chapters and marks unpublished ones as "em breve"', async () => {
    const element = await render('09-signals');
    const links = [...element.querySelectorAll('a')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/capitulos/08-event-binding', '/capitulos/10-if-e-switch']);
    expect(links[1].textContent).toContain('em breve');
  });

  it('the first chapter has only the next link', async () => {
    const element = await render('01-o-que-e-o-angular');
    expect(element.querySelectorAll('a').length).toBe(1);
  });
});
