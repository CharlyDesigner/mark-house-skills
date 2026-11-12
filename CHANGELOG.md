# Changelog

Formato: [versión] — fecha. Versionado semántico (parche: corrección · menor: skill nueva o mejora · mayor: cambio que rompe el uso).

## [1.4.0] — 2026-11-12
**posts-desde-fotos** (skill nueva) — fotos reales a posts y carruseles de redes en 4:5 (1080×1350):
- `SKILL.md`: un encuadre distinto por slide (portada amplia, zooms ≤ 1.5×, cierre), capas y retícula por defecto, titulares de 2 líneas con acento y cinta de subtítulo, trampas técnicas (línea base común con `anchor='ls'`, `python -I` e imports, subtítulo en posición fija) y revisión slide por slide antes de entregar.
- `scripts/quitar_fondo_logo.py`: quita el fondo liso de un logo por flood-fill desde las esquinas (conserva el blanco interior) y agrega borde tipo sticker. Probado con un logo de 5000×5000.

**logos-redes-svg** (skill nueva) — íconos de redes sociales oficiales en vez de dibujarlos a mano:
- `scripts/generar_logos.py`: baja `simple-icons` (CC0) y genera `<red>.svg` (color de marca tomado del paquete), `-blanco.svg` y `-negro.svg` más `LEEME.txt`. Probado con facebook, instagram, tiktok y youtube.
- Cómo pasarlos a PNG suave (`rsvg-convert` a 4× y reducir) y qué variante usar según el fondo.

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
