// Lê os trechos de código dos capítulos (site/snippets/NN-slug/<nome>.<ext>), destaca a sintaxe
// com o Shiki nos temas claro e escuro, e grava site/src/generated/snippets.ts.
// Assim o site não carrega nenhum destacador de sintaxe: o HTML já sai pronto do build.
//
// Marque uma linha com "// [!code highlight]" (ou "<!-- [!code highlight] -->" no HTML)
// para destacá-la; a marca some do código mostrado e do código copiado.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformerNotationHighlight } from '@shikijs/transformers';
import { codeToHtml } from 'shiki';

const LANGUAGES = {
  ts: 'angular-ts',
  html: 'angular-html',
  js: 'javascript',
  mjs: 'javascript',
  jsx: 'jsx',
  vue: 'vue',
  svelte: 'svelte',
  css: 'css',
  json: 'json',
  sh: 'bash',
};

const NOTATION = /[ \t]*(?:\/\/|<!--|\/\*)[ \t]*\[!code [^\]]+\][ \t]*(?:-->|\*\/)?[ \t]*$/gm;

export function langFor(extension) {
  return LANGUAGES[extension] ?? 'text';
}

export function keyFor(path) {
  const folder = basename(dirname(path));
  const name = basename(path, extname(path));
  return `${folder.slice(0, 2)}/${name}`;
}

export function stripNotation(source) {
  return source.replace(NOTATION, '');
}

export async function highlight(source, lang) {
  return codeToHtml(source.replace(/\n$/, ''), {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
    transformers: [transformerNotationHighlight({ matchAlgorithm: 'v3' })],
  });
}

export async function extractAll(root) {
  if (!existsSync(root)) return [];
  const entries = [];
  for (const folder of readdirSync(root).sort()) {
    if (!/^\d{2}-/.test(folder)) continue;
    for (const file of readdirSync(join(root, folder)).sort()) {
      const path = join(root, folder, file);
      const source = readFileSync(path, 'utf8');
      const lang = langFor(extname(file).slice(1));
      entries.push({ key: keyFor(path), lang, html: await highlight(source, lang), source: stripNotation(source) });
    }
  }
  return entries;
}

export function renderModule(entries) {
  const sorted = [...entries].sort((a, b) => a.key.localeCompare(b.key));
  const union = sorted.length ? sorted.map((entry) => `'${entry.key}'`).join(' | ') : 'never';
  const body = sorted
    .map((entry) => `  '${entry.key}': ${JSON.stringify({ lang: entry.lang, html: entry.html, source: entry.source })},`)
    .join('\n');
  return [
    '// Gerado por scripts/extract-snippets.mjs. Não edite: mude os arquivos em site/snippets/.',
    `export type SnippetId = ${union};`,
    '',
    'export interface Snippet {',
    '  lang: string;',
    '  html: string;',
    '  source: string;',
    '}',
    '',
    `export const SNIPPETS: Record<SnippetId, Snippet> = {${body ? `\n${body}\n` : ''}};`,
    '',
  ].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const entries = await extractAll('site/snippets');
  mkdirSync('site/src/generated', { recursive: true });
  writeFileSync('site/src/generated/snippets.ts', renderModule(entries));
  console.log(`Trechos de código: ${entries.length} gerado(s) em site/src/generated/snippets.ts.`);
}
