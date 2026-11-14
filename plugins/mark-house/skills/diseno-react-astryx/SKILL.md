---
name: diseno-react-astryx
description: 'Diseña e implementa interfaces de producto en React con criterio de sistema de diseño, destilado del sistema Astryx de Meta (MIT, 150+ componentes, usado en 13 000+ apps): armazón primero (shell, regiones, anchos), componentes antes que HTML crudo, tokens semánticos de color, espacio, radio, tipografía, sombra y movimiento en vez de hex y px, el contenedor más débil que agrupe (espacio, Divider, Section, Card), filas para datos densos, estados y accesibilidad, tema y modo oscuro, contrato responsivo por región. Incluye catálogo de componentes, tablas de tokens con valores, recetas de layout, plantillas de página, checklist de revisión y un script que audita TSX (div crudos, hex, px, estilos en línea). Úsalo cuando pidan "diseña esta pantalla en React", "dashboard", "formulario", "settings", "tabla", "panel de admin", "que se vea profesional y no genérico", "revisa mi UI", "tema oscuro", "usa Astryx", "sistema de diseño", o cuando el proyecto dependa de @astryxdesign.'
argument-hint: "[pantalla o proyecto a diseñar o revisar]"
---

# Diseño de UI en React con criterio de sistema (base: Astryx)

Astryx nació dentro de Meta, donde se volvió el sistema de diseño más grande de la empresa. Su idea central: **una UI profesional sale de decisiones de sistema (armazón, jerarquía, tokens), no de decorar tarjetas**. Esta skill es esa idea en versión Mark House: reglas, tablas de decisión y checklists que sirven **con o sin** la librería instalada.

Sirve para **UI de producto** (apps, paneles, formularios, tablas, ajustes, chat). Para marcas, logos o landings muy expresivas usa `identidad-visual` y `direccion-de-arte-ia`.

## Antes de empezar: ¿hay Astryx en el proyecto?
| Situación | Qué hacer |
|---|---|
| `package.json` tiene `@astryxdesign/core` | Usa sus componentes y su CLI (`astryx`). Lee [tematizacion-y-setup.md](tematizacion-y-setup.md) para el flujo y los comandos |
| Proyecto nuevo y el usuario quiere Astryx | Instálalo (React 19+, ver setup). Cuidado: es Beta, versión de referencia 0.7.x |
| Hay otra librería (shadcn, MUI, Chakra, Tailwind a pelo) | **No migres sin que lo pidan.** Aplica las mismas reglas con lo que haya: mismos principios, tokens como variables CSS propias, mismos componentes equivalentes |
| No hay nada | Propón una base (Astryx o shadcn/Tailwind), no inventes un sistema desde cero |

## El flujo (de afuera hacia adentro)
Un layout que empieza por el contenido termina como una columna de tarjetas con padding. Empieza por el armazón.

1. **Entender** — qué hace la app, quién la usa, qué tarea resuelve *esta* pantalla, qué pantallas hermanas existen (copia su shell, cabecera, densidad), estados reales (vacío, cargando, error, contenido largo), roles, idiomas/RTL, móvil.
2. **Armazón** — elige shell, presupuesta ancho a cada región, decide "llena o con tope" y la navegación **antes** de escribir contenido. → [layout.md](layout.md)
3. **Estructura** — un protagonista por región, jerarquía con peso y color (no con tamaño), el contenedor más débil que funcione, colecciones como filas. → [layout.md](layout.md)
4. **Espacio** — una línea de contenido por región; huecos cortos para unir y largos para separar; un tamaño de control por fila. → [layout.md](layout.md)
5. **Responsivo** — escribe el contrato por región (dividir, revelar, redimensionar, intercambiar) y ata cada línea a la prop que lo hace cumplir. → [layout.md](layout.md)
6. **Estados y accesibilidad** — vacío, cargando, error, deshabilitado, foco visible, estado que no dependa solo del color. → [principios-de-diseno.md](principios-de-diseno.md)
7. **Verificar** — audita el código, compila, abre la app y mira cada estado. → [revision.md](revision.md)

Para arrancar una pantalla de tipo conocido (dashboard, tabla, ajustes, wizard, chat…) parte de una plantilla: [plantillas.md](plantillas.md).

## Reglas de oro
1. **Componentes para todo lo que cubran.** Un `<div>`, `<span>`, `<button>` o `<table>` crudo es la excepción justificada (semántica nativa necesaria y sin equivalente), no el default.
2. **Frame primero.** Shell, anchos de región, fill vs tope y navegación se deciden sin contenido.
3. **Tokens semánticos, nunca valores sueltos.** Color por propósito (`--color-text-secondary`), no por apariencia (`#4E606F`). Espacio de la escala, no `13px`. Así tema y modo oscuro funcionan solos. → [tokens.md](tokens.md)
4. **El contenedor más débil que agrupe**: espacio → Divider → Section → Card. Card solo para un "algo" discreto (KPI, entrada de galería, widget) o un límite duro.
5. **Datos densos = filas** (Table o List/Item), de borde a borde con divisores. Nunca una Card por registro.
6. **Un protagonista por región y una sola acción primaria.** Jerarquía con peso y color; el cuerpo de texto se queda con sus valores por defecto.
7. **Contraste de huecos.** Si todo el espacio es del mismo tamaño, la proximidad no agrupa. Quita los bordes: ¿aún se distinguen los grupos?
8. **El contenedor manda el padding**; los hijos ponen sus márgenes en cero. Una sola línea de contenido por región.
9. **Estado ≠ solo color.** Todo estado semántico lleva icono, etiqueta u otra señal no cromática.
10. **Movimiento con significado.** Anima cambios espaciales y orientadores; no las acciones que el usuario repite decenas de veces por minuto. Respeta `prefers-reduced-motion`.
11. **Controlados.** Inputs con `value` + `onChange`. Navegación por un componente de enlace intercambiable (no `<a>` fijo) para que el router del proyecto funcione.
12. **No inventes props.** Lee la ficha del componente antes de usarlo ([componentes.md](componentes.md) o `astryx component <Nombre> --dense`).

## Tablas de decisión

### ¿Qué contenedor?
| Pregunta | Usa |
|---|---|
| Son elementos relacionados dentro de un mismo grupo | Solo espacio (`gap`) |
| Pares en una lista/toolbar densa, o separar cabecera de cuerpo con scroll | `Divider` |
| Contenido relacionado bajo un encabezado (ajustes, grupo de formulario, región lateral) | `Section` (sin borde) — **el default** |
| Algo que podrías reordenar o quitar por separado (KPI, perfil, producto en una grilla) | `Card` |
| Registros repetidos | Filas: `Table` (columnas) o `List` + `Item` (una línea) |

### ¿Cómo indico un estado?
| Necesito | Usa | No uses |
|---|---|---|
| Contar o enumerar un estado que exige atención | `Badge` (success/warning/error solo para estado del sistema) | Badge verde en cada fila "Activo" |
| Estado discreto dentro de una fila | `StatusDot` con etiqueta | Badge decorativo |
| Etiqueta/categoría/filtro removible | `Token` | Badge para metadatos (fechas, duraciones) |
| Mensaje persistente en página o sección | `Banner` (info/éxito descartables; error hasta resolverse) | Toast |
| Confirmación breve que se va sola | `Toast` | Banner |
| Confirmar acción destructiva | `AlertDialog` | Dialog normal |

### ¿Qué control de selección?
| Caso | Componente |
|---|---|
| Cambiar entre 2–5 vistas/modos excluyentes, todas visibles | `SegmentedControl` |
| Navegar entre vistas/secciones | `TabList` (no para pasos secuenciales: usa `Stepper`) |
| Encendido/apagado con efecto inmediato | `Switch` |
| Encendido/apagado persistente tipo botón | `ToggleButton` |
| Una opción entre pocas, todas visibles | `RadioList` |
| Una opción entre muchas | `Selector` (`hasSearch` si es larga); `Typeahead` si el conjunto es enorme o dinámico |
| Varias opciones | `CheckboxList` (pocas), `MultiSelector`, `Tokenizer` |

### ¿Qué superficie flotante?
| Caso | Usa |
|---|---|
| Bloquea la página hasta que el usuario responde | `Dialog` |
| Confirmar algo irreversible | `AlertDialog` |
| Panel anclado a un botón (clic) | `Popover` |
| Explicación al pasar el cursor o foco | `Tooltip` / `HoverCard` |
| Detalle lateral en pantalla ancha | `LayoutPanel`; en estrecha → `Dialog` o `BottomSheet` |
| Menú de acciones | `DropdownMenu` / `MoreMenu` / `ContextMenu` |
| Búsqueda global por teclado | `CommandPalette` |

### ¿Cargando?
Dimensiones conocidas → `Skeleton` con la forma del contenido. Dimensiones desconocidas (envío, guardado) → `Spinner` o `isLoading` del botón. Nunca los dos sobre la misma zona, nunca un skeleton eterno (si tarda, error o estado vacío). El estado de carga **no debe mover el layout**.

## Antipatrones que delatan "UI genérica"
| Síntoma | Corrección |
|---|---|
| Columna de tarjetas con padding, una por sección | Decide el frame; usa `Section` y filas |
| Card dentro de Card | Aplana: espacio y Divider |
| Grilla de tarjetas idénticas (icono + título + texto) | Varía el layout o pregunta si hacen falta tarjetas |
| Mismo `gap` en todos lados | Contrasta: 1–2 para unir, 4–6 para separar |
| Texto gris y pequeño en una región completa | Baja el énfasis con color secundario, no con tamaño; nunca el color *disabled* para contenido |
| Dos botones primarios en la misma vista | Uno primario, el resto secundario o ghost |
| `Badge` verde en todo | Muestra solo excepciones |
| Estilos en línea, `#hex`, `16px` sueltos | Prop del componente → token → `xstyle`/clase solo si no hay otra |
| `columns={4}` que se desborda en el teléfono | `columns={{minWidth: 240, max: 4}}` |
| Flex anidados sin fin ("flexbox soup") | `Grid`, `Layout`, `Section`, `FormLayout` |
| Placeholder en vez de etiqueta | Etiqueta visible siempre |
| Un Tooltip explicando por qué algo está deshabilitado | `disabledMessage` del propio control |
| Estado vacío que dice "Sin datos" | Qué está vacío, por qué y qué hacer (con botón) |

## Cómo se ve "bien hecho" (pruebas rápidas)
- **Entrecerrar los ojos**: lees protagonista → apoyo → grupos, en ese orden. Si todo se lee a la vez, sube el contraste con peso y color.
- **Sin bordes**: aún nombras los grupos solo por espacio.
- **Línea vertical a la izquierda de la región**: todas las etiquetas la tocan; solo los fondos de hover/selección la cruzan.
- **Concéntrico**: radio interior = radio exterior − padding (`max(0px, calc(var(--radius-container) - var(--spacing-4)))`).
- **Una sola fila de controles**: misma altura y línea base.
- **Teclado**: puedes llegar a todo, el foco se ve y vuelve a donde estaba al cerrar un overlay.

## Salida
Al terminar una pantalla entrega: (1) el código que compila, (2) el **contrato de layout** en un comentario (regiones, anchos, qué cambia a cada ancho), (3) resultado de `node ${CLAUDE_SKILL_DIR}/scripts/auditar-ui.mjs <carpeta>`, (4) capturas de los estados reales (usa `revision-visual`). Para pasar un rediseño a otro agente usa `entrega-de-diseno`; antes de publicar, `qa-antes-de-publicar`.

## Referencias (se leen bajo demanda)
| Archivo | Cuándo |
|---|---|
| [tokens.md](tokens.md) | Valores de color, espacio, radio, tamaño, sombra, tipografía, movimiento y cómo usarlos en CSS / Tailwind / StyleX |
| [layout.md](layout.md) | Recetas de shell, regiones, paneles, cabeceras, espaciado, densidad, grids y responsivo |
| [componentes.md](componentes.md) | Catálogo por categoría, reemplazos de HTML crudo, reglas por componente |
| [principios-de-diseno.md](principios-de-diseno.md) | Tipografía, jerarquía espacial, ritmo de controles, énfasis de color, elevación, forma, movimiento, estados, iconos, accesibilidad |
| [tematizacion-y-setup.md](tematizacion-y-setup.md) | Instalar, CSS (plano/Tailwind/StyleX), temas, modo oscuro, `defineTheme`, CLI, i18n/RTL, trabajar con IA |
| [plantillas.md](plantillas.md) | 58 plantillas de página y cuál elegir |
| [revision.md](revision.md) | Rúbrica de revisión, evidencia, prompt de auditoría |
| [creditos.md](creditos.md) | Origen y licencia MIT de Astryx |
| `scripts/auditar-ui.mjs` | Auditor de TSX/JSX/CSS (sin dependencias) |

Crédito: basada en [Astryx](https://github.com/meta/astryx) de Meta Platforms (MIT), reescrita y condensada en español; los valores de tokens corresponden a Astryx 0.7.17.
