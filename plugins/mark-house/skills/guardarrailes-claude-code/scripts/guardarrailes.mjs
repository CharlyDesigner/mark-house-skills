#!/usr/bin/env node
// Hook PreToolUse de Claude Code: bloquea comandos peligrosos antes de ejecutarse.
// Lee el JSON del hook por stdin. Sale con 2 (bloquear) o 0 (permitir).
// Edita REGLAS para agregar o quitar patrones.

const REGLAS = [
  // --- Git ---
  { re: /\bgit\s+push\b/i, por: 'git push (los push los haces tú)' },
  { re: /\bgit\s+reset\s+--hard\b/i, por: 'git reset --hard (pierde cambios)' },
  { re: /\bgit\s+clean\s+-[a-z]*f/i, por: 'git clean -f (borra archivos sin rastrear)' },
  { re: /\bgit\s+branch\s+(-D|--delete\s+--force)\b/, por: 'git branch -D' },
  { re: /\bgit\s+(checkout|restore)\s+(--\s+)?\.(\s|$)/i, por: 'git checkout/restore . (descarta todo)' },
  { re: /\bgit\s+stash\s+(drop|clear)\b/i, por: 'git stash drop/clear' },
  { re: /\bgit\s+filter-(branch|repo)\b/i, por: 'reescritura de historial' },
  { re: /\bgit\s+rebase\b.*\b(main|master)\b/i, por: 'rebase sobre main/master' },

  // --- Borrado de archivos ---
  { re: /\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r|-r\s+-f|-f\s+-r|--recursive)\b[^|;&]*(\s|=)(\/|~|\$HOME|\*|\.\.|\.git|[^\s]*wp-content|[^\s]*uploads)(\/?\s|\/?$|\/\*)/i, por: 'rm -rf sobre una ruta peligrosa' },
  { re: /\bRemove-Item\b[^|;]*-Recurse\b[^|;]*(\s)(C:\\|~|\$HOME|\$env:USERPROFILE|\*|\.\.)/i, por: 'Remove-Item -Recurse sobre ruta peligrosa' },
  { re: /\b(rd|rmdir)\s+\/s\b/i, por: 'rmdir /s' },
  { re: /\bformat\s+[a-z]:/i, por: 'format de unidad' },

  // --- Base de datos ---
  { re: /\bDROP\s+(DATABASE|SCHEMA|TABLE)\b/i, por: 'DROP de base de datos/tabla' },
  { re: /\bTRUNCATE\s+(TABLE\s+)?\w/i, por: 'TRUNCATE' },
  { re: /\bDELETE\s+FROM\s+[`"\w.]+\s*(;|"|'|$)/i, por: 'DELETE FROM sin WHERE' },

  // --- WP-CLI destructivo ---
  { re: /\bwp\s+db\s+(reset|drop|clean)\b/i, por: 'wp db reset/drop/clean' },
  { re: /\bwp\s+site\s+(empty|delete)\b/i, por: 'wp site empty/delete' },
  { re: /\bwp\s+search-replace\b(?![^|;&]*--dry-run)/i, por: 'wp search-replace sin --dry-run' },
  { re: /\bwp\s+(plugin|theme)\s+delete\b/i, por: 'wp plugin/theme delete' },
  { re: /\bwp\s+user\s+delete\b/i, por: 'wp user delete' },

  // --- Despliegue / servidores remotos ---
  { re: /\brsync\b[^|;&]*--delete\b/i, por: 'rsync --delete' },
  { re: /\bssh\b[^|;&]*\b(rm|wp\s+db|mysql\b[^|;&]*-e|DROP|reboot|shutdown)\b/i, por: 'comando destructivo por SSH' },
  { re: /\bscp\b[^|;&]*\s[\w.-]+@[\w.-]+:/i, por: 'scp hacia un servidor (deploy manual)' },

  // --- Secretos ---
  { re: /\b(cat|type|Get-Content|less|more|head|tail)\b[^|;&]*(\.env(\.\w+)?\b|wp-config\.php|id_rsa|id_ed25519|\.pem\b)/i, por: 'lectura de archivo de secretos' },
  { re: /\bprintenv\b|\benv\s*$|\bGet-ChildItem\s+env:/i, por: 'volcado de variables de entorno' },
];

let entrada = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (entrada += c));
process.stdin.on('end', () => {
  let comando = '';
  try {
    const datos = JSON.parse(entrada || '{}');
    comando = String(datos?.tool_input?.command ?? '');
  } catch {
    process.exit(0); // si no es JSON válido, no estorbamos
  }
  if (!comando) process.exit(0);

  for (const { re, por } of REGLAS) {
    if (re.test(comando)) {
      process.stderr.write(
        `BLOQUEADO por guardarrailes: ${por}.\n` +
        `Comando: ${comando}\n` +
        `No tienes autorización para ejecutar esto. Explícale al usuario qué querías hacer y pídele que lo corra él si está de acuerdo.\n`
      );
      process.exit(2);
    }
  }
  process.exit(0);
});
