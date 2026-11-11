---
name: entrega-de-diseno
description: 'Empaqueta un diseño o rediseño (mockups, maquetas, canvas, Figma, HTML de referencia) para que Claude Code u otro agente lo implemente en el proyecto real sin equivocarse ni dañar la funcionalidad - especificación HANDOFF.md (tokens, iconos, animaciones, interacciones por pantalla, mapa a rutas reales, responsivo, reglas que no se rompen, verificación), prompt por etapas, código de referencia, storyboards numerados de cada interacción y videos MP4. Incluye scripts probados para storyboard y video desde capturas. Úsalo cuando digan "pásaselo a Claude Code", "entrega del diseño", "handoff", "que lo implemente sin romper nada", "haz un video de cómo funciona para el programador", o al terminar un rediseño que otro va a construir.'
argument-hint: "[carpeta o enlace del diseño]"
---

# Entrega de diseño (handoff a Claude Code)

Un diseño bien entregado se implementa a la primera. El agente que construye **lee imágenes pero no reproduce video**, así que la entrega gira en torno a una especificación escrita y storyboards numerados; los videos son para que el humano revise.

## Qué lleva el paquete
```
<proyecto>-rediseno/
  HANDOFF.md              especificación: la fuente de verdad (plantilla en plantilla-handoff.md)
  PROMPT-CLAUDE-CODE.md   mensaje listo para pegar, por etapas
  diseno/                 código o archivos de referencia de cada pantalla
  storyboards/NN-pantalla.png   cuadros clave numerados de cada interacción
  videos/NN-pantalla.mp4        la misma interacción en movimiento
```
Numera las pantallas igual en las tres carpetas (`01-explorar`, `02-crear`…) y úsalas en la tabla "pantalla → ruta real" del HANDOFF.

## Pasos
1. **Revisa el sistema real primero.** Recorre la app actual (rutas, menús, textos, precios, costos) y anota lo que el diseño debe respetar. Los textos de producto salen del sitio real, no de tu memoria.
2. **Escribe `HANDOFF.md`** con `plantilla-handoff.md`. Lo no negociable:
   - Es un **reskin**: no cambia lógica, rutas, API, cobros ni autenticación. Lo que necesite backend nuevo va a `PENDIENTES.md`, no se inventa.
   - Tokens con valores exactos (hex, radios, tipografía, curvas de animación) y cómo integrarlos en las variables CSS que ya existen.
   - Cada pantalla: estructura de arriba abajo y **cada interacción con su resultado** ("al tocar X pasa Y").
   - Tabla de cortes responsivos (por ejemplo > 1100, ≤ 1100, ≤ 700 px) y "nunca desplazamiento horizontal".
   - Cómo verificar cada etapa.
3. **Graba cada pantalla** haciendo clic en sus interacciones (ver `grabar-interacciones.md`). Revisa los cuadros antes de seguir: una grabación que saltó de pantalla o se quedó congelada no sirve.
4. **Arma video y storyboard** de cada grabación:
   ```bash
   python3 ${CLAUDE_SKILL_DIR}/scripts/video_de_cuadros.py capturas/02-crear/ videos/02-crear.mp4 [tiempos.json]
   python3 ${CLAUDE_SKILL_DIR}/scripts/storyboard.py videos/02-crear.mp4 storyboards/02-crear.png 8
   ```
   Usa 8 cuadros en escritorio y 10 en móvil o tablet. Mira cada storyboard (`revision-visual`) antes de entregarlo.
5. **Escribe `PROMPT-CLAUDE-CODE.md`** (plantilla abajo) y empaqueta todo en un zip.

## Modelo y esfuerzo recomendados en Claude Code
Verificado en la documentación oficial el 2026-11-11; revísalo si pasó tiempo (`code.claude.com/docs/en/model-config.md`).

| Caso | Modelo | Esfuerzo |
|---|---|---|
| Rediseño de varias pantallas con verificación visual (lo normal) | `/model opus` (Opus 5.5) | `/effort high` (Opus 5.5 viene en `medium`) |
| Cambio chico y bien delimitado en una pantalla | `/model sonnet` | `/effort medium` |
| Trabajo muy largo y autónomo, sin revisión por etapas | `/model fable` (hay que elegirlo a mano; en algunos planes cobra créditos de uso) | `high` |

## Plantilla de `PROMPT-CLAUDE-CODE.md`
```text
Vamos a rediseñar la interfaz de [PROYECTO]. Es un reskin: cambia el aspecto, no la funcionalidad.
Lee completo docs/rediseno/HANDOFF.md (fuente de verdad), revisa docs/rediseno/diseno/ y mira las
imágenes de docs/rediseno/storyboards/.

Reglas:
- No cambies lógica, rutas, API, cobros ni autenticación. Lo que necesite backend va a PENDIENTES.md.
- No cambies textos de producto ni precios del código.
- Integra los tokens en las variables CSS existentes; no crees otro sistema de estilos.
- Respeta prefers-reduced-motion y la accesibilidad de la especificación.

Primero explora y dame un plan por etapas, una pantalla por etapa: [ORDEN]. Indica qué archivos tocarás.
Al aprobarlo, implementa una etapa a la vez. Al terminar cada una: capturas en 1440, 834 y 390 px,
compáralas con su storyboard, lista y corrige las diferencias, prueba que la funcionalidad real sigue
igual, haz commit con el nombre de la etapa y espera mi revisión.
```
Instrucción para el humano: pegarlo en **modo plan** (Shift+Tab hasta "plan mode on").

## Antes de entregar
- [ ] Cada pantalla del diseño tiene fila en la tabla de rutas, storyboard y video.
- [ ] Los storyboards muestran la interacción (antes → durante → después), no solo la pantalla quieta.
- [ ] Precios, costos y nombres coinciden con el sistema real.
- [ ] El HANDOFF dice qué NO se toca.
- [ ] Se aclaró que el agente usa los storyboards y el humano los videos.
- [ ] Sin datos de clientes, llaves ni contraseñas en el paquete.
