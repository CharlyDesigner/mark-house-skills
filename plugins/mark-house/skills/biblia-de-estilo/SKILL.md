---
name: biblia-de-estilo
description: 'Define el mundo visual de un proyecto en una biblia de estilo reutilizable —paleta con hex, iluminación, lentes y cámara, materiales y texturas, tipografía, época, referencias, bloque de estilo para prompts de IA y lista de lo prohibido— para que cada imagen, render, animación o generación de IA se vea del mismo universo. Úsalo al empezar cualquier pieza visual, o cuando digan "moodboard", "dirección de arte", "look and feel", "estilo visual", "que todo se vea igual", "style guide".'
argument-hint: "[proyecto o idea visual]"
---

# Biblia de estilo

La consistencia no sale de la suerte de un modelo: sale de decidir el estilo una vez y repetirlo igual en cada toma.

## 1. Explora antes de fijar
Propón **3 direcciones de arte distintas** (si el brief lo permite), cada una con: nombre, una frase de concepto, 5 referencias de estilo descritas (movimientos artísticos, épocas, técnicas, directores o estudios como *referencia de estilo*, no para copiar obras), paleta y una imagen de prueba si hay herramienta de generación. Que el usuario elija o mezcle.

## 2. Escribe `01_estilo/BIBLIA.md`

```markdown
# Biblia de estilo — <proyecto>

## Concepto
Una frase que diga la sensación (p. ej. "neón húmedo y melancólico, como un recuerdo de madrugada").

## Paleta
| Rol | Hex | Uso |
| Dominante | #... | fondos, 60% |
| Secundario | #... | 30% |
| Acento | #... | 10%, solo puntos de interés |
| Sombras | #... | nunca negro puro |
| Luces | #... | nunca blanco puro |

## Luz
Clave (alta/baja), dirección, temperatura (K), contraste, fuentes motivadas (ventana, neón, fuego), hora del día.

## Cámara y lente
Lentes preferidos (24 mm intimidad amplia, 35/50 mm natural, 85 mm retrato, anamórfico), profundidad de campo, altura de cámara habitual, grano, aspect ratio.

## Forma y materiales
Siluetas (redondas/amables, angulosas/tensas), nivel de detalle, materiales (mate, plástico brillante, tela, metal gastado), texturas.

## Render / técnica
Fotorreal, 3D estilizado (tipo animación de estudio), cel-shading/anime, stop motion, acuarela, pixel art, low-poly...

## Tipografía y gráficos (si aplica)

## Bloque de estilo para prompts
Un párrafo fijo, en inglés (los modelos responden mejor), que se pega al final de cada prompt de imagen/video:
"<técnica>, <luz>, <paleta en palabras>, <lente/cámara>, <textura/grano>, <atmósfera>"

## Prohibido
Lo que rompe el mundo: colores, estilos, objetos, anacronismos, clichés.

## Referencias
Lista de imágenes en `01_estilo/refs/` con una línea de qué tomar de cada una.
```

## 3. Prueba el estilo
Genera o renderiza 3–4 imágenes de prueba con temas distintos (un personaje, un exterior, un interior, un objeto) usando solo el bloque de estilo. Revísalas con `revision-visual`. Si no se sienten del mismo mundo, ajusta la biblia (no los prompts individuales) y repite.

## 4. Para 3D y código
Traduce la paleta y la luz a valores concretos en el mismo archivo: temperaturas de color de las luces, fuerza HDRI, exposición, valores de `roughness`, curvas de easing para animación, tokens CSS si hay web.
