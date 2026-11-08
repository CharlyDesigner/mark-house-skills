---
name: plan-en-rebanadas
description: 'Parte una spec, plan o conversación en tickets de "bala trazadora" (rebanadas verticales completas de datos a UI), cada uno con sus bloqueos, guardados en docs/plan/<slug>/ o como issues de GitHub. Úsalo cuando haya una spec aprobada y toque planear la implementación, o pidan "hazme el plan", "divídelo en tareas", "PRD a issues".'
argument-hint: "[ruta de la spec o nombre de la feature]"
---

# Plan en rebanadas verticales

## 1. Contexto
Lee la spec (`docs/specs/...` o el issue que pasen). Explora el código. Busca **pre-refactors**: "primero haz fácil el cambio, luego haz el cambio fácil". Esos van primero.

## 2. Reglas de rebanado
- Cada ticket corta un camino **angosto pero completo** por todas las capas (BD → lógica → API/hook → UI → prueba). Vertical, no "toda la BD primero".
- Cada ticket terminado se puede **demostrar o verificar solo**.
- Cada ticket cabe en una ventana de contexto fresca (un subagente lo puede hacer de inicio a fin).
- El primer ticket es la **bala trazadora**: el camino más delgado que conecta todo de punta a punta, aunque sea feo. Prueba la integración temprano.
- Excepción — **refactor ancho** (renombrar columna, cambiar un tipo compartido): secuencia expandir → migrar por lotes → contraer.

## 3. Bloqueos
Cada ticket declara qué tickets deben cerrarse antes. Sin bloqueos = puede empezar ya. Mantén las dependencias mínimas y reales para maximizar paralelismo.

## 4. Revisión con el usuario
Muestra la lista numerada: título · bloqueado por · qué entrega. Pregunta si la granularidad es correcta, si los bloqueos son reales y si algo se une o se parte. Itera hasta aprobación.

## 5. Publicar
**Local (por defecto):** un archivo por ticket en `docs/plan/<slug>/NN-<titulo>.md`, numerados en orden de dependencias:

```markdown
# NN: <Título>

**Qué construir:** comportamiento de punta a punta desde la vista del usuario.
**Bloqueado por:** NN, NN — o "Nada (puede empezar ya)".
**Estado:** listo

## Criterios de aceptación
- [ ] ...
- [ ] Prueba en la costura <x> pasa
```

Y un `docs/plan/<slug>/00-INDICE.md` con la tabla de tickets y un diagrama Mermaid de dependencias.

**GitHub (si lo piden y `gh` está disponible):** un issue por ticket en orden de dependencias, con "Bloqueado por #N".

Sin rutas de archivo ni snippets en los tickets, salvo un esquema o tipo que decida algo.
