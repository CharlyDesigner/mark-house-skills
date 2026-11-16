#!/usr/bin/env python3
"""Escena pixel art + motion graphics a partir de un KIT reutilizable (kit.json).

Capa 1  escena nativa (ej. 360x640): fondo + sprite del personaje (parpadeo y bocas por código)
        -> cámara con zoom alineada a la cuadrícula -> salida (ej. 1080x1920) con NEAREST.
Capa 2  motion graphics en estilo pixel (globos, lower third) dibujados chicos y escalados xN.
Audio   blips chiptune sintetizados + la voz (si el guion trae "audio"); la boca sigue el volumen.

Uso:  python3 escena_pixel.py kit.json salida.mp4
Requiere: pillow, numpy, ffmpeg en el PATH. Ver ejemplo-kit.json.
"""
import json, math, os, random, subprocess, sys, tempfile, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont

KIT_PATH, OUT = sys.argv[1], sys.argv[2]
KIT = json.load(open(KIT_PATH, encoding='utf-8'))
BASE = os.path.dirname(os.path.abspath(KIT_PATH))
R = lambda p: os.path.join(BASE, p)

NW, NH = KIT.get('lienzo', [360, 640])
OW, OH = KIT.get('salida', [1080, 1920])
FPS = KIT.get('fps', 30)
SR = 44100
hexrgb = lambda h: tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
ACC = hexrgb(KIT.get('acento', '#9BE564'))
ACC2 = tuple(int(c * 0.78) for c in ACC)
INK = (18, 20, 28)
PAPER = (245, 244, 236)
UI = KIT.get('escala_ui', 6)
FONT = ImageFont.truetype(R(KIT['fuente']), 8)
rnd = random.Random(KIT.get('semilla', 7))

# ------------------------------------------------------------------ sprites
PJ = KIT['personaje']
def cargar(p): return np.asarray(Image.open(R(p)).convert('RGBA')).copy()

def gradear(a):
    g = PJ.get('grado', {})
    if not g: return a
    a = a.astype(float); al = a[..., 3] > 0
    rgb = a[..., :3] * g.get('oscurecer', 0.8) + np.array(g.get('tinte', [2, 4, 10]))
    if g.get('borde_luz', True):  # luz de borde del color de acento, lado derecho del espectador
        h, w = al.shape; edge = np.zeros_like(al)
        for d in (1, 2, 3):
            sh = np.zeros_like(al); sh[:, :-d] = al[:, d:]; edge |= al & ~sh
        edge[:, :w // 2] = False
        rgb[edge] = rgb[edge] * 0.45 + np.array(ACC) * 0.55
    return np.dstack([np.clip(rgb, 0, 255), a[..., 3]]).astype(np.uint8)

def cerrar_ojos(a):
    a = a.copy()
    for x0, y0, x1, y1 in PJ.get('ojos', []):
        piel = a[y0 - 1, (x0 + x1) // 2, :3].copy()
        linea = a[y0 - 4, x0 + 3, :3].copy()  # tono oscuro de la ceja/contorno
        a[y0:y1, x0:x1, :3] = piel
        a[(y0 + y1) // 2, x0 + 1:x1 - 1, :3] = linea
        a[(y0 + y1) // 2 + 1, x0 + 2:x1 - 2, :3] = (piel * 0.75).astype(np.uint8)
    return a

def boca(a, nivel):
    """nivel 0 = original, 1 = entreabierta, 2 = abierta (dibujada píxel a píxel)."""
    if nivel == 0 or 'boca' not in PJ: return a
    a = a.copy(); x0, y0, x1, y1 = PJ['boca']
    piel = a[y0 - 2, (x0 + x1) // 2, :3].astype(int)
    oscuro = np.array([40, 14, 18]); dentro = np.array([92, 30, 36]); dientes = np.array([236, 230, 222])
    cx = (x0 + x1) // 2
    if nivel == 1:
        hw = (x1 - x0) // 2 - 2
        a[y0 + 1:y0 + 4, cx - hw:cx + hw + 1, :3] = piel
        a[y0 + 1, cx - hw:cx + hw + 1, :3] = oscuro
        a[y0 + 2, cx - hw + 1:cx + hw, :3] = dentro
        a[y0 + 3, cx - hw + 2:cx + hw - 1, :3] = oscuro
    else:
        hw = (x1 - x0) // 2 - 3
        a[y0:y1 + 1, cx - hw:cx + hw + 1, :3] = piel
        a[y0, cx - hw + 1:cx + hw, :3] = oscuro
        for yy in range(y0 + 1, y1):
            a[yy, cx - hw:cx + hw + 1, :3] = oscuro
            a[yy, cx - hw + 1:cx + hw, :3] = dentro
        a[y0 + 1, cx - hw + 1:cx + hw, :3] = dientes
        a[y1, cx - hw + 1:cx + hw, :3] = oscuro
    return a

S = PJ['sprites']
idle = gradear(cargar(S['idle']))
SPR = {}
for nv in (0, 1, 2):
    SPR[('idle', nv, 0)] = Image.fromarray(boca(idle, nv))
    SPR[('idle', nv, 1)] = Image.fromarray(cerrar_ojos(boca(idle, nv)))
SAL = [gradear(cargar(p)) for p in S.get('saludo', [])]
for i, s in enumerate(SAL):
    SPR[('saludo', i, 0)] = Image.fromarray(s)
    SPR[('saludo', i, 1)] = Image.fromarray(cerrar_ojos(s))
SW, SH = SPR[('idle', 0, 0)].size
CX = (NW - SW) // 2 + PJ.get('dx', 0)
fondo = Image.open(R(KIT['fondo'])).convert('RGBA').resize((NW, NH), Image.NEAREST)

# ------------------------------------------------------------------ utilidades
def clamp(x, a=0., b=1.): return max(a, min(b, x))
def seg(t, a, b): return clamp((t - a) / (b - a)) if b > a else float(t >= a)
def out_back(t, s=1.9): t -= 1; return t * t * ((s + 1) * t + s) + 1
def in_out(t): return 0.5 - 0.5 * math.cos(math.pi * clamp(t))
def out3(t): t = clamp(t); return 1 - (1 - t) ** 3

def binarizar(im):
    a = np.asarray(im).copy(); a[..., 3] = np.where(a[..., 3] > 100, 255, 0); return Image.fromarray(a)

ACENTOS = {'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'}
def texto(d, xy, s, color):
    """Press Start 2P dibuja las mayúsculas acentuadas como minúscula: base + acento a mano."""
    x, y = xy; base = ''.join(ACENTOS.get(c, c) for c in s)
    d.text((x, y), base, font=FONT, fill=color + (255,))
    for i, c in enumerate(s):
        if c in ACENTOS:
            px = x + i * 8
            d.point([(px + 4, y - 2), (px + 5, y - 2), (px + 3, y - 1), (px + 4, y - 1)], fill=color + (255,))

def texto_img(s, color, escala, sombra=True):
    im = Image.new('RGBA', (len(s) * 8 + 2, 13), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if sombra: texto(d, (1, 4), s, INK)
    texto(d, (0, 3), s, color)
    im = binarizar(im); return im.resize((im.width * escala, im.height * escala), Image.NEAREST)

def globo(lineas, n):
    vis, quedan = [], n
    for l in lineas: vis.append(l[:max(0, quedan)]); quedan -= len(l)
    bw = max(len(l) for l in lineas) * 8 + 12; bh = len(lineas) * 11 + 10
    im = Image.new('RGBA', (bw, bh + 6), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle([1, 0, bw - 2, bh - 1], fill=INK + (255,)); d.rectangle([0, 1, bw - 1, bh - 2], fill=INK + (255,))
    d.rectangle([2, 1, bw - 3, bh - 2], fill=PAPER + (255,)); d.rectangle([1, 2, bw - 2, bh - 3], fill=PAPER + (255,))
    d.rectangle([2, bh - 3, bw - 3, bh - 2], fill=(205, 206, 200, 255))
    tx = bw // 2 - 2
    for i in range(5):
        d.line([tx + i, bh - 1 + i, tx + 4 - i // 2, bh - 1 + i], fill=INK + (255,))
        if i < 4: d.line([tx + i + 1, bh - 2 + i, tx + 3 - i // 2, bh - 2 + i], fill=PAPER + (255,))
    for i, l in enumerate(vis): texto(d, (6, 6 + i * 11), l, INK)
    im = binarizar(im); return im.resize((im.width * UI, im.height * UI), Image.NEAREST)

def glitch(arr, k, rg):
    out = arr.copy(); h = out.shape[0]
    for _ in range(int(6 + 18 * k)):
        y = rg.randrange(0, h - 8); hh = rg.choice([8, 12, 24, 36, 60])
        out[y:y + hh] = np.roll(out[y:y + hh], rg.choice([-1, 1]) * rg.randrange(12, 12 + int(180 * k)), axis=1)
    sh = int(6 + 24 * k)
    out[..., 0] = np.roll(out[..., 0], sh, axis=1); out[..., 2] = np.roll(out[..., 2], -sh, axis=1)
    for _ in range(int(4 * k)):
        y = rg.randrange(0, h - 40); x = rg.randrange(0, OW - 200)
        out[y:y + rg.choice([12, 24]), x:x + rg.randrange(60, 300)] = rg.choice([ACC, (250, 170, 60), (90, 140, 255), (240, 240, 240)])
    return out

def leer_audio(p):
    tmp = tempfile.NamedTemporaryFile(suffix='.wav', delete=False).name
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-nostdin', '-i', R(p), '-ac', '1', '-ar', str(SR), tmp], check=True)
    with wave.open(tmp) as w: x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
    os.remove(tmp); return x

# ------------------------------------------------------------------ línea de tiempo
T_POP, ev, globos, voz = 0.9, [], [], []
t = 0.9
for paso in KIT['guion']:
    tipo = paso['tipo']
    if tipo == 'entrada':
        T_POP = t; t += paso.get('dur', 0.8)
    elif tipo in ('saludo', 'habla', 'pausa'):
        dur = paso.get('dur', 1.5)
        if tipo == 'habla' and 'audio' in paso:
            x = leer_audio(paso['audio']); dur = len(x) / SR + 0.2; voz.append((t, x))
        ev.append((tipo, t, t + dur, paso))
        if 'globo' in paso: globos.append((paso['globo'], t + 0.15, t + dur - 0.1))
        t += dur
    elif tipo == 'titulo':
        ev.append(('titulo', t, None, paso)); t += paso.get('dur', 2.0)
DUR = t + 0.35
NF = int(DUR * FPS)
T_OUT = DUR - 0.35
TIT = next((e for e in ev if e[0] == 'titulo'), None)

# boca por volumen (RMS por cuadro, con histéresis de 2 cuadros)
NIV = np.zeros(NF, int)
for t0, x in voz:
    hop = SR // FPS
    rms = np.array([np.sqrt((x[i:i + hop] ** 2).mean() + 1e-12) for i in range(0, len(x), hop)])
    ref = np.percentile(rms, 95) or 1
    for k, v in enumerate(rms / ref):
        f = int(t0 * FPS) + k
        if f < NF: NIV[f] = 0 if v < 0.15 else (1 if v < 0.5 else 2)
for f in range(2, NF):  # evita parpadeo de boca de un solo cuadro
    if NIV[f - 1] != NIV[f - 2] and NIV[f] == NIV[f - 2]: NIV[f - 1] = NIV[f]
for nombre, a, b, p in ev:  # "habla" sin audio = vista previa con boca aleatoria
    if nombre == 'habla' and 'audio' not in p:
        for f in range(int(a * FPS), min(NF, int(b * FPS))):
            NIV[f] = NIV[f - 1] if f % 3 else rnd.choice([0, 1, 2, 2, 1])

PARPADEOS = []
tb = 1.4
while tb < DUR: PARPADEOS.append(tb); tb += rnd.uniform(2.4, 3.8)
CAM = KIT.get('camara', {'zoom': 1.3, 'centro_y': 0.72})

def escena(t, f):
    fr = fondo.copy()
    parpado = int(any(0 <= t - b < 0.1 for b in PARPADEOS))
    clave = ('idle', NIV[f], parpado)
    for nombre, a, b, p in ev:
        if nombre == 'saludo' and a <= t < b and SAL:
            clave = ('saludo', int((t - a) / 0.18) % len(SAL), parpado)
    if t >= T_POP:
        pr = seg(t, T_POP, T_POP + 0.45)
        yoff = int(round((1 - out_back(pr)) * (SH + 10))) if pr < 1 else 0
        bob = int((t - T_POP) / 0.55) % 2
        fr.alpha_composite(SPR[clave], (CX, NH - SH + PJ.get('dy', 4) + yoff + bob))
    return fr.convert('RGB')

def camara(img, t):
    p = in_out(seg(t, 0.2, 2.2))
    z = 1 + (CAM['zoom'] - 1) * p + 0.03 * in_out(seg(t, T_OUT - 2.5, T_OUT))
    cy = NH / 2 + (NH * CAM['centro_y'] - NH / 2) * p
    vw, vh = NW / z, NH / z
    x0 = clamp(NW / 2 - vw / 2, 0, NW - vw); y0 = clamp(cy - vh / 2, 0, NH - vh)
    x0 = min(round(x0), NW - vw); y0 = min(round(y0), NH - vh)  # alineado a la cuadrícula nativa
    return img.resize((OW, OH), Image.NEAREST, box=(x0, y0, x0 + vw, y0 + vh))

def encima(fr, t):
    for lineas, a, b in globos:
        if a <= t < b:
            g = globo(lineas, int((t - a) * 22))
            s = out_back(seg(t, a, a + 0.18))
            if s < 1: g = g.resize((max(1, int(g.width * max(.05, s))), max(1, int(g.height * max(.05, s)))), Image.NEAREST)
            fr.alpha_composite(g, ((OW - g.width) // 2 + 20, int(OH * KIT.get('globo_y', 0.4)) - g.height))
    if TIT and t >= TIT[1]:
        p = TIT[3]; t0 = TIT[1]
        ti = texto_img(p['texto'], INK, UI, sombra=False); sub = texto_img(p.get('sub', ''), (235, 235, 230), 4)
        bw = ti.width + 72; yb = int(OH * 0.81); d = ImageDraw.Draw(fr)
        x = int(-bw + (bw + 60) * out3(seg(t, t0, t0 + 0.4)))
        d.rectangle([x, yb, x + bw, yb + 96], fill=ACC + (255,))
        d.rectangle([x + bw - 12, yb + 12, x + bw, yb + 96], fill=ACC2 + (255,))
        d.rectangle([x, yb + 84, x + bw, yb + 96], fill=ACC2 + (255,))
        fr.alpha_composite(ti, (x + 36, yb + 20))
        if p.get('sub'):
            p2 = out3(seg(t, t0 + 0.2, t0 + 0.6)); x2 = int(-bw + (bw + 60) * p2)
            d.rectangle([x2, yb + 110, x2 + sub.width + 48, yb + 170], fill=INK + (235,))
            fr.alpha_composite(sub, (x2 + 24, yb + 122))
            if p2 >= 1 and int(t * 3) % 2 == 0:
                d.rectangle([x2 + sub.width + 30, yb + 126, x2 + sub.width + 42, yb + 154], fill=ACC + (255,))
    return fr

# ------------------------------------------------------------------ audio
def mezcla():
    buf = np.zeros(int(SR * DUR) + SR)
    def sq(fq, d, v=.16, sl=0):
        n = int(SR * d); tt = np.arange(n) / SR
        w = np.sign(np.sin(2 * np.pi * np.cumsum(fq + sl * tt / d) / SR)) * v
        return w * np.minimum(1, (n - np.arange(n)) / (n * .6))
    def ruido(d, v=.1):
        n = int(SR * d); return (np.random.rand(n) * 2 - 1) * v * np.linspace(1, 0, n)
    def put(tm, s): i = int(tm * SR); buf[i:i + len(s)] += s[:len(buf) - i]
    put(0, ruido(.45)); put(T_POP, sq(220, .18, sl=520)); put(T_OUT, ruido(.35))
    for lineas, a, b in globos:
        for k, c in enumerate(''.join(lineas)):
            if c != ' ': put(a + k / 22, sq(rnd.choice([880, 988, 1046]), .035, .06 if voz else .07))
    if TIT: put(TIT[1], sq(523, .08, .13)); put(TIT[1] + .08, sq(784, .12, .13))
    for t0, x in voz: put(t0, x * 0.95)
    buf = np.clip(buf[:int(SR * DUR)], -1, 1)
    p = tempfile.NamedTemporaryFile(suffix='.wav', delete=False).name
    with wave.open(p, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf * 32000).astype(np.int16).tobytes())
    return p

def main():
    wav = mezcla()
    pr = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{OW}x{OH}',
                           '-r', str(FPS), '-i', '-', '-i', wav, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16',
                           '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT],
                          stdin=subprocess.PIPE)
    rg = random.Random(3)
    for f in range(NF):
        t = f / FPS
        fr = encima(camara(escena(t, f), t).convert('RGBA'), t)
        arr = np.asarray(fr.convert('RGB')).copy()
        g = (1 - t / .45) if t < .45 else (seg(t, T_OUT, DUR) if t >= T_OUT else 0)
        if g > 0: arr = glitch(arr, g, rg)
        if t >= DUR - .12: arr[:] = 0
        pr.stdin.write(arr.tobytes())
    pr.stdin.close(); pr.wait(); os.remove(wav)
    print(f'{OUT}: {DUR:.2f} s, {NF} cuadros')

def revisar():
    """Hoja ampliada con idle, parpadeo y las 3 bocas: revísala ANTES de renderizar
    (si ojos/boca en kit.json están corridos, se nota aquí)."""
    vs = [SPR[('idle', 0, 0)], SPR[('idle', 0, 1)], SPR[('idle', 1, 0)], SPR[('idle', 2, 0)]] + \
         [SPR[('saludo', i, 0)] for i in range(len(SAL))]
    xs = [b[0] for b in PJ.get('ojos', [])] + [PJ['boca'][0]] if 'boca' in PJ else [0]
    x0 = max(0, min(xs) - 20); x1 = min(SW, x0 + 90); y0 = max(0, PJ.get('ojos', [[0, 40]])[0][1] - 25); y1 = min(SH, y0 + 75)
    hoja = Image.new('RGBA', ((x1 - x0) * len(vs), y1 - y0), (40, 40, 40, 255))
    for i, v in enumerate(vs): hoja.alpha_composite(v.crop((x0, y0, x1, y1)), ((x1 - x0) * i, 0))
    hoja.resize((hoja.width * 5, hoja.height * 5), Image.NEAREST).save(OUT)
    print('hoja de revisión:', OUT)

revisar() if '--revisar' in sys.argv else main()
