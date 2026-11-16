# Prompts probados para el kit de pixel art

Probados con Nano Banana 2.1 (editar y texto a imagen), 1K, nov 2026. Los prompts van en inglés porque los modelos responden mejor. ≈4 créditos por imagen en un estudio tipo kie.ai.

## Pose base desde una foto (3:4)
Referencia: la foto de la persona.
```
Convert the man in reference image 1 into a detailed 16-bit pixel art character sprite. Waist-up, facing the camera straight on, centered, arms relaxed down at his sides. Keep his identity: same face shape, [hair], [eyes], [skin tone], calm friendly expression with mouth closed. Outfit: [outfit]. Style: clean retro pixel art like a modern Korean indie game cutscene, crisp 1-pixel dark outlines, flat cel shading with 2-3 tones per color, limited palette, no blur, no gradients, no anti-aliasing, visible square pixels. Background: completely flat solid pure magenta #FF00FF, nothing else, no shadow on the background.
```
Describe pelo, ojos, tono de piel y ropa en palabras aunque estén en la foto: mejora el parecido.

## Poses nuevas (editar la pose base)
Referencia: la imagen de la pose base generada (no la foto). Usa `descripciones` para sacar varios cuadros de una vez.
```
Animation frame of the exact same pixel art character from reference image 1. Keep EVERYTHING identical: same framing, same size and position in the canvas, same face, hair, clothes, same pixel size, same palette, same flat solid magenta #FF00FF background. Only change [the pose]. [expression]. [The other arm] stays exactly as in the reference.
```
| Pose | [the pose] |
|---|---|
| Saludo 1 / 2 | raise his right arm (viewer's left) so the open hand is beside his head at ear height, palm to camera, fingers spread, waving hello · + "hand tilted slightly outward" / "inward" |
| Señalar izq. | extend his right arm (viewer's left) pointing to the viewer's left with the index finger `(sin probar)` |
| Señalar der. | same, left arm to the viewer's right `(sin probar)` |
| Pensar | right hand on his chin, eyes looking up `(sin probar)` |
| Sorpresa | both hands up at chest height, eyebrows raised, mouth open in an "O" `(sin probar)` |

## Escenario vertical (9:16)
```
Detailed 16-bit pixel art background, vertical composition, of [place] seen straight on (front view, eye level). [Main furniture in the lower third]. [Shelves / wall details]. [Window with view]. [Light source with brand color hex]. Empty space in the center of the frame so a character can stand there later. No people, no text, no logos. Style: clean retro pixel art like a modern Korean indie game cutscene, crisp dark outlines, muted desaturated palette with [accent] accent light, slight wear and grime on walls, visible square pixels, no blur, no gradients, no anti-aliasing.
```
Tip: describir la vista de la ventana con el lugar real (pueblo, ciudad) le da identidad sin costo.

## Lo que NO funciona
- Pedir "pixel art" sin "flat solid magenta background": el fondo sale con degradado y el chroma deja halos.
- Generar cada pose desde la foto: la cara y el tamaño cambian entre cuadros. Siempre desde la pose base.
- Nombrar series, juegos o estudios como referencia de estilo: describe el estilo con palabras.
