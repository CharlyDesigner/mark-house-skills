---
name: generacion-video-ia
description: 'Produce video con IA toma por toma desde Claude Code - texto a video, imagen a video desde keyframes aprobados, frame inicial y final, movimiento de cámara y de sujeto, continuidad entre clips, avatares que hablan y lip-sync, edición de video con IA, y ensamblado final con ffmpeg. Úsalo para comerciales, reels, cortos, videoclips, cinemáticas y animaciones de personajes generadas con modelos de video.'
argument-hint: "[toma o pieza a generar]"
---

# Generación de video con IA

Los modelos de video generan **clips cortos** (normalmente 4–10 s). Una pieza buena es un montaje de muchos clips bien dirigidos, no un prompt largo.

## Flujo por toma
1. **Keyframe primero**: genera y aprueba la imagen del primer frame con `generacion-imagen-ia` (personaje + escenario + luz + encuadre correctos). Imagen a video conserva consistencia mucho mejor que texto a video.
2. **Prompt de movimiento** (en inglés), describiendo solo lo que cambia:
   ```
   [movimiento de cámara único], [acción del sujeto con verbo concreto y velocidad],
   [movimiento del entorno: pelo, tela, humo, lluvia, luces], [duración/ritmo], [bloque de estilo corto]
   ```
   Ej.: `slow dolly in, the girl looks up from the soldering iron and smiles slightly, sparks drift upward, rain streaks on the window, gentle and quiet`.
3. **Una acción y un movimiento de cámara por clip.** Varias acciones encadenadas = clips separados.
4. **Frame final** (si el modelo lo soporta): fija también el último frame para transiciones controladas o para encadenar con el siguiente clip.
5. **Prueba barata** (baja resolución o pocos segundos), mira el resultado con `revision-visual` (hoja de contacto de frames), y luego genera la versión final.

## Continuidad entre clips
- Extrae el último frame del clip aprobado y úsalo como primer frame del siguiente cuando la acción continúa:
  `ffmpeg -sseof -0.1 -i clip.mp4 -frames:v 1 -update 1 ultimo.png`
- Mantén ficha de personaje, bloque de estilo, dirección de luz y lente iguales en toda la escena.
- Respeta el eje de 180° y la regla de 30° (ver `direccion-de-escena`).

## Diálogo y voz
- Voz: grabada por el usuario, o generada con una herramienta de voz si hay una y el usuario lo aprueba. Nunca clones la voz de una persona real sin su permiso.
- Lip-sync / avatar que habla: foto o frame del personaje + audio. Clips de ≤ 30 s; corta el audio por frases.

## Fallos típicos y arreglo
| Fallo | Arreglo |
|---|---|
| Se deforma la cara o las manos | Plano más cerrado o más abierto, menos movimiento, keyframe más limpio |
| El personaje cambia | Imagen a video desde el keyframe, ficha idéntica, menos duración |
| Movimiento de cámara ignorado | Un solo movimiento, nombrado al inicio del prompt |
| Todo se mueve en "cámara lenta" | Verbos de velocidad: "quickly", "snaps", "bursts" |
| Física rara | Simplifica la acción o pártela en dos clips |

## Ensamblado
Junta clips, música, voz y subtítulos con `postproduccion`. Registra en la bitácora cada clip: prompt, modelo, duración, semilla y costo. Confirma el costo antes de cada lote: video es lo más caro de generar.

## Límites
Sin personas reales identificables, personajes con dueño, contenido sexual o con menores, ni deepfakes.
