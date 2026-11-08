---
name: guion-y-storyboard
description: 'Convierte una idea en historia filmable - premisa, estructura y beat sheet, guion en formato de cine, lista de tomas con duración, storyboard (descrito, generado o dibujado) y animatic con tiempos y audio guía. Sirve para cortos, comerciales, reels/TikTok, videoclips, cinemáticas de juego y explicativos. Úsalo cuando pidan "guion", "storyboard", "lista de tomas", "shot list", "escaleta", "animatic", "cuéntame la historia", "hook para un reel".'
argument-hint: "[idea, duración y plataforma]"
---

# Guion y storyboard

## 1. Estructura según la duración
- **6–15 s (anuncio, story)**: gancho visual (0–1 s) → una idea → marca/llamado.
- **15–60 s (reel, TikTok, comercial)**: gancho en el primer segundo (movimiento, pregunta, contradicción) → tensión → giro/revelación → cierre con llamado a la acción. Corte cada 1–3 s.
- **1–5 min (corto, videoclip)**: 3 actos (planteamiento 25% · confrontación 50% · resolución 25%) o *Save the Cat* compacto.
- **Explicativo**: problema → por qué importa → cómo funciona (3 pasos) → prueba → qué hacer.

Escribe primero la **premisa en una frase** y el **beat sheet** (lista de momentos emocionales con su segundo aproximado). Apruébalo antes del guion.

## 2. Guion (`03_guion/guion.md`)
Formato de cine simplificado:
```
ESC. 1 — INT. TALLER — NOCHE
Lluvia en la ventana. LUZ de un solo foco.
MARA (17) suelda una pieza diminuta; las chispas le iluminan los lentes.
                    MARA
          (sin voltear)
     Una más y despierta.
```
Acción en presente, solo lo que se ve y se oye. Diálogo corto. En redes, piensa en subtítulos: frases de ≤ 7 palabras.

## 3. Lista de tomas (`04_storyboard/tomas.md`)
| # | Esc. | Duración | Encuadre | Lente | Movimiento | Acción | Audio | Técnica |
|---|---|---|---|---|---|---|---|---|
| 1A | 1 | 2.0 s | Plano detalle | 100 mm macro | estático | chispas sobre metal | soldadura, lluvia | IA video |

"Técnica" = cómo se produce (IA imagen→video, 3D Blender, motion graphics, stock, filmado). Suma de duraciones = duración objetivo. Usa el vocabulario de `direccion-de-escena`.

## 4. Storyboard
Según herramientas disponibles:
- **Con generación de imagen**: un frame por toma con la ficha de personaje + bloque de estilo, en baja resolución (son bocetos). Guárdalos como `04_storyboard/1A.png`.
- **Con código**: tarjetas SVG/HTML con composición en bloques (siluetas, flechas de movimiento de cámara) — rápidas y editables.
- **Sin herramientas**: descripción visual precisa por toma.
Arma una hoja con todos los frames en orden (ver `revision-visual` para la hoja de contacto).

## 5. Animatic
Junta los frames con sus duraciones y audio guía (voz temporal, música de referencia) en un video con ffmpeg (ver `postproduccion`). Ver el animatic es la forma más barata de detectar problemas de ritmo antes de gastar en producción.
