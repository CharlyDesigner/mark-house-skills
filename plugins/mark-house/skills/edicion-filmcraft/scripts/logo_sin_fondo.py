#!/usr/bin/env python3
"""
Quita el fondo liso de un logo (JPG/PNG sobre blanco o gris) y lo recorta: PNG con transparencia.

    python logo_sin_fondo.py logo.jpg logo.png [umbral]

Rellena desde los bordes solo los píxeles parecidos al color del fondo (la mediana del borde), así
los blancos INTERNOS del logo se conservan. Umbral = diferencia máxima por canal (5 por omisión).
Si se come un anillo blanco que toca el fondo (blanco 255 vs fondo 247), baja el umbral; si deja
halo de fondo, súbelo. Requiere numpy y ffmpeg/ffprobe. Revisa el resultado sobre un fondo oscuro.
"""
import subprocess
import sys

import numpy as np

if len(sys.argv) < 3:
    sys.exit(__doc__)
src, dst = sys.argv[1], sys.argv[2]
umbral = int(sys.argv[3]) if len(sys.argv) > 3 else 5
w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height',
                                '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split(','))
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
img = np.frombuffer(raw, np.uint8).reshape(h, w, 3).astype(np.int16)
fondo = np.median(np.concatenate([img[0], img[-1], img[:, 0], img[:, -1]]), axis=0)
cand = np.abs(img - fondo).max(axis=2) < umbral
sem = np.zeros_like(cand)
sem[0], sem[-1], sem[:, 0], sem[:, -1] = cand[0], cand[-1], cand[:, 0], cand[:, -1]
while True:  # relleno por inundación desde los bordes
    d = sem.copy()
    d[1:] |= sem[:-1]
    d[:-1] |= sem[1:]
    d[:, 1:] |= sem[:, :-1]
    d[:, :-1] |= sem[:, 1:]
    d &= cand
    if (d == sem).all():
        break
    sem = d
a = (~sem).astype(np.float32)
a2 = a.copy()  # suaviza 1 px el borde
a2[1:-1, 1:-1] = (a[:-2, 1:-1] + a[2:, 1:-1] + a[1:-1, :-2] + a[1:-1, 2:] + 4 * a[1:-1, 1:-1]) / 8
ys, xs = np.where(a2 > 0.05)
out = np.dstack([img.astype(np.uint8), (a2 * 255).astype(np.uint8)])[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
oh, ow = out.shape[:2]
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{ow}x{oh}', '-i', '-', dst],
               input=out.tobytes(), check=True)
print(f'{dst}: {ow}x{oh}, fondo {fondo.tolist()}')
