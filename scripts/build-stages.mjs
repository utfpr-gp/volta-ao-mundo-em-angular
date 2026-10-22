// Faz o build de cada etapa do Passaporte (passaporte/etapas/NN-slug), para garantir
// que todo código que os capítulos mostram compila e roda.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'passaporte/etapas';
const stages = existsSync(ROOT)
  ? readdirSync(ROOT).filter((name) => existsSync(join(ROOT, name, 'package.json'))).sort()
  : [];

if (!stages.length) {
  console.log('Etapas do Passaporte: nenhuma etapa ainda.');
} else {
  for (const stage of stages) {
    console.log(`\n▶ Etapa ${stage}`);
    execFileSync('npm', ['run', 'build', '-w', join(ROOT, stage)], { stdio: 'inherit' });
  }
  console.log(`\nEtapas do Passaporte: ${stages.length} compilada(s).`);
}
