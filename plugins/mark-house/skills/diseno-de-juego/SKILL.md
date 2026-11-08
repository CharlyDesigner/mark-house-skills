---
name: diseno-de-juego
description: 'Diseño de videojuegos de la idea al prototipo jugable - pilares, bucle principal (core loop), mecánicas, progresión y economía, diseño de niveles, game feel o "jugo" (feedback, cámara, partículas, sonido), balance, documento de diseño (GDD) de una página, alcance realista para un estudio pequeño, y plan de vertical slice. Para cualquier motor (Godot, Unity, Unreal, web con Phaser/Three.js). Úsalo cuando pidan "diseña un juego", "GDD", "mecánicas", "nivel", "que se sienta bien", "balance", "game feel", "prototipo de juego".'
argument-hint: "[idea del juego]"
---

# Diseño de juego

## 1. Pilares y fantasía
- **Fantasía del jugador** en una frase: qué se siente ser/hacer ("eres un mensajero que cruza el inframundo con lo que trae en el bolsillo").
- **3 pilares**: las experiencias que toda decisión debe servir (ej. "decisiones tensas", "descubrir el mundo", "jugar con amigos"). Si una feature no sirve a un pilar, se corta.
- **Referencias** de juegos por *mecánica* o *sensación*, no para copiar.

## 2. Bucle principal (lo que se repite cada 30 s, 5 min y 1 h)
Escribe los tres bucles: **segundo a segundo** (moverse, apuntar, elegir carta), **sesión** (nivel, combate, ronda), **meta** (progresión, colección, historia). El juego es tan bueno como su bucle de 30 s: **prototípalo primero con cubos**, sin arte.

## 3. Mecánicas
Por cada mecánica: verbo del jugador, regla, feedback, cómo interactúa con las demás. Prefiere **pocas mecánicas que se combinan** a muchas aisladas. Documenta números en una tabla (daño, velocidad, enfriamientos, costos) para balancear en hojas de cálculo, no en el código.

## 4. Progresión y dificultad
- Curva de dificultad en dientes de sierra: sube, alivia, sube más.
- Enseña sin texto: introduce una mecánica en un espacio seguro → prueba con poco riesgo → combínala → examínala.
- Economía: fuentes y sumideros de cada recurso; que nada se acumule sin uso.

## 5. Niveles
Bocetea el nivel como diagrama (zonas, ritmo de tensión/descanso, caminos críticos y opcionales, puntos de guardado, líneas de visión hacia el objetivo). Guía con luz, color y arquitectura (ver `direccion-de-escena`), no con flechas.

## 6. Game feel ("jugo")
Lista de verificación: respuesta al input < 100 ms · anticipación y recuperación en ataques · *hit stop* de 2–6 frames en impactos · sacudida de cámara proporcional · partículas y destellos · sonido para CADA acción · coyote time y buffer de salto en plataformas · easing en UI y menús · números/feedback claros de daño o puntos. Prueba con y sin jugo: la diferencia debe ser obvia.

## 7. GDD de una página (`docs/juego/GDD.md`)
Título · fantasía · pilares · plataforma y controles · bucles · mecánicas (tabla) · progresión · estilo visual (enlace a la biblia) · audio · alcance del vertical slice · lo que NO tiene el juego · riesgos.

## 8. Alcance realista
Para un equipo de 1–3 personas: un vertical slice (un nivel pulido de 5–15 minutos con todo el bucle, arte y sonido finales) antes de producir más contenido. Corta funciones hasta que el slice quepa en el tiempo disponible. Multijugador en línea y mundos abiertos multiplican el costo: decide al inicio, no a la mitad.

## 9. Pasar a construir
Convierte el GDD en tickets con `plan-en-rebanadas` (la primera bala trazadora: mover al personaje + una interacción + feedback), construye la lógica de reglas con pruebas (`construir-con-tdd`, ver GUT para Godot), el arte con `diseno-de-personajes` / `produccion-3d`, y prueba con jugadores reales temprano: observa en silencio, no expliques.
