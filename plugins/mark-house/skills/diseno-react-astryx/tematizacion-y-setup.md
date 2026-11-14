# Instalación, CSS, temas y CLI

> Basado en la documentación de Astryx 0.7.17 (Beta). **Probados** con 0.7.16 en un proyecto Vite real: `help`, `init`, `build`, `search`, `template` (con `--type page` y `--skeleton`), `component --json`, `docs --index`, `theme add` y `doctor --built` (detalles y trampas en [recetas-probadas.md](recetas-probadas.md)). **Sin probar**: `theme build/eject/palette`, `swizzle`, `upgrade`, el editor experimental de temas y el servidor MCP.

## Instalar
Requiere **React 19+**. Paquetes: `@astryxdesign/core`, `@stylexjs/stylex` (peer), un tema (`@astryxdesign/theme-neutral`) y, como dev, `@astryxdesign/cli`.
```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
npm install -D @astryxdesign/cli
npx astryx init        # escribe AGENTS.md / CLAUDE.md con el resumen para agentes (no interactivo)
```
CLI global opcional (`npm i -g @astryxdesign/cli`) para que `astryx` funcione en cualquier carpeta; dentro de un proyecto manda la versión del proyecto. **Recomendado: ambos.** Para invocaciones fiables de agentes agrega un script y úsalo con `npm run astryx -- component --list`:
```json
"scripts": { "astryx": "node node_modules/@astryxdesign/cli/clients/cli/bin/astryx.mjs" }
```
Actualizar (todos los paquetes `@astryxdesign/*` a la misma versión, y migrar con codemods): `astryx upgrade --from <versión anterior> --apply`.

## Tres caminos de CSS (se pueden mezclar)
| Camino | Para quién | ¿Build extra? |
|---|---|---|
| **CSS plano** | La mayoría. Estilos con `className`, `xstyle` o cualquier librería CSS | No |
| **Tailwind v4** | Apps con Tailwind; un puente CSS mapea utilidades a tokens | Solo el de Tailwind |
| **StyleX en tu código** | Tu propio `stylex.create()` o componentes "swizzled" | Sí: plugin StyleX para tu código |

```css
/* globals.css — plano */
@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css";
@import "@astryxdesign/theme-neutral/theme.css";
```
```css
/* globals.css — Tailwind v4: la declaración de capas es CRÍTICA o className deja de ganar */
@layer reset, theme, base, astryx-base, astryx-theme, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css";
@import "@astryxdesign/theme-neutral/theme.css";
@import "@astryxdesign/core/tailwind-theme.css";   /* puente: text-primary, bg-surface, rounded-lg… */
@import "tailwindcss/utilities.css" layer(utilities);
```
| Import | Capa | Qué hace |
|---|---|---|
| `reset.css` | reset | Reset entre navegadores (cero especificidad con `:where()`) |
| `astryx.css` | astryx-base | Estilos de componentes. Obligatorio en todos los caminos |
| `richtext.css`, `lab.css`, `charts.css` | astryx-base | Hojas de otros paquetes; después de `astryx.css` |
| `theme.css` | astryx-theme | Tokens como variables CSS |
| `tailwind-theme.css` | — | Puente Tailwind v4, solo ese camino |

Si el proyecto ya tiene CSS global o un reset viejo, declara el orden de capas y asigna cada hoja a una capa a propósito: los estilos sin capa y las capas posteriores ganan a `astryx-base`. Tailwind v3 requiere el rodeo de capas descrito en la guía de migración de Astryx.

**StyleX para tu código**: apunta el compilador solo a **tu** código, jamás a `node_modules/@astryxdesign`. Plugins: Webpack `@stylexjs/webpack-plugin`; Vite/Rollup `@stylexjs/rollup-plugin`; Babel `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin`; Next.js (conservando `next/font`) `@stylexswc/nextjs-plugin`. Si una plantilla falla con "Unexpected stylex.create call at runtime", falta el compilador.

Capacidades de StyleX (v0.19.x) para no hacer rodeos de JS: sí `@media`, `@supports`, `@container`, `@starting-style`, `@scope`, `:hover/:focus-visible/:has()/:not()`, `light-dark()`, `color-mix()`, `stylex.when.ancestor(...)`, `stylex.firstThatWorks()`, `stylex.positionTry()`; **no** `@layer` ni `@property` explícitos, ni la abreviatura `animation` (usa longhands), ni anidado CSS con `&`. Hover del padre sobre hijo: `stylex.when.ancestor(':hover', marker)` con `stylex.defineMarker()`; nunca `defaultMarker()` en controles de formulario.

## Tema
```tsx
import {Theme} from '@astryxdesign/core/theme';
import {themes, defaultThemeSlug} from './astryx-themes';   // lo genera `astryx theme add`

<Theme theme={themes[defaultThemeSlug]}>   {/* mode: 'system' (default) | 'light' | 'dark' */}
  <App />
</Theme>
```
| Comando | Qué hace |
|---|---|
| `astryx theme list` | Temas disponibles |
| `astryx theme add <slug>` | Registra un tema instalado y regenera `src/astryx-themes.ts` (CSS de producción + fuentes) |
| `astryx theme use <slug>` / `remove <slug>` | Cambia el default / quita uno que no sea default |
| `astryx theme eject <slug>` | Copia su código a tu proyecto como bifurcación independiente (ya no recibe actualizaciones) |
| `astryx theme build <archivo>` | Compila un tema propio a artefactos de producción (necesario en SSR: Next.js, Remix) |
| `astryx theme palette generate palette.config.json --out …` | Genera 21 tonos (0–100, claro y oscuro) desde colores semilla |
| `astryx theme template` | Escribe `theme.template.ts`: mapa anotado de todo `defineTheme` |
| `astryx theme targets [Nombre]` | Qué es tematizable |

Temas de primera parte: **neutral, butter, chocolate, matcha, stone, gothic, y2k** (`@astryxdesign/theme-<nombre>`). Tras actualizar Astryx, reconstruye todo tema propio prebuilt y despliega los archivos regenerados juntos.

### Modo oscuro
Tuplas `[claro, oscuro]` en los valores de token: `'--color-accent': ['#0064E0', '#2694FE']`. `Theme mode="system"` sigue al SO. Para un conmutador: `useState<'light'|'dark'>` y `<Theme mode={mode}>`. **Temas anidados**: envuelve una sección en otro `<Theme>` (barra lateral oscura con contenido claro).

### Crear o cambiar un tema: el CLI recomienda el editor experimental (sin probar)
`astryx experimental theme editor new <nombre> --like neutral`, luego `editor set <nombre> <cosa> <valor>` o `editor how "<lo que quieres>"`, conecta con `astryx theme add <nombre>` y **después de cada cambio mira** `astryx experimental theme editor show <nombre> --png` (fotos de componentes reales, no toca la app). Colores y paletas van por el tema, nunca por overrides en `:root`.

### Crear/extender un tema propio (`defineTheme`)
```tsx
import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export const marcaTheme = defineTheme({
  name: 'marca',
  extends: neutralTheme,                         // hereda tokens, overrides, iconos, fuentes
  tokens: { '--color-accent': ['#7B61FF', '#9B85FF'] },
  typography: { scale: {base: 14, ratio: 1.2}, body: {family: 'Inter', fallbacks: '-apple-system, sans-serif'} },
  radius: {base: 4, multiplier: 1},
  motion: {tempo: 0.85, character: 'crisp'},     // tempo 0.75–1.5; character crisp|standard|expressive
  components: {
    button: {
      base: {borderRadius: '9999px'},
      'variant:ghost': {borderWidth: '2px', borderStyle: 'solid'},
    },
    card: {base: {padding: '24px'}},
  },
});
```
- Carpeta local `src/themes/<slug>/<nombre>Theme.ts` + descriptor `<nombre>Theme.doc.mjs` con `maintained: false`.
- **Overrides por clave semántica** (`button`, `card`, `banner`…; `base`, `variant:valor`, estado), no por selector CSS. Sirven para **variantes nuevas** (`'variant:primary-muted'`) que `theme build` tipa por augmentation.
- **Adaptaciones** (`adaptations.rules` con `when: {width, pointer, contrast, motion}`) cambian tokens/componentes por ancho (640/768/1024/1280/1536), precisión de puntero, contraste o movimiento; se compilan a media queries, sin listeners.
- Un tema de un solo modo exporta `export const colorModes = ['light']` (o `['dark']`).
- Iconos del tema: `icons` / `componentIcons`; tamaño de `Icon` por tema con `components.icon['size:sm']: {width, height}` en px o rem.
- Para color nuevo coordinado: genera la paleta, revísala y comitéala, y mapea tokens semánticos a sus pasos (`palette.neutral.light[100]`, `palette.neutral.dark[15]`). Regenerar una paleta aceptada actualiza todo token que mantenga esas referencias.
- Utilidades: `tokenVar('--color-text-primary')` para configs de librerías no-StyleX, `resolveThemeTokens(theme, {mode})` para JS puro (canvas, gráficas), `useTheme()` solo cuando una API exija un color concreto.
- **Un cambio de tema no está hecho hasta que lo miraste** (capturas de componentes reales, en claro y oscuro).

## Flujo con el CLI (arranque de cada rama)
```bash
astryx help                      # comandos y opciones
astryx docs                      # temas de documentación
astryx docs principles --dense   # reglas de diseño y antipatrones
astryx docs tokens --dense       # espacio, color, radio, tipografía, sombra
astryx docs theme --dense
astryx component --list          # todos los componentes por categoría
astryx template --list           # plantillas de página
astryx search '<lo que necesito>'
```
Bajo demanda: `astryx docs <tema> --index` (índice de secciones) · `astryx docs <tema> <sección>` · `astryx component <Nombre> --dense` · `astryx template <nombre> [ruta]` (`--skeleton` = esqueleto con anotaciones espaciales) · `astryx swizzle <Nombre>` · `astryx build "<idea>"` (nombra la plantilla de partida y las piezas que le faltan) · `astryx init`. Opciones de salida: `--detail brief|compact`, `--dense`. **Reglas**: corre el arranque en cada rama (la doc refleja la API real de esa rama); `component <Nombre> --dense` antes de modificar un componente; tras subir `@astryxdesign/core`, `upgrade --apply`.

Flujo de trabajo para una página: `astryx build "<idea>"` → `astryx template <nombre> <ruta>` (conserva su marco, `gap` y padding; reemplaza el contenido) → `astryx template <Bloque>` para piezas faltantes → `astryx component <Nombre>` para leer props. **Nunca empieces una página desde cero.** Antes de entregar: relee cada archivo, reemplaza `div`/`span` crudos, `.css`/`@apply` importados y `#hex`/`px` fijos por el componente o el token, compila y entrega el build, no una descripción.

## Trabajar con IA
- `astryx init --features agents` genera el contexto para agentes (índice de componentes, reglas de comportamiento, referencia del CLI) en `AGENTS.md` (y `CLAUDE.md` apunta a él); Cursor: regla en `.cursor/rules/astryx.mdc`.
- Servidor MCP remoto de Astryx con dos herramientas, `search(query)` y `get(name)` (config según el cliente; en Claude Desktop se agrega como conector personalizado).
- Comprobación de arranque para el modelo: "¿cómo se llama el componente para X, qué props tiene y qué plantilla usarías?" Si no sabe, falta el contexto.

## Internacionalización y RTL
Soporte de locales, calendarios y RTL; los componentes usan propiedades lógicas. Prueba cada pantalla en RTL y con textos largos. Etiquetas mixtas: `dir` o `<bdi>`.

## Navegadores
Astryx usa CSS moderno (`light-dark()`, `@starting-style`, anchor positioning, `@container`). Confirma la matriz de soporte de `astryx docs browser-support` si el proyecto apunta a navegadores viejos.
