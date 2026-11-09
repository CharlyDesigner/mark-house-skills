---
name: mesa-de-edicion
description: 'Mesa de edición visual local para revisar una edición de video como en un editor (línea de tiempo con miniaturas, forma de onda del audio final, pistas de video, audio, efectos y subtítulos, reproductor sincronizado y panel de problemas automáticos: audio más largo que su lugar, clips encimados, huecos, efectos sobre la voz, subtítulos encimados o desfasados). Incluye una API JSON para que el agente consulte qué hay en cualquier segundo y saque capturas sin leer archivos sueltos. Úsalo cuando pidan "ábrelo en un editor", "quiero ver la línea de tiempo", "revisa la edición", "por qué se encima el audio", "dónde está mal", o antes de entregar un video armado por script (streams, episodios, reels).'
argument-hint: "[archivo .linea.json o carpeta del proyecto]"
---

# Mesa de edición

Un servidor local (Node 20+, sin dependencias; usa `ffmpeg`/`ffprobe` del PATH) que muestra cualquier edición
descrita en un archivo `*.linea.json` como en un editor de video, y marca solo lo que está mal.
Formato del archivo y reglas de cada problema: [formato-linea.md](formato-linea.md).

## 1. Consigue la línea de tiempo
- Si el proyecto ya tiene un exportador (busca `exportar_linea*` o un `*.linea.json`), úsalo.
- Si no, escribe uno pequeño para el motor del proyecto (ver "Escribir un exportador" en formato-linea.md) y déjalo
  **en ese proyecto**, no en esta skill.
- Para un video sin script de edición, basta con `render` y una pista de subtítulos o marcadores escrita a mano.

## 2. Ábrela
```bash
node "${CLAUDE_SKILL_DIR}/scripts/servidor.mjs" proyecto.linea.json --puerto 4600
```
- Si el entorno tiene panel de navegador (preview), crea la entrada en `.claude/launch.json` y ábrela con él; si no,
  dale al usuario la URL `http://127.0.0.1:4600`.
- La primera vez calcula la forma de onda y mide el audio de cada clip (unos minutos en un video de 45 min); queda en
  caché en `.mesa-cache/` junto al archivo (agrégalo a `.gitignore`). `--sin-analisis` omite la medición.
- Al cambiar el `.linea.json`, botón **Recargar** (o `GET /api/recargar`).

## 3. Revísala (tú, sin leer archivos sueltos)
| Pregunta | Cómo |
|---|---|
| ¿Qué está mal? | `GET /api/problemas` (lista con tiempo, tipo, severidad y mensaje) o el panel de la derecha |
| Resumen | `GET /api/resumen` |
| ¿Qué hay en el 11:17? | `GET /api/en?t=677` → clips de cada pista en ese instante y problemas a ±5 s |
| ¿Cómo se ve? | `GET /api/captura?t=677&ancho=1280` (JPG del render) o captura de pantalla del panel |
| Estado de la interfaz | El texto oculto `#estado` (lo lee `get_page_text`): tiempo del cabezal, clips y problemas cerca |

En el navegador: clic o arrastre en la línea = mover el cabezal · rueda = desplazar · Ctrl + rueda o `+`/`−` = zoom ·
`F` = ver todo · espacio = reproducir · flechas = ±1 s (Shift ±5 s) · pasar el cursor sobre un clip = detalle.
Lectura rápida de colores: azul = video normal, naranja = acelerado, morado = inserto, verde = tarjeta, rojo en la
pista de audio = audio que se pasa de su lugar, rojo/amarillo en la franja inferior = error/aviso.

## 4. Corrige y vuelve a mirar
Los cambios se hacen en el motor o el EDL del proyecto; después: exportar la línea otra vez → **Recargar** → la lista
de problemas debe bajar a cero errores. No entregues con errores abiertos; los avisos se revisan uno por uno.

## Límites (fase 1)
- Solo revisa: todavía no edita (mover, recortar, dividir) desde la interfaz.
- El reproductor usa el `render`: muestra lo último renderizado, no cambios sin renderizar.
- Los desfases de subtítulos vienen medidos de fuera (p. ej. `postproduccion/scripts/verificar_subtitulos.py`).
