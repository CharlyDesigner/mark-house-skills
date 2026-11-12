#!/usr/bin/env python3
"""
Quita el fondo liso (blanco u otro color) de un logo y, opcionalmente, le pone un borde "sticker".

  python3 quitar_fondo_logo.py ENTRADA.png SALIDA.png [--tolerancia 40] [--borde 7] [--color-borde FFF8EE]

Rellena desde las esquinas (flood-fill), así NO borra el blanco interno del logo.
--borde N  agrega un contorno de N px (útil para que un logo rojo no se pierda sobre fondo rojo).
Recorta al contenido. Requiere Pillow y numpy.
"""
import argparse
from PIL import Image, ImageDraw, ImageFilter
import numpy as np


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("salida")
    ap.add_argument("--tolerancia", type=int, default=40)
    ap.add_argument("--borde", type=int, default=0)
    ap.add_argument("--color-borde", default="FFF8EE")
    a = ap.parse_args()

    img = Image.open(a.entrada).convert("RGBA")
    w, h = img.size
    fondo = img.getpixel((0, 0))[:3]
    pad = Image.new("RGB", (w + 2, h + 2), fondo)            # marco para que el relleno llegue por todos lados
    pad.paste(img.convert("RGB"), (1, 1))
    ImageDraw.floodfill(pad, (0, 0), (255, 0, 255), thresh=a.tolerancia)
    m = np.array(pad)[1:-1, 1:-1]
    es_fondo = (m[..., 0] == 255) & (m[..., 1] == 0) & (m[..., 2] == 255)
    arr = np.array(img)
    arr[..., 3] = np.where(es_fondo, 0, arr[..., 3])
    out = Image.fromarray(arr)
    out.putalpha(out.split()[3].filter(ImageFilter.GaussianBlur(1.2)))   # borde suave
    out = out.crop(out.getbbox())
    if a.borde:
        p = a.borde + 2
        can = Image.new("RGBA", (out.width + 2 * p, out.height + 2 * p), (0, 0, 0, 0))
        can.alpha_composite(out, (p, p))
        alfa = can.split()[3].filter(ImageFilter.MaxFilter(a.borde * 2 + 1)).filter(ImageFilter.GaussianBlur(1))
        c = tuple(int(a.color_borde[i:i + 2], 16) for i in (0, 2, 4))
        borde = Image.new("RGBA", can.size, c + (0,))
        borde.putalpha(alfa)
        borde.alpha_composite(can)
        out = borde
    out.save(a.salida)
    print(f"{a.salida}: {out.size[0]}x{out.size[1]}")


if __name__ == "__main__":
    main()
