#!/usr/bin/env bash
# Instalación por COPIA en ~/.claude/skills (macOS, Linux, Git Bash).
# Alternativa a instalar como plugin; no uses las dos a la vez o tendrás cada skill duplicada.
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORIGEN="$RAIZ/plugins/mark-house/skills"
DESTINO="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
FECHA="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$DESTINO"
instaladas=0
for dir in "$ORIGEN"/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  nombre="$(basename "$dir")"
  if [ -e "$DESTINO/$nombre" ]; then
    mv "$DESTINO/$nombre" "$DESTINO/$nombre.bak-$FECHA"
    echo "  respaldo: $nombre -> $nombre.bak-$FECHA"
  fi
  cp -R "$dir" "$DESTINO/$nombre"
  chmod +x "$DESTINO/$nombre"/scripts/* 2>/dev/null || true
  echo "  ✓ $nombre"
  instaladas=$((instaladas + 1))
done

echo ""
echo "$instaladas skills instaladas en $DESTINO"
echo "Abre Claude Code y escribe /director-creativo \"tu idea\" o /director-proyecto \"tu idea\"."
