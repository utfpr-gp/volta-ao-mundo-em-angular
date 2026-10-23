// Lê os trechos de código dos capítulos (site/snippets/NN-slug/<nome>.<ext>), destaca a sintaxe
// com o Shiki nos temas claro e escuro, e grava site/src/generated/snippets.ts.
// Assim o site não carrega nenhum destacador de sintaxe: o HTML já sai pronto do build.
//
// Marque uma linha com "// [!code highlight]" (ou "<!-- [!code highlight] -->" no HTML)
// para destacá-la; a marca some do código mostrado e do código copiado.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, sep } from 'node:path';
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

/**
 * Os arquivos de cada etapa do Passaporte (passaporte/etapas/NN-slug), com a chave
 * NN/etapa/<caminho>. Assim o capítulo mostra o código que de fato compila na etapa.
 */
export async function extractStages(root) {
  if (!existsSync(root)) return [];
  const entries = [];
  for (const stage of readdirSync(root).sort()) {
    const base = join(root, stage);
    if (!/^\d{2}-/.test(stage) || !statSync(base).isDirectory()) continue;
    const files = [];
    if (existsSync(join(base, 'package.json'))) files.push(join(base, 'package.json'));
    const walk = (dir) => {
      for (const name of readdirSync(dir).sort()) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else if (!name.endsWith('.spec.ts')) files.push(full);
      }
    };
    if (existsSync(join(base, 'src'))) walk(join(base, 'src'));
    for (const file of files) {
      const path = relative(base, file).split(sep).join('/');
      const lang = langFor(extname(file).slice(1));
      const source = readFileSync(file, 'utf8');
      entries.push({ key: `${stage.slice(0, 2)}/etapa/${path}`, lang, html: await highlight(source, lang), source: stripNotation(source) });
    }
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

export function renderModule(entries) {
  const sorted = [...entries].sort((a, b) => a.key.localeCompare(b.key));
  // A chave ignora a extensão: card.ts e card.html virariam a mesma chave, e um sumiria em silêncio.
  const repeated = sorted.filter((entry, i) => i > 0 && sorted[i - 1].key === entry.key).map((entry) => entry.key);
  if (repeated.length) throw new Error(`Trechos com a mesma chave (só a extensão muda): ${repeated.join(', ')}`);
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
  const entries = [...(await extractAll('site/snippets')), ...(await extractStages('passaporte/etapas'))];
  mkdirSync('site/src/generated', { recursive: true });
  writeFileSync('site/src/generated/snippets.ts', renderModule(entries));
  console.log(`Trechos de código: ${entries.length} gerado(s) em site/src/generated/snippets.ts.`);
}
