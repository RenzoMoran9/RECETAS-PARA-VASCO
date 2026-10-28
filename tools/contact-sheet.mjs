// Renderiza todas las ilustraciones en una grilla para revisarlas.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = process.argv[2] || 'contact.png';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1 });
await page.goto('file://' + root + '/tools/blank.html');
await page.addScriptTag({ path: root + '/js/ingredientes.js' });
await page.addScriptTag({ path: root + '/js/icons.js' });
await page.evaluate(() => {
  const V = window.VASCO;
  document.body.style.cssText = 'margin:0;font:11px sans-serif;display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:#f3f6f1';
  for (const id of V.ART_IDS) {
    const d = document.createElement('div');
    d.style.cssText = 'width:96px;text-align:center;background:#fff;border-radius:10px;padding:4px';
    d.innerHTML = V.icon(id, 72) + '<div>' + id + '</div>';
    document.body.appendChild(d);
  }
});
await page.screenshot({ path: out, fullPage: true });
await browser.close();
