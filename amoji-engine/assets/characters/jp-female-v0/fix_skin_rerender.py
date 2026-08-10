"""Fix over-strong bump (aged look) + glowing eyes; re-render key angles."""
from __future__ import annotations

import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
BLEND = ROOT / "AmojiSakura_realistic_hyper.blend"
OUT = ROOT / "renders_hyperreal"
TEX_DIR = Path("/agent/tools/MB-Lab/MB-Lab-master/data/textures")

ANGLES = {
    "body_front": ((0.0, -2.6, 0.52), 0.52, 55),
    "body_threequarter_left": ((1.6, -2.2, 0.55), 0.52, 55),
    "body_threequarter_right": ((-1.6, -2.2, 0.55), 0.52, 55),
    "body_side_left": ((2.5, 0.0, 0.55), 0.52, 55),
    "skin_head_front": ((0.0, -0.95, 0.88), 0.86, 85),
    "skin_head_threequarter_left": ((0.7, -0.85, 0.90), 0.86, 85),
    "skin_head_threequarter_right": ((-0.7, -0.85, 0.90), 0.86, 85),
}


def body():
    return next(o for o in bpy.data.objects if o.type == "MESH" and "body" in o.name.lower())


def bounds(obj):
    bb = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    xs = [v.x for v in bb]
    ys = [v.y for v in bb]
    zs = [v.z for v in bb]
    return {
        "cx": (min(xs) + max(xs)) / 2,
        "cy": (min(ys) + max(ys)) / 2,
        "zmin": min(zs),
        "sz": max(zs) - min(zs),
    }


def hide_non_body():
    for o in bpy.data.objects:
        if o.type == "MESH":
            keep = "body" in o.name.lower() and "hair" not in o.name.lower()
            o.hide_render = not keep
            o.hide_viewport = not keep
        elif o.type == "ARMATURE":
            o.hide_render = True
        if "hair" in o.name.lower():
            o.hide_render = True
            for mod in o.modifiers:
                mod.show_render = False


def soften_skin_and_eyes():
    for mat in bpy.data.materials:
        if not mat or not mat.use_nodes:
            continue
        n = mat.name.lower()
        nt = mat.node_tree
        # Soften bump nodes
        if "skin" in n or "skn" in n:
            for node in nt.nodes:
                if node.type == "BUMP":
                    node.inputs["Strength"].default_value = 0.08
                    print("bump softened", mat.name)
                if node.type == "BSDF_PRINCIPLED":
                    if "Subsurface Weight" in node.inputs:
                        node.inputs["Subsurface Weight"].default_value = 0.12
                    if "Roughness" in node.inputs and not node.inputs["Roughness"].is_linked:
                        node.inputs["Roughness"].default_value = 0.45
                    if "Specular IOR Level" in node.inputs:
                        node.inputs["Specular IOR Level"].default_value = 0.35
        # Kill glowing eyes / fix iris
        if any(k in n for k in ("eye", "iris", "pupil", "cornea", "sclera")):
            for node in nt.nodes:
                if node.type == "BSDF_PRINCIPLED":
                    if "Emission Strength" in node.inputs:
                        node.inputs["Emission Strength"].default_value = 0.0
                    if "Emission Color" in node.inputs:
                        node.inputs["Emission Color"].default_value = (0, 0, 0, 1)
                    # dark iris-ish if base is wild
                    if "iris" in n or "pupil" in n:
                        if "Base Color" in node.inputs and not node.inputs["Base Color"].is_linked:
                            node.inputs["Base Color"].default_value = (0.12, 0.18, 0.14, 1)
                        node.inputs["Roughness"].default_value = 0.15
                if node.type == "EMISSION":
                    if "Strength" in node.inputs:
                        node.inputs["Strength"].default_value = 0.0
            print("eyes toned", mat.name)


def setup():
    scn = bpy.context.scene
    scn.render.engine = "BLENDER_EEVEE"
    scn.eevee.taa_render_samples = 48
    scn.eevee.use_gtao = True
    scn.eevee.use_ssr = True
    scn.render.resolution_x = 1024
    scn.render.resolution_y = 1280
    world = bpy.data.worlds.get("StudioWorld") or bpy.data.worlds.new("StudioWorld")
    scn.world = world
    world.use_nodes = True
    nt = world.node_tree
    for node in list(nt.nodes):
        nt.nodes.remove(node)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Color"].default_value = (0.14, 0.14, 0.15, 1)
    bg.inputs["Strength"].default_value = 0.9
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def clear_lc():
    for o in list(bpy.data.objects):
        if o.type in {"LIGHT", "CAMERA"}:
            bpy.data.objects.remove(o, do_unlink=True)


def lights(b):
    cx, cy, zmin, sz = b["cx"], b["cy"], b["zmin"], b["sz"]
    for name, loc, en, size in [
        ("key", (cx + 1.4, cy - 1.8, zmin + sz * 0.92), 420, 2.5),
        ("fill", (cx - 1.6, cy - 1.0, zmin + sz * 0.72), 160, 3.0),
        ("rim", (cx, cy + 2.0, zmin + sz * 0.85), 180, 2.0),
    ]:
        d = bpy.data.lights.new(name, "AREA")
        d.energy = en
        d.size = size
        d.color = (1.0, 0.97, 0.94)
        o = bpy.data.objects.new(name, d)
        bpy.context.scene.collection.objects.link(o)
        o.location = loc
        tgt = Vector((cx, cy, zmin + sz * 0.55))
        o.rotation_euler = (tgt - o.location).to_track_quat("-Z", "Y").to_euler()


def main():
    bpy.ops.wm.open_mainfile(filepath=str(BLEND))
    hide_non_body()
    soften_skin_and_eyes()
    setup()
    bobj = body()
    b = bounds(bobj)
    for name, (off, look_z, lens) in ANGLES.items():
        clear_lc()
        lights(b)
        look = Vector((b["cx"], b["cy"], b["zmin"] + b["sz"] * look_z))
        loc = Vector((b["cx"] + off[0], b["cy"] + off[1], b["zmin"] + b["sz"] * off[2]))
        cam_data = bpy.data.cameras.new("cam")
        cam = bpy.data.objects.new("cam", cam_data)
        bpy.context.scene.collection.objects.link(cam)
        bpy.context.scene.camera = cam
        cam.location = loc
        cam.rotation_euler = (look - loc).to_track_quat("-Z", "Y").to_euler()
        cam.data.lens = lens
        path = OUT / f"{name}.png"
        bpy.context.scene.render.filepath = str(path)
        print("rendering", path.name)
        bpy.ops.render.render(write_still=True)
        print("saved", path)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND))
    print("done")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("FATAL", e)
        import traceback

        traceback.print_exc()
        sys.exit(1)
