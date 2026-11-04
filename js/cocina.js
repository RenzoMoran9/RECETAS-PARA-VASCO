/* Mi refri: combina lo que hay en casa y sugiere qué cocinar.
   Para cada receta revisa ingrediente por ingrediente:
   - lo tienes → «usa»
   - tienes algo que lo reemplaza (papa amarilla por papa blanca…) → «sustituto»
   - es de la despensa básica (aceite, sal, ajo, cebolla, limón, arroz…) → se da por hecho
   - es opcional → no hace falta
   - si no → «falta»
   Devuelve los platos que salen ya y los que necesitan 1 o 2 cosas más. */
(function () {
  const V = (window.VASCO = window.VASCO || {});
  const { ING, SUSTITUTOS } = V;
  const PROTEINAS = ['pollo', 'res', 'pescado', 'trucha', 'atun', 'huevo', 'higado', 'sangrecita', 'bazo'];

  // El ingrediente que define el plato: la proteína, la menestra o el primero del dibujo
  function principal(r) {
    return (
      r.ids.find((id) => PROTEINAS.includes(id)) ||
      r.ids.find((id) => ING[id] && ING[id].cat === 'menestras') ||
      r.hero[0]
    );
  }

  V.revisarReceta = function (r, tengoSet, basicoSet) {
    const vistos = new Set();
    const usa = [];
    const subs = [];
    const faltan = [];
    r.ing.forEach((ing) => {
      const id = ing[0];
      if (vistos.has(id) || !ING[id]) return;
      vistos.add(id);
      if (tengoSet.has(id)) return usa.push(id);
      const sub = (SUSTITUTOS[id] || []).find((x) => tengoSet.has(x));
      if (sub) return subs.push([id, sub]);
      if (basicoSet.has(id) || V.esOpcional(ing)) return;
      faltan.push(id);
    });
    const p = principal(r);
    const principalOk = tengoSet.has(p) || basicoSet.has(p) || (SUSTITUTOS[p] || []).some((x) => tengoSet.has(x));
    return { r, usa, subs, faltan, n: usa.length + subs.length, principalOk };
  };

  /* opts: { tengo: [ids], basicos: [ids], perfiles: ['papas'|'vasco'], prefsDe: (perfil) => prefs } */
  V.cocinar = function (opts) {
    const tengoSet = new Set(opts.tengo);
    const basicoSet = new Set(opts.basicos);
    const todos = [];
    opts.perfiles.forEach((pid) => {
      const P = V.PERFILES[pid];
      const prefs = opts.prefsDe(pid);
      const avoid = prefs.avoid || [];
      P.recetas.forEach((r) => {
        if (r.alergenos.some((a) => avoid.includes(a))) return;
        const x = V.revisarReceta(r, tengoSet, basicoSet);
        if (!x.n) return;
        // Más ingredientes tuyos = mejor; que falte el principal o varias cosas = peor
        x.score = x.n * 4 + (x.principalOk ? 10 : 0) - x.faltan.length * 6 + Math.log(V.weight(r, prefs)) * 4;
        todos.push(x);
      });
    });

    let listos = todos
      .filter((x) => !x.faltan.length && (x.principalOk || x.n >= 2))
      .sort((a, b) => b.n - a.n || b.score - a.score || a.r.min - b.r.min);
    let casi = todos
      .filter((x) => x.faltan.length >= 1 && x.faltan.length <= 2 && (x.principalOk ? x.n >= 1 : x.n >= 2))
      .sort((a, b) => b.score - a.score || a.faltan.length - b.faltan.length || a.r.min - b.r.min);

    // Si se cocina para los dos, junta la receta de los papás con la de Vasco de la misma olla
    if (opts.perfiles.length > 1) {
      const juntar = (lista) => {
        const porId = new Map(lista.map((x) => [x.r.id, x]));
        const quitar = new Set();
        lista.forEach((x) => {
          if (x.r.perfil === 'papas' && x.r.vasco && porId.has(x.r.vasco)) {
            x.olla = porId.get(x.r.vasco);
            quitar.add(x.r.vasco);
          }
        });
        return lista.filter((x) => !quitar.has(x.r.id));
      };
      listos = juntar(listos);
      casi = juntar(casi);
      const yaJuntas = new Set(listos.filter((x) => x.olla).map((x) => x.olla.r.id));
      casi = casi.filter((x) => !yaJuntas.has(x.r.id));
    }
    return { listos, casi };
  };

  // Sugerencias del buscador: coincidencias por nombre, sin tildes
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  V.buscarIngrediente = function (texto, excluir) {
    const q = norm(texto.trim());
    if (!q) return [];
    const ex = new Set(excluir || []);
    return Object.keys(ING)
      .filter((id) => !ex.has(id))
      .map((id) => {
        const n = norm(ING[id].nombre);
        const pos = n.indexOf(q);
        const palabra = n.split(/[\s(]+/).some((w) => w.startsWith(q));
        return { id, rank: pos === 0 ? 0 : palabra ? 1 : pos > 0 ? 2 : 9 };
      })
      .filter((x) => x.rank < 9)
      .sort((a, b) => a.rank - b.rank || ING[a.id].nombre.localeCompare(ING[b.id].nombre, 'es'))
      .slice(0, 8)
      .map((x) => x.id);
  };
})();
