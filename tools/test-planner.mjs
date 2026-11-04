// Pruebas: datos válidos, reglas del menú de cada perfil y el motor de «Mi refri».
import fs from 'node:fs';
import vm from 'node:vm';
const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of ['ingredientes', 'icons', 'recetas', 'guia', 'papas', 'planner', 'cocina'])
  vm.runInContext(fs.readFileSync(new URL(`../js/${f}.js`, import.meta.url), 'utf8'), ctx);
const V = ctx.window.VASCO;
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FALLA:', m); } };

/* ---- Datos ---- */
const todas = V.RECETAS.concat(V.RECETAS_PAPAS);
const ids = todas.map((r) => r.id);
ok(new Set(ids).size === ids.length, 'ids repetidos');
for (const r of todas) {
  const P = V.PERFILES[r.perfil];
  for (const [id] of r.ing) ok(V.ING[id], `${r.id}: ingrediente desconocido ${id}`);
  for (const id of r.hero) ok(V.hasIcon(id), `${r.id}: sin ícono ${id}`);
  ok(r.tipo.every((t) => P.tipos[t]), `${r.id}: tipo inválido para ${r.perfil}`);
  ok(r.nutr.every((n) => P.nutrientes[n]), `${r.id}: nutriente sin descripción`);
  ok(r.pasos.length >= 1 && r.tip, `${r.id}: faltan pasos o consejo`);
  if (r.vasco) ok(V.BY_ID[r.vasco] && V.BY_ID[r.vasco].perfil === 'vasco', `${r.id}: versión de Vasco inválida ${r.vasco}`);
}
for (const id of Object.keys(V.ING)) ok(V.hasIcon(id), `sin ícono para ingrediente ${id}`);
for (const id of V.BASICOS_DEFAULT) ok(V.ING[id], `básico desconocido ${id}`);
for (const [a, bs] of Object.entries(V.SUSTITUTOS)) for (const b of [a, ...bs]) ok(V.ING[b], `sustituto desconocido ${b}`);
for (const g of V.GUIA.concat(V.GUIA_PAPAS)) ok(V.hasIcon(g.icon), `guía sin ícono ${g.icon}`);
for (const pid of ['vasco', 'papas']) {
  const P = V.PERFILES[pid];
  const c = {};
  P.recetas.forEach((r) => r.tipo.forEach((t) => (c[t] = (c[t] || 0) + 1)));
  console.log(`${pid}: ${P.recetas.length} recetas`, JSON.stringify(c));
}

/* ---- Menú semanal ---- */
const sinPrefs = { favorites: [], reactions: {}, avoid: [] };
for (const seed of [1, 2, 3, 42, 2026]) {
  const wv = V.generateWeek(V.PERFILES.vasco, seed, sinPrefs);
  const wp = V.generateWeek(V.PERFILES.papas, seed, sinPrefs, wv);
  const stats = (P, w) => {
    let fish = 0, leg = 0, iron = 0, dups = 0, roja = 0, visc = 0, olla = 0, verdAlm = 0, fruta = 0;
    w.forEach((d, i) => {
      const a = V.BY_ID[d.almuerzo], c = V.BY_ID[d.cena];
      if (a.hierroAnimal || c.hierroAnimal) iron++;
      fish += a.pescado + c.pescado; leg += a.menestra + c.menestra; roja += a.roja + c.roja; visc += a.viscera + c.viscera;
      verdAlm += a.verdura; fruta += V.daySummary(P, d).fruta;
      const vals = Object.values(d); if (new Set(vals).size < vals.length) dups++;
      if (P.id === 'papas' && (V.mismaOlla(a, wv[i]) || V.mismaOlla(c, wv[i]))) olla++;
    });
    return { fish, leg, iron, dups, roja, visc, olla, verdAlm, fruta, distintas: new Set(w.flatMap((d) => Object.values(d))).size };
  };
  const sv = stats(V.PERFILES.vasco, wv), sp = stats(V.PERFILES.papas, wp);
  console.log(`semilla ${seed} | Vasco: hierro ${sv.iron}/7, pescado ${sv.fish}, menestras ${sv.leg} | Papás: pescado ${sp.fish}, menestras ${sp.leg}, vísceras ${sp.visc}, carne roja ${sp.roja}, verdura en almuerzo ${sp.verdAlm}/7, fruta ${sp.fruta}/7, misma olla ${sp.olla} días, distintas ${sp.distintas}/28`);
  ok(sv.iron === 7 && sv.fish >= 2 && sv.leg >= 2 && sv.dups === 0, 'reglas de Vasco');
  ok(sp.fish >= 2 && sp.leg >= 2 && sp.visc >= 1 && sp.roja <= 3 && sp.dups === 0 && sp.fruta === 7, 'reglas de los papás');
}
// Mismo menú de Vasco que la versión anterior (semilla fija): los celulares no cambian de menú al actualizar
const w1 = V.generateWeek(V.PERFILES.vasco, 1, sinPrefs);
ok(w1[0].desayuno && w1[0].mm && w1[0].mt, 'tiempos de Vasco');
const wa = V.generateWeek(V.PERFILES.papas, 7, { avoid: ['pescado', 'lacteos'] });
ok(wa.every((d) => Object.values(d).every((id) => !V.BY_ID[id].alergenos.some((a) => ['pescado', 'lacteos'].includes(a)))), 'alergias de los papás');

/* ---- Mi refri ---- */
const prefsDe = () => sinPrefs;
const cocinar = (tengo, perfiles = ['papas']) => V.cocinar({ tengo, basicos: V.BASICOS_DEFAULT, perfiles, prefsDe });
let res = cocinar(['pollo', 'papa', 'tomate']);
console.log('pollo+papa+tomate → listos:', res.listos.slice(0, 3).map((x) => x.r.nombre), '| casi:', res.casi.slice(0, 3).map((x) => `${x.r.nombre} (falta ${x.faltan.join(', ')})`));
ok(res.listos.some((x) => x.r.id === 'p-pollo-saltado'), 'pollo saltado debería salir con pollo, papa y tomate');
ok(res.casi.every((x) => x.faltan.length >= 1 && x.faltan.length <= 2), 'casi: 1 o 2 faltantes');
res = cocinar(['huevo', 'espinaca']);
ok(res.listos.some((x) => x.r.id === 'p-omelette' || x.r.id === 'p-tortilla-espinaca'), 'huevo + espinaca → tortilla u omelette');
res = cocinar(['papa-amarilla', 'pollo', 'palta', 'aji-amarillo']);
const causa = res.listos.find((x) => x.r.id === 'p-causa');
ok(causa, 'causa con papa amarilla, pollo, palta y ají');
res = cocinar(['pollo', 'papa', 'tomate', 'zanahoria', 'arveja']);
const est = res.listos.find((x) => x.r.id === 'p-estofado');
ok(est, 'estofado sale listo');
res = cocinar(['pescado', 'camote']);
ok(res.listos.concat(res.casi).some((x) => x.r.id === 'p-ceviche' || x.r.id === 'p-pescado-plancha'), 'pescado + camote');
res = cocinar(['papa', 'pollo'], ['papas', 'vasco']);
ok(res.listos.concat(res.casi).some((x) => x.olla), 'cocinar para los dos junta la misma olla');
res = cocinar(['trucha', 'brocoli', 'quinua'], ['vasco']);
ok(res.listos.some((x) => x.r.id === 'trucha-quinua'), 'Vasco: trucha con quinua y brócoli');
res = cocinar(['pescado', 'yuca', 'tomate', 'culantro'], ['papas']);
ok(res.listos.some((x) => x.r.id === 'p-sudado'), 'sudado con pescado, yuca, tomate y culantro');
res = cocinar(['papa-amarilla', 'pollo', 'palta']);
ok(res.casi.some((x) => x.r.id === 'p-causa' && x.faltan.includes('aji-amarillo')), 'causa: falta ají amarillo');
res = cocinar([]);
ok(!res.listos.length && !res.casi.length, 'sin ingredientes no sugiere nada');
console.log('buscar "pa":', V.buscarIngrediente('pa').map((id) => V.ING[id].nombre).join(', '));
ok(V.buscarIngrediente('limon')[0] === 'limon', 'buscador sin tildes');

/* ---- Lista del mercado ---- */
const sl = V.shoppingList([{ P: V.PERFILES.vasco, days: V.generateWeek(V.PERFILES.vasco, 1, {}) }, { P: V.PERFILES.papas, days: V.generateWeek(V.PERFILES.papas, 1, {}) }]);
console.log('Compras familia:', sl.groups.map((g) => `${g.nombre}: ${g.items.length}`).join(' | '), '| básicos:', sl.basicos.length);
ok(sl.groups.some((g) => g.items.some((it) => it.quien.length === 2)), 'ingredientes compartidos por los dos');
console.log(fails ? `${fails} fallas` : 'Todo OK');
process.exit(fails ? 1 : 0);
