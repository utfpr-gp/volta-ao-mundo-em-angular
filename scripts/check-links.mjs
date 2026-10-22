// Confere os links do site gerado. Por padrão, só os internos (rápido, roda a cada push);
// com --externos, também os links para fora (roda uma vez por semana).
// Um servidor local imita o GitHub Pages: o site fica em /volta-ao-mundo-em-angular/,
// cada pasta serve o seu index.html e endereços inexistentes recebem o 404.html.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { LinkChecker } from 'linkinator';
import { OUTPUT } from './post-build.mjs';

const BASE = '/volta-ao-mundo-em-angular/';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
const external = process.argv.includes('--externos');

const server = createServer((request, response) => {
  const url = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
  let file = url.startsWith(BASE) ? normalize(join(OUTPUT, url.slice(BASE.length))) : null;
  if (file && existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  const found = file !== null && file.startsWith(normalize(OUTPUT)) && existsSync(file);
  const served = found ? file : join(OUTPUT, '404.html');
  response.writeHead(found ? 200 : 404, { 'content-type': TYPES[extname(served)] ?? 'application/octet-stream' });
  response.end(readFileSync(served));
});
await new Promise((resolve) => server.listen(0, resolve));
const origin = `http://localhost:${server.address().port}`;

const checker = new LinkChecker();
const result = await checker.check({
  path: `${origin}${BASE}`,
  recurse: true,
  timeout: 15000,
  retry: true,
  linksToSkip: external ? ['^mailto:'] : [`^(?!${origin})`],
});
server.close();

const broken = result.links.filter((link) => link.state === 'BROKEN');
if (broken.length) {
  console.error(`${broken.length} link(s) quebrado(s):`);
  for (const link of broken) console.error(`  ${link.status ?? '???'} ${link.url}  (em ${link.parent})`);
  process.exit(1);
}
const checked = result.links.filter((link) => link.state === 'OK').length;
console.log(`Links ok: ${checked} conferidos${external ? ', incluindo os externos' : ' (só os internos)'}.`);
