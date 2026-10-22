import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractAll, extractStages, highlight, keyFor, langFor, renderModule, stripNotation } from './extract-snippets.mjs';

test('maps extensions to Shiki languages', () => {
  assert.deepEqual(
    ['ts', 'html', 'js', 'jsx', 'vue', 'svelte', 'css', 'json', 'sh'].map(langFor),
    ['angular-ts', 'angular-html', 'javascript', 'jsx', 'vue', 'svelte', 'css', 'json', 'bash'],
  );
});

test('unknown extensions fall back to plain text', () => {
  assert.equal(langFor('txt'), 'text');
});

test('key is NN/name from the folder number and file name', () => {
  assert.equal(keyFor('site/snippets/01-o-que-e-o-angular/counter-angular.ts'), '01/counter-angular');
  assert.equal(keyFor('site/snippets/09-signals/app.component.html'), '09/app.component');
});

test('// [!code highlight] marks the line and disappears from html and source', async () => {
  const source = "const a = 1;\nconst b = 2; // [!code highlight]\n";
  const html = await highlight(source, 'angular-ts');
  assert.match(html, /class="line highlighted"/);
  assert.doesNotMatch(html, /\[!code/);
  assert.equal(stripNotation(source), 'const a = 1;\nconst b = 2;\n');
});

test('<!-- [!code highlight] --> works in html files', async () => {
  const source = '<p>oi</p>\n<button (click)="somar()">+</button> <!-- [!code highlight] -->\n';
  const html = await highlight(source, 'angular-html');
  assert.match(html, /class="line highlighted"/);
  assert.equal(stripNotation(source), '<p>oi</p>\n<button (click)="somar()">+</button>\n');
});

test('html carries both themes as --shiki-light / --shiki-dark variables', async () => {
  const html = await highlight('const total = signal(0);', 'angular-ts');
  assert.match(html, /--shiki-light:/);
  assert.match(html, /--shiki-dark:/);
});

test('generated module declares SnippetId as never when there are no snippets', () => {
  const module = renderModule([]);
  assert.match(module, /export type SnippetId = never;/);
  assert.match(module, /export const SNIPPETS/);
});

test('generated module declares SnippetId as a union of all keys, sorted', () => {
  const module = renderModule([
    { key: '01/b', lang: 'jsx', html: '<pre></pre>', source: 'b' },
    { key: '01/a', lang: 'angular-ts', html: '<pre></pre>', source: 'a' },
  ]);
  assert.match(module, /export type SnippetId = '01\/a' \| '01\/b';/);
  assert.ok(module.indexOf("'01/a'") < module.indexOf("'01/b'"));
});

test('extractAll reads every snippet folder', async () => {
  const root = mkdtempSync(join(tmpdir(), 'snippets-'));
  mkdirSync(join(root, '01-o-que-e-o-angular'));
  writeFileSync(join(root, '01-o-que-e-o-angular', 'counter-angular.ts'), 'export class Counter {}\n');
  writeFileSync(join(root, '01-o-que-e-o-angular', 'counter-react.jsx'), 'export function Counter() {}\n');
  const entries = await extractAll(root);
  assert.deepEqual(entries.map((entry) => [entry.key, entry.lang]), [
    ['01/counter-angular', 'angular-ts'],
    ['01/counter-react', 'jsx'],
  ]);
  assert.equal(entries[0].source, 'export class Counter {}\n');
});

test('extractAll returns nothing when the folder does not exist', async () => {
  assert.deepEqual(await extractAll(join(tmpdir(), 'nao-existe-mesmo')), []);
});

test('extractStages reads the src files and package.json of each stage, skipping specs', async () => {
  const root = mkdtempSync(join(tmpdir(), 'stages-'));
  const stage = join(root, '05-angular-cli');
  mkdirSync(join(stage, 'src', 'app'), { recursive: true });
  writeFileSync(join(stage, 'package.json'), '{ "name": "x" }\n');
  writeFileSync(join(stage, 'src', 'main.ts'), 'bootstrap();\n');
  writeFileSync(join(stage, 'src', 'app', 'app.html'), '<h1>Passaporte</h1>\n');
  writeFileSync(join(stage, 'src', 'app', 'app.spec.ts'), 'it();\n');
  mkdirSync(join(stage, 'node_modules', 'x'), { recursive: true });
  writeFileSync(join(stage, 'node_modules', 'x', 'index.js'), '');
  const keys = (await extractStages(root)).map((entry) => entry.key);
  assert.deepEqual(keys, ['05/etapa/package.json', '05/etapa/src/app/app.html', '05/etapa/src/main.ts']);
});
