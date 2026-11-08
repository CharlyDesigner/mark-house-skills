"""
Prepara y exporta un modelo para su destino final.

  blender -b -P exportar.py -- entrada.glb salida.glb --destino web --tris 50000
  python exportar.py entrada.fbx salida.fbx --destino unity

Destinos:
  web     → GLB, +Y arriba, Draco opcional (--draco), ideal para Three.js / model-viewer
  godot   → GLB (Godot importa glTF de forma nativa)
  unity   → FBX con escala y ejes para Unity
  unreal  → FBX con escala en centímetros
  impresion → STL en milímetros

Pasos: aplica transformaciones, apoya el modelo en Z=0 y centrado, reduce triángulos con
Decimate si se pide --tris, y exporta.
"""
import argparse
import os
import sys

import bpy
from mathutils import Vector


def argumentos():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    p = argparse.ArgumentParser()
    p.add_argument("entrada")
    p.add_argument("salida")
    p.add_argument("--destino", choices=["web", "godot", "unity", "unreal", "impresion"], default="web")
    p.add_argument("--tris", type=int, default=0, help="Presupuesto máximo de triángulos (0 = sin reducir)")
    p.add_argument("--draco", action="store_true", help="Compresión Draco (solo glb/web)")
    p.add_argument("--sin_centrar", action="store_true")
    return p.parse_args(argv)


def importar(r):
    ext = os.path.splitext(r)[1].lower()
    if ext == ".blend":
        bpy.ops.wm.open_mainfile(filepath=r)
        return
    bpy.ops.wm.read_factory_settings(use_empty=True)
    {
        ".glb": bpy.ops.import_scene.gltf, ".gltf": bpy.ops.import_scene.gltf,
        ".fbx": bpy.ops.import_scene.fbx, ".obj": bpy.ops.wm.obj_import,
        ".stl": bpy.ops.wm.stl_import, ".ply": bpy.ops.wm.ply_import,
    }[ext](filepath=r)


def triangulos(mallas):
    deps = bpy.context.evaluated_depsgraph_get()
    total = 0
    for o in mallas:
        m = o.evaluated_get(deps).to_mesh()
        total += sum(len(p.vertices) - 2 for p in m.polygons)
        o.evaluated_get(deps).to_mesh_clear()
    return total


def main():
    a = argumentos()
    importar(os.path.abspath(a.entrada))
    for o in [o for o in bpy.context.scene.objects if o.name.startswith("_preview")]:
        bpy.data.objects.remove(o, do_unlink=True)  # quita piso, luces y cámara de render_preview
    mallas = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    con_esqueleto = any(o.type == "ARMATURE" for o in bpy.context.scene.objects)

    bpy.ops.object.select_all(action="DESELECT")
    for o in mallas:
        o.select_set(True)
    if mallas:
        bpy.context.view_layer.objects.active = mallas[0]
        if not con_esqueleto:  # aplicar transformaciones rompe rigs: solo en modelos estáticos
            bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    antes = triangulos(mallas)
    if a.tris and antes > a.tris:
        razon = a.tris / antes
        for o in mallas:
            mod = o.modifiers.new("Reducir", "DECIMATE")
            mod.ratio = razon
            bpy.context.view_layer.objects.active = o
            bpy.ops.object.modifier_apply(modifier=mod.name)
    despues = triangulos(mallas)

    if not a.sin_centrar and mallas and not con_esqueleto:
        pts = [o.matrix_world @ Vector(c) for o in mallas for c in o.bound_box]
        mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
        mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
        desplazamiento = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
        for o in bpy.context.scene.objects:
            if o.parent is None:
                o.location -= desplazamiento

    salida = os.path.abspath(a.salida)
    os.makedirs(os.path.dirname(salida) or ".", exist_ok=True)
    if a.destino in ("web", "godot"):
        bpy.ops.export_scene.gltf(filepath=salida, export_format="GLB", export_yup=True,
                                  export_draco_mesh_compression_enable=a.draco and a.destino == "web",
                                  export_animations=True, export_apply=True)
    elif a.destino in ("unity", "unreal"):
        bpy.ops.export_scene.fbx(filepath=salida, apply_scale_options="FBX_SCALE_ALL",
                                 global_scale=1.0 if a.destino == "unity" else 100.0,
                                 axis_forward="-Z", axis_up="Y", bake_anim=True,
                                 add_leaf_bones=False, mesh_smooth_type="FACE")
    else:
        bpy.ops.wm.stl_export(filepath=salida, global_scale=1000.0, ascii_format=False)

    print(f"OK {a.destino}: {salida} | triángulos {antes} → {despues}")


if __name__ == "__main__":
    main()
