# Recetas y trampas probadas

Probado el 2026-11-14 armando una pantalla real ("solicitudes del estudio": tabla con filtros, panel de detalle redimensionable y BottomSheet en móvil) con **Vite 8 + React 19 + TypeScript 7 + `@astryxdesign/core` 0.7.16** (la última en npm ese día; el repo ya iba en 0.7.17). Verificado en navegador a 1440, 900 y 375 px, en claro y oscuro, con `tsc`, `vite build`, `astryx doctor` y `auditar-ui.mjs`.

## Receta: proyecto nuevo con Vite (CSS plano, sin compilador StyleX)
```bash
npm create vite@latest mi-app -- --template react-ts --no-interactive
cd mi-app && npm install
npm install @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex lucide-react
npm install -D @astryxdesign/cli
npm pkg set scripts.astryx="node node_modules/@astryxdesign/cli/clients/cli/bin/astryx.mjs"
npx astryx init              # escribe AGENTS.md y GEMINI.md (reglas para agentes)
npx astryx theme add neutral # genera src/astryx-themes.ts (importa theme.css y fonts.css)
```
```css
/* src/index.css — importado una vez en main.tsx */
@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css";
html, body, #root { height: 100%; }
```
```tsx
// App.tsx — el modo oscuro es solo la prop `mode`; todo cambia por tokens
<Theme theme={themes[defaultThemeSlug]} mode={modo}>
  <AppShell height="fill" contentPadding={0} sideNav={nav}>
    <MiPagina />
  </AppShell>
</Theme>
```
- npm 11 **bloquea los `postinstall`** de `@astryxdesign/core` y `/cli` ("allow-scripts"). Todo funcionó sin aprobarlos.
- Sin StyleX compilado, **no hay `xstyle`** (necesita `stylex.create`). Para lo poco que no cubren las props: `className` + CSS con `var(--token)`.
- Borra `App.css` y los estilos de demo de Vite.

## El CLI en la práctica
| Comando | Resultado real |
|---|---|
| `astryx build "<idea>"` | **Escribe la idea en inglés.** En español no encontró plantilla y propuso el shell genérico; en inglés propuso `table-filter` + alternativas + bloques |
| `astryx template <nombre> --type page <ruta>` | Copia la plantilla. Avisa dependencias extra (`lucide-react`, `@heroicons/react`) y si usa StyleX |
| `astryx template <nombre> --skeleton` | Esqueleto de componentes con `gap`: la forma rápida de copiar el marco |
| `astryx component <Nombre> --json` | Props exactas (nombre, tipo, requerido) y ejemplos; mejor que `--dense` para extraer |
| `astryx docs <ruta> --index` y `docs <ruta> <sección>` | Ej.: `docs styling/tokens-and-setup stylex-setup` |
| `astryx search "<consulta>"` | Busca en componentes, hooks, docs y plantillas |
| `astryx doctor --built <carpeta del proyecto>` | Revisa paquetes, temas y **calidad del código fuente** (marca HTML crudo, imports de CSS locales). Apúntalo a la carpeta del proyecto, no a `dist` (en `dist` no lee fuente) |

**Las plantillas son demos completas, no esqueletos**: `table-filter` tiene **4 623 líneas**, usa StyleX (pide compilador) y vistas guardadas, búsqueda avanzada, etc. Para una pantalla concreta: lee su JSX final (el `return` del componente principal) y `--skeleton`, copia el marco (Layout + LayoutHeader + Section padding 4 + LayoutContent padding 4 + LayoutPanel/BottomSheet) y escribe una página enfocada con componentes. Guarda la plantilla fuera de `src` (si no, `tsc -b` la revisa).

## Trampas (todas encontradas en la prueba)
| Trampa | Solución |
|---|---|
| `Table<T>` exige `T extends Record<string, unknown>`; una `interface` falla | Declara la fila con **`type Fila = {…}`**, no `interface` |
| `proportional(peso, {minWidth})` escala **todas** las columnas hasta cumplir la más exigente (minWidth ÷ peso): una columna corta con mínimo 140 infló la principal a 420 px y la tabla se desbordó | Una sola columna `proportional(1, {minWidth})` (la principal) y las cortas con **`pixel(n)`**. `pixel` ya incluye el padding de la celda. Mide: `table.getBoundingClientRect().width` ≤ ancho del contenedor |
| `StatusDot label` **no se ve**: es el nombre accesible | `<HStack gap={2}><StatusDot variant label/><Text>{label}</Text></HStack>` |
| No hay plugin de "clic en fila" | Plugin propio con `transformBodyRow`: `htmlProps` con `onClick`, `onKeyDown` (Enter/Espacio solo si `event.target === event.currentTarget`), `tabIndex: 0`, `aria-current`, y `className` para resaltar la activa |
| `BottomSheet isOpen={compacto && activa}` se abre **solo** al cargar en móvil o al encoger la ventana con una fila ya activa | Estado aparte `hojaAbierta` que se pone en `true` solo al tocar una fila; `onOpenChange={setHojaAbierta}` |
| `SegmentedControl` con 5 opciones en 375 px: todas truncadas ("To…", "En c…") | En teléfono, el mismo filtro como `Selector` (`isLabelHidden` + opción "Todas") |
| Botón primario largo junto al título en teléfono se corta ("Nue…") | `IconButton` con `label` y `tooltip` en teléfono |
| `Selector` con etiqueta oculta mostrando solo "Todos" | La opción por defecto debe decir de qué es: "Todas las personas" |
| `Item` corta el texto a una línea en paneles angostos | `labelLines={2}` |
| `doctor` marca el `import './index.css'` aunque sea el global | Es aviso, no fallo; mantenlo mínimo (solo imports del sistema + reglas con tokens) |
| El tema `neutral` carga la fuente Figtree de un servicio externo (`doctor` avisa) | Para producción, aloja la fuente o elige un tema con fuente local |

## Imports que funcionaron (0.7.16)
```tsx
import {HStack, VStack, StackItem, Layout, LayoutContent, LayoutHeader, LayoutPanel} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Table, pixel, proportional} from '@astryxdesign/core/Table';
import type {TableColumn, TablePlugin} from '@astryxdesign/core/Table';
import {ResizeHandle, useResizable} from '@astryxdesign/core/Resizable';
import {useMediaQuery, useAnnounce} from '@astryxdesign/core/hooks';
import {SideNav, SideNavHeading, SideNavItem, SideNavSection} from '@astryxdesign/core/SideNav';
import {SegmentedControl, SegmentedControlItem} from '@astryxdesign/core/SegmentedControl';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Theme} from '@astryxdesign/core/theme';
// Resto: '@astryxdesign/core/<Componente>' (Button, IconButton, Icon, Avatar, Badge, StatusDot, Token,
// TextInput, Selector, EmptyState, ProgressBar, Item, BottomSheet, Section, Divider, AppShell)
```
`Icon` recibe el componente de lucide: `<Icon icon={Plus} size="sm" />`; `SideNavItem icon={Inbox}` recibe el componente directo. `Avatar name="Carlos Navarro"` genera iniciales solo.

## Lo que el sistema hizo solo (y no hay que programar)
- `AppShell` cambia el `SideNav` por un **menú hamburguesa** en teléfono, sin la prop `mobileNav`.
- `BottomSheet`: Esc cierra y el foco **vuelve a la fila** que lo abrió.
- Modo oscuro completo con `Theme mode`, sin tocar un color.
- `EmptyState` + `Button` "Quitar filtros" cubre el estado sin resultados.

## Patrón: detalle maestro con contrato responsivo
```tsx
const esCompacto = useMediaQuery('(max-width: 1024px)');  // panel → BottomSheet
const esTelefono = useMediaQuery('(max-width: 640px)');   // tabla: solo columnas clave
const ancho = useResizable({defaultSize: 380, minSize: 320, maxSize: 520});

const panel = (
  <>
    <ResizeHandle resizable={ancho.props} isReversed isAlwaysVisible={false} label="Cambiar ancho del detalle" />
    <LayoutPanel resizable={ancho.props} hasDivider padding={0} isScrollable label="Detalle">{detalle}</LayoutPanel>
  </>
);

<Layout height="fill" padding={0} end={esCompacto ? undefined : panel}
  header={<LayoutHeader hasDivider label="Título y filtros"><Section variant="transparent" padding={4}>…</Section></LayoutHeader>}
  content={<LayoutContent padding={4} label="Lista">{vacío ? <EmptyState …/> : <Table … plugins={{activacion}} />}</LayoutContent>}
/>
<BottomSheet isOpen={esCompacto && hojaAbierta && activa != null} onOpenChange={setHojaAbierta}
  label="Detalle" height="tall" padding={0}>{detalle}</BottomSheet>
```
Dentro del detalle: `Section padding={4}` → `Divider` → `Section` con `MetadataList columns="single" label={{position: 'start', width: 104}}` → `Divider` → `Section` con `Heading level={3}` + lista de `Item`. Los divisores llegan a ambos bordes porque el panel tiene `padding={0}` y cada sección repone su margen.
