/* Recetas para la familia: vistas, navegación y datos guardados en el teléfono. */
(function () {
  'use strict';
  const V = window.VASCO;
  const { ING, BY_ID } = V;
  const $ = (s, el) => (el || document).querySelector(s);
  const view = $('#view');

  // Olla de barro familiar con la franja de awayo
  const LOGO =
    '<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#E8632B"/>' +
    '<rect y="100" width="120" height="6" fill="#F4B63F"/><rect y="106" width="120" height="5" fill="#4E9A3A"/><rect y="111" width="120" height="9" fill="#7B4FA8"/>' +
    '<path d="M46 16c-5 6 5 9 0 16M60 12c-5 6 5 9 0 16M74 16c-5 6 5 9 0 16" stroke="#FFE2CF" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
    '<path d="M27 54c2-17 64-17 66 0z" fill="#F6D477"/><circle cx="44" cy="46" r="2.4" fill="#FCEBC0"/><circle cx="58" cy="42" r="2.4" fill="#FCEBC0"/><circle cx="70" cy="45" r="2.4" fill="#FCEBC0"/>' +
    '<circle cx="47" cy="47" r="7" fill="#F57C1F"/><circle cx="47" cy="47" r="4" fill="#F9B867"/>' +
    '<path d="M62 47c4-10 16-12 22-8-4 8-14 12-22 8z" fill="#4E9A3A"/>' +
    '<rect x="8" y="60" width="16" height="9" rx="4.5" fill="#7A2E1A"/><rect x="96" y="60" width="16" height="9" rx="4.5" fill="#7A2E1A"/>' +
    '<path d="M22 58h76v14c0 14-12 25-27 25H49c-15 0-27-11-27-25z" fill="#B5502E"/>' +
    '<rect x="18" y="53" width="84" height="9" rx="4.5" fill="#8E3A22"/>' +
    '<path d="M46 74q3.5-3.5 7 0M67 74q3.5-3.5 7 0M53 82q7 6 14 0" stroke="#FFE2CF" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
    '<circle cx="41" cy="81" r="3.4" fill="#F7A1A1"/><circle cx="79" cy="81" r="3.4" fill="#F7A1A1"/></svg>';

  /* ---------- Datos guardados en este teléfono ---------- */
  const KEY = 'vasco.v1';
  const fresh = () => ({
    settings: { nombre: 'Vasco', nacimiento: '', horas: {}, avoid: [] },
    papas: { horas: {}, avoid: [] },
    perfil: 'vasco',
    plans: {},
    plansP: {},
    favorites: [],
    reactions: {},
    compras: {},
    extras: [],
    refri: [],
    basicos: null,
    refriPara: 'papas',
    welcomed: false,
    novedades2: false,
    installHidden: false,
  });
  let S = load();
  function load() {
    const base = fresh();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return base;
      const d = JSON.parse(raw);
      return Object.assign(base, d, {
        settings: Object.assign(base.settings, d.settings || {}),
        papas: Object.assign(base.papas, d.papas || {}),
      });
    } catch (e) {
      return base;
    }
  }
  let storageWarned = false;
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch (e) {
      // Sin espacio (o sin permiso): la app sigue funcionando, pero avisamos una vez
      if (!storageWarned) {
        storageWarned = true;
        setTimeout(() => toast('El celular no tiene espacio: tus cambios no se guardarán'), 0);
      }
    }
  }

  /* ---------- Perfiles ---------- */
  const PF = (pid) => V.PERFILES[pid];
  const otro = (pid) => (pid === 'vasco' ? 'papas' : 'vasco');
  const avoidDe = (pid) => (pid === 'vasco' ? S.settings.avoid : S.papas.avoid);
  const prefsDe = (pid) => ({ favorites: S.favorites, reactions: S.reactions, avoid: avoidDe(pid) });
  const horasDe = (pid) => (pid === 'vasco' ? S.settings.horas : S.papas.horas);
  const hora = (pid, key) => horasDe(pid)[key] || PF(pid).tiempos.find((t) => t.key === key).hora;
  const plansDe = (pid) => (pid === 'vasco' ? S.plans : S.plansP);
  const nombre = () => (S.settings.nombre || 'Vasco').trim() || 'Vasco';
  const quienTxt = (pid) => (pid === 'vasco' ? nombre() : 'Papás');
  const basicos = () => S.basicos || V.BASICOS_DEFAULT.slice();

  /* ---------- Instalación ---------- */
  // La dirección distingue mayúsculas: en minúsculas GitHub muestra "Site not found"
  const APP_URL = /\.github\.io$/.test(location.hostname)
    ? location.origin + location.pathname
    : 'https://renzomoran9.github.io/RECETAS-PARA-VASCO/';
  const UA = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(UA);
  const isStandalone = () =>
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  // Navegadores dentro de otras apps (WhatsApp, Facebook, Instagram…): ahí no se puede instalar
  const inAppBrowser = () => /; wv\)|FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|Messenger|TikTok|Snapchat|GSA\//i.test(UA);
  const linkBox = () =>
    `<div class="link-box"><code>${APP_URL}</code><button class="btn soft" data-act="copy-link">Copiar enlace</button></div>`;
  const chev = () => V.ui('atras', 18).replace('<svg', '<svg style="transform:scaleX(-1)"');
  function installHelp() {
    return `<details class="acc help">
      <summary><span class="ing-ico">${V.icon('agua', 32)}</span><span>¿Sale «No se pudo abrir la aplicación»?</span><span class="chev">${chev()}</span></summary>
      <ul>
        <li><b>Ábrela directo en ${isIOS ? 'Safari' : 'Chrome'}</b>, no desde WhatsApp, Facebook ni la app de Claude. Copia el enlace y pégalo en la barra de direcciones. Escríbelo tal cual, con mayúsculas.</li>
        <li><b>Si ya la habías instalado</b>, mantén presionado el ícono, elige <b>Desinstalar</b> o <b>Quitar</b>, y vuelve a instalarla.</li>
        <li><b>Revisa el espacio libre.</b> La app pesa menos de 400 KB, pero si el celular está casi lleno no puede instalar nada. Libera espacio (videos de WhatsApp, fotos ya respaldadas, apps que no usas) y vuelve a intentar.</li>
        ${isIOS ? '' : '<li><b>En Xiaomi, Redmi o POCO:</b> Ajustes → Aplicaciones → Chrome → Permisos → activa <b>Accesos directos en la pantalla de inicio</b>. Luego instala otra vez.</li>'}
        ${isIOS ? '' : '<li><b>Plan B que siempre funciona:</b> en Chrome toca <b>⋮</b> → <b>Agregar a la pantalla principal</b> → <b>Crear acceso directo</b>. Queda el ícono y se abre en Chrome.</li>'}
      </ul>
    </details>`;
  }

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
  // «Ají amarillo (fresco o en pasta)» → «ají amarillo»
  const corto = (id) => {
    const n = ING[id].nombre.replace(/ \(.*\)/, '');
    return n.charAt(0).toLowerCase() + n.slice(1);
  };
  const enLista = (arr) => (arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' y ' + arr[arr.length - 1]);
  function edadMeses() {
    if (!S.settings.nacimiento) return null;
    const b = V.parseDate(S.settings.nacimiento);
    const n = today();
    let m = (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth());
    if (n.getDate() < b.getDate()) m--;
    return m;
  }
  function edadTexto() {
    const m = edadMeses();
    if (m === null) return '1 año';
    if (m < 0) return 'recién nacido';
    if (m < 24) return `${m} meses`;
    return `${Math.floor(m / 12)} años`;
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
    if (r.perfil === 'papas' && r.menestra) out.push('<span class="badge">Menestras</span>');
    if (S.reactions[r.id] === 'love') out.push(`<span class="badge love">${r.perfil === 'vasco' ? 'Le encantó' : 'Les encantó'}</span>`);
    if (S.favorites.includes(r.id)) out.push('<span class="badge fav">Favorita</span>');
    return out.concat(extra || []).join('');
  }
  const ollaBadge = (r) =>
    `<span class="badge olla">${r.perfil === 'papas' ? 'Misma olla que ' + esc(nombre()) : 'Misma olla que los papás'}</span>`;

  /* ---------- Menú semanal ---------- */
  const ui = {
    week: weekKey(today()),
    day: V.dayIndex(today()),
    recFilter: 'todas',
    recExtras: [],
    recQuery: '',
    shopWeek: weekKey(today()),
    shopFor: 'familia',
    refriMas: { listos: false, casi: false },
  };
  const weekOffset = () => Math.round((V.parseDate(ui.week) - V.mondayOf(today())) / (7 * 864e5));

  function sanitize(pid, plan, week) {
    const P = PF(pid);
    let changed = false;
    plan.days.forEach((d, i) => {
      P.tiempos.forEach((t) => {
        const r = BY_ID[d[t.key]];
        const bad = !r || r.perfil !== pid || !r.tipo.includes(t.tipo) || r.alergenos.some((a) => avoidDe(pid).includes(a));
        if (bad) {
          const alt = V.alternatives(P, plan.days, i, t.key, prefsDe(pid))[0];
          if (alt) {
            d[t.key] = alt.r.id;
            changed = true;
          }
        }
      });
    });
    return changed;
  }
  function getPlan(pid, key) {
    const store = plansDe(pid);
    let p = store[key];
    if (!p || !Array.isArray(p.days) || p.days.length !== 7) {
      // La semilla de Vasco no cambia: su menú sigue igual tras la actualización
      const seed = V.seedFrom(pid === 'vasco' ? key : 'papas-' + key);
      const link = pid === 'papas' ? getPlan('vasco', key).days : null;
      p = { seed, days: V.generateWeek(PF(pid), seed, prefsDe(pid), link) };
      store[key] = p;
      const keys = Object.keys(store).sort();
      while (keys.length > 8) delete store[keys.shift()];
      save();
    }
    if (sanitize(pid, p, key)) save();
    return p;
  }
  const linkDe = (pid, week) => getPlan(otro(pid), week).days;

  function nextSlotKey(pid) {
    const now = today();
    const mins = now.getHours() * 60 + now.getMinutes();
    const t = PF(pid).tiempos.find((t) => toMin(hora(pid, t.key)) + 45 > mins);
    return t ? t.key : null;
  }

  function perfilSwitch() {
    const it = (pid, titulo, sub) =>
      `<button class="perfil" role="tab" data-act="perfil" data-p="${pid}" aria-selected="${S.perfil === pid}">
        <span class="avatar">${V.AVATAR[pid]}</span><span class="perfil-txt"><b>${titulo}</b><small>${sub}</small></span></button>`;
    return `<div class="perfiles" role="tablist" aria-label="¿Para quién?">${it('vasco', esc(nombre()), edadTexto())}${it('papas', 'Papás', 'Mamá y papá')}</div>`;
  }

  function avisos() {
    if (inAppBrowser() && !isStandalone()) {
      return `<section class="notice"><h2>Ábrela en ${isIOS ? 'Safari' : 'Chrome'} para instalarla</h2>
        <p>Estás viendo la app dentro de otra aplicación, y desde aquí no se puede instalar. Copia el enlace y pégalo en ${isIOS ? 'Safari' : 'Chrome'}.</p>${linkBox()}</section>`;
    }
    if (!S.welcomed) {
      return `<section class="notice" aria-labelledby="hola">
        <div class="foods">${['quinua', 'zapallo', 'pescado', 'palta', 'mandarina'].map((id) => V.icon(id, 40)).join('')}</div>
        <h2 id="hola">¡Hola! Esta es la cocina de la familia</h2>
        <p>Arriba eliges de quién es el menú: <b>${esc(nombre())}</b> o los <b>papás</b>. Cada semana se arma un menú nuevo, y en cada comida puedes tocar <b>Ver otras opciones</b>. En <b>Mi refri</b> marcas lo que tienes y te digo qué cocinar.</p>
        <div class="btn-row"><button class="btn primary" data-act="welcomed">Entendido</button><a class="btn soft" href="#refri">Probar Mi refri</a></div>
      </section>`;
    }
    if (!S.novedades2) {
      return `<section class="notice" aria-labelledby="nuevo">
        <div class="foods">${V.AVATAR.vasco.replace('<svg', '<svg class="mini-av"')}${V.AVATAR.papas.replace('<svg', '<svg class="mini-av"')}${V.icon('lechuga', 40)}${V.icon('pollo', 40)}</div>
        <h2 id="nuevo">Ahora es «Recetas para la familia»</h2>
        <p>Además del menú de ${esc(nombre())}, hay <b>menú y recetas para los papás</b>, la pestaña <b>Mi refri</b> para saber qué cocinar con lo que tienen, y la lista del mercado junta <b>toda la familia</b>. El menú de ${esc(nombre())} sigue igual.</p>
        <div class="btn-row"><button class="btn primary" data-act="novedades" data-p="papas">Ver el menú de los papás</button><button class="btn soft" data-act="novedades">Entendido</button></div>
      </section>`;
    }
    if (deferredInstall && !S.installHidden) {
      return `<section class="notice"><h2>Instala la app en este celular</h2><p>Así la abres desde la pantalla de inicio, como cualquier app, y funciona sin internet.</p>
        <div class="btn-row"><button class="btn primary" data-act="install">${V.ui('instalar', 18)} Instalar</button><button class="btn soft" data-act="install-hide">Ahora no</button></div></section>`;
    }
    return '';
  }

  function renderMenu() {
    const pid = S.perfil;
    const P = PF(pid);
    const plan = getPlan(pid, ui.week);
    const link = linkDe(pid, ui.week);
    const monday = V.parseDate(ui.week);
    const off = weekOffset();
    const todayIso = V.isoDate(today());
    const date = V.addDays(monday, ui.day);
    const isToday = V.isoDate(date) === todayIso;
    const day = plan.days[ui.day];
    const sum = V.daySummary(P, day);
    const nextKey = isToday ? nextSlotKey(pid) : null;
    const weekLabel = off === 0 ? 'Esta semana' : off === 1 ? 'La próxima semana' : off === -1 ? 'La semana pasada' : 'Semana';

    const base =
      pid === 'vasco'
        ? [['hierro', 'Hierro'], ['fruta', 'Fruta'], ['verdura', 'Verduras'], ['lacteo', 'Lácteo']]
        : [['verdura', 'Verduras'], ['fruta', 'Fruta'], ['proteina', 'Proteína']];
    const extra = [['pescado', 'Pescado'], ['menestra', 'Menestras']].concat(pid === 'papas' ? [['hierro', 'Hierro']] : []);
    const checks = base
      .map(([k, l]) => `<span class="check ${sum[k] ? 'on' : 'off'}">${V.ui('check', 16)}${l}</span>`)
      .concat(extra.filter(([k]) => sum[k]).map(([, l]) => `<span class="check on">${V.ui('check', 16)}${l}</span>`))
      .join('');

    const slots = P.tiempos
      .map((t) => {
        const r = BY_ID[day[t.key]];
        if (!r) return '';
        const next = t.key === nextKey;
        const reac = S.reactions[r.id];
        const olla = V.mismaOlla(r, link[ui.day]) ? ollaBadge(r) : '';
        return `<li class="slot" data-slot="${t.key}">
        <div class="slot-time"><span class="time">${fmtHora(hora(pid, t.key))}</span><span class="dot"></span><span class="rail"></span></div>
        <article class="slot-card${next ? ' is-next' : ''}">
          <a class="slot-main" href="#receta-${r.id}">
            <div class="slot-art" data-tipo="${t.tipo}">${dish(r)}</div>
            <div class="slot-body">
              <span class="slot-label">${t.nombre}${next ? '<em>Ahora toca</em>' : ''}</span>
              <h3>${esc(r.nombre)}</h3>
              <span class="meta">${r.min} min ${olla}${badges(r)}</span>
            </div>
          </a>
          <div class="slot-actions">
            <button class="chip-btn" data-act="opciones" data-slot="${t.key}">${V.ui('cambiar', 16)}Ver otras opciones</button>
            ${reac === 'no' ? `<span class="reac-mini">${pid === 'vasco' ? 'La última vez no quiso' : 'No les gustó'}</span>` : ''}
          </div>
        </article>
      </li>`;
      })
      .join('');

    const dayChips = V.DIAS_CORTOS.map((d, i) => {
      const dt = V.addDays(monday, i);
      const cls = V.isoDate(dt) === todayIso ? ' is-today' : '';
      return `<button class="day-chip${cls}" role="tab" aria-selected="${i === ui.day}" aria-label="${V.DIAS[i]} ${fmtDay(dt)}" data-act="day" data-i="${i}"><span>${d}</span><b>${dt.getDate()}</b></button>`;
    }).join('');

    const tips = pid === 'vasco' ? V.TIPS : V.TIPS_PAPAS;
    const tip = tips[V.seedFrom(V.isoDate(date)) % tips.length];

    view.innerHTML = `<div class="stack">
      ${perfilSwitch()}
      ${avisos()}
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
      <aside class="tip-card">${V.icon(pid === 'vasco' ? 'palta' : 'lechuga', 52)}<div><span class="eyebrow">Consejo del día</span><p>${esc(tip)}</p></div></aside>
      <button class="btn ghost wide" data-act="regen">${V.ui('chispa', 18)} Armar otro menú para esta semana</button>
    </div>`;
  }

  function openOptions(slotKey) {
    const pid = S.perfil;
    const P = PF(pid);
    const plan = getPlan(pid, ui.week);
    const link = linkDe(pid, ui.week);
    const t = P.tiempos.find((x) => x.key === slotKey);
    const alts = V.alternatives(P, plan.days, ui.day, slotKey, prefsDe(pid), link);
    const current = BY_ID[plan.days[ui.day][slotKey]];
    const items = alts
      .map((a) => {
        const extra = [];
        if (a.olla) extra.push(ollaBadge(a.r));
        if (a.sugerida) extra.push('<span class="badge love">Aporta el hierro del día</span>');
        if (a.enSemana) extra.push('<span class="badge">Ya está esta semana</span>');
        if (S.reactions[a.r.id] === 'no') extra.push(`<span class="badge">${pid === 'vasco' ? 'No quiso la última vez' : 'No les gustó'}</span>`);
        return `<li><button class="opt" data-act="pick" data-slot="${slotKey}" data-id="${a.r.id}">
          <span class="opt-art" data-tipo="${t.tipo}">${dish(a.r)}</span>
          <span class="opt-body"><b>${esc(a.r.nombre)}</b><span class="meta">${a.r.min} min ${badges(a.r, extra)}</span></span>
        </button></li>`;
      })
      .join('');
    openSheet(`<div class="sheet-head"><div><span class="eyebrow">${V.DIAS[ui.day]} · ${t.nombre} · ${esc(quienTxt(pid))}</span><h2 id="sheet-title">Elige otra opción</h2>
        <p class="hint">Ahora: ${esc(current ? current.nombre : '')}</p></div>
        <button class="icon-btn" data-act="close-sheet" aria-label="Cerrar">${V.ui('cerrar', 20)}</button></div>
      <button class="btn primary wide" data-act="pick-random" data-slot="${slotKey}">${V.ui('dado', 18)} Sorpréndeme</button>
      <ul class="opt-list">${items}</ul>`);
  }

  function setSlot(pid, weekIso, dayIdx, slotKey, id) {
    const plan = getPlan(pid, weekIso);
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
    const pid = r.perfil;
    const P = PF(pid);
    const esVasco = pid === 'vasco';
    const tipo = r.tipo[0];
    const porcion = esVasco
      ? tipo === 'refrigerio'
        ? 'Porción pequeña'
        : '1 plato mediano (7 a 10 cucharadas)'
      : `Para ${r.porciones || 2} personas`;
    const fav = S.favorites.includes(r.id);
    const reac = S.reactions[r.id] || '';
    const alerg = r.alergenos.map((a) => V.ALERGENOS[a].nombre.toLowerCase());
    const main = r.tipo.includes('almuerzo') || r.tipo.includes('cena');
    const enRefri = new Set(S.refri);
    const par = esVasco ? BY_ID[V.ADULTO_DE[r.id]] : BY_ID[r.vasco];
    const familia = esVasco
      ? main || par
        ? `<section class="block plain"><h2>Para toda la familia</h2><p>Puedes cocinar la misma olla para todos: separa la porción de ${esc(nombre())} antes de agregar sal, ají o sillao.</p>
           ${par ? `<a class="link-row" href="#receta-${par.id}">${V.AVATAR.papas.replace('<svg', '<svg class="mini-av"')}<span>Receta de los papás: <b>${esc(par.nombre)}</b></span></a>` : ''}</section>`
        : ''
      : par
      ? `<section class="block plain"><h2>Para ${esc(nombre())}</h2><p>Esta olla también sirve para ${esc(nombre())}: separa su porción antes de la sal, el ají y el sillao, y sigue su receta para la textura y la cantidad.</p>
           <a class="link-row" href="#receta-${par.id}">${V.AVATAR.vasco.replace('<svg', '<svg class="mini-av"')}<span>Versión para ${esc(nombre())}: <b>${esc(par.nombre)}</b></span></a></section>`
      : '';
    view.innerHTML = `<article class="detail" data-tipo="${tipo}">
      <div class="detail-bar">
        <button class="icon-btn" data-act="back" aria-label="Volver">${V.ui('atras', 22)}</button>
        <button class="icon-btn fav" data-act="fav" data-id="${r.id}" aria-pressed="${fav}" aria-label="Guardar en favoritas">${V.ui('corazon', 22)}</button>
      </div>
      <div class="detail-art">${dish(r)}</div>
      <header class="detail-head">
        <div class="tags"><span class="who ${pid}">${esc(quienTxt(pid))}</span>${r.tipo.map((t) => `<span class="tag" data-tipo="${t}">${P.tipos[t].nombre}</span>`).join('')}</div>
        <h1>${esc(r.nombre)}</h1>
        <p class="meta">${V.ui('reloj', 16)} ${r.min} min · ${porcion}</p>
      </header>
      <section class="block">
        <h2>${esVasco ? 'Por qué le hace bien' : 'Por qué les hace bien'}</h2>
        <ul class="nutr-list">${r.nutr.map((n) => `<li><span><b>${P.nutrientes[n].nombre}</b>${P.nutrientes[n].para}</span></li>`).join('')}</ul>
      </section>
      <section class="block">
        <h2>Ingredientes</h2>
        <p class="hint">${esVasco ? `Para una porción de ${esc(nombre())}.` : 'Para 2 personas.'} Toca cada uno cuando lo tengas listo.</p>
        <ul class="ing-list">${r.ing
          .map(
            ([iid, q, nota]) => `<li><button class="ing" data-act="tick" aria-pressed="false">
              <span class="ing-ico">${V.icon(iid, 40)}</span>
              <span class="ing-txt"><b>${esc(ING[iid].nombre)}${enRefri.has(iid) ? ' <span class="en-refri">En tu refri</span>' : ''}</b><span>${esc(q)}${nota ? ' · ' + esc(nota) : ''}</span></span>
              <span class="tick">${V.ui('check', 16)}</span></button></li>`
          )
          .join('')}</ul>
        <button class="btn soft" data-act="receta-lista" data-id="${r.id}">${V.ui('canasta', 18)} Agregar lo que falta a la lista</button>
      </section>
      <section class="block">
        <h2>Preparación</h2>
        <ol class="steps">${r.pasos.map((p) => `<li><span>${esc(p)}</span></li>`).join('')}</ol>
      </section>
      <section class="block note">
        <h2>${esVasco ? 'Para su desarrollo' : 'Consejo'}</h2>
        <p>${esc(r.tip)}</p>
      </section>
      ${familia}
      ${alerg.length ? `<p class="hint">Contiene ${alerg.join(', ')}. Si hay alguna alergia, márcala en Ajustes y esta receta no aparecerá en el menú.</p>` : ''}
      <section class="block">
        <h2>${esVasco ? `¿Le gustó a ${esc(nombre())}?` : '¿Les gustó?'}</h2>
        <div class="reactions">
          <button class="reac" data-act="reac" data-id="${r.id}" data-v="love" aria-pressed="${reac === 'love'}"><span class="face" aria-hidden="true">😋</span>${esVasco ? 'Le encantó' : 'Nos encantó'}</button>
          <button class="reac" data-act="reac" data-id="${r.id}" data-v="meh" aria-pressed="${reac === 'meh'}"><span class="face" aria-hidden="true">🙂</span>Más o menos</button>
          <button class="reac" data-act="reac" data-id="${r.id}" data-v="no" aria-pressed="${reac === 'no'}"><span class="face" aria-hidden="true">🙅</span>${esVasco ? 'No quiso' : 'No nos gustó'}</button>
        </div>
        <p class="hint" id="reac-hint">${reacHint(pid, reac)}</p>
      </section>
      <button class="btn primary wide" data-act="add" data-id="${r.id}">${V.ui('mas', 20)} Poner en el menú</button>
    </article>`;
  }
  function reacHint(pid, v) {
    if (pid === 'papas') {
      if (v === 'love') return 'Aparecerá más seguido en su menú.';
      if (v === 'no') return 'Anotado: aparecerá mucho menos.';
      if (v === 'meh') return 'Anotado.';
      return 'Tu respuesta ayuda a armar mejores menús.';
    }
    if (v === 'love') return 'Aparecerá más seguido en sus menús.';
    if (v === 'no') return 'Es normal: a veces necesita probar un alimento 8 a 10 veces. Aparecerá menos, pero volverá de vez en cuando.';
    if (v === 'meh') return 'Anotado. Puedes probar cambiando la textura o acompañándolo con algo que le guste.';
    return 'Tu respuesta ayuda a armar mejores menús.';
  }

  function openAddToMenu(id) {
    const r = BY_ID[id];
    const pid = r.perfil;
    const P = PF(pid);
    const keys = P.tiempos.filter((t) => r.tipo.includes(t.tipo)).map((t) => t.key);
    const st = { week: weekKey(today()), day: V.dayIndex(today()), slot: keys[0] };
    const nombreSlot = (k) => P.tiempos.find((t) => t.key === k).nombre;
    const draw = () => {
      const monday = V.parseDate(st.week);
      openSheet(`<div class="sheet-head"><div><span class="eyebrow">Poner en el menú de ${pid === 'vasco' ? esc(nombre()) : 'los papás'}</span><h2 id="sheet-title">${esc(r.nombre)}</h2></div>
          <button class="icon-btn" data-act="close-sheet" aria-label="Cerrar">${V.ui('cerrar', 20)}</button></div>
        <div class="seg" role="group" aria-label="Semana">
          <button data-act="add-week" data-w="${weekKey(today())}" aria-pressed="${st.week === weekKey(today())}">Esta semana</button>
          <button data-act="add-week" data-w="${weekKey(V.addDays(today(), 7))}" aria-pressed="${st.week !== weekKey(today())}">La próxima</button>
        </div>
        <div class="field"><span class="label">Día</span><div class="daypick">${V.DIAS_CORTOS.map(
          (d, i) => `<button data-act="add-day" data-i="${i}" aria-pressed="${st.day === i}" aria-label="${V.DIAS[i]} ${fmtDay(V.addDays(monday, i))}">${d}<br><small>${V.addDays(monday, i).getDate()}</small></button>`
        ).join('')}</div></div>
        ${keys.length > 1 ? `<div class="field"><span class="label">Comida</span><div class="slotpick">${keys
          .map((k) => `<button data-act="add-slot" data-k="${k}" aria-pressed="${st.slot === k}">${nombreSlot(k)}</button>`)
          .join('')}</div></div>` : ''}
        <button class="btn primary wide" data-act="add-ok">${V.ui('check', 18)} Poner el ${V.DIAS[st.day].toLowerCase()} en ${nombreSlot(st.slot).toLowerCase()}</button>`);
    };
    sheetCtx = { kind: 'add', st, draw, r, nombreSlot };
    draw();
  }

  /* ---------- Recetario ---------- */
  function recExtrasDe(pid) {
    return pid === 'vasco'
      ? [['hierro', 'Ricas en hierro'], ['pescado', 'Con pescado'], ['rapidas', 'Listas en 15 min']]
      : [['pocos', 'Pocos ingredientes'], ['rapidas', 'Listas en 20 min'], ['pescado', 'Con pescado'], ['menestras', 'Con menestras'], ['olla', `También para ${nombre()}`]];
  }
  function renderRecetas() {
    const pid = S.perfil;
    const P = PF(pid);
    const tipos = [['todas', 'Todas']].concat(Object.entries(P.tipos).map(([k, t]) => [k, t.plural])).concat([['favoritas', 'Favoritas']]);
    if (!tipos.some(([k]) => k === ui.recFilter)) ui.recFilter = 'todas';
    const extras = recExtrasDe(pid);
    ui.recExtras = ui.recExtras.filter((k) => extras.some(([x]) => x === k));
    view.innerHTML = `<div class="stack">
      ${perfilSwitch()}
      <div><h1 class="view-title">${pid === 'vasco' ? 'Recetas de ' + esc(nombre()) : 'Recetas para los papás'}</h1>
        <p class="view-sub">${P.recetas.length} recetas ${pid === 'vasco' ? 'peruanas, sin sal ni azúcar.' : 'fáciles, con ingredientes de mercado, para 2 personas.'}</p></div>
      <label class="search">${V.ui('buscar', 20)}<span class="sr-only">Buscar</span>
        <input id="q" type="search" placeholder="Busca: quinua, pescado, pollo…" value="${esc(ui.recQuery)}" autocomplete="off" enterkeyhint="search"></label>
      <div class="filters" role="group" aria-label="Tipo de comida">${tipos
        .map(([k, l]) => `<button class="filter" data-act="rf" data-k="${k}" aria-pressed="${ui.recFilter === k}">${k === 'favoritas' ? V.ui('corazon', 16) : ''}${l}</button>`)
        .join('')}</div>
      <div class="filters" role="group" aria-label="Filtros">
        <a class="filter" href="#refri">${V.ui('refri', 16)}¿Qué cocino con lo que tengo?</a>
        ${extras.map(([k, l]) => `<button class="filter" data-act="rx" data-k="${k}" aria-pressed="${ui.recExtras.includes(k)}">${esc(l)}</button>`).join('')}
      </div>
      <div id="rec-results"></div>
    </div>`;
    renderRecResults();
  }
  const noBasicos = (r) => r.ing.filter((i) => !ING[i[0]].basico && !V.esOpcional(i)).length;
  function filteredRecipes() {
    const pid = S.perfil;
    const q = norm(ui.recQuery.trim());
    return PF(pid).recetas.filter((r) => {
      if (ui.recFilter === 'favoritas' && !S.favorites.includes(r.id)) return false;
      if (!['todas', 'favoritas'].includes(ui.recFilter) && !r.tipo.includes(ui.recFilter)) return false;
      if (ui.recExtras.includes('hierro') && !r.hierroAnimal) return false;
      if (ui.recExtras.includes('pescado') && !r.pescado) return false;
      if (ui.recExtras.includes('menestras') && !r.menestra) return false;
      if (ui.recExtras.includes('rapidas') && r.min > (pid === 'vasco' ? 15 : 20)) return false;
      if (ui.recExtras.includes('pocos') && noBasicos(r) > 5) return false;
      if (ui.recExtras.includes('olla') && !r.vasco) return false;
      if (q) {
        const hay = norm(r.nombre + ' ' + r.ing.map(([id]) => ING[id].nombre).join(' '));
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }
  function renderRecResults() {
    const box = $('#rec-results');
    if (!box) return;
    const P = PF(S.perfil);
    const list = filteredRecipes();
    if (!list.length) {
      box.innerHTML = `<div class="empty">${V.icon('quinua', 64)}<p>${ui.recFilter === 'favoritas' && !S.favorites.length ? 'Aún no tienes favoritas. Toca el corazón en una receta para guardarla aquí.' : 'No hay recetas con esos filtros.'}</p>
        <button class="btn soft" data-act="clear-filters">Quitar filtros</button></div>`;
      return;
    }
    box.innerHTML = `<p class="count">${list.length} ${list.length === 1 ? 'receta' : 'recetas'}</p>
      <div class="grid" style="margin-top:10px">${list
        .map(
          (r) => `<a class="card" href="#receta-${r.id}">
            <div class="card-art" data-tipo="${r.tipo[0]}">${dish(r)}</div>
            <div class="card-body"><h3>${esc(r.nombre)}</h3>
              <span class="meta">${r.min} min · ${P.tipos[r.tipo[0]].nombre}${r.perfil === 'papas' ? ` · ${noBasicos(r)} ingredientes` : ''}</span>
              <span class="meta">${r.vasco ? `<span class="badge olla">También para ${esc(nombre())}</span>` : ''}${badges(r)}</span></div>
            ${S.favorites.includes(r.id) ? `<span class="heart" aria-label="Favorita">${V.ui('corazon', 16)}</span>` : ''}
          </a>`
        )
        .join('')}</div>`;
  }

  /* ---------- Mi refri ---------- */
  const EJEMPLOS = [
    ['pollo', 'papa', 'tomate'],
    ['huevo', 'espinaca', 'queso'],
    ['pescado', 'camote', 'lechuga'],
    ['lentejas', 'zanahoria', 'tomate'],
  ];
  function renderRefri() {
    const para = S.refriPara;
    const bas = basicos();
    const basIds = Object.keys(ING).filter((id) => ING[id].basico || V.BASICOS_DEFAULT.includes(id));
    view.innerHTML = `<div class="stack">
      <div><h1 class="view-title">Mi refri</h1><p class="view-sub">Marca lo que tienes en casa y te digo qué cocinar, o qué te falta para hacerlo.</p></div>
      <div class="seg" role="group" aria-label="¿Para quién cocinas?">
        <button data-act="refri-para" data-p="papas" aria-pressed="${para === 'papas'}">Papás</button>
        <button data-act="refri-para" data-p="vasco" aria-pressed="${para === 'vasco'}">${esc(nombre())}</button>
        <button data-act="refri-para" data-p="ambos" aria-pressed="${para === 'ambos'}">Los dos</button>
      </div>
      <section class="block" aria-labelledby="tengo-t">
        <h2 id="tengo-t">Lo que tengo</h2>
        <label class="search">${V.ui('buscar', 20)}<span class="sr-only">Agregar ingrediente</span>
          <input id="refri-q" type="search" placeholder="Escribe: pollo, tomate, huevo…" autocomplete="off" enterkeyhint="done"></label>
        <div class="sug" id="refri-sug" aria-live="polite"></div>
        <div id="refri-sel"></div>
        <div class="btn-row">
          <button class="btn soft" data-act="refri-pick">${V.ui('canasta', 18)} Elegir con dibujos</button>
          <button class="btn ghost" data-act="refri-clear" id="refri-clear" ${S.refri.length ? '' : 'hidden'}>Vaciar</button>
        </div>
        <details class="acc help">
          <summary><span class="ing-ico">${V.icon('sal', 32)}</span><span>Doy por hecho que tienes (${bas.length})</span><span class="chev">${chev()}</span></summary>
          <div class="basicos">
            <p class="hint">Lo básico de la cocina no lo pido. Desmarca lo que no tengas.</p>
            <div class="ing-grid">${basIds
              .map((id) => `<button class="ing-pick" data-act="basico-toggle" data-id="${id}" aria-pressed="${bas.includes(id)}">${V.icon(id, 36)}${esc(ING[id].nombre.replace(/ \(.*\)/, ''))}</button>`)
              .join('')}</div>
          </div>
        </details>
      </section>
      <div id="refri-res" class="stack"></div>
    </div>`;
    renderRefriSel();
    renderRefriRes();
  }
  function renderRefriSel() {
    const box = $('#refri-sel');
    if (!box) return;
    box.innerHTML = S.refri.length
      ? `<div class="sel-chips">${S.refri
          .map(
            (id) => `<button class="sel-chip" data-act="refri-del" data-id="${id}" aria-label="Quitar ${esc(ING[id].nombre)}">
              <span class="ico">${V.icon(id, 24)}</span>${esc(ING[id].nombre.replace(/ \(.*\)/, ''))}<span class="x">${V.ui('cerrar', 14)}</span></button>`
          )
          .join('')}</div>`
      : '<p class="hint">Todavía no marcaste nada.</p>';
    const clear = $('#refri-clear');
    if (clear) clear.hidden = !S.refri.length;
  }
  function renderRefriSug(texto) {
    const box = $('#refri-sug');
    if (!box) return;
    const ids = V.buscarIngrediente(texto || '', S.refri);
    box.innerHTML = ids
      .map((id) => `<button class="filter" data-act="refri-add" data-id="${id}">${V.icon(id, 22)}${esc(ING[id].nombre.replace(/ \(.*\)/, ''))}</button>`)
      .join('');
    if (texto && !ids.length) box.innerHTML = '<p class="hint">No encuentro ese ingrediente. Prueba con otro nombre.</p>';
  }
  function matchCard(x) {
    const r = x.r;
    const usa = x.usa.map(corto).concat(x.subs.map(([, sub]) => corto(sub)));
    const subs = x.subs.map(([orig, sub]) => `Con ${corto(sub)} en vez de ${corto(orig)}`).join('. ');
    return `<li class="match">
      <a class="match-main" href="#receta-${r.id}">
        <span class="opt-art" data-tipo="${r.tipo[0]}">${dish(r)}</span>
        <span class="opt-body">
          <b>${esc(r.nombre)}</b>
          <span class="meta"><span class="who ${r.perfil}">${esc(quienTxt(r.perfil))}</span>${r.min} min</span>
          <span class="uses">Usas ${esc(enLista(usa))}</span>
          ${subs ? `<span class="hint">${esc(subs)}</span>` : ''}
          ${x.olla ? `<span class="hint">Misma olla: también sale «${esc(x.olla.r.nombre)}» para ${esc(nombre())}.</span>` : ''}
        </span>
      </a>
      ${x.faltan.length
        ? `<div class="match-miss"><span class="miss-label">Te falta:</span>${x.faltan
            .map((id) => `<span class="miss">${V.icon(id, 20)}${esc(corto(id))}</span>`)
            .join('')}<button class="chip-btn" data-act="refri-falta" data-ids="${x.faltan.join(',')}">${V.ui('mas', 14)} A la lista</button></div>`
        : ''}
    </li>`;
  }
  function renderRefriRes() {
    const box = $('#refri-res');
    if (!box) return;
    if (!S.refri.length) {
      box.innerHTML = `<section class="block plain">
        <h2>Prueba con un ejemplo</h2>
        <div class="ejemplos">${EJEMPLOS.map(
          (ids) => `<button class="ejemplo" data-act="refri-ejemplo" data-ids="${ids.join(',')}"><span class="ej-icons">${ids.map((id) => V.icon(id, 30)).join('')}</span>${esc(enLista(ids.map(corto)))}</button>`
        ).join('')}</div>
      </section>`;
      return;
    }
    const perfiles = S.refriPara === 'ambos' ? ['papas', 'vasco'] : [S.refriPara];
    const { listos, casi } = V.cocinar({ tengo: S.refri, basicos: basicos(), perfiles, prefsDe });
    const lista = (items, k) => {
      const ver = ui.refriMas[k] ? items.slice(0, 12) : items.slice(0, 3);
      const resto = Math.min(items.length, 12) - ver.length;
      return `<ul class="match-list">${ver.map(matchCard).join('')}</ul>
        ${resto > 0 ? `<button class="btn ghost wide" data-act="refri-mas" data-k="${k}">Ver ${resto} ${resto === 1 ? 'opción más' : 'opciones más'}</button>` : ''}`;
    };
    if (!listos.length && !casi.length) {
      box.innerHTML = `<div class="empty">${V.icon('huevo', 64)}<p>Con eso todavía no armo un plato. Agrega una proteína (pollo, huevo, pescado, carne o menestras) y alguna verdura.</p></div>`;
      return;
    }
    box.innerHTML = `
      ${listos.length
        ? `<section aria-labelledby="ya"><h2 class="sec-title" id="ya">Puedes preparar ya <span class="count">${listos.length}</span></h2>${lista(listos, 'listos')}</section>`
        : `<p class="hint">Aún no hay un plato completo con lo que marcaste. Mira lo que te falta abajo.</p>`}
      ${casi.length
        ? `<section aria-labelledby="poco"><h2 class="sec-title" id="poco">Te falta poco <span class="count">${casi.length}</span></h2>
           <p class="hint">Platos para los que te faltan 1 o 2 ingredientes. Toca «A la lista» para anotarlos.</p>${lista(casi, 'casi')}</section>`
        : ''}`;
  }
  function addRefri(id) {
    if (!S.refri.includes(id)) S.refri.push(id);
    save();
  }
  function openRefriPick() {
    const draw = () => {
      const groups = V.CATEGORIAS.map((c) => {
        const ids = Object.keys(ING).filter((id) => ING[id].cat === c.id && !ING[id].basico && !V.BASICOS_DEFAULT.includes(id));
        if (!ids.length) return '';
        return `<div class="field"><span class="label">${c.nombre}</span><div class="ing-grid">${ids
          .map((id) => `<button class="ing-pick" data-act="pick-toggle" data-id="${id}" aria-pressed="${S.refri.includes(id)}">${V.icon(id, 44)}${esc(ING[id].nombre.replace(/ \(.*\)/, ''))}</button>`)
          .join('')}</div></div>`;
      }).join('');
      openSheet(`<div class="sheet-head"><div><span class="eyebrow">Mi refri</span><h2 id="sheet-title">¿Qué tienes en casa?</h2>
          <p class="hint">Marca todo lo que tengas.</p></div>
          <button class="icon-btn" data-act="close-sheet" aria-label="Cerrar">${V.ui('cerrar', 20)}</button></div>
        ${groups}
        <div class="btn-row sheet-foot"><button class="btn primary" data-act="close-sheet">Listo (${S.refri.length})</button></div>`);
    };
    sheetCtx = { kind: 'refri', draw };
    draw();
  }

  /* ---------- Lista del mercado ---------- */
  function shopEntries() {
    const f = ui.shopFor;
    return ['vasco', 'papas']
      .filter((pid) => f === 'familia' || f === pid)
      .map((pid) => ({ P: PF(pid), days: getPlan(pid, ui.shopWeek).days }));
  }
  function renderCompras() {
    const { groups, basicos: bas } = V.shoppingList(shopEntries());
    const checked = S.compras[ui.shopWeek] || [];
    const total = groups.reduce((n, g) => n + g.items.length, 0) + S.extras.length;
    const done =
      groups.reduce((n, g) => n + g.items.filter((it) => checked.includes(it.id)).length, 0) +
      S.extras.filter((id) => checked.includes(id)).length;
    const refri = new Set(S.refri);
    const quien = (it) =>
      ui.shopFor === 'familia' && it.quien.length === 1 ? ` · ${it.quien[0] === 'vasco' ? esc(nombre()) : 'papás'}` : '';
    const item = (it) => {
      const recs = it.recetas.slice(0, 2).join(', ') + (it.recetas.length > 2 ? ` y ${it.recetas.length - 2} más` : '');
      return `<li><label class="shop-item">
        <input type="checkbox" data-act="shop-check" data-id="${it.id}" ${checked.includes(it.id) ? 'checked' : ''}>
        <span class="ing-ico">${V.icon(it.id, 36)}</span>
        <span class="txt"><b>${esc(ING[it.id].nombre)}${refri.has(it.id) ? ' <span class="en-refri">En tu refri</span>' : ''}</b><small>${esc(recs)}${quien(it)}</small></span>
        <span class="veces" aria-label="En ${it.veces} comidas">${it.veces}×</span>
      </label></li>`;
    };
    const extra = (id) => `<li><div class="shop-item">
        <input type="checkbox" data-act="shop-check" data-id="${id}" ${checked.includes(id) ? 'checked' : ''} aria-label="${esc(ING[id].nombre)}">
        <span class="ing-ico">${V.icon(id, 36)}</span>
        <span class="txt"><b>${esc(ING[id].nombre)}</b><small>Lo agregaste tú</small></span>
        <button class="extra-del" data-act="extra-del" data-id="${id}" aria-label="Quitar ${esc(ING[id].nombre)}">${V.ui('cerrar', 18)}</button>
      </div></li>`;
    const cur = weekKey(today());
    const nxt = weekKey(V.addDays(today(), 7));
    view.innerHTML = `<div class="stack">
      <div><h1 class="view-title">Lista del mercado</h1><p class="view-sub">Todo lo del menú del ${fmtRange(ui.shopWeek)}.</p></div>
      <div class="seg" role="group" aria-label="Semana">
        <button data-act="shop-week" data-w="${cur}" aria-pressed="${ui.shopWeek === cur}">Esta semana</button>
        <button data-act="shop-week" data-w="${nxt}" aria-pressed="${ui.shopWeek === nxt}">La próxima</button>
      </div>
      <div class="seg" role="group" aria-label="¿Para quién?">
        <button data-act="shop-for" data-f="familia" aria-pressed="${ui.shopFor === 'familia'}">Toda la familia</button>
        <button data-act="shop-for" data-f="vasco" aria-pressed="${ui.shopFor === 'vasco'}">${esc(nombre())}</button>
        <button data-act="shop-for" data-f="papas" aria-pressed="${ui.shopFor === 'papas'}">Papás</button>
      </div>
      <div><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}" aria-label="Avance de compras"><span style="width:${total ? (done / total) * 100 : 0}%"></span></div>
        <p class="hint" style="margin-top:6px">${done} de ${total} listos</p></div>
      <div class="btn-row">
        <button class="btn primary" data-act="share">${V.ui('compartir', 18)} Compartir</button>
        <button class="btn soft" data-act="shop-clear">Desmarcar todo</button>
      </div>
      ${S.extras.length ? `<section class="shop-group"><h2>Agregaste tú</h2><ul class="shop-list">${S.extras.map(extra).join('')}</ul></section>` : ''}
      ${groups.map((g) => `<section class="shop-group"><h2>${g.nombre}</h2><ul class="shop-list">${g.items.map(item).join('')}</ul></section>`).join('')}
      ${bas.length ? `<section class="shop-group"><h2>Revisa que tengas en casa</h2><ul class="shop-list">${bas.map(item).join('')}</ul></section>` : ''}
      <aside class="tip-card">${V.icon('pescado', 52)}<div><span class="eyebrow">Consejo</span><p>Compra el pescado, el hígado y la sangrecita frescos el día que los vas a cocinar, o congélalos en porciones apenas llegues del mercado.</p></div></aside>
    </div>`;
  }
  function shareText() {
    const { groups, basicos: bas } = V.shoppingList(shopEntries());
    const checked = S.compras[ui.shopWeek] || [];
    const para = ui.shopFor === 'familia' ? 'la familia' : ui.shopFor === 'vasco' ? nombre() : 'los papás';
    let t = `Lista del mercado para ${para} (${fmtRange(ui.shopWeek)})\n`;
    const extras = S.extras.filter((id) => !checked.includes(id));
    if (extras.length) t += `\nAgregado\n` + extras.map((id) => `- ${ING[id].nombre}`).join('\n') + '\n';
    groups.forEach((g) => {
      const items = g.items.filter((it) => !checked.includes(it.id) && !S.extras.includes(it.id));
      if (!items.length) return;
      t += `\n${g.nombre}\n` + items.map((it) => `- ${ING[it.id].nombre}`).join('\n') + '\n';
    });
    if (bas.length) t += `\nRevisar en casa\n` + bas.map((it) => `- ${ING[it.id].nombre}`).join('\n') + '\n';
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
  function agregarExtras(ids) {
    const nuevos = ids.filter((id) => !S.extras.includes(id));
    S.extras = S.extras.concat(nuevos);
    save();
    return nuevos;
  }

  /* ---------- Guía ---------- */
  const PLATO =
    '<svg class="plato-svg" viewBox="0 0 240 200" role="img" aria-label="Plato saludable: medio plato de verduras, un cuarto de cereales o tubérculos y un cuarto de alimentos de origen animal">' +
    '<ellipse cx="100" cy="104" rx="92" ry="92" fill="#000" opacity=".06"/>' +
    '<circle cx="100" cy="100" r="92" fill="#FFFFFF"/><circle cx="100" cy="100" r="92" fill="none" stroke="#DCE3D3" stroke-width="3"/>' +
    '<path d="M100 100V22A78 78 0 0 0 100 178z" fill="#4E9A3A"/>' +
    '<path d="M100 100V22A78 78 0 0 1 178 100z" fill="#E9A21F"/>' +
    '<path d="M100 100h78A78 78 0 0 1 100 178z" fill="#C8414A"/>' +
    '<text x="60" y="96" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="800" font-family="Nunito, sans-serif">Verduras</text>' +
    '<text x="60" y="116" text-anchor="middle" fill="#FFFFFF" font-size="22" font-weight="800" font-family="Nunito, sans-serif">½</text>' +
    '<text x="139" y="52" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="800" font-family="Nunito, sans-serif">Cereales y</text>' +
    '<text x="139" y="66" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="800" font-family="Nunito, sans-serif">tubérculos</text>' +
    '<text x="139" y="86" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="800" font-family="Nunito, sans-serif">¼</text>' +
    '<text x="139" y="128" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="800" font-family="Nunito, sans-serif">Origen</text>' +
    '<text x="139" y="142" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="800" font-family="Nunito, sans-serif">animal</text>' +
    '<text x="139" y="162" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="800" font-family="Nunito, sans-serif">¼</text>' +
    '<g transform="translate(200 40)"><path d="M0 0h28l-3 46c-.2 3-2.4 5-5 5H8c-2.6 0-4.8-2-5-5z" fill="#DCEFFB"/><path d="M2 14h24l-2 32c-.2 2-1.4 3-3 3H7c-1.6 0-2.8-1-3-3z" fill="#5BB4E5"/></g>' +
    '<g transform="translate(196 118)"><circle cx="16" cy="18" r="15" fill="#F68B1F"/><path d="M16 3c0-3 1-5 3-6" stroke="#6B4423" stroke-width="2.2" fill="none"/><path d="M18 2c4-4 10-3 11-1-3 4-8 4-11 1z" fill="#4FA34A"/></g>' +
    '</svg>';
  function renderGuia() {
    const pid = S.perfil;
    if (pid === 'papas') return renderGuiaPapas();
    const m = edadMeses();
    const aviso =
      m !== null && m >= 24
        ? `<p class="hint">${esc(nombre())} ya tiene ${edadTexto()}: esta guía es para 12 a 23 meses. Consulta en su control CRED cómo seguir.</p>`
        : '';
    view.innerHTML = `<div class="stack">
      ${perfilSwitch()}
      <div><h1 class="view-title">Guía para su edad</h1><p class="view-sub">Lo que recomiendan el MINSA y la OMS para niños de 12 a 23 meses.</p>${aviso}</div>
      <section class="block">
        <h2>El horario de ${esc(nombre())}</h2>
        <ul class="schedule">${V.TIEMPOS.map(
          (t) => `<li data-slot="${t.key}"><span class="time">${fmtHora(hora('vasco', t.key))}</span><span class="dot"></span><span><b>${t.nombre}</b>
            <small>${t.tipo === 'refrigerio' ? 'Porción pequeña: fruta y un lácteo' : '1 plato mediano, de 7 a 10 cucharadas'}</small></span></li>`
        ).join('')}
          <li><span class="time">Siempre</span><span class="dot" style="background:var(--ink-2)"></span><span><b>Lactancia materna</b><small>A libre demanda, también de noche</small></span></li>
        </ul>
        <p class="hint">Deja unas 2 a 3 horas entre comidas. Puedes mover los horarios según sus siestas en <a href="#ajustes">Ajustes</a>.</p>
      </section>
      ${guiaAcc(V.GUIA)}
      ${fuentes(V.FUENTES, `Esta app es una ayuda práctica para el día a día y no reemplaza a su pediatra ni a su control CRED. Ante alergias, bajo peso, anemia o dudas, consulta en su centro de salud.`)}
    </div>`;
  }
  function renderGuiaPapas() {
    view.innerHTML = `<div class="stack">
      ${perfilSwitch()}
      <div><h1 class="view-title">Guía para los papás</h1><p class="view-sub">Lo que recomiendan el MINSA y la OMS para adultos, y para la mamá que da de lactar.</p></div>
      <section class="block">
        <h2>El plato saludable</h2>
        ${PLATO}
        <p class="hint">En el almuerzo y la cena: medio plato de verduras, un cuarto de arroz, papa u otro cereal o tubérculo, y un cuarto de pollo, pescado, carne, huevo o menestras. Con agua y una fruta.</p>
      </section>
      <section class="block">
        <h2>El horario de los papás</h2>
        <ul class="schedule">${V.TIEMPOS_PAPAS.map(
          (t) => `<li data-slot="${t.key}"><span class="time">${fmtHora(hora('papas', t.key))}</span><span class="dot"></span><span><b>${t.nombre}</b>
            <small>${t.tipo === 'lonche' ? 'Fruta, lácteo o algo ligero' : t.tipo === 'desayuno' ? 'No te lo saltes' : 'Medio plato de verduras'}</small></span></li>`
        ).join('')}
          <li><span class="time">Todo el día</span><span class="dot" style="background:#5BB4E5"></span><span><b>Agua</b><small>De 6 a 8 vasos</small></span></li>
        </ul>
        <p class="hint">Si das de lactar, suma un refrigerio a media mañana. Cambia los horarios en <a href="#ajustes">Ajustes</a>.</p>
      </section>
      ${guiaAcc(V.GUIA_PAPAS)}
      ${fuentes(V.FUENTES_PAPAS, 'Es una guía general para adultos sanos. Si tienen diabetes, presión alta, alguna alergia u otra condición, sigan las indicaciones de su médico o nutricionista.')}
    </div>`;
  }
  const guiaAcc = (lista) =>
    lista
      .map(
        (g) => `<details class="acc"${g.abierto ? ' open' : ''}>
          <summary><span class="ing-ico">${V.icon(g.icon, 36)}</span><span>${esc(g.titulo)}</span><span class="chev">${chev()}</span></summary>
          <ul>${g.puntos.map((p) => `<li>${p}</li>`).join('')}</ul>
        </details>`
      )
      .join('');
  const fuentes = (lista, aviso) => `<section class="block plain">
        <h2>Fuentes</h2>
        <ul class="sources">${lista.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener">${esc(f.nombre)}</a></li>`).join('')}</ul>
        <p class="hint">${aviso}</p>
      </section>`;

  /* ---------- Ajustes ---------- */
  function horariosBlock(pid) {
    const P = PF(pid);
    return `<div class="times">${P.tiempos
      .map(
        (t) => `<div class="field" data-slot="${t.key}"><label class="label" for="h-${pid}-${t.key}">${t.nombre}</label>
          <input class="input" type="time" id="h-${pid}-${t.key}" data-hora="${t.key}" data-perfil="${pid}" value="${hora(pid, t.key)}"></div>`
      )
      .join('')}</div>
      <button class="btn soft" data-act="horas-reset" data-perfil="${pid}">Volver a los horarios sugeridos</button>`;
  }
  function evitarBlock(pid) {
    return `<div class="opt-checks">${Object.entries(V.ALERGENOS)
      .map(
        ([k, a]) => `<label class="opt-check"><input type="checkbox" id="av-${pid}-${k}" data-avoid="${k}" data-perfil="${pid}" ${avoidDe(pid).includes(k) ? 'checked' : ''}>${a.nombre}</label>`
      )
      .join('')}</div>`;
  }
  function renderAjustes() {
    const standalone = isStandalone();
    view.innerHTML = `<div class="stack">
      <div><h1 class="view-title">Ajustes</h1><p class="view-sub">Se guardan solo en este celular.</p></div>
      <section class="block">
        <h2>${V.AVATAR.vasco.replace('<svg', '<svg class="mini-av"')} ${esc(nombre())}</h2>
        <div class="field"><label for="f-nombre">Nombre</label><input class="input" id="f-nombre" data-set="nombre" value="${esc(S.settings.nombre)}" autocomplete="off"></div>
        <div class="field"><label for="f-nac">Fecha de nacimiento</label><input class="input" type="date" id="f-nac" data-set="nacimiento" value="${esc(S.settings.nacimiento)}"></div>
        <p class="hint">Con la fecha mostramos su edad en meses.</p>
        <span class="label">Horarios de comida</span>
        ${horariosBlock('vasco')}
        <span class="label">Alimentos que debe evitar</span>
        <p class="hint">Si su pediatra indicó una alergia, márcala: esas recetas no aparecerán en su menú.</p>
        ${evitarBlock('vasco')}
      </section>
      <section class="block">
        <h2>${V.AVATAR.papas.replace('<svg', '<svg class="mini-av"')} Papás</h2>
        <span class="label">Horarios de comida</span>
        ${horariosBlock('papas')}
        <span class="label">Alimentos que no comen</span>
        <p class="hint">Esas recetas no aparecerán en el menú de los papás ni en Mi refri.</p>
        ${evitarBlock('papas')}
      </section>
      <section class="block">
        <h2>Instalar en el celular</h2>
        ${standalone ? '<p>Ya estás usando la app instalada.</p>' : deferredInstall ? `<button class="btn primary" data-act="install">${V.ui('instalar', 18)} Instalar la app</button>` : ''}
        ${!standalone ? `<ol class="steps-install">${
          isIOS
            ? '<li>Abre esta página en <b>Safari</b>.</li><li>Toca el botón <b>Compartir</b> (el cuadrado con la flecha).</li><li>Elige <b>Agregar a pantalla de inicio</b>.</li>'
            : '<li>Abre esta página en <b>Chrome</b>.</li><li>Toca el menú <b>⋮</b> arriba a la derecha.</li><li>Elige <b>Instalar app</b> o <b>Agregar a pantalla principal</b>.</li>'
        }</ol><p class="hint">Después la abres desde el ícono y funciona aun sin internet. Este es el enlace para abrir en cada celular:</p>${linkBox()}${installHelp()}` : ''}
      </section>
      <section class="block">
        <h2>Empezar de cero</h2>
        <p class="hint">Borra menús, favoritas, reacciones, Mi refri y la lista del mercado de este celular.</p>
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
    if (kind === 'refri' && currentRoute === 'refri') renderRefri();
    if (!fromHistory && history.state && history.state.sheet) {
      try {
        history.back();
      } catch (e) {
        /* sin historial */
      }
    }
    if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  window.addEventListener('popstate', () => closeSheet(true));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  /* ---------- Navegación ---------- */
  const TABS = [
    ['menu', 'Menú', 'menu'],
    ['recetas', 'Recetas', 'recetas'],
    ['refri', 'Mi refri', 'refri'],
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
    } else if (h === 'refri') {
      renderRefri();
      tab = 'refri';
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
    const d = today();
    $('#brand-sub').textContent = `${V.DIAS[V.dayIndex(d)]} ${fmtDay(d)}`;
  }
  window.addEventListener('hashchange', () => {
    navDepth++;
    route();
  });
  // Vuelve a pintar la vista actual sin mover la página
  function refresh() {
    const y = window.scrollY;
    route();
    window.scrollTo(0, y);
  }

  /* ---------- Acciones ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    switch (act) {
      case 'perfil':
        if (S.perfil !== el.dataset.p) {
          S.perfil = el.dataset.p;
          save();
          refresh();
        }
        break;
      case 'welcomed':
        S.welcomed = true;
        S.novedades2 = true;
        save();
        renderMenu();
        break;
      case 'novedades':
        S.novedades2 = true;
        if (el.dataset.p) S.perfil = el.dataset.p;
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
        setSlot(S.perfil, ui.week, ui.day, el.dataset.slot, el.dataset.id);
        closeSheet();
        renderMenu();
        toast(`Listo: ${BY_ID[el.dataset.id].nombre}`);
        break;
      }
      case 'pick-random': {
        const pid = S.perfil;
        const alts = V.alternatives(PF(pid), getPlan(pid, ui.week).days, ui.day, el.dataset.slot, prefsDe(pid), linkDe(pid, ui.week)).slice(0, 6);
        const a = alts[Math.floor(Math.random() * alts.length)];
        if (a) {
          setSlot(pid, ui.week, ui.day, el.dataset.slot, a.r.id);
          closeSheet();
          renderMenu();
          toast(`Sorpresa: ${a.r.nombre}`);
        }
        break;
      }
      case 'regen':
        openSheet(`<div class="sheet-head"><div><span class="eyebrow">${fmtRange(ui.week)} · ${esc(quienTxt(S.perfil))}</span><h2 id="sheet-title">¿Armar otro menú?</h2>
            <p class="hint">Se cambian todas las comidas de esta semana de ${S.perfil === 'vasco' ? esc(nombre()) : 'los papás'}, también las que elegiste tú.</p></div></div>
          <div class="btn-row"><button class="btn soft" data-act="close-sheet">Cancelar</button><button class="btn primary" data-act="regen-ok">${V.ui('chispa', 18)} Sí, armar otro</button></div>`);
        break;
      case 'regen-ok': {
        const pid = S.perfil;
        const seed = (Math.random() * 2 ** 32) >>> 0;
        const link = pid === 'papas' ? getPlan('vasco', ui.week).days : null;
        plansDe(pid)[ui.week] = { seed, days: V.generateWeek(PF(pid), seed, prefsDe(pid), link) };
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
        $('#reac-hint').textContent = reacHint(BY_ID[id].perfil, S.reactions[id] || '');
        break;
      }
      case 'receta-lista': {
        const r = BY_ID[el.dataset.id];
        const ids = [...new Set(r.ing.filter((i) => !V.esOpcional(i) && !basicos().includes(i[0]) && !S.refri.includes(i[0])).map((i) => i[0]))];
        const nuevos = agregarExtras(ids);
        toast(nuevos.length ? `Agregado a la lista: ${enLista(nuevos.map(corto))}` : 'Ya tienes todo en tu refri o en la lista');
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
        const { st, r, nombreSlot } = sheetCtx;
        setSlot(r.perfil, st.week, st.day, st.slot, r.id);
        closeSheet();
        toast(`Listo: ${V.DIAS[st.day].toLowerCase()}, ${nombreSlot(st.slot).toLowerCase()}`);
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
        renderRecetas();
        break;

      /* Mi refri */
      case 'refri-para':
        S.refriPara = el.dataset.p;
        ui.refriMas = { listos: false, casi: false };
        save();
        refresh();
        break;
      case 'refri-add': {
        addRefri(el.dataset.id);
        const q = $('#refri-q');
        if (q) {
          q.value = '';
          q.focus();
        }
        renderRefriSug('');
        renderRefriSel();
        renderRefriRes();
        break;
      }
      case 'refri-del':
        S.refri = S.refri.filter((x) => x !== el.dataset.id);
        save();
        renderRefriSel();
        renderRefriRes();
        break;
      case 'refri-clear':
        S.refri = [];
        save();
        renderRefriSel();
        renderRefriRes();
        break;
      case 'refri-ejemplo':
        el.dataset.ids.split(',').forEach(addRefri);
        renderRefriSel();
        renderRefriRes();
        break;
      case 'refri-pick':
        openRefriPick();
        break;
      case 'pick-toggle': {
        const id = el.dataset.id;
        S.refri = S.refri.includes(id) ? S.refri.filter((x) => x !== id) : S.refri.concat(id);
        save();
        sheetCtx.draw();
        break;
      }
      case 'basico-toggle': {
        const id = el.dataset.id;
        const bas = basicos();
        S.basicos = bas.includes(id) ? bas.filter((x) => x !== id) : bas.concat(id);
        save();
        el.setAttribute('aria-pressed', String(S.basicos.includes(id)));
        const sum = el.closest('details').querySelector('summary span:nth-child(2)');
        if (sum) sum.textContent = `Doy por hecho que tienes (${S.basicos.length})`;
        renderRefriRes();
        break;
      }
      case 'refri-mas':
        ui.refriMas[el.dataset.k] = true;
        renderRefriRes();
        break;
      case 'refri-falta': {
        const nuevos = agregarExtras(el.dataset.ids.split(','));
        toast(nuevos.length ? `Agregado a la lista: ${enLista(nuevos.map(corto))}` : 'Ya estaba en la lista');
        break;
      }

      /* Compras */
      case 'shop-week':
        ui.shopWeek = el.dataset.w;
        renderCompras();
        break;
      case 'shop-for':
        ui.shopFor = el.dataset.f;
        renderCompras();
        break;
      case 'shop-clear':
        delete S.compras[ui.shopWeek];
        save();
        renderCompras();
        break;
      case 'extra-del':
        S.extras = S.extras.filter((x) => x !== el.dataset.id);
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
      case 'copy-link': {
        const done = () => toast('Enlace copiado: pégalo en ' + (isIOS ? 'Safari' : 'Chrome'));
        const fail = () => {
          const code = el.parentElement.querySelector('code');
          const range = document.createRange();
          range.selectNodeContents(code);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          toast('Mantén presionado el enlace para copiarlo');
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(APP_URL).then(done, fail);
        else fail();
        break;
      }

      /* Ajustes */
      case 'horas-reset': {
        const pid = el.dataset.perfil;
        if (pid === 'vasco') S.settings.horas = {};
        else S.papas.horas = {};
        save();
        refresh();
        toast('Horarios sugeridos de nuevo');
        break;
      }
      case 'reset':
        openSheet(`<div class="sheet-head"><div><h2 id="sheet-title">¿Borrar todos tus datos?</h2>
            <p class="hint">Se borran menús, favoritas, reacciones, horarios, Mi refri y la lista del mercado de este celular. No se puede deshacer.</p></div></div>
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
    if (el.id === 'refri-q') renderRefriSug(el.value);
  });
  document.addEventListener('keydown', (e) => {
    // Enter en el buscador de Mi refri agrega la primera sugerencia
    if (e.key === 'Enter' && e.target.id === 'refri-q') {
      e.preventDefault();
      const first = $('#refri-sug [data-act="refri-add"]');
      if (first) first.click();
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
      refresh();
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
      if (el.value) horasDe(el.dataset.perfil)[el.dataset.hora] = el.value;
      save();
      toast('Horario guardado');
      return;
    }
    if (el.dataset.avoid) {
      const pid = el.dataset.perfil;
      const k = el.dataset.avoid;
      const list = el.checked ? avoidDe(pid).concat(k) : avoidDe(pid).filter((x) => x !== k);
      if (pid === 'vasco') S.settings.avoid = list;
      else S.papas.avoid = list;
      Object.entries(plansDe(pid)).forEach(([w, p]) => sanitize(pid, p, w));
      save();
      toast(el.checked ? 'Lo quitamos del menú' : 'Listo');
    }
  });

  /* ---------- Instalación y modo sin internet ---------- */
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstall = e;
    if (currentRoute === 'menu' || currentRoute === 'ajustes') refresh();
  });
  if ('serviceWorker' in navigator && !window.VASCO_ARTIFACT && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }

  route();
})();
