---
name: actualizar-mis-skills
description: 'Convierte lo aprendido en una sesión en una mejora permanente del repo de skills mark-house-skills - detecta la lección (receta que funcionó, error que se repite, mejor prompt, paso que faltaba), decide si va en una skill existente o en una nueva, la edita en el clon local, valida, sube la versión, anota el CHANGELOG y hace commit. Úsalo cuando el usuario diga "aprende esto", "guarda esto en las skills", "actualiza mis skills", "que no se te olvide para la próxima", o cuando resuelvas algo que claramente debería quedar en una skill.'
argument-hint: "[lo que se aprendió, o vacío para revisar la sesión]"
---

# Actualizar mis skills

El repo **mark-house-skills** es la fuente de verdad de estas skills. Lo aprendido no se guarda en la conversación: se guarda en el repo, y llega a todas las máquinas con la siguiente actualización del plugin.

## 1. Ubica el clon local
En este orden: la variable `MARK_HOUSE_SKILLS_DIR`; `~/mark-house-skills`; `~/proyectos/mark-house-skills`; o pregunta al usuario. Si no hay clon, ofrece clonarlo (`git clone https://github.com/CharlyDesigner/mark-house-skills.git ~/mark-house-skills`). Antes de editar: `git pull` y `git status` limpio. Lee el `CLAUDE.md` del repo: sus reglas mandan.

## 2. Destila la lección
Escribe en 2–4 líneas: qué pasó, qué funcionó (o qué falló y por qué), y la **regla general** que se desprende. Solo cuenta lo **reutilizable**: un dato de un cliente o un proyecto concreto no va en una skill (va en el `CLAUDE.md` de ese proyecto). Nunca metas secretos, llaves, contraseñas, datos de clientes ni rutas personales.

Ejemplos de lecciones que sí valen:
- "En Blender 5.x el motor EEVEE se llama `BLENDER_EEVEE`; detectar el id en vez de fijarlo."
- "Para clips de video con IA, pedir velocidad con verbos ('snaps', 'bursts') evita la cámara lenta."
- "ffmpeg dentro de un `while read` necesita `-nostdin`."

## 3. Decide dónde va
- ¿Afina algo que una skill ya hace? → edítala (SKILL.md si es una regla corta; su archivo de referencia si es una receta o detalle).
- ¿Es un flujo nuevo que se repetirá? → skill nueva con la plantilla del `CLAUDE.md` del repo.
- ¿Contradice algo existente? → reemplaza la regla vieja; no dejes dos versiones.
Muestra al usuario el cambio propuesto (diff corto) antes de escribirlo, salvo que haya dicho "hazlo".

## 4. Edita, valida y versiona
1. Aplica el cambio respetando el estilo (español, concreto, tablas y recetas probadas).
2. Si es código o receta, **pruébalo** antes de guardarlo. Una receta no probada se marca `(sin probar)`.
3. `python3 scripts/validar.py` y, si está disponible, `claude plugin validate .` y `claude plugin validate plugins/mark-house`.
4. Sube la versión en `plugins/mark-house/.claude-plugin/plugin.json` (semver): parche = corrección o detalle, menor = skill nueva o mejora notable, mayor = cambio que rompe el uso.
5. Agrega la entrada en `CHANGELOG.md` (fecha, versión, una línea por cambio).
6. Commit con `commits-convencionales` (ej. `fix(produccion-3d): detectar id de EEVEE en Blender 5`).

## 5. Publicar
El push lo decide el usuario (y los guardarrailes lo bloquean de todas formas). Dile exactamente qué correr: `git push`. Después, en cada máquina: `/plugin marketplace update mark-house-skills` o activar la actualización automática del marketplace en `/plugin`.

## 6. Cierra
Una línea: qué skill cambió, versión nueva, y si falta el push.
