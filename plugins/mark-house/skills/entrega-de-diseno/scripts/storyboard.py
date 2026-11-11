#!/usr/bin/env python3
"""
Storyboard numerado de una interacción: toma un video (o una carpeta de cuadros PNG/JPG)
y arma UNA imagen con N cuadros repartidos en el tiempo, cada uno con su número.
Sirve para que otro agente (que lee imágenes pero no reproduce video) compare su
implementación cuadro por cuadro.

  python3 storyboard.py video.mp4 salida.png [cuadros=8] [columnas=auto] [ancho=auto]
  python3 storyboard.py carpeta_cuadros/ salida.png [cuadros=8] [columnas=auto] [ancho=auto]

columnas=auto: 4 si el cuadro es horizontal, 5 si es vertical.
ancho=auto: 720 px por celda en horizontal, 300 px en vertical.
Requiere Pillow (pip install pillow); para videos, también ffmpeg y ffprobe.
"""
import pathlib
import subprocess
import sys
import tempfile

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Falta Pillow: pip install pillow")

if len(sys.argv) < 3:
    sys.exit(__doc__)

entrada = pathlib.Path(sys.argv[1])
salida = pathlib.Path(sys.argv[2])
n = int(sys.argv[3]) if len(sys.argv) > 3 else 8
cols_arg = sys.argv[4] if len(sys.argv) > 4 else "auto"
ancho_arg = sys.argv[5] if len(sys.argv) > 5 else "auto"


def cuadros_de_video(video, n, tmp):
    dur = float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)],
        text=True).strip())
    rutas = []
    for i in range(n):
        t = min(dur - 0.05, dur * i / max(1, n - 1)) if n > 1 else 0
        r = pathlib.Path(tmp) / f"{i:03d}.png"
        subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-ss", f"{max(0, t):.3f}",
                        "-i", str(video), "-frames:v", "1", str(r)], check=True)
        rutas.append(r)
    return rutas


with tempfile.TemporaryDirectory() as tmp:
    if entrada.is_dir():
        todos = sorted(p for p in entrada.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg", ".webp"))
        if not todos:
            sys.exit(f"No hay imágenes en {entrada}")
        idx = [round(i * (len(todos) - 1) / max(1, n - 1)) for i in range(min(n, len(todos)))]
        rutas = [todos[i] for i in idx]
    else:
        rutas = cuadros_de_video(entrada, n, tmp)

    ims = [Image.open(r).convert("RGB") for r in rutas]
    w0, h0 = ims[0].size
    horizontal = w0 >= h0
    cols = (4 if horizontal else 5) if cols_arg == "auto" else int(cols_arg)
    tw = (720 if horizontal else 300) if ancho_arg == "auto" else int(ancho_arg)
    th = round(h0 * tw / w0)
    pad, cab = 16, 34
    filas = (len(ims) + cols - 1) // cols
    hoja = Image.new("RGB", (cols * (tw + pad) + pad, filas * (th + pad + cab) + pad), (24, 26, 23))
    dib = ImageDraw.Draw(hoja)
    try:
        fuente = ImageFont.truetype("DejaVuSans-Bold.ttf", 22)
    except OSError:
        fuente = ImageFont.load_default()
    for k, im in enumerate(ims):
        x = pad + (k % cols) * (tw + pad)
        y = pad + (k // cols) * (th + pad + cab)
        hoja.paste(im.resize((tw, th)), (x, y + cab))
        dib.text((x, y + 4), str(k + 1), fill=(206, 255, 86), font=fuente)
    hoja.save(salida, optimize=True)
    print(f"OK {salida} ({len(ims)} cuadros, {cols} columnas, {hoja.size[0]}x{hoja.size[1]})")
