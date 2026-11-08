---
name: lenguaje-del-dominio
description: 'Extrae y fija el vocabulario del negocio (lenguaje ubicuo estilo DDD) en GLOSARIO.md, resolviendo términos ambiguos como "pedido", "cliente", "evento" o "producto" antes de escribir código, para que código, docs y conversación usen las mismas palabras. Úsalo al iniciar un proyecto con dominio propio (restaurante, tienda, cursos, juego), o cuando digan "glosario", "ubiquitous language", "definamos términos".'
---

# Lenguaje del dominio

## Proceso
1. Recorre la conversación, la spec y el código. Junta los sustantivos y verbos del negocio (no los técnicos).
2. Detecta problemas:
   - **Sinónimos**: dos palabras para lo mismo ("orden" y "pedido", "socio" y "cliente").
   - **Homónimos**: una palabra con dos significados ("producto" como artículo del catálogo vs. línea dentro de un pedido).
   - **Términos vagos**: "usuario" cuando en realidad hay cliente, repartidor y administrador.
3. Por cada problema, pregunta al usuario cuál es el término oficial (en una sola ronda numerada, con tu recomendación).
4. Escribe o actualiza `GLOSARIO.md` en la raíz:

```markdown
# Glosario

| Término | Definición (1–2 líneas, en lenguaje del negocio) | En el código | Evitar |
|---|---|---|---|
| Pedido | Compra confirmada por un cliente, con uno o más renglones | `Order` / `wc_order` | orden, venta |
| Renglón | Un producto con cantidad y precio dentro de un pedido | `OrderItem` | línea, item |

## Relaciones
- Un Cliente tiene muchos Pedidos; un Pedido tiene uno o más Renglones.

## Reglas del negocio
- Un Pedido no se puede editar después de "En camino".
```

La columna "En código" amarra el término al nombre real (clase, tabla, post type, hook). Para nombres de código, usa el inglés si el proyecto ya está en inglés, pero la definición va en el idioma del negocio.

5. A partir de aquí, usa estos términos exactos en specs, tickets, nombres de pruebas, funciones y mensajes de commit. Las demás skills leen `GLOSARIO.md` si existe.
