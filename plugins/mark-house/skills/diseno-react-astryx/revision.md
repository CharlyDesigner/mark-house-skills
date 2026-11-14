# Revisar una UI: ¿está bien hecha?

Regla madre: **cada afirmación lleva evidencia**. Una captura prueba lo visible pero no qué imports produjeron eso; el código no prueba responsivo, interacción, modos de color ni que un asset cargue. Lo que no se inspeccionó se marca `no inspeccionado`; nunca se convierte la falta de evidencia en "bien".

## 1. Entiende la app antes de juzgar
No juzgues un archivo aislado.
1. Qué hace la app, quién la usa, qué tarea resuelve esta pantalla.
2. Dónde vive: ruta, punto de entrada, navegación, shell padre, patrón de página.
3. **Pantallas hermanas** con trabajos parecidos: cabeceras, acciones, retícula, densidad, estados y comportamiento estrecho compartidos.
4. Guías del proyecto (`AGENTS.md` raíz y anidados), wrappers propios de la app.
5. Versiones instaladas (`@astryxdesign/core`, CLI, integraciones) y catálogo de componentes (`astryx component --list`); inspecciona wrappers propios que no aparezcan.
6. Estados reales de datos, roles y permisos, locales y RTL, necesidades móviles.

Una convención documentada y **intencional** de la app no es hallazgo solo por diferir del patrón genérico: cítala y verifica que la tarea y la accesibilidad sigan funcionando.

## 2. Elige la revisión
| Revisión | Para | Qué puede probar |
|---|---|---|
| **Chequeo de código** | Rápido: elementos crudos, iconos directos, estilos propios, imports no soportados | Hallazgos de código; **no** puede llamar bueno al producto renderizado |
| **Revisión completa** | Dar una pantalla por terminada | Ajuste a la app + código + layout renderizado + estados + assets + checks + accesibilidad |
| **Calificación de plantilla** | Plantillas de integración que otros copian | Criterios compartidos + puntaje versionado + empaquetado |

Con solo un archivo: corre el chequeo, usa el contexto disponible, reporta los bloqueos claros y **lista lo que falta** (propósito, ruta, hermanas, shell, tema/densidad, componentes instalados, estados, locale, móvil, revisión exacta, app ejecutable, estados renderizados, checks); no digas que el producto es bueno.

## 3. Rúbrica (marca cada categoría `bien` · `necesita trabajo` · `no inspeccionado`)
| Categoría | "Bien" significa |
|---|---|
| **Ajuste a la app y tarea** | Usa el shell, patrón de página, tema, densidad, wrappers e interacciones establecidos salvo desviación intencional y evidenciada; el usuario objetivo completa el trabajo en los estados reales y permisos del alcance |
| **Componentes** | El sistema es dueño de cada patrón visible o interactivo que tenga componente adecuado. Crudo solo si la semántica nativa es necesaria o no hay equivalente |
| **Iconos** | Por `Icon`, `IconButton` o la prop `icon`; no SVG crudo ni componente de librería suelto |
| **Estilos** | Props y tokens antes que StyleX propio, estilos en línea o clases; cada regla propia tiene una razón (no había superficie soportada) |
| **Layout** | Las primitivas de layout expresan estructura, jerarquía, espacio y responsivo sin reconstruirlas en contenedores crudos/CSS |
| **Imágenes y assets** | Cada imagen, fuente y asset es intencional, accesible, estable y carga desde la ruta del build del producto |
| **Salud del código** | Los imports públicos resuelven, los límites de cliente son necesarios, los estados alcanzables están manejados, sin código muerto ni wrapper que oculte hallazgos |

Cita: ruta/hermana/guía/tema/catálogo/requisito para lo que depende del contexto; **archivo y línea** para cada resultado de código; **el estado renderizado** para cada resultado visual. Un **bloqueo** es lo que impide compilar, renderizar, operar, completar la tarea o cumplir un requisito de accesibilidad.

### Cómo inspeccionar
- Revisa **cada etiqueta JSX de apertura**. Mover HTML crudo detrás de un helper PascalCase no lo vuelve componente del sistema.
- Cuenta cada elemento SVG crudo usado como icono (`svg`, `path`, `circle`, `rect`, `line`, `polyline`, `polygon`, `ellipse`, `g`); un helper SVG se cuenta una vez en su definición. Cuenta cada componente de librería de iconos fuera de una superficie de iconos del sistema.
- Antes de llamar "custom" o "mal" a un patrón, compara con hermanas y con el catálogo instalado; reutiliza el wrapper o componente de integración que ya hace ese trabajo.
- Revisa cada `stylex.create`, estilo en línea, `className` y `stylex.props`: busca primero prop o token.
- Al reemplazar un espaciado literal, busca el paso o token correspondiente (`astryx docs spacing --full`) y la escala de la prop del componente: **no adivines la conversión px → paso**.
- Elige la raíz según la superficie: `Layout` para página, `Center` para centrado, `AppShell` solo si la superficie es dueña del cromo global.
- Renderiza estados **vacío, cargando, error, contenido largo e interactivo**; ancho estrecho y amplio; cada modo de color.
- Roles y permisos, locales y RTL, móvil; sigue la tarea real de la entrada al final, no solo la página estática.
- Corre **build, type check, tests y checks de accesibilidad**. Un check que falta o falla se deja visible.

## 4. Auditor automático de código
```bash
node ${CLAUDE_SKILL_DIR}/scripts/auditar-ui.mjs src/            # tabla por archivo
node ${CLAUDE_SKILL_DIR}/scripts/auditar-ui.mjs src/ --json     # para otra herramienta
node ${CLAUDE_SKILL_DIR}/scripts/auditar-ui.mjs src/ --estricto # sale con código 1 si hay hallazgos
```
Detecta (heurística por texto; **no sustituye** la revisión renderizada): etiquetas HTML crudas que tienen componente (`div`, `span`, `p`, `h1`–`h6`, `button`, `a`, `input`, `textarea`, `select`, `ul/ol/li`, `table`, `hr`, `dialog`, `details`), `<svg>` crudo, colores `#hex`/`rgb()`/`hsl()`, medidas `px` fijas, `style={{…}}`, imports `.css` relativos que no sean las hojas globales (`globals`, `index`, `main`) y `@apply`, y señales de Card soup (muchas `Card`) y Badge decorativo (muchas `Badge`). Ignora `node_modules`, `dist`, `build`, `.next`, `*.test.*`, `*.stories.*` y los archivos de definición de tokens (`*.stylex.*`, `tokens*`, `theme*`). Un `px` o `#hex` de un asset externo o de un ancho estructural es legítimo: júzgalo, no lo borres a ciegas.

## 5. Prompt de revisión para un agente
Primera pasada de **solo lectura** (los hallazgos originales deben quedar visibles). Reemplaza cada `<…>`:
```text
Evalúa qué tan bien <superficie> en <revisión> encaja en <app> y usa <el sistema de diseño>. No edites archivos en esta primera pasada.
Antes de evaluar:
1. Lee la guía de rúbrica (revision.md de la skill diseno-react-astryx).
2. Aprende el contexto: propósito de la app, ruta, shell, hermanas, tema y densidad, versiones instaladas, wrappers propios.
3. Corre el auditor: node <skill>/scripts/auditar-ui.mjs <carpeta>.
4. Renderiza los estados: vacío, cargando, error, contenido largo, estrecho, ancho, claro y oscuro.
Devuelve una tabla por categoría (bien / necesita trabajo / no inspeccionado) con evidencia (archivo:línea o estado renderizado) y una lista priorizada de arreglos con bloqueos primero.
Después de que yo apruebe, aplica los arreglos de uno en uno y repite el auditor y las capturas.
```

## 6. Pase final
- [ ] Contrato de layout escrito por región y atado a props
- [ ] Una acción primaria por región; un protagonista por región
- [ ] Sin Cards anidadas ni Card soup; colecciones como filas
- [ ] Sin `#hex`/`px` interiores ni estilos en línea; todo token
- [ ] Todos los estados renderizados y sin saltos de layout al cargar
- [ ] Teclado completo, foco visible y que vuelve; contraste; nombres accesibles
- [ ] Claro/oscuro y RTL revisados
- [ ] Build, tipos y tests en verde; auditor sin hallazgos o con cada hallazgo justificado
Luego `revision-visual` (ojo de director sobre capturas) y `qa-antes-de-publicar` (QA completo).
