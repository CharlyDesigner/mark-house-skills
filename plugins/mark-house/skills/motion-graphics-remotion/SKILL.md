---
name: motion-graphics-remotion
description: 'Motion graphics y videos de producto/marca con Claude + Remotion siguiendo un flujo con control de calidad: intake en un solo mensaje, análisis de referencias (video, imágenes, URL), marca, storyboard aprobado, construcción con componentes reutilizables, revisión por stills y render por formato (16:9, 9:16, 1:1, 4:5 a 30 fps) con tonos (default, polished, cinematic, chaotic, deadpan, app-store, editorial), zonas seguras y reglas de easing. Úsala cuando digan "hazme un motion graphic", "anuncio animado de mi app", "video explicativo con mi marca", "anima mi logo", "reel con texto animado" o cuando mencionen Motion Architect. Para principios de animación y otras herramientas (GSAP, Lottie, Three) usa animacion-con-codigo.'
argument-hint: "[qué animar, formato, duración y marca]"
---

# Motion graphics con Claude + Remotion

Complementa a `animacion-con-codigo` (principios y herramientas): aquí va el **flujo de proyecto** con puertas de aprobación para que el resultado no sea "un video genérico".

## Flujo (no te saltes las puertas)
1. **Intake en un solo mensaje.** Pregunta todo junto: objetivo y público, formato(s) y duración, tono, material (videos, imágenes, logo, URL), marca (colores, fuentes, voz), música/voz, dónde se publica, qué NO debe aparecer. Lo no respondido se asume y se anota.
2. **Referencias.** Analiza lo que den: de un video saca fotogramas (`ffmpeg`, ~1/s) y describe ritmo, tipografía, easing, color y composición; de una URL, captura de pantalla y extracción de paleta/tipografía. Resume en "qué tomamos / qué no".
3. **Marca.** Escribe `brand.json` (colores con roles, tipografías, logo, voz, movimiento: curvas y duraciones). Sin marca definida, propón una mínima y confírmala.
4. **Storyboard aprobado.** Escena por escena: segundo de inicio y fin, qué se ve, qué se mueve, texto exacto, audio. **La persona lo aprueba antes de construir.**
5. **Construye** con componentes reutilizables en un proyecto Remotion: fondo, zona segura, título cinético, revelado de logo, contador, pila de tarjetas, subtítulo, paneo de imagen; una librería de movimiento común (easings y springs) para que todo comparta ritmo.
6. **Revisa por stills** (`npx remotion still` en cuadros clave de cada escena) antes de renderizar: texto cortado, contraste, zona segura, alineación.
7. **Preview** en Remotion Studio (`npx remotion studio`) y ajustes.
8. **Render** por formato y entrega; si hay varios formatos, no reutilices el layout: re-compón cada uno.

## Formatos y zonas seguras
16:9 · 9:16 · 1:1 · 4:5, a **30 fps**. En **9:16** deja libre ~14 % arriba, ~20 % abajo y ~120 px a la derecha (interfaz de la red).

## Tonos (elige uno y sé consistente)
`default` · `polished` (limpio, corporativo) · `cinematic` (lento, contrastado) · `chaotic` (rápido, collage) · `deadpan` (seco, humor) · `app-store` (demo de producto, claro) · `editorial` (tipografía grande, composición de revista). Cada tono fija duraciones, cortes y easing; no los mezcles dentro de una pieza.

## Reglas de movimiento (resumen; detalle en `animacion-con-codigo`)
- Entradas con *ease-out*; salidas ≈ 70 % de la duración de la entrada.
- Nada nace de `scale(0)`: arranca en 0.9-0.95 con opacidad.
- Un foco por momento; lo demás espera. Escalona 40-80 ms.
- Texto legible: ≈ 0.3 s por palabra + 1 s de permanencia.
- Determinismo: sin `Math.random()` sin semilla ni animaciones CSS/`setTimeout`; todo derivado del cuadro actual.
- Sincroniza golpes con la música: cuadro del beat = `fps * 60 / BPM`.

## Reglas del proyecto
- Trabaja siempre sobre copias de los materiales; no modifiques los originales.
- Música, fuentes e imágenes con licencia anotada.
- Dependencias a reportar (no instalar sin preguntar): Node ≥ 18, ffmpeg, yt-dlp, Python 3.
- El upstream solo está probado en Mac/Linux (su instalador es bash); en Windows, usa WSL (sin probar).
- Licencia de Remotion: gratis para individuos y empresas pequeñas, de pago a partir de cierto tamaño; verifica en su sitio antes de uso comercial en empresa.

## Instalar el original (opcional, sin probar en esta máquina)
```bash
git clone https://github.com/Hainrixz/motion-architect && cd motion-architect
./install.sh --yes     # Mac/Linux/WSL; instala el plugin, el estudio Remotion y revisa dependencias
```
Trae comandos `/motion` y `/motion-render`, el agente `reference-analyst` y herramientas de análisis de video y búsqueda de diseño. Úsalo cuando quieras el flujo ya automatizado; esta skill basta como método.

## Créditos
Método basado en **Motion Architect** (Enrique Rocha / Hainrixz, licencia MIT, <https://github.com/Hainrixz/motion-architect>). Reescrito y condensado; el código del estudio no se copia aquí.
