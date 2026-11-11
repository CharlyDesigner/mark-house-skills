#!/usr/bin/env python3
"""
Convierte una carpeta de capturas (f0000.png, f0001.png, ...) en un MP4, respetando el
tiempo real entre capturas. Pensado para grabaciones hechas con screenshots de Playwright,
donde cada captura tarda distinto.

  python3 video_de_cuadros.py carpeta/ salida.mp4 [tiempos.json] [max_pausa=1.0]

tiempos.json (opcional): lista con la duración en segundos de cada cuadro, en orden.
Sin él, cada cuadro dura 0.12 s. Las pausas largas (un clic que tardó, una espera)
se recortan a max_pausa para que el video no se quede congelado.
El último cuadro dura 1.2 s. Requiere ffmpeg.
"""
import json
import pathlib
import subprocess
import sys
import tempfile

if len(sys.argv) < 3:
    sys.exit(__doc__)

carpeta = pathlib.Path(sys.argv[1]).resolve()
salida = pathlib.Path(sys.argv[2]).resolve()
tiempos = json.loads(pathlib.Path(sys.argv[3]).read_text()) if len(sys.argv) > 3 and sys.argv[3] != "-" else None
max_pausa = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0

cuadros = sorted(p for p in carpeta.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg"))
if not cuadros:
    sys.exit(f"No hay cuadros en {carpeta}")

with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as lista:
    for i, c in enumerate(cuadros):
        d = 1.2 if i == len(cuadros) - 1 else (tiempos[i] if tiempos and i < len(tiempos) else 0.12)
        d = min(max_pausa if i < len(cuadros) - 1 else d, max(0.04, d))
        ruta = str(c).replace("'", "'\\''")
        lista.write(f"file '{ruta}'\nduration {d:.3f}\n")
    lista.write(f"file '{str(cuadros[-1])}'\n")
    nombre = lista.name

subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", nombre,
                "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p", "-r", "30",
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-movflags", "+faststart", str(salida)],
               check=True)
pathlib.Path(nombre).unlink()
dur = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                               str(salida)], text=True).strip()
print(f"OK {salida} ({len(cuadros)} cuadros, {float(dur):.1f} s)")
