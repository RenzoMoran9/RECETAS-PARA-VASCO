// Arma una versión de un solo archivo (CSS y JS en línea) para la vista previa en claude.ai.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = process.argv[2];
if (!out) throw new Error('Uso: node tools/build-artifact.mjs salida.html');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = html.slice(html.indexOf('<!-- APP -->'), html.indexOf('<!-- /APP -->') + '<!-- /APP -->'.length);
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]+>/)[0];
const css = fs.readFileSync(path.join(root, 'css/app.css'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => fs.readFileSync(path.join(root, m[1]), 'utf8'));
const page = [
  '<title>Recetas para Vasco</title>',
  '<meta name="claude:viewport-fit-sides" content="cover">',
  fonts,
  `<style>\n${css}\n</style>`,
  app,
  '<script>window.VASCO_ARTIFACT = true;</script>',
  `<script>\n${scripts.join('\n')}\n</script>`,
].join('\n');
fs.writeFileSync(out, page);
console.log(`${out} (${(page.length / 1024).toFixed(0)} KB)`);
