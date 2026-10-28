// Genera los íconos de la app (SVG y PNG) a partir del logo de app.js.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const m = app.match(/const LOGO =\n([\s\S]*?);\n/);
const logo = eval(m[1]).replace('<svg viewBox="0 0 120 120" aria-hidden="true">', '');
const inner = logo.replace('</svg>', '');
// Ícono normal: esquinas redondeadas
const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><clipPath id="r"><rect width="120" height="120" rx="26"/></clipPath></defs><g clip-path="url(#r)">${inner}</g></svg>`;
// Ícono "maskable": fondo completo y dibujo dentro de la zona segura (80 %)
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#E8632B"/><g transform="translate(12 12) scale(.8)">${inner}</g></svg>`;
fs.writeFileSync(path.join(root, 'img/icon.svg'), rounded);
const browser = await chromium.launch();
const page = await browser.newPage();
async function png(svg, size, file) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await page.screenshot({ path: path.join(root, 'img', file), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}
const full = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${inner}</svg>`;
await png(rounded, 192, 'icon-192.png');
await png(rounded, 512, 'icon-512.png');
await png(maskable, 512, 'icon-maskable-512.png');
await png(full, 180, 'apple-touch-icon.png');
await browser.close();
console.log('íconos listos');
