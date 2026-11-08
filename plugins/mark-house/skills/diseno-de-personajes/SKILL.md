---
name: diseno-de-personajes
description: 'Crea personajes originales y consistentes para animación, 3D, juegos, cómics o video con IA - personalidad y rol, silueta, paleta, hoja de personaje (turnaround frente/perfil/espalda/3/4, expresiones, poses), ficha de prompt fija para generarlo igual cada vez, y notas para modelado y rig. Úsalo cuando pidan "diseña un personaje", "mascota", "protagonista", "hoja de personaje", "character sheet", "turnaround", "que el personaje salga igual en todas las tomas".'
argument-hint: "[personaje: rol, proyecto, estilo]"
---

# Diseño de personajes

Lee `01_estilo/BIBLIA.md` si existe: el personaje vive en ese mundo.

## 1. Quién es (antes de cómo se ve)
- Rol en la historia, deseo, miedo, contradicción interna.
- 3 adjetivos de personalidad → cómo se traducen en forma: círculos (amable, confiable), cuadrados (estable, terco), triángulos (peligroso, dinámico).
- Edad, oficio, mundo, lo que carga consigo y por qué.

## 2. Silueta primero
Propón 3–5 siluetas distintas (en negro, sin detalles). Un buen personaje se reconoce solo por su contorno. Elige una con el usuario.

## 3. Diseño
- **Proporciones** (cabezas de altura: 2–3 chibi/mascota, 5–6 estilizado, 7–8 realista, 9 heroico).
- **Paleta propia**: 3 colores principales + 1 acento, en hex, que contraste con los fondos de la biblia.
- **Rasgos ancla**: 3 detalles que nunca cambian (una cicatriz, un accesorio, un corte de pelo, un color de ropa). Son la clave de la consistencia con IA.
- **Vestuario** por escena si cambia, con los rasgos ancla intactos.

## 4. Hoja de personaje (`02_personajes/<nombre>/`)
- `ficha.md`: todo lo anterior + la **ficha de prompt**.
- Turnaround: frente, 3/4, perfil, espalda — mismo tamaño y pose neutra (A-pose o T-pose si va a 3D).
- Expresiones: neutral, alegría, enojo, tristeza, sorpresa, miedo + 2 propias del personaje.
- 3 poses de acción que muestren la personalidad.

### Ficha de prompt (texto fijo, en inglés)
```
[NOMBRE]: <edad aparente> <tipo de cuerpo>, <cara: forma, ojos, cejas, nariz>, <pelo: color, corte>,
<rasgos ancla>, wearing <vestuario exacto con colores>, <actitud>.
```
Se pega **idéntica** en cada generación, seguida de la acción de la toma y el bloque de estilo de la biblia. Nunca la parafrasees.

### Consistencia con IA (de más a menos fiable)
1. Herramientas con **referencia de personaje** (character reference, sujeto entrenado, LoRA, IP-Adapter): usa la imagen del turnaround aprobada.
2. **Imagen a imagen / imagen a video** partiendo de un frame aprobado.
3. Ficha de prompt fija + semilla fija + mismo modelo.
Para videos: genera primero el frame clave aprobado de cada toma y anímalo; no generes al personaje desde cero en cada clip.

## 5. Para 3D y animación
Agrega a `ficha.md`: escala real en metros, topología prevista (low/mid/high poly, presupuesto de triángulos si es para juego o web), partes separadas (ojos, pelo, ropa), necesidades de rig (dedos, cara con blendshapes o huesos), y si irá a Mixamo/auto-rig (requiere A/T-pose, malla cerrada, sin partes flotantes). Continúa en `produccion-3d`.

## Derechos
Diseña personajes **originales**. Si el usuario pide uno idéntico a un personaje con dueño o a una persona real, propón uno original con el mismo espíritu.
