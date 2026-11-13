#!/usr/bin/env python3
"""
Reencuadre con "cámara" para pasar un video horizontal a vertical (o cualquier otro formato) a pantalla
completa en FilmCraft en vivo: cada toma llena el cuadro, la cámara panea hacia el punto de interés
(quien habla, el producto), se acerca despacio y da golpes de zoom. Requiere fc.py y mg.py.

    python reencuadre.py plan.json --secuencia 262 [--ancho-fuente 1280 --alto-fuente 720]
                         [--empuje 17] [--margen 14]

plan.json (tiempos en cuadros de la LÍNEA DE TIEMPO; x/y en píxeles de la toma ORIGINAL):
{
  "fy": 330,                                  // altura de las caras (opcional)
  "tomas": {
    "42": {"foco": [[172, 730], [229, 730], [237, 340], [322, 340]],   // paneo a quien va a hablar
           "golpe": 235},                     // zoom de golpe a mitad de toma (opcional)
    "72": {"foco": [[1022, 600]], "golpe_entrada": true}               // entra con golpe (opcional)
  }
}
Reglas que aprendimos:
- La secuencia se verifica antes de tocar nada: si no es la indicada, el script se detiene
  (un script que corre sobre la secuencia equivocada puede borrarle clips a otra versión).
- Los keyframes viejos se quitan con effects.toggleAnimation. effects.resetParam NO los borra:
  agrega un keyframe al valor por omisión donde esté el cabezal.
- Se pone keyframe de posición en cada cambio de escala; si no, durante un golpe de zoom
  la imagen se despega del borde y aparece una franja negra.
- Sin effects.setInterpolation en lote: en tomas con sourceIn distinto de 0 creó keyframes de más.
Después corre bordes.py para comprobar que no quedó ningún borde negro.
"""
import argparse
import json
import math

import fc
import mg

ap = argparse.ArgumentParser()
ap.add_argument('plan')
ap.add_argument('--secuencia', type=int, required=True, help='id del item de la secuencia a reencuadrar')
ap.add_argument('--ancho-fuente', type=float, default=1280)
ap.add_argument('--alto-fuente', type=float, default=720)
ap.add_argument('--empuje', type=float, default=17, help='% extra de acercamiento lento a lo largo de cada toma')
ap.add_argument('--margen', type=float, default=14, help='px de la toma original que se dejan de colchón en los bordes')
a = ap.parse_args()
plan = json.load(open(a.plan, encoding='utf-8'))

fc.ex('sequence.open', {'item': a.secuencia})
d = fc.seq()
if d['id'] != a.secuencia:
    raise SystemExit(f"La secuencia activa es {d['id']} ({d['name']}), no {a.secuencia}: no toco nada")
mg.init()
W, H = d['settings']['width'], d['settings']['height']
sw, sh = a.ancho_fuente, a.alto_fuente
BASE = math.ceil(max(W / sw, H / sh) * 103)          # escala mínima que llena el cuadro + 3 %
FY = plan.get('fy', sh / 2)
clips = {c['clip']: c for t in d['video'] for c in t['items']}

for sid, cfg in plan['tomas'].items():
    c = clips[int(sid)]
    st, end = round(c['start'] / mg.TF), round((c['start'] + c['duration']) / mg.TF)
    dur = end - st
    mp = [e for e in c['effects'] if e['effect'] == 'motion'][0]['params']
    for prm in ('scale', 'position'):
        if mp[prm]['keyframes'] > 0:
            fc.ex('effects.toggleAnimation', {'clip': c['clip'], 'effect': 'motion', 'param': prm})
    sk = [(st, BASE), (end, BASE + a.empuje)]
    if cfg.get('golpe'):
        f = cfg['golpe']
        b = BASE + a.empuje * (f - st) / dur
        sk = [(st, BASE), (f, b), (f + 3, b + 55), (f + 9, b + 30), (end, b + 40)]
    if cfg.get('golpe_entrada'):
        sk = [(st, BASE + 65), (st + 6, BASE + 2), (end, BASE + a.empuje)]
    sk = [(f, s) for f, s in sk if st <= f <= end]
    mg.mkeys(c['clip'], 'scale', sk)

    def S_at(t):
        for (f0, s0), (f1, s1) in zip(sk, sk[1:]):
            if f0 <= t <= f1:
                return s0 + (s1 - s0) * (t - f0) / max(1, f1 - f0)
        return sk[-1][1]

    foco = [(min(max(t, st), end), x) for t, x in cfg['foco']]

    def FX(t):
        for (t0, x0), (t1, x1) in zip(foco, foco[1:]):
            if t0 <= t <= t1:
                return x0 + (x1 - x0) * (t - t0) / max(1, t1 - t0)
        return foco[-1][1] if t > foco[-1][0] else foco[0][1]

    keys = []
    for t in sorted(set([t for t, _ in foco] + [f for f, _ in sk])):
        k = S_at(t) / 100
        hx, hy = W / 2 / k + a.margen, H / 2 / k + a.margen
        fx = min(max(FX(t), hx), sw - hx)
        fy = min(max(FY, hy), sh - hy)
        keys.append((t, [round(W / 2 + (sw / 2 - fx) * k, 1), round(H / 2 + (sh / 2 - fy) * k, 1)]))
    mg.mkeys(c['clip'], 'position', keys)
print(f"{len(plan['tomas'])} tomas reencuadradas en {d['name']} ({W}x{H}), escala base {BASE} %")
