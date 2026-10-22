import { CHAPTERS, EXTRA_TOPICS, TRACKS, chapterBySlug, chaptersOfTrack, neighbors } from './catalog';

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const pad2 = (n: number) => String(n).padStart(2, '0');
const FORBIDDEN = /v[íi]deo|disciplina|\baula|turma|\bficha|checklist/i;

describe('catalog', () => {
  it('has 50 chapters numbered 1..50 in order', () => {
    expect(CHAPTERS.map((c) => c.number)).toEqual(range(1, 50));
  });

  it('every slug is NN-kebab and starts with its zero-padded number', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.slug).toMatch(new RegExp(`^${pad2(chapter.number)}-[a-z0-9]+(-[a-z0-9]+)*$`));
    }
  });

  it('slugs are unique', () => {
    expect(new Set(CHAPTERS.map((c) => c.slug)).size).toBe(50);
  });

  it('has the 9 tracks in book order', () => {
    expect(TRACKS.map((t) => t.id)).toEqual([
      'embarque', 'fundamentos', 'componentes', 'navegacao', 'dados',
      'formularios', 'back-end', 'qualidade', 'producao',
    ]);
  });

  it('tracks cover the spec ranges', () => {
    const ranges: [string, number, number][] = [
      ['embarque', 1, 5], ['fundamentos', 6, 14], ['componentes', 15, 22], ['navegacao', 23, 27],
      ['dados', 28, 33], ['formularios', 34, 36], ['back-end', 37, 41], ['qualidade', 42, 44], ['producao', 45, 50],
    ];
    for (const [id, from, to] of ranges) {
      expect(chaptersOfTrack(id as never).map((c) => c.number)).toEqual(range(from, to));
    }
  });

  it('every question is a question in the "Como…"/"Que…"/"O que…" form', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.question).toMatch(/^(Como|Que|O que) .+\?$/);
    }
  });

  it('prerequisites only point to earlier chapters', () => {
    for (const chapter of CHAPTERS) {
      for (const prerequisite of chapter.prerequisites) {
        expect(prerequisite).toBeGreaterThanOrEqual(1);
        expect(prerequisite).toBeLessThan(chapter.number);
      }
    }
  });

  it('descriptions are 120–160 chars and shortTitle ≤ 28', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.description.length, chapter.slug).toBeGreaterThanOrEqual(120);
      expect(chapter.description.length, chapter.slug).toBeLessThanOrEqual(160);
      expect(chapter.shortTitle.length, chapter.slug).toBeLessThanOrEqual(28);
    }
  });

  it('minutes are between 10 and 60', () => {
    for (const chapter of CHAPTERS) {
      expect(chapter.minutes).toBeGreaterThanOrEqual(10);
      expect(chapter.minutes).toBeLessThanOrEqual(60);
    }
  });

  it('a published chapter has verifiedWithAngular set', () => {
    for (const chapter of CHAPTERS.filter((c) => c.published)) {
      expect(chapter.verifiedWithAngular).toMatch(/^\d+\.\d+/);
    }
  });

  it('chapterBySlug finds a chapter and returns undefined for unknown slugs', () => {
    expect(chapterBySlug('09-signals')?.number).toBe(9);
    expect(chapterBySlug('99-nada')).toBeUndefined();
  });

  it('neighbors of chapter 1 has no previous and next is chapter 2', () => {
    const { previous, next } = neighbors('01-o-que-e-o-angular');
    expect(previous).toBeUndefined();
    expect(next?.number).toBe(2);
  });

  it('neighbors of the last chapter has no next', () => {
    const { previous, next } = neighbors('50-pwabuilder');
    expect(previous?.number).toBe(49);
    expect(next).toBeUndefined();
  });

  it('has the three "Para ir além" topics', () => {
    expect(EXTRA_TOPICS.length).toBe(3);
  });

  it('no text in the catalog contains a forbidden word', () => {
    const texts = [
      ...CHAPTERS.flatMap((c) => [c.question, c.shortTitle, c.description]),
      ...TRACKS.flatMap((t) => [t.name, t.summary]),
      ...EXTRA_TOPICS,
    ];
    for (const text of texts) expect(text).not.toMatch(FORBIDDEN);
  });
});
