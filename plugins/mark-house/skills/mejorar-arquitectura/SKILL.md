---
name: mejorar-arquitectura
description: 'Explora un código base buscando dónde la arquitectura frena el trabajo (módulos poco profundos, lógica regada, código imposible de probar, "funciones dios") y propone 2–3 estrategias de refactor con riesgo, esfuerzo e impacto. Usa el vocabulario de módulos profundos y costuras. Úsalo cuando digan "mejora la arquitectura", "esto está hecho un desastre", "refactoriza", "hazlo más mantenible", o cuando un bug no tenía dónde poner su prueba.'
argument-hint: "[área o carpeta a revisar]"
---

# Mejorar la arquitectura

## Vocabulario (úsalo tal cual)
- **Módulo**: cualquier cosa con interfaz e implementación (función, clase, plugin, servicio).
- **Interfaz**: todo lo que un llamador debe saber para usarlo bien: firma, invariantes, orden, errores, configuración, rendimiento.
- **Profundidad**: cuánto comportamiento obtiene el llamador por unidad de interfaz que aprende. **Profundo** = interfaz chica, mucho comportamiento escondido. **Superficial** = la interfaz es casi tan compleja como la implementación.
- **Costura**: el lugar donde vive la interfaz y donde se prueba sin meterse adentro.
- **Adaptador**: lo concreto que cumple una interfaz en una costura (BD real, fake en memoria, pasarela de pago).
- **Localidad**: los cambios, bugs y conocimiento se concentran en un lugar.

Reglas: **prueba de borrado** — imagina borrar el módulo; si la complejidad desaparece era un pasamanos, si reaparece en N llamadores se ganaba su lugar. **Un adaptador = costura hipotética; dos adaptadores = costura real**: no inventes abstracciones que nada varía.

## Proceso
1. **Mapa**: recorre el área (con un subagente Explore si es grande). Lista módulos, quién llama a quién, y dónde están las pruebas.
2. **Puntos calientes**: busca
   - lógica de negocio dentro de templates, shortcodes, callbacks de hooks o handlers HTTP;
   - la misma regla copiada en varios lugares (precios, permisos, validación);
   - clases/archivos de cientos de líneas que hacen de todo;
   - dependencias creadas adentro (`new StripeClient()`, `global $wpdb` en medio de cálculos) que impiden probar;
   - interfaces con muchos parámetros o métodos que solo pasan datos.
   Usa `git log --format= --name-only | sort | uniq -c | sort -rn | head` para ver qué archivos cambian más: ahí duele.
3. **Estrategias**: propone 2–3 caminos distintos (p. ej. "extraer un módulo de dominio puro y dejar WP como adaptador", "consolidar en un servicio con interfaz de 3 métodos", "dejarlo y solo poner una costura de prueba alrededor"). Para cada uno:

| Estrategia | Qué cambia | Esfuerzo | Riesgo | Impacto | Cómo se verifica |
|---|---|---|---|---|---|

4. **Recomienda** una, con el primer paso pequeño y seguro. Si la eligen, conviértela en tickets con `plan-en-rebanadas` (los refactors anchos van como expandir → migrar → contraer).

Nunca refactorices sin pruebas que fijen el comportamiento actual. Si no existen, el primer ticket es escribirlas en la costura más alta.
