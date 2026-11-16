#!/usr/bin/env python3
"""Convierte imágenes "estilo pixel art" generadas con IA en pixel art REAL:
una cuadrícula nativa pequeña, paleta limitada y bordes limpios.

- Varias entradas comparten UNA paleta (todos los cuadros de un personaje se ven iguales).
- Reducción por "moda": cada píxel nativo toma el color más frecuente de su bloque,
  así se conservan los contornos (un promedio los emborronaría).
- --chroma quita un fondo de color plano (por omisión magenta #FF00FF) y deja PNG con alfa.

Uso:
  # personaje (todos los cuadros juntos, fondo magenta)
  python3 pixelizar.py --ancho 212 --colores 40 --chroma ff00ff --salida kit/personaje idle.png saludo1.png saludo2.png
  # escenario vertical 9:16 a 360x640
  python3 pixelizar.py --ancho 360 --alto 640 --colores 56 --salida kit/escenarios oficina.png
Requiere: pip install pillow numpy
"""
import argparse, os
import numpy as np
from PIL import Image


def es_chroma(a, rgb, tol):
    d = np.abs(a.astype(int) - np.array(rgb)).max(-1)
    return d <= tol


def a_indices(a, pal):
    flat = a.reshape(-1, 3).astype(np.int32)
    out = np.empty(len(flat), np.int32)
    for s in range(0, len(flat), 200000):
        d = ((flat[s:s + 200000, None, :] - pal[None]) ** 2).sum(-1)
        out[s:s + 200000] = d.argmin(1)
    return out.reshape(a.shape[:2])


def reducir_por_moda(idx, ow, oh, n):
    H, W = idx.shape
    ys = np.linspace(0, H, oh + 1).astype(int)
    xs = np.linspace(0, W, ow + 1).astype(int)
    out = np.zeros((oh, ow), np.int32)
    for j in range(oh):
        banda = idx[ys[j]:ys[j + 1]]
        for i in range(ow):
            out[j, i] = np.bincount(banda[:, xs[i]:xs[i + 1]].ravel(), minlength=n).argmax()
    return out


def recortar_proporcion(a, ancho, alto):
    if not alto:
        return a
    H, W = a.shape[:2]
    objetivo = ancho / alto
    if W / H > objetivo:
        nw = round(H * objetivo); x = (W - nw) // 2; return a[:, x:x + nw]
    nh = round(W / objetivo); y = (H - nh) // 2; return a[y:y + nh]


def main():
    p = argparse.ArgumentParser()
    p.add_argument('entradas', nargs='+')
    p.add_argument('--ancho', type=int, required=True, help='ancho nativo en píxeles')
    p.add_argument('--alto', type=int, default=0, help='alto nativo (si se da, recorta al centro a esa proporción)')
    p.add_argument('--colores', type=int, default=40)
    p.add_argument('--chroma', default='', help='color de fondo a quitar, hex (ej. ff00ff)')
    p.add_argument('--tolerancia', type=int, default=85, help='distancia máx. al color chroma')
    p.add_argument('--salida', default='.')
    p.add_argument('--vista', type=int, default=3, help='también guarda una vista ampliada xN (0 = no)')
    a = p.parse_args()
    os.makedirs(a.salida, exist_ok=True)
    rgb = tuple(int(a.chroma[i:i + 2], 16) for i in (0, 2, 4)) if a.chroma else None

    imgs, mascaras = [], []
    for f in a.entradas:
        arr = np.asarray(Image.open(f).convert('RGB'))
        arr = recortar_proporcion(arr, a.ancho, a.alto)
        m = ~es_chroma(arr, rgb, a.tolerancia) if rgb else np.ones(arr.shape[:2], bool)
        imgs.append(arr); mascaras.append(m)

    muestras = np.concatenate([i[m] for i, m in zip(imgs, mascaras)])
    if len(muestras) > 2_000_000:
        muestras = muestras[np.random.default_rng(0).choice(len(muestras), 2_000_000, replace=False)]
    tira = Image.fromarray(muestras.reshape(1, -1, 3).astype(np.uint8))
    q = tira.quantize(colors=a.colores, method=Image.Quantize.MEDIANCUT, kmeans=3)
    pal = np.array(q.getpalette()[:a.colores * 3]).reshape(-1, 3)

    for f, arr, m in zip(a.entradas, imgs, mascaras):
        H, W = arr.shape[:2]
        oh = a.alto or round(H * a.ancho / W)
        idx = a_indices(arr, pal) + 1
        idx[~m] = 0
        chico = reducir_por_moda(idx, a.ancho, oh, len(pal) + 1)
        rgba = np.zeros((oh, a.ancho, 4), np.uint8)
        op = chico > 0
        rgba[op, :3] = pal[chico[op] - 1]; rgba[op, 3] = 255
        if rgb:  # restos del chroma en el borde (rosas/morados sueltos)
            r, g, b = (rgba[..., k].astype(int) for k in range(3))
            rgba[(r > 120) & (b > 110) & (g < r - 50) & (g < b - 40), 3] = 0
        im = Image.fromarray(rgba if rgb else rgba[..., :3])
        nombre = os.path.splitext(os.path.basename(f))[0]
        im.save(os.path.join(a.salida, nombre + '.png'))
        if a.vista:
            im.resize((im.width * a.vista, im.height * a.vista), Image.NEAREST).save(
                os.path.join(a.salida, f'{nombre}_x{a.vista}.png'))
        print(f'{f} -> {a.ancho}x{oh}')


if __name__ == '__main__':
    main()
