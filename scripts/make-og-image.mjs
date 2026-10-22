// Gera site/public/og.png (1200×630), a imagem dos cartões de compartilhamento,
// fotografando site/og.html com o Chrome sem janela. Rode quando mudar o og.html.
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const chrome = process.env.CHROME ?? 'google-chrome';
execFileSync(chrome, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  `--screenshot=${resolve('site/public/og.png')}`,
  pathToFileURL(resolve('site/og.html')).href,
], { stdio: 'inherit' });
