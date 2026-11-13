#!/usr/bin/env python3
"""
Subtítulos estilo reel con karaoke en FilmCraft en vivo: bloques cortos que entran con rebote y la
palabra que se está diciendo se ilumina y crece. Requiere fc.py, mg.py y un palabras.json
(de transcribir.py, ya revisado a mano).

    python karaoke.py palabras.json --pista 2 [--offset 3.0] [--claves '{"OFERTA": "#7cff3a"}']
                      [--desde 0 --hasta 999] [--tam 52] [--max-palabras 4] [--max-letras 24]

--pista     índice de pista de video (0 = V1). Debe estar libre en ese tramo (si no, agrega una con sequence.addTracks).
--offset    segundo de la línea de tiempo donde empieza el audio transcrito (p. ej. 3.0 si hay intro de 3 s).
--claves    palabras (en MAYÚSCULAS, sin signos) que siempre van de color; JSON en texto o ruta a un .json.
Tamaño probado: 52 px Impact con contorno 6 en 1280x720 (≈ 7 % del alto); 70 px se ve demasiado grande.
"""
import argparse
import json
import os
import re

import fc
import mg

ap = argparse.ArgumentParser()
ap.add_argument('palabras')
ap.add_argument('--pista', type=int, required=True)
ap.add_argument('--offset', type=float, default=0.0)
ap.add_argument('--claves', default='{}')
ap.add_argument('--desde', type=float, default=0.0)
ap.add_argument('--hasta', type=float, default=1e9)
ap.add_argument('--tam', type=float, default=52)
ap.add_argument('--fuente', default='Impact')
ap.add_argument('--max-palabras', type=int, default=4)
ap.add_argument('--max-letras', type=int, default=24)
ap.add_argument('--activo', default='#ffd400', help='color de la palabra que se está diciendo')
a = ap.parse_args()

mg.init()
d = fc.seq()
W_, H_ = d['settings']['width'], d['settings']['height']
claves = json.load(open(a.claves, encoding='utf-8')) if os.path.exists(a.claves) else json.loads(a.claves)
W = [w for w in json.load(open(a.palabras, encoding='utf-8')) if a.desde <= w['s'] < a.hasta]
limpia = lambda s: re.sub(r'[^\wÁÉÍÓÚÜÑ]', '', s.upper())

# 1) Bloques: cortan por puntuación fuerte, pausa > 0.5 s, máximo de palabras o de letras
bloques, cur = [], []
for i, w in enumerate(W):
    cur.append(w)
    txt = ' '.join(x['w'] for x in cur)
    sig = W[i + 1] if i + 1 < len(W) else None
    if (sig is None or len(cur) >= a.max_palabras or len(txt) + 1 + len(sig['w']) > a.max_letras
            or re.search(r'[.!?…]$', w['w']) or sig['s'] - w['e'] > 0.5
            or (w['w'].endswith(',') and len(cur) >= 2)):
        bloques.append(cur)
        cur = []

fr = lambda seg: int(round((seg + a.offset) * mg.FPS))
tramos = []
for b in bloques:
    tramos.append([fr(b[0]['s'] - 0.05), fr(b[-1]['e'] + 0.35), b])
for k in range(len(tramos)):
    if k + 1 < len(tramos):
        tramos[k][1] = min(tramos[k][1], tramos[k + 1][0])
    tramos[k][1] = max(tramos[k][1], tramos[k][0] + 10)
    if k + 1 < len(tramos):
        tramos[k][1] = min(tramos[k][1], tramos[k + 1][0])

nombre_pista = f'V{a.pista + 1}'
if not mg.libre(nombre_pista, tramos[0][0], tramos[-1][1]):
    raise SystemExit(f'{nombre_pista} no está libre en ese tramo: agrega una pista con sequence.addTracks')

partes = 0
for f0, f1, b in tramos:
    toks = [x['w'].upper() for x in b]
    texto = ' '.join(toks)
    rng, p = [], 0
    for t in toks:
        s = texto.index(t, p)
        rng.append((s, s + len(t)))
        p = s + len(t)
    clip = fc.ex('graphics.newText', {'text': texto, 'position': [W_ / 2, round(H_ * 0.9)], 'size': a.tam, 'font': a.fuente,
                                      'seconds': (f1 - f0) / mg.FPS, 'track': a.pista, 'time': mg.F(f0)})['clip']
    mg.gset(clip, 0, {'align': 'center', 'fill_color': '#ffffff', 'stroke': True, 'stroke_width': 6, 'shadow': True})
    mg.gkeys(clip, 0, 'scale', [(f0, 55), (f0 + 3, 112), (f0 + 5, 100)])
    # 2) Cortar el gráfico en cada palabra (Razor duplica el gráfico con su texto y estilo)
    cortes, tok_ini = [mg.F(f0)], [0]
    for i in range(1, len(b)):
        t = mg.F(fr(b[i]['s']) - 1)
        if t >= cortes[-1] + 3 * mg.TF and t <= mg.F(f1) - 3 * mg.TF:
            fc.ex('timeline.razor', {'time': t, 'clip': clip})
            cortes.append(t)
            tok_ini.append(i)
    pista = fc.seq()['video'][a.pista]
    trozos = sorted([c for c in pista['items'] if mg.F(f0) <= c['start'] < mg.F(f1)], key=lambda c: c['start'])
    # 3) Estilo por trozo: claves siempre de color; palabra activa de color y más grande
    for j, tr in enumerate(trozos):
        i0 = tok_ini[j] if j < len(tok_ini) else tok_ini[-1]
        i1 = tok_ini[j + 1] if j + 1 < len(tok_ini) else len(toks)
        cid = tr['clip']
        fc.ex('graphics.setCharStyle', {'clip': cid, 'layer': 0, 'clear': True})
        for i, t in enumerate(toks):
            if limpia(t) in claves:
                fc.ex('graphics.setCharStyle', {'clip': cid, 'layer': 0, 'start': rng[i][0], 'end': rng[i][1],
                                                'style': {'color': claves[limpia(t)]}})
        col = claves.get(limpia(toks[i0]), a.activo)
        fc.ex('graphics.setCharStyle', {'clip': cid, 'layer': 0, 'start': rng[i0][0], 'end': rng[i1 - 1][1],
                                        'style': {'color': col, 'size': round(a.tam * 1.13)}})
        partes += 1
print(f'{len(tramos)} bloques, {partes} trozos en {nombre_pista}')
