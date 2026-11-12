---
name: posts-desde-fotos
description: 'Convierte fotos reales (evento, expo, stand, equipo, producto, local) en posts y carruseles de redes sociales en formato 4:5 (1080×1350) con la marca del cliente - encuadres distintos por slide, degradado para texto, titulares grandes que llaman la atención, logo del evento, tira de redes, contador y flecha de "desliza", todo con un script editable y revisado slide por slide. Úsalo cuando digan "edítame estas fotos como post", "hazme un carrusel de este evento", "ponle texto llamativo", "para Instagram/Facebook en 4:5", "bien centradas", "post de la expo".'
argument-hint: "[fotos + marca/cliente + tema del post]"
---

# Posts y carruseles 4:5 a partir de fotos

Producto: JPG **1080×1350** (4:5) por slide + un script `.py` editable para repetir o ajustar. Si el cliente tiene una **retícula fija** (posiciones de logo, titular, slogan, tira de redes), esa manda: búscala en el `CLAUDE.md`/memoria del proyecto; si no existe, usa la de abajo y pregunta si quiere fijarla.

## 0. Reúne
Fotos; logo del cliente (PNG con transparencia — si no, ver paso 3); colores y tipografías de marca; slogan; handles de redes; logo del evento si lo hay; enfoque de venta (no inventes precios, fechas, horarios ni direcciones: ofrécelos como dato que falta).

## 1. Mira las fotos antes de recortar
Hoja de contactos de todas (ver `revision-visual`) y lee 2–3 a tamaño completo para ubicar dónde está lo importante. Descarta o recorta las que muestren **marcas ajenas** muy visibles (otros stands, competidores) y revisa letreros vecinos en los bordes.

## 2. Un encuadre distinto por slide
Cuando las fotos son casi iguales, el carrusel aburre. Saca de ellas encuadres diferentes:
| Slide | Encuadre |
|---|---|
| Portada | toma amplia, todo el ancho; el gancho más grande |
| Intermedios | zoom ≤ 1.5× a un sujeto distinto (mascota, equipo, producto, anaquel); ancho de recorte ~63–75 % de la foto |
| Cierre | toma amplia distinta + invitación ("¡Te esperamos!") y sede/fecha si existen |
- Recorte 4:5 = `alto = ancho × 1.25`. En los zoom el sujeto ocupa los 2/3 superiores; el resto es zona de texto.
- Tras reescalar un zoom aplica `ImageFilter.UnsharpMask(radius=1.4, percent=70, threshold=3)`; sube un poco contraste (1.07) y color (1.10).
- Cuida pies, manos y caras en los bordes; no cortes personas por la mitad con el texto encima.

## 3. Capas y retícula por defecto
De arriba abajo: scrim oscuro suave arriba (para el logo) → foto → **degradado de color oscuro de marca desde abajo** (~250 de alfa; también tapa alfombra, dedos sobre el lente y suciedad) → texto.
- Logo del cliente **arriba, centrado**. Logo del evento arriba a la derecha con **borde crema tipo sticker** (un logo rojo sobre fondo rojo se pierde). Contador `1/7` arriba a la izquierda.
- Titular abajo, "un poco arriba del borde"; slogan **mero abajo**, centrado y chico.
- Tira de redes en un lado (el mismo en toda la serie): usa `logos-redes-svg`.
- Flecha amarilla "desliza" a la derecha del titular en todos los slides menos el último.
- Logo con fondo liso: `python3 ${CLAUDE_SKILL_DIR}/scripts/quitar_fondo_logo.py logo.png logo_sin_fondo.png --borde 7` (flood-fill desde las esquinas: no borra el blanco interior; `--borde` pone el contorno sticker).

## 4. Texto que llame la atención
- Titular de **2 líneas cortas** (≤ 14 caracteres por línea funciona mejor): línea 1 blanca, línea 2 en el color de acento, contorno grueso (9 px) del color oscuro de marca, sombra suave e inclinación de −2.5°. Autoajusta el tamaño al ancho máximo (~800 px) para que no choque con la flecha.
- Debajo, **cinta** con el color de acento y un subtítulo en mayúsculas (pregunta por mayoreo, sede, ofertas, etc.), en posición **fija** (y≈1212) para que nunca se encime con el slogan (línea base a H−34).
- Ganchos por slide, en tono de la marca: portada anuncia el evento; intermedios muestran un beneficio o personaje ("¡Conoce al…!", "¡Todo el sabor…!", "¡Surte tu tienda!"); cierre invita.
- Tipografía: la de la marca. Sin ella: Lilita One (titular) + Montserrat 800 (cinta/contador) + Fredoka 600 (slogan). Fredoka en mayúsculas pequeñas queda apretada ("VI" se pega): usa Montserrat en la cinta.
- Fuentes sin internet general: `npm pack @fontsource/<nombre>` trae `.woff2`; conviértelas con fontTools a `.ttf` (`pip install --break-system-packages brotli` primero).

## 5. Trampas técnicas (todas ocurrieron)
- Texto por palabras con espacio propio: dibuja cada palabra con `anchor='ls'` (línea base común); si usas el bbox de cada palabra, la que tiene acento o "ñ" sale desalineada.
- `python3 -I` ignora la carpeta actual: para importar tu script en pruebas usa `sys.path.insert(0, '.')`.
- Evita que el subtítulo dependa de la altura del titular: un titular grande lo empuja sobre el slogan.
- El gradiente no debe cubrir pies ni caras: ajusta `y` de inicio por slide.

## 6. Revisa antes de entregar
Abre **cada** slide a tamaño completo y haz zoom a: tira de redes, logos (halos blancos), bordes del texto, pies/manos cortados, choques entre elementos, letreros de terceros. Corrige y vuelve a renderizar; no entregues sin esa pasada.

## 7. Entrega
JPG calidad 94 (`subsampling=0`), nombres `<cliente>_<evento>_Carrusel_01.jpg…`, el script y, si aplica, la carpeta de logos. Incluye un copy en el tono del cliente (con emojis y hashtags) y señala los datos que faltan (fecha, horario, stand, precios). Si guardar en el proyecto de Claude falla por falta de espacio, no borres nada: entrega los archivos y avisa.

Relacionadas: `logos-redes-svg`, `identidad-visual`, `revision-visual`, `qa-antes-de-publicar`.
