/* Guía de alimentación para 12 a 23 meses.
   Basada en: Guías Alimentarias para niñas y niños menores de 2 años (MINSA/INS),
   Guía de alimentación complementaria de la OMS (2023) y recomendaciones de la AAP/CDC sobre atoros. */
(function () {
  const V = (window.VASCO = window.VASCO || {});

  // Tiempos de comida: 3 principales + 2 refrigerios (MINSA, 12 a 23 meses)
  V.TIEMPOS = [
    { key: 'desayuno', nombre: 'Desayuno', tipo: 'desayuno', hora: '07:30' },
    { key: 'mm', nombre: 'Media mañana', tipo: 'refrigerio', hora: '10:00' },
    { key: 'almuerzo', nombre: 'Almuerzo', tipo: 'almuerzo', hora: '12:30' },
    { key: 'mt', nombre: 'Media tarde', tipo: 'refrigerio', hora: '15:30' },
    { key: 'cena', nombre: 'Cena', tipo: 'cena', hora: '18:30' },
  ];

  V.TIPOS = {
    desayuno: { nombre: 'Desayuno', plural: 'Desayunos' },
    refrigerio: { nombre: 'Refrigerio', plural: 'Refrigerios' },
    almuerzo: { nombre: 'Almuerzo', plural: 'Almuerzos' },
    cena: { nombre: 'Cena', plural: 'Cenas' },
  };

  V.GUIA = [
    {
      id: 'cuanto',
      titulo: '¿Cuánto y cuántas veces come?',
      icon: 'quinua',
      abierto: true,
      puntos: [
        '<b>5 comidas al día:</b> 3 principales (desayuno, almuerzo y cena) y 2 refrigerios (media mañana y media tarde).',
        '<b>Comidas principales:</b> 1 plato mediano, de 7 a 10 cucharadas.',
        '<b>Refrigerios:</b> porciones pequeñas; de preferencia con fruta y un lácteo (leche, queso o yogur).',
        '<b>Consistencia:</b> los mismos alimentos de la olla familiar, en trocitos pequeños.',
        '<b>Lactancia materna:</b> continúa a libre demanda hasta los 2 años o más.',
        '<b>Agua segura:</b> hervida o tratada, entre 150 y 240 ml al día, en vasito.',
      ],
    },
    {
      id: 'cada-dia',
      titulo: 'Lo que no debe faltar cada día',
      icon: 'higado',
      puntos: [
        '<b>Un alimento de origen animal rico en hierro:</b> sangrecita, hígado, bazo, carne de res o pescado. Además pollo y huevo.',
        '<b>Frutas y verduras de colores:</b> amarillas y naranjas (zapallo, zanahoria, papaya, mango), verdes (espinaca, brócoli, acelga).',
        '<b>Lácteos desde los 12 meses:</b> leche entera hervida o pasteurizada, queso fresco o yogur natural.',
        '<b>Menestras y granos andinos:</b> lentejas, frejoles, arveja partida, quinua, kiwicha y cañihua.',
        '<b>Un poquito de grasa buena:</b> una cucharadita de aceite vegetal o mantequilla, o palta.',
        '<b>Pescado azul 2 o 3 veces por semana:</b> jurel, bonito, caballa, anchoveta o trucha.',
      ],
    },
    {
      id: 'sentidos',
      titulo: 'Para su cerebro y sus sentidos',
      icon: 'pescado',
      puntos: [
        '<b>Hierro</b> (sangrecita, hígado, bazo, carne, pescado): para su atención, memoria y aprendizaje.',
        '<b>Omega 3</b> (jurel, bonito, caballa, trucha): para su cerebro y su vista.',
        '<b>Vitamina A</b> (zapallo, zanahoria, camote, mango, hígado): para ver bien.',
        '<b>Colina</b> (huevo, hígado): para su memoria.',
        '<b>Calcio</b> (leche, queso, yogur, kiwicha): para huesos y dientes.',
        '<b>Vitamina C</b> (mandarina, naranja, aguaymanto, papaya, fresa): para sus defensas y para absorber el hierro.',
        '<b>Sus sentidos se entrenan comiendo:</b> deja que toque, huela y explore texturas, colores y temperaturas. Nómbrale los alimentos.',
      ],
    },
    {
      id: 'evitar',
      titulo: 'Lo que no le damos',
      icon: 'agua',
      puntos: [
        '<b>Sal:</b> no se agrega a su comida. Separa su porción antes de salar la olla de la familia.',
        '<b>Azúcar, panela y miel:</b> no se agregan. La fruta madura endulza.',
        '<b>Bebidas azucaradas:</b> gaseosas, refrescos en polvo, jugos o néctares envasados.',
        '<b>Ultraprocesados:</b> embutidos (hot dog, jamonada), galletas dulces, snacks, comida rápida.',
        '<b>Té, café o mates con las comidas:</b> reducen la absorción del hierro.',
        '<b>Alimentos crudos de riesgo:</b> ceviche, tiradito, huevo crudo o a medio cocer.',
        '<b>Picante:</b> nada de ají o rocoto en su porción.',
        '<b>Pescados grandes:</b> tollo, tiburón o pez espada (tienen más mercurio).',
      ],
    },
    {
      id: 'atoros',
      titulo: 'Cuidado con los atoros',
      icon: 'uva',
      puntos: [
        'Siempre <b>sentado</b> y con un adulto mirándolo. Nunca mientras camina, juega o va en el carro.',
        '<b>Uvas, aguaymantos y tomates cherry:</b> siempre cortados a lo largo en 4.',
        '<b>Maní, pecanas y nueces:</b> solo molidos o en pasta untada delgadita, nunca enteros.',
        '<b>Canchita, popcorn y caramelos:</b> no a su edad.',
        '<b>Choclo:</b> granos aplastados, no enteros.',
        '<b>Manzana y zanahoria crudas:</b> ralladas o cocidas hasta que estén suaves.',
        '<b>Pescado:</b> revisa con los dedos que no tenga espinas.',
        '<b>Salchichas:</b> además de ser ultraprocesadas, son de las que más atoran.',
      ],
    },
    {
      id: 'anemia',
      titulo: 'Hierro y anemia',
      icon: 'sangrecita',
      puntos: [
        'La anemia afecta a muchos niños peruanos y puede frenar su desarrollo. La comida rica en hierro es la mejor prevención.',
        'Dale <b>2 cucharadas de alimento de origen animal rico en hierro</b> en sus comidas principales.',
        'Acompaña con <b>fruta con vitamina C</b> de postre, no con té ni mates.',
        'Continúa el <b>suplemento de hierro</b> como te indiquen en su control CRED o su pediatra.',
        'Haz su <b>control de hemoglobina</b> cuando le toque.',
      ],
    },
    {
      id: 'perceptiva',
      titulo: 'Comer en familia, sin apuros',
      icon: 'palta',
      puntos: [
        '<b>Sin pantallas:</b> apaga la tele y guarda el celular durante la comida.',
        '<b>Su propio plato, cuchara y vaso.</b> Déjalo comer solito aunque se ensucie.',
        '<b>Siéntalo con la familia</b>, frente a ustedes. Aprende mirándolos comer.',
        '<b>Respeta sus señales:</b> si voltea la cara o cierra la boca, ya se llenó. No lo fuerces ni lo premies con dulces.',
        '<b>Paciencia:</b> a veces necesita probar un alimento nuevo 8 a 10 veces antes de aceptarlo.',
        'Háblale con cariño y responde a lo que te pide con gestos o palabras.',
      ],
    },
    {
      id: 'higiene',
      titulo: 'Higiene y conservación',
      icon: 'limon',
      puntos: [
        'Lávate las manos con agua y jabón antes de cocinar y de darle de comer. Lava también sus manitos.',
        'Lava frutas y verduras con agua segura.',
        'Cocina bien carnes, hígado, sangrecita, pescado y huevo.',
        'Guarda lo que sobre en la refri, tapado, y úsalo en 24 horas. Calienta solo lo que va a comer.',
        'Lo que dejó en su plato ya no se guarda.',
      ],
    },
    {
      id: 'enfermo',
      titulo: 'Cuando está enfermo',
      icon: 'mandarina',
      puntos: [
        'Ofrécele <b>porciones pequeñas más veces al día</b>.',
        'Dale más pecho y más líquidos (agua segura).',
        'Prefiere preparaciones suaves que le gusten, siempre espesas.',
        'Cuando se recupere, dale una comida extra al día por unas semanas.',
        'Si tiene fiebre alta, vómitos, diarrea persistente o no quiere tomar líquidos, llévalo a su centro de salud.',
      ],
    },
  ];

  V.TIPS = [
    'Separa la porción de Vasco antes de echarle sal o ají a la olla de la familia.',
    'Dos cucharadas de sangrecita, hígado, bazo o pescado al día ayudan a prevenir la anemia.',
    'De postre, una fruta con vitamina C (mandarina, naranja, papaya) ayuda a absorber el hierro.',
    'Si hoy no quiso un alimento, vuelve a ofrecérselo otro día. A veces necesita 8 a 10 intentos.',
    'Apaga la tele durante la comida: así Vasco presta atención a los sabores y a sus señales de llenura.',
    'Deja que coma con la mano: tocar la comida también es aprender.',
    'Agua segura en vasito entre comidas: sin jugos ni refrescos.',
    'Las preparaciones espesas alimentan más que las sopas aguadas.',
    'Pescado azul (jurel, bonito, caballa) 2 o 3 veces por semana para su cerebro.',
    'Cocina el domingo: deja menestras remojadas, quinua cocida y galletitas listas para la semana.',
    'Uvas y aguaymantos siempre cortados a lo largo en 4.',
    'Nombra los colores y las formas de su comida: estimulas su lenguaje.',
    'Ofrécele leche, queso o yogur en sus refrigerios: calcio para sus huesos.',
    'Continúa con la lactancia materna: sigue protegiéndolo hasta los 2 años o más.',
    'No uses la comida como premio ni como castigo.',
    'Un alimento nuevo a la vez, junto con otro que ya le guste.',
    'Lávale las manitos antes de comer: también se las va a llevar a la boca.',
    'Revisa las espinas del pescado con los dedos antes de servirlo.',
  ];

  V.FUENTES = [
    {
      nombre: 'MINSA / INS – Guías Alimentarias para niñas y niños menores de 2 años',
      url: 'https://cdn.www.gob.pe/uploads/document/file/1811895/Gu%C3%ADas%20Alimentarias%20para%20ni%C3%B1os%20y%20ni%C3%B1as%20menores%20a%202%20a%C3%B1os%20de%20edad.pdf',
    },
    {
      nombre: 'OMS – Guía de alimentación complementaria de 6 a 23 meses (2023)',
      url: 'https://www.who.int/publications/i/item/9789240081864',
    },
    {
      nombre: 'AAP (HealthyChildren.org) – Prevención de atoros',
      url: 'https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx',
    },
    {
      nombre: 'CDC – Alimentos con riesgo de atoro en niños pequeños',
      url: 'https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html',
    },
  ];
})();
