---
name: revision-visual
description: 'Revisa con ojo de director cualquier resultado visual - imagen generada con IA, render 3D, frame o clip de video, animación, página web o diseño - contra el brief, la biblia de estilo y la ficha de personaje, detectando fallos de composición, anatomía, manos, texto, continuidad, artefactos de IA, luz, color y legibilidad. Incluye script de hoja de contacto para ver videos y lotes completos en una sola imagen. Úsalo después de cada generación o render, o cuando digan "revísalo", "¿cómo quedó?", "critica esto", "qué le falta".'
argument-hint: "[archivo, carpeta o URL a revisar]"
---

# Revisión visual

Claude puede leer imágenes. Úsalo: **nunca digas que algo "quedó bien" sin haberlo mirado.**

## Cómo mirar
- **Una imagen**: léela directamente.
- **Un video o animación**: `bash ${CLAUDE_SKILL_DIR}/scripts/hoja_contacto.sh clip.mp4 hoja.png 12 4` y lee `hoja.png` (12 cuadros repartidos en toda la duración). Para un momento exacto: `ffmpeg -ss 00:00:03.5 -i clip.mp4 -frames:v 1 frame.png`.
- **Un lote o carpeta de imágenes/renders**: `bash ${CLAUDE_SKILL_DIR}/scripts/hoja_contacto.sh carpeta/ hoja.png 24 6`.
- **Una página o escena web**: captura con Playwright en 375 px y 1440 px (ver `escenas-3d-web`).
- Si algo se ve pequeño en la hoja, recorta y amplía esa zona antes de juzgar.

## Checklist (marca cada punto: ✅ / ⚠️ / ❌ con una frase)
**Intención**
- ¿Comunica la emoción y la idea de la toma en 1 segundo? ¿El ojo va primero a lo importante?

**Composición**
- Punto focal claro, aire en la dirección de mirada/movimiento, horizonte recto (salvo intención), nada importante cortado en bordes, tangentes incómodas.

**Consistencia**
- Personaje: rasgos ancla, colores, proporciones, vestuario idénticos a la ficha.
- Estilo: paleta, técnica, grano y luz de la biblia. Dirección de luz igual que en las tomas vecinas.

**Artefactos típicos de IA**
- Manos y dedos (número, articulaciones), dientes, ojos (pupilas, mirada desviada), orejas, accesorios que se funden con la piel o la ropa, texto deformado, simetrías imposibles, fondos que se derriten, objetos flotando, sombras que no corresponden a la luz, reflejos incorrectos.
- En video: parpadeo de detalles entre cuadros, caras que cambian, extremidades que aparecen y desaparecen, deslizamiento de pies.

**3D / render**
- Ruido de muestras, luciérnagas (fireflies), normales invertidas (zonas negras), texturas estiradas, z-fighting, objetos atravesándose, escala absurda, exposición quemada o empastada.

**Animación**
- Espaciado y timing, arcos, peso, anticipación, que no "flote"; poses legibles en silueta.

**Diseño / web**
- Jerarquía tipográfica, contraste (AA), alineación a una retícula, espaciado consistente, legibilidad en móvil.

## Veredicto
Termina con: **Aprobado** · **Aprobado con retoque** (qué retocar y cómo: inpainting, re-render de una zona, ajuste de color) · **Rehacer** (qué cambiar en el prompt, la escena o la animación — una causa concreta, no "intentar de nuevo").

Registra en la bitácora qué falló y qué lo arregló: es conocimiento que ahorra créditos en la siguiente toma.
