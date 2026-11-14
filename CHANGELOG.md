# Changelog

Formato: [versión] — fecha. Versionado semántico (parche: corrección · menor: skill nueva o mejora · mayor: cambio que rompe el uso).

## [1.9.0] — 2026-11-14
**diseno-react-astryx** — probada armando una pantalla real (tabla de solicitudes con filtros, panel de detalle redimensionable y BottomSheet en móvil) con Vite 8, React 19 y Astryx 0.7.16, verificada en navegador a 1440, 900 y 375 px, en claro y oscuro, con `tsc`, `vite build`, `astryx doctor` y el auditor:
- `recetas-probadas.md` (nuevo): receta de proyecto Vite con CSS plano (sin compilador StyleX), el CLI en la práctica (`build` en inglés, plantillas como demos de miles de líneas, `component --json`, `doctor --built` sobre el proyecto), imports que funcionan, lo que el sistema hace solo (menú móvil del AppShell, foco de vuelta en BottomSheet) y el patrón maestro-detalle con contrato responsivo.
- Trampas encontradas y documentadas: `Table<T>` pide `type` y no `interface`; `proportional` con `minWidth` infla todas las columnas (usar `pixel` en las cortas); el `label` de `StatusDot` no se pinta; clic de fila con plugin `transformBodyRow`; BottomSheet que se abría solo; `SegmentedControl` y botones largos que se truncan en teléfono; opciones de Selector sin contexto.
- `auditar-ui.mjs`: ya no cuenta los px de un breakpoint de media query.
- `tematizacion-y-setup.md`, `plantillas.md`, `componentes.md`, `revision.md`: los comandos probados dejan de estar marcados como sin probar; se agrega `astryx doctor` y el editor experimental de temas (sin probar).

## [1.8.0] — 2026-11-14
**diseno-react-astryx** (skill nueva) — diseño de UI de producto en React con criterio de sistema, destilado del sistema de diseño Astryx de Meta (MIT, 0.7.17, créditos y licencia en `creditos.md`):
- `SKILL.md`: flujo de siete pasos de afuera hacia adentro (entender, armazón, estructura, espacio, responsivo, estados, verificar), 12 reglas de oro, tablas de decisión (contenedor, indicador de estado, control de selección, superficie flotante, carga), antipatrones de "UI genérica", pruebas rápidas (entrecerrar los ojos, sin bordes, línea de contenido) y qué hacer según el proyecto tenga Astryx u otra librería.
- Referencias: `tokens.md` (valores de espacio, radio, tamaño, color claro/oscuro, tipografía, sombra, foco y movimiento), `layout.md` (shell, regiones, navegación, paneles, cabeceras, espaciado, densidad, grids y contrato responsivo), `componentes.md` (catálogo por categoría, reemplazos de HTML crudo y reglas por componente), `principios-de-diseno.md` (tipografía, jerarquía espacial, ritmo de controles, énfasis de color, elevación, forma, movimiento, estados, iconos y accesibilidad), `tematizacion-y-setup.md` (CSS plano/Tailwind/StyleX, temas, modo oscuro, `defineTheme`, CLI y trabajo con IA), `plantillas.md` (58 plantillas de página y cómo elegir), `revision.md` (rúbrica con evidencia y prompt de auditoría).
- `scripts/auditar-ui.mjs` (probado con muestras buenas y malas y con las apps de ejemplo de Astryx): detecta HTML crudo con equivalente de componente, `<svg>` crudo, `#hex`/`rgb()`/`hsl()`, `px` fijos, `style={{}}`, imports `.css` propios, `@apply`, Card soup y Badge decorativo; salida en tabla o `--json`, y `--estricto` sale con código 1.
- Los comandos del CLI de Astryx vienen de su documentación y no se ejecutaron (marcados como sin probar).

## [1.7.0] — 2026-11-13
**correo-con-dominio-propio** (skill nueva) — crear un correo con el dominio del usuario (`contacto@dominio`), probado de punta a punta con un dominio .com.mx en Cloudflare y hosting cPanel/WHM de InMotion:
- `SKILL.md`: tabla para elegir el camino (Cloudflare Email Routing solo recibe; buzón en cPanel; Zoho; Workspace; servidor propio en el VPS desaconsejado y por qué), receta en 7 pasos (cuenta correcta, agregar dominio, leer valores en Email Deliverability, registros A `mail`/MX/SPF/DKIM/DMARC en DNS gris, buzón con contraseña que escribe el usuario, verificación con evidencia, datos de conexión por el hostname del servidor) y trampas (Email Routing choca con el MX de cPanel, lista de cPanel desactualizada tras crear, selector de dominio, spam, DMARC `p=none`).
- `automatizar-paneles.md`: lecciones de operar cPanel, WHM y Cloudflare con el Chrome del usuario: refs y `form_input` en vez de coordenadas (los formularios se mueven al escribir), copiar y pegar valores largos en vez de transcribirlos, campos de solo lectura que no se pueden leer, no repetir un Submit, nunca teclear contraseñas.

## [1.6.0] — 2026-11-13
**edicion-filmcraft** — versión vertical con cámara y nuevas trampas, probado en FilmCraft 0.20.1:
- `scripts/reencuadre.py` (nuevo): reencuadre a pantalla completa desde un `plan.json` de focos por toma (paneo hacia quien va a hablar, acercamiento lento, golpes de zoom); abre y verifica la secuencia antes de tocar nada, borra keyframes con `toggleAnimation` y pone keyframe de posición en cada cambio de escala para no despegar la imagen del borde.
- `scripts/bordes.py` (nuevo): busca franjas negras en las cuatro orillas cada N segundos y cuadro por cuadro en los tramos indicados; sale con código 1 si encuentra alguna.
- `fc.py`: `abrir` confirma que la app cargó ese proyecto (a veces restaura el último) y `proyecto` lo corrige con `file.open`.
- Receta "Versión vertical 9:16 con cámara": duplicar secuencia, identificar quién habla por frase con hojas de cuadros, plan de focos, retícula vertical (logo arriba al centro, subtítulos sobre los botones, leyenda legal abajo, texto lateral).
- Trampas nuevas: `effects.resetParam` agrega un keyframe en el cabezal en vez de borrar; `setInterpolation` en lote creó keyframes de más; Auto Reframe no llena el cuadro vertical; los comandos actúan sobre la secuencia activa (verificarla siempre); `history.list` + `edit.undo` para recuperar; `sequence.settings` no reacomoda; `addTracks` con `videoAfter: 0` crea la pista hasta abajo.

**postproduccion** — Reels/TikTok desde horizontal: pantalla completa reencuadrando con cámara que sigue a quien habla, no banda con fondo desenfocado salvo pedido; fps de la fuente si no es 30.

## [1.5.0] — 2026-11-13
**edicion-filmcraft** (skill nueva) — editar proyectos de FilmCraft (.fcproj) en vivo, con el usuario viendo cada cambio en el programa:
- `SKILL.md`: conexión en modo control (`--control` + `FILMCRAFT_CONTROL_TOKEN` de 64 hex; sin token la app apaga el servidor de control), flujo de trabajo, retícula 1280×720 con esquinas para logos fijos, y tabla de trampas probadas (`timeline.place` sobrescribe sin avisar, `render` no funciona con `--bridge`, puntos de `path` relativos, `fill_kind` por índice, índices de `setCharStyle` con ¡¿, conversión desde Premiere que pierde niveles de audio y transiciones de plugins).
- `recetas-filmcraft.md`: título gancho, intro de marca (degradado, rayos, anillos, logo con rebote, zoom blur), logo fijo que late al mencionarlo, stickers (etiqueta, estallido, cinta, lettering), karaoke, transiciones sincronizadas con whoosh/glitch, color base con Lumetri, cierre con producto y tarjeta, mezcla de intro/cierre.
- Scripts probados contra FilmCraft 0.20.1 en vivo: `fc.py` (token, abrir en modo control, exec, seq, exportar cuadro), `mg.py` (keyframes, estrellas, rebote, `place` que se niega a pisar una pista ocupada), `hoja.py` (hoja de contacto desde la app), `karaoke.py` (bloques automáticos ≤ 4 palabras, rebote, palabra activa resaltada, claves de color), `transcribir.py` (faster-whisper con tiempos por palabra) y `logo_sin_fondo.py` (quita fondo liso conservando blancos internos).

**postproduccion** — reglas nuevas: revisar el reporte de conversión entre editores (niveles de audio, transiciones de plugins), subtítulos estilo reel con karaoke y tamaño ≈ 7 % del alto, confirmar nombres propios dudosos de la transcripción, y paso de gráficos y marca (retícula, logos fijos, gancho, transiciones en cada whoosh, intro ≤ 3 s, cierre con llamado a la acción).

## [1.4.0] — 2026-11-13
Cuatro skills nuevas basadas en la serie "Architect" de Enrique Rocha / Hainrixz (MIT), reescritas en español con créditos y enlaces al original:
- **direccion-de-arte-ia** — prompts de imagen por 11 bloques, ancla de fidelidad al producto real, luz y lente con esquemas probados, 8 delatores de "se ve a IA" y revisión de 20 segundos (referencias: `bloques.md`, `luz-y-lente.md`, `antipatrones.md`). Base: Creative Architect.
- **campanas-visuales-ia** — producto → animar → avatar → UGC → estructura de anuncios de la competencia, en intenciones traducibles a cualquier MCP/API de generación, con reglas de dinero, consentimiento y honestidad. Base: Creative Architect.
- **editor-reels-remotion** — pipeline de edición de reels con EDL en JSON versionada, aprobación de texto, validación de reglas, render a -14 LUFS, QA y sistema de estilos aprendidos. Base: Video Editor Architect.
- **motion-graphics-remotion** — flujo con puertas (intake, referencias, marca, storyboard aprobado, stills, render por formato), tonos y zonas seguras 9:16. Base: Motion Architect.
- Las instalaciones de los repos originales están documentadas y marcadas "(sin probar)" donde no se ejecutaron.

## [1.3.0] — 2026-11-11
**entrega-de-diseno** (skill nueva) — entrega de un rediseño a Claude Code sin que se equivoque ni dañe la funcionalidad:
- `SKILL.md`: contenido del paquete (HANDOFF.md, PROMPT-CLAUDE-CODE.md, diseño de referencia, storyboards y videos), pasos, plantilla del prompt por etapas y modelo/esfuerzo recomendados (Opus 5.5 + `high`, verificado en la documentación el 2026-11-11).
- `plantilla-handoff.md`: estructura de la especificación (reskin, tokens, animaciones, mapa pantalla → ruta, interacciones causa → efecto, responsivo, verificación).
- `grabar-interacciones.md`: grabación por capturas con Playwright y 8 lecciones de grabaciones fallidas (barra fija que desvía clics, filtros con `role="tab"`, caché del visor, iframes, sliders).
- `scripts/storyboard.py` (video o carpeta → hoja numerada) y `scripts/video_de_cuadros.py` (capturas con tiempos reales → MP4, recorta pausas). Probados con 9 grabaciones reales de un rediseño.
- Clave: el agente lee imágenes pero no reproduce video; los storyboards son para él y los videos para el humano.

## [1.2.0] — 2026-11-09
**mesa-de-edicion** (skill nueva, fase 1) — mesa de edición visual local para revisar una edición como en un editor:
- `scripts/servidor.mjs` (Node 20+, sin dependencias, usa ffmpeg): línea de tiempo con miniaturas del render, forma de onda del audio final, pistas de video/audio/efectos/subtítulos/capítulos, reproductor sincronizado y panel de problemas automáticos (audio más largo que su lugar, clips encimados, huecos, efectos de transición sobre la voz, subtítulos encimados, fugaces o desfasados, duración del render).
- API JSON para el agente: `/api/problemas`, `/api/resumen`, `/api/en?t=`, `/api/captura?t=`; estado del cabezal en texto para leerlo desde el navegador.
- `formato-linea.md`: formato general `*.linea.json` y cómo escribir el exportador de cada motor.
- Probada con un episodio real de 46 min (248 piezas) y con un proyecto de prueba con 7 errores sembrados: los 7 detectados, sin falsos positivos en el clip acelerado correcto.

## [1.1.0] — 2026-11-08
**postproduccion** — edición de grabaciones largas (streams, podcasts, gameplays) sin audio encimado ni subtítulos desfasados:
- Nueva referencia `edicion-larga.md`: con `atempo`/`setpts`, `-ss` y `-t` van antes de `-i` (si no, cada tramo acelerado trae vel× audio de más y se encima); efectos de transición/whoosh con subida ≤ 0.25 s y nunca sobre la voz; subtítulos medidos contra el audio final; plano de la línea de tiempo; reintentos al unir; lista de revisión.
- Nuevo script `scripts/verificar_subtitulos.py` (SRT o ASS contra el audio final con faster-whisper, ventana larga y sin pista; probado con un episodio real de 46 min).
- `recetas-ffmpeg.md`: receta probada de tramo acelerado x4 desde una grabación larga (40 s → 10 s de video y audio).
- `SKILL.md`: sección "Grabaciones largas" y verificación de subtítulos antes de entregar.

## [1.0.0] — 2026-11-08
Primera versión pública del plugin `mark-house`, 30 skills.

**Creación digital (14):** director-creativo, biblia-de-estilo, diseno-de-personajes, guion-y-storyboard, direccion-de-escena, generacion-imagen-ia, generacion-video-ia, produccion-3d, animacion-con-codigo, escenas-3d-web, postproduccion, revision-visual, diseno-de-juego, identidad-visual.

**Ingeniería (15):** director-proyecto, interrogar-plan, lenguaje-del-dominio, escribir-spec, disenar-dos-veces, plan-en-rebanadas, construir-con-tdd, depurar-sistematico, mejorar-arquitectura, qa-antes-de-publicar, verificar-antes-de-terminar, commits-convencionales, guardarrailes-claude-code, preparar-pre-commit, consenso-multiagente.

**Mantenimiento (1):** actualizar-mis-skills.

**Scripts probados:**
- Blender 5.2 headless: `render_preview.py` (ciclorama, 3 puntos relativos a cámara, turntable girando el objeto), `inspeccionar.py`, `exportar.py` (web/godot/unity/unreal/impresión).
- ffmpeg 6: 31 recetas en `postproduccion/recetas-ffmpeg.md`.
- `hoja_contacto.sh` (videos y carpetas → una imagen), `capturar.mjs` (Playwright, móvil y escritorio, consola y FPS).
- `guardarrailes.mjs`: 29/29 casos correctos.

**Lecciones incluidas desde el inicio:**
- Descripciones de skill con `: ` rompen el YAML si no van entre comillas.
- `ffmpeg` dentro de `while read` necesita `-nostdin`.
- En Blender 5.x el id de EEVEE es `BLENDER_EEVEE`; se detecta en vez de fijarlo. Las acciones usan capas desde 4.4.
- Un turntable de estudio gira el objeto, no la cámara (luz y fondo constantes).
- Playwright es CommonJS: un script fuera del proyecto debe cargarlo con `createRequire` desde el directorio actual.
- Basado en la revisión del hilo "67 Claude Skills": varios comandos de instalación del post ya no existen.
