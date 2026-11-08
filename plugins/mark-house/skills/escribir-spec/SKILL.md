---
name: escribir-spec
description: 'Convierte la conversación y lo que sabes del código en una especificación (PRD) completa en docs/specs/, con historias de usuario, decisiones de implementación, costuras de prueba y fuera de alcance; opcionalmente la publica como issue de GitHub. Úsalo después de interrogar el plan, o cuando pidan "escribe el PRD", "haz la spec", "documenta los requisitos".'
argument-hint: "[nombre de la feature]"
---

# Escribir la spec

No entrevistes de nuevo: sintetiza lo ya hablado. Si falta una decisión importante, pregunta solo esa.

## Proceso

1. Explora el repo si no lo has hecho. Usa el vocabulario de `GLOSARIO.md` si existe.
2. Propón las **costuras de prueba**: los puntos públicos donde se verificará el comportamiento (un endpoint REST, una función pública de la clase principal del plugin, un comando IPC de Electron, una escena de Godot). Prefiere las existentes y lo más alto posible; idealmente una. Confírmalas con el usuario.
3. Escribe `docs/specs/<slug>.md` con la plantilla.
4. Si el repo tiene `gh` autenticado y el usuario lo quiere, publícala como issue con etiqueta `listo-para-agente`.

## Plantilla

```markdown
# <Nombre de la feature>

## Problema
El problema desde la perspectiva del usuario.

## Solución
La solución desde la perspectiva del usuario.

## Historias de usuario
Lista LARGA y numerada que cubra todo, formato:
1. Como <actor>, quiero <capacidad>, para <beneficio>.

## Decisiones de implementación
- Módulos a crear/modificar y su interfaz
- Esquema de datos y migraciones
- Contratos de API / hooks / eventos
- Decisiones de arquitectura y por qué
(Sin rutas de archivo ni código: caducan rápido. Excepción: un esquema, tipo o máquina de estados que diga la decisión mejor que la prosa.)

## Diseño y experiencia
Dirección visual, estados (vacío, carga, error, éxito), responsive, accesibilidad.

## Decisiones de prueba
- Qué hace una buena prueba aquí (comportamiento externo, no detalles internos)
- Costuras elegidas y qué atrapa cada una
- Pruebas existentes a imitar

## Seguridad y rendimiento
Permisos, validación/escape, datos sensibles, presupuesto de rendimiento.

## Fuera de alcance
Lo que explícitamente NO se hace.

## Notas
```

Al terminar, muestra el índice de la spec y pregunta si se aprueba. Una spec aprobada es la autoridad: el plan y el código discuten a partir de ella.
