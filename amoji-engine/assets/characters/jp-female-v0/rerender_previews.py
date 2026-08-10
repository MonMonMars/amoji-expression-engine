import bpy
from pathlib import Path
from mathutils import Vector

ROOT = Path("/agent/amoji-engine/assets/characters/jp-female-v0")


def render(blend, png, mode="full"):
    bpy.ops.wm.open_mainfile(filepath=str(blend))
    for o in list(bpy.data.objects):
        if o.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(o, do_unlink=True)
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    body = next((o for o in meshes if "body" in o.name.lower()), meshes[0])
    bb = [body.matrix_world @ Vector(c) for c in body.bound_box]
    xs = [v.x for v in bb]
    ys = [v.y for v in bb]
    zs = [v.z for v in bb]
    cx = (min(xs) + max(xs)) / 2
    cy = (min(ys) + max(ys)) / 2
    zmin, zmax = min(zs), max(zs)
    sz = zmax - zmin
    cam_data = bpy.data.cameras.new("c")
    cam = bpy.data.objects.new("c", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    if mode == "head":
        target = Vector((cx, cy, zmin + sz * 0.88))
        cam.location = (cx + 0.12, cy - 1.05, target.z)
        cam_data.lens = 85
    else:
        target = Vector((cx, cy, zmin + sz * 0.55))
        cam.location = (cx + 0.35, cy - 2.5, zmin + sz * 0.55)
        cam_data.lens = 50
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    for name, loc, en in [
        ("k", (cx + 1.2, cy - 1.0, zmin + sz * 0.9), 280),
        ("f", (cx - 1.0, cy - 0.9, zmin + sz * 0.7), 100),
    ]:
        ld = bpy.data.lights.new(name, "AREA")
        ld.energy = en
        ld.size = 2.0
        lo = bpy.data.objects.new(name, ld)
        bpy.context.scene.collection.objects.link(lo)
        lo.location = loc
    scn = bpy.context.scene
    scn.render.engine = "BLENDER_EEVEE"
    scn.render.resolution_x = 768
    scn.render.resolution_y = 1024
    scn.render.filepath = str(png)
    bpy.ops.render.render(write_still=True)
    print("rend", png)


render(ROOT / "AmojiSakura_realistic.blend", ROOT / "AmojiSakura_realistic_full.png", "full")
render(ROOT / "AmojiSakura_realistic.blend", ROOT / "AmojiSakura_realistic_head.png", "head")
render(ROOT / "AmojiSakura_stylized.blend", ROOT / "AmojiSakura_stylized_full.png", "full")
render(ROOT / "AmojiSakura_stylized.blend", ROOT / "AmojiSakura_stylized_head.png", "head")
