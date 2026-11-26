// Depois do ng build: copia o casco do app (index.csr.html) para 404.html. O Render entrega o 404.html, com o status 404,
// a todo endereço que não tem arquivo nem regra; o Angular abre e mostra a página "não encontrada".
import { copyFileSync } from 'node:fs';

copyFileSync('dist/passaporte/browser/index.csr.html', 'dist/passaporte/browser/404.html');
console.log('404.html, a partir do index.csr.html.');
