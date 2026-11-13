#!/usr/bin/env python3
"""
Transcribe un audio con faster-whisper y guarda las palabras con sus tiempos (para subtítulos).

    python transcribir.py voz.wav palabras.json [--modelo small] [--idioma es]

Salida: [{"w": "¡Hoy", "s": 0.53, "e": 0.98, "p": 0.91}, ...]  (segundos, probabilidad)
Revisa a mano las palabras con p < 0.6: nombres propios y marcas casi siempre salen mal.
Arma el audio de voz con los MISMOS cortes de la edición (ffmpeg concat) para que los tiempos ya
coincidan con la línea de tiempo; si el modelo ya está en caché, usa HF_HUB_OFFLINE=1.
"""
import argparse
import json

from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument('audio')
ap.add_argument('salida')
ap.add_argument('--modelo', default='small')
ap.add_argument('--idioma', default='es')
a = ap.parse_args()

m = WhisperModel(a.modelo, device='cpu', compute_type='int8')
segs, _ = m.transcribe(a.audio, language=a.idioma, word_timestamps=True, vad_filter=True)
W = []
for s in segs:
    print(f'{s.start:7.2f}-{s.end:7.2f} {s.text}')
    for w in s.words:
        W.append({'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3), 'p': round(w.probability, 2)})
with open(a.salida, 'w', encoding='utf-8') as f:
    json.dump(W, f, ensure_ascii=False)
dudosas = [w['w'] for w in W if w['p'] < 0.6]
print(f'{len(W)} palabras; revisar: {", ".join(dudosas) if dudosas else "ninguna"}')
