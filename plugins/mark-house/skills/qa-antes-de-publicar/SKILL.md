---
name: qa-antes-de-publicar
description: 'Pase completo de QA antes de publicar, hacer PR o desplegar al servidor en vivo: funcionalidad, casos borde, seguridad, rendimiento, accesibilidad, responsive y despliegue, con checklists específicos para web, WordPress/WooCommerce, Electron y Godot. Entrega una lista de problemas ordenada por bloqueo. Úsalo cuando digan "haz QA", "revisa antes de subir", "¿ya está listo para producción?", "antes del deploy", "pásale una revisada".'
argument-hint: "[feature, rama o URL a revisar]"
---

# QA antes de publicar

## 1. Alcance
Identifica qué cambió (`git diff` contra la rama base, o la spec/ticket) y qué stack aplica. Abre [checklists.md](checklists.md) y usa **solo** las secciones relevantes.

## 2. Ejecuta, no supongas
Para cada punto del checklist, verifica con evidencia: correr la prueba, hacer el `curl`, abrir la página con Playwright y tomar captura en 375px y 1440px, leer la consola, correr Lighthouse, revisar el código. Si un punto no se puede verificar en este entorno, márcalo como "no verificado" con la razón; nunca como aprobado.

Si hay varias áreas independientes (backend, UI, rendimiento), revísalas con subagentes en paralelo y junta los hallazgos.

## 3. Reporte
Tabla ordenada por severidad:

| # | Severidad | Área | Problema | Evidencia | Bloquea a |
|---|---|---|---|---|---|

Severidades: **Bloqueante** (no se publica: seguridad, pérdida de datos, flujo principal roto), **Alta** (se nota y molesta), **Media**, **Pulido**.

Termina con un veredicto de una línea: "Listo para publicar", "Listo tras corregir #1–#3", o "No listo".

## 4. Si corriges
Corrige en orden de bloqueo. Cada bloqueante corregido lleva su prueba de regresión. Re-corre el QA de las áreas tocadas.

## 5. Despliegue a producción (si aplica)
Nunca despliegues sin permiso explícito del usuario. Antes: respaldo de archivos y BD, plan de reversa escrito, y la ventana de menor tráfico si es tienda en línea.
