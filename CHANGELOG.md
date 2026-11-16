# Changelog

Formato: [versión] — fecha. Versionado semántico (parche: corrección · menor: skill nueva o mejora · mayor: cambio que rompe el uso).

## [1.14.0] — 2026-11-15
**pixel-art-animado** (skill nueva) — videos en pixel art con motion graphics a partir de un kit reutilizable de personaje y escenarios:
- `SKILL.md`: reparto IA/código, estructura del kit, flujo (arte base → pixelar → ubicar ojos y boca → guion → render → revisión), reglas de pixel art (NEAREST, cámara en píxeles enteros, paleta por moda, UI escalada por entero, luz de borde) y checklist.
- `scripts/pixelizar.py`: pixel art real desde imágenes de IA — paleta compartida entre cuadros, reducción por moda, quita chroma y halos rosas. Probado.
- `scripts/escena_pixel.py`: render 1080x1920 desde `kit.json` — entrada con rebote, saludo, parpadeo y 3 bocas dibujadas por código, boca guiada por el volumen de la voz, cámara alineada a la cuadrícula, globos con máquina de escribir, lower third, glitch RGB, blips chiptune; `--revisar` genera la hoja de la cara. Probado.
- `prompts.md`: prompts probados para pose base desde foto, poses editando la base (alineación exacta) y escenario vertical.
- Lecciones: Press Start 2P dibuja las mayúsculas acentuadas como minúsculas (se dibujan a mano); al leer coordenadas de una vista ampliada, calcular la escala real o los párpados y bocas caen fuera de lugar.

## [mark-house-tema 1.0.1] — 2026-11-15
**mark-house-tema** — el vidrio sobre los fondos animados baja de 42 % a 25 % de opacidad para que se vean más.

## [mark-house-tema 1.0.0] — 2026-11-15
**mark-house-tema** (plugin nuevo, aparte de `mark-house`) — tema para la app de escritorio y móvil de Claude Code:
- 8 looks en claro y oscuro con paletas revisadas con el validador de contraste del sistema de diseño: Código, Píxeles, Galaxia, Geometría, Mark House, Océano, Atardecer y Lima.
- Fondos animados en SVG + CSS (sin scripts): lluvia de código, pared de LEDs con personajes de píxeles, galaxia con planetas, cohete y estrellas fugaces, figuras que flotan; capa de calma en el centro y `prefers-reduced-motion`.
- `/tema`, `/tema siguiente` y atajos `/temacodigo`, `/temapixeles`…; el tema elegido se guarda.
- Probado en la app de escritorio (Windows). Lección: con `glass` fuerte (blur 22, opacidad 0.74) la app tapa el fondo por completo; quedó en blur 3, opacidad 0.42.

## [1.13.0] — 2026-11-15
**auditoria-redes-y-pauta** (skill nueva) — auditoría de redes con datos reales y plan de pauta:
- `SKILL.md`: flujo datos → causas → lo que sí funcionó → plan orgánico → pauta → KPIs; tabla de 8 causas de poco alcance con su umbral (audiencia diminuta, puro anuncio, skip rate > 70%, formato equivocado, sin cara, mensaje disperso, copy de plantilla, técnicos); reglas de arranque del reel; campañas Calentar y Conversaciones a WhatsApp; fórmula de cuánto pagar por conversación; checklist de entrega.
- `metricool-campos.md`: IDs de campos de Metricool que sí devuelven datos (feed, reels con skip rate, Facebook) y trampas probadas: mejor hora en ceros con cuentas chicas, desgloses demográficos vacíos, alcance de reels de Facebook en 0.
- `pauta-y-benchmarks.md`: conexión del MCP oficial de Meta Ads (`mcp.facebook.com/ads`, sin probar) con reglas de seguridad, CPM de México 2026 con fuente, señales del algoritmo de Instagram y alcance orgánico de referencia.

## [1.12.0] — 2026-11-14
**kit-video-producto** (skill nueva) — pipeline para videos de producto 3D para redes, con la especificación completa para que Claude Code construya el kit dentro de cada proyecto:
- `SKILL.md`: reparto de herramientas (Remotion arma, R3F hace el 3D en tiempo real, Blender Cycles las tomas estrella, la IA generativa solo en puntos concretos), flujo de 12 pasos, reglas que ya funcionaron en un comercial real (tiempo en compases a 100 BPM, lente por formato `2·atan(tan(fov/2)·k)`, zonas seguras verticales 270 px / y≈1536, Khronos PBR Neutral = `THREE.NeutralToneMapping`, material caramelo, voz de catálogo en vez de clonada o diseñada, −15 LUFS) y checklist de entrega.
- `especificacion.md`: estructura del proyecto, esquema del JSON por video (frases, escenas, cámara y cortes por formato), módulo de movimiento compartido entre Remotion y Node, retícula por formato, componentes (`Video` con cortes por `Sequence` desplazada, `Escena3D`, `Subtitulos`, `useVolumen`, `ZonasSeguras`), scripts de voz, palabras, música, mezcla, cortes, medición, cámara y series, y el script de Blender (OptiX, ejes Three → Blender, cámara por cuadro en cuaternión, PNG con número de cuadro fuente).
- Recetas de ffmpeg probadas en 6.1: sidechain + amix, loudnorm de dos pasadas, cortes por compás con fundidos de 15 ms y `ebur128`. Trampa documentada: en ffmpeg 6.1, `silenceremove` deja ≈ `stop_duration + stop_silence` de silencio; la receta exacta usa `silencedetect` + `atrim`.
- Lo que no se ha construido todavía queda marcado como (sin probar).

## [1.11.0] — 2026-11-14
**apps-manejables-por-ia** (skill nueva) — arquitectura para que una app, editor o plugin funcione primero a mano y después lo manejen IAs sin reescribirlo:
- Regla central: cada acción de la UI es un comando con nombre, esquema JSON, permiso, resultado y deshacer; la UI, la IA y la API usan los mismos comandos.
- Estado como JSON versionado con migraciones y tokens en vez de valores sueltos.
- Exposición por MCP según plataforma: WordPress 6.9+ con Abilities API + MCP Adapter oficial (ejemplo de `wp_register_ability`, sin probar), servidor MCP propio en Node y stdio en Electron.
- Panel de IA propio: llave del proveedor solo en el servidor, OpenRouter con llaves por cliente con límite y reinicio, créditos prepagados o BYOK, modos "Rápido/Pro" en vez de nombres de modelo, y la IA generando datos validados contra el esquema en lugar de HTML libre.
- Orden de construcción en cuatro pasos y checklist de la capa de IA. Basada en documentación oficial de WordPress y OpenRouter; el código PHP no se ejecutó.

## [1.10.0] — 2026-11-14
**diseno-react-astryx** — receta probada de una app grande ("Mark House Studio OS": 15 módulos, 12 plantillas oficiales con ~12 900 líneas, 7 temas en vivo, paleta de comandos), verificada en dev, en `vite build` + `vite preview`, a 1440 y 375 px, y con `astryx doctor` sin fallos:
- `recetas-probadas.md`: plantillas en masa con el CLI (solo dentro del proyecto, dependencias que piden), StyleX en Vite 8 con `@stylexjs/unplugin` (tipado a mano e inyección de CSS en dev), verificar las plantillas con StyleX en el build, rutas `lazy` con `HashRouter` y `base: './'`, los 7 temas anidados en una misma página, paleta de comandos global y `useToast`.
- Trampas nuevas: import circular entre catálogo y página (pantalla en blanco), `Kbd` invisible dentro de un botón primario, `doctor` que pide el `theme.css` junto al import del tema, fuentes externas de los temas, y que las plantillas oficiales no cumplen sus propias reglas de estilo (punto de partida, no modelo).

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
