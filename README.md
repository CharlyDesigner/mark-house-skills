# Mark House Skills

**Un estudio completo de software y creación digital dentro de Claude Code.** Son 36 skills en español que le enseñan a Claude a trabajar como un equipo profesional: dirección creativa y técnica, guion, arte, personajes, cámara, 3D, animación, IA generativa, postproducción, diseño de juegos, marca e ingeniería con planeación, TDD, depuración, QA y seguridad.

Los scripts incluidos están probados: Blender 5.2 headless (render, turntable, inspección y exportación), 32 recetas de ffmpeg, capturas de escenas web con Playwright y un hook de seguridad con 29/29 casos correctos. Este repo **aprende**: cuando una sesión descubre algo reutilizable, la skill `actualizar-mis-skills` lo integra aquí, y llega a todas tus máquinas con la siguiente actualización.

---

## Instalar

### Opción A — Pídeselo a Claude Code (la más fácil)
Abre Claude Code en cualquier carpeta y pega:

> Clona https://github.com/CharlyDesigner/mark-house-skills en ~/mark-house-skills, lee su CLAUDE.md y sigue la sección "Si te piden instala todo lo del repo". Al terminar, dime qué dependencias me faltan.

### Opción B — Como plugin (recomendada: se actualiza sola)
Dentro de Claude Code:
```
/plugin marketplace add CharlyDesigner/mark-house-skills
/plugin install mark-house@mark-house-skills
```
Después, en `/plugin` → **Marketplaces** → `mark-house-skills` → **Enable auto-update**. Las skills quedan como `/mark-house:director-creativo`, `/mark-house:produccion-3d`, etc.

Si el repo es **privado**, la máquina necesita credenciales de git sin contraseña: `gh auth login` y luego `gh auth setup-git`.

### Opción C — Por copia (nombres cortos, sin prefijo)
```bash
git clone https://github.com/CharlyDesigner/mark-house-skills.git ~/mark-house-skills
bash ~/mark-house-skills/scripts/instalar.sh                                         # macOS / Linux / Git Bash
powershell -ExecutionPolicy Bypass -File ~/mark-house-skills/scripts/instalar.ps1    # Windows
```
Para actualizar: `git pull` y vuelve a correr el instalador. **No combines B y C**, o cada skill aparece dos veces.

### Dependencias (las skills detectan lo que hay y se adaptan)
| Herramienta | Para | Instalar |
|---|---|---|
| ffmpeg | video y audio | `winget install ffmpeg` · `brew install ffmpeg` · `sudo apt install ffmpeg` |
| Blender 4.2+ | 3D | blender.org (agrega `blender` al PATH) o `pip install bpy` (bpy 5.2 usa Python 3.13) |
| Node.js 20+ | Remotion, Three.js, Playwright, guardarrailes | nodejs.org |
| git + gh | instalar y actualizar el repo | git-scm.com · cli.github.com |
| Generación con IA | imagen, video, 3D, voz, música | cualquier MCP o API conectada; sin ninguna, las skills entregan prompts listos |

---

## Cómo se usa
Dos directores encadenan todo lo demás:
```
/director-creativo "comercial de 30 s en 9:16 de una mascota que entrega ramen volando por la ciudad de noche"
/director-proyecto "app tipo Linktree con temas animados en 3D y analítica por enlace"
```
(Instalado como plugin: `/mark-house:director-creativo ...`)

- **El director creativo** va del brief a la entrega: biblia de estilo, personajes, guion y storyboard, dirección de cada toma, producción (IA, 3D o motion) con revisión visual de cada lote, postproducción y exportes por plataforma.
- **El director de proyecto** hace lo mismo con software: interrogar el plan, spec, diseño, tickets verticales, TDD con subagentes, QA y verificación.

Ambos llevan una bitácora de decisiones y costos. Cada skill funciona sola con `/nombre`, o Claude la activa al reconocer la tarea.

## Catálogo

### Creación digital
| Skill | Para qué |
|---|---|
| `director-creativo` | Orquesta una pieza audiovisual de la idea a la entrega (manual) |
| `biblia-de-estilo` | Paleta, luz, lentes, materiales, bloque de estilo para prompts, prohibidos |
| `diseno-de-personajes` | Personalidad → silueta → hoja (turnaround, expresiones) → ficha de prompt fija → notas para 3D y rig |
| `guion-y-storyboard` | Estructura según duración, guion, lista de tomas, storyboard y animatic |
| `direccion-de-escena` | Encuadre, lente, movimiento, luz y blocking, con referencia completa de lenguaje cinematográfico |
| `generacion-imagen-ia` | Modelo por tarea, anatomía del prompt, consistencia, edición, upscale y control de costo |
| `generacion-video-ia` | Keyframe → imagen a video, un movimiento por clip, continuidad, lip-sync, fallos típicos |
| `direccion-de-arte-ia` | Prompts de imagen en 11 bloques, ancla del producto real, luz y lente, los 8 delatores de "se ve a IA" (base: Creative Architect) |
| `campanas-visuales-ia` | Producto → animar → avatar → UGC → estructura de anuncios; intenciones, dinero, consentimiento y honestidad (base: Creative Architect) |
| `editor-reels-remotion` | Reels con EDL en JSON, aprobación de texto, validación, -14 LUFS, QA y estilos aprendidos (base: Video Editor Architect) |
| `motion-graphics-remotion` | Motion graphics con puertas: intake, marca, storyboard aprobado, stills, tonos y zonas seguras (base: Motion Architect) |
| `produccion-3d` | Pipeline de Blender por código, con scripts de render, turntable, inspección y exportación |
| `animacion-con-codigo` | Remotion, GSAP, Lottie, Manim y los 12 principios de la animación |
| `escenas-3d-web` | Three.js / R3F con presupuesto móvil, más script de captura y FPS |
| `postproduccion` | Montaje, color, sonido, subtítulos y exportes por plataforma (32 recetas de ffmpeg) |
| `revision-visual` | Crítica de imágenes, renders, videos y webs, más hoja de contacto para ver un video completo |
| `mesa-de-edicion` | Mesa de edición visual local: línea de tiempo con miniaturas, onda, reproductor y problemas automáticos (audio encimado, huecos, subtítulos), con API para el agente |
| `diseno-de-juego` | Pilares, bucles, mecánicas, niveles, game feel, GDD y vertical slice |
| `identidad-visual` | Estrategia, logo en SVG, paleta y tipografía, tokens, manual de marca |

### Ingeniería
| Skill | Para qué |
|---|---|
| `director-proyecto` | Orquesta el pipeline de software (manual) |
| `interrogar-plan` | Rondas de preguntas hasta no dejar decisiones abiertas (software o creativo) |
| `lenguaje-del-dominio` | `GLOSARIO.md` con los términos del negocio |
| `escribir-spec` | PRD en `docs/specs/` |
| `entrega-de-diseno` | Empaqueta un diseño para que Claude Code lo implemente sin romper nada: HANDOFF.md, prompt por etapas, storyboards numerados y videos de cada interacción |
| `disenar-dos-veces` | 3–5 diseños opuestos en paralelo (UI o módulos) |
| `plan-en-rebanadas` | Tickets verticales con bloqueos |
| `construir-con-tdd` | Rojo → verde para web, Node, Python, PHP/WordPress, Electron, móvil, Unity, Unreal y Godot |
| `depurar-sistematico` | 6 fases: ciclo rojo → hipótesis → fix → limpieza |
| `mejorar-arquitectura` | Módulos profundos, 2–3 estrategias con riesgo y esfuerzo |
| `qa-antes-de-publicar` | Checklists de web, WordPress, Woo, Node, Electron, móvil, audiovisual y juegos |
| `verificar-antes-de-terminar` | Nada de "listo" sin evidencia fresca |
| `commits-convencionales` | Mensajes `feat(…)`/`fix(…)` a partir del diff |
| `guardarrailes-claude-code` | Hook que bloquea push, rm -rf, DROP, wp db reset y deploys (manual) |
| `preparar-pre-commit` | Husky + lint-staged + Prettier + ESLint + PHPCS (manual) |
| `consenso-multiagente` | Varios subagentes deciden por separado y luego debaten |

### Mantenimiento
| Skill | Para qué |
|---|---|
| `actualizar-mis-skills` | Convierte una lección de la sesión en una mejora del repo: edita, prueba, valida, sube la versión y hace commit |

Primer paso recomendado en cada repo de código: `/guardarrailes-claude-code proyecto` y `/preparar-pre-commit`.

---

## Cómo aprende este repo
1. Trabajas normal con Claude Code. Cuando algo funciona especialmente bien, o un error se repite, dile **"aprende esto"** (o `/actualizar-mis-skills`).
2. La skill busca el clon local (`~/mark-house-skills` o la variable `MARK_HOUSE_SKILLS_DIR`) y destila la lección en una regla general. Decide en qué skill va, te muestra el cambio, lo prueba, valida, sube la versión y hace commit.
3. Tú haces `git push`. GitHub Actions vuelve a validar.
4. Cada máquina recibe la mejora con la actualización automática del plugin, o con `/plugin marketplace update mark-house-skills`.

Para que Claude Code lo recuerde en **cualquier** proyecto, agrega esto a tu `~/.claude/CLAUDE.md` (memoria global de Claude Code):
```markdown
## Mis skills
Mis skills viven en el repo CharlyDesigner/mark-house-skills (clon local: ~/mark-house-skills).
Cuando en una sesión descubras algo reutilizable (una receta que funcionó, un error que se repite,
un mejor prompt), propón guardarlo con la skill actualizar-mis-skills. Nunca guardes datos de clientes ni secretos.
```

Las reglas para editar el repo (estilo, versiones, pruebas, privacidad) están en [CLAUDE.md](CLAUDE.md), y el historial en [CHANGELOG.md](CHANGELOG.md).

## Estructura
```
.claude-plugin/marketplace.json                  catálogo del marketplace
plugins/mark-house/.claude-plugin/plugin.json    nombre y versión del plugin
plugins/mark-house/skills/<skill>/               SKILL.md + referencias + scripts/
scripts/validar.py                               validación (también corre en GitHub Actions)
scripts/instalar.sh · instalar.ps1               instalación por copia
CLAUDE.md                                        reglas para Claude Code en este repo
```

## Por qué funcionan mejor que pedirlo "a mano"
- **Ver antes de afirmar**: Claude puede leer imágenes. Las skills le hacen renderizar, capturar o armar hojas de contacto y mirarlas antes de decir que algo quedó bien.
- **Consistencia por diseño**: biblia de estilo y ficha de personaje idénticas en cada generación, y keyframe aprobado antes de animar.
- **Créditos con cuidado**: prueba barata primero; cotización y confirmación antes de lotes caros.
- **Disciplina de ingeniería**: decidir antes de construir, rebanadas verticales, pruebas en costuras públicas y evidencia antes de terminar.

## Origen
Nació de analizar el hilo viral "Top 67 Claude Skills" (@polydao, traducido por @ClaudeCode_love, abril 2026). Al revisarlo en noviembre de 2026, varios comandos ya no funcionaban: Matt Pocock reorganizó su repo y `anthropics/skills/auto-commit` nunca existió. Este repo reescribe esa metodología en español y la extiende a la producción creativa.

Repos originales recomendados (opcionales, duplican funciones de este plugin):
```
/plugin install mattpocock-skills@claude-plugins-official
/plugin install superpowers@claude-plugins-official
```
Otros útiles: `anthropics/skills` (webapp-testing, canvas-design, algorithmic-art), `remotion-dev/skills`, `vercel-labs/agent-skills`, `VoltAgent/awesome-design-md`, `coreyhaines31/marketingskills`, `AgriciDaniel/claude-seo`. Marketplace comunitario: skillsmp.com.

## Licencia
MIT. La metodología se inspira en [mattpocock/skills](https://github.com/mattpocock/skills) y [obra/superpowers](https://github.com/obra/superpowers), ambos MIT.
