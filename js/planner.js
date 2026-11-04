/* Planificador semanal: arma un menú variado y balanceado de lunes a domingo
   para cada perfil de la familia (Vasco y los papás), con reglas distintas. */
(function () {
  const V = (window.VASCO = window.VASCO || {});
  const { ING, HIERRO_ANIMAL, PESCADOS, ALERGENOS } = V;

  const VERDURAS_PRINCIPALES = [
    'zapallo', 'zanahoria', 'brocoli', 'espinaca', 'acelga', 'vainita', 'arveja', 'tomate', 'choclo', 'zapallito',
    'olluco', 'lechuga', 'pepino', 'pimiento', 'champinon', 'habas',
  ];
  const PROTEINAS = ['sangrecita', 'higado', 'bazo', 'res', 'pescado', 'trucha', 'atun', 'pollo', 'huevo'];
  const VISCERAS = ['sangrecita', 'higado', 'bazo'];

  /* ---------- Datos derivados de cada receta ---------- */
  V.BY_ID = {};
  V.ADULTO_DE = {}; // id de receta de Vasco -> receta de los papás de la misma olla
  V.esOpcional = (ing) => !!ing[2] && /opcional/i.test(ing[2]);
  function derive(r, perfil) {
    const ids = r.ing.map((i) => i[0]);
    r.perfil = perfil;
    r.ids = ids;
    r.hierroAnimal = ids.some((id) => HIERRO_ANIMAL.includes(id));
    r.pescado = ids.some((id) => PESCADOS.includes(id));
    r.menestra = ids.some((id) => ING[id] && ING[id].cat === 'menestras');
    r.lacteo = ids.some((id) => ['leche', 'queso', 'yogurt'].includes(id));
    r.fruta = ids.some((id) => ING[id] && ING[id].cat === 'frutas' && id !== 'limon');
    r.verdura = ids.some((id) => VERDURAS_PRINCIPALES.includes(id));
    r.roja = ids.includes('res');
    r.viscera = ids.some((id) => VISCERAS.includes(id));
    r.prot = PROTEINAS.find((p) => ids.includes(p)) || (r.menestra ? 'menestra' : r.lacteo ? 'lacteo' : 'otro');
    // Incluye los ingredientes opcionales: ante una alergia, mejor no arriesgar
    r.alergenos = Object.keys(ALERGENOS).filter((a) => ALERGENOS[a].ing.some((id) => ids.includes(id)));
    if (r.hierroAnimal && !r.nutr.includes('hierro')) r.nutr.unshift('hierro');
    if (r.vasco) V.ADULTO_DE[r.vasco] = V.ADULTO_DE[r.vasco] || r.id;
    V.BY_ID[r.id] = r;
  }
  V.RECETAS.forEach((r) => derive(r, 'vasco'));
  V.RECETAS_PAPAS.forEach((r) => derive(r, 'papas'));

  /* ---------- Perfiles ---------- */
  V.PERFILES = {
    vasco: {
      id: 'vasco',
      recetas: V.RECETAS,
      tiempos: V.TIEMPOS,
      tipos: V.TIPOS,
      nutrientes: V.NUTRIENTES,
      reglas: { hierroDiario: true, pescado: [2, 4], menestras: 2, lacteoRefrigerio: true },
    },
    papas: {
      id: 'papas',
      recetas: V.RECETAS_PAPAS,
      tiempos: V.TIEMPOS_PAPAS,
      tipos: V.TIPOS_PAPAS,
      nutrientes: V.NUTRIENTES_PAPAS,
      reglas: { pescado: [2, 4], menestras: 2, rojaMax: 3, visceraMin: 1, verduraPrincipal: true, proteinaAlmuerzo: true, frutaDiaria: true },
    },
  };

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
  V.pool = function (P, tipo, prefs) {
    const avoid = (prefs && prefs.avoid) || [];
    return P.recetas.filter((r) => r.tipo.includes(tipo) && !r.alergenos.some((a) => avoid.includes(a)));
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
  // Tipos de comida en el orden en que aparecen en el día, con sus tiempos
  function slotsByTipo(P) {
    const map = [];
    P.tiempos.forEach((t) => {
      let g = map.find((x) => x.tipo === t.tipo);
      if (!g) map.push((g = { tipo: t.tipo, keys: [] }));
      g.keys.push(t.key);
    });
    return map;
  }

  /* «Misma olla»: una receta de los papás que tiene versión para Vasco ese mismo día */
  V.mismaOlla = function (r, otroDia) {
    if (!r || !otroDia) return false;
    const otros = Object.values(otroDia);
    if (r.perfil === 'papas') return !!r.vasco && otros.includes(r.vasco);
    const adulto = V.ADULTO_DE[r.id];
    return !!adulto && otros.includes(adulto);
  };

  /* ---------- Puntaje de una semana ---------- */
  function scoreWeek(P, days, prefs, link) {
    const R = P.reglas;
    let s = 0;
    let fish = 0;
    let legumes = 0;
    let roja = 0;
    let visc = 0;
    const lunchIds = new Set();
    const dinnerIds = new Set();
    let prevLunchProt = null;
    days.forEach((d, i) => {
      const all = P.tiempos.map((t) => V.BY_ID[d[t.key]] || {});
      const alm = V.BY_ID[d.almuerzo] || {};
      const cen = V.BY_ID[d.cena] || {};
      const ids = all.map((r) => r.id);
      if (new Set(ids).size < ids.length) s -= 30;
      if (R.hierroDiario) {
        if (alm.hierroAnimal || cen.hierroAnimal) s += 3;
        else s -= 12;
      }
      if (alm.prot && alm.prot === cen.prot) s -= 4;
      if (prevLunchProt && alm.prot === prevLunchProt) s -= 2;
      prevLunchProt = alm.prot;
      if (R.lacteoRefrigerio) {
        const refr = P.tiempos.filter((t) => t.tipo === 'refrigerio').map((t) => V.BY_ID[d[t.key]] || {});
        if (refr.some((r) => r.lacteo)) s += 1.5;
      }
      if (!all.some((r) => r.fruta)) s -= R.frutaDiaria ? 9 : 3;
      if (!all.some((r) => r.verdura)) s -= 3;
      if (R.verduraPrincipal) {
        if (!alm.verdura) s -= 2;
        if (!cen.verdura) s -= 1.5;
      }
      if (R.proteinaAlmuerzo && alm.prot === 'otro') s -= 4;
      const desayuno = V.BY_ID[d.desayuno] || {};
      if (d.mm && (V.BY_ID[d.mm] || {}).prot === 'huevo' && desayuno.prot === 'huevo') s -= 1;
      fish += (alm.pescado ? 1 : 0) + (cen.pescado ? 1 : 0);
      legumes += (alm.menestra ? 1 : 0) + (cen.menestra ? 1 : 0);
      roja += (alm.roja ? 1 : 0) + (cen.roja ? 1 : 0);
      visc += (alm.viscera ? 1 : 0) + (cen.viscera ? 1 : 0);
      lunchIds.add(alm.id);
      dinnerIds.add(cen.id);
      all.forEach((r) => {
        if (r.id) s += Math.log(V.weight(r, prefs)) * 1.5;
      });
      if (link && link[i]) {
        if (V.mismaOlla(alm, link[i])) s += 3;
        if (V.mismaOlla(cen, link[i])) s += 2;
      }
    });
    if (fish < R.pescado[0]) s -= 8 * (R.pescado[0] - fish);
    if (fish > R.pescado[1]) s -= 2 * (fish - R.pescado[1]);
    if (legumes < R.menestras) s -= 5 * (R.menestras - legumes);
    if (R.rojaMax != null && roja > R.rojaMax) s -= 3 * (roja - R.rojaMax);
    if (R.visceraMin && visc < R.visceraMin) s -= 6 * (R.visceraMin - visc);
    lunchIds.forEach((id) => {
      if (dinnerIds.has(id)) s -= 6;
    });
    return s;
  }

  /* Genera la semana: prueba muchas combinaciones y se queda con la más balanceada.
     link: el menú del otro perfil esa semana, para preferir «misma olla». */
  V.generateWeek = function (P, seed, prefs, link) {
    const rand = rng(seed);
    const groups = slotsByTipo(P).map((g) => Object.assign(g, { pool: V.pool(P, g.tipo, prefs) }));
    let best = null;
    let bestScore = -Infinity;
    for (let t = 0; t < 400; t++) {
      const picks = groups.map((g) => take(weightedOrder(g.pool, prefs, rand), 7 * g.keys.length));
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = {};
        groups.forEach((g, gi) => {
          g.keys.forEach((k, j) => {
            const r = picks[gi][i * g.keys.length + j];
            day[k] = r && r.id;
          });
        });
        days.push(day);
      }
      const sc = scoreWeek(P, days, prefs, link);
      if (sc > bestScore) {
        bestScore = sc;
        best = days;
      }
    }
    return best;
  };

  /* Opciones para cambiar un tiempo de comida, de la más recomendable a la menos */
  V.alternatives = function (P, week, dayIdx, slotKey, prefs, link) {
    const slot = P.tiempos.find((t) => t.key === slotKey);
    const day = week[dayIdx];
    const current = day[slotKey];
    const usedCount = {};
    week.forEach((d) => Object.values(d).forEach((id) => (usedCount[id] = (usedCount[id] || 0) + 1)));
    const otherMain = slotKey === 'almuerzo' ? day.cena : slotKey === 'cena' ? day.almuerzo : null;
    const needsIron = P.reglas.hierroDiario && otherMain ? !(V.BY_ID[otherMain] || {}).hierroAnimal : false;
    const sameDay = Object.values(day);
    const otroDia = link && link[dayIdx];
    return V.pool(P, slot.tipo, prefs)
      .filter((r) => r.id !== current)
      .map((r) => {
        let score = V.weight(r, prefs) * 10;
        if (usedCount[r.id]) score -= 8 * usedCount[r.id];
        if (sameDay.includes(r.id)) score -= 30;
        if (needsIron && r.hierroAnimal) score += 12;
        if (otherMain && r.hierroAnimal) score += 2;
        const olla = V.mismaOlla(r, otroDia);
        if (olla) score += 6;
        return { r, score, enSemana: usedCount[r.id] || 0, sugerida: needsIron && r.hierroAnimal, olla };
      })
      .sort((a, b) => b.score - a.score || a.r.nombre.localeCompare(b.r.nombre, 'es'));
  };

  /* Resumen nutricional de un día */
  V.daySummary = function (P, day) {
    const rs = P.tiempos.map((t) => V.BY_ID[day[t.key]]).filter(Boolean);
    return {
      hierro: rs.some((r) => r.hierroAnimal),
      fruta: rs.some((r) => r.fruta),
      verdura: rs.some((r) => r.verdura),
      lacteo: rs.some((r) => r.lacteo),
      pescado: rs.some((r) => r.pescado),
      menestra: rs.some((r) => r.menestra),
      proteina: rs.some((r) => r.prot !== 'otro' && r.prot !== 'lacteo'),
    };
  };

  /* Lista del mercado: junta los menús que se le pasen (uno o los dos perfiles) */
  V.shoppingList = function (entries) {
    const map = {};
    entries.forEach(({ P, days }) => {
      days.forEach((d) => {
        P.tiempos.forEach((t) => {
          const r = V.BY_ID[d[t.key]];
          if (!r) return;
          r.ing.forEach(([id]) => {
            if (!ING[id]) return;
            const it = (map[id] = map[id] || { id, veces: 0, recetas: [], quien: [] });
            it.veces++;
            if (!it.recetas.includes(r.nombre)) it.recetas.push(r.nombre);
            if (!it.quien.includes(P.id)) it.quien.push(P.id);
          });
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
