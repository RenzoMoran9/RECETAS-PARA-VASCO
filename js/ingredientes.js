/* Ingredientes del mercado peruano usados en las recetas de Vasco.
   cat: categoría para la lista de compras. basico: suele haber en casa. */
(function () {
  const V = (window.VASCO = window.VASCO || {});

  V.CATEGORIAS = [
    { id: 'frutas', nombre: 'Frutas' },
    { id: 'verduras', nombre: 'Verduras y hierbas' },
    { id: 'tuberculos', nombre: 'Papas y tubérculos' },
    { id: 'granos', nombre: 'Cereales y granos andinos' },
    { id: 'menestras', nombre: 'Menestras' },
    { id: 'proteinas', nombre: 'Carnes, pescado y huevos' },
    { id: 'lacteos', nombre: 'Lácteos' },
    { id: 'despensa', nombre: 'Despensa' },
  ];

  const I = (nombre, cat, extra) => Object.assign({ nombre, cat }, extra || {});

  V.ING = {
    // Frutas
    platano: I('Plátano de seda', 'frutas'),
    'platano-isla': I('Plátano de isla', 'frutas'),
    manzana: I('Manzana', 'frutas'),
    pera: I('Pera', 'frutas'),
    papaya: I('Papaya', 'frutas'),
    mango: I('Mango', 'frutas'),
    granadilla: I('Granadilla', 'frutas'),
    chirimoya: I('Chirimoya', 'frutas'),
    lucuma: I('Lúcuma', 'frutas'),
    fresa: I('Fresa', 'frutas'),
    mandarina: I('Mandarina', 'frutas'),
    naranja: I('Naranja', 'frutas'),
    aguaymanto: I('Aguaymanto', 'frutas'),
    palta: I('Palta', 'frutas'),
    sandia: I('Sandía', 'frutas'),
    melon: I('Melón', 'frutas'),
    pina: I('Piña', 'frutas'),
    limon: I('Limón', 'frutas', { basico: true }),

    // Verduras y hierbas
    zapallo: I('Zapallo macre', 'verduras'),
    zanahoria: I('Zanahoria', 'verduras'),
    brocoli: I('Brócoli', 'verduras'),
    espinaca: I('Espinaca', 'verduras'),
    acelga: I('Acelga', 'verduras'),
    vainita: I('Vainita', 'verduras'),
    arveja: I('Arveja verde', 'verduras'),
    tomate: I('Tomate', 'verduras'),
    cebolla: I('Cebolla roja', 'verduras', { basico: true }),
    'cebolla-china': I('Cebolla china', 'verduras'),
    ajo: I('Ajo', 'verduras', { basico: true }),
    choclo: I('Choclo', 'verduras'),
    zapallito: I('Zapallito italiano', 'verduras'),
    culantro: I('Culantro', 'verduras'),
    perejil: I('Perejil', 'verduras'),
    hierbabuena: I('Hierbabuena', 'verduras'),
    albahaca: I('Albahaca', 'verduras'),
    kion: I('Kion', 'verduras'),

    // Tubérculos
    papa: I('Papa blanca', 'tuberculos'),
    'papa-amarilla': I('Papa amarilla', 'tuberculos'),
    camote: I('Camote', 'tuberculos'),
    yuca: I('Yuca', 'tuberculos'),
    olluco: I('Olluco', 'tuberculos'),
    'papa-seca': I('Papa seca', 'tuberculos'),

    // Cereales y granos
    quinua: I('Quinua', 'granos'),
    avena: I('Avena en hojuelas', 'granos'),
    kiwicha: I('Kiwicha', 'granos'),
    canihua: I('Cañihua (cañihuaco)', 'granos'),
    arroz: I('Arroz', 'granos', { basico: true }),
    fideos: I('Fideos', 'granos'),
    pan: I('Pan francés', 'granos'),
    'maiz-morado': I('Maíz morado', 'granos'),
    chuno: I('Chuño (fécula de papa)', 'granos'),

    // Menestras
    lentejas: I('Lentejas', 'menestras'),
    frejol: I('Frejol canario', 'menestras'),
    garbanzo: I('Garbanzos', 'menestras'),
    'arveja-partida': I('Arveja partida', 'menestras'),

    // Carnes, pescado y huevos
    pollo: I('Pollo', 'proteinas'),
    higado: I('Hígado de pollo', 'proteinas'),
    sangrecita: I('Sangrecita de pollo', 'proteinas'),
    bazo: I('Bazo de res', 'proteinas'),
    res: I('Carne de res', 'proteinas'),
    pescado: I('Pescado (jurel, bonito, caballa)', 'proteinas'),
    trucha: I('Trucha', 'proteinas'),
    huevo: I('Huevos', 'proteinas'),

    // Lácteos
    leche: I('Leche entera', 'lacteos'),
    queso: I('Queso fresco', 'lacteos'),
    yogurt: I('Yogurt natural sin azúcar', 'lacteos'),
    mantequilla: I('Mantequilla', 'lacteos', { basico: true }),

    // Despensa
    aceite: I('Aceite vegetal o de oliva', 'despensa', { basico: true }),
    canela: I('Canela en rama y molida', 'despensa', { basico: true }),
    mani: I('Pasta de maní (100 % maní)', 'despensa'),
    pecanas: I('Pecanas', 'despensa'),
    palillo: I('Palillo (cúrcuma)', 'despensa', { basico: true }),
  };

  // Alimentos de origen animal ricos en hierro (prioridad MINSA contra la anemia)
  V.HIERRO_ANIMAL = ['sangrecita', 'higado', 'bazo', 'res', 'pescado', 'trucha'];
  V.PESCADOS = ['pescado', 'trucha'];

  V.ALERGENOS = {
    huevo: { nombre: 'Huevo', ing: ['huevo'] },
    pescado: { nombre: 'Pescado', ing: ['pescado', 'trucha'] },
    lacteos: { nombre: 'Lácteos', ing: ['leche', 'queso', 'yogurt', 'mantequilla'] },
    gluten: { nombre: 'Gluten (trigo, avena)', ing: ['pan', 'fideos', 'avena'] },
    mani: { nombre: 'Maní y frutos secos', ing: ['mani', 'pecanas'] },
  };
})();
