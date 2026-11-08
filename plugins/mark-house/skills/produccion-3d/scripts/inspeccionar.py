"""
Inspecciona un modelo 3D y reporta lo que importa para producción, en JSON.

  blender -b -P inspeccionar.py -- modelo.glb
  python inspeccionar.py modelo.glb          (con el módulo bpy)

Reporta: triángulos por objeto y total, dimensiones en metros, materiales y texturas
(con resolución), UVs, modificadores, esqueletos y huesos, shape keys, animaciones,
transformaciones sin aplicar, y advertencias (n-gons, escala no uniforme, sin UV, etc.).
"""
import json
import os
import sys

import bpy
from mathutils import Vector


def ruta():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    if not argv:
        sys.exit("Falta la ruta del modelo")
    return os.path.abspath(argv[0])


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
        ".usd": bpy.ops.wm.usd_import, ".usda": bpy.ops.wm.usd_import, ".usdc": bpy.ops.wm.usd_import,
    }[ext](filepath=r)


def main():
    r = ruta()
    importar(r)
    deps = bpy.context.evaluated_depsgraph_get()
    reporte = {"archivo": os.path.basename(r), "objetos": [], "materiales": [], "esqueletos": [],
               "animaciones": [a.name for a in bpy.data.actions], "advertencias": []}
    total = 0
    puntos = []

    for o in bpy.context.scene.objects:
        if o.name.startswith("_preview"):
            continue
        if o.type == "MESH":
            ev = o.evaluated_get(deps)
            malla = ev.to_mesh()
            tris = sum(len(p.vertices) - 2 for p in malla.polygons)
            ngons = sum(1 for p in malla.polygons if len(p.vertices) > 4)
            total += tris
            puntos += [o.matrix_world @ Vector(c) for c in o.bound_box]
            info = {
                "nombre": o.name, "triangulos": tris, "vertices": len(malla.vertices),
                "ngons": ngons, "uv": [u.name for u in o.data.uv_layers],
                "materiales": [s.material.name for s in o.material_slots if s.material],
                "modificadores": [m.type for m in o.modifiers],
                "shape_keys": [k.name for k in o.data.shape_keys.key_blocks] if o.data.shape_keys else [],
                "escala": [round(s, 4) for s in o.scale],
            }
            ev.to_mesh_clear()
            reporte["objetos"].append(info)
            if not info["uv"]:
                reporte["advertencias"].append(f"{o.name}: sin UVs (no se puede texturizar)")
            if ngons:
                reporte["advertencias"].append(f"{o.name}: {ngons} n-gons (problemas al deformar/subdividir)")
            if len({round(s, 4) for s in o.scale}) > 1:
                reporte["advertencias"].append(f"{o.name}: escala no uniforme sin aplicar")
            elif abs(o.scale[0] - 1) > 1e-4:
                reporte["advertencias"].append(f"{o.name}: escala {o.scale[0]:.3f} sin aplicar")
        elif o.type == "ARMATURE":
            reporte["esqueletos"].append({"nombre": o.name, "huesos": len(o.data.bones),
                                          "ejemplo": [b.name for b in o.data.bones][:12]})

    for m in bpy.data.materials:
        texturas = []
        if m.use_nodes and m.node_tree:
            for n in m.node_tree.nodes:
                if n.type == "TEX_IMAGE" and n.image:
                    texturas.append({"imagen": n.image.name, "resolucion": list(n.image.size)})
        reporte["materiales"].append({"nombre": m.name, "texturas": texturas})

    if puntos:
        mn = Vector((min(p.x for p in puntos), min(p.y for p in puntos), min(p.z for p in puntos)))
        mx = Vector((max(p.x for p in puntos), max(p.y for p in puntos), max(p.z for p in puntos)))
        dim = mx - mn
        reporte["dimensiones_m"] = [round(v, 4) for v in dim]
        reporte["piso_en_z"] = round(mn.z, 4)
        if max(dim) > 100 or max(dim) < 0.01:
            reporte["advertencias"].append(f"Tamaño sospechoso {max(dim):.3f} m: revisa unidades/escala")
        if abs(mn.z) > 0.01:
            reporte["advertencias"].append("El modelo no está apoyado en Z=0")
    reporte["triangulos_total"] = total
    print(json.dumps(reporte, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
