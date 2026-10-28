// Prueba rápida del planificador: genera semanas y verifica reglas nutricionales.
import fs from 'node:fs';
import vm from 'node:vm';
const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of ['ingredientes', 'icons', 'recetas', 'guia', 'planner'])
  vm.runInContext(fs.readFileSync(new URL(`../js/${f}.js`, import.meta.url), 'utf8'), ctx);
const V = ctx.window.VASCO;
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLA:', m); } };
// Ingredientes e íconos existen
for (const r of V.RECETAS) {
  for (const [id] of r.ing) ok(V.ING[id], `${r.id}: ingrediente desconocido ${id}`);
  for (const id of r.hero) ok(V.hasIcon(id), `${r.id}: sin ícono ${id}`);
  ok(r.tipo.every((t) => V.TIPOS[t]), `${r.id}: tipo inválido`);
}
for (const id of Object.keys(V.ING)) ok(V.hasIcon(id), `sin ícono para ingrediente ${id}`);
for (const g of V.GUIA) ok(V.hasIcon(g.icon), `guía sin ícono ${g.icon}`);
const ids = V.RECETAS.map((r) => r.id); ok(new Set(ids).size === ids.length, 'ids repetidos');
const count = (t) => V.RECETAS.filter((r) => r.tipo.includes(t)).length;
console.log('Recetas:', V.RECETAS.length, { desayuno: count('desayuno'), refrigerio: count('refrigerio'), almuerzo: count('almuerzo'), cena: count('cena') });
for (const seed of [1, 2, 3, 42, 2026]) {
  const w = V.generateWeek(seed, { favorites: [], reactions: {}, avoid: [] });
  let fish = 0, leg = 0, ironDays = 0, dups = 0;
  w.forEach((d) => {
    const a = V.BY_ID[d.almuerzo], c = V.BY_ID[d.cena];
    if (a.hierroAnimal || c.hierroAnimal) ironDays++;
    fish += a.pescado + c.pescado; leg += a.menestra + c.menestra;
    const vals = Object.values(d); if (new Set(vals).size < vals.length) dups++;
  });
  const all = w.flatMap((d) => Object.values(d));
  console.log(`semilla ${seed}: días con hierro ${ironDays}/7, pescado ${fish}, menestras ${leg}, recetas distintas ${new Set(all).size}/35, repetidos en el día ${dups}`);
  ok(ironDays === 7, 'faltan días con hierro'); ok(fish >= 2, 'poco pescado'); ok(leg >= 2, 'pocas menestras'); ok(dups === 0, 'repetido en el día');
}
const w = V.generateWeek(7, { avoid: ['huevo', 'pescado'] });
ok(w.every((d) => Object.values(d).every((id) => !V.BY_ID[id].alergenos.some((a) => ['huevo', 'pescado'].includes(a)))), 'alergias no respetadas');
console.log(w[0]);
const sl = V.shoppingList(V.generateWeek(1, {}));
console.log('Compras:', sl.groups.map((g) => `${g.nombre}: ${g.items.length}`).join(' | '), '| básicos:', sl.basicos.length);
console.log(fails ? `${fails} fallas` : 'Todo OK');
process.exit(fails ? 1 : 0);
