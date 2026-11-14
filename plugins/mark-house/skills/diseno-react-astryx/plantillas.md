# Plantillas de página (58 en Astryx 0.7.17)

**Regla: toda página parte de una plantilla, nunca de cero.** Una plantilla ya trae el shell, el emparejamiento de navegación, los huecos y el padding; tú reemplazas el contenido.
```bash
astryx build "<idea>"                 # nombra la plantilla más cercana y lo que le falta
astryx template <nombre> <ruta>       # escribe el código en tu proyecto
astryx template <nombre> --skeleton   # solo el esqueleto con anotaciones espaciales
astryx template --list                # catálogo
```
Probado con 0.7.16: escribe la idea de `build` **en inglés** (en español cae al shell genérico); con `template` agrega `--type page`. Las plantillas son demos grandes (`table-filter`: 4 623 líneas, con StyleX): para una pantalla concreta copia su marco con `--skeleton` y el JSX final, y escribe una página enfocada (ver [recetas-probadas.md](recetas-probadas.md)). Si no usas Astryx, copia la **estructura** (regiones, anchos, qué llena y qué lleva tope) y reimplementa con tus componentes.

## Shells de aplicación
| Plantilla | Forma |
|---|---|
| `shell-side-nav` | Un riel izquierdo colapsable y redimensionable con historial agrupado y búsqueda |
| `shell-top-nav` | Solo navegación horizontal; ítems que abren mega-menús a ancho completo |
| `shell-nav` | Ambos ejes: barra superior con paleta de comandos sobre riel jerárquico redimensionable |
| `messaging-shell` | Cuatro columnas anidadas (espacio, canales, mensajes, hilo); filas densas, sin cards |
| `ide` | Multipanel denso: árbol, documentos con pestañas, cajón inferior, inspector |
| `blank` | Un encabezado y una región vacía, sin cromo |

## Tablas y colecciones
| Plantilla | Cuándo |
|---|---|
| `table` | Filas planas: columnas ordenables, selección con barra de acciones masivas, menú por fila |
| `table-page` | Tabla bajo datos del registro, con búsqueda, alcance y popovers por columna |
| `table-filter` | Filtrado progresivo: barra de tokens, vistas guardadas, columnas y agrupación |
| `table-grouped` | Secciones colapsables con conteos |
| `table-collapsible` | Varias tablas (esquemas distintos) cada una en una card colapsable |
| `table-comparison` | Matriz transpuesta: candidatos en columnas, criterios en filas, columna de etiquetas fija |
| `table-inbox` | Cola de mensajes con panel de lectura redimensionable |
| `table-tree` | Jerarquía con filas padre que agregan a sus hijos + barra lateral de detalle |
| `incident-console` | Cola densa con severidad, búsquedas guardadas y panel de detalle |
| `kanban-board` | Carriles de cards arrastrables; la columna es el estado |
| `file-explorer` | Columnas anidadas con migas, vista lista/grilla |

## Paneles (dashboards)
| Plantilla | Pregunta que responde |
|---|---|
| `dashboard` | Resumen en tres bandas: tiles, gráficas, tablas, con un filtro global |
| `dashboard-alert-rail` | Analítica siempre activa con riel de triage de alertas |
| `dashboard-comparison` | Comparar periodos y segmentos tras una barra de filtros persistente |
| `dashboard-composition` | Valor en el tiempo: área apilada y ranking de contribuyentes |
| `dashboard-cohort-funnel` | Embudo por etapas y retención por cohortes |
| `dashboard-progress` | Avance: dona de completitud, línea de tiempo, tabla por responsable |
| `dashboard-scorecard` | Reporte: cifras clave con deltas, metas, cuadrícula de tendencias |

## Formularios y flujos
| Plantilla | Forma |
|---|---|
| `contact-form` | Una columna plana, un solo envío |
| `form-two-column` | Campos a un lado, panel de contexto fijo al otro |
| `form-wizard` | Un panel a la vez con barra de progreso horizontal |
| `form-wizard-vertical` | Pasos en riel izquierdo fijo + panel de guía por campo |
| `form-wizard-inline` | Acordeón: el paso activo se expande y los hechos se colapsan a una línea |
| `form-wizard-dialog` | Flujo corto dentro de un diálogo |
| `checkout-wizard`, `payment-form` | Compra con resumen que recalcula |
| `login`, `login-card`, `login-split`, `login-sso` | Mínimo / card elevada / mitad con media / flujo progresivo por dominio |

## Detalle y ajustes
`detail-page` (registro con cabecera, líneas, totales y actividad) · `work-item-detail` (tarea con subtareas, adjuntos y comentarios) · `product-detail` · `course-detail` · `settings` (un formulario continuo) · `settings-sidebar` (paneles con nav) · `settings-dialog` (modal con búsqueda de secciones) · `editor` · `canvas-editor`.

## Chat
`ai-chat` (transcripción con markdown, código y salida de herramientas plegable + panel de artefacto redimensionable) · `ai-chat-landing` (estado cero con composer central y sugerencias).

## Galerías, marketing y documentación
`classic-gallery`, `mixed-gallery`, `product-gallery`, `library`, `gallery-hero`, `side-gallery`, `centered-hero`, `documentation`, `documentation-design`, `documentation-technical`, `theme-showcase`.

## Bloques sueltos
`astryx template <Bloque>` trae piezas (p. ej. `CardWithInnerLayout`, `ChatLayoutPanelChat`) para lo que la plantilla no tenga.

## Cómo elegir
1. ¿Qué verbo hace el usuario aquí? (monitorear → dashboard · procesar una cola → tabla/consola · crear → formulario/wizard/editor · conversar → chat/mensajería · configurar → settings).
2. ¿Una colección? Mira si hay detalle (panel lateral o página), agrupación o filtros.
3. Elige la plantilla; **conserva su marco, `gap` y padding**; cambia contenido. Si te falta una pieza, pídela como bloque, no la inventes.
