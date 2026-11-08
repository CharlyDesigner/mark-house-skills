---
name: produccion-3d
description: 'Pipeline 3D completo controlado desde Claude Code con Blender en modo headless (Python/bpy) - modelado procedural o desde IA (imagen a 3D), revisión de malla, retopología y reducción, UVs y materiales PBR, rig y animación, iluminación, cámara y render (Cycles/EEVEE), turntables, y exportación para web, Godot, Unity, Unreal o impresión. Incluye scripts probados para render de vista previa, inspección y exportación. Úsalo cuando pidan modelar, renderizar, animar en 3D, preparar un modelo para juego o web, "Blender", "render", "turntable", "GLB", "personaje 3D", "escena 3D".'
argument-hint: "[modelo, escena o tarea 3D]"
---

# Producción 3D

Blender se controla por código: `blender -b archivo.blend -P script.py -- args` (o `python script.py` con el módulo `bpy` de PyPI). Nunca trabajes a ciegas: **después de cada cambio importante, renderiza una vista previa y mírala**.

## Scripts incluidos (probados con Blender 5.2)
- `${CLAUDE_SKILL_DIR}/scripts/render_preview.py` — importa cualquier modelo (glb, fbx, obj, stl, ply, usd, blend), lo encuadra solo, pone estudio con ciclorama y luz de 3 puntos, y renderiza un PNG o un turntable. `--motor cycles|eevee|workbench --muestras --lente --elevacion --azimut --transparente --clave_k --turntable N --guardar_blend`.
- `${CLAUDE_SKILL_DIR}/scripts/inspeccionar.py` — JSON con triángulos, dimensiones, UVs, materiales y resolución de texturas, huesos, shape keys, animaciones y advertencias.
- `${CLAUDE_SKILL_DIR}/scripts/exportar.py` — aplica transformaciones, centra y apoya en el piso, reduce a un presupuesto de triángulos y exporta: `--destino web|godot|unity|unreal|impresion --tris N --draco`.

Turntable a video: renderiza con `--turntable 96` y une con `ffmpeg -framerate 24 -i frames/frame_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 turntable.mp4`. Revisa con la hoja de contacto de `revision-visual`.

## Pipeline
1. **Referencia**: biblia de estilo y hoja del personaje/objeto (turnaround, escala en metros).
2. **Blockout**: formas primitivas a escala real para validar proporción y composición. Render rápido con `--motor workbench`.
3. **Modelo**, la ruta que convenga:
   - **Procedural por código** (bpy, modificadores, Geometry Nodes): arquitectura, props, entornos, patrones, cualquier cosa paramétrica.
   - **IA imagen→3D** (si hay herramienta conectada): desde el frente del turnaround en A-pose, fondo limpio. Siempre pasa el resultado por `inspeccionar.py` y limpia.
   - **Kitbash** de assets con licencia permitida.
4. **Limpieza**: aplica escala, origen en la base, quita duplicados, normales hacia afuera, sin n-gons en zonas que deforman.
5. **Presupuesto** de triángulos según destino: web/móvil 5–50 k por escena, personaje de juego 10–40 k, héroe de cinemática sin límite práctico. Reduce con `exportar.py --tris` o retopo.
6. **UV y materiales PBR** (Base Color, Roughness, Metallic, Normal). Texturas en potencia de 2; 1–2 K para web, 4 K para cine.
7. **Rig**: Rigify o auto-rig (Mixamo requiere malla cerrada, A/T-pose, un solo objeto). Prueba deformaciones con poses extremas antes de animar.
8. **Animación**: bloqueo en poses clave → splines → pulido con los 12 principios (ver `animacion-con-codigo`).
9. **Luz y cámara**: según `direccion-de-escena` (lente en mm, temperatura en K, luz motivada).
10. **Render**: prueba en EEVEE o Cycles con pocas muestras; final en Cycles con denoise. Exporta EXR/PNG por secuencia, nunca directo a MP4 (si se cae a la mitad, pierdes todo).
11. **Exportación** al destino con `exportar.py`, y re-inspección del archivo exportado.

Recetas de bpy (materiales, luces, cámaras, keyframes, modificadores, Geometry Nodes, render por capas, cambio de motor) en [recetas-bpy.md](recetas-bpy.md).

## Reglas
- Escala real (1 unidad = 1 metro), Z arriba en Blender; el exportador convierte ejes.
- Nombra todo (`Personaje_Cuerpo`, `Prop_Lampara`); nada de `Cube.047`.
- Guarda versiones (`escena_v003.blend`), nunca sobrescribas la única copia.
- Renders largos en segundo plano y por secuencia; avisa al usuario el tiempo estimado (muestras × resolución × frames) antes de lanzarlos.
