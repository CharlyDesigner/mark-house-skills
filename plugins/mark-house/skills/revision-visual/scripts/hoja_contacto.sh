#!/usr/bin/env bash
# Hoja de contacto: convierte un video o una carpeta de imágenes en UNA imagen en cuadrícula
# para que Claude pueda revisarla de un vistazo (leyendo el PNG resultante).
#
#   hoja_contacto.sh video.mp4 [salida.png] [cuadros=12] [columnas=4] [ancho_celda=480]
#   hoja_contacto.sh carpeta/  [salida.png] [max=24]     [columnas=6] [ancho_celda=320]
#
# Requiere ffmpeg y ffprobe. Funciona en macOS, Linux y Git Bash.
set -euo pipefail

ENTRADA="${1:?Uso: hoja_contacto.sh <video|carpeta> [salida.png] [cuadros] [columnas] [ancho_celda]}"
SALIDA="${2:-hoja_contacto.png}"
command -v ffmpeg >/dev/null || { echo "Falta ffmpeg" >&2; exit 1; }

if [ -d "$ENTRADA" ]; then
  MAX="${3:-24}"; COLS="${4:-6}"; ANCHO="${5:-320}"
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
  i=0
  while IFS= read -r f; do
    i=$((i + 1)); [ "$i" -gt "$MAX" ] && break
    ffmpeg -nostdin -loglevel error -y -i "$f" -vf "scale=${ANCHO}:-2:force_original_aspect_ratio=decrease,pad=${ANCHO}:${ANCHO}:(ow-iw)/2:(oh-ih)/2:color=0x202020" \
      "$TMP/$(printf '%04d' "$i").png"
  done < <(find "$ENTRADA" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) | sort)
  [ "$i" -eq 0 ] && { echo "No hay imágenes en $ENTRADA" >&2; exit 1; }
  N=$(( i > MAX ? MAX : i ))
  FILAS=$(( (N + COLS - 1) / COLS ))
  ffmpeg -nostdin -loglevel error -y -framerate 1 -i "$TMP/%04d.png" -vf "tile=${COLS}x${FILAS}:padding=4:margin=4:color=0x101010" -frames:v 1 "$SALIDA"
  echo "OK $SALIDA ($N imágenes, ${COLS}x${FILAS}, orden alfabético)"
else
  CUADROS="${3:-12}"; COLS="${4:-4}"; ANCHO="${5:-480}"
  DUR="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ENTRADA")"
  FILAS=$(( (CUADROS + COLS - 1) / COLS ))
  # Toma cuadros repartidos uniformemente en toda la duración
  FPS="$(awk -v n="$CUADROS" -v d="$DUR" 'BEGIN{ printf "%.6f", n / (d > 0 ? d : 1) }')"
  ffmpeg -nostdin -loglevel error -y -i "$ENTRADA" \
    -vf "fps=${FPS},scale=${ANCHO}:-2,tile=${COLS}x${FILAS}:padding=4:margin=4:color=0x101010" \
    -frames:v 1 "$SALIDA"
  echo "OK $SALIDA ($CUADROS cuadros de ${DUR}s, ${COLS}x${FILAS}; cada celda ≈ $(awk -v d="$DUR" -v n="$CUADROS" 'BEGIN{printf "%.2f", d/n}') s)"
fi
