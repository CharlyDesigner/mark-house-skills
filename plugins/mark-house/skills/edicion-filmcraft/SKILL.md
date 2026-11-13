---
name: edicion-filmcraft
description: 'Edita proyectos de FilmCraft (ArtCraft, archivos .fcproj) EN VIVO desde Claude Code: el usuario ve cada cambio en el programa abierto. Conecta la app en modo control, arma o rearma el montaje, transcribe la voz, crea subtítulos de reel con karaoke, motion graphics nativos (títulos gancho, stickers, logos fijos, estallidos), intro y cierre de marca, transiciones sincronizadas con los efectos de sonido, color con Lumetri, niveles de audio y exporta. Úsalo cuando digan "edita mi proyecto de FilmCraft", "usa el programa", "ponle subtítulos y cosas para llamar la atención", "hazle intro y final", "agrégale motion graphics", "ábrelo en FilmCraft", o cuando haya un .fcproj en la carpeta.'
argument-hint: "[proyecto.fcproj]"
---

# Edición en FilmCraft (en vivo)

FilmCraft trae `filmcraft-cli`, que maneja la app abierta con 700+ comandos (los mismos de los menús). El usuario quiere
**ver la edición en el programa**: trabaja en vivo, no sobre una copia, salvo que lo pida.
Recetas de cada pieza (intro, logos, stickers, karaoke, cierre, color): [recetas-filmcraft.md](recetas-filmcraft.md).

## 1. Conectar (una vez por sesión)
1. ¿La app está abierta? Revisa los argumentos del proceso `filmcraft`. Si se abrió sin `--control`, **no hay conexión**:
   pide al usuario que guarde (Ctrl+S) y cierre, y ábrela tú en modo control.
2. Token: `python ${CLAUDE_SKILL_DIR}/scripts/fc.py token` → guárdalo en un archivo del scratchpad y en `FILMCRAFT_CONTROL_TOKEN`.
   Sin un token de 64 hex la app arranca pero **apaga el servidor de control** (el log dice "control server disabled").
3. Abrir: `python ${CLAUDE_SKILL_DIR}/scripts/fc.py abrir proyecto.fcproj` (puerto `FILMCRAFT_PORT`, 4700 por omisión).
4. Probar: `python ${CLAUDE_SKILL_DIR}/scripts/fc.py seq` → lista pistas y clips.
- Nunca edites el `.fcproj` a mano ni en modo headless mientras la app lo tiene abierto: al guardar, la app lo pisa.
- Si el usuario guardó cambios hace poco, vuelve a inspeccionar la secuencia antes de editar: lo que creías que había puede ya no estar.

## 2. Descubrir comandos
| Necesito | Cómo |
|---|---|
| Lista filtrada | `filmcraft-cli commands caption` (o `graphics`, `transcript`, `effects`, `timeline`) |
| Parámetros de uno | `filmcraft-cli describe graphics.newText` |
| Ids de efectos y transiciones | `fc.ex('effects.list', {'kind': 'Video'})`, `'VideoTransition'`, `'Audio'` |
| Parámetros de un efecto | `fc.ex('effects.list', {'kind': 'Video', 'detail': True})` |
| Propiedades de una capa de gráfico | crea una y lee sus `effects` en `fc.seq()` (graphic_text / graphic_shape) |

Tiempo: **254016000000 ticks por segundo**; la mayoría de comandos aceptan `frame`, `seconds` o `timecode`.

## 3. Flujo
1. **Inventario**: `fc.seq()`, `ffprobe` de los clips, reporte de conversión si el proyecto vino de Premiere (ver §5).
2. **Montaje**: `timeline.place` (item, pista, cuadro, `sourceIn`, `duration`). Para ver el resultado: `scripts/hoja.py`.
3. **Voz → texto**: arma el audio de voz con los mismos cortes (ffmpeg concat) y `scripts/transcribir.py`
   (faster-whisper local; `transcript.generate` de la app descarga su modelo la primera vez: pide permiso).
   Revisa a mano marcas y nombres propios con probabilidad baja y **pregunta los que no sean claros**.
4. **Subtítulos**: `scripts/karaoke.py` (bloques ≤ 4 palabras, rebote, palabra activa resaltada, claves de color).
5. **Motion graphics, intro y cierre**: recetas. Antes de crear, define la **retícula** (§4).
6. **Transiciones y sonido**: transición en cada corte que ya tenga whoosh/glitch; música más baja bajo la voz.
7. **Color**: Lumetri igual en todas las tomas (receta).
8. **Revisión**: hoja de contacto de todo el video + cuadros a mitad de cada transición; mide el audio exportando
   un WAV (`file.exportMedia` format wav) y `ffmpeg -af ebur128` por tramo. Guarda con `file.save`.
9. **Exporte** solo cuando el usuario lo apruebe: `file.exportMedia` con `loudnessLufs: -14` para redes.

## 4. Retícula (1280×720; escala proporcional en otros tamaños)
| Zona | Uso |
|---|---|
| Margen seguro 64 px | nada importante fuera |
| Esquinas superiores (≈ 150×90 px) | logos fijos de marca, uno por lado, todo el video |
| Franja superior y 64–180, centro | título gancho de los primeros segundos, avisos ("PRÓXIMAMENTE") |
| Columna izquierda bajo los logos (y 180–320) | stickers puntuales (etiquetas, estallidos) |
| Tercio inferior, línea base y ≈ 0.9·alto | subtítulos centrados |
Pregunta al cliente qué logos deben estar **siempre** en pantalla (marca del producto, distribuidor) y resérvales esquina.

## 5. Trampas conocidas
| Trampa | Qué hacer |
|---|---|
| `timeline.place` con `insert:false` **sobrescribe** sin avisar lo que haya en la pista | usa `mg.place` (revisa que el tramo esté libre) o una pista nueva (`sequence.addTracks`) |
| `graphics.newText`/`newShape` en pista ocupada: "Vx is not free here" | agrega pista y usa su índice (`track` es índice 0-based) |
| `filmcraft-cli render` no funciona con `--bridge` | `file.exportFrame` (`fc.frame`) |
| Puntos de una forma `path` | son **relativos** a `position` (centro en 0,0) |
| `fill_kind` | es índice: 0 sólido, 1 degradado lineal (`gradient_angle` 90 = vertical) |
| Rango de `graphics.setCharStyle` | cuenta `¡` y `¿`; calcula con `texto.index(palabra)` |
| Imágenes fijas | entran a tamaño nativo: escala en % con Motion `scale` |
| `timeline.razor` sobre un gráfico | duplica el gráfico con su texto, estilo y keyframes: base del karaoke |
| Conversión desde Premiere (XML) | se pierden niveles de audio (Audio Levels 0.1 = −20 dB), transiciones de plugins (Animation Composer, .mogrt) y varios efectos: lee el reporte, restaura niveles (`clip.audioGain`) y repón transiciones donde quedaron los whoosh |
| Volumen por tramos | keyframes de `volume` → `level` (dB relativos a la ganancia del clip) |
| Transiciones | `sequence.applyVideoTransition` con `align: center`; si no hay material extra, prueba `start`/`end` |

## 6. Entregar
Resume: qué cambió (montaje, subtítulos, gráficos, audio), qué palabras dudosas quedaron por confirmar, y que
el proyecto está guardado. Ofrece el exporte. Lo específico de un cliente (logos obligatorios, nombres de
personajes) va a la memoria del proyecto, no a esta skill.
Relacionadas: `postproduccion` (reglas de ritmo, sonido y subtítulos), `revision-visual`, `mesa-de-edicion`.
