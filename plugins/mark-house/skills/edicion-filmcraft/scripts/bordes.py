#!/usr/bin/env python3
"""
Busca bordes negros (franjas sin imagen) en la secuencia activa de FilmCraft en vivo, típico después de
reencuadrar o escalar tomas. Exporta cuadros y mide el brillo de 6 px en cada orilla. Requiere fc.py y ffmpeg.

    python bordes.py --desde 3 --hasta 58 [--paso 0.5] [--detalle 9.5-10.5 36-37]

--detalle  tramos (segundos) que se revisan cuadro por cuadro: golpes de zoom y paneos rápidos.
Sale con código 1 si encuentra algún borde negro.
"""
import argparse
import os
import subprocess
import sys
import tempfile

import fc

ap = argparse.ArgumentParser()
ap.add_argument('--desde', type=float, required=True)
ap.add_argument('--hasta', type=float, required=True)
ap.add_argument('--paso', type=float, default=0.5)
ap.add_argument('--detalle', nargs='*', default=[])
ap.add_argument('--umbral', type=int, default=12, help='brillo medio (0-255) por debajo del cual la orilla cuenta como negra')
a = ap.parse_args()

d = fc.seq()
W, H = d['settings']['width'], d['settings']['height']
r = d['settings']['frame_rate']
fps = r['num'] / r['den']
ts, t = [], a.desde
while t <= a.hasta:
    ts.append(round(t, 3))
    t += a.paso
for tramo in a.detalle:
    i, f = map(float, tramo.split('-'))
    ts += [round(x / fps, 3) for x in range(int(i * fps), int(f * fps) + 1)]
orillas = (('arriba', f'{W}:6:0:0'), ('abajo', f'{W}:6:0:{H - 6}'), ('izquierda', f'6:{H}:0:0'), ('derecha', f'6:{H}:{W - 6}:0'))
malos = []
with tempfile.TemporaryDirectory() as tmp:
    p = os.path.join(tmp, 'c.png')
    for t in sorted(set(ts)):
        fc.frame(t, p)
        for nombre, crop in orillas:
            v = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', f'crop={crop},scale=1:1', '-f', 'rawvideo',
                                '-pix_fmt', 'gray', '-'], capture_output=True).stdout[0]
            if v < a.umbral:
                malos.append((t, nombre))
print(f"{d['name']}: {len(set(ts))} cuadros revisados")
for t, n in malos:
    print(f'  borde negro {n} en {t:.2f} s')
sys.exit(1 if malos else 0)
