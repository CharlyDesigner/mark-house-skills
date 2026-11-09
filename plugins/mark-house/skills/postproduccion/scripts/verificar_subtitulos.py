#!/usr/bin/env python3
"""Verifica que cada subtítulo aparezca cuando de verdad se dice, comparándolo contra el AUDIO FINAL del video.

Transcribe con faster-whisper una ventana larga (±10 s, con contexto y SIN darle el texto como pista, porque con la
pista Whisper a veces lo repite aunque no se diga), ubica la línea por parecido de letras y reporta:
  Δ = aparece − se dice   (+ = el subtítulo llega tarde, − = llega antes)
No mueve nada: solo mide. En audio con música o juego encima, los tiempos de Whisper varían ±0.5–1 s entre pasadas;
corrige solo lo que salga desfasado en 2–3 mediciones seguidas.

Uso:
  python verificar_subtitulos.py subs.srt|subs.ass video_o_audio [--desde 12:30] [--hasta 15:00]
                                 [--ventana 10] [--umbral 0.5] [--modelo large-v3] [--reporte r.json]
Requiere: ffmpeg y `pip install faster-whisper` (GPU NVIDIA opcional; sin GPU usa CPU, más lento).
"""
import argparse, difflib, json, os, re, site, subprocess, sys, unicodedata

for sp in site.getsitepackages() + [site.getusersitepackages()]:      # DLLs de CUDA instaladas con pip (Windows)
    for lib in ("cublas", "cudnn"):
        d = os.path.join(sp, "nvidia", lib, "bin")
        if os.path.isdir(d) and hasattr(os, "add_dll_directory"):
            os.add_dll_directory(d); os.environ["PATH"] = d + os.pathsep + os.environ.get("PATH", "")

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("subs"); ap.add_argument("medio")
ap.add_argument("--desde", default="0:00"); ap.add_argument("--hasta", default=None)
ap.add_argument("--ventana", type=float, default=10.0); ap.add_argument("--umbral", type=float, default=0.5)
ap.add_argument("--modelo", default="large-v3"); ap.add_argument("--reporte", default=None)
A = ap.parse_args()

def seg(t):
    p = [float(x) for x in t.replace(",", ".").split(":")]
    return sum(v * 60 ** i for i, v in enumerate(reversed(p)))
def mmss(t): return f"{int(t // 60)}:{t % 60:05.2f}"
def norm(w): return "".join(c for c in unicodedata.normalize("NFD", w.lower()) if c.isalnum() and unicodedata.category(c) != "Mn")

# ---------- leer subtítulos (SRT o ASS; en ASS karaoke junta los eventos que muestran la misma línea)
texto = open(A.subs, encoding="utf-8-sig").read()
lineas = []
if A.subs.lower().endswith(".srt"):
    for b in re.split(r"\n\s*\n", texto.strip()):
        m = re.search(r"(\d+:\d+:\d+[,.]\d+)\s*-->\s*(\d+:\d+:\d+[,.]\d+)\s*\n(.+)", b, re.S)
        if m: lineas.append([seg(m.group(1)), seg(m.group(2)), " ".join(m.group(3).split())])
else:
    for l in texto.splitlines():
        if not l.startswith("Dialogue:"): continue
        p = l.split(",", 9)
        t = re.sub(r"\{[^}]*\}", "", p[9]).replace("\\N", " ").replace("\\n", " ").strip()
        if not t: continue
        if lineas and lineas[-1][2] == t and seg(p[1]) - lineas[-1][1] < 0.5: lineas[-1][1] = seg(p[2])
        else: lineas.append([seg(p[1]), seg(p[2]), t])
d0 = seg(A.desde); d1 = seg(A.hasta) if A.hasta else 1e9
lineas = [l for l in sorted(lineas) if d0 <= l[0] <= d1]
if not lineas: sys.exit("No hay subtítulos en ese rango.")

# ---------- audio a 16 kHz mono
import numpy as np
from faster_whisper import WhisperModel
r = subprocess.run(["ffmpeg", "-v", "error", "-i", A.medio, "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True)
x = np.frombuffer(r.stdout, np.float32); SR = 16000
if not len(x): sys.exit("No se pudo leer audio de " + A.medio)
try: modelo = WhisperModel(A.modelo, device="cuda", compute_type="float16")
except Exception: modelo = WhisperModel(A.modelo, device="cpu", compute_type="int8")

res = []
for ini, fin, txt in lineas:
    a = max(0.0, ini - A.ventana); b = min(len(x) / SR, fin + A.ventana)
    segs, _ = modelo.transcribe(x[int(a * SR):int(b * SR)], language="es", word_timestamps=True, vad_filter=False, beam_size=5)
    W = [(a + q.start, a + q.end, q.word.strip()) for s in segs for q in (s.words or [])]
    objetivo = " ".join(norm(w) for w in txt.split()); n0 = len(txt.split()); mejor = None
    for i in range(len(W)):
        for n in range(max(1, n0 - 2), n0 + 3):
            if i + n > len(W): break
            sc = difflib.SequenceMatcher(None, objetivo, " ".join(norm(w[2]) for w in W[i:i + n])).ratio()
            sc -= 0.01 * abs(W[i][0] - ini)                       # a igual parecido, la más cercana
            if mejor is None or sc > mejor[0]: mejor = (sc, i, n)
    item = {"aparece": round(ini, 2), "texto": txt}
    if mejor and mejor[0] >= 0.6:
        sc, i, n = mejor
        item.update(se_dice=round(W[i][0], 2), delta=round(ini - W[i][0], 2), parecido=round(sc, 2),
                    oido=" ".join(w[2] for w in W[i:i + n]))
    else:
        item.update(delta=None, parecido=round(mejor[0], 2) if mejor else 0.0, oido="(no se ubicó)")
    res.append(item)
    marca = "  " if item["delta"] is not None and abs(item["delta"]) <= A.umbral else "!!"
    print(f"{marca} {mmss(ini)}  Δ={'—' if item['delta'] is None else format(item['delta'], '+.2f')}  "
          f"{txt[:48]:<48} | {item['oido'][:50]}")
mal = [q for q in res if q["delta"] is None or abs(q["delta"]) > A.umbral]
print(f"\n{len(res)} líneas · {len(mal)} fuera de ±{A.umbral} s o no ubicadas (revísalas; repite la medición antes de mover).")
if A.reporte: json.dump(res, open(A.reporte, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
