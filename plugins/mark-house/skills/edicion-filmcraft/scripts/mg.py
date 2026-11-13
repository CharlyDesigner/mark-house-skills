#!/usr/bin/env python3
"""
Utilidades de animación (motion graphics) para FilmCraft en vivo. Requiere fc.py.

    import fc, mg
    mg.init()                                   # lee los fps de la secuencia activa
    c = mg.place(item, 'V5', 72, 1300)           # coloca un clip (cuadros) SIN pisar: falla si la pista está ocupada
    mg.mkeys(c, 'scale', [(72, 0), (77, 8), (80, 6.5)])   # keyframes de Motion (clips de imagen/video)
    t = fc.ex('graphics.newText', {...})['clip']
    mg.pop(t, 0, 100)                            # entrada con rebote de una capa de gráfico

Tiempos SIEMPRE en cuadros de la secuencia. Los keyframes de capas de gráficos (gset/gkeys) y de
efectos (mkeys) usan tiempo de la línea de tiempo.
"""
import math

import fc

FPS = 24
TF = fc.T // FPS


def init():
    """Ajusta FPS/TF a la secuencia activa."""
    global FPS, TF
    r = fc.seq()['settings']['frame_rate']
    FPS = r['num'] / r['den']
    TF = int(round(fc.T / FPS))
    return FPS


def F(f):
    return int(round(f * TF))


def gset(clip, layer, props, f=None, kf=False):
    """Propiedades de una capa de gráfico (texto o forma). Con kf=True crea keyframe en el cuadro f."""
    p = {'clip': clip, 'layer': layer, 'props': props}
    if f is not None:
        p['time'] = F(f)
    if kf:
        p['keyframe'] = True
    return fc.ex('graphics.set', p)


def gkeys(clip, layer, prop, keys):
    for f, v in keys:
        gset(clip, layer, {prop: v}, f, True)


def mset(clip, param, v, effect='motion'):
    fc.ex('effects.setParam', {'clip': clip, 'effect': effect, 'param': param, 'value': v})


def mkeys(clip, param, keys, effect='motion'):
    """Keyframes de un efecto del clip (motion: scale/position/rotation/anchor; opacity: opacity; volume: level en dB)."""
    for f, v in keys:
        fc.ex('effects.setParam', {'clip': clip, 'effect': effect, 'param': param, 'value': v, 'time': F(f), 'keyframe': True})


def star(cx, cy, r1, r2, n, rot=0.0):
    """Puntos de una estrella/estallido (forma 'path'). OJO: los puntos son RELATIVOS a la posición de la forma: usa cx=cy=0."""
    pts = []
    for i in range(2 * n):
        r = r1 if i % 2 == 0 else r2
        a = rot + math.pi * i / n
        pts.append([round(cx + r * math.cos(a), 1), round(cy + r * math.sin(a), 1)])
    return pts


def pop(clip, layer, f0, s=100, over=118):
    """Entrada con rebote: 0 → over → 95 % → s en 9 cuadros."""
    gkeys(clip, layer, 'scale', [(f0, 0), (f0 + 4, over), (f0 + 7, s * 0.95), (f0 + 9, s)])


def libre(track_name, f0, f1):
    """True si la pista (p. ej. 'V5') no tiene clips entre los cuadros f0 y f1."""
    d = fc.seq()
    for t in d['video'] + d['audio']:
        if t['name'].replace('Video ', 'V').replace('Audio ', 'A') == track_name:
            return all(c['start'] + c['duration'] <= F(f0) or c['start'] >= F(f1) for c in t['items'])
    return True  # la pista no existe todavía


def place(item, track, f, dur, audio_track=None, src=0, pisar=False):
    """timeline.place con insert:false SOBRESCRIBE lo que haya. Por eso se revisa antes que el tramo esté libre."""
    if not pisar and not libre(track, f, f + dur):
        raise RuntimeError(f'{track} ocupada entre {f} y {f + dur}: usa otra pista (sequence.addTracks) o pisar=True')
    p = {'item': item, 'track': track, 'frame': f, 'insert': False, 'sourceIn': {'frame': src}, 'duration': {'frame': dur}}
    if audio_track:
        p['audioTrack'] = audio_track
    return fc.ex('timeline.place', p)['clips'][0]
