---
name: postproduccion
description: 'Postproducción de video y audio desde Claude Code con ffmpeg - montaje y ritmo, transiciones, animatics, corrección y etalonaje de color, LUTs, estabilización, cámara lenta, reencuadre a 9:16/1:1/4:5, subtítulos quemados o SRT, diseño sonoro, mezcla y normalización de volumen (LUFS), música y voz con IA, y exportes por plataforma (Reels, TikTok, YouTube, web). Úsalo cuando pidan "edita el video", "junta los clips", "ponle música", "subtítulos", "pásalo a vertical", "exporta para Instagram", "corrige el color", "mezcla el audio".'
argument-hint: "[qué editar o exportar]"
---

# Postproducción

Todas las recetas probadas están en [recetas-ffmpeg.md](recetas-ffmpeg.md). Trabaja siempre sobre copias; los originales no se tocan.

## Orden de trabajo
1. **Inventario**: `ffprobe` de cada clip (resolución, fps, duración, códec, audio). Normaliza todo a la misma resolución, fps y formato de píxel antes de montar, o el `concat` falla o tartamudea. Si el proyecto se convirtió de otro editor (Premiere → XML → otro), lee el reporte de conversión: suelen perderse los niveles de audio (la música queda tapando la voz), las transiciones de plugins (Animation Composer, .mogrt) y efectos. Mide el loudness y repón lo perdido.
2. **Montaje** según la lista de tomas: primero el corte de ritmo (sin color ni efectos). Revisa el corte con la hoja de contacto de `revision-visual`.
3. **Ritmo**: corta en acción, ajusta al beat de la música, varía la duración de planos; en redes, que algo cambie cada 1–3 s y que el primer segundo enganche.
4. **Color**: primero corrección (exposición, balance de blancos, igualar tomas entre sí), luego look creativo (LUT o curvas) de acuerdo a la biblia de estilo. El mismo look a toda la pieza.
5. **Sonido** (es la mitad de la experiencia):
   - Capas: diálogo/voz → música → ambiente → efectos (whooshes en cortes, impactos en golpes visuales).
   - Música baja (ducking) cuando hay voz: −12 a −18 dB bajo la voz.
   - Normaliza el loudness: **−14 LUFS** redes y YouTube, **−16 LUFS** podcast/voz, pico real ≤ −1 dBTP.
   - Música/voz con IA: solo con herramientas conectadas y con licencia de uso comercial clara; nunca imites la voz de una persona real ni la obra de un artista concreto.
6. **Subtítulos**: casi todo en redes se ve sin sonido. Frases cortas (≤ 7 palabras, ≤ 2 líneas), centradas en el tercio inferior pero fuera de la zona de la interfaz de la app. Genera SRT y quémalos para redes; deja el SRT aparte para YouTube.
   - Estilo reel que retiene: bloques de 2–4 palabras que entran con rebote y **karaoke** (la palabra que se dice se ilumina y crece ~13 %); palabras clave siempre de un color de la marca.
   - Tamaño: letra ≈ 7 % del alto del cuadro (52 px en 720 p) con contorno; más grande compite con la imagen.
   - Transcribe con tiempos por palabra y **confirma con el usuario** nombres propios y marcas dudosas antes de entregar.
8. **Gráficos y marca**: define una retícula antes de animar (márgenes seguros, esquinas superiores para logos fijos, franja superior para el gancho, tercio inferior para subtítulos). Pregunta qué logos deben verse **todo el video**. Un título gancho en los primeros 3 s, transición visual en cada corte que ya tenga whoosh/glitch, intro ≤ 3 s y cierre con producto + tarjeta con llamado a la acción. En FilmCraft: `edicion-filmcraft`.
9. **Exportes** por plataforma (tabla abajo) y revisión final de cada archivo: duración, audio presente, sin cuadros negros al inicio/final, legible en un teléfono.

## Grabaciones largas (streams, podcasts, gameplays)
Si armas un episodio por script a partir de una lista de piezas (cortes, tramos acelerados, efectos, subtítulos), lee
[edicion-larga.md](edicion-larga.md) antes de renderizar. Lo esencial:
- Con `atempo`/`setpts`, `-ss` y `-t` van **antes** de `-i`; si no, cada tramo acelerado trae `vel ×` audio de más y se encima.
- Transiciones y whooshes: subida ≤ 0.25 s y nunca encima de la voz; sin efectos de sonido en el avance.
- Subtítulos: mídelos contra el audio final con `${CLAUDE_SKILL_DIR}/scripts/verificar_subtitulos.py` y corrige solo lo
  que salga desfasado en varias mediciones.

## Formatos de entrega
| Plataforma | Resolución | Notas |
|---|---|---|
| Reels / TikTok / Shorts | 1080×1920, 30 fps (o los fps de la fuente) | Deja libres ~250 px arriba y ~350 px abajo para la interfaz. Desde horizontal: pantalla completa reencuadrando con cámara que sigue a quien habla (no banda con fondo desenfocado salvo pedido) |
| Feed Instagram/Facebook | 1080×1350 (4:5) o 1080×1080 | 4:5 ocupa más pantalla |
| YouTube | 1920×1080 o 3840×2160, 24/30/60 fps | Miniatura aparte 1280×720 |
| Web (hero en loop) | 1920×1080 o menor, sin audio | MP4 H.264 + WebM VP9, < 5 MB, `muted playsinline loop` |
| Presentación/cliente | 1920×1080 ProRes o H.264 alta calidad | |

Códec por defecto: H.264 `-crf 18–23 -preset slow -pix_fmt yuv420p -movflags +faststart`, audio AAC 192 kbps 48 kHz.

## Antes de entregar
Corre `ffprobe` sobre cada exporte y mira su hoja de contacto. Reporta duración, peso y loudness medido de cada archivo (ver la receta de medición). Si hay subtítulos, verifícalos contra el audio final. No digas "listo" sin eso.
