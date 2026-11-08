---
name: interrogar-plan
description: 'Interroga al usuario sin piedad sobre un plan, feature, refactor o idea hasta que no quede ninguna decisión sin resolver, en rondas numeradas con tu respuesta recomendada. Úsalo antes de construir algo nuevo o riesgoso, o cuando el usuario diga "interrógame", "hazme preguntas", "grill me", "afinemos la idea", "antes de programar pregúntame".'
argument-hint: "[plan o idea a interrogar]"
---

# Interrogar el plan

Objetivo: llegar a un entendimiento compartido **antes** de escribir código. Cada respuesta ahora evita un incendio después.

## Método: árbol de decisiones por rondas

1. Mapea el plan como un **árbol de decisiones**: cada decisión abre las decisiones que dependen de ella.
2. La **frontera** son las decisiones cuyos prerrequisitos ya están resueltos: las que puedes preguntar ya sin adivinar respuestas que aún no oyes.
3. Pregunta **toda la frontera en una ronda**, numerada, cada pregunta con tu recomendación. Luego espera.
4. Con las respuestas, recalcula la frontera y haz la siguiente ronda. Una pregunta que depende de otra abierta en esta misma ronda va en una ronda posterior.

Formato de cada pregunta:

```
❓ **P1 – <título corto>**: <pregunta, con opciones concretas si aplican>

➡️ Recomiendo: <tu respuesta y por qué en una línea>
```

Redacta cada pregunta para que "sí" signifique aceptar tu recomendación. Así el usuario puede contestar "sí, sí, no: X, sí" y avanzar rápido.

## Qué cubrir (según aplique)

- **Para quién y para qué**: usuario real, problema, cómo se ve el éxito, qué NO se va a hacer.
- **Datos**: entidades, relaciones, qué se guarda dónde y por cuánto tiempo (BD, archivos, almacenamiento local, CMS).
- **Casos borde y fallos**: sin conexión, datos vacíos, permisos, concurrencia, pagos fallidos, timeouts de API.
- **Sistemas existentes**: qué toca (CMS, tema, plugins, servicios, APIs externas, hosting) y qué puede romper.
- **Entrega**: dónde vive, cómo se despliega, cómo se revierte si sale mal.
- **Diseño**: tono visual, referencias, marca, móvil vs. escritorio.

**Si es una pieza creativa** (video, animación, 3D, personaje, campaña, juego), cubre en cambio: objetivo y público, plataforma y formato (16:9, 9:16, 1:1), duración, tono y emoción, referencias visuales y sonoras, personajes, qué existe ya (assets, marca, guion), técnica (IA, 3D, motion, filmado), presupuesto de créditos o tiempo de render, y fecha de entrega.

## Reglas

- **Los hechos los buscas tú; las decisiones son del usuario.** Si una pregunta depende de un dato del código, del servidor o de la documentación, despacha un subagente (Explore) a buscarlo en lugar de preguntarlo. Mientras corre, pregunta el resto de la frontera.
- No preguntes lo que el repo, el `CLAUDE.md`, el glosario o la conversación ya responden.
- Si el usuario dice "tú decide" en algo, decide, anótalo como supuesto y sigue.
- Termina cuando la frontera esté vacía: cada rama visitada, nada asumido en silencio. Entonces muestra un resumen de decisiones (tabla de 2 columnas: decisión | elegido) y pide confirmación explícita. **No actúes hasta que confirme.**
