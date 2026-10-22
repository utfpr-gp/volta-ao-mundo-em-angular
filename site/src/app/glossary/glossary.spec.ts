import { GLOSSARY, sortedGlossary } from './glossary';

describe('GLOSSARY', () => {
  const entries = Object.entries(GLOSSARY);

  it('every entry has a definition of at most 220 chars and a chapter between 1 and 50', () => {
    for (const [key, entry] of entries) {
      expect(entry.definition.length, key).toBeLessThanOrEqual(220);
      expect(entry.definition.length, key).toBeGreaterThan(30);
      expect(entry.chapter, key).toBeGreaterThanOrEqual(1);
      expect(entry.chapter, key).toBeLessThanOrEqual(50);
    }
  });

  it('keys are kebab-case so they work as URL fragments', () => {
    for (const [key] of entries) expect(key).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('has the terms introduced in chapter 1', () => {
    for (const key of ['spa', 'framework', 'biblioteca', 'componente', 'typescript', 'angularjs', 'json']) {
      expect(GLOSSARY).toHaveProperty(key);
    }
  });

  it('sortedGlossary orders terms the Portuguese way, ignoring accents and case', () => {
    const terms = sortedGlossary().map((entry) => entry.term);
    const expected = [...terms].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
    expect(terms).toEqual(expected);
  });
});
