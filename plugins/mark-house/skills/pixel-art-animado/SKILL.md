---
name: pixel-art-animado
description: 'Videos y animaciones en pixel art de calidad (estilo cutscene de juego indie coreano / 16-bit) mezclados con motion graphics, a partir de un KIT reutilizable de personaje y escenarios - generar el arte base con IA, convertirlo en pixel art real (cuadrícula nativa, paleta limitada), parpadeo y bocas por código, lip-sync por volumen, cámara alineada a la cuadrícula, globos y lower thirds pixel, glitch RGB y blips chiptune. Úsalo cuando el usuario diga "hazme un video en pixel art", "mi avatar en pixel art", "que mi personaje pixel hable/salude", "intro pixel art", "contenido pixel para redes", "arma el kit del personaje" o quiera reutilizar sus sprites en un video nuevo.'
argument-hint: "[qué dice o hace el personaje, escenario y formato]"
---

# Pixel art animado

**Idea central:** el arte se crea UNA vez (kit) y cada video nuevo solo cambia el guion y la voz. La IA genera las poses; el código hace todo lo que se repite (parpadeo, bocas, cámara, textos, glitch, audio) y garantiza que el pixel sea real.

## 1. Qué hace cada quien
| Parte | Quién | Por qué |
|---|---|---|
| Escenario detallado, personaje desde foto, poses (saludo, señalar, caminar, 3/4) | Modelo de imagen (Nano Banana 2.x, GPT Image) — ver `prompts.md` | Ilustración orgánica: miles de decisiones artísticas por imagen |
| Pasar a pixel real (cuadrícula, paleta compartida, sin chroma) | `scripts/pixelizar.py` | La IA "imita" pixel art; sin esto se ve borroso y con píxeles de tamaños distintos |
| Parpadeo, 3 bocas, luz de borde, colorizar al personaje con el cuarto | `scripts/escena_pixel.py` | A tamaño sprite (≈200 px) el código lo dibuja exacto y gratis |
| Cámara, globos, lower third, glitch, sonido, export | `scripts/escena_pixel.py` | Motion graphics encima del pixel: lo que hace que se vea "de animador" |

## 2. El kit (se hace una vez)
```
kit/
  kit.json                      configuración + guion (ver scripts/ejemplo-kit.json)
  raw/                          salidas originales del modelo de imagen (no se tocan)
  personaje/idle.png            pose base, boca cerrada  ← parpadeo y bocas salen de aquí
  personaje/saludo1.png, saludo2.png
  personaje/senalar_izq.png, senalar_der.png, pensar.png, sorpresa.png   (siguientes poses)
  personaje/caminar_1..6.png, tres_cuartos.png, espalda.png              (sin probar)
  escenarios/oficina.png        360x640 (vertical) o 640x360 (horizontal)
  fuentes/press-start-2p-latin-400-normal.woff
```
Reglas del kit:
1. **Todas las poses se generan editando la pose base** (misma imagen de referencia), con "keep everything identical, only change…", mismo encuadre, mismo fondo magenta plano `#FF00FF`. Así quedan alineadas sin trabajo extra (probado: Nano Banana 2.1 conservó posición y escala exactas).
2. **Todos los cuadros de un personaje se pixelan en UNA llamada** para compartir paleta.
3. Personaje y escenario con **densidad de pixel parecida**: un sprite de ≈210 px de ancho sobre un fondo de 360 px de ancho funciona.
4. Guarda `raw/` siempre: si cambias el tamaño nativo, vuelves a pixelar sin volver a generar.

## 3. Flujo
0. **Fuente pixel** (una vez): `npm pack @fontsource/press-start-2p && tar xzf fontsource-press-start-2p-*.tgz` → copia `package/files/press-start-2p-latin-400-normal.woff` a `kit/fuentes/`. Requisitos: `pip install pillow numpy` y `ffmpeg`.
1. **Arte base** con el modelo de imagen (`prompts.md`). Pose base desde una foto real si es un avatar de una persona (solo de la propia persona o con su permiso). Revisa parecido antes de seguir.
2. **Pixelar:**
   ```bash
   python3 ${CLAUDE_SKILL_DIR}/scripts/pixelizar.py --ancho 212 --colores 40 --chroma ff00ff --salida kit/personaje kit/raw/idle.png kit/raw/saludo1.png kit/raw/saludo2.png
   python3 ${CLAUDE_SKILL_DIR}/scripts/pixelizar.py --ancho 360 --alto 640 --colores 56 --salida kit/escenarios kit/raw/oficina.png
   ```
   Abre los `_x3.png` y revisa: contornos completos, sin manchas rosas, cara legible.
3. **Ubicar ojos y boca** en `kit.json` (`[x0, y0, x1, y1]` en px del sprite nativo). Para encontrarlos: los blancos de los ojos son los píxeles más claros de la cara (`min(R,G,B) > 165`); la boca es la línea oscura bajo la nariz. Luego **verifica**:
   ```bash
   python3 ${CLAUDE_SKILL_DIR}/scripts/escena_pixel.py kit/kit.json revision.png --revisar
   ```
   La hoja muestra idle · parpadeo · boca 1 · boca 2 · saludo. Si un párpado o boca cae fuera de lugar, corrige coordenadas. **No adivines por una vista reducida**: calcula la escala del recorte antes de convertir coordenadas.
4. **Guion** en `kit.json` → `guion` (pasos en orden):
   | tipo | qué hace |
   |---|---|
   | `entrada` | el personaje salta a cuadro desde abajo con rebote |
   | `saludo` | alterna los sprites de `saludo` cada 0.18 s (`dur`, `globo` opcional) |
   | `habla` | con `audio`: la boca sigue el volumen de la voz y el paso dura lo que el audio; sin `audio`: boca aleatoria (vista previa) |
   | `pausa` | idle con respiración y parpadeo |
   | `titulo` | lower third con `texto` y `sub`, se queda hasta el final |
5. **Render:** `python3 ${CLAUDE_SKILL_DIR}/scripts/escena_pixel.py kit/kit.json salida.mp4` (1080x1920, 30 fps, ≈1 s de render por segundo de video).
6. **Revisión visual** (`revision-visual`): saca cuadros con ffmpeg (glitch de entrada, saludo, habla, lower third) y míralos antes de entregar.

## 4. Reglas de pixel art (no negociables)
- Siempre `NEAREST` al escalar. Nunca bilinear/bicubic sobre pixel.
- La cámara se mueve en **píxeles nativos enteros** (redondear el recorte); si no, el pixel "tiembla".
- Paleta limitada (personaje ≈ 40, escenario ≈ 56). Reducir por **moda** del bloque, no por promedio.
- Textos y UI se dibujan a tamaño nativo de la fuente (8 px) y se escalan por entero (x4–x6). Alfa binarizado: nada de bordes semitransparentes.
- Integra al personaje con el cuarto: oscurecer ≈ 0.8, tinte frío leve y **luz de borde** del color de la fuente de luz de la escena.
- Press Start 2P dibuja `Á É Í Ó Ú` como minúscula acentuada: el script dibuja la mayúscula + acento a mano (ya resuelto en `texto()`).
- Respiración: 1 px arriba/abajo cada 0.55 s. Parpadeo: 0.1 s cada 2.4–3.8 s. Más movimiento se ve nervioso.

## 5. Voz y lip-sync
- La voz llega como archivo (`.wav`/`.mp3`); la boca sigue el RMS por cuadro: < 0.15 cerrada, < 0.5 entreabierta, si no abierta (normalizado al percentil 95), con filtro anti-parpadeo de 1 cuadro. Probado con audio sintético.
- Para voces clonadas usa el servicio donde vive el clon y pasa el archivo; los modelos TTS de catálogo no clonan.
- Lip-sync por fonemas con Rhubarb Lip Sync (6 bocas A–F) da mejor resultado en planos cerrados `(sin probar)`.

## 6. Ampliar el kit
- **Señalar / pensar / sorpresa:** igual que el saludo (editar la pose base). Agrega el tipo de paso en el script siguiendo el patrón de `saludo`.
- **Caminar y otras vistas:** el modelo de imagen pierde consistencia en ciclos de 6 cuadros; probar PixelLab (MCP `pixellab-mcp`: `create_character` con 4/8 direcciones y `animate_character` walk/idle) usando la pose base como referencia, y pixelar después con la misma paleta `(sin probar)`.
- **Otros escenarios:** misma receta de fondo; cambia `fondo` y `camara` en `kit.json`.

## 7. Lista de verificación antes de entregar
- [ ] Hoja `--revisar` correcta (párpados y bocas en su lugar).
- [ ] Sin restos de chroma rosa alrededor del personaje.
- [ ] Textos legibles en celular (UI x6 a 1080 de ancho) y acentos correctos.
- [ ] El glitch no tapa la cara mientras habla; los blips no tapan la voz.
- [ ] Cuadros revisados con `revision-visual`; duración = guion + 0.35 s de salida.
