---
name: kit-video-producto
description: 'Pipeline y kit reutilizable para videos de producto en 3D para redes (Reels, TikTok, Shorts y YouTube) armados con código - Remotion 4 + React Three Fiber para escenas 3D en tiempo real, tomas estrella en Blender Cycles encimadas cuadro por cuadro, voz TTS una frase por archivo, música sintetizada por código medida en compases, ducking, loudnorm a -15 LUFS, subtítulos tipo reel con palabra activa, retícula de marca y zonas seguras, y un JSON por video que sirve para vertical, cuadrado y horizontal. Úsala cuando digan "video de producto 3D", "comercial con Remotion y Blender", "video UGC del producto", "arma el kit de video", "serie de videos de productos", "versión vertical del comercial", "ponle voz y subtítulos al video" o cuando un proyecto de video de marca empiece desde cero en Claude Code.'
argument-hint: "[qué video, producto y formatos]"
---

# Kit de video de producto (Remotion + R3F + Blender)

Videos de producto hechos con código: **Remotion arma**, **R3F pinta el 3D en tiempo real**, **Blender Cycles hace las tomas estrella** y la IA generativa entra solo en puntos concretos (voz, música, una toma de reacción). Todo el video se describe en **un JSON**: guion, compases, escenas, cámara y cortes por formato. El audio, los subtítulos, el 3D y Blender leen ese mismo archivo.

La especificación completa del kit (estructura, esquema del JSON, componentes, scripts, comandos y trampas) está en [especificacion.md](especificacion.md). **Léela antes de construir.**

## Cuándo usarla y cuándo no
| Caso | Skill |
|---|---|
| Video de producto o marca con 3D, voz y música hecho con código | **esta** |
| Motion graphics 2D sin 3D ni voz, con puertas de aprobación | `motion-graphics-remotion` |
| Editar un reel grabado (cortes, muletillas) | `editor-reels-remotion` |
| Recetas sueltas de ffmpeg | `postproduccion` |
| Modelar o preparar el producto en Blender | `produccion-3d` |
| Generar la toma puntual con IA (reacción, personaje actuando) | `generacion-video-ia` |

## Reparto de herramientas
| Herramienta | Hace | No hace |
|---|---|---|
| **Remotion 4** | Línea de tiempo, retícula, subtítulos, textos, cortes por formato, render | Mezcla de audio (llega ya mezclado) |
| **R3F / Three.js** (`@remotion/three`) | Producto girando, partículas, cámara, contadores 3D; todo lo de las series | Tomas que necesitan trazado de rayos |
| **Blender Cycles** (sin interfaz) | 2–4 tomas estrella por video: macros, caramelo brillante, cuerpos que caen | Series de decenas de productos (sale muy caro) |
| **TTS** (p. ej. Gemini Flash TTS en tu estudio de IA) | Voz, una frase por archivo | — |
| **Música por código** | Pista a BPM fijo, medida en compases | — |
| **IA generativa** | 1–2 tomas puntuales por pieza, fondos, música alternativa | El video completo |

## Flujo
1. **Kit en el proyecto.** Si el proyecto no lo tiene, constrúyelo siguiendo [especificacion.md](especificacion.md) (sección 1 a 5) y verifica con `tsc --noEmit` más un still por formato antes de seguir.
2. **Guion → JSON del video** (`src/videos/<id>.json`). Cada frase lleva `compas` de inicio y `maxCompases`. Primero mide las escenas en compases y después escribe.
3. **Voz, una frase por archivo** (`audio/<id>/crudo/NN.wav`). Así se regenera una sola frase sin tocar las demás.
4. **Limpiar voz** → `public/audio/<id>/voz/NN.wav`: highpass, recorte de pausas largas y `atempo` (máximo ×1.35) solo si la frase no cabe.
5. **Revisar voz** con reconocimiento de voz local para detectar palabras cortadas. Si la herramienta no está abierta, el paso se salta y se avisa.
6. **Tiempos por palabra** → `public/subtitulos/<id>.json`.
7. **Música** a BPM fijo, con la duración en compases del video.
8. **Mezcla**: ducking por sidechain y loudnorm de dos pasadas a −15 LUFS. Si hay cortes por formato, una mezcla por formato.
9. **3D en tiempo real** en Remotion, con stills por formato y revisión visual.
10. **Tomas estrella**: exporta la cámara de Remotion, renderiza en Cycles por formato y encima los PNG con alfa.
11. **Render** de cada formato y **revisión**: hoja de contactos, cuadros sueltos y `ebur128`.
12. **Entrega** en `salida/` con duración, peso y LUFS de cada archivo.

## Reglas que ya funcionaron (no las cambies sin motivo)
- **Tiempo en compases.** A 100 BPM, 1 compás = 2.4 s. Todas las escenas y cortes se miden en compases, así la música nunca truena en un corte.
- **Duraciones para redes**: 6 compases = 14.4 s, 12 = 28.8 s, 25 = 60 s.
- **fps**: 60 para piezas estrella; 30 para series (la mitad de cuadros de Cycles y la mitad de disco).
- **Formatos**: uno principal en el formato donde más se publica (normalmente vertical 1080×1920). Los demás se **reacomodan**, no se recortan.
- **Lente por formato**: `fov' = 2·atan(tan(fov/2)·k)`, con k = 1.9 vertical, 1.35 cuadrado (sin probar) y 1 horizontal. El mismo factor en Remotion y en Blender.
- **Zonas seguras verticales**: 270 px libres arriba, nada importante debajo de y≈1536 y unos 140 px libres a la derecha (botones de la app). La tira de redes va **a la izquierda**.
- **Color igual en los dos motores**: Blender con "Khronos PBR Neutral" y Three con `THREE.NeutralToneMapping`. Con eso los rojos y amarillos de marca no se lavan.
- **Material caramelo**: rugosidad 0.1, capa de barniz (coat) al máximo y un poco de dispersión interna. Opaco, sin transmisión.
- **Voz**: usa una voz de catálogo. La voz **clonada se comía la primera palabra** y la voz **diseñada sonaba poco humana**. Si la voz se acelera, que sea con `atempo`, nunca cambiando el tono.
- **Audio**: −15 LUFS integrado, picos ≤ −1 dBTP, música con ducking bajo la voz y cortes de música con fundidos de 15 ms.
- **Subtítulos**: 2–3 palabras por línea, la palabra activa en color de acento, contorno grueso y siempre arriba de la zona de botones.
- **Producto real**: el modelo o la textura sale de fotos reales del producto, nunca de una versión genérica.
- **UGC honesto**: el "creador" del video es un personaje de la marca o una persona real con permiso. No inventes clientes que dan testimonios.
- **Música en cuentas de negocio**: no uses audios en tendencia con derechos. Usa la música propia del kit o la biblioteca comercial de cada app.

## Antes de entregar (marca cada punto)
- [ ] Stills de cada formato revisados con `revision-visual`: nada importante en zonas rojas y continuidad de locación entre tomas.
- [ ] Hoja de contactos del MP4 final (no del Studio).
- [ ] `ebur128`: integrado de −15 ± 1 LUFS y pico ≤ −1 dBTP en cada formato.
- [ ] Subtítulos sin palabras cortadas, con nombres propios y de producto bien escritos.
- [ ] Las tomas de Cycles encajan sin brincos con el 3D en tiempo real (revisa el cuadro de entrada y el de salida de cada toma).
- [ ] `qa-antes-de-publicar` si va directo a redes.
