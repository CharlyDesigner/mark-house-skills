# Recetas de FilmCraft en vivo

Todas probadas en FilmCraft 0.20.1 (1280×720, 24 fps) con `scripts/fc.py` y `scripts/mg.py`.
Tiempos en cuadros. `mg.init()` primero.

## Título gancho (primeros 3–4 s)
Una pregunta corta que el video responde después ("¿ESTO SE COME?"), arriba al centro, inclinada y con rebote.
```python
t = fc.ex('graphics.newText', {'text': '¿ESTO SE COME?', 'position': [640, 120], 'size': 86,
          'font': 'Impact', 'seconds': 3.9, 'track': 3, 'time': mg.F(72)})['clip']
mg.gset(t, 0, {'align': 'center', 'fill_color': '#ffd400', 'stroke': True, 'stroke_width': 10,
               'shadow': True, 'rotation': -4})
s = '¿ESTO SE COME?'.index('COME')
fc.ex('graphics.setCharStyle', {'clip': t, 'layer': 0, 'start': s, 'end': s + 4, 'style': {'color': '#7cff3a'}})
mg.gkeys(t, 0, 'scale', [(72, 40), (76, 118), (79, 100), (132, 100), (138, 108), (144, 100)])
```

## Intro de marca (3 s)
Fondo = un gráfico con varias capas (rectángulo con degradado, rayos girando, anillos que se expanden, destellos);
el logo PNG va en otra pista con keyframes de Motion; al final el logo se agranda y desvanece y entra el video con
`zoom_blur`.
```python
bg = fc.ex('graphics.newRectangle', {'position': [640, 360], 'size': [1280, 720], 'seconds': 3, 'track': 0, 'time': 0})['clip']
mg.gset(bg, 0, {'fill_kind': 1, 'gradient_start': '#ffe36b', 'gradient_end': '#f5a800', 'gradient_angle': 90})
l = fc.ex('graphics.newShape', {'shape': 'path', 'points': mg.star(0, 0, 1150, 70, 18), 'clip': bg})['layer']   # rayos
mg.gset(bg, l, {'fill_color': '#fff1a8', 'opacity': 45, 'position': [640, 330]}); mg.gkeys(bg, l, 'rotation', [(0, 0), (72, 40)])
for col, w, d in (('#2e3060', 30, 2), ('#f08a24', 14, 6)):                                                    # anillos
    l = fc.ex('graphics.newEllipse', {'position': [640, 330], 'size': [520, 520], 'clip': bg})['layer']
    mg.gset(bg, l, {'fill': False, 'stroke': True, 'stroke_color': col, 'stroke_width': w})
    mg.gkeys(bg, l, 'scale', [(d, 0), (d + 8, 100), (d + 30, 260)]); mg.gkeys(bg, l, 'opacity', [(d + 12, 100), (d + 30, 0)])
logo = mg.place(ITEM_LOGO, 'V2', 0, 72)                       # PNG 1434 px de alto → 27 % ≈ 390 px
mg.mset(logo, 'position', [640, 330])
mg.mkeys(logo, 'scale', [(4, 0), (11, 31), (15, 25.5), (18, 27), (56, 27), (68, 70)])
mg.mkeys(logo, 'rotation', [(4, -25), (11, 5), (15, -2), (18, 0)])
mg.mkeys(logo, 'opacity', [(60, 100), (68, 0)], effect='opacity')
fc.ex('sequence.applyVideoTransition', {'clip': PRIMER_CLIP, 'effect': 'zoom_blur', 'frames': 10, 'edge': 'in', 'align': 'center'})
```
Texto "PRESENTA" debajo del logo: Impact 46, azul con contorno blanco, `tracking` 300, entra en el cuadro 22.
Para meter la intro en un proyecto ya armado: mueve TODOS los clips con un solo `timeline.move`
(ordenados del último al primero, `linked: false`) y luego crea la intro en el hueco.

## Logo fijo (todo el video)
```python
c = mg.place(ITEM_LOGO, 'V6', 20, FIN)             # pista propia: nada más vive ahí
mg.mset(c, 'position', [150, 100])                 # esquina superior izquierda dentro del margen
B = 7.6                                            # % para ≈ 155 px de ancho
mg.mkeys(c, 'scale', [(20, 0), (25, B * 1.25), (28, B * 0.92), (30, B)])
# cuando lo mencionan, que "lata":
mg.mkeys(c, 'scale', [(f, B), (f + 5, B * 1.6), (f + 9, B * 1.35), (f + 36, B * 1.35), (f + 44, B)])
```

## Stickers
- **Etiqueta**: `graphics.newText` con `background: True`, `background_color`, `background_radius` 18,
  `background_size` 16, `rotation` −6; `mg.pop` y balanceo de rotación −6/−2 cada 11 cuadros.
- **Estallido "¡POP!"**: forma `path` `mg.star(0, 0, 105, 62, 12)` roja con contorno amarillo + texto en la
  misma gráfica (`'clip': id` en `graphics.newText` → capa 1); `pop` en ambas capas, estrella girando 45° y texto latiendo.
- **Cinta** ("★ PRÓXIMAMENTE ★"): texto con fondo rojo `background_radius` 10, arriba al centro.
- **Lettering de marca** en lugar de un subtítulo cuando dicen el slogan: borra ese subtítulo y coloca el PNG con rebote.

## Subtítulos karaoke
`scripts/karaoke.py palabras.json --pista N --offset S --claves '{"PALABRA": "#hex"}'`.
Bloques ≤ 4 palabras / 24 letras, cortan en puntuación o pausa > 0.5 s; cada bloque entra con escala 55→112→100;
Razor en cada palabra y estilo por trozo: palabra activa amarilla y 13 % más grande, claves siempre de su color.
52 px Impact con contorno 6 en 720 p (70 px resultó demasiado grande).
Corrige texto suelto después con `graphics.setText` + `graphics.setCharStyle` (`clear` y vuelve a pintar).

## Transiciones sincronizadas
Si el montaje trae whoosh/glitch en A2, pon una transición en el corte más cercano a cada uno:
whoosh → `whip` 6–8 cuadros · glitch → `glitch` 8 · golpe/impacto → `zoom_blur` o `cross_zoom` 8 ·
cambio a escena especial → `flash` 8 · a tarjeta final → `push` 10.

## Color base (todas las tomas, Lumetri)
`effects.apply` con `lumetri` y `effects.setParam` (`effect: 'lumetri'`): contrast 14, highlights −12, shadows 6,
vibrance 20, saturation 106, sharpen 12, temperature 4, vignette_amount −0.6. Sutil: unifica tomas de IA sin "filtro".
Para una parte festiva: `light_leaks` con valores por omisión (intensidad 70) en ese clip.

## Cierre
1. **Producto** (4 s): foto con push-in lento (`scale` 136→143 si hay que recortar franjas; ajusta `anchor` al centro
   del contenido) + texto/oferta PNG con rebote + destellos (estrellas de 4 puntas que aparecen y giran).
   Entra con `flash`.
2. **Tarjeta final** (3 s): mismo fondo de la intro (coherencia), logos con rebote escalonado (4, 11, 15 cuadros),
   barra inferior de color con el llamado a la acción ("PREGUNTA POR PRECIOS DE MAYOREO") latiendo. Entra con `push`.
3. **Audio**: extiende la música hasta el final (`timeline.trim` edge out) con `exponential_fade` de 36 cuadros;
   sube la música donde no hay voz (keyframes de `level` +15 dB sobre una ganancia de −20) y pon un whoosh/pop en
   cada entrada. Mide: intro y cierre ≈ 3–5 LU por debajo del cuerpo.

## Logos con fondo liso
`scripts/logo_sin_fondo.py logo.jpg logo.png 5` y revisa sobre fondo oscuro. Un umbral de 14 se comió el anillo
blanco de un logo (blanco 255 sobre fondo 247); con 5 quedó bien.

## Versión vertical 9:16 con cámara
Probado: de 1280×720 a 1080×1920. El cliente rechazó la banda con fondo desenfocado; lo que quería era
**pantalla completa con la cámara siguiendo a quien habla**.
1. **Duplicar**: `project.select` la secuencia → `edit.duplicate` → `sequence.open` la copia →
   `sequence.settings` `{width: 1080, height: 1920, name: ...}`. Todo queda en píxeles absolutos.
2. **¿Quién habla?** Saca 2 cuadros por frase del exporte horizontal (30 % y 75 % de cada bloque de subtítulo)
   en hojas de 4×5 y decide por boca abierta y gestos. Si es ambiguo, el contenido manda ("¡Quieto, X!" lo dice
   quien no es X). Si hablan los dos, encuadra en medio (el producto).
3. **Dónde está cada cara**: hoja de cada toma (inicio, mitad, final) con `drawgrid` cada 128 px de la toma original.
4. **Plan** (`plan.json`): por toma, `foco` = [[cuadro, x], ...]. Llega al que va a hablar **6–8 cuadros antes**
   de que hable (paneo rápido) y quédate ahí; `golpe` en los momentos fuertes; `golpe_entrada` en tomas que entran
   con impacto. `fy` = altura de las caras (330 en 720 p).
5. `python reencuadre.py plan.json --secuencia ID` → escala base = la que llena el cuadro + 3 % (275 % para 720p→1920),
   acercamiento lento de +17 % por toma, posición limitada con 14 px de colchón.
6. `python bordes.py --desde 3 --hasta 58 --detalle <tramos de golpes y paneos>` → debe salir 0.
7. **Gráficos en vertical**: logo de marca arriba al centro (y ≈ 150), segundo logo arriba a la derecha, título
   gancho y ≈ 420–455, subtítulos 72 px en y ≈ 1395 (arriba de los botones de la app), leyenda legal chica abajo
   (y ≈ 1860), texto vertical de la marca en el costado izquierdo (rotación −90). Intro y tarjeta final:
   cambia `size` del rectángulo de fondo a 1080×1920 y recoloca capas; las escalas de logos ×1.3–1.5.
8. Imagen de producto con franjas: `anchor` en el centro del contenido y escala hasta llenar 1920 de alto.
Con fuente 720p la ampliación es ~2.8×: se ve bien en el teléfono, más suave que el horizontal.
