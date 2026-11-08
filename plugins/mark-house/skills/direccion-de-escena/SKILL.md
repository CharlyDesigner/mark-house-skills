---
name: direccion-de-escena
description: 'Dirección cinematográfica de cada toma o escena - encuadre, composición, lente, altura y ángulo de cámara, movimiento, iluminación (esquemas y motivación), blocking de personajes, continuidad y ritmo. Traduce la intención emocional a decisiones concretas para IA, 3D (Blender, Three.js), animación o rodaje. Úsalo cuando pidan "dirige la escena", "cómo encuadro", "qué plano uso", "iluminación", "movimiento de cámara", "que se vea cinematográfico", "composición".'
argument-hint: "[escena o toma a dirigir]"
---

# Dirección de escena

Para cada toma decide, en este orden, y anótalo en la lista de tomas:

1. **Intención**: qué debe sentir el público aquí (una palabra: tensión, ternura, poder, soledad, euforia).
2. **Encuadre y ángulo** que sirven a esa intención.
3. **Lente** y profundidad de campo.
4. **Movimiento** (o quietud) motivado.
5. **Luz** motivada por una fuente del mundo.
6. **Blocking**: dónde está y hacia dónde se mueve cada personaje respecto a cámara.
7. **Corte**: cómo entra y sale (match cut, corte en acción, J/L cut de audio).

El vocabulario completo (planos, lentes, movimientos, esquemas de luz, composición, reglas de continuidad) está en [lenguaje-cinematografico.md](lenguaje-cinematografico.md). Consúltalo al dirigir.

## Reglas que más se rompen
- **Eje de 180°**: en diálogos y persecuciones, la cámara no cruza la línea entre personajes sin un plano que lo justifique.
- **Variedad de tamaño**: no cortes entre dos planos de tamaño y ángulo casi iguales (salto). Cambia al menos un tamaño de plano o 30° de ángulo.
- **Luz consistente**: la dirección de la luz clave no cambia entre tomas de la misma escena.
- **Mirada y espacio**: deja aire en la dirección de la mirada o del movimiento.
- **Una idea por plano**: si el ojo no sabe a dónde mirar, sobra algo. Usa contraste, enfoque, color de acento y líneas guía para dirigirlo.

## Traducir a cada herramienta
- **Prompt de IA**: `<plano> of <sujeto + ficha>, <acción>, <ángulo>, <lente> lens, <movimiento de cámara>, <luz>, <bloque de estilo>`. Un solo movimiento de cámara por clip.
- **Blender / Three.js**: distancia focal en mm, sensor 36 mm, altura de cámara en metros, f-stop para DOF, keyframes o rutas para el movimiento, luces con temperatura en Kelvin y tamaño (suave = grande). Ver `produccion-3d` y `escenas-3d-web`.
- **Motion graphics**: el "lente" es la escala y la perspectiva; el "movimiento" son las curvas de easing.
