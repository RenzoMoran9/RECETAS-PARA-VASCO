// Renderiza la ilustración de todas las recetas para revisarlas juntas.
import { createRequire } from 'node:module';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
await page.goto('file://' + root + '/tools/blank.html');
for (const f of ['ingredientes', 'icons', 'recetas', 'guia', 'planner']) await page.addScriptTag({ path: `${root}/js/${f}.js` });
await page.evaluate(() => {
  const V = window.VASCO;
  const tint = { desayuno: '#FFF1D2', refrigerio: '#E2F2D5', almuerzo: '#FDE3D6', cena: '#EEE5F7' };
  document.body.style.cssText = 'margin:0;font:11px sans-serif;display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:#f3f6f1';
  for (const r of V.RECETAS) {
    const d = document.createElement('div');
    d.style.cssText = 'width:150px';
    d.innerHTML = `<div style="width:150px;height:112px;border-radius:12px;overflow:hidden;background:${tint[r.tipo[0]]}">${V.dishArt(r)}</div><div>${r.nombre}</div>`;
    document.body.appendChild(d);
  }
});
await page.screenshot({ path: process.argv[2], fullPage: true });
await browser.close();
