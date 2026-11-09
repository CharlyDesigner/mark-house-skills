# Edición de grabaciones largas (streams, podcasts, gameplays)

Para pasar una grabación de horas a un episodio con cientos de cortes, tramos acelerados, efectos de sonido,
memes/inserciones y subtítulos palabra por palabra, armado con un script (Python + ffmpeg) a partir de una lista de
piezas (EDL). Lecciones de un caso real: 2 h 12 min → 46 min, 248 piezas y 32 tramos acelerados.

## 1. El audio de los tramos acelerados no debe durar más que su lugar en la línea de tiempo

**Síntoma:** después de cada parte acelerada (x4, x6, x8) se oyen dos audios a la vez, durante segundos o minutos.

**Causa:** al sacar el audio de cada pieza con `atempo`, el `-t` quedó después de `-i`. Después de `-i`, `-t` limita
la **salida**; con `atempo` eso trae `vel ×` más audio del que toca. Una pieza x8 de 27.7 s traía 222 s de audio.

```bash
# MAL: -t limita la salida → 20 s de audio ya acelerado (= 80 s de la fuente)
ffmpeg -ss 10 -i fuente.mp4 -t 20 -vn -af "atempo=2.0,atempo=2.0" pieza.wav
# BIEN: -ss y -t antes de -i limitan la entrada → 5 s
ffmpeg -ss 10 -t 20 -i fuente.mp4 -vn -af "atempo=2.0,atempo=2.0" pieza.wav
```
(Probado con ffmpeg 9: 20.0 s contra 5.0 s.)

Reglas:
- Con cualquier filtro que cambie la duración (`atempo`, `setpts`, `rubberband`), `-ss` y `-t` van **antes** de `-i`.
- `atempo` acepta 0.5–2.0 por instancia: para x4 encadena `atempo=2.0,atempo=2.0`; para x6, `2.0,2.0,1.5`.
- Al mezclar en numpy, recorta cada pieza a su largo exacto: `x = x[:round((t1 - t0) * SR)]`.
- **Chequeo obligatorio**: decodifica cada pieza igual que el motor y compara su largo con el que ocupa en la línea de
  tiempo. Cualquier diferencia > 80 ms es un error.

## 2. Efectos de sonido que pisan la voz

Los archivos de transición y whoosh traen 1.5–2 s de subida antes del golpe. Si se alinean por el golpe, la subida
cae encima de la última frase del clip anterior: suena "bugueado" y tapa palabras.
- Limita la subida a ~0.25 s antes del golpe (recorta el principio del archivo con un fundido de 40 ms).
- Si en la ventana del efecto (−0.25 s … +1 s del golpe) hay voz, **no lo pongas**: se suelta y se avisa en el log.
- En el avance o cold open (los primeros segundos con lo mejor del episodio) no metas efectos de sonido: solo visuales.
- Revisa duplicados: una tarjeta que cuenta como "pieza con transición" y además como "tarjeta con sonido" suena dos veces.
- Los efectos de reacción o chiste sobre la voz pueden ser intencionales; los de transición nunca.

## 3. Subtítulos adelantados o atrasados

**Causa:** los tiempos por palabra salen de transcribir la grabación **original**. Después de recortar y compactar
pausas, y en frases con tiempos puestos a mano, quedan hasta 2.5 s antes o 1–2 s después de lo que se oye.

Qué funciona:
- Medir contra el **audio final** (lo que oye la gente), no contra la fuente: `scripts/verificar_subtitulos.py`.
- Whisper con ventana larga (±10 s) y contexto, **sin** dar el texto esperado como pista: con `initial_prompt` igual al
  subtítulo, Whisper a veces lo repite aunque no se diga, y el chequeo da falsos "todo bien".
- Ubicar la línea completa por parecido de letras, no palabra por palabra (palabras como "qué" o "dime" se repiten).
- Con música, juego o ruido encima, los tiempos de Whisper varían ±0.5–1 s entre pasadas: **corrige solo lo que salga
  desfasado en 2–3 mediciones** en la misma dirección y por más de 0.5 s. Lo inconsistente se deja como está.
- Después de corregir, vuelve a medir; si una corrección empeora, revierte.
- Nunca dos renglones encimados: cada renglón termina cuando empieza el siguiente.
- Si un texto escrito a mano (corrección de algo mal oído) se reparte en el tiempo, pon su inicio y fin en lo que
  mediste en el audio final, no en un cálculo.
- La alineación 100 % automática con Whisper sobre audio ruidoso **no es confiable**: mide, decide y corrige con datos.

## 4. Ver la línea de tiempo sin abrir el video

Para revisar cómo quedó armado, genera un plano HTML desde la lista de piezas: pistas de video (normal/acelerado/
inserción), audio con su largo real medido, efectos de sonido, subtítulos y alertas (audio más largo que la pieza,
efecto sobre voz, renglones encimados). Ese plano habría mostrado el error del punto 1 de inmediato.

¿Remotion? Para un stream de horas con cientos de cortes no conviene: renderiza cada cuadro en Chrome (horas de CPU a
1080p60) y no evita errores de ffmpeg como el del punto 1. Remotion sirve para piezas cortas de motion graphics con
React (`animacion-con-codigo`).

## 5. Fallas de ffmpeg al unir

En renders largos por trozos, el paso final (concat + quemar subtítulos con NVENC) a veces se cae con un error de
acceso a memoria (código 3221225477 en Windows) sin que haya nada mal en los archivos. No repitas todo el render:
relanza solo la unión con 2–3 reintentos.

## 6. Lista de revisión antes de entregar un episodio

1. Largo del audio = largo de la pieza en todas las piezas (0 diferencias).
2. Ningún efecto de transición o whoosh sobre voz; sin efectos en el avance.
3. Subtítulos medidos contra el audio final; corregidos solo los consistentes; ninguno encimado.
4. Loudness final −14 LUFS medido en 2 pasadas (`loudnorm` con `measured_*` y `linear=true`), pico ≤ −1.5 dBTP.
5. Escucha o transcribe el arranque, cada cambio de velocidad y el final.
6. Si solo cambió el audio (misma lista de piezas, misma duración), no re-renderices el video: rehaz el audio y
   pégalo con `-map 0:v -map 1:a -c:v copy`.
