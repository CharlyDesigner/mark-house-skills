# Reglas de este repo (para Claude Code)

Este repo es la **fuente de verdad** de las skills de Carlos. Es a la vez un marketplace de plugins de Claude Code (`.claude-plugin/marketplace.json`) y contiene un plugin, `mark-house` (`plugins/mark-house/`). Todo lo que se aprenda y valga la pena repetir termina aquí.

## Si te piden "instala todo lo del repo"
Pregunta solo si no está claro: ¿como **plugin** (recomendado: se actualiza solo) o por **copia** (nombres cortos sin prefijo)? Nunca las dos.

**Plugin** — dile al usuario que escriba en Claude Code (son comandos de la interfaz, tú no los puedes ejecutar):
```
/plugin marketplace add CharlyDesigner/mark-house-skills
/plugin install mark-house@mark-house-skills
```
Luego, en `/plugin` → Marketplaces → mark-house-skills → "Enable auto-update". Las skills quedan como `/mark-house:<nombre>`.
Si es repo privado: la máquina necesita `gh auth login` y `gh auth setup-git` para que git clone sin pedir contraseña.

**Copia** — tú sí puedes hacerlo: `bash scripts/instalar.sh` (macOS/Linux/Git Bash) o `powershell -ExecutionPolicy Bypass -File scripts/instalar.ps1` (Windows). Para actualizar después: `git pull` y volver a correr el instalador.

Después de instalar, revisa dependencias y reporta cuáles faltan (no las instales sin preguntar): `ffmpeg`, `blender` (o `pip install bpy`), `node`, `git`, `gh`.

## Estructura
```
.claude-plugin/marketplace.json        catálogo (sin "version" en la entrada)
plugins/mark-house/.claude-plugin/plugin.json   nombre y VERSIÓN del plugin (única fuente de versión)
plugins/mark-house/skills/<nombre>/SKILL.md     una carpeta por skill
plugins/mark-house/skills/<nombre>/*.md         referencias que se leen bajo demanda
plugins/mark-house/skills/<nombre>/scripts/     scripts que se ejecutan (no se cargan al contexto)
scripts/validar.py                     validación obligatoria antes de cada commit
scripts/instalar.sh / instalar.ps1     instalación por copia
CHANGELOG.md                           historial por versión
```

## Cómo agregar o mejorar una skill
Usa la skill `actualizar-mis-skills`. Reglas:
1. **Idioma**: español; términos técnicos y prompts para modelos de IA en inglés cuando funcionan mejor.
2. **Nombre**: carpeta en kebab-case, igual al `name` del frontmatter, sin "claude" ni "anthropic".
3. **Frontmatter**: `description` entre comillas simples, con qué hace + cuándo usarla + frases típicas del usuario; máx. 1536 caracteres. Usa `disable-model-invocation: true` solo para flujos que deben correr a pedido (directores, instaladores de hooks).
4. **Cuerpo**: < 500 líneas, instrucciones directas, tablas y listas de verificación. Lo largo va en un `.md` de referencia enlazado desde el SKILL.md.
5. **Scripts**: referéncialos con `${CLAUDE_SKILL_DIR}/scripts/...`; multiplataforma cuando se pueda (Node o Python antes que bash; si es bash, que funcione en Git Bash).
6. **Probado o marcado**: toda receta, comando o script se prueba antes de entrar. Lo no probado se marca `(sin probar)`.
7. **Cero datos privados**: nada de llaves, contraseñas, datos de clientes, IPs de servidores ni rutas personales. `validar.py` busca secretos obvios, pero la responsabilidad es tuya.
8. **Generales, no de un cliente**: las skills sirven para cualquier proyecto. Lo específico de un proyecto va en el `CLAUDE.md` de ese proyecto.
9. **Una regla, un lugar**: si una lección contradice algo existente, reemplázalo; no dejes dos versiones.
10. **Referencias entre skills** por nombre corto (`revision-visual`); como plugin se ven como `mark-house:revision-visual`.

## Antes de cada commit
```bash
python3 scripts/validar.py
claude plugin validate .                    # si la CLI está disponible
claude plugin validate plugins/mark-house
```
Sube la versión en `plugin.json` (parche: corrección · menor: skill nueva o mejora · mayor: cambio que rompe), agrega la entrada en `CHANGELOG.md`, y haz commit con formato convencional (`feat(postproduccion): ...`). **El push lo hace el usuario** o lo aprueba explícitamente.
