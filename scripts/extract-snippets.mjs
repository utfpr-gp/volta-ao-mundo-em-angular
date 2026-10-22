import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('site/src/generated', { recursive: true });
writeFileSync(
  'site/src/generated/snippets.ts',
  'export type SnippetId = never;\nexport const SNIPPETS = {} as Record<SnippetId, never>;\n',
);
