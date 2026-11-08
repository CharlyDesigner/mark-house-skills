---
name: depurar-sistematico
description: 'Disciplina de depuración en 6 fases para bugs difíciles y regresiones de rendimiento: primero un ciclo de retroalimentación que se ponga rojo, luego reproducir, minimizar, hipótesis falsables, instrumentar, corregir con prueba de regresión y limpiar. Prohíbe "cambiar cosas a ver si jala". Úsalo cuando algo falle, truene, dé error, esté lento, o digan "depura", "no sé por qué no funciona", "debug this", "pantalla blanca", "error 500".'
argument-hint: "[síntoma del bug]"
---

# Depuración sistemática

No saltes fases sin decir por qué. **Antes de mostrar comandos o salidas, reemplaza cualquier secreto con `<REDACTADO>`** (API keys, contraseñas de BD, tokens, cookies).

## Fase 1 — Construir el ciclo de retroalimentación (esto ES la skill)
Necesitas **un comando** que se ponga rojo con este bug exacto. Sin él, no hay fase 2. Opciones, en orden:
1. Prueba que falla en la costura que alcanza el bug.
2. `curl`/script HTTP contra el servidor de desarrollo (o endpoint REST/AJAX de WP).
3. CLI con un fixture, comparando salida contra una conocida buena.
4. Script de Playwright que maneja la UI y verifica DOM/consola/red.
5. Reproducir una petición/payload capturado (webhook de pago, pedido de Woo, evento de WhatsApp).
6. Arnés desechable: el mínimo del sistema para ejercitar esa ruta.
7. Bucle de fuzz: 1000 entradas aleatorias si es "a veces sale mal".
8. `git bisect run` si apareció entre dos versiones conocidas.
9. Diferencial: misma entrada en versión vieja vs nueva.

Luego **apriétalo**: más rápido, señal más específica (el síntoma exacto, no "no truena"), determinista (fija reloj, semilla, red). Bugs intermitentes: sube la tasa de reproducción hasta que sea depurable.

Listo cuando puedes nombrar el comando, ya lo corriste, y es: capaz de ponerse rojo con *este* síntoma, determinista, rápido y ejecutable sin humano.

**WordPress:** activa `WP_DEBUG`, `WP_DEBUG_LOG`, `WP_DEBUG_DISPLAY=false` en `wp-config.php` del entorno de desarrollo y lee `wp-content/debug.log`. Query Monitor para consultas lentas y hooks. Desactivar plugins uno a uno es bisección: hazla con `wp plugin deactivate` en staging, nunca a ciegas en producción.

**Servidor en vivo:** si el bug solo existe en producción, no edites en caliente. Pide permiso, haz respaldo, y captura artefactos (logs, payload) para reproducir localmente.

## Fase 2 — Reproducir y minimizar
Confirma que el rojo es **el síntoma que describió el usuario**, no otro cercano. Luego recorta entradas, datos, config y pasos uno por uno, re-corriendo cada vez, hasta que cada elemento restante sea indispensable.

## Fase 3 — Hipótesis
Genera **3–5 hipótesis ordenadas** antes de probar ninguna. Cada una falsable: "Si X es la causa, cambiar Y hará que desaparezca". Muéstrale la lista al usuario (a veces sabe algo que reordena todo) pero no te bloquees esperando.

## Fase 4 — Instrumentar
Cada sonda prueba una predicción. Una variable a la vez. Prefiere debugger/REPL; si no, logs en las fronteras que distinguen hipótesis. **Etiqueta cada log** con un prefijo único (`[DEBUG-a4f2]`) para borrarlos con un grep. Rendimiento: mide línea base primero (profiler, `performance.now()`, `EXPLAIN` de la consulta), luego bisecciona.

## Fase 5 — Corregir con prueba de regresión
Convierte la repro mínima en una prueba que falle **antes** del fix, en una costura que reproduzca el patrón real. Si no existe costura correcta, eso es un hallazgo: anótalo para `mejorar-arquitectura`. Aplica el fix, mira la prueba pasar, re-corre el ciclo original.

## Fase 6 — Limpieza (obligatoria)
- [ ] La repro original ya no reproduce
- [ ] La prueba de regresión pasa (o la falta de costura está documentada)
- [ ] `grep` del prefijo de debug: cero resultados
- [ ] Arneses desechables borrados
- [ ] La hipótesis correcta queda escrita en el mensaje de commit
