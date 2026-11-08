---
name: disenar-dos-veces
description: 'Genera de 3 a 5 diseños radicalmente distintos en paralelo con subagentes —direcciones visuales de UI o interfaces de un módulo de código— y los compara lado a lado para elegir con criterio. Úsalo antes de comprometerte con un diseño: "dame opciones de diseño", "propón varias direcciones", "diseña la interfaz del módulo", "design an interface", "no me convence el diseño".'
argument-hint: "[qué se diseña: pantalla, landing, módulo, API]"
---

# Diseñar dos veces (o cinco)

El primer diseño casi nunca es el mejor; es solo el primero que se te ocurrió. Esta skill obliga a explorar el espacio antes de elegir.

## 1. Define qué se diseña y con qué restricciones
Escribe en 5–8 líneas: el objetivo, el público, restricciones duras (marca, stack, tema o diseño existente, presupuesto de rendimiento, accesibilidad) y qué cuenta como éxito. Esto es el brief común de todos los subagentes.

## 2. Asigna ángulos opuestos
Elige 3–5 ángulos que **choquen entre sí**, no variaciones tibias.

**Si es UI / visual**, por ejemplo:
- Editorial: tipografía grande, mucho blanco, ritmo de revista.
- Inmersivo: 3D/WebGL o motion protagonista, scroll narrativo.
- Utilitario brutalista: denso, rápido, cero adornos, todo a un clic.
- Cálido artesanal: texturas, ilustración, colores de la marca local.
- Juguetón: mascota/personaje, micro-interacciones, gamificación.

**Si es interfaz de un módulo de código**, por ejemplo:
- Mínima: 1–3 funciones que esconden todo.
- Orientada a eventos/hooks (natural en WordPress).
- Builder/fluida con configuración encadenada.
- Funcional pura: datos entran, resultado sale, sin efectos.
- Orientada a comandos (cola de acciones, ideal para deshacer/reintentar).

## 3. Despacha en paralelo
Lanza un subagente por ángulo **en el mismo mensaje** para que corran a la vez. A cada uno dale: el brief, su ángulo, y qué entregar:
- Visual: una maqueta HTML autocontenida (un archivo) en `docs/diseno/<slug>/opcion-<letra>.html` + 5 líneas de racional (tipografías, paleta con hex, idea de movimiento).
- Código: la firma de la interfaz, un ejemplo de uso por el llamador, qué esconde, dónde va la costura de prueba, y qué cuesta.

## 4. Compara
Haz una tabla: opción · fortaleza · debilidad · costo de construir · riesgo. Para código evalúa también **profundidad** (cuánto comportamiento por unidad de interfaz), **localidad** (los cambios se concentran) y facilidad de prueba. Para visual: impacto, legibilidad, rendimiento, accesibilidad, ajuste a marca.

Da tu recomendación (puede ser un híbrido: "estructura de B con la tipografía de A") y deja que el usuario elija. Abre las maquetas visuales para que las vea si el entorno lo permite.
