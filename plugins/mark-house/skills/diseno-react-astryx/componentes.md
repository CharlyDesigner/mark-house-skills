# Catálogo de componentes (Astryx 0.7.17)

Importa del paquete público (`@astryxdesign/core`, o por componente: `@astryxdesign/core/Button`). Dentro de un paquete se importa el módulo que define, nunca el `index` de una carpeta. **Antes de usar uno, lee su ficha**: `astryx component <Nombre> --dense` (props, variantes, anatomía) y no inventes props. Convenciones de nombres que se repiten en todo el sistema: booleanos con `is`/`has` (`isLoading`, `hasDivider`), eventos `onChange`/`onOpenChange`, `label` obligatorio en controles, `xstyle` para overrides de estilo, `size` `sm|md|lg`.

## Reemplazos de HTML crudo
| Patrón crudo | Dueño en Astryx |
|---|---|
| `div` de layout | `VStack`, `HStack`, `Stack`, `Grid`, `Card`, `Section`, `Center` |
| `span`, `p`, `h1`–`h6` | `Text`, `Heading` |
| `button` / acción enlazada | `Button`, `IconButton`, `Link` |
| `nav` / `aside` en la página | `LayoutPanel` |
| `header` / `main` | `LayoutHeader` / `LayoutContent` dentro de `Layout` |
| `ul`, `ol`, `li` | `List` + `ListItem` (o `Item`) |
| `input`, `textarea`, `select` | `TextInput`, `TextArea`, `Selector`… |
| `table`, `tr`, `td` | `Table` |
| `hr`, `dialog`, `details`, `summary` | `Divider`, `Dialog`, `Collapsible` |
| `<svg>` / icono de librería suelto | `Icon`, `IconButton` o la prop `icon` del componente |
| `<a>` fijo | `Link` / `useLinkComponent()` (el proyecto cambia el router con `LinkProvider`) |

Se queda crudo solo si la semántica nativa es necesaria y no hay equivalente: un `<form>` con envío nativo, `<input type="hidden">`, un `<img>` cuando ningún componente general encaja. **Esconder un `div` detrás de un helper PascalCase no lo vuelve componente del sistema.**

## Por categoría

### Acción
| Componente | Para qué | Notas |
|---|---|---|
| `Button` | Acción con clic | `variant` primary/secondary/ghost/destructive, `size`, `isLoading`, `elevation`, `type`. Etiqueta que describe ("Guardar cambios", no "OK"). Un solo primary por vista. Destructivo siempre con confirmación. Si solo lleva a otra página, es `Link` |
| `IconButton` | Solo icono | `label` obligatorio (nombre accesible) y `tooltip` |
| `ToggleButton` | Encendido/apagado persistente | Distinto de `SegmentedControl` (uno seleccionado siempre) |
| `ButtonGroup` | Acciones relacionadas unidas | Dueño de geometría, foco y tamaño heredado. Las filas de acciones en pie de Dialog/Card/`LayoutFooter` se componen con él |
| `Toolbar` | Barra de controles | Un campo dentro de una Toolbar se salta |
| `DropdownMenu`, `MoreMenu`, `ContextMenu` | Menús de acciones | `MoreMenu` = botón de tres puntos |
| `SegmentedControl` | 2–5 modos excluyentes visibles | `label` descriptivo; `disabledMessage` en vez de Tooltip |
| `Link` | Navegación en texto | |

### Layout
| Componente | Para qué | Notas |
|---|---|---|
| `AppShell` | Shell de la app | `sideNav`, `topNav`, `mobileNav`, `banner`, `contentPadding`, `variant` wash/surface/section/elevated |
| `Layout` (+ `LayoutHeader/Content/Panel/Footer`) | 5 regiones: header, start, content, end, footer | `contentWidth`, `padding`, `defaultHasDividers`, `height` fill/auto |
| `Section` | Agrupar bajo un encabezado (**default**) | `variant` section/transparent/muted, `dividers`, `padding*`. Para centrarla: `marginInlineStart/End: 'auto'` por `xstyle` |
| `Stack` / `VStack` / `HStack` | Apilar | `gap` en pasos; `StackItem size="fill"` para estirar uno; antes de anidar stacks prueba `wrap="wrap"` |
| `Grid` | Cuadrícula | `columns` número fijo o `{minWidth, max, repeat}`; `gap/rowGap/columnGap`, `align`, `justify` |
| `Center`, `Divider`, `AspectRatio`, `ScrollableArea`, `Resizable` | Utilidades de layout | |
| `FormLayout` | Campos de formulario | `direction` vertical/horizontal/horizontal-labels; `defaultOptionality`; dueño del espaciado de campos |

### Contenedor
| Componente | Para qué | Notas |
|---|---|---|
| `Card` | Elemento discreto (KPI, perfil, producto) | Pregunta: "¿podría reordenarlo o quitarlo por separado?". Padding igual entre hermanas. No anidar, no para secciones de página, no variantes de color para estado (usa Banner/Badge). Con `Layout` si necesita cabecera, scroll y pie |
| `ClickableCard`, `SelectableCard` | Card que navega / que se selecciona | Selección = borde de acento |
| `Collapsible` | Mostrar/ocultar tras un disparador | |
| `Carousel` | Fila que se desplaza | |

### Contenido
`Text` (`type`: body/large/label/supporting/code/display-1..3; `weight`, `color`: primary/secondary/disabled/placeholder/accent, `maxLines`, `hasTruncateTooltip`) · `Heading` (`level`) · `Icon` (nombres semánticos que se adaptan al tema; `size` xsm/sm/md/lg; sobrescribe iconos desde el tema, no globalmente) · `Avatar`/`AvatarGroup` · `Token` (etiqueta/filtro removible con `onRemove`; 1–3 palabras; 2–3 colores con sentido) · `Timestamp` · `Code`/`CodeBlock` · `Markdown` · `Blockquote` · `Citation` · `Kbd` · `Thumbnail` · `Timer` · `EmptyState` (`title`, `description`, `icon`, `actions`, `isCompact`; explica qué está vacío y qué hacer; si exige acción inmediata es un Banner).

### Feedback y estado
| Componente | Regla |
|---|---|
| `Badge` | Solo estados que piden atención o categorías; 1–2 palabras; nunca clicable ni repetido en cada fila; success/warning/error solo para estado del sistema |
| `StatusDot` | Punto de estado con `label` (`isPulsing` para vivo) |
| `Banner` | `status` info/warning/error/success, `container` card/section; título corto y específico ("Pago fallido"); info/éxito descartables, error hasta resolverse; **no** es región en vivo: anuncia con `useAnnounce` (y `role="alert"` solo para urgente); di el estado en el texto, no solo en el icono |
| `Toast` | Confirmación breve y no bloqueante (`type` info/error, `isAutoHide`) |
| `Spinner`, `Skeleton`, `ProgressBar` | Carga indeterminada / con forma conocida (`index` para onda escalonada) / avance |
| `InfoTip` | Botón "i" con ayuda (foco y hover previsualizan, clic fija) |

### Controles de formulario
Todos llevan su propia carcasa de `Field`: **no envuelvas `TextInput`, `Selector`, `TextArea`, `DateInput`… en otro `Field`**. `Field` es solo para controles propios, nativos o de terceros.
| Componente | Notas |
|---|---|
| `TextInput` | Etiqueta visible siempre (placeholder no es etiqueta); `type` email/tel/url/search para teclado táctil, `inputMode`, `enterKeyHint`, `autoComplete`; estado de validación con mensaje que explique ("El correo debe incluir @"); tamaño acorde al contenido; botón de borrar en búsquedas; `disabledMessage` en vez de Tooltip; no marques todo como requerido |
| `TextArea`, `NumberInput`, `DateInput`, `DateRangeInput`, `DateTimeInput`, `TimeInput`, `FileInput` | |
| `Selector` / `MultiSelector` / `Typeahead` / `Tokenizer` / `ComplexSelector` | Una de pocas / varias / de un conjunto enorme / chips removibles / opciones complejas |
| `CheckboxInput`, `CheckboxList`, `RadioList`, `Switch`, `Slider`, `Calendar` | `Switch` = efecto inmediato |
| `PowerSearch` | Barra de filtros estructurados (campo + operador + valor) |
| `FieldStatus`, `InputGroup`, `Indicator` | Validación, prefijos/sufijos, visuales de selección |
Controlados: `value` + `onChange`. Hay variantes `changeAction`/`clickAction` (acción asíncrona con estado de carga). Entrada y errores: `defaultEntryErrorBehavior` en `FormLayout` (`complete` | `blur-or-enter`).

### Navegación
`SideNav` (secciones, ítems anidados, colapsable, redimensionable; pares de iconos contorno/relleno para el seleccionado; `isSelected` en la página actual) · `TopNav` · `MobileNav` · `NavMenu`/`NavIcon` · `TabList` (etiquetas cortas; ≤ 6–8 visibles; `role="tablist"` + `panelId` cuando cambia paneles en sitio; `isFullBleed` dentro de padding; **no** para pasos) · `Breadcrumbs` · `Pagination` · `Stepper` (pasos secuenciales) · `Outline`.

### Superposición
`Dialog` (`purpose` required/form/info, `variant` standard/fullscreen) · `AlertDialog` (`title`, `description`, `actionLabel`, `actionVariant`, `isActionLoading`) · `Popover` · `Tooltip` · `HoverCard` · `Drawer` · `BottomSheet` · `CommandPalette` · `Lightbox` · `Overlay` (contenido sobre media) · `Toast`. Todos son hijos de la familia **overlay-dismissal**: Esc, clic fuera, retorno de foco y capas se comportan igual en todos. Las capas ancladas siguen a su ancla solo por CSS anchor positioning (jamás con script).

### Tabla y lista
| Componente | Notas |
|---|---|
| `Table` | `data`, `columns`, `idKey`, `density` compact/balanced/spacious, `dividers` rows/columns/grid/none, `isStriped`, `hasHover`, `virtualization`, `plugins`. Ordenable, selección con barra de acciones masivas, menú de desbordamiento por fila |
| `List` + `ListItem` / `Item` | `density`, `hasDividers`, `edge` padded/flush/outset/bleed, `header`, `reorderable`. `Item` unifica "contenido inicial + etiqueta + descripción + contenido final" |
| `MetadataList` | Pares clave–valor de atributos |
| `TreeList`, `OverflowList` | Jerarquía / lista que desborda a un menú |

### Chat
`Chat` es una familia de primitivas (lista de mensajes, composer con `elevation` none|low, emoji, etc.) para chats de IA o humanos.

### Utilidad
`Layer` (proveedor de overlays a nivel de app), `VisuallyHidden`, `Theme` (envuelve un subárbol con un tema), `MediaTheme`, `SyntaxTheme`.

## Paquetes aparte
`@astryxdesign/richtext` (editor de texto rico, markdown sin pérdida) · `@astryxdesign/charts` y `@astryxdesign/vega` (gráficas; **solo canary**, sin versión estable) · `@astryxdesign/lab` (experimental, no publicado) · `@astryxdesign/native` · `@astryxdesign/build` (plugins de compilación StyleX). Cada paquete con estilos trae su propia hoja CSS que se importa después de `astryx.css`.

## Personalizar a fondo
1. Props y `xstyle`/`className` → 2. tokens en el tema → 3. **`astryx swizzle <Componente>`** expulsa el código fuente a tu proyecto para que sea tuyo (requiere compilador StyleX para tu propio código). Los componentes se componen a cualquier nivel: los bloques internos están exportados.
