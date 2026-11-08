# Recetas de bpy (Blender 4.x / 5.x)

Ejecuta con `blender -b escena.blend -P script.py -- args`. Al final, guarda con `bpy.ops.wm.save_as_mainfile(filepath=...)`.

## Escena limpia
```python
import bpy, math
from mathutils import Vector
bpy.ops.wm.read_factory_settings(use_empty=True)
escena = bpy.context.scene
escena.unit_settings.system = "METRIC"
```

## Material PBR
```python
def pbr(nombre, color=(0.8, 0.8, 0.8, 1), rugosidad=0.5, metal=0.0, emision=None, fuerza=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = color
    b.inputs["Roughness"].default_value = rugosidad
    b.inputs["Metallic"].default_value = metal
    if emision:
        b.inputs["Emission Color"].default_value = emision
        b.inputs["Emission Strength"].default_value = fuerza
    return m
obj.data.materials.append(pbr("Plastico_Rojo", (0.8, 0.05, 0.03, 1), 0.3))
```
Colores en **espacio lineal** (convierte el hex sRGB: `c/12.92` si `c<=0.04045`, si no `((c+0.055)/1.055)**2.4`).

Textura de imagen:
```python
nt = m.node_tree
tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = bpy.data.images.load("//texturas/madera_color.png")
nt.links.new(tex.outputs["Color"], nt.nodes["Principled BSDF"].inputs["Base Color"])
# Para roughness/normal: tex.image.colorspace_settings.name = "Non-Color"
```

## Luces
```python
def luz(tipo, nombre, energia, ubicacion, objetivo=(0, 0, 0), color=(1, 1, 1), tamano=1.0):
    d = bpy.data.lights.new(nombre, tipo); d.energy = energia; d.color = color
    if tipo == "AREA": d.size = tamano
    o = bpy.data.objects.new(nombre, d); bpy.context.scene.collection.objects.link(o)
    o.location = ubicacion
    o.rotation_euler = (Vector(objetivo) - o.location).to_track_quat("-Z", "Y").to_euler()
    return o
luz("AREA", "Clave", 400, (3, -3, 4), tamano=2)      # vatios; área grande = sombra suave
luz("SUN", "Sol", 3, (0, 0, 10), (2, 1, 0))          # SUN usa irradiancia (W/m²), ~1–5
```
HDRI:
```python
w = escena.world; w.use_nodes = True; nt = w.node_tree
env = nt.nodes.new("ShaderNodeTexEnvironment"); env.image = bpy.data.images.load("/ruta/estudio.hdr")
nt.links.new(env.outputs["Color"], nt.nodes["Background"].inputs["Color"])
nt.nodes["Background"].inputs["Strength"].default_value = 1.0
```

## Cámara
```python
cd = bpy.data.cameras.new("Cam"); cd.lens = 35; cd.sensor_width = 36
cd.dof.use_dof = True; cd.dof.aperture_fstop = 2.0; cd.dof.focus_object = sujeto
cam = bpy.data.objects.new("Cam", cd); escena.collection.objects.link(cam); escena.camera = cam
cam.location = (0, -6, 1.6)
cam.rotation_euler = (Vector((0, 0, 1.2)) - cam.location).to_track_quat("-Z", "Y").to_euler()
```
Seguir a un objeto: `c = cam.constraints.new("TRACK_TO"); c.target = sujeto; c.track_axis = "TRACK_NEGATIVE_Z"; c.up_axis = "UP_Y"`.

## Keyframes y animación
```python
escena.render.fps = 24; escena.frame_start, escena.frame_end = 1, 120
obj.location = (0, 0, 0); obj.keyframe_insert("location", frame=1)
obj.location = (0, 0, 2); obj.keyframe_insert("location", frame=24)
```
Interpolación: en Blender 4.4+ las acciones tienen capas; para recorrer curvas de forma compatible:
```python
def curvas(accion):
    if hasattr(accion, "fcurves"): return list(accion.fcurves)
    return [c for capa in accion.layers for t in capa.strips for b in t.channelbags for c in b.fcurves]
for c in curvas(obj.animation_data.action):
    for k in c.keyframe_points: k.interpolation = "BEZIER"; k.easing = "EASE_IN_OUT"
```
Movimiento de cámara por ruta: curva Bézier + restricción `FOLLOW_PATH` en la cámara, animando `offset_factor` 0→1.

## Modificadores útiles
```python
m = obj.modifiers.new("Sub", "SUBSURF"); m.levels = 1; m.render_levels = 2
m = obj.modifiers.new("Bisel", "BEVEL"); m.width = 0.01; m.segments = 3       # bordes que atrapan luz
m = obj.modifiers.new("Arreglo", "ARRAY"); m.count = 10; m.relative_offset_displace = (1.1, 0, 0)
m = obj.modifiers.new("Reducir", "DECIMATE"); m.ratio = 0.3
m = obj.modifiers.new("Espejo", "MIRROR")
m = obj.modifiers.new("Grosor", "SOLIDIFY"); m.thickness = 0.02
bpy.context.view_layer.objects.active = obj; bpy.ops.object.modifier_apply(modifier="Sub")
```
Bisel en bordes duros + sombreado suave = el truco #1 para que un modelo simple se vea profesional.

## Geometry Nodes (dispersar objetos sobre una superficie)
```python
gn = obj.modifiers.new("Dispersar", "NODES")
arbol = bpy.data.node_groups.new("Dispersar", "GeometryNodeTree"); gn.node_group = arbol
arbol.interface.new_socket("Geometry", in_out="INPUT", socket_type="NodeSocketGeometry")
arbol.interface.new_socket("Geometry", in_out="OUTPUT", socket_type="NodeSocketGeometry")
n = arbol.nodes; L = arbol.links.new
ent, sal = n.new("NodeGroupInput"), n.new("NodeGroupOutput")
pts = n.new("GeometryNodeDistributePointsOnFaces"); pts.inputs["Density"].default_value = 20
inst = n.new("GeometryNodeInstanceOnPoints")
info = n.new("GeometryNodeObjectInfo"); info.inputs["Object"].default_value = bpy.data.objects["Roca"]
unir = n.new("GeometryNodeJoinGeometry")
L(ent.outputs[0], pts.inputs["Mesh"]); L(pts.outputs["Points"], inst.inputs["Points"])
L(info.outputs["Geometry"], inst.inputs["Instance"])
L(ent.outputs[0], unir.inputs[0]); L(inst.outputs[0], unir.inputs[0]); L(unir.outputs[0], sal.inputs[0])
```

## Render
```python
escena.render.engine = "CYCLES"; escena.cycles.samples = 128; escena.cycles.use_denoising = True
escena.cycles.device = "GPU"   # requiere configurar el dispositivo en preferencias; en servidores usa "CPU"
# EEVEE: el id cambia entre versiones; detecta:
ids = bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items.keys()
escena.render.engine = next(e for e in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE") if e in ids)
escena.render.resolution_x, escena.render.resolution_y = 1920, 1080
escena.view_settings.view_transform = "AgX"          # mejor rango dinámico que "Standard"
escena.render.image_settings.file_format = "PNG"     # u "OPEN_EXR" para composición
escena.render.filepath = "//render/toma_"            # // = relativo al .blend
bpy.ops.render.render(animation=True)                # o write_still=True para un frame
```
Desde terminal: `blender -b escena.blend -o //render/toma_#### -s 1 -e 120 -a` · un frame: `-f 12`.

Tiempo estimado: renderiza 1 frame, mide, multiplica por frames. Avisa antes de lanzar más de 10 minutos.

## Personajes: shape keys (expresiones / lip-sync)
```python
obj.shape_key_add(name="Basis")
sonrisa = obj.shape_key_add(name="Sonrisa")
# ...mover vértices de sonrisa.data[i].co...
sonrisa.value = 0.0; sonrisa.keyframe_insert("value", frame=1)
sonrisa.value = 1.0; sonrisa.keyframe_insert("value", frame=12)
```
Rigify: activa el addon (`bpy.ops.preferences.addon_enable(module="rigify")`), agrega el metarig humano, ajústalo a la malla y genera con `bpy.ops.pose.rigify_generate()`; luego `Parent > With Automatic Weights`.
