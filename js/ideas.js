/* Ideas nuevas para Mi refri: arma platos caseros con lo que hay en casa.
   Cada plantilla es una forma de cocinar de cualquier casa peruana (chaufa, saltado,
   tortilla, guiso, causa…) con «roles»: lo que necesita sí o sí y lo que suma si lo tienes.
   El generador elige de tu refri los ingredientes que encajan en cada rol, escribe el
   nombre, las cantidades y los pasos, y si a una plantilla le falta un solo ingrediente,
   te dice cuál. Funciona sin internet. */
(function () {
  const V = (window.VASCO = window.VASCO || {});
  const { ING } = V;

  /* ---------- Nombres de cocina ---------- */
  const NOMBRE = {
    atun: 'atún',
    res: 'carne',
    higado: 'hígado',
    pescado: 'pescado',
    trucha: 'trucha',
    queso: 'queso fresco',
    champinon: 'champiñones',
    vainita: 'vainitas',
    arveja: 'arvejitas',
    'cebolla-china': 'cebolla china',
    'papa-amarilla': 'papa amarilla',
    'platano-isla': 'plátano de isla',
    platano: 'plátano',
    frejol: 'frejoles',
    pallar: 'pallares',
    garbanzo: 'garbanzos',
    'arveja-partida': 'arveja partida',
    huevo: 'huevo',
    fideos: 'fideos',
    avena: 'avena',
    papa: 'papa',
    zapallito: 'zapallito',
    'aji-amarillo': 'ají amarillo',
    'aji-panca': 'ají panca',
  };
  const nom = (id) => {
    if (NOMBRE[id]) return NOMBRE[id];
    const n = ING[id].nombre.replace(/ \(.*\)/, '');
    return n.charAt(0).toLowerCase() + n.slice(1);
  };
  const lista = (ids) => {
    const a = ids.map(nom);
    return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];
  };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- Cantidades (2 adultos / una porción de Vasco) ---------- */
  const QTY = {
    arroz: '1 1/2 tazas (o 3 tazas cocido)', fideos: '250 g', quinua: '1 taza', kiwicha: '1/2 taza', avena: '1 taza',
    papa: '3 unidades', 'papa-amarilla': '4 unidades', camote: '2 unidades', yuca: '500 g', pan: '2 a 4 panes',
    choclo: '1 unidad', 'platano-isla': '1 unidad', olluco: '300 g', zapallo: '300 g',
    pollo: '2 pechugas o 4 presas', res: '300 g', pescado: '2 filetes', trucha: '2 filetes', atun: '1 o 2 latas',
    huevo: '4 unidades', higado: '400 g', sangrecita: '500 g', queso: '150 g',
    lentejas: '1 taza (o 2 tazas cocidas)', frejol: '1 taza (o 2 tazas cocidas)', pallar: '1 taza (o 2 tazas cocidas)',
    garbanzo: '1 taza (o 2 tazas cocidas)', 'arveja-partida': '1 taza',
    tomate: '2 a 4 unidades', zanahoria: '1 unidad', zapallito: '1 unidad', pimiento: '1 unidad', vainita: '1 taza',
    brocoli: '1 taza', champinon: '200 g', espinaca: '1 atado', acelga: '1 atado', 'cebolla-china': '2 tallos',
    arveja: '1/2 taza', lechuga: '1/2 unidad', pepino: '1 unidad', palta: '1 unidad', culantro: 'unas ramas',
    perejil: 'unas ramas', albahaca: 'unas hojas', hierbabuena: 'unas hojas', kion: 'un trocito',
    'aji-amarillo': '1 cucharada', 'aji-panca': '1 cucharadita', aceituna: '4 unidades',
    leche: '1 taza', yogurt: '1 taza', mantequilla: '1 cucharada',
    aceite: '2 cucharadas', ajo: '2 dientes', cebolla: '1 unidad', limon: '1 o 2', sal: 'al gusto',
    pimienta: 'una pizca', comino: 'una pizca', oregano: '1 cucharadita', sillao: '2 cucharadas', vinagre: '1 cucharada',
    canela: '1 rajita',
  };
  const QTY_VASCO = {
    arroz: '3 cucharadas', fideos: '1/2 taza cocidos', quinua: '3 cucharadas', avena: '3 cucharadas', kiwicha: '2 cucharadas',
    papa: '1 pequeña', 'papa-amarilla': '1 pequeña', camote: '1/2 unidad', yuca: '1 trozo', pan: '1/2 pan',
    pollo: '2 cucharadas', res: '2 cucharadas', pescado: '1 filete pequeño', trucha: '1 filete pequeño',
    atun: '2 cucharadas', huevo: '1 unidad', higado: '2 cucharadas', sangrecita: '2 cucharadas', queso: '1 cucharada',
    leche: '1/2 taza', yogurt: '1/2 taza', aceite: '1 cucharadita', ajo: '1/2 diente', cebolla: '1 cucharada', limon: 'unas gotas',
    mantequilla: '1/2 cucharadita', canela: '1 rajita',
  };
  const qty = (id, c) => (c.bebe ? QTY_VASCO[id] || (ING[id].cat === 'frutas' ? '3 cucharadas' : '1 o 2 cucharadas') : QTY[id] || (ING[id].cat === 'frutas' ? '1 o 2 unidades' : '1 taza'));

  const FRUTAS_BATIDO = ['platano', 'papaya', 'mango', 'fresa', 'lucuma', 'chirimoya', 'palta', 'pina', 'manzana', 'pera', 'granadilla'];
  const FRUTAS = ['platano', 'papaya', 'mango', 'fresa', 'manzana', 'pera', 'mandarina', 'naranja', 'pina', 'granadilla', 'sandia', 'melon', 'aguaymanto', 'lucuma', 'chirimoya'];
  const PROT = ['pollo', 'res', 'pescado', 'trucha', 'atun', 'huevo', 'higado', 'sangrecita', 'bazo'];
  const MENESTRAS = ['lentejas', 'frejol', 'pallar', 'garbanzo', 'arveja-partida'];
  const GUISADA = { lentejas: 'Lentejas guisadas', frejol: 'Frejoles guisados', pallar: 'Pallares guisados', garbanzo: 'Garbanzos guisados', 'arveja-partida': 'Arveja partida guisada' };

  // Frases que cambian si la comida es para Vasco (sin sal, sin sillao, sin ají)
  const sal = (c) => (c.bebe ? '' : ', sal y pimienta');
  const conSal = (c) => (c.bebe ? ' (sin sal)' : ' con sal');

  /* Cómo se cocina cada proteína según el plato */
  const COCCION = {
    saltear: {
      pollo: 'Corta el pollo en tiras o cubos y dóralo en la sartén bien caliente con aceite (6 minutos).',
      res: 'Corta la carne en tiras finas y saltéala a fuego fuerte 3 minutos.',
      higado: 'Corta el hígado en tiras y saltéalo 3 minutos, hasta que no quede rosado.',
      pescado: 'Corta el pescado en cubos y dóralo con cuidado 3 minutos; resérvalo.',
      trucha: 'Corta la trucha en cubos y dórala con cuidado 3 minutos; resérvala.',
      atun: 'Escurre el atún y saltéalo 1 minuto.',
      huevo: 'Revuelve los huevos batidos en la sartén con unas gotas de aceite, pícalos y resérvalos.',
      champinon: 'Lamina los champiñones y saltéalos a fuego fuerte hasta que doren.',
      queso: 'Corta el queso fresco en cubitos; lo agregas al final.',
    },
    plancha: {
      pollo: 'Abre el pollo en filetes delgados y cocínalo en la sartén caliente con poco aceite, 5 minutos por lado.',
      res: 'Cocina la carne en la sartén bien caliente, 3 minutos por lado.',
      pescado: 'Cocina el pescado en la sartén con unas gotas de aceite, 3 o 4 minutos por lado.',
      trucha: 'Cocina la trucha con la piel hacia abajo 4 minutos, voltéala y cocina 2 más.',
      higado: 'Cocina el hígado en bistecs 2 minutos por lado, hasta que no quede rosado.',
    },
    acompanar: {
      pollo: 'Cocina el pollo a la plancha y córtalo en trocitos.',
      res: 'Cocina la carne a la plancha o guisada y córtala en trocitos.',
      pescado: 'Cocina el pescado al vapor 8 minutos y desmenúzalo sin espinas.',
      trucha: 'Cocina la trucha al vapor 8 minutos y desmenúzala sin espinas.',
      higado: 'Saltea el hígado picado con cebolla 5 minutos, hasta que esté bien cocido.',
      sangrecita: 'Hierve la sangrecita 10 minutos, escúrrela y saltéala con cebolla y ajo.',
      huevo: 'Sancocha los huevos 9 minutos (o fríelos con poco aceite).',
      atun: 'Saltea el atún escurrido con cebolla y tomate picados.',
    },
  };

  /* ---------- Plantillas ---------- */
  const T = [];

  T.push({
    id: 'chaufa',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 20,
    req: [
      { k: 'prot', de: ['pollo', 'atun', 'huevo', 'res', 'pescado'], def: 'huevo' },
      { k: 'base', de: ['arroz', 'quinua'], def: 'arroz' },
    ],
    opt: [
      { k: 'verd', de: ['cebolla-china', 'zanahoria', 'pimiento', 'arveja', 'choclo', 'vainita', 'brocoli', 'champinon', 'zapallito'], max: 3 },
      { k: 'kion', de: ['kion'] },
      { k: 'huevo', de: ['huevo'] },
    ],
    basicos: ['aceite', 'ajo', 'sillao', 'cebolla'],
    nombre: (p) => (p.base[0] === 'quinua' ? `Chaufa de quinua con ${nom(p.prot[0])}` : `Arroz chaufa de ${nom(p.prot[0])}`),
    pasos: (p, c) => {
      const verd = p.verd.filter((x) => x !== 'cebolla-china');
      return [
        `Usa ${c.bebe ? '3 cucharadas' : '3 tazas'} de ${p.base[0] === 'quinua' ? 'quinua cocida y bien escurrida' : 'arroz cocido, mejor si es del día anterior y está frío'}.`,
        p.huevo.length && p.prot[0] !== 'huevo' ? 'Bate los huevos, haz una tortilla delgada, córtala en tiras y resérvala.' : '',
        `En una sartén con aceite, dora el ajo picado${p.kion.length ? ' y el kion rallado' : ''}.`,
        COCCION.saltear[p.prot[0]],
        verd.length ? `Suma ${lista(verd)} en trocitos y saltea 2 minutos.` : '',
        `Agrega ${p.base[0] === 'quinua' ? 'la quinua' : 'el arroz'} y mueve a fuego fuerte 3 minutos.${c.bebe ? ' Sin sillao: tiene mucha sal.' : ' Echa 2 cucharadas de sillao.'}`,
        `Termina con ${p.verd.includes('cebolla-china') ? 'la cebolla china picada' : 'cebolla en tiras finas'}${p.huevo.length && p.prot[0] !== 'huevo' ? ' y las tiras de tortilla' : ''}.`,
      ];
    },
    tip: (p) => (p.verd.length ? 'La mejor forma de usar el arroz que sobró.' : 'Si tienes zanahoria, pimiento o cebolla china, agrégalos para sumar verduras.'),
    vasco: 'Separa su porción antes del sillao y pica todo en trocitos.',
  });

  T.push({
    id: 'fideos-salteados',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 20,
    req: [{ k: 'fideos', de: ['fideos'], def: null }],
    opt: [
      { k: 'prot', de: ['atun', 'pollo', 'res', 'huevo', 'queso'] },
      { k: 'verd', de: ['tomate', 'zapallito', 'pimiento', 'champinon', 'brocoli', 'espinaca', 'zanahoria', 'vainita', 'cebolla-china', 'choclo'], max: 2 },
      { k: 'hierba', de: ['albahaca', 'perejil', 'culantro'] },
      { k: 'queso', de: ['queso'] },
    ],
    basicos: ['aceite', 'ajo', 'cebolla', 'oregano', 'limon', 'sal', 'pimienta'],
    nombre: (p) =>
      !p.prot.length && !p.verd.length
        ? 'Fideos al ajo y orégano'
        : p.prot.length && !p.verd.length
        ? `Fideos con ${nom(p.prot[0])} al ajo y orégano`
        : `Fideos salteados con ${lista(p.prot.filter((x) => x !== 'queso').concat(p.verd, p.prot.filter((x) => x === 'queso')))}`,
    pasos: (p, c) => [
      `Sancocha los fideos en agua${c.bebe ? ' sin sal' : ' con sal'} hasta que estén al dente; guarda media taza del agua.`,
      'En una sartén con aceite, dora el ajo y la cebolla picados.',
      !p.prot.length || p.prot[0] === 'queso'
        ? ''
        : p.prot[0] === 'atun'
        ? 'Agrega el atún escurrido y deshazlo con un tenedor.'
        : p.prot[0] === 'huevo'
        ? 'Agrega los huevos batidos y revuelve hasta que cuajen.'
        : COCCION.saltear[p.prot[0]],
      p.verd.length ? `Suma ${lista(p.verd)} picados y cocina 3 minutos.` : '',
      `Mezcla con los fideos, un poco del agua de cocción y el orégano${sal(c)}${p.prot[0] === 'atun' ? ', y unas gotas de limón' : ''}.`,
      p.hierba.length || p.queso.length || p.prot[0] === 'queso'
        ? `Sirve con ${lista(p.hierba.concat(p.queso, p.prot[0] === 'queso' ? ['queso'] : []).filter((v, i, a) => a.indexOf(v) === i))} por encima.`
        : '',
    ],
    tip: (p) =>
      p.verd.length
        ? 'Listo en 20 minutos con lo que hay en la despensa.'
        : `Acompaña con una ensalada para completar el medio plato de verduras${p.prot.length ? '' : ', y si tienes huevo o atún, súmalos para la proteína'}.`,
    vasco: 'Cocina sus fideos sin sal, córtalos en trocitos y separa su porción antes del limón y la pimienta.',
  });

  T.push({
    id: 'tallarines-rojos',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 30,
    req: [
      { k: 'fideos', de: ['fideos'], def: null },
      { k: 'tomate', de: ['tomate'], def: 'tomate' },
    ],
    opt: [
      { k: 'prot', de: ['atun', 'res', 'pollo', 'huevo'] },
      { k: 'verd', de: ['zanahoria', 'pimiento', 'champinon', 'zapallito'], max: 2 },
      { k: 'albahaca', de: ['albahaca'] },
      { k: 'queso', de: ['queso'] },
      { k: 'panca', de: ['aji-panca'] },
    ],
    basicos: ['aceite', 'ajo', 'cebolla', 'oregano', 'sal'],
    nombre: (p) => `Tallarines rojos${p.prot.length ? ' con ' + nom(p.prot[0]) : ''}`,
    pasos: (p, c) => [
      'Licúa los tomates con el ajo (o pícalos bien finos).',
      `Sofríe la cebolla picada en aceite${p.panca.length && !c.bebe ? ' con el ají panca' : ''}${p.verd.length ? ` y ${lista(p.verd)} en trocitos` : ''}.`,
      p.prot[0] === 'res' ? 'Agrega la carne (mejor molida) y cocina 8 minutos.' : p.prot[0] === 'pollo' ? 'Agrega el pollo en cubitos y dóralo.' : '',
      `Suma el tomate licuado y el orégano${c.bebe ? '' : ' con sal'}; cocina 10 minutos a fuego bajo hasta que espese.`,
      p.prot[0] === 'atun' ? 'Agrega el atún escurrido al final, solo para que se caliente.' : '',
      `Sancocha los fideos y mézclalos con la salsa${p.queso.length ? '; sirve con queso fresco' : ''}${p.albahaca.length ? ' y albahaca picada' : ''}.`,
      p.prot[0] === 'huevo' ? 'Sirve con un huevo sancochado o frito encima.' : '',
    ],
    tip: () => 'La salsa de tomate casera no tiene el exceso de sal de los sobres.',
    vasco: 'Salsa sin sal y fideos cortados en trocitos.',
  });

  T.push({
    id: 'ensalada-fria',
    tipo: ['almuerzo', 'cena'],
    plato: 'bowl',
    min: 25,
    req: [
      { k: 'base', de: ['fideos', 'quinua', 'papa', 'papa-amarilla', 'choclo'], def: null },
      { k: 'prot', de: ['atun', 'pollo', 'huevo', 'queso', 'garbanzo', 'lentejas', 'pallar'], def: 'huevo' },
    ],
    opt: [
      { k: 'verd', de: ['tomate', 'pepino', 'lechuga', 'palta', 'choclo', 'zanahoria', 'pimiento', 'cebolla-china'], max: 3 },
      { k: 'hierba', de: ['culantro', 'perejil'] },
    ],
    basicos: ['cebolla', 'limon', 'aceite', 'sal', 'pimienta'],
    nombre: (p) => {
      const b = p.base[0];
      const base = b === 'fideos' ? 'Ensalada fría de fideos' : b === 'quinua' ? 'Ensalada de quinua' : b === 'choclo' ? 'Ensalada de choclo' : 'Ensalada de papa';
      return `${base} con ${nom(p.prot[0])}`;
    },
    pasos: (p, c) => {
      const b = p.base[0];
      const pr = p.prot[0];
      return [
        b === 'fideos'
          ? 'Sancocha fideos cortos, enjuágalos con agua fría y escúrrelos.'
          : b === 'quinua'
          ? 'Cocina la quinua lavada en el doble de agua por 15 minutos y déjala enfriar.'
          : b === 'choclo'
          ? 'Sancocha el choclo y desgránalo.'
          : 'Sancocha las papas, pélalas y córtalas en cubos.',
        pr === 'atun'
          ? 'Escurre el atún.'
          : pr === 'pollo'
          ? 'Sancocha el pollo y deshiláchalo.'
          : pr === 'huevo'
          ? 'Sancocha los huevos 9 minutos y pícalos.'
          : pr === 'queso'
          ? 'Corta el queso en cubitos.'
          : 'Usa la menestra ya cocida y escurrida.',
        `Pica ${p.verd.length ? lista(p.verd) + ' y ' : ''}un poco de cebolla en cubitos.`,
        `Mezcla todo y aliña con limón y aceite${sal(c)}${p.hierba.length ? `; agrega ${nom(p.hierba[0])} picado` : ''}.`,
        'Sirve frío.',
      ];
    },
    tip: (p) => (p.verd.length ? 'Se lleva bien en táper para el almuerzo del trabajo.' : 'Si tienes tomate, pepino o palta, agrégalos: queda más fresca y con más verduras.'),
    vasco: 'Sin sal, todo en trocitos pequeños y con la cebolla muy picada (o sin cebolla).',
  });

  T.push({
    id: 'tortilla',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 20,
    req: [
      { k: 'huevo', de: ['huevo'], def: 'huevo' },
      {
        k: 'relleno',
        de: ['atun', 'espinaca', 'acelga', 'papa', 'papa-amarilla', 'zapallito', 'champinon', 'brocoli', 'choclo', 'zanahoria', 'tomate', 'cebolla-china', 'pimiento', 'queso'],
        def: null,
        max: 2,
      },
    ],
    opt: [{ k: 'queso', de: ['queso'] }],
    basicos: ['aceite', 'cebolla', 'sal'],
    nombre: (p) => `Tortilla de ${lista(p.relleno)}${p.queso.length && !p.relleno.includes('queso') ? ' con queso' : ''}`,
    pasos: (p, c) => {
      const papa = p.relleno.find((x) => x === 'papa' || x === 'papa-amarilla');
      const otros = p.relleno.filter((x) => x !== papa && x !== 'atun' && x !== 'queso');
      return [
        papa ? `Corta la ${nom(papa)} en láminas finas y cocínala en la sartén con aceite, tapada, hasta que esté suave (10 minutos).` : '',
        p.relleno.includes('atun') ? 'Escurre bien el atún.' : '',
        otros.length ? `Pica ${lista(otros)} finito con un poco de cebolla y saltea todo 2 minutos.` : '',
        `Bate los huevos${conSal(c)} y mézclalos con el relleno${p.queso.length || p.relleno.includes('queso') ? ' y el queso desmenuzado' : ''}.`,
        'Cocina en una sartén con un poco de aceite a fuego bajo, tapada, 5 minutos por lado.',
        'Sirve con arroz o pan, y ensalada si tienes.',
      ];
    },
    tip: () => 'Una comida rápida y barata que aprovecha lo que quedó en la refri.',
    vasco: 'Bien cocida, sin sal y en tiras para que la agarre con la mano.',
  });

  T.push({
    id: 'revuelto',
    tipo: ['desayuno'],
    plato: 'plato',
    min: 10,
    req: [{ k: 'huevo', de: ['huevo'], def: 'huevo' }],
    opt: [
      { k: 'verd', de: ['tomate', 'cebolla-china', 'espinaca', 'champinon', 'pimiento', 'zapallito'], max: 2 },
      { k: 'queso', de: ['queso'] },
      { k: 'pan', de: ['pan'] },
      { k: 'palta', de: ['palta'] },
    ],
    minUsa: 2,
    basicos: ['aceite', 'sal'],
    nombre: (p) => `Huevos revueltos${p.verd.length ? ' con ' + lista(p.verd) : ''}${p.queso.length ? (p.verd.length ? ' y queso' : ' con queso') : ''}`,
    pasos: (p, c) => [
      p.verd.length ? `Pica ${lista(p.verd)} y saltea 2 minutos en una sartén con unas gotas de aceite.` : '',
      `Agrega los huevos batidos${conSal(c)} y mueve a fuego bajo hasta que cuajen${p.queso.length ? '; suma el queso desmenuzado' : ''}.`,
      p.pan.length || p.palta.length ? `Sirve con ${lista(p.pan.concat(p.palta))}.` : 'Sirve con pan o camote si tienes.',
    ],
    tip: () => 'Desayuno de 10 minutos con proteína para toda la mañana.',
    vasco: 'Bien cocidos, sin sal, en trocitos.',
  });

  T.push({
    id: 'saltado',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 25,
    req: [
      { k: 'prot', de: ['pollo', 'res', 'higado', 'pescado', 'champinon'], def: 'pollo' },
      { k: 'verd', de: ['tomate', 'pimiento', 'vainita', 'zapallito', 'brocoli', 'champinon', 'cebolla-china'], def: 'tomate', max: 2 },
    ],
    opt: [
      { k: 'acomp', de: ['papa', 'camote', 'yuca', 'papa-amarilla'] },
      { k: 'aji', de: ['aji-amarillo'] },
      { k: 'hierba', de: ['culantro', 'perejil'] },
    ],
    basicos: ['aceite', 'cebolla', 'ajo', 'sillao', 'vinagre', 'sal', 'arroz'],
    nombre: (p) => `Saltado de ${nom(p.prot[0])} con ${lista(p.verd)}`,
    pasos: (p, c) => [
      COCCION.saltear[p.prot[0]].replace('dóralo con cuidado 3 minutos; resérvalo', 'dóralo con cuidado 3 minutos'),
      `Agrega la cebolla en gajos${p.aji.length && !c.bebe ? ', el ají en tiras' : ''} y ${lista(p.verd)}; saltea 2 minutos a fuego fuerte.`,
      c.bebe ? 'Para Vasco, sin sillao ni vinagre: dale sabor con un poco de tomate.' : 'Echa 1 cucharada de sillao y 1 de vinagre; mueve 1 minuto.',
      p.hierba.length ? `Apaga y agrega ${nom(p.hierba[0])} picado.` : '',
      `Sirve con arroz${p.acomp.length ? ` y ${nom(p.acomp[0])} sancochada o al horno` : ''}.`,
    ],
    tip: () => 'Un saltado con más verdura que carne cumple el medio plato de verduras.',
    vasco: 'Separa su porción antes del sillao, el vinagre y el ají, y pica todo en trocitos.',
  });

  T.push({
    id: 'guiso',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 40,
    req: [
      { k: 'prot', de: ['pollo', 'res', 'pescado'], def: 'pollo' },
      { k: 'tomate', de: ['tomate'], def: 'tomate' },
    ],
    opt: [
      { k: 'verd', de: ['papa', 'zanahoria', 'arveja', 'vainita', 'zapallo', 'choclo', 'olluco', 'champinon', 'pimiento', 'camote'], max: 3 },
      { k: 'panca', de: ['aji-panca'] },
      { k: 'hierba', de: ['culantro', 'perejil'] },
    ],
    minUsa: 2,
    basicos: ['aceite', 'cebolla', 'ajo', 'comino', 'sal', 'arroz'],
    nombre: (p) => `Guiso de ${nom(p.prot[0])}${p.verd.length ? ' con ' + lista(p.verd) : ''}`,
    pasos: (p, c) => {
      const pr = p.prot[0];
      return [
        pr === 'pescado' ? `Sazona el pescado${c.bebe ? '' : ' con sal'} y resérvalo.` : `Dora ${pr === 'res' ? 'la carne en trozos' : 'el pollo'}${conSal(c)} en una olla con aceite y retíralo.`,
        `Sofríe la cebolla y el ajo picados${p.panca.length && !c.bebe ? ' con el ají panca' : ''} y una pizca de comino; agrega los tomates picados y cocina 5 minutos.`,
        pr === 'pescado'
          ? `Agrega ${p.verd.length ? lista(p.verd) + ' en cubos y ' : ''}1 taza de agua; cocina 15 minutos y recién ahí pon el pescado por 8 minutos.`
          : `Regresa ${pr === 'res' ? 'la carne' : 'el pollo'}${p.verd.length ? `, ${lista(p.verd)} en cubos` : ''} y 1 taza de agua; tapa y cocina 20 minutos.`,
        p.hierba.length ? `Termina con ${nom(p.hierba[0])} picado.` : '',
        'Sirve con arroz.',
      ];
    },
    tip: () => 'Rinde para dos días y se congela bien en porciones.',
    vasco: 'Sin sal ni ají; aplasta un poco para que quede espesito.',
  });

  T.push({
    id: 'sopa',
    tipo: ['cena', 'almuerzo'],
    plato: 'bowl',
    min: 30,
    req: [{ k: 'base', de: ['fideos', 'quinua', 'papa', 'arroz'], def: null }],
    opt: [
      { k: 'verd', de: ['zanahoria', 'zapallo', 'vainita', 'zapallito', 'espinaca', 'acelga', 'choclo', 'arveja', 'brocoli', 'papa', 'cebolla-china', 'olluco'], max: 3 },
      { k: 'prot', de: ['pollo', 'huevo', 'queso', 'res'] },
      { k: 'kion', de: ['kion'] },
      { k: 'hierba', de: ['culantro', 'perejil', 'hierbabuena'] },
    ],
    minUsa: 2,
    basicos: ['cebolla', 'ajo', 'sal'],
    nombre: (p) =>
      ['pollo', 'res'].includes(p.prot[0])
        ? `Sopa de ${nom(p.prot[0])} con ${nom(p.base[0])}`
        : p.prot.length && !['arroz', 'papa'].includes(p.base[0])
        ? `Sopa de ${nom(p.base[0])} con ${nom(p.prot[0])}`
        : p.base[0] === 'arroz' || p.base[0] === 'papa'
        ? `Sopa de verduras con ${nom(p.base[0])}`
        : `Sopa de ${nom(p.base[0])} con verduras`,
    pasos: (p, c) => {
      const pr = p.prot[0];
      const b = p.base[0];
      return [
        `Hierve ${c.bebe ? '2 tazas' : '5 tazas'} de agua con la cebolla y el ajo picados${p.kion.length ? ' y el kion' : ''}.`,
        pr === 'pollo' || pr === 'res' ? `Agrega ${pr === 'pollo' ? 'el pollo' : 'la carne'} en trozos y cocina 15 minutos.` : '',
        p.verd.filter((x) => x !== b).length ? `Suma ${lista(p.verd.filter((x) => x !== b))} en cubitos y cocina 10 minutos.` : '',
        b === 'fideos' ? 'Agrega los fideos y cocina 8 minutos.' : b === 'quinua' ? 'Agrega la quinua lavada y cocina 15 minutos.' : b === 'arroz' ? 'Agrega 1/2 taza de arroz y cocina 15 minutos.' : 'Agrega la papa en cubos y cocina 15 minutos.',
        pr === 'huevo' ? 'Al final, agrega los huevos batidos moviendo.' : '',
        `${c.bebe ? 'Sin sal para Vasco.' : 'Sazona con sal.'}${pr === 'queso' ? ' Sirve con cubitos de queso fresco.' : ''}${p.hierba.length ? ` Termina con ${nom(p.hierba[0])} picado.` : ''}`,
      ];
    },
    tip: () => 'Aprovecha las verduras que están por malograrse.',
    vasco: 'Sírvele más sólido que caldo, espesito y sin sal.',
  });

  T.push({
    id: 'sanguche',
    tipo: ['lonche', 'cena', 'desayuno'],
    plato: 'snack',
    min: 10,
    req: [
      { k: 'pan', de: ['pan'], def: 'pan' },
      { k: 'relleno', de: ['pollo', 'atun', 'huevo', 'queso', 'palta', 'res'], def: null },
    ],
    opt: [{ k: 'verd', de: ['tomate', 'lechuga', 'palta', 'pepino'], max: 2 }],
    basicos: ['limon', 'cebolla', 'sal'],
    nombre: (p) =>
      p.relleno[0] === 'palta' ? `Pan con palta${p.verd.length ? ' y ' + lista(p.verd) : ''}` : `Sánguche de ${nom(p.relleno[0])}${p.verd.length ? ' con ' + lista(p.verd) : ''}`,
    pasos: (p, c) => {
      const r = p.relleno[0];
      return [
        r === 'atun'
          ? 'Mezcla el atún escurrido con cebolla picada finita y unas gotas de limón.'
          : r === 'pollo'
          ? `Sancocha y deshilacha el pollo; mézclalo con unas gotas de limón${c.bebe ? '' : ' y sal'}.`
          : r === 'huevo'
          ? 'Sancocha los huevos 9 minutos y córtalos en rodajas.'
          : r === 'queso'
          ? 'Corta el queso fresco en tajadas.'
          : r === 'res'
          ? 'Cocina la carne en tiras a la plancha.'
          : `Aplasta la palta con unas gotas de limón${c.bebe ? '' : ' y sal'}.`,
        `Arma los panes con ${lista(p.relleno.concat(p.verd.filter((x) => x !== r)))}.`,
      ];
    },
    tip: () => 'Mejor que un snack de bolsa para el lonche.',
    vasco: 'Pan en tiras pequeñas, sin sal ni mayonesa.',
  });

  T.push({
    id: 'causa',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 40,
    req: [
      { k: 'papa', de: ['papa-amarilla', 'papa'], def: 'papa-amarilla' },
      { k: 'prot', de: ['atun', 'pollo', 'huevo'], def: 'atun' },
    ],
    opt: [
      { k: 'aji', de: ['aji-amarillo'] },
      { k: 'verd', de: ['palta', 'tomate', 'lechuga', 'choclo'], max: 2 },
      { k: 'aceituna', de: ['aceituna'] },
    ],
    basicos: ['limon', 'aceite', 'cebolla', 'sal'],
    nombre: (p) => `Causa de ${nom(p.prot[0])}`,
    pasos: (p, c) => [
      `Sancocha la ${nom(p.papa[0])}, pélala y prénsala tibia.`,
      `Amasa con el jugo de 2 limones y aceite${c.bebe ? '' : ', sal'}${p.aji.length && !c.bebe ? ' y el ají amarillo' : ''}.`,
      p.prot[0] === 'atun'
        ? 'Mezcla el atún escurrido con cebolla picada finita y unas gotas de limón.'
        : p.prot[0] === 'pollo'
        ? 'Sancocha el pollo y deshiláchalo.'
        : 'Sancocha los huevos y córtalos en rodajas.',
      `Arma capas: papa, el relleno${p.verd.length ? `, ${lista(p.verd)}` : ''}, y otra capa de papa${p.aceituna.length ? '; decora con aceitunas' : ''}.`,
      'Refrigera 15 minutos antes de servir.',
    ],
    tip: () => 'Un clásico limeño que se arma con lo que haya.',
    vasco: 'Separa papa sin sal ni ají y arma bolitas para que las agarre.',
  });

  T.push({
    id: 'plancha',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 25,
    req: [
      { k: 'prot', de: ['pollo', 'pescado', 'trucha', 'res', 'higado'], def: 'pollo' },
      { k: 'acomp', de: ['camote', 'papa', 'yuca', 'quinua', 'choclo', 'platano-isla', 'papa-amarilla', 'arroz'], def: 'arroz' },
    ],
    opt: [{ k: 'verd', de: ['lechuga', 'tomate', 'pepino', 'palta', 'brocoli', 'vainita', 'zanahoria'], max: 3 }],
    basicos: ['ajo', 'limon', 'comino', 'aceite', 'sal'],
    nombre: (p) => {
      const cruda = p.verd.some((x) => ['lechuga', 'tomate', 'pepino', 'palta'].includes(x));
      return `${cap(nom(p.prot[0]))} a la plancha con ${nom(p.acomp[0])}${cruda ? ' y ensalada' : p.verd.length ? ' y verduras' : ''}`;
    },
    pasos: (p, c) => {
      const a = p.acomp[0];
      const crudas = p.verd.filter((x) => ['lechuga', 'tomate', 'pepino', 'palta'].includes(x));
      const cocidas = p.verd.filter((x) => !crudas.includes(x));
      return [
        `Sazona ${nom(p.prot[0])} con ajo, limón y comino${c.bebe ? '' : ', sal y pimienta'}.`,
        COCCION.plancha[p.prot[0]],
        a === 'arroz' ? 'Sirve con arroz.' : a === 'quinua' ? 'Cocina la quinua en el doble de agua por 15 minutos.' : `Sancocha ${nom(a)}.`,
        cocidas.length ? `Cocina ${lista(cocidas)} al vapor 6 minutos.` : '',
        crudas.length ? `Prepara una ensalada con ${lista(crudas)}, limón y aceite.` : '',
      ];
    },
    tip: (p) => (p.verd.length ? 'Medio plato de verduras, un cuarto de proteína y un cuarto de acompañamiento: el plato saludable.' : 'Agrégale una ensalada para completar el plato saludable.'),
    vasco: 'Sin sal; desmenuza la proteína y aplasta el acompañamiento.',
  });

  T.push({
    id: 'pure',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 25,
    req: [
      { k: 'base', de: ['papa-amarilla', 'papa', 'camote', 'zapallo', 'yuca'], def: null },
      { k: 'prot', de: ['pollo', 'pescado', 'res', 'higado', 'huevo', 'sangrecita', 'atun'], def: 'huevo' },
    ],
    opt: [
      { k: 'lacteo', de: ['leche', 'mantequilla', 'queso'] },
      { k: 'verd', de: ['vainita', 'brocoli', 'zanahoria', 'espinaca'] },
    ],
    basicos: ['aceite', 'cebolla', 'sal'],
    nombre: (p) => `Puré de ${nom(p.base[0])} con ${nom(p.prot[0])}`,
    pasos: (p, c) => [
      `Sancocha ${nom(p.base[0])} y haz un puré${p.lacteo.length ? ` con ${nom(p.lacteo[0])}` : ''}${c.bebe ? ', sin sal' : ' con un poco de sal'}.`,
      COCCION.acompanar[p.prot[0]],
      p.verd.length ? `Cocina ${nom(p.verd[0])} al vapor y pica en trocitos.` : '',
      'Sirve el puré con la proteína encima.',
    ],
    tip: () => 'Un plato suave que también funciona para toda la familia.',
    vasco: 'Puré sin sal y la proteína bien desmenuzada.',
  });

  T.push({
    id: 'menestra',
    tipo: ['almuerzo'],
    plato: 'plato',
    min: 45,
    req: [{ k: 'menestra', de: MENESTRAS, def: null }],
    opt: [
      { k: 'verd', de: ['tomate', 'zanahoria', 'zapallo', 'espinaca', 'acelga'], max: 2 },
      { k: 'prot', de: ['huevo', 'pescado', 'res', 'pollo'] },
      { k: 'panca', de: ['aji-panca'] },
    ],
    basicos: ['cebolla', 'ajo', 'comino', 'aceite', 'sal', 'arroz'],
    nombre: (p) => `${GUISADA[p.menestra[0]]}${p.prot.length ? ' con ' + nom(p.prot[0]) : ''}`,
    pasos: (p, c) => [
      `Deja ${nom(p.menestra[0])} en remojo desde la noche y cocina hasta que estén suaves (40 minutos; 15 en olla a presión).`,
      `Haz un aderezo con cebolla, ajo${p.verd.includes('tomate') ? ', tomate' : ''}${p.panca.length && !c.bebe ? ', ají panca' : ''} y comino.`,
      `Agrégalo a la menestra${p.verd.filter((x) => x !== 'tomate').length ? ` con ${lista(p.verd.filter((x) => x !== 'tomate'))} picados` : ''} y cocina 10 minutos${c.bebe ? '' : ' con sal'}.`,
      p.prot.length ? COCCION.acompanar[p.prot[0]] || '' : '',
      'Sirve con arroz y una fruta cítrica de postre.',
    ],
    tip: () => 'La fruta cítrica de postre ayuda a absorber el hierro de las menestras.',
    vasco: 'Sin sal; aplasta un poco la menestra.',
  });

  T.push({
    id: 'arroz-verduras',
    tipo: ['almuerzo', 'cena'],
    plato: 'plato',
    min: 30,
    req: [
      { k: 'arroz', de: ['arroz'], def: 'arroz' },
      { k: 'verd', de: ['zanahoria', 'arveja', 'choclo', 'pimiento', 'vainita', 'brocoli', 'zapallito', 'champinon', 'espinaca'], def: null, max: 3 },
    ],
    opt: [
      { k: 'culantro', de: ['culantro'] },
      { k: 'prot', de: ['huevo', 'pollo', 'queso'] },
    ],
    minUsa: 2,
    basicos: ['cebolla', 'ajo', 'aceite', 'sal'],
    nombre: (p) => {
      const base = `${p.culantro.length ? 'Arroz verde' : 'Arroz'} con `;
      const pr = p.prot[0];
      if (pr === 'pollo') return base + lista(['pollo'].concat(p.verd));
      return base + lista(p.verd) + (pr === 'huevo' ? ' y huevo frito' : pr === 'queso' ? ' y queso fresco' : '');
    },
    pasos: (p, c) => [
      'Sofríe la cebolla y el ajo picados en aceite.',
      p.culantro.length ? 'Licúa el culantro con un poco de agua y agrégalo.' : '',
      p.prot[0] === 'pollo' ? 'Agrega el pollo en trozos y dóralo.' : '',
      `Suma ${lista(p.verd)} en cubitos y el arroz lavado; cubre con el doble de agua${c.bebe ? '' : ' con sal'}.`,
      'Tapa y cocina a fuego bajo 20 minutos.',
      p.prot[0] === 'huevo' ? 'Sirve con un huevo frito encima.' : p.prot[0] === 'queso' ? 'Sirve con queso fresco desmenuzado.' : '',
    ],
    tip: () => 'Arroz y verduras en una sola olla: menos platos que lavar.',
    vasco: 'Sin sal y con el arroz bien suave.',
  });

  T.push({
    id: 'batido',
    tipo: ['desayuno', 'lonche'],
    plato: 'taza',
    min: 5,
    req: [
      { k: 'fruta', de: FRUTAS_BATIDO, def: null, max: 2 },
      { k: 'lacteo', de: ['leche', 'yogurt'], def: 'leche' },
    ],
    opt: [{ k: 'avena', de: ['avena'] }],
    basicos: [],
    nombre: (p) => `Batido de ${lista(p.fruta)}${p.avena.length ? ' y avena' : ''}`,
    pasos: (p, c) => [
      `Licúa la fruta (${lista(p.fruta)}) con ${p.lacteo[0] === 'yogurt' ? (c.bebe ? '1/2 taza' : '1 taza') + ' de yogurt' : (c.bebe ? '1/2 taza' : '2 tazas') + ' de leche'}${p.avena.length ? ` y ${c.bebe ? '1 cucharada' : '3 cucharadas'} de avena` : ''}.`,
      'Sirve sin azúcar: la fruta madura ya endulza.',
    ],
    tip: () => 'Con la fruta entera llena más que un jugo.',
    vasco: 'En vasito abierto y sin azúcar.',
  });

  T.push({
    id: 'avena-fruta',
    tipo: ['desayuno'],
    plato: 'bowl',
    min: 12,
    req: [
      { k: 'grano', de: ['avena', 'quinua', 'kiwicha'], def: 'avena' },
      { k: 'leche', de: ['leche'], def: 'leche' },
    ],
    opt: [{ k: 'fruta', de: ['platano', 'manzana', 'pera', 'fresa', 'papaya', 'mango', 'lucuma'], max: 2 }],
    basicos: ['canela'],
    nombre: (p) => `${cap(nom(p.grano[0]))} con ${p.fruta.length ? lista(p.fruta) : 'leche y canela'}`,
    pasos: (p, c) => [
      p.grano[0] === 'avena' ? `Cocina la avena en ${c.bebe ? '1/2 taza' : '1 taza'} de agua con la canela por 5 minutos.` : `Lava la ${nom(p.grano[0])} y cocínala en el doble de agua con la canela por 15 a 20 minutos.`,
      'Agrega la leche y cocina 3 minutos más.',
      p.fruta.length ? `Sirve con ${lista(p.fruta)} picado: endulza sin azúcar.` : 'Sirve tibia, sin azúcar.',
    ],
    tip: () => 'Un desayuno que da energía hasta el almuerzo.',
    vasco: 'Su porción, tibia y con la fruta rallada o aplastada.',
  });

  T.push({
    id: 'ensalada-frutas',
    tipo: ['lonche', 'desayuno'],
    plato: 'bowl',
    min: 10,
    req: [{ k: 'frutas', de: FRUTAS, def: null, max: 3, min: 2 }],
    opt: [{ k: 'yogurt', de: ['yogurt'] }],
    basicos: [],
    nombre: (p) => `Ensalada de ${lista(p.frutas)}${p.yogurt.length ? ' con yogurt' : ''}`,
    pasos: (p) => [`Lava y pica ${lista(p.frutas)} en cubos.`, p.yogurt.length ? 'Sirve con el yogurt encima.' : 'Sirve fresca, sin azúcar.'],
    tip: () => 'Cuenta como una de las 3 frutas del día.',
    vasco: 'En trocitos pequeños; sin pepas y las frutas redondas cortadas en cuatro.',
  });

  V.PLANTILLAS = T;

  /* ---------- Generador ---------- */
  // Qué tipo de comida conviene ahora según la hora
  function tipoDeAhora(d) {
    const h = d.getHours();
    if (h < 10) return 'desayuno';
    if (h < 15) return 'almuerzo';
    if (h < 18) return 'lonche';
    return 'cena';
  }

  /* opts: { tengo, basicos, para: 'papas'|'vasco'|'ambos', avoid: [alérgenos], ahora: Date } */
  V.inventar = function (opts) {
    const tengo = new Set(opts.tengo);
    const bas = new Set(opts.basicos);
    const bebe = opts.para === 'vasco';
    const c = { bebe };
    const avoid = opts.avoid || [];
    const ahora = tipoDeAhora(opts.ahora || new Date());
    const out = [];

    T.forEach((t) => {
      const p = {};
      const faltan = [];
      const usados = new Set();
      let ok = true;
      t.req.forEach((r) => {
        if (!ok) return;
        const deTengo = r.de.filter((id) => tengo.has(id) && !usados.has(id));
        const deBas = r.de.filter((id) => bas.has(id) && !usados.has(id));
        const max = r.max || 1;
        const min = r.min || 1;
        let elegidos = deTengo.slice(0, max);
        if (elegidos.length < min) elegidos = elegidos.concat(deBas).slice(0, Math.max(min, elegidos.length));
        if (elegidos.length >= min) {
          p[r.k] = elegidos;
          elegidos.forEach((id) => usados.add(id));
        } else if (r.def && min === 1 && !usados.has(r.def)) {
          p[r.k] = [r.def];
          faltan.push(r.def);
          usados.add(r.def);
        } else ok = false;
      });
      if (!ok || faltan.length > 1) return;
      t.opt.forEach((o) => {
        p[o.k] = o.de.filter((id) => tengo.has(id) && !usados.has(id)).slice(0, o.max || 1);
        p[o.k].forEach((id) => usados.add(id));
      });

      const deRefri = [...usados].filter((id) => tengo.has(id));
      if (!deRefri.length || deRefri.length < (t.minUsa || 1)) return;
      // Si el plato deja sin usar la proteína que ya tienes, no sugiere comprar otra
      if (faltan.length && PROT.includes(faltan[0]) && opts.tengo.some((id) => PROT.includes(id) && !usados.has(id))) return;
      const todos = [...usados].concat(t.basicos.filter((id) => !(bebe && ['sal', 'pimienta', 'sillao', 'vinagre'].includes(id))));
      const alerg = Object.keys(V.ALERGENOS).filter((a) => V.ALERGENOS[a].ing.some((id) => todos.includes(id)));
      if (alerg.some((a) => avoid.includes(a))) return;

      const pasos = t.pasos(p, c).filter(Boolean);
      const nombre = t.nombre(p, c);
      const ing = [];
      const vistos = new Set();
      const push = (id, nota) => {
        if (vistos.has(id) || !ING[id]) return;
        vistos.add(id);
        ing.push([id, qty(id, c), nota]);
      };
      t.req.forEach((r) => p[r.k].forEach((id) => push(id, faltan.includes(id) ? 'te falta' : tengo.has(id) ? 'en tu refri' : 'de tu despensa')));
      t.opt.forEach((o) => p[o.k].forEach((id) => push(id, 'en tu refri')));
      t.basicos.forEach((id) => {
        if (bebe && ['sal', 'pimienta', 'sillao', 'vinagre', 'aji-amarillo', 'aji-panca'].includes(id)) return;
        push(id, 'de tu despensa');
      });

      const hero = [...usados].filter((id) => V.hasIcon(id) && !['sal', 'aceite', 'ajo', 'cebolla'].includes(id)).slice(0, 3);
      let score = deRefri.length * 5 - faltan.length * 7;
      if (t.tipo.includes(ahora)) score += 3;
      out.push({
        id: `idea-${t.id}-${[...usados].sort().join('-')}`,
        idea: true,
        plantilla: t.id,
        nombre: cap(nombre),
        tipo: t.tipo,
        plato: t.plato,
        hero: hero.length ? hero : [t.req[0].de[0]],
        min: t.min,
        ing,
        pasos,
        tip: t.tip(p, c),
        // «Los dos»: cómo separar su porción. Solo Vasco: la receta ya viene sin sal; recuerda la textura
        vascoNota:
          opts.para === 'papas'
            ? ''
            : (opts.para === 'ambos' ? t.vasco : 'Sírvelo tibio y en trocitos pequeños para que practique a masticar.') +
              (usados.has('atun') ? ' El atún en lata, bien escurrido y enjuagado, no más de 1 o 2 veces por semana.' : ''),
        usa: deRefri,
        faltan,
        n: deRefri.length,
        score,
      });
    });

    // Un plato por plantilla y sin nombres repetidos
    const vistos = new Set();
    const unicos = out
      .sort((a, b) => b.score - a.score || a.nombre.localeCompare(b.nombre, 'es'))
      .filter((x) => !vistos.has(x.nombre) && vistos.add(x.nombre));
    return {
      listos: unicos.filter((x) => !x.faltan.length),
      casi: unicos.filter((x) => x.faltan.length === 1),
    };
  };

  /* Pregunta lista para pedirle más ideas a una IA */
  V.preguntaIA = function (opts) {
    const tengo = opts.tengo.map((id) => ING[id].nombre.replace(/ \(.*\)/, '').toLowerCase());
    const bas = opts.basicos.map((id) => ING[id].nombre.replace(/ \(.*\)/, '').toLowerCase());
    let q = `Vivo en Lima. En casa tengo: ${tengo.join(', ')}. También tengo lo básico: ${bas.join(', ')}. `;
    if (opts.para === 'vasco') {
      q += `Dame 3 ideas de comidas fáciles para mi bebé de ${opts.edad}, sin sal, sin azúcar, sin miel y sin picante, en trocitos pequeños, con la cantidad para su porción y pasos cortos.`;
    } else {
      q += 'Dame 3 ideas de platos caseros peruanos fáciles para 2 adultos, con ingredientes de mercado, con la lista de ingredientes y pasos cortos. Dime si me falta algo.';
      if (opts.para === 'ambos') q += ` También tenemos un bebé de ${opts.edad}: dime cómo adaptar su porción (sin sal, sin azúcar, sin picante y en trocitos).`;
    }
    if (opts.avoid && opts.avoid.length) q += ` No podemos comer: ${opts.avoid.map((a) => V.ALERGENOS[a].nombre.toLowerCase()).join(', ')}.`;
    return q;
  };
})();
