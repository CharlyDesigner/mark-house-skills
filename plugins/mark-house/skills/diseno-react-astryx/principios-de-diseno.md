# Principios de diseño visual (versión condensada)

Astryx los llama "specs de diseño" (`docs/design/`). Aquí van como reglas operables. Cada una trae su prueba rápida.

## Tipografía
- **El rol comunica el propósito.** Título de página/display, encabezado de sección, cuerpo, etiqueta, texto de apoyo, código: usa el rol, no "un tamaño parecido". → tabla de roles en [tokens.md](tokens.md).
- **Roles adyacentes se distinguen**: por tamaño, peso, ubicación o una combinación deliberada. Prueba: sin leer, ¿distingues título, sección, cuerpo y nota?
- **Texto de varias líneas respira**: interlineado cómodo y **medida controlada** (40–60 caracteres por línea; limita con `contentWidth`).
- Texto de apoyo: más silencioso pero legible y **distinto de lo deshabilitado**.
- Cargando, deshabilitado, estado y truncado **conservan la identidad del rol** (un skeleton no aplana título contra cuerpo).
- Jerarquía no solo por color. Evita mayúsculas sostenidas y tracking raro en lectura larga. Debe sobrevivir al zoom.
- Dos personalidades válidas (denso/editorial) conservan el mismo orden semántico de roles.

## Jerarquía espacial
- **Proximidad = relación.** Lo relacionado, más cerca que lo ajeno.
- **La separación crece con el nivel de agrupación**: local < grupo < sección.
- **El espacio precede a la contención**: agrupa con espacio y alineación antes de añadir una Card o un borde.
- **La variación es intencional**: con un solo hueco no hay jerarquía.
- Al reflujar en estrecho, local/grupo/sección siguen distinguiéndose. Validación, ayuda y acciones opcionales se quedan pegadas a lo que sirven.
- El agrupamiento visual coincide con el orden de lectura y la semántica; el espacio no es la única señal si el grupo necesita etiqueta o encabezado.
- Ejemplo: en un formulario, tensión mínima entre etiqueta y campo, más entre campos, máxima entre secciones.

## Ritmo de controles
- Controles de altura fija y de contenido en la misma fila comparten **línea base y altura aparente**.
- **Tamaño y densidad se afinan juntos** (tamaño externo + padding interno como un solo ritmo).
- Texto e iconos con aire: centrados, sin pegarse al borde.
- **Tamaño visual ≠ área de toque.** Un control puede verse compacto y conservar un objetivo operable según el contexto de entrada (puntero fino vs. táctil); el área de toque puede exceder la silueta sin romper el layout.
- Reposo, foco, carga, valor y estado **no cambian la altura de la fila** salvo que el contrato del componente lo defina.
- Una fila puede envolver o apilar, pero cada fila resultante conserva alineación.

## Énfasis de color
- **Primer plano y fondo son una sola decisión**: evalúa el color sobre la superficie donde vive.
- Los neutros siguen el **rol semántico**: overlays de interacción, tracks, contenedores y elementos autónomos son distintos aunque parezcan iguales.
- **El énfasis es escaso**: un grupo de acciones local expone **una** acción primaria clara.
- El estado sigue su contrato de feedback (ver abajo): no inventes otro tratamiento.
- Hover y press **combinan** con la superficie (tinte translúcido), no la reemplazan con un bloque opaco.
- Reposo/hover/press/foco/seleccionado/deshabilitado son perceptiblemente distintos en cada modo; hover es opcional: teclado y táctil conservan el significado sin él.
- Al colapsar acciones en estrecho, la primaria sigue identificable sin amplificar las demás.
- Prueba: una barra con una primaria, una secundaria y una destructiva; cada una clara sin compartir énfasis.

## Elevación
- **El orden percibido coincide con el real**: lo que parece más alto se comporta como capa superior.
- **La profundidad es silenciosa**: separa sin ser el rasgo dominante.
- **Un solo lenguaje de borde manda**: borde definido *o* elevación suave como límite principal, no ambos a toda potencia.
- **Anillos de estado (foco/selección) no son elevación**: se ven distintos de las sombras de profundidad.
- Niveles: ver [tokens.md](tokens.md) (none/low/med/high por distancia a la página).

## Forma
- **El radio sigue el rol** (interior, control, contenedor, página, píldora).
- **Curvas anidadas concéntricas**: radio interior = exterior − padding; `max(0px, calc(var(--radius-container) - var(--spacing-4)))`. `Card` no lo hace por tu contenido.
- El carácter de forma es **sistémico**: el tema afina nitidez/redondez en conjunto (multiplicador de radio), no elementos sueltos.
- Bordes y acentos de borde se integran con la esquina en vez de chocar con ella.

## Movimiento
- **El movimiento tiene significado**: explica respuesta, continuidad, entrada, salida o cambio espacial; no decora.
- **El peso decide el tiempo**: lo local y pequeño, rápido; entradas, salidas y continuos, más lento.
- **Se asienta con naturalidad**: desacelera con control; nada de rebote ornamental (solo el carácter `expressive` del tema rebota en entradas y movimientos).
- **El contenido estable se queda estable**: sin saltos de layout innecesarios.
- Dónde ayuda: paneles, diálogos, secciones colapsables, toasts, interruptores y selecciones. Dónde estorba: hover de filas, resaltado de ítems, cualquier cosa que el usuario hace decenas de veces por minuto, y **cualquier animación que bloquee la siguiente acción**.
- No todo necesita salida animada: tooltips, hover cards y menús pueden desaparecer al instante. Si animas la salida, iguala la entrada (el panel que entra por la derecha sale por la derecha). La dirección coincide con la acción (profundizar = avanzar). La UI contextual crece desde su disparador; la global (paleta de comandos, toasts) tiene posición fija.
- **Movimiento reducido** (`prefers-reduced-motion: reduce`): ninguna transición mueve, escala ni redimensiona. Con ratón o trackpad el cambio es inmediato; con dedo (puntero táctil) es un fundido de opacidad de ≤ 200 ms; un valor que cambia en sitio (relleno de progreso) toma su valor de golpe. En tu CSS: `@media (prefers-reduced-motion: reduce)` más `(pointer: coarse)` para el fundido táctil. Cada animación debe tener una forma inmediata o mínima que comunique el mismo cambio.
- Patrón: la entrada de un diálogo va con `@starting-style`, no con `useState` + `requestAnimationFrame`; el hover solo bajo `@media (hover: hover)`; el responsive de contenedor con `@container`, no con `ResizeObserver`.

## Estados
**Del usuario** (presionar/arrastrar): la superficie manipulada pinta `--color-overlay-pressed` mientras dura y lo limpia al soltar; lo deshabilitado **no responde ni gana tratamiento de presionado**; la selección persistente gana (un segmento seleccionado conserva su superficie elevada durante el press).

**Del sistema** (carga, procesamiento, estado):
1. **El estado preserva el contexto**: la carga conserva geometría e identidad del componente afectado.
2. **El significado sobrevive al color**: cada estado semántico = color + icono/etiqueta/otra señal.
3. **La prominencia sigue persistencia y urgencia**: persistente en flujo = silencioso y compacto (Banner pálido); urgente o compacto = sólido (Badge); breve y transitorio = overlay invertido (Toast).
4. Un mismo significado (éxito/info/aviso/error) se reconoce a cualquier prominencia.
5. **Los estados ocupados no producen salto de layout**: placeholders con las dimensiones esperadas.
Los estados reposo/escaso/vacío/error conservan el orden de agrupación espacial.

**De agentes/IA** (borrador de Astryx, sin reglas aprobadas): reutiliza el lenguaje de estados del usuario y del sistema cuando la intención es la misma.

## Iconografía
1. **Claro**: formas simples y reconocibles. 2. **Intencional**: cada icono cumple un papel; evalúa el contenedor y la página antes de añadir otro (la decoración sube la carga cognitiva). 3. **Consistente**: reutiliza los iconos semánticos del sistema para un significado existente. 4. **Tamaño por rol semántico** (xsm 12 / sm 16 / md 20 / lg 24 px a raíz 16 px, en rem), no por el espacio que sobre. 5. **Contorno por defecto**; relleno solo para estado seleccionado/activo (emparéjalos en nav). 6. **El color apoya el significado** (rol de primer plano o semántico); el color solo no comunica un concepto. 7. **Glifo ≠ objetivo**: el dibujo no sustituye al contenedor interactivo, al área de toque, al foco ni al nombre accesible (`IconButton` con `label`). Iconos siempre por `Icon`/`IconButton`/prop `icon`, no SVG crudo.

## Accesibilidad (mínimos)
- **Contraste**: texto 4.5:1 en todos los estados (en hover/press se mide el fondo final tras el overlay); iconos esenciales y arco de spinner 3:1; borde de control 3:1 solo si el usuario lo necesita para ver el control; foco 3:1 contra lo que lo rodea. Lo deshabilitado está exento.
- Etiqueta visible en todo control (o `isLabelHidden` con contexto obvio); `label` en botones solo-icono.
- Nombres accesibles en overlays y regiones (`label`, `role`); landmarks donde corresponda.
- Foco visible y que **vuelve** al disparador al cerrar un overlay; Esc cierra; el overlay atrapa foco si es modal.
- Orden de lectura = orden visual. Un Banner no anuncia solo: `useAnnounce` (o `role="alert"` si es urgente).
- Soporta RTL e internacionalización (etiquetas de caracteres neutros como `+3` o `@alice` conservan su orden; marca la dirección en contenido mixto con `dir` o `<bdi>`).
- Pruébalo en lector de pantalla y solo con teclado, no solo en el código.
