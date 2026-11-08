---
name: guardarrailes-claude-code
description: 'Instala hooks de Claude Code que bloquean comandos peligrosos antes de ejecutarse - git push, reset --hard, clean, branch -D, borrados recursivos de rutas peligrosas, drops de base de datos y comandos destructivos de WP-CLI o por SSH a servidores en vivo. Multiplataforma (script en Node). Úsalo en cada repo nuevo o cuando pidan "pon guardarrailes", "que no pueda hacer push", "protege producción", "git guardrails".'
disable-model-invocation: true
argument-hint: "[proyecto | global]"
---

# Guardarrailes para Claude Code

Instala un hook `PreToolUse` que revisa cada comando de Bash antes de que corra y lo bloquea (código de salida 2) si coincide con un patrón peligroso. Claude recibe el mensaje y tiene que pedirle al usuario que lo haga él.

## Qué bloquea (por defecto)
- Git: `push` (todas las variantes), `reset --hard`, `clean -f/-fd`, `branch -D`, `checkout .`, `restore .`, `stash drop/clear`, `filter-branch`, `rebase` sobre `main/master`.
- Borrado: `rm -rf` sobre `/`, `~`, `$HOME`, `*`, `..`, `.git`, `wp-content`, `uploads`; `Remove-Item -Recurse` equivalentes en PowerShell.
- Base de datos: `DROP DATABASE`, `DROP TABLE`, `TRUNCATE`, `DELETE FROM` sin `WHERE`.
- WP-CLI destructivo: `wp db reset`, `wp db drop`, `wp site empty`, `wp search-replace` sin `--dry-run`, `wp plugin delete`, `wp user delete`.
- Despliegue directo: `rsync --delete`, `ssh ... rm`, `scp` hacia el servidor (para que los deploys los apruebes tú).
- Lectura de secretos: `cat .env`, `cat wp-config.php`, impresión de claves SSH.

## Pasos
1. **Alcance**: pregunta (si no vino en `$ARGUMENTS`) si es para **este proyecto** (`.claude/settings.json`) o **global** (`~/.claude/settings.json`).
2. **Copia el script** `${CLAUDE_SKILL_DIR}/scripts/guardarrailes.mjs` a:
   - Proyecto: `.claude/hooks/guardarrailes.mjs`
   - Global: `~/.claude/hooks/guardarrailes.mjs`
3. **Agrega el hook** a la configuración, fusionando con `hooks.PreToolUse` si ya existe (nunca sobrescribas otros ajustes):

   Proyecto:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         { "matcher": "Bash", "hooks": [ { "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/guardarrailes.mjs\"" } ] }
       ]
     }
   }
   ```
   Global: igual, con `"command": "node ~/.claude/hooks/guardarrailes.mjs"` (en Windows usa la ruta absoluta, p. ej. `node C:/Users/<usuario>/.claude/hooks/guardarrailes.mjs`).
4. **Personaliza**: pregunta si quiere quitar o agregar patrones (p. ej. permitir `git push` a ramas `feature/*`). Edita el arreglo `REGLAS` del script copiado.
5. **Verifica** con estas tres pruebas y muestra la salida:
   ```bash
   echo '{"tool_input":{"command":"git push origin main"}}' | node <ruta>/guardarrailes.mjs; echo "salida=$?"   # debe dar 2
   echo '{"tool_input":{"command":"wp db reset --yes"}}' | node <ruta>/guardarrailes.mjs; echo "salida=$?"    # debe dar 2
   echo '{"tool_input":{"command":"git status"}}' | node <ruta>/guardarrailes.mjs; echo "salida=$?"          # debe dar 0
   ```

Recuerda al usuario: los guardarrailes son una red de seguridad, no un permiso para correr Claude Code sin mirar en un servidor de producción.
