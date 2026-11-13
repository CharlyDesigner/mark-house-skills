# Changelog

Formato: [versión] — fecha. Versionado semántico (parche: corrección · menor: skill nueva o mejora · mayor: cambio que rompe el uso).

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
