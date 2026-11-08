---
name: commits-convencionales
description: 'Lee el diff en stage y escribe mensajes de commit con formato Conventional Commits (tipo, alcance, asunto, cuerpo con el porqué), partiendo en varios commits si mezcla cambios no relacionados. Úsalo al hacer commit, o cuando pidan "haz el commit", "mensaje de commit", "commitea esto".'
argument-hint: "[opcional: idioma o contexto extra]"
---

# Commits convencionales

## Proceso
1. `git status` y `git diff --staged`. Si no hay nada en stage, muestra `git diff` y pregunta qué agregar (no hagas `git add -A` a ciegas: puede meter `.env`, builds o archivos de otro cambio).
2. Si el stage mezcla cambios sin relación (un fix + un feature + formato), propón partirlo en commits separados con `git add -p` o por archivo.
3. Escribe el mensaje:

```
<tipo>(<alcance>): <asunto en imperativo, ≤ 72 caracteres, sin punto>

<cuerpo: qué cambió y POR QUÉ, no cómo. Envuelto a 72 columnas.>

<pie: Closes #12 · BREAKING CHANGE: ... · Co-authored-by: ...>
```

**Tipos**: `feat` (nueva capacidad) · `fix` (bug) · `perf` · `refactor` (sin cambio de comportamiento) · `test` · `docs` · `style` (formato) · `build` (deps, empaquetado) · `ci` · `chore`.
**Alcance**: el módulo o área (`checkout`, `ruleta`, `api`, `ipc`, `ui`, `tema`). Si el repo ya tiene costumbre, síguela (`git log --oneline -20`).
**Idioma**: el que use el historial del repo; si está vacío, español.

4. Para bugs corregidos con `depurar-sistematico`, el cuerpo dice la causa raíz encontrada.
5. Muestra el mensaje y haz el commit con `git commit -F -` (heredoc) para respetar saltos de línea. **Nunca hagas push**: eso lo decide el usuario.

## Ejemplos
```
feat(ruleta): limitar giros por cliente a uno cada 24 h

Los clientes recargaban la página para volver a girar y acumular
cupones. Ahora el último giro se guarda en user meta (o cookie firmada
para invitados) y el endpoint rechaza giros dentro de la ventana.

Closes #41
```
```
fix(checkout): calcular envío con el código postal ya normalizado

El CP llegaba con espacios desde el autocompletado del navegador y la
tabla de zonas no lo encontraba, cobrando la tarifa por defecto.
```
