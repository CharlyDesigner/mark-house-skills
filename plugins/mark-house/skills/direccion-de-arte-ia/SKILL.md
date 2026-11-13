---
name: direccion-de-arte-ia
description: 'Dirección de arte para prompts de imagen con IA: convierte "una foto de mi producto" en una imagen que parece de campaña. Decide sensación, punto de mirada y exclusiones antes de escribir; arma el prompt en 11 bloques (concepto, sujeto, composición, luz, fondo, materiales, lente, paleta, estilo, calidad, qué evitar), ancla el producto real, elige luz y lente con criterio y revisa los 8 delatores de "se ve a IA". Úsala cuando digan "me salió genérico", "se ve a IA", "no se ve profesional", "mejora este prompt", "quiero que se vea caro", "dirección de arte", "cómo le pido que se vea como esta referencia" o antes de gastar créditos en cualquier imagen de producto, anuncio, carrusel o retrato.'
argument-hint: "[imagen a dirigir o prompt a mejorar]"
---

# Dirección de arte para imágenes con IA

Dos prompts, el mismo modelo, el mismo precio: uno devuelve foto de banco y el otro parece campaña. La diferencia es cuántas decisiones tomaste tú. Un prompt corto no es libre: es uno donde el modelo elige por ti, y elige el promedio de internet (luz plana, centrado, todo enfocado).

Esta skill es la **capa de oficio del prompt**. Para elegir modelo, consistencia de personajes, edición y lotes usa `generacion-imagen-ia`; para luz y lente de cine/3D usa `direccion-de-escena`; para la marca, `identidad-visual`.

## Antes de escribir
1. **Marca.** Paleta, palabras de estilo y categoría salen de la marca (si hay `marca.json` o manual, úsalo; si no, 5 preguntas: qué vende, a quién, tono, 2-3 colores, qué NO es). Sin marca, las fotos salen bonitas y ajenas.
2. **Para qué es** la imagen (ficha, anuncio, carrusel, portada): cambia el encuadre y el aire que hay que dejar libre.
3. **Si hay producto real**, su foto. Sin ella no hay fidelidad posible.

## Proceso
1. **Decide antes de teclear** (en tu cabeza): qué *sensación* da, dónde mira *primero* el ojo, qué *NO* puede aparecer.
2. **Escribe por bloques**, en este orden (lo que va arriba pesa más): concepto · sujeto · composición · luz · fondo · materiales · lente · paleta · referencia de estilo · marcadores de calidad · qué evitar. Detalle y ejemplos en [bloques.md](bloques.md). No hacen falta los once siempre, pero sin **luz** y **composición** no es un prompt, es una descripción.
3. **Ancla el producto real.** Si el producto existe, el prompt lleva la frase de fidelidad (en `bloques.md`) y la herramienta es *editar con referencia*, nunca *generar desde texto*: generar un producto que existe es pedirle que se lo invente.
4. **Luz y lente** son donde se gana: tres decisiones de luz (de dónde, qué tan dura, de qué color), 5 esquemas con nombre y una tabla de lentes en [luz-y-lente.md](luz-y-lente.md).
5. **Qué evitar** no es extra: corta lo que el modelo hace por inercia. Lista base y los 8 delatores de "se ve a IA" en [antipatrones.md](antipatrones.md). Para imágenes que llevarán texto encima: *sin texto, sin letras, sin logotipos, sin marcas de agua* y deja un tercio del cuadro libre; el texto se pone después en una herramienta de diseño.
6. **Revisión de 20 segundos** antes de generar (lista al final de `antipatrones.md`).
7. **Genera** con la herramienta/MCP disponible. Si no hay ninguna, entrega el prompt por bloques listo para pegar, con una frase por bloque que diga por qué está ahí.
8. **Si hay que repetir**, di *qué* falló y *qué renglón* cambias. Repetir lo mismo es la forma más cara de usar la herramienta. Tras 2 intentos fallidos de la misma pieza, para, explica y propón otro enfoque.

## Entregables
Solo prompt: el prompt completo, bloques en líneas separadas, nota de una frase por bloque. Si además generas: carpeta `trabajo/<fecha>-direccion-de-arte-<slug>/` con las imágenes y `prompts.md` (prompt exacto de cada una y qué cambiarías en la siguiente).

## Reglas
- Luz y composición son obligatorias.
- El producto real manda sobre lo bonito: si el modelo "lo mejoró", esa imagen no sirve (compara color, etiqueta, forma y logo contra la foto original).
- No imitar a un artista vivo por su nombre: describe la técnica (luz, grano, paleta, encuadre).
- Nada de "8k, ultra HD, obra maestra, trending": diluye lo que sí decidiste. Di *dónde* debe estar el detalle.
- Un prompt que no puedes explicar renglón por renglón no está terminado.

## Créditos
Método basado en la skill `direccion-de-arte` de **Creative Architect** (Enrique Rocha / Hainrixz, licencia MIT, <https://github.com/Hainrixz/creative-architect>). Texto reescrito y condensado para este repo; para el original completo instala el plugin de upstream.
