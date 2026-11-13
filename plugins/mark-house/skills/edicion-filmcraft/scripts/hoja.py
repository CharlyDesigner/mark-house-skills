#!/usr/bin/env python3
"""
Hoja de contacto desde FilmCraft en vivo: exporta los cuadros del Program en los segundos pedidos
y los une en una cuadrícula de 3 columnas (requiere ffmpeg).

    python hoja.py salida.jpg 0.5 3.2 10 25.4 40 58
"""
import os
import subprocess
import sys
import tempfile

import fc

if len(sys.argv) < 3:
    sys.exit(__doc__)
salida = os.path.abspath(sys.argv[1])
tiempos = [float(x) for x in sys.argv[2:]]
with tempfile.TemporaryDirectory() as tmp:
    for i, t in enumerate(tiempos):
        fc.frame(t, os.path.join(tmp, f'f{i:02d}.png'))
    filas = (len(tiempos) + 2) // 3
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-framerate', '1', '-start_number', '0', '-i', os.path.join(tmp, 'f%02d.png'),
                    '-frames:v', '1', '-vf', f'scale=640:-2,tile=3x{filas}', salida], check=True)
print(salida)
