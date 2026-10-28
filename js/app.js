/* Recetas para Vasco: vistas, navegación y datos guardados en el teléfono. */
(function () {
  'use strict';
  const V = window.VASCO;
  const { ING, TIEMPOS, TIPOS, NUTRIENTES, BY_ID } = V;
  const $ = (s, el) => (el || document).querySelector(s);
  const view = $('#view');

  const LOGO =
    '<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#E8632B"/>' +
    '<rect y="100" width="120" height="6" fill="#F4B63F"/><rect y="106" width="120" height="5" fill="#4E9A3A"/><rect y="111" width="120" height="9" fill="#7B4FA8"/>' +
    '<path d="M46 22c-5 6 5 9 0 16M60 18c-5 6 5 9 0 16M74 22c-5 6 5 9 0 16" stroke="#FFE2CF" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M25 62c2-18 68-18 70 0z" fill="#F6D477"/><circle cx="44" cy="53" r="2.4" fill="#FCEBC0"/><circle cx="56" cy="49" r="2.4" fill="#FCEBC0"/><circle cx="70" cy="51" r="2.4" fill="#FCEBC0"/><circle cx="62" cy="56" r="2.4" fill="#FCEBC0"/>' +
    '<circle cx="47" cy="52" r="7" fill="#F57C1F"/><circle cx="47" cy="52" r="4" fill="#F9B867"/>' +
    '<path d="M64 52c4-10 16-12 22-8-4 8-14 12-22 8z" fill="#4E9A3A"/>' +
    '<path d="M18 60h84c0 21-19 36-42 36S18 81 18 60z" fill="#FFFFFF"/>' +
    '<path d="M46 73q3.5-3.5 7 0M67 73q3.5-3.5 7 0M53 81q7 6 14 0" stroke="#26233A" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
    '<circle cx="42" cy="80" r="3.4" fill="#F7A1A1"/><circle cx="78" cy="80" r="3.4" fill="#F7A1A1"/></svg>';

  /* ---------- Datos guardados en este teléfono ---------- */
  const KEY = 'vasco.v1';
  const fresh = () => ({
    settings: { nombre: 'Vasco', nacimiento: '', horas: {}, avoid: [] },
    plans: {},
    favorites: [],
    reactions: {},
    compras: {},
    welcomed: false,
    installHidden: false,
  });
  let S = load();
  function load() {
    const base = fresh();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return base;
      const d = JSON.parse(raw);
      return Object.assign(base, d, { settings: Object.assign(base.settings, d.settings || {}) });
    } catch (e) {
      return base;
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
      /* sin almacenamiento: la app sigue funcionando en esta sesión */
    }
  }
  const prefs = () => ({ favorites: S.favorites, reactions: S.reactions, avoid: S.settings.avoid });
  const nombre = () => (S.settings.nombre || 'Vasco').trim() || 'Vasco';
  const hora = (key) => S.settings.horas[key] || TIEMPOS.find((t) => t.key === key).hora;

  /* ---------- Utilidades ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const today = () => new Date();
  const weekKey = (d) => V.isoDate(V.mondayOf(d));
  const fmtDay = (d) => `${d.getDate()} de ${V.MESES[d.getMonth()]}`;
  const fmtRange = (mondayIso) => {
    const a = V.parseDate(mondayIso);
    const b = V.addDays(a, 6);
    return a.getMonth() === b.getMonth()
      ? `${a.getDate()} al ${b.getDate()} de ${V.MESES[b.getMonth()]}`
      : `${a.getDate()} ${V.MESES_CORTOS[a.getMonth()]} al ${b.getDate()} ${V.MESES_CORTOS[b.getMonth()]}`;
  };
  const toMin = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };
  const fmtHora = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return `${h}:${String(m).padStart(2, '0')}`;
  };
  function edadTexto() {
    if (!S.settings.nacimiento) return '1 año';
    const b = V.parseDate(S.settings.nacimiento);
    const n = today();
    let m = (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth());
    if (n.getDate() < b.getDate()) m--;
    if (m < 0) return 'recién nacido';
    if (m < 24) return `${m} meses`;
    const y = Math.floor(m / 12);
    return `${y} años`;
  }
  function edadMeses() {
    if (!S.settings.nacimiento) return null;
    const b = V.parseDate(S.settings.nacimiento);
    const n = today();
    let m = (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth());
    if (n.getDate() < b.getDate()) m--;
    return m;
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  const dish = (r) => V.dishArt(r);
  function badges(r, extra) {
    const out = [];
    if (r.hierroAnimal) out.push('<span class="badge iron">Hierro</span>');
    if (r.pescado) out.push('<span class="badge fish">Pescado</span>');
    if (S.reactions[r.id] === 'love') out.push('<span class="badge love">Le encantó</span>');
    if (S.favorites.includes(r.id)) out.push('<span class="badge fav">Favorita</span>');
    return out.concat(extra || []).join('');
  }

  /* ---------- Menú semanal ---------- */
  function sanitize(plan) {
    let changed = false;
    plan.days.forEach((d, i) => {
      TIEMPOS.forEach((t) => {
        const r = BY_ID[d[t.key]];
        const bad = !r || !r.tipo.includes(t.tipo) || r.alergenos.some((a) => S.settings.avoid.includes(a));
        if (bad) {
          const alt = V.alternatives(plan.days, i, t.key, prefs())[0];
          if (alt) {
            d[t.key] = alt.r.id;
            changed = true;
          }
        }
      });
    });
    return changed;
  }
  function getPlan(key) {
    let p = S.plans[key];
    if (!p || !Array.isArray(p.days) || p.days.length !== 7) {
      const seed = V.seedFrom(key);
      p = { seed, days: V.generateWeek(seed, prefs()) };
      S.plans[key] = p;
      const keys = Object.keys(S.plans).sort();
      while (keys.length > 8) delete S.plans[keys.shift()];
      save();
    }
    if (sanitize(p)) save();
    return p;
  }

  const ui = { week: weekKey(today()), day: V.dayIndex(today()), recFilter: 'todas', recExtras: [], recQuery: '', tengo: [], shopWeek: weekKey(today()) };
  const weekOffset = () => Math.round((V.parseDate(ui.week) - V.mondayOf(today())) / (7 * 864e5));

  function nextSlotKey(day) {
    const now = today();
    const mins = now.getHours() * 60 + now.getMinutes();
    const t = TIEMPOS.find((t) => toMin(hora(t.key)) + 45 > mins);
    return t ? t.key : null;
  }

  function renderMenu() {
    const plan = getPlan(ui.week);
    const monday = V.parseDate(ui.week);
    const off = weekOffset();
    const todayIso = V.isoDate(today());
    const date = V.addDays(monday, ui.day);
    const isToday = V.isoDate(date) === todayIso;
    const day = plan.days[ui.day];
    const sum = V.daySummary(day);
    const nextKey = isToday ? nextSlotKey(day) : null;
    const weekLabel = off === 0 ? 'Esta semana' : off === 1 ? 'La próxima semana' : off === -1 ? 'La semana pasada' : 'Semana';

    const checks = [
      ['hierro', 'Hierro'],
      ['fruta', 'Fruta'],
      ['verdura', 'Verduras'],
      ['lacteo', 'Lácteo'],
    ]
      .map(([k, l]) => `<span class="check ${sum[k] ? 'on' : 'off'}">${V.ui('check', 16)}${l}</span>`)
      .concat(sum.pescado ? [`<span class="check on">${V.ui('check', 16)}Pescado</span>`] : [])
      .concat(sum.menestra ? [`<span class="check on">${V.ui('check', 16)}Menestras</span>`] : [])
      .join('');

    const slots = TIEMPOS.map((t) => {
      const r = BY_ID[day[t.key]];
      if (!r) return '';
      const next = t.key === nextKey;
      const reac = S.reactions[r.id];
      return `<li class="slot" data-slot="${t.key}">
        <div class="slot-time"><span class="time">${fmtHora(hora(t.key))}</span><span class="dot"></span><span class="rail"></span></div>
        <article class="slot-card${next ? ' is-next' : ''}">
          <a class="slot-main" href="#receta-${r.id}">
            <div class="slot-art" data-tipo="${t.tipo}">${dish(r)}</div>
            <div class="slot-body">
              <span class="slot-label">${t.nombre}${next ? '<em>Ahora toca</em>' : ''}</span>
              <h3>${esc(r.nombre)}</h3>
              <span class="meta">${r.min} min ${badges(r)}</span>
            </div>
          </a>
          <div class="slot-actions">
            <button class="chip-btn" data-act="opciones" data-slot="${t.key}">${V.ui('cambiar', 16)}Ver otras opciones</button>
            ${reac === 'no' ? '<span class="reac-mini">La última vez no quiso</span>' : ''}
          </div>
        </article>
      </li>`;
    }).join('');

    const dayChips = V.DIAS_CORTOS.map((d, i) => {
      const dt = V.addDays(monday, i);
      const cls = V.isoDate(dt) === todayIso ? ' is-today' : '';
      return `<button class="day-chip${cls}" role="tab" aria-selected="${i === ui.day}" aria-label="${V.DIAS[i]} ${fmtDay(dt)}" data-act="day" data-i="${i}"><span>${d}</span><b>${dt.getDate()}</b></button>`;
    }).join('');

    const tipIdx = (V.seedFrom(V.isoDate(date)) % V.TIPS.length);
    const welcome = !S.welcomed
      ? `<section class="notice" aria-labelledby="hola">
          <div class="foods">${['quinua', 'zapallo', 'pescado', 'palta', 'mandarina'].map((id) => V.icon(id, 40)).join('')}</div>
          <h2 id="hola">¡Hola! Este es el menú de ${esc(nombre())}</h2>
          <p>Cada día tiene 5 comidas: desayuno, media mañana, almuerzo, media tarde y cena. Toca una comida para ver la receta, o <b>Ver otras opciones</b> si prefieres preparar otra cosa. Cada lunes se arma un menú nuevo para que no repita siempre lo mismo.</p>
          <div class="btn-row"><button class="btn primary" data-act="welcomed">Entendido</button><a class="btn soft" href="#guia">Ver la guía</a></div>
        </section>`
      : '';
    const install =
      S.welcomed && deferredInstall && !S.installHidden
        ? `<section class="notice"><h2>Instala la app en este celular</h2><p>Así la abres desde la pantalla de inicio, como cualquier app, y funciona sin internet.</p>
           <div class="btn-row"><button class="btn primary" data-act="install">${V.ui('instalar', 18)} Instalar</button><button class="btn soft" data-act="install-hide">Ahora no</button></div></section>`
        : '';

    view.innerHTML = `<div class="stack">
      ${welcome}${install}
      <section aria-label="Semana">
        <div class="week-nav">
          <button class="icon-btn" data-act="week" data-d="-1" aria-label="Semana anterior" ${off <= -1 ? 'disabled' : ''}>${V.ui('atras', 20)}</button>
          <div class="week-title"><span class="eyebrow">${weekLabel}</span><strong>${fmtRange(ui.week)}</strong></div>
          <button class="icon-btn" data-act="week" data-d="1" aria-label="Semana siguiente" ${off >= 1 ? 'disabled' : ''}><span style="transform:scaleX(-1);display:grid">${V.ui('atras', 20)}</span></button>
        </div>
        <div class="days" role="tablist" aria-label="Días">${dayChips}</div>
      </section>
      <section aria-labelledby="dia">
        <div class="day-title"><h2 id="dia">${V.DIAS[ui.day]} ${fmtDay(date)}</h2>${isToday ? '<span class="pill">Hoy</span>' : ''}</div>
        <div class="checks" aria-label="Lo que aporta el día">${checks}</div>
        <ol class="timeline">${slots}</ol>
      </section>
      <aside class="tip-card">${V.icon('palta', 52)}<div><span class="eyebrow">Consejo del día</span><p>${esc(V.TIPS[tipIdx])}</p></div></aside>
      <button class="btn ghost wide" data-act="regen">${V.ui('chispa', 18)} Armar otro menú para esta semana</button>
    </div>`;
  }

  function openOptions(slotKey) {
    const plan = getPlan(ui.week);
    const t = TIEMPOS.find((x) => x.key === slotKey);
    const alts = V.alternatives(plan.days, ui.day, slotKey, prefs());
    const current = BY_ID[plan.days[ui.day][slotKey]];
    const items = alts
      .map((a) => {
        const extra = [];
        if (a.sugerida) extra.push('<span class="badge love">Aporta el hierro del día</span>');
        if (a.enSemana) extra.push('<span class="badge">Ya está esta semana</span>');
        if (S.reactions[a.r.id] === 'no') extra.push('<span class="badge">No quiso la última vez</span>');
        return `<li><button class="opt" data-act="pick" data-slot="${slotKey}" data-id="${a.r.id}">
          <span class="opt-art" data-tipo="${t.tipo}">${dish(a.r)}</span>
          <span class="opt-body"><b>${esc(a.r.nombre)}</b><span class="meta">${a.r.min} min ${badges(a.r, extra)}</span></span>
        </button></li>`;
      })
      .join('');
    openSheet(`<div class="sheet-head"><div><span class="eyebrow">${V.DIAS[ui.day]} · ${t.nombre}</span><h2 id="sheet-title">Elige otra opción</h2>
        <p class="hint">Ahora: ${esc(current ? current.nombre : '')}</p></div>
        <button class="icon-btn" data-act="close-sheet" aria-label="Cerrar">${V.ui('cerrar', 20)}</button></div>
      <button class="btn primary wide" data-act="pick-random" data-slot="${slotKey}">${V.ui('dado', 18)} Sorpréndeme</button>
      <ul class="opt-list">${items}</ul>`);
  }

  function setSlot(weekIso, dayIdx, slotKey, id) {
    const plan = getPlan(weekIso);
    plan.days[dayIdx][slotKey] = id;
    save();
  }

  /* ---------- Detalle de receta ---------- */
  function renderReceta(id) {
    const r = BY_ID[id];
    if (!r) {
      view.innerHTML = `<div class="empty">${V.icon('agua', 64)}<p>No encontramos esa receta.</p><a class="btn primary" href="#recetas">Ver todas las recetas</a></div>`;
      return;
    }
    const tipo = r.tipo[0];
    const porcion =
      tipo === 'refrigerio' ? 'Porción pequeña' : '1 plato mediano (7 a 10 cucharadas)';
    const fav = S.favorites.includes(r.id);
    const reac = S.reactions[r.id] || '';
    const alerg = r.alergenos.map((a) => V.ALERGENOS[a].nombre.toLowerCase());
    const main = r.tipo.includes('almuerzo') || r.tipo.includes('cena');
    view.innerHTML = `<article class="detail" data-tipo="${tipo}">
      <div class="detail-bar">
        <button class="icon-btn" data-act="back" aria-label="Volver">${V.ui('atras', 22)}</button>
        <button class="icon-btn fav" data-act="fav" data-id="${r.id}" aria-pressed="${fav}" aria-label="Guardar en favoritas">${V.ui('corazon', 22)}</button>
      </div>
      <div class="detail-art">${dish(r)}</div>
      <header class="detail-head">
        <div class="tags">${r.tipo.map((t) => `<span class="tag" data-tipo="${t}">${TIPOS[t].nombre}</span>`).join('')}</div>
        <h1>${esc(r.nombre)}</h1>
        <p class="meta">${V.ui('reloj', 16)} ${r.min} min · ${porcion}</p>
      </header>
      <section class="block">
        <h2>Por qué le hace bien</h2>
        <ul class="nutr-list">${r.nutr.map((n) => `<li><span><b>${NUTRIENTES[n].nombre}</b>${NUTRIENTES[n].para}</span></li>`).join('')}</ul>
      </section>
      <section class="block">
        <h2>Ingredientes</h2>
        <p class="hint">Para una porción de ${esc(nombre())}. Toca cada uno cuando lo tengas listo.</p>
        <ul class="ing-list">${r.ing
          .map(
            ([iid, q, nota]) => `<li><button class="ing" data-act="tick" aria-pressed="false">
              <span class="ing-ico">${V.icon(iid, 40)}</span>
              <span class="ing-txt"><b>${esc(ING[iid].nombre)}</b><span>${esc(q)}${nota ? ' · ' + esc(nota) : ''}</span></span>
              <span class="tick">${V.ui('check', 16)}</span></button></li>`
          )
          .join('')}</ul>
      </section>
      <section class="block">
        <h2>Preparación</h2>
        <ol class="steps">${r.pasos.map((p) => `<li><span>${esc(p)}</span></li>`).join('')}</ol>
      </section>
      <section class="block note">
        <h2>Para su desarrollo</h2>
        <p>${esc(r.tip)}</p>
      </section>
      ${main ? `<section class="block plain"><h2>Para toda la familia</h2><p>Puedes cocinar la misma olla para todos: separa la porción de ${esc(nombre())} antes de agregar sal, ají o sillao.</p></section>` : ''}
      ${alerg.length ? `<p class="hint">Contiene ${alerg.join(', ')}. Si tiene alguna alergia, márcala en Ajustes y esta receta no aparecerá en su menú.</p>` : ''}
      <section class="block">
        <h2>¿Le gustó a ${esc(nombre())}?</h2>
        <div class="reactions">
          <button class="reac" data-act="reac" data-id="${r.id}" data-v="love" aria-pressed="${reac === 'love'}"><span class="face" aria-hidden="true">😋</span>Le encantó</button>
          <button class="reac" data-act="reac" data-id="${r.id}" data-v="meh" aria-pressed="${reac === 'meh'}"><span class="face" aria-hidden="true">🙂</span>Más o menos</button>
          <button class="reac" data-act="reac" data-id="${r.id}" data-v="no" aria-pressed="${reac === 'no'}"><span class="face" aria-hidden="true">🙅</span>No quiso</button>
        </div>
        <p class="hint" id="reac-hint">${reacHint(reac)}</p>
      </section>
      <button class="btn primary wide" data-act="add" data-id="${r.id}">${V.ui('mas', 20)} Poner en el menú</button>
    </article>`;
  }
  function reacHint(v) {
    if (v === 'love') return 'Aparecerá más seguido en sus menús.';
    if (v === 'no') return 'Es normal: a veces necesita probar un alimento 8 a 10 veces. Aparecerá menos, pero volverá de vez en cuando.';
    if (v === 'meh') return 'Anotado. Puedes probar cambiando la textura o acompañándolo con algo que le guste.';
    return 'Tu respuesta ayuda a armar mejores menús.';
  }

  function openAddToMenu(id) {
    const r = BY_ID[id];
    const keys = TIEMPOS.filter((t) => r.tipo.includes(t.tipo)).map((t) => t.key);
    const st = { week: weekKey(today()), day: V.dayIndex(today()), slot: keys[0] };
    const draw = () => {
      const monday = V.parseDate(st.week);
      openSheet(`<div class="sheet-head"><div><span class="eyebrow">Poner en el menú</span><h2 id="sheet-title">${esc(r.nombre)}</h2></div>
          <button class="icon-btn" data-act="close-sheet" aria-label="Cerrar">${V.ui('cerrar', 20)}</button></div>
        <div class="seg" role="group" aria-label="Semana">
          <button data-act="add-week" data-w="${weekKey(today())}" aria-pressed="${st.week === weekKey(today())}">Esta semana</button>
          <button data-act="add-week" data-w="${weekKey(V.addDays(today(), 7))}" aria-pressed="${st.week !== weekKey(today())}">La próxima</button>
        </div>
        <div class="field"><span class="label">Día</span><div class="daypick">${V.DIAS_CORTOS.map(
          (d, i) => `<button data-act="add-day" data-i="${i}" aria-pressed="${st.day === i}" aria-label="${V.DIAS[i]} ${fmtDay(V.addDays(monday, i))}">${d}<br><small>${V.addDays(monday, i).getDate()}</small></button>`
        ).join('')}</div></div>
        ${keys.length > 1 ? `<div class="field"><span class="label">Comida</span><div class="slotpick">${keys
          .map((k) => `<button data-act="add-slot" data-k="${k}" aria-pressed="${st.slot === k}">${TIEMPOS.find((t) => t.key === k).nombre}</button>`)
          .join('')}</div></div>` : ''}
        <button class="btn primary wide" data-act="add-ok">${V.ui('check', 18)} Poner el ${V.DIAS[st.day].toLowerCase()} en ${TIEMPOS.find((t) => t.key === st.slot).nombre.toLowerCase()}</button>`);
    };
    sheetCtx = { kind: 'add', st, draw, r };
    draw();
  }

  /* ---------- Recetario ---------- */
  function renderRecetas() {
    const tipos = [['todas', 'Todas'], ['desayuno', 'Desayunos'], ['refrigerio', 'Refrigerios'], ['almuerzo', 'Almuerzos'], ['cena', 'Cenas'], ['favoritas', 'Favoritas']];
    const extras = [['hierro', 'Ricas en hierro'], ['pescado', 'Con pescado'], ['rapidas', 'Listas en 15 min']];
    view.innerHTML = `<div class="stack">
      <div><h1 class="view-title">Recetas</h1><p class="view-sub">${V.RECETAS.length} recetas peruanas para ${esc(nombre())}, sin sal ni azúcar.</p></div>
      <label class="search">${V.ui('buscar', 20)}<span class="sr-only">Buscar</span>
        <input id="q" type="search" placeholder="Busca: quinua, pescado, avena…" value="${esc(ui.recQuery)}" autocomplete="off" enterkeyhint="search"></label>
      <div class="filters" role="group" aria-label="Tipo de comida">${tipos
        .map(([k, l]) => `<button class="filter" data-act="rf" data-k="${k}" aria-pressed="${ui.recFilter === k}">${k === 'favoritas' ? V.ui('corazon', 16) : ''}${l}</button>`)
        .join('')}</div>
      <div class="filters" role="group" aria-label="Filtros">
        <button class="filter" data-act="tengo">${V.ui('canasta', 16)}Lo que tengo en casa${ui.tengo.length ? ` (${ui.tengo.length})` : ''}</button>
        ${extras.map(([k, l]) => `<button class="filter" data-act="rx" data-k="${k}" aria-pressed="${ui.recExtras.includes(k)}">${l}</button>`).join('')}
      </div>
      <div id="rec-results"></div>
    </div>`;
    renderRecResults();
  }
  function filteredRecipes() {
    const q = norm(ui.recQuery.trim());
    let list = V.RECETAS.filter((r) => {
      if (ui.recFilter === 'favoritas' && !S.favorites.includes(r.id)) return false;
      if (!['todas', 'favoritas'].includes(ui.recFilter) && !r.tipo.includes(ui.recFilter)) return false;
      if (ui.recExtras.includes('hierro') && !r.hierroAnimal) return false;
      if (ui.recExtras.includes('pescado') && !r.pescado) return false;
      if (ui.recExtras.includes('rapidas') && r.min > 15) return false;
      if (q) {
        const hay = norm(r.nombre + ' ' + r.ing.map(([id]) => ING[id].nombre).join(' '));
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    if (ui.tengo.length) {
      list = list
        .map((r) => ({ r, n: r.ids.filter((id) => ui.tengo.includes(id)).length }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n || a.r.min - b.r.min)
        .map((x) => Object.assign(x.r, { _n: x.n }));
    }
    return list;
  }
  function renderRecResults() {
    const box = $('#rec-results');
    if (!box) return;
    const list = filteredRecipes();
    if (!list.length) {
      box.innerHTML = `<div class="empty">${V.icon('quinua', 64)}<p>${ui.recFilter === 'favoritas' && !S.favorites.length ? 'Aún no tienes favoritas. Toca el corazón en una receta para guardarla aquí.' : 'No hay recetas con esos filtros.'}</p>
        <button class="btn soft" data-act="clear-filters">Quitar filtros</button></div>`;
      return;
    }
    box.innerHTML = `<p class="count">${list.length} ${list.length === 1 ? 'receta' : 'recetas'}${ui.tengo.length ? ' con lo que tienes, de más a menos ingredientes' : ''}</p>
      <div class="grid" style="margin-top:10px">${list
        .map(
          (r) => `<a class="card" href="#receta-${r.id}">
            <div class="card-art" data-tipo="${r.tipo[0]}">${dish(r)}</div>
            <div class="card-body"><h3>${esc(r.nombre)}</h3>
              <span class="meta">${ui.tengo.length ? `Usa ${r._n} de lo que tienes` : `${r.min} min · ${TIPOS[r.tipo[0]].nombre}`}</span>
              <span class="meta">${badges(r)}</span></div>
            ${S.favorites.includes(r.id) ? `<span class="heart" aria-label="Favorita">${V.ui('corazon', 16)}</span>` : ''}
          </a>`
        )
        .join('')}</div>`;
  }
  function openTengo() {
    const draw = () => {
      const n = filteredRecipes().length;
      const groups = V.CATEGORIAS.filter((c) => c.id !== 'despensa')
        .map((c) => {
          const ids = Object.keys(ING).filter((id) => ING[id].cat === c.id && !ING[id].basico);
          return `<div class="field"><span class="label">${c.nombre}</span><div class="ing-grid">${ids
            .map((id) => `<button class="ing-pick" data-act="tengo-toggle" data-id="${id}" aria-pressed="${ui.tengo.includes(id)}">${V.icon(id, 44)}${esc(ING[id].nombre.replace(/ \(.*\)/, ''))}</button>`)
            .join('')}</div></div>`;
        })
        .join('');
      openSheet(`<div class="sheet-head"><div><span class="eyebrow">Recetas</span><h2 id="sheet-title">¿Qué tienes en casa?</h2>
          <p class="hint">Marca lo que tienes y te mostramos qué preparar.</p></div>
          <button class="icon-btn" data-act="close-sheet" aria-label="Cerrar">${V.ui('cerrar', 20)}</button></div>
        ${groups}
        <div class="btn-row sheet-foot">
          <button class="btn soft" data-act="tengo-clear">Limpiar</button>
          <button class="btn primary" data-act="close-sheet">Ver ${ui.tengo.length ? n : 'todas las'} recetas</button>
        </div>`);
    };
    sheetCtx = { kind: 'tengo', draw };
    draw();
  }

  /* ---------- Lista del mercado ---------- */
  function renderCompras() {
    const plan = getPlan(ui.shopWeek);
    const { groups, basicos } = V.shoppingList(plan.days);
    const checked = S.compras[ui.shopWeek] || [];
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    const done = groups.reduce((n, g) => n + g.items.filter((it) => checked.includes(it.id)).length, 0);
    const item = (it) => {
      const recs = it.recetas.slice(0, 2).join(', ') + (it.recetas.length > 2 ? ` y ${it.recetas.length - 2} más` : '');
      return `<li><label class="shop-item">
        <input type="checkbox" data-act="shop-check" data-id="${it.id}" ${checked.includes(it.id) ? 'checked' : ''}>
        <span class="ing-ico">${V.icon(it.id, 36)}</span>
        <span class="txt"><b>${esc(ING[it.id].nombre)}</b><small>${esc(recs)}</small></span>
        <span class="veces" aria-label="En ${it.veces} comidas">${it.veces}×</span>
      </label></li>`;
    };
    const cur = weekKey(today());
    const nxt = weekKey(V.addDays(today(), 7));
    view.innerHTML = `<div class="stack">
      <div><h1 class="view-title">Lista del mercado</h1><p class="view-sub">Todo lo del menú del ${fmtRange(ui.shopWeek)}.</p></div>
      <div class="seg" role="group" aria-label="Semana">
        <button data-act="shop-week" data-w="${cur}" aria-pressed="${ui.shopWeek === cur}">Esta semana</button>
        <button data-act="shop-week" data-w="${nxt}" aria-pressed="${ui.shopWeek === nxt}">La próxima</button>
      </div>
      <div><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}" aria-label="Avance de compras"><span style="width:${total ? (done / total) * 100 : 0}%"></span></div>
        <p class="hint" style="margin-top:6px">${done} de ${total} listos</p></div>
      <div class="btn-row">
        <button class="btn primary" data-act="share">${V.ui('compartir', 18)} Compartir</button>
        <button class="btn soft" data-act="shop-clear">Desmarcar todo</button>
      </div>
      ${groups.map((g) => `<section class="shop-group"><h2>${g.nombre}</h2><ul class="shop-list">${g.items.map(item).join('')}</ul></section>`).join('')}
      ${basicos.length ? `<section class="shop-group"><h2>Revisa que tengas en casa</h2><ul class="shop-list">${basicos.map(item).join('')}</ul></section>` : ''}
      <aside class="tip-card">${V.icon('pescado', 52)}<div><span class="eyebrow">Consejo</span><p>Compra el pescado, el hígado y la sangrecita frescos el día que los vas a cocinar, o congélalos en porciones pequeñas apenas llegues del mercado.</p></div></aside>
    </div>`;
  }
  function shareText() {
    const plan = getPlan(ui.shopWeek);
    const { groups, basicos } = V.shoppingList(plan.days);
    const checked = S.compras[ui.shopWeek] || [];
    let t = `Lista del mercado para ${nombre()} (${fmtRange(ui.shopWeek)})\n`;
    groups.forEach((g) => {
      const items = g.items.filter((it) => !checked.includes(it.id));
      if (!items.length) return;
      t += `\n${g.nombre}\n` + items.map((it) => `- ${ING[it.id].nombre}`).join('\n') + '\n';
    });
    if (basicos.length) t += `\nRevisar en casa\n` + basicos.map((it) => `- ${ING[it.id].nombre}`).join('\n') + '\n';
    return t;
  }
  function openShare() {
    const text = shareText();
    openSheet(`<div class="sheet-head"><div><span class="eyebrow">Lista del mercado</span><h2 id="sheet-title">Compartir lista</h2></div>
        <button class="icon-btn" data-act="close-sheet" aria-label="Cerrar">${V.ui('cerrar', 20)}</button></div>
      <textarea class="share-text" id="share-text" readonly aria-label="Texto de la lista">${esc(text)}</textarea>
      <div class="btn-row">
        ${navigator.share ? `<button class="btn primary" data-act="share-native">${V.ui('compartir', 18)} Compartir</button>` : ''}
        <a class="btn soft" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">Enviar por WhatsApp</a>
        <button class="btn soft" data-act="copy">Copiar texto</button>
      </div>`);
  }

  /* ---------- Guía ---------- */
  function renderGuia() {
    const m = edadMeses();
    const aviso =
      m !== null && m >= 24
        ? `<p class="hint">${esc(nombre())} ya tiene ${edadTexto()}: esta guía es para 12 a 23 meses. Consulta en su control CRED cómo seguir.</p>`
        : '';
    view.innerHTML = `<div class="stack">
      <div><h1 class="view-title">Guía para su edad</h1><p class="view-sub">Lo que recomiendan el MINSA y la OMS para niños de 12 a 23 meses.</p>${aviso}</div>
      <section class="block">
        <h2>El horario de ${esc(nombre())}</h2>
        <ul class="schedule">${TIEMPOS.map(
          (t) => `<li data-slot="${t.key}"><span class="time">${fmtHora(hora(t.key))}</span><span class="dot"></span><span><b>${t.nombre}</b>
            <small>${t.tipo === 'refrigerio' ? 'Porción pequeña: fruta y un lácteo' : '1 plato mediano, de 7 a 10 cucharadas'}</small></span></li>`
        ).join('')}
          <li><span class="time">Siempre</span><span class="dot" style="background:var(--ink-2)"></span><span><b>Lactancia materna</b><small>A libre demanda, también de noche</small></span></li>
        </ul>
        <p class="hint">Deja unas 2 a 3 horas entre comidas. Puedes mover los horarios según sus siestas en <a href="#ajustes">Ajustes</a>.</p>
      </section>
      ${V.GUIA.map(
        (g) => `<details class="acc"${g.abierto ? ' open' : ''}>
          <summary><span class="ing-ico">${V.icon(g.icon, 36)}</span><span>${esc(g.titulo)}</span><span class="chev">${V.ui('atras', 18).replace('<svg', '<svg style="transform:scaleX(-1)"')}</span></summary>
          <ul>${g.puntos.map((p) => `<li>${p}</li>`).join('')}</ul>
        </details>`
      ).join('')}
      <section class="block plain">
        <h2>Fuentes</h2>
        <ul class="sources">${V.FUENTES.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener">${esc(f.nombre)}</a></li>`).join('')}</ul>
        <p class="hint">Esta app es una ayuda práctica para el día a día y no reemplaza a su pediatra ni a su control CRED. Ante alergias, bajo peso, anemia o dudas, consulta en su centro de salud.</p>
      </section>
    </div>`;
  }

  /* ---------- Ajustes ---------- */
  function renderAjustes() {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    view.innerHTML = `<div class="stack">
      <div><h1 class="view-title">Ajustes</h1><p class="view-sub">Se guardan solo en este celular.</p></div>
      <section class="block">
        <h2>Datos del bebé</h2>
        <div class="field"><label for="f-nombre">Nombre</label><input class="input" id="f-nombre" data-set="nombre" value="${esc(S.settings.nombre)}" autocomplete="off"></div>
        <div class="field"><label for="f-nac">Fecha de nacimiento</label><input class="input" type="date" id="f-nac" data-set="nacimiento" value="${esc(S.settings.nacimiento)}"></div>
        <p class="hint">Con la fecha mostramos su edad en meses.</p>
      </section>
      <section class="block">
        <h2>Horarios de comida</h2>
        <div class="times">${TIEMPOS.map(
          (t) => `<div class="field" data-slot="${t.key}"><label class="label" for="h-${t.key}">${t.nombre}</label><input class="input" type="time" id="h-${t.key}" data-hora="${t.key}" value="${hora(t.key)}"></div>`
        ).join('')}</div>
        <button class="btn soft" data-act="horas-reset">Volver a los horarios sugeridos</button>
      </section>
      <section class="block">
        <h2>Alimentos que debe evitar</h2>
        <p class="hint">Si su pediatra indicó una alergia, márcala: esas recetas no aparecerán en su menú.</p>
        <div class="opt-checks">${Object.entries(V.ALERGENOS)
          .map(([k, a]) => `<label class="opt-check"><input type="checkbox" id="av-${k}" data-avoid="${k}" ${S.settings.avoid.includes(k) ? 'checked' : ''}>${a.nombre}</label>`)
          .join('')}</div>
      </section>
      <section class="block">
        <h2>Instalar en el celular</h2>
        ${standalone ? '<p>Ya estás usando la app instalada.</p>' : deferredInstall ? `<button class="btn primary" data-act="install">${V.ui('instalar', 18)} Instalar la app</button>` : ''}
        ${!standalone ? `<ol class="steps-install">${
          ios
            ? '<li>Abre esta página en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> (el cuadrado con la flecha).</li><li>Elige <b>Agregar a pantalla de inicio</b>.</li>'
            : '<li>Abre esta página en <b>Chrome</b>.</li><li>Toca el menú <b>⋮</b> arriba a la derecha.</li><li>Elige <b>Instalar app</b> o <b>Agregar a pantalla principal</b>.</li>'
        }</ol><p class="hint">Después la abres desde el ícono y funciona aun sin internet.</p>` : ''}
      </section>
      <section class="block">
        <h2>Empezar de cero</h2>
        <p class="hint">Borra menús, favoritas, lo que le gustó y la lista del mercado de este celular.</p>
        <button class="btn danger" data-act="reset">Borrar mis datos</button>
      </section>
    </div>`;
  }

  /* ---------- Hoja inferior ---------- */
  let sheetCtx = null;
  let lastFocus = null;
  function openSheet(html) {
    const sheet = $('#sheet');
    const panel = $('#sheet-panel');
    const wasOpen = !sheet.hidden;
    const scroll = panel.scrollTop;
    panel.innerHTML = html;
    if (!wasOpen) {
      lastFocus = document.activeElement;
      sheet.hidden = false;
      document.body.style.overflow = 'hidden';
      try {
        history.pushState({ sheet: 1 }, '');
      } catch (e) {
        /* sin historial */
      }
      const f = panel.querySelector('button, a, input');
      if (f) f.focus({ preventScroll: true });
    } else {
      panel.scrollTop = scroll;
    }
  }
  function closeSheet(fromHistory) {
    const sheet = $('#sheet');
    if (sheet.hidden) return;
    const kind = sheetCtx && sheetCtx.kind;
    sheet.hidden = true;
    document.body.style.overflow = '';
    sheetCtx = null;
    if (kind === 'tengo' && currentRoute === 'recetas') renderRecetas();
    if (!fromHistory && history.state && history.state.sheet) {
      try {
        history.back();
      } catch (e) {
        /* sin historial */
      }
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.addEventListener('popstate', () => closeSheet(true));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  /* ---------- Navegación ---------- */
  const TABS = [
    ['menu', 'Menú', 'menu'],
    ['recetas', 'Recetas', 'recetas'],
    ['compras', 'Compras', 'compras'],
    ['guia', 'Guía', 'guia'],
  ];
  $('#tabs').innerHTML = TABS.map(
    ([k, l, ic]) => `<a class="tab" href="#${k}" data-tab="${k}"><span class="pip">${V.ui(ic, 22)}</span>${l}</a>`
  ).join('');
  $('#btn-ajustes').innerHTML = V.ui('ajustes', 22);
  $('#brand-mark').innerHTML = LOGO;

  const scrollMemo = {};
  let currentRoute = '';
  let navDepth = 0;
  function route() {
    const h = decodeURIComponent(location.hash.slice(1)) || 'menu';
    if (currentRoute) scrollMemo[currentRoute] = window.scrollY;
    const sheet = $('#sheet');
    if (!sheet.hidden) {
      sheet.hidden = true;
      document.body.style.overflow = '';
      sheetCtx = null;
    }
    let tab = 'menu';
    if (h.startsWith('receta-')) {
      renderReceta(h.slice(7));
      tab = '';
    } else if (h === 'recetas') {
      renderRecetas();
      tab = 'recetas';
    } else if (h === 'compras') {
      renderCompras();
      tab = 'compras';
    } else if (h === 'guia') {
      renderGuia();
      tab = 'guia';
    } else if (h === 'ajustes') {
      renderAjustes();
      tab = '';
    } else {
      renderMenu();
    }
    document.querySelectorAll('.tab').forEach((a) => {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    renderHeader();
    const y = h.startsWith('receta-') ? 0 : scrollMemo[h] || 0;
    window.scrollTo(0, y);
    currentRoute = h;
  }
  function renderHeader() {
    $('#brand-name').textContent = `Recetas para ${nombre()}`;
    const d = today();
    $('#brand-sub').textContent = `${edadTexto()} · ${V.DIAS[V.dayIndex(d)]} ${fmtDay(d)}`;
    document.title = `Recetas para ${nombre()}`;
  }
  window.addEventListener('hashchange', () => {
    navDepth++;
    route();
  });

  /* ---------- Acciones ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    const plan = () => getPlan(ui.week);
    switch (act) {
      case 'welcomed':
        S.welcomed = true;
        save();
        renderMenu();
        break;
      case 'install':
        if (deferredInstall) {
          deferredInstall.prompt();
          deferredInstall.userChoice.finally(() => {
            deferredInstall = null;
            route();
          });
        }
        break;
      case 'install-hide':
        S.installHidden = true;
        save();
        renderMenu();
        break;
      case 'week': {
        const d = Number(el.dataset.d);
        ui.week = V.isoDate(V.addDays(V.parseDate(ui.week), 7 * d));
        ui.day = weekOffset() === 0 ? V.dayIndex(today()) : 0;
        renderMenu();
        break;
      }
      case 'day':
        ui.day = Number(el.dataset.i);
        renderMenu();
        break;
      case 'opciones':
        openOptions(el.dataset.slot);
        break;
      case 'pick': {
        setSlot(ui.week, ui.day, el.dataset.slot, el.dataset.id);
        closeSheet();
        renderMenu();
        toast(`Listo: ${BY_ID[el.dataset.id].nombre}`);
        break;
      }
      case 'pick-random': {
        const alts = V.alternatives(plan().days, ui.day, el.dataset.slot, prefs()).slice(0, 6);
        const a = alts[Math.floor(Math.random() * alts.length)];
        if (a) {
          setSlot(ui.week, ui.day, el.dataset.slot, a.r.id);
          closeSheet();
          renderMenu();
          toast(`Sorpresa: ${a.r.nombre}`);
        }
        break;
      }
      case 'regen':
        openSheet(`<div class="sheet-head"><div><span class="eyebrow">${fmtRange(ui.week)}</span><h2 id="sheet-title">¿Armar otro menú?</h2>
            <p class="hint">Se cambian todas las comidas de esta semana, también las que elegiste tú.</p></div></div>
          <div class="btn-row"><button class="btn soft" data-act="close-sheet">Cancelar</button><button class="btn primary" data-act="regen-ok">${V.ui('chispa', 18)} Sí, armar otro</button></div>`);
        break;
      case 'regen-ok': {
        const seed = (Math.random() * 2 ** 32) >>> 0;
        S.plans[ui.week] = { seed, days: V.generateWeek(seed, prefs()) };
        delete S.compras[ui.week];
        save();
        closeSheet();
        renderMenu();
        toast('Listo: menú nuevo para la semana');
        break;
      }
      case 'close-sheet':
        closeSheet();
        break;
      case 'back':
        if (navDepth > 0) history.back();
        else location.hash = '#recetas';
        break;
      case 'fav': {
        const id = el.dataset.id;
        const i = S.favorites.indexOf(id);
        if (i >= 0) S.favorites.splice(i, 1);
        else S.favorites.push(id);
        save();
        el.setAttribute('aria-pressed', String(i < 0));
        toast(i < 0 ? 'Guardada en favoritas' : 'Quitada de favoritas');
        break;
      }
      case 'tick':
        el.setAttribute('aria-pressed', String(el.getAttribute('aria-pressed') !== 'true'));
        break;
      case 'reac': {
        const { id, v } = el.dataset;
        if (S.reactions[id] === v) delete S.reactions[id];
        else S.reactions[id] = v;
        save();
        el.parentElement.querySelectorAll('.reac').forEach((b) => b.setAttribute('aria-pressed', String(S.reactions[id] === b.dataset.v)));
        $('#reac-hint').textContent = reacHint(S.reactions[id] || '');
        break;
      }
      case 'add':
        openAddToMenu(el.dataset.id);
        break;
      case 'add-week':
        sheetCtx.st.week = el.dataset.w;
        sheetCtx.draw();
        break;
      case 'add-day':
        sheetCtx.st.day = Number(el.dataset.i);
        sheetCtx.draw();
        break;
      case 'add-slot':
        sheetCtx.st.slot = el.dataset.k;
        sheetCtx.draw();
        break;
      case 'add-ok': {
        const { st, r } = sheetCtx;
        setSlot(st.week, st.day, st.slot, r.id);
        closeSheet();
        toast(`Listo: ${V.DIAS[st.day].toLowerCase()}, ${TIEMPOS.find((t) => t.key === st.slot).nombre.toLowerCase()}`);
        break;
      }
      case 'rf':
        ui.recFilter = el.dataset.k;
        renderRecetas();
        break;
      case 'rx': {
        const k = el.dataset.k;
        ui.recExtras = ui.recExtras.includes(k) ? ui.recExtras.filter((x) => x !== k) : ui.recExtras.concat(k);
        renderRecetas();
        break;
      }
      case 'clear-filters':
        ui.recFilter = 'todas';
        ui.recExtras = [];
        ui.recQuery = '';
        ui.tengo = [];
        renderRecetas();
        break;
      case 'tengo':
        openTengo();
        break;
      case 'tengo-toggle': {
        const id = el.dataset.id;
        ui.tengo = ui.tengo.includes(id) ? ui.tengo.filter((x) => x !== id) : ui.tengo.concat(id);
        sheetCtx.draw();
        break;
      }
      case 'tengo-clear':
        ui.tengo = [];
        sheetCtx.draw();
        break;
      case 'shop-week':
        ui.shopWeek = el.dataset.w;
        renderCompras();
        break;
      case 'shop-clear':
        delete S.compras[ui.shopWeek];
        save();
        renderCompras();
        break;
      case 'share':
        openShare();
        break;
      case 'share-native':
        navigator.share({ title: 'Lista del mercado', text: shareText() }).catch((err) => {
          if (!err || err.name !== 'AbortError') toast('Usa «Enviar por WhatsApp» o «Copiar texto»');
        });
        break;
      case 'copy': {
        const ta = $('#share-text');
        const done = () => toast('Lista copiada');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(ta.value).then(done, () => {
            ta.select();
            toast('Selecciona y copia el texto');
          });
        } else {
          ta.select();
          toast('Selecciona y copia el texto');
        }
        break;
      }
      case 'horas-reset':
        S.settings.horas = {};
        save();
        renderAjustes();
        toast('Horarios sugeridos de nuevo');
        break;
      case 'reset':
        openSheet(`<div class="sheet-head"><div><h2 id="sheet-title">¿Borrar todos tus datos?</h2>
            <p class="hint">Se borran menús, favoritas, reacciones, horarios y la lista del mercado de este celular. No se puede deshacer.</p></div></div>
          <div class="btn-row"><button class="btn soft" data-act="close-sheet">Cancelar</button><button class="btn danger" data-act="reset-ok">Sí, borrar</button></div>`);
        break;
      case 'reset-ok':
        S = fresh();
        save();
        closeSheet();
        ui.week = weekKey(today());
        ui.day = V.dayIndex(today());
        location.hash = '#menu';
        route();
        toast('Datos borrados');
        break;
    }
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'q') {
      ui.recQuery = el.value;
      renderRecResults();
    }
  });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.act === 'shop-check') {
      const list = S.compras[ui.shopWeek] || (S.compras[ui.shopWeek] = []);
      const i = list.indexOf(el.dataset.id);
      if (el.checked && i < 0) list.push(el.dataset.id);
      if (!el.checked && i >= 0) list.splice(i, 1);
      save();
      renderCompras();
      return;
    }
    if (el.dataset.set) {
      S.settings[el.dataset.set] = el.value;
      save();
      renderHeader();
      toast('Guardado');
      return;
    }
    if (el.dataset.hora) {
      if (el.value) S.settings.horas[el.dataset.hora] = el.value;
      save();
      toast('Horario guardado');
      return;
    }
    if (el.dataset.avoid) {
      const k = el.dataset.avoid;
      S.settings.avoid = el.checked ? S.settings.avoid.concat(k) : S.settings.avoid.filter((x) => x !== k);
      Object.values(S.plans).forEach((p) => sanitize(p));
      save();
      toast(el.checked ? 'Lo quitamos de sus menús' : 'Listo');
    }
  });

  /* ---------- Instalación y modo sin internet ---------- */
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
    if (currentRoute === 'menu' || currentRoute === 'ajustes') route();
  });
  if ('serviceWorker' in navigator && !window.VASCO_ARTIFACT && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  route();
})();
