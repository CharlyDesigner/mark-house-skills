---
name: consenso-multiagente
description: 'Para decisiones grandes (stack, arquitectura, modelo de negocio, elegir entre 2–3 apuestas), lanza varios subagentes independientes que resuelven el mismo problema sin verse entre sí, luego los pone a debatir una ronda y sintetiza un veredicto con desacuerdos explícitos. Úsalo cuando digan "no sé cuál elegir", "pros y contras", "decide entre", "debate", "segunda opinión", o ante una decisión cara de revertir.'
argument-hint: "[decisión a tomar]"
---

# Consenso multiagente

Una sola respuesta se ancla en la primera idea plausible. Varias respuestas independientes muestran dónde hay acuerdo real y dónde hay incertidumbre.

## 1. Encuadra
Escribe el brief común: la decisión, las opciones conocidas (si las hay), restricciones duras (presupuesto, hosting, equipo de una persona, plazos), criterios de éxito y hechos del repo relevantes. Si faltan hechos, búscalos antes.

## 2. Ronda independiente (en paralelo)
Lanza **3–5 subagentes en el mismo mensaje**, cada uno con el brief y un **rol distinto** para evitar respuestas clonadas, por ejemplo:
- Pragmático: lo más rápido de entregar y mantener para una persona.
- Escéptico de riesgos: qué sale mal, seguridad, costos ocultos, lock-in.
- Visionario de producto: qué hace que esto destaque frente a la competencia.
- Usuario final: cómo se siente usarlo.
- Contador: costo mensual real (hosting, APIs, tokens, licencias) a 10, 100 y 1000 usuarios.

Cada uno entrega: recomendación, 3 razones, el mayor riesgo, y qué evidencia le haría cambiar de opinión. Ninguno ve las respuestas de los otros.

## 3. Ronda de debate
Pásale a cada subagente (vía SendMessage o uno nuevo con el resumen) las posturas de los demás y pídele: ¿mantienes o cambias tu recomendación?, y el argumento más fuerte en contra de la suya.

## 4. Síntesis
Entrega:
- **Veredicto** en una línea y el nivel de acuerdo (p. ej. 4 de 5).
- Tabla: opción · a favor · en contra · quién la apoyó.
- **Desacuerdos que siguen vivos** y qué dato los resolvería.
- **Experimento barato** para reducir la incertidumbre antes de comprometerse (un prototipo de un día, una cotización, una prueba de carga).

La decisión final es del usuario; tu trabajo es que la tome con el mapa completo.
