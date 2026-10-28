/* Planificador semanal: arma un menú variado y balanceado de lunes a domingo. */
(function () {
  const V = (window.VASCO = window.VASCO || {});
  const { ING, RECETAS, HIERRO_ANIMAL, PESCADOS, ALERGENOS } = V;

  const VERDURAS_PRINCIPALES = ['zapallo', 'zanahoria', 'brocoli', 'espinaca', 'acelga', 'vainita', 'arveja', 'tomate', 'choclo', 'zapallito', 'olluco'];
  const PROTEINAS = ['sangrecita', 'higado', 'bazo', 'res', 'pescado', 'trucha', 'pollo', 'huevo'];

  /* ---------- Datos derivados de cada receta ---------- */
  V.BY_ID = {};
  RECETAS.forEach((r) => {
    const ids = r.ing.map((i) => i[0]);
    r.ids = ids;
    r.hierroAnimal = ids.some((id) => HIERRO_ANIMAL.includes(id));
    r.pescado = ids.some((id) => PESCADOS.includes(id));
    r.menestra = ids.some((id) => ING[id] && ING[id].cat === 'menestras');
    r.lacteo = ids.some((id) => ['leche', 'queso', 'yogurt'].includes(id));
    r.fruta = ids.some((id) => ING[id] && ING[id].cat === 'frutas' && id !== 'limon');
    r.verdura = ids.some((id) => VERDURAS_PRINCIPALES.includes(id));
    r.prot = PROTEINAS.find((p) => ids.includes(p)) || (r.menestra ? 'menestra' : r.lacteo ? 'lacteo' : 'otro');
    r.alergenos = Object.keys(ALERGENOS).filter((a) => ALERGENOS[a].ing.some((id) => ids.includes(id)));
    if (r.hierroAnimal && !r.nutr.includes('hierro')) r.nutr.unshift('hierro');
    V.BY_ID[r.id] = r;
  });

  /* ---------- Fechas ---------- */
  V.DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  V.DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  V.MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
  V.MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];

  const pad = (n) => String(n).padStart(2, '0');
  V.isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  V.parseDate = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  V.mondayOf = (d) => {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dow = (x.getDay() + 6) % 7; // 0 = lunes
    x.setDate(x.getDate() - dow);
    return x;
  };
  V.addDays = (d, n) => {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
  };
  V.dayIndex = (d) => (d.getDay() + 6) % 7;

  /* ---------- Azar con semilla ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  V.seedFrom = (str) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  /* ---------- Preferencias ---------- */
  V.pool = function (tipo, prefs) {
    const avoid = (prefs && prefs.avoid) || [];
    return RECETAS.filter((r) => r.tipo.includes(tipo) && !r.alergenos.some((a) => avoid.includes(a)));
  };
  V.weight = function (r, prefs) {
    let w = 1;
    const reac = prefs && prefs.reactions && prefs.reactions[r.id];
    if (reac === 'love') w *= 1.8;
    if (reac === 'no') w *= 0.35;
    if (prefs && prefs.favorites && prefs.favorites.includes(r.id)) w *= 1.4;
    return w;
  };

  function weightedOrder(list, prefs, rand) {
    return list
      .map((r) => ({ r, k: Math.pow(rand(), 1 / V.weight(r, prefs)) }))
      .sort((a, b) => b.k - a.k)
      .map((x) => x.r);
  }
  function take(list, n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(list.length ? list[i % list.length] : null);
    return out;
  }

  /* ---------- Puntaje de una semana ---------- */
  function scoreWeek(days, prefs) {
    let s = 0;
    let fish = 0;
    let legumes = 0;
    const lunchIds = new Set();
    const dinnerIds = new Set();
    let prevLunchProt = null;
    days.forEach((d) => {
      const R = (k) => V.BY_ID[d[k]] || {};
      const des = R('desayuno'), mm = R('mm'), alm = R('almuerzo'), mt = R('mt'), cen = R('cena');
      const all = [des, mm, alm, mt, cen];
      const ids = all.map((r) => r.id);
      if (new Set(ids).size < ids.length) s -= 30;
      if (alm.hierroAnimal || cen.hierroAnimal) s += 3;
      else s -= 12;
      if (alm.prot && alm.prot === cen.prot) s -= 4;
      if (prevLunchProt && alm.prot === prevLunchProt) s -= 2;
      prevLunchProt = alm.prot;
      if (mm.lacteo || mt.lacteo) s += 1.5;
      if (!all.some((r) => r.fruta)) s -= 3;
      if (!all.some((r) => r.verdura)) s -= 3;
      if (mm.prot === 'huevo' && des.prot === 'huevo') s -= 1;
      fish += (alm.pescado ? 1 : 0) + (cen.pescado ? 1 : 0);
      legumes += (alm.menestra ? 1 : 0) + (cen.menestra ? 1 : 0);
      lunchIds.add(alm.id);
      dinnerIds.add(cen.id);
      all.forEach((r) => {
        if (r.id) s += Math.log(V.weight(r, prefs)) * 1.5;
      });
    });
    if (fish < 2) s -= 8 * (2 - fish);
    if (fish > 4) s -= 2 * (fish - 4);
    if (legumes < 2) s -= 5 * (2 - legumes);
    lunchIds.forEach((id) => {
      if (dinnerIds.has(id)) s -= 6;
    });
    return s;
  }

  /* Genera la semana: prueba muchas combinaciones y se queda con la más balanceada */
  V.generateWeek = function (seed, prefs) {
    const rand = rng(seed);
    const pools = {
      desayuno: V.pool('desayuno', prefs),
      refrigerio: V.pool('refrigerio', prefs),
      almuerzo: V.pool('almuerzo', prefs),
      cena: V.pool('cena', prefs),
    };
    let best = null;
    let bestScore = -Infinity;
    for (let t = 0; t < 400; t++) {
      const des = take(weightedOrder(pools.desayuno, prefs, rand), 7);
      const ref = take(weightedOrder(pools.refrigerio, prefs, rand), 14);
      const alm = take(weightedOrder(pools.almuerzo, prefs, rand), 7);
      const cen = take(weightedOrder(pools.cena, prefs, rand), 7);
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push({
          desayuno: des[i] && des[i].id,
          mm: ref[2 * i] && ref[2 * i].id,
          almuerzo: alm[i] && alm[i].id,
          mt: ref[2 * i + 1] && ref[2 * i + 1].id,
          cena: cen[i] && cen[i].id,
        });
      }
      const sc = scoreWeek(days, prefs);
      if (sc > bestScore) {
        bestScore = sc;
        best = days;
      }
    }
    return best;
  };

  /* Opciones para cambiar un tiempo de comida, de la más recomendable a la menos */
  V.alternatives = function (week, dayIdx, slotKey, prefs) {
    const slot = V.TIEMPOS.find((t) => t.key === slotKey);
    const day = week[dayIdx];
    const current = day[slotKey];
    const usedCount = {};
    week.forEach((d) => Object.values(d).forEach((id) => (usedCount[id] = (usedCount[id] || 0) + 1)));
    const otherMain = slotKey === 'almuerzo' ? day.cena : slotKey === 'cena' ? day.almuerzo : null;
    const needsIron = otherMain ? !(V.BY_ID[otherMain] || {}).hierroAnimal : false;
    const sameDay = Object.values(day);
    return V.pool(slot.tipo, prefs)
      .filter((r) => r.id !== current)
      .map((r) => {
        let score = V.weight(r, prefs) * 10;
        if (usedCount[r.id]) score -= 8 * usedCount[r.id];
        if (sameDay.includes(r.id)) score -= 30;
        if (needsIron && r.hierroAnimal) score += 12;
        if (otherMain && r.hierroAnimal) score += 2;
        return { r, score, enSemana: usedCount[r.id] || 0, sugerida: needsIron && r.hierroAnimal };
      })
      .sort((a, b) => b.score - a.score || a.r.nombre.localeCompare(b.r.nombre, 'es'));
  };

  /* Resumen nutricional de un día */
  V.daySummary = function (day) {
    const rs = V.TIEMPOS.map((t) => V.BY_ID[day[t.key]]).filter(Boolean);
    return {
      hierro: rs.some((r) => r.hierroAnimal),
      fruta: rs.some((r) => r.fruta),
      verdura: rs.some((r) => r.verdura),
      lacteo: rs.some((r) => r.lacteo),
      pescado: rs.some((r) => r.pescado),
      menestra: rs.some((r) => r.menestra),
    };
  };

  /* Lista del mercado de la semana */
  V.shoppingList = function (week) {
    const map = {};
    week.forEach((d, di) => {
      V.TIEMPOS.forEach((t) => {
        const r = V.BY_ID[d[t.key]];
        if (!r) return;
        r.ing.forEach(([id]) => {
          if (!ING[id]) return;
          map[id] = map[id] || { id, veces: 0, recetas: [] };
          map[id].veces++;
          if (!map[id].recetas.includes(r.nombre)) map[id].recetas.push(r.nombre);
        });
      });
    });
    const groups = V.CATEGORIAS.map((c) => ({
      ...c,
      items: Object.values(map)
        .filter((it) => ING[it.id].cat === c.id && !ING[it.id].basico)
        .sort((a, b) => b.veces - a.veces || ING[a.id].nombre.localeCompare(ING[b.id].nombre, 'es')),
    })).filter((g) => g.items.length);
    const basicos = Object.values(map)
      .filter((it) => ING[it.id].basico)
      .sort((a, b) => ING[a.id].nombre.localeCompare(ING[b.id].nombre, 'es'));
    return { groups, basicos };
  };
})();
