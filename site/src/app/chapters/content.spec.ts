import { CHAPTERS } from '../catalog/catalog';
import { CONTENT } from './content';
import { LOADERS } from './loaders';

const published = CHAPTERS.filter((chapter) => chapter.published);

describe('chapter content (critério de pronto)', () => {
  it('every published chapter has a LOADERS entry and a CONTENT entry, and vice versa', () => {
    const slugs = published.map((chapter) => chapter.slug).sort();
    expect(Object.keys(LOADERS).sort()).toEqual(slugs);
    expect(Object.keys(CONTENT).sort()).toEqual(slugs);
  });

  for (const chapter of published) {
    describe(chapter.slug, () => {
      const content = CONTENT[chapter.slug]!;

      it('has 3–5 questions', () => {
        expect(content.questions.length).toBeGreaterThanOrEqual(3);
        expect(content.questions.length).toBeLessThanOrEqual(5);
      });

      it('each question has exactly one correct alternative and an explanation on every alternative', () => {
        for (const question of content.questions) {
          expect(question.alternatives.filter((alternative) => alternative.correct).length, question.prompt).toBe(1);
          expect(question.alternatives.length, question.prompt).toBeGreaterThanOrEqual(2);
          for (const alternative of question.alternatives) {
            expect(alternative.explanation.trim().length, alternative.text).toBeGreaterThan(10);
          }
        }
      });

      it('summary has 3–6 items', () => {
        expect(content.summary.length).toBeGreaterThanOrEqual(3);
        expect(content.summary.length).toBeLessThanOrEqual(6);
      });

      it('links has at least one angular.dev URL and all are https', () => {
        expect(content.links.some((link) => link.url.startsWith('https://angular.dev'))).toBe(true);
        for (const link of content.links) expect(link.url).toMatch(/^https:\/\//);
      });
    });
  }
});
