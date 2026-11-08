"""
Render de vista previa con Blender en modo headless.

Uso (Blender instalado):
  blender -b -P render_preview.py -- --entrada modelo.glb --salida render.png
  blender -b -P render_preview.py -- --entrada modelo.glb --turntable 48 --salida frames/
Uso (módulo bpy de PyPI):
  python render_preview.py --entrada modelo.glb --salida render.png

Sin --entrada crea una escena de demostración (sirve para probar la instalación).
Acepta .glb .gltf .fbx .obj .stl .ply .usd/.usda/.usdc .blend
"""
import argparse
import math
import os
import sys

import bpy
from mathutils import Matrix, Vector


def argumentos():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    p = argparse.ArgumentParser(description="Render de vista previa")
    p.add_argument("--entrada", help="Modelo a importar")
    p.add_argument("--salida", default="render.png", help="PNG de salida, o carpeta si es turntable")
    p.add_argument("--motor", choices=["cycles", "eevee", "workbench"], default="cycles")
    p.add_argument("--muestras", type=int, default=64)
    p.add_argument("--ancho", type=int, default=1280)
    p.add_argument("--alto", type=int, default=1280)
    p.add_argument("--lente", type=float, default=50.0, help="Distancia focal en mm")
    p.add_argument("--elevacion", type=float, default=15.0, help="Grados sobre el horizonte")
    p.add_argument("--azimut", type=float, default=35.0, help="Grados alrededor del objeto")
    p.add_argument("--margen", type=float, default=1.15, help=">1 deja aire alrededor")
    p.add_argument("--fondo", default="#1d1f24", help="Color de fondo hex")
    p.add_argument("--piso", default="#2a2d34", help="Color del piso hex ('no' para quitarlo)")
    p.add_argument("--transparente", action="store_true", help="Fondo transparente (PNG RGBA)")
    p.add_argument("--clave_k", type=float, default=5200, help="Temperatura de la luz clave en Kelvin")
    p.add_argument("--turntable", type=int, default=0, help="N frames de vuelta 360° (0 = imagen fija)")
    p.add_argument("--guardar_blend", help="Guarda la escena resultante en este .blend")
    return p.parse_args(argv)


def hex_a_rgba(h):
    h = h.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lineal = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lineal, 1.0)


def kelvin_a_rgb(k):
    """Aproximación de Tanner Helland, devuelve RGB lineal 0–1."""
    t = k / 100.0
    r = 255 if t <= 66 else 329.698727446 * ((t - 60) ** -0.1332047592)
    g = 99.4708025861 * math.log(t) - 161.1195681661 if t <= 66 else 288.1221695283 * ((t - 60) ** -0.0755148492)
    b = 255 if t >= 66 else (0 if t <= 19 else 138.5177312231 * math.log(t - 10) - 305.0447927307)
    srgb = [max(0, min(255, c)) / 255 for c in (r, g, b)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb)


def escena_vacia():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def importar(ruta):
    ext = os.path.splitext(ruta)[1].lower()
    if ext == ".blend":
        bpy.ops.wm.open_mainfile(filepath=ruta)
        return
    escena_vacia()
    importadores = {
        ".glb": lambda: bpy.ops.import_scene.gltf(filepath=ruta),
        ".gltf": lambda: bpy.ops.import_scene.gltf(filepath=ruta),
        ".fbx": lambda: bpy.ops.import_scene.fbx(filepath=ruta),
        ".obj": lambda: bpy.ops.wm.obj_import(filepath=ruta),
        ".stl": lambda: bpy.ops.wm.stl_import(filepath=ruta),
        ".ply": lambda: bpy.ops.wm.ply_import(filepath=ruta),
        ".usd": lambda: bpy.ops.wm.usd_import(filepath=ruta),
        ".usda": lambda: bpy.ops.wm.usd_import(filepath=ruta),
        ".usdc": lambda: bpy.ops.wm.usd_import(filepath=ruta),
    }
    if ext not in importadores:
        sys.exit(f"Formato no soportado: {ext}")
    importadores[ext]()


def material(nombre, color, rugosidad=0.5, metalico=0.0):
    m = bpy.data.materials.new(nombre)
    m.use_nodes = True
    bsdf = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = rugosidad
    bsdf.inputs["Metallic"].default_value = metalico
    return m


def escena_demo():
    escena_vacia()
    bpy.ops.mesh.primitive_monkey_add(location=(0, 0, 1))
    mono = bpy.context.active_object
    mono.modifiers.new("Suavizado", "SUBSURF").levels = 2
    bpy.ops.object.shade_smooth()
    mono.data.materials.append(material("Barro", hex_a_rgba("#e07a5f"), 0.35))
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.35, location=(1.2, 0.4, 0.35))
    esfera = bpy.context.active_object
    bpy.ops.object.shade_smooth()
    esfera.data.materials.append(material("Cromo", hex_a_rgba("#d9dde3"), 0.08, 1.0))


def limites_mundo():
    mallas = [o for o in bpy.context.scene.objects if o.type == "MESH" and not o.name.startswith("_preview")]
    if not mallas:
        sys.exit("La escena no tiene mallas que encuadrar.")
    puntos = [o.matrix_world @ Vector(c) for o in mallas for c in o.bound_box]
    minimo = Vector((min(p.x for p in puntos), min(p.y for p in puntos), min(p.z for p in puntos)))
    maximo = Vector((max(p.x for p in puntos), max(p.y for p in puntos), max(p.z for p in puntos)))
    return minimo, maximo


def configurar_motor(escena, a):
    disponibles = bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items.keys()
    if a.motor == "cycles":
        escena.render.engine = "CYCLES"
        escena.cycles.samples = a.muestras
        escena.cycles.device = "CPU"
        try:
            escena.cycles.use_denoising = True
        except AttributeError:
            pass
    elif a.motor == "eevee":
        escena.render.engine = next(e for e in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE") if e in disponibles)
    else:
        escena.render.engine = "BLENDER_WORKBENCH"
    escena.render.resolution_x = a.ancho
    escena.render.resolution_y = a.alto
    escena.render.resolution_percentage = 100
    escena.render.film_transparent = a.transparente
    escena.render.image_settings.file_format = "PNG"
    escena.render.image_settings.color_mode = "RGBA" if a.transparente else "RGB"
    try:
        escena.view_settings.view_transform = "AgX"
    except TypeError:
        escena.view_settings.view_transform = "Filmic"


def mundo(escena, color):
    w = escena.world or bpy.data.worlds.new("Mundo")
    escena.world = w
    w.use_nodes = True
    fondo = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND")
    fondo.inputs["Color"].default_value = color
    fondo.inputs["Strength"].default_value = 0.6


def luz_area(nombre, energia, color, tamano, ubicacion, objetivo):
    datos = bpy.data.lights.new(nombre, "AREA")
    datos.energy = energia
    datos.color = color
    datos.size = tamano
    luz = bpy.data.objects.new(nombre, datos)
    bpy.context.scene.collection.objects.link(luz)
    luz.location = ubicacion
    direccion = objetivo - luz.location
    luz.rotation_euler = direccion.to_track_quat("-Z", "Y").to_euler()
    return luz


def fondo_infinito(centro, radio, z, azimut):
    """Ciclorama de estudio: piso que se curva hacia una pared detrás del objeto (sin horizonte)."""
    ancho, fondo, curva, alto = radio * 30, radio * 4, radio * 3, radio * 30
    perfil = [(-radio * 30, 0.0), (fondo, 0.0)]
    pasos = 16
    for i in range(1, pasos + 1):
        t = (math.pi / 2) * i / pasos
        perfil.append((fondo + math.sin(t) * curva, curva - math.cos(t) * curva))
    perfil.append((fondo + curva, alto))
    verts, caras = [], []
    for x in (-ancho, ancho):
        verts += [(x, y, zz) for y, zz in perfil]
    n = len(perfil)
    for i in range(n - 1):
        caras.append((i, i + 1, n + i + 1, n + i))
    malla = bpy.data.meshes.new("_preview_piso")
    malla.from_pydata(verts, [], caras)
    malla.update()
    for p in malla.polygons:
        p.use_smooth = True
    obj = bpy.data.objects.new("_preview_piso", malla)
    bpy.context.scene.collection.objects.link(obj)
    obj.location = (centro.x, centro.y, z)
    obj.rotation_euler = (0, 0, azimut)  # la pared queda del lado opuesto a la cámara
    return obj


def preparar(a):
    escena = bpy.context.scene
    minimo, maximo = limites_mundo()
    centro = (minimo + maximo) / 2
    radio = max((maximo - minimo).length / 2, 0.01)

    configurar_motor(escena, a)
    mundo(escena, hex_a_rgba(a.fondo))

    if a.piso.lower() != "no":
        piso = fondo_infinito(centro, radio, minimo.z, math.radians(a.azimut))
        piso.data.materials.append(material("_preview_piso", hex_a_rgba(a.piso), 0.8))
        if a.transparente and hasattr(piso, "is_shadow_catcher"):
            piso.is_shadow_catcher = True

    # Esquema de tres puntos escalado al tamaño del objeto (energía ~ distancia²)
    d = radio * 3
    k = kelvin_a_rgb(a.clave_k)
    frio = kelvin_a_rgb(7500)
    escala = (d ** 2) * 25
    # Las luces se colocan relativas a la cámara, así el look es el mismo en cualquier azimut
    el, az = math.radians(a.elevacion), math.radians(a.azimut)
    giro = Matrix.Rotation(az, 3, "Z")
    luz_area("_preview_clave", escala * 1.0, k, radio * 2.0, centro + giro @ Vector((d * 0.9, -d * 0.9, d * 0.9)), centro)
    luz_area("_preview_relleno", escala * 0.3, frio, radio * 3.0, centro + giro @ Vector((-d, -d * 0.6, d * 0.3)), centro)
    luz_area("_preview_contra", escala * 0.8, k, radio * 1.5, centro + giro @ Vector((-d * 0.3, d * 1.1, d * 1.0)), centro)

    # Cámara que encuadra todo el objeto según el lente
    cam_datos = bpy.data.cameras.new("_preview_camara")
    cam_datos.lens = a.lente
    cam_datos.sensor_width = 36
    cam = bpy.data.objects.new("_preview_camara", cam_datos)
    escena.collection.objects.link(cam)
    fov = 2 * math.atan(18 / a.lente)
    distancia = radio / math.sin(fov / 2) * a.margen
    cam_datos.clip_end = max(1000, distancia * 10)
    cam.location = centro + Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el))) * distancia
    cam.rotation_euler = (centro - cam.location).to_track_quat("-Z", "Y").to_euler()
    escena.camera = cam

    if a.turntable > 0:
        # Turntable de estudio: gira el objeto; cámara, luces y fondo quedan fijos
        pivote = bpy.data.objects.new("_preview_pivote", None)
        escena.collection.objects.link(pivote)
        pivote.location = (centro.x, centro.y, minimo.z)
        bpy.context.view_layer.update()
        for o in list(escena.objects):
            if o.parent is None and not o.name.startswith("_preview") and o.type not in ("CAMERA", "LIGHT"):
                matriz = o.matrix_world.copy()
                o.parent = pivote
                o.matrix_world = matriz
        escena.frame_start, escena.frame_end = 1, a.turntable
        pivote.rotation_euler = (0, 0, 0)
        pivote.keyframe_insert("rotation_euler", index=2, frame=1)
        pivote.rotation_euler = (0, 0, math.tau)
        pivote.keyframe_insert("rotation_euler", index=2, frame=a.turntable + 1)
        hacer_lineal(pivote)


def hacer_lineal(obj):
    anim = obj.animation_data
    if not anim or not anim.action:
        return
    curvas = []
    if hasattr(anim.action, "fcurves"):
        curvas = list(anim.action.fcurves)
    else:  # acciones por capas (Blender 4.4+)
        for capa in getattr(anim.action, "layers", []):
            for tira in capa.strips:
                for bolsa in tira.channelbags:
                    curvas.extend(bolsa.fcurves)
    for c in curvas:
        for k in c.keyframe_points:
            k.interpolation = "LINEAR"


def main():
    a = argumentos()
    if a.entrada:
        importar(os.path.abspath(a.entrada))
    else:
        escena_demo()
    preparar(a)
    escena = bpy.context.scene

    if a.guardar_blend:
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(a.guardar_blend))

    if a.turntable > 0:
        carpeta = os.path.abspath(a.salida)
        os.makedirs(carpeta, exist_ok=True)
        escena.render.filepath = os.path.join(carpeta, "frame_")
        bpy.ops.render.render(animation=True)
        print(f"OK turntable: {a.turntable} frames en {carpeta}")
        print(f"Video: ffmpeg -framerate 24 -i {carpeta}/frame_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 turntable.mp4")
    else:
        salida = os.path.abspath(a.salida)
        os.makedirs(os.path.dirname(salida) or ".", exist_ok=True)
        escena.render.filepath = salida
        bpy.ops.render.render(write_still=True)
        print(f"OK render: {salida}")


if __name__ == "__main__":
    main()
