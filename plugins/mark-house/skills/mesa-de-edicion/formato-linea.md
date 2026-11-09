# Formato de la línea de tiempo (`*.linea.json`)

Un solo archivo JSON describe la edición. Lo genera el motor de cada proyecto (un exportador pequeño) o se escribe a
mano. Los tiempos van en **segundos del video final**; las rutas pueden ser relativas al propio `.linea.json` o absolutas.

```json
{
  "nombre": "episodio 2",
  "fps": 60,
  "duracion": 2752.6,
  "render": "salida/episodio2.mp4",
  "audio_final": "salida/mezcla.wav",
  "voz": [[12.4, 15.9], [17.0, 21.3]],
  "pistas": [
    {"id": "cap", "tipo": "marcadores", "nombre": "Capítulos", "clips": [{"inicio": 0, "texto": "Intro"}]},
    {"id": "v1", "tipo": "video", "nombre": "Video", "clips": [
      {"inicio": 0, "fin": 12.5, "fuente": "crudo/stream.mp4", "entrada": 513.0, "salida": 525.5, "etiqueta": "llegada"},
      {"inicio": 12.5, "fin": 22.5, "fuente": "crudo/stream.mp4", "entrada": 600, "salida": 640, "vel": 4},
      {"inicio": 22.5, "fin": 25.2, "fuente": "memes/aplausos.mp4", "entrada": 0.3, "salida": 3.0, "clase": "inserto"},
      {"inicio": 25.2, "fin": 30.2, "clase": "tarjeta", "etiqueta": "título"}]},
    {"id": "a1", "tipo": "audio", "nombre": "Audio", "clips": [
      {"inicio": 12.5, "fin": 22.5, "fuente": "crudo/stream.mp4", "entrada": 600, "salida": 640, "vel": 4, "ganancia": 0.55,
       "duracion_audio": 10.0}]},
    {"id": "fx", "tipo": "efectos", "nombre": "Efectos", "clips": [
      {"inicio": 12.25, "fin": 13.45, "nombre": "whoosh", "categoria": "transicion"}]},
    {"id": "sub", "tipo": "subtitulos", "nombre": "Subtítulos", "clips": [
      {"inicio": 13.1, "fin": 14.0, "texto": "¡NO MAMES!", "desfase": 0.1}]}
  ]
}
```

| Campo | Para qué |
|---|---|
| `render` | Video final: alimenta el reproductor, las miniaturas y la forma de onda. Sin él, la línea se ve pero no se reproduce. |
| `audio_final` | Opcional: otra fuente para la forma de onda (si no, se usa la del `render`). |
| `voz` | Opcional: tramos `[inicio, fin]` con voz en el video final. Activa el aviso "efecto sobre la voz". |
| `pistas[].tipo` | `video`, `audio`, `efectos`, `subtitulos`, `marcadores` o `texto`. |
| `pistas[].principal` | En una pista de video, `false` desactiva el aviso de huecos (capas secundarias). |
| `clips[].inicio/fin` | Lugar del clip en el video final. |
| `clips[].fuente/entrada/salida` | Archivo de origen y tramo usado (segundos de la fuente). |
| `clips[].vel` | Velocidad (4 = x4). Con `vel`, el tramo de fuente dura `(fin − inicio) × vel`. |
| `clips[].duracion_audio` | Largo REAL del audio de ese clip tal como lo arma tu motor. Si no viene, la mesa lo mide (decodificando bien). |
| `clips[].clase` | En video: `inserto` (meme, b-roll) o `tarjeta` (título, cierre); cambia el color. |
| `clips[].categoria` | En efectos: `transicion` (transición/whoosh: no debe pisar la voz) u otro valor (reacción, chiste: puede ir sobre la voz). |
| `clips[].texto/etiqueta` | Lo que se muestra sobre el clip. |
| `clips[].desfase` | En subtítulos: desfase medido contra el audio (`+` tarde, `−` antes); > 0.5 s se marca. |
| `clips[].color` | Opcional, para forzar un color. |

## Problemas que detecta

| Tipo | Severidad | Regla |
|---|---|---|
| `audio-largo` | error | El audio del clip dura más que su lugar (+80 ms): se encima sobre lo que sigue. |
| `audio-corto` | aviso | El audio dura menos que su lugar: queda silencio. |
| `encimado` | error (video/audio) · aviso (subtítulos) | Dos clips de la misma pista se pisan. |
| `hueco` | aviso | Tramo sin video en la pista principal. |
| `efecto-sobre-voz` | aviso | Un efecto `transicion` coincide con un tramo de `voz`. |
| `subtitulo-fugaz` | aviso | Subtítulo de menos de 0.15 s. |
| `subtitulo-desfasado` | aviso | `desfase` medido > 0.5 s. |
| `clip-invalido` | error | `fin ≤ inicio`. |
| `duracion` | aviso | El render y la línea de tiempo no duran lo mismo (±0.5 s). |

## Escribir un exportador para tu motor
Recorre tu lista de piezas y escribe un clip por pieza en `video` y otro en `audio` con sus tiempos de salida.
Para `duracion_audio`, decodifica el audio de la pieza **con la misma función que usa tu mezcla** (sin recortar):
así, si tu motor trae audio de más, la mesa lo verá. Los efectos van con su inicio real (incluida la subida antes
del golpe) y los subtítulos por renglón visible.
