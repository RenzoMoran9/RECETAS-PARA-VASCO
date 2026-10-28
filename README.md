# Recetas para Vasco

App para el celular con el menú semanal de Vasco (12 a 23 meses): desayuno, media mañana,
almuerzo, media tarde y cena de lunes a domingo, con recetas peruanas, ilustraciones de cada
alimento, lista del mercado y una guía de alimentación para su edad.

Funciona sin internet una vez instalada y guarda todo en el mismo teléfono (no necesita cuenta).

## Qué tiene

- **Menú**: 5 comidas por día con sus horarios. Cada lunes se arma un menú nuevo. En cada comida
  puedes tocar **Ver otras opciones** para cambiarla, o **Sorpréndeme**. También puedes ver la
  semana siguiente para planificar.
- **Recetas**: 61 recetas sin sal, sin azúcar y sin picante (13 desayunos, 18 refrigerios,
  22 almuerzos y 18 cenas; algunas sirven para más de un momento). Buscador, filtros
  (ricas en hierro, con pescado, rápidas, favoritas) y **Lo que tengo en casa**.
- **Cada receta**: ingredientes con dibujo y cantidad para su porción, pasos, por qué le hace
  bien, un consejo para su desarrollo y sus sentidos, y botones para marcar si le gustó.
- **Compras**: la lista del mercado de la semana agrupada por puesto, para marcar y compartir
  por WhatsApp.
- **Guía**: cuánto y cuántas veces come, lo que no debe faltar, nutrientes para su cerebro y
  sus sentidos, lo que no se le da, atoros, anemia, comer en familia, higiene y qué hacer si
  se enferma.
- **Ajustes**: nombre, fecha de nacimiento (para mostrar su edad), horarios según sus siestas y
  alimentos que debe evitar por alergia.

El menú se arma solo con estas reglas: todos los días hay un alimento de origen animal rico en
hierro en el almuerzo o la cena, pescado 2 a 4 veces por semana, menestras al menos 2 veces,
fruta, verdura y lácteo cada día, y ninguna receta se repite en el mismo día. Las recetas que
"le encantaron" aparecen más seguido; las que "no quiso" aparecen menos, pero vuelven de vez en
cuando.

## Fuentes

- MINSA / INS. *Guías Alimentarias para niñas y niños menores de 2 años de edad*:
  3 comidas principales y 2 refrigerios, 1 plato mediano (7 a 10 cucharadas), alimentos de
  origen animal todos los días, sin sal ni azúcar, lácteos desde los 12 meses, agua segura
  150 a 240 ml, lactancia hasta los 2 años o más.
- OMS (2023). *Guideline for complementary feeding of infants and young children 6–23 months*.
- AAP (HealthyChildren.org) y CDC: alimentos con riesgo de atoro.

La app es una ayuda práctica y no reemplaza al pediatra ni al control CRED.

## Cómo instalarla en el celular

La app es una página web instalable (PWA). Primero hay que publicarla con GitHub Pages:

1. En GitHub, entra a **Settings → Pages** de este repositorio.
2. En **Build and deployment**, elige **Deploy from a branch**, la rama con la app y la carpeta
   **/ (root)**. Guarda.
3. En un par de minutos estará en `https://renzomoran9.github.io/RECETAS-PARA-VASCO/`.

Luego, en cada celular:

- **Android (Chrome)**: abre el enlace, toca el menú **⋮** y elige **Instalar app** (o usa el
  botón **Instalar** que aparece en la app).
- **iPhone (Safari)**: abre el enlace, toca **Compartir** y elige **Agregar a pantalla de inicio**.

Cada celular guarda su propio menú, favoritas y lista.

## Para editar

Es HTML, CSS y JavaScript sin dependencias ni compilación.

| Archivo | Contenido |
| --- | --- |
| `js/recetas.js` | Recetario (ingredientes, pasos, consejos) |
| `js/ingredientes.js` | Ingredientes, categorías del mercado y alérgenos |
| `js/guia.js` | Horarios, guía, consejos del día y fuentes |
| `js/planner.js` | Reglas del menú semanal y lista de compras |
| `js/icons.js` | Ilustraciones SVG de cada alimento y de los platos |
| `js/app.js` | Pantallas y navegación |
| `css/app.css` | Estilos (modo claro y oscuro) |
| `sw.js` | Funcionamiento sin internet |

Para probarla en la computadora: `python3 -m http.server` en esta carpeta y abrir
`http://localhost:8000`. Al cambiar archivos, sube la versión en `sw.js` (`vasco-v1` → `vasco-v2`)
para que los celulares reciban la actualización.

Herramientas de desarrollo en `tools/` (necesitan Node y Playwright):

- `node tools/test-planner.mjs`: revisa que todas las recetas tengan ingredientes e ilustraciones
  válidos y que los menús generados cumplan las reglas.
- `node tools/make-icons.mjs`: regenera los íconos de la app.
- `node tools/screens.mjs http://localhost:8000/ carpeta light`: capturas en tamaño celular.
- `node tools/build-artifact.mjs salida.html`: una versión de un solo archivo para vista previa.
