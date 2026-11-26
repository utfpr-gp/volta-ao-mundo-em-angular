// Depois do ng build: escreve o sitemap.xml (a lista das páginas para o Google) e o robots.txt (o que os robôs podem
// visitar, e onde está o sitemap), a partir das rotas que o build pré-renderizou.
import { readFileSync, writeFileSync } from 'node:fs';

// O endereço do site mora num arquivo do app (src/app/core/site.ts), para os dois usarem o mesmo.
const SITE_URL = readFileSync('src/app/core/site.ts', 'utf8').match(/SITE_URL = '([^']+)'/)[1];

const { routes } = JSON.parse(readFileSync('dist/passaporte/prerendered-routes.json', 'utf8'));
// As páginas que só redirecionam (/, /paises/JP) não entram: o Google deve conhecer o endereço final.
const pages = Object.keys(routes).filter((route) => route === '/paises' || route === '/sobre' || route.endsWith('/visao-geral'));

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((page) => `  <url><loc>${SITE_URL}${page}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
writeFileSync('dist/passaporte/browser/sitemap.xml', sitemap);

const robots = ['User-agent: *', 'Disallow: /passaporte', 'Disallow: /entrar', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
writeFileSync('dist/passaporte/browser/robots.txt', robots);

console.log(`sitemap.xml com ${pages.length} páginas, e robots.txt.`);
