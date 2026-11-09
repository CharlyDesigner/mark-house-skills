# Changelog

Formato: [versión] — fecha. Versionado semántico (parche: corrección · menor: skill nueva o mejora · mayor: cambio que rompe el uso).

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
