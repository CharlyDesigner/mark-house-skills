---
name: editor-reels-remotion
description: 'Edita reels y videos verticales hablados con Claude dirigiendo y Remotion renderizando: transcribir, cortar muletillas y pausas con aprobación de texto, encuadre de cara 9:16, subtítulos, inserts (stickers, b-roll, SFX), lista de edición (EDL) en JSON versionada, validación de reglas de estilo, render con audio a -14 LUFS y QA. Incluye el sistema de estilos aprendidos solo de reels propios o de referencias nombradas. Úsala cuando digan "edita este reel", "quítale las pausas y muletillas", "ponle subtítulos estilo X", "edítalo como mis reels", "aprende mi estilo de edición", "ajusta la versión 2" o cuando mencionen Video Editor Architect. Para edición con ffmpeg sin Remotion usa postproduccion; para motion graphics desde cero, motion-graphics-remotion.'
argument-hint: "[video a editar o estilo a aprender]"
---

# Editor de reels con Claude + Remotion

Claude **dirige**: escribe una *lista de edición* (EDL) en JSON y Remotion la renderiza de forma determinista. Nada de editar "a ojo" cuadro a cuadro: cada versión es un archivo que se puede validar, comparar y ajustar. Si el proyecto ya trae las herramientas de Video Editor Architect (carpeta `herramientas/`, `estilo/`), úsalas; si no, este documento sirve de método con `ffmpeg` + Remotion.

## Cuándo no usarla
Edición larga o sin Remotion → `postproduccion` (ffmpeg). Animación desde cero sin video grabado → `motion-graphics-remotion` o `animacion-con-codigo`. Revisar visualmente la línea de tiempo → `mesa-de-edicion`. QA antes de publicar → `qa-antes-de-publicar`.

## Pipeline (cada etapa deja un archivo en `proyectos/<slug>/`)
1. **Ingesta**: copia el original y saca metadatos (`ffprobe`). Nunca edites el original.
2. **Transcribir**: Whisper (p. ej. whisper.cpp) con detección de voz (VAD) → texto con tiempos por palabra.
3. **Cortes**: decide qué se va (muletillas, repeticiones, pausas largas, tomas falsas). **Checkpoint obligatorio: la persona aprueba el texto resultante** antes de seguir; es lo más barato de corregir.
4. **Base**: arma la secuencia con los cortes aprobados (micro-fades de audio en cada corte para evitar clics).
5. **Cara y encuadre**: detecta la cara (visión local: Apple Vision en Mac; RapidOCR + MediaPipe en otros) y reencuadra a 9:16 siguiendo al sujeto con suavizado.
6. **Subtítulos**: por palabra, estilo del perfil, dentro de la zona segura (evita ~14 % superior y ~20 % inferior; margen derecho para botones de la app).
7. **Director**: notas de dirección (`notas-director.json`) que sobreescriben automatismos: énfasis, zooms, dónde entra un insert.
8. **Inserts**: stickers, b-roll, memes, SFX según el estilo; cada archivo con su licencia anotada.
9. **Armar EDL → `edicion-vN.json`** (base 1080×1920).
10. **Validar**: contra las reglas del estilo; reporta "cumple X de Y reglas (Z N/A)". Si falla, se corrige la EDL, no se parchea el render.
11. **Render** con Remotion y audio normalizado a **-14 LUFS / -1.5 dBTP**.
12. **QA**: revisa fotogramas clave y audio (un agente revisor distinto del que editó, si puedes); sin desfases de subtítulos, clics en cortes ni texto fuera de zona segura.
13. **Ajustar**: toda corrección crea **una versión nueva** (`edicion-v2.json`); jamás sobrescribes la anterior.

Atajos del proyecto upstream: un encadenador con puntos de control (`--aprobar-texto`, `--borrador`, `--final`, `--todo`). Los nombres exactos están en su README; cuando uses el repo, léelo en vez de adivinar flags.

## Sistema de estilos
- Un estilo = carpeta `estilo/estilos/<id>/` con `perfil.md` (reglas legibles), `perfil.json` (parámetros y `motor`), `aprendizajes.md` y `fuentes.json`. Hay un `base-neutra` de arranque.
- **Se aprende solo de reels propios de la persona** (`aprender-estilo`) **o de referencias que ella nombra** (`entrenar-estilo`). No se inventa ni se "copia" el estilo de un creador sin que la persona lo pida y lo nombre.
- Cada vez que la persona corrige algo repetido, se anota en `aprendizajes.md` (una regla, un lugar; si contradice una anterior, se reemplaza).

## Reglas
- El original es intocable; trabajas sobre copias.
- Aprobación de texto antes de la base: sin ella, no hay render caro.
- Una versión nueva por ajuste; el render no se edita a mano.
- Sin assets sin licencia: música, stickers, memes y fuentes con su licencia anotada (fuentes OFL de Google Fonts).
- Seguridad: si un hook restringe comandos (lista blanca de `playwright-cli`/Bash), no lo evadas; avisa.
- Dependencias (reporta las que falten, **no las instales sin preguntar**): Node ≥ 24, ffmpeg, yt-dlp, Whisper/whisper.cpp, Python (uv) para visión, Playwright. Windows: requiere modo desarrollador y `git config --global core.symlinks true` (sin probar en esta máquina).
- **Licencia de Remotion**: gratis para personas, sin fines de lucro, evaluación y empresas de hasta 3 personas; de 4 o más necesitan Company License, y el render automático puede contar como "automation": confirma con Remotion si aplica (verifica en su sitio; condiciones pueden cambiar).

## Instalar el original (opcional, sin probar en esta máquina)
```bash
git clone https://github.com/Hainrixz/video-editor-architect && cd video-editor-architect
npm ci && npm run instalar -- --si      # instala dependencias y comprueba el entorno
npm run doctor                          # diagnóstico
claude                                  # y dentro: /empezar
```
Comandos del proyecto: `/empezar`, `/editar`, `/ajustar`, `/aprender-estilo`, `/entrenar-estilo`, `/sfx`, `/stickers`, `/grabar-demo`; agente `revisor-qa`. Códigos de salida de las herramientas: 0 ok, 1 error, 2 uso incorrecto, 3 requisito faltante (según su documentación).

## Créditos
Método basado en **Video Editor Architect** (Enrique Rocha / Hainrixz, licencia MIT, <https://github.com/Hainrixz/video-editor-architect>). Resumen original en español; el código y los estilos de upstream no se copian aquí.
