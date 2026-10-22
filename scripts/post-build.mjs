// Depois do build: cria o 404.html do GitHub Pages, o sitemap.xml, o robots.txt
// e o índice da busca (Pagefind) dentro de site/dist/site/browser.
import { execFileSync } from 'node:child_process';
import { copyFileSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE_URL = 'https://utfpr-gp.github.io/volta-ao-mundo-em-angular';
export const OUTPUT = 'site/dist/site/browser';

/** Igual a canonicalUrl de site/src/app/seo/site.ts: cada página é uma pasta, por isso a barra final. */
export function canonicalUrl(path) {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `${SITE_URL}/${clean}/` : `${SITE_URL}/`;
}

export function listPages(root) {
  const pages = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name === 'index.html') {
        const path = relative(root, dir).split(sep).join('/');
        pages.push({ path, html: readFileSync(full, 'utf8') });
      }
    }
  };
  walk(root);
  return pages;
}

const isIndexable = ({ path, html }) =>
  path !== '404' && !/<meta name="robots" content="noindex">/.test(html) && !html.includes('data-coming-soon');

export function buildSitemap(pages) {
  const urls = pages
    .filter(isIndexable)
    .map(({ path }) => `  <url><loc>${canonicalUrl(path)}</loc></url>`)
    .sort();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

/** O GitHub Pages serve o 404.html para qualquer endereço que não existe. */
export function copyNotFound(root) {
  copyFileSync(join(root, '404', 'index.html'), join(root, '404.html'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  copyNotFound(OUTPUT);
  const pages = listPages(OUTPUT);
  writeFileSync(join(OUTPUT, 'sitemap.xml'), buildSitemap(pages));
  writeFileSync(join(OUTPUT, 'robots.txt'), robotsTxt());
  execFileSync('npx', ['pagefind', '--site', OUTPUT], { stdio: 'inherit' });
  console.log(`Pós-build: 404.html, sitemap.xml (${pages.filter(isIndexable).length} páginas), robots.txt e índice da busca.`);
}
