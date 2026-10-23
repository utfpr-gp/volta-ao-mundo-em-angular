// Captura a tela de uma página no Chrome headless, depois de rodar passos em JavaScript (digitar, clicar, esperar).
// Usa o protocolo do DevTools com o WebSocket nativo do Node, sem Puppeteer. Serve para as imagens dos capítulos.
// Uso: node scripts/capturar-tela.mjs <url> <saida.png> <largura> <altura> ["js;;wait:600;;mais js"]
import { writeFileSync } from 'node:fs';
const [url, out, width, height, script = ''] = process.argv.slice(2);
const port = 9333;
const { spawn } = await import('node:child_process');
const chrome = spawn('google-chrome', ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--blink-settings=preferredColorScheme=1', `--window-size=${width},${height}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://localhost:${port}/json`)).json(); break; } catch { await sleep(200); } }
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Emulation.setDeviceMetricsOverride', { width: +width, height: +height, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url });
await sleep(4000);
for (const step of script.split(';;').filter(Boolean)) {
  if (step.startsWith('wait:')) { await sleep(+step.slice(5)); continue; }
  await send('Runtime.evaluate', { expression: step, awaitPromise: true });
  await sleep(200);
}
await sleep(800);
const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
ws.close(); chrome.kill();
console.log('ok', out);
