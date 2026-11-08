---
name: generacion-imagen-ia
description: 'Genera imágenes con IA de nivel profesional desde Claude Code con el MCP o API que esté disponible - elegir modelo según la tarea, anatomía del prompt, consistencia de personajes y estilo, edición (inpainting, outpainting, quitar fondo, cambiar ropa o luz), texto dentro de la imagen, upscale, lotes con control de costo y ciclo generar → mirar → corregir. Úsalo para concept art, keyframes, storyboards, posters, miniaturas, fotos de producto, texturas, sprites o referencias para 3D.'
argument-hint: "[qué imagen generar]"
---

# Generación de imagen con IA

## 0. Qué hay disponible
Revisa qué herramientas de generación existen en esta sesión (MCPs conectados, llaves de API en `.env`). Si hay un tool de "recomendar modelo" o "describir modelo", úsalo en lugar de suponer ids. Si no hay ninguna, entrega los prompts listos para pegar y sigue.

## 1. Elige el modelo por la tarea, no por costumbre
| Necesidad | Busca un modelo que destaque en |
|---|---|
| Fotorrealismo, producto, comida | fotografía, materiales, piel |
| Texto legible (posters, miniaturas, empaques) | renderizado de texto |
| Ilustración, anime, concept art | estilización y control de estilo |
| Mismo personaje en muchas imágenes | referencia de personaje / imagen de referencia |
| Cambiar algo de una imagen existente | edición por instrucción o inpainting |
| Fondos transparentes, stickers | quitar fondo como paso aparte |
| Texturas sin costuras | modo tileable o post con offset |

## 2. Anatomía del prompt (en inglés, en este orden)
```
[tipo de imagen / medio] of [sujeto + ficha de personaje], [acción / pose], [entorno],
[encuadre + ángulo + lente], [luz], [bloque de estilo de la biblia], [detalles de calidad]
```
- Concreto gana a adjetivos: "copper kettle with dented lid, steam curling" > "beautiful kettle".
- Pon lo más importante al principio.
- Texto en la imagen: entre comillas, corto, y di dónde va: `the words "GOMI RAMEN" in bold red letters on the banner`.
- Si el modelo acepta prompt negativo, úsalo para los fallos recurrentes (extra fingers, watermark, text artifacts), no como lista de 50 palabras.
- Proporción según destino: 16:9 video/web · 9:16 reels/stories · 1:1 o 4:5 feed · 3:2 foto · 2:3 poster.

## 3. Ciclo de trabajo
1. **Exploración barata**: 2–4 variantes en baja resolución o modelo rápido.
2. **Mira cada resultado** (lee la imagen) y evalúalo con `revision-visual`: anatomía, manos, texto, consistencia con la biblia y la ficha.
3. **Corrige el prompt, no la suerte**: cambia una cosa a la vez y anota qué cambió.
4. **Refina** la elegida: edición localizada (inpainting) para errores puntuales en vez de regenerar todo.
5. **Final**: resolución alta o upscale; guarda con nombre descriptivo (`06_tomas/1A_keyframe_v3.png`) y registra en la bitácora prompt, modelo, semilla y costo.

## 4. Consistencia
- Personajes: ver `diseno-de-personajes` (referencia > imagen a imagen > ficha fija + semilla).
- Estilo: bloque de estilo idéntico al final de cada prompt; misma familia de modelo para toda la pieza.
- Escenarios: genera primero un plano general "maestro" del lugar y úsalo de referencia para los demás ángulos.

## 5. Costo
Antes de un lote, di cuántas imágenes, con qué modelo y el costo estimado, y espera confirmación. Nunca regeneres en bucle "a ver si sale": si 3 intentos fallan igual, el problema es el prompt o el modelo; cámbialo.

## Límites
No generes personas reales identificables, personajes o logos con dueño, ni contenido sexual o con menores. Si el pedido lo necesita, propón una versión original.
