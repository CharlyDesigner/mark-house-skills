---
name: animacion-con-codigo
description: 'Animación y motion graphics hechos con código y renderizados a video o integrados en la web - Remotion (video con React), GSAP, CSS/SVG, Lottie, Canvas, Three.js, Manim y keyframes de Blender - aplicando los 12 principios de la animación, timing, easing y ritmo con música. Úsalo para intros, lower thirds, videos explicativos, kinetic typography, animaciones de logo, UI animada, reels con texto animado, visualización de datos animada o cualquier "animación" que no requiera generar video con IA.'
argument-hint: "[qué animar, duración y formato]"
---

# Animación con código

## 1. Elige la herramienta por el destino
| Destino | Herramienta |
|---|---|
| Video MP4 (reels, YouTube, comerciales, explicativos) | **Remotion** (React → video, preciso al cuadro) |
| Animación dentro de una web | **GSAP** (+ ScrollTrigger), CSS, Web Animations API |
| Íconos y microinteracciones ligeras | SVG + CSS, o **Lottie** |
| 3D interactivo o 3D en video | Three.js / React Three Fiber (ver `escenas-3d-web`), Blender (ver `produccion-3d`) |
| Matemáticas, diagramas, explicaciones técnicas | **Manim** (Python) |
| Arte generativo | Canvas / p5.js |

## 2. Principios (aplícalos siempre)
Los 12 principios de Disney en código:
1. **Estirar y encoger** — `scaleY` 1.2 / `scaleX` 0.85 al caer/rebotar; conserva el volumen.
2. **Anticipación** — retrocede 5–10% antes de avanzar.
3. **Puesta en escena** — una cosa se mueve a la vez para el ojo; lo demás espera.
4. **Pose a pose** — define keyframes clave primero, luego el entre.
5. **Acción continuada y superpuesta** — los elementos no se detienen al mismo tiempo; escalona (stagger 40–80 ms).
6. **Entradas y salidas lentas** — nunca `linear` salvo rotaciones continuas o máquinas.
7. **Arcos** — los movimientos naturales siguen curvas, no rectas.
8. **Acción secundaria** — una sombra, una partícula, un rebote del texto.
9. **Timing** — pocos cuadros = rápido/ligero, muchos = pesado/lento.
10. **Exageración** — un poco más de lo real se lee como "correcto".
11. **Dibujo sólido** — volumen y perspectiva consistentes.
12. **Atractivo** — formas claras y legibles en silueta.

## 3. Timing y easing de referencia
- UI: 150–300 ms; entradas `ease-out`, salidas `ease-in` y 20–30% más cortas.
- Motion graphics: texto entra en 0.4–0.8 s, se queda lo suficiente para leerse (≈ 0.3 s por palabra + 1 s), sale más rápido de lo que entró.
- Curvas: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out, elegante) · `(0.34, 1.56, 0.64, 1)` (rebote leve) · springs con amortiguación 10–15 para lo juguetón.
- Sincroniza cortes y golpes con la música: calcula los BPM, cuadro del beat = `fps * 60 / BPM`.
- Respeta `prefers-reduced-motion` en la web.

## 4. Remotion (video)
```bash
npx create-video@latest mi-video   # elige plantilla en blanco o con TypeScript
cd mi-video && npm run dev            # Studio en el navegador para previsualizar
npx remotion render <IdComposicion> out/video.mp4
npx remotion still <IdComposicion> out/frame.png --frame=45   # un cuadro para revisar
```
- Todo depende de `useCurrentFrame()` y `useVideoConfig()`; anima con `interpolate()` (con `extrapolateRight: "clamp"`) y `spring()`.
- Secuencia escenas con `<Sequence from={} durationInFrames={}>` o `<Series>`; audio con `<Audio>`, video con `<OffthreadVideo>`.
- Formatos: 1080×1920 (9:16), 1080×1080, 1920×1080 a 30 fps; define una `<Composition>` por formato reutilizando los mismos componentes.
- Nada de `Math.random()` sin semilla, ni animaciones CSS/`setTimeout`: rompen el render determinista. Usa `random(seed)` de Remotion.

## 5. GSAP (web)
```js
gsap.registerPlugin(ScrollTrigger);
const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.8 } });
tl.from(".titulo span", { yPercent: 110, stagger: 0.04 })
  .from(".subtitulo", { opacity: 0, y: 20 }, "-=0.5")
  .from(".cta", { scale: 0.9, opacity: 0, ease: "back.out(1.7)" }, "-=0.4");
gsap.to(".hero img", { yPercent: -15, scrollTrigger: { trigger: ".hero", scrub: true } });
```
Anima solo `transform` y `opacity` (GPU); evita animar `width`, `top`, `box-shadow` grandes.

## 6. Verificar
Renderiza cuadros sueltos o el video completo y revísalo con `revision-visual` (hoja de contacto). En la web, graba o captura con Playwright y comprueba 60 fps con el panel de rendimiento. Para video final, sigue con `postproduccion` (música, mezcla, exportes por plataforma).
