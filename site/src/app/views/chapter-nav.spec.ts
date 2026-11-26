import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CHAPTERS } from '../catalog/catalog';
import { ChapterNav } from './chapter-nav';

describe('ChapterNav', () => {
  const render = async (slug: string) => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ChapterNav);
    fixture.componentRef.setInput('slug', slug);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  const firstUnpublished = CHAPTERS.find((chapter) => !chapter.published);

  it('links to the previous and next chapters', async () => {
    const element = await render(CHAPTERS[1].slug);
    const links = [...element.querySelectorAll('a')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual([`/capitulos/${CHAPTERS[0].slug}`, `/capitulos/${CHAPTERS[2].slug}`]);
  });

  it('the last chapter has only the previous link', async () => {
    const element = await render(CHAPTERS.at(-1)!.slug);
    expect([...element.querySelectorAll('a')].map((link) => link.getAttribute('href'))).toEqual([`/capitulos/${CHAPTERS.at(-2)!.slug}`]);
  });

  it.skipIf(!firstUnpublished)('marks unpublished chapters as "em breve"', async () => {
    const firstUnpublished = CHAPTERS.find((chapter) => !chapter.published)!;
    const current = CHAPTERS[firstUnpublished.number - 2];
    const previous = CHAPTERS[firstUnpublished.number - 3];
    const element = await render(current.slug);
    const links = [...element.querySelectorAll('a')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      `/capitulos/${previous.slug}`,
      `/capitulos/${firstUnpublished.slug}`,
    ]);
    expect(links[0].textContent).not.toContain('em breve');
    expect(links[1].textContent).toContain('em breve');
  });

  it('the first chapter has only the next link', async () => {
    const element = await render('01-o-que-e-o-angular');
    expect(element.querySelectorAll('a').length).toBe(1);
  });
});
