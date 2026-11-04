# Recetas para la familia

App para el celular con el menú semanal de la familia: el de **Vasco** (12 a 23 meses) y el de
los **papás**, con recetas peruanas fáciles, ilustraciones de cada alimento, **Mi refri** para
saber qué cocinar con lo que hay en casa, lista del mercado de toda la familia y guías de
alimentación.

Funciona sin internet una vez instalada y guarda todo en el mismo teléfono (no necesita cuenta).

Enlace: https://renzomoran9.github.io/RECETAS-PARA-VASCO/ (con mayúsculas, tal cual).

## Qué tiene

Arriba se elige de quién es el menú: **Vasco** o **Papás**.

- **Menú**: cada perfil tiene su semana, con horarios.
  - **Vasco**: 5 comidas al día (desayuno, media mañana, almuerzo, media tarde y cena).
  - **Papás**: 4 comidas (desayuno, almuerzo, lonche y cena).
  - Cada lunes se arma un menú nuevo. En cada comida está **Ver otras opciones** y **Sorpréndeme**.
  - Cuando el plato de los papás y el de Vasco salen de la misma olla, aparece **Misma olla**.
- **Recetas**: 61 recetas para Vasco (sin sal, azúcar ni picante) y 58 para los papás (para
  2 personas, con pocos ingredientes de mercado). Hay buscador y filtros: favoritas, rápidas,
  pocos ingredientes, con pescado, con menestras, ricas en hierro y "también para Vasco".
  - 27 recetas de los papás enlazan a la versión de Vasco del mismo plato (ají de gallina,
    arroz con pollo, seco, sudado, causa, locro…).
- **Mi refri**: marcas lo que tienes, escribiéndolo o con dibujos, y la app te dice:
  - **Puedes preparar ya**: platos que salen con lo que tienes.
  - **Te falta poco**: platos a los que les faltan 1 o 2 ingredientes, y cuáles son, con un
    botón para mandarlos a la lista del mercado.
  - Se elige para quién se cocina: papás, Vasco o los dos. Si son los dos, junta el plato de
    los papás con la versión de Vasco.
- **Compras**: la lista del mercado de la semana para toda la familia, solo Vasco o solo los
  papás. Incluye lo que agregaste desde Mi refri o desde una receta. Se comparte por WhatsApp.
- **Guía**:
  - **Vasco**: cuánto y cuántas veces come, lo que no debe faltar, atoros, anemia, etc.
  - **Papás**: el plato saludable, los mensajes del MINSA, sal y octógonos, si das de lactar,
    cómo cocinar fácil entre semana.
- **Ajustes**: nombre y fecha de nacimiento de Vasco, horarios de cada perfil y alimentos que
  cada uno debe evitar (sus recetas no aparecen en el menú ni en Mi refri).

### Cómo arma los menús

- **Vasco**: todos los días un alimento de origen animal rico en hierro, pescado 2 a 4 veces
  por semana, menestras al menos 2 veces, fruta, verdura y lácteo cada día.
- **Papás**: verduras en el almuerzo y la cena, fruta todos los días, proteína en el almuerzo,
  pescado al menos 2 veces por semana, menestras al menos 2 veces, hígado, sangrecita o bazo
  al menos una vez y carne roja hasta 3 veces. Prefiere los platos que comparten olla con Vasco.
- En los dos: nada se repite en el mismo día. Lo que "les encantó" aparece más seguido y lo que
  "no gustó", menos.

### Cómo decide Mi refri

Revisa cada receta ingrediente por ingrediente:

1. Si lo tienes, lo usa.
2. Si tienes algo que lo reemplaza (papa amarilla por papa blanca, acelga por espinaca,
   perejil por culantro…), usa eso y te lo dice.
3. Lo básico de la cocina se da por hecho: aceite, sal, pimienta, comino, orégano, ajo,
   cebolla, limón, arroz, sillao, vinagre, canela y palillo. Se puede cambiar en la misma
   pantalla.
4. Los ingredientes opcionales no hacen falta.
5. Lo demás es lo que falta.

Ordena las sugerencias por cuántos de tus ingredientes usa y por si tienes el ingrediente
principal (la proteína o la menestra).

## Fuentes

- MINSA / INS. *Guías Alimentarias para niñas y niños menores de 2 años de edad*.
- MINSA. *Guías Alimentarias para la Población Peruana* (2019): 12 mensajes, medio plato de
  verduras, 3 frutas al día, pescado al menos 2 veces por semana, 6 a 8 vasos de agua, menos
  de 5 g de sal, 30 minutos de actividad física.
- MINSA / INS. *Lineamientos de Nutrición Materno Infantil del Perú*: para la madre que da de
  lactar, 3 comidas y 2 raciones adicionales, suplemento de hierro y ácido fólico, sal yodada.
- OMS. *Alimentación sana* y *Guía de alimentación complementaria de 6 a 23 meses* (2023).
- AAP (HealthyChildren.org) y CDC: alimentos con riesgo de atoro.
- Mayo Clinic: alimentación durante la lactancia.

La app es una ayuda práctica y no reemplaza al pediatra, al control CRED ni al médico.

## Cómo instalarla en el celular

La app se publica con GitHub Pages desde esta rama (Settings → Pages → Deploy from a branch).

- **Android (Chrome)**: abre el enlace, toca el menú **⋮** y elige **Instalar app**.
- **iPhone (Safari)**: abre el enlace, toca **Compartir** y elige **Agregar a pantalla de inicio**.

Si sale «No se pudo abrir la aplicación», en **Ajustes → Instalar en el celular** hay una ayuda
paso a paso. Lo más común:
- abrirla desde WhatsApp en vez de Chrome;
- tener poco espacio libre;
- en Xiaomi, el permiso de accesos directos de Chrome.

Cada celular guarda su propio menú, favoritas, Mi refri y lista.

## Para editar

Es HTML, CSS y JavaScript sin dependencias ni compilación.

| Archivo | Contenido |
| --- | --- |
| `js/recetas.js` | Recetario de Vasco |
| `js/papas.js` | Recetario, horarios, guía y consejos de los papás |
| `js/ingredientes.js` | Ingredientes, categorías del mercado, alérgenos, despensa básica y sustitutos |
| `js/guia.js` | Horarios, guía, consejos y fuentes de Vasco |
| `js/planner.js` | Perfiles, reglas del menú semanal y lista de compras |
| `js/cocina.js` | Motor de Mi refri |
| `js/icons.js` | Ilustraciones SVG de alimentos, platos y avatares |
| `js/app.js` | Pantallas y navegación |
| `css/app.css` | Estilos (modo claro y oscuro) |
| `sw.js` | Funcionamiento sin internet |

Para probarla en la computadora, ejecuta `python3 -m http.server` en esta carpeta y abre
`http://localhost:8000`. Al cambiar archivos, sube la versión en `sw.js` (`familia-v4` →
`familia-v5`) para que los celulares reciban la actualización.

Herramientas de desarrollo en `tools/` (necesitan Node y Playwright):

- `node tools/test-planner.mjs`: revisa los datos, las reglas de los menús de los dos perfiles
  y las respuestas de Mi refri.
- `node tools/make-icons.mjs`: regenera los íconos de la app.
- `node tools/screens.mjs http://localhost:8000/ carpeta light`: capturas en tamaño celular.
- `node tools/build-artifact.mjs salida.html`: una versión de un solo archivo para vista previa.
