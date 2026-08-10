"""
Clean hyper-real multi-angle renders: body + MB-Lab Asian skin maps only.
Hides proxy wardrobe / exploding particle hair that break Cycles.
"""
from __future__ import annotations

import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
BLEND = ROOT / "AmojiSakura_realistic.blend"
TEX_DIR = Path("/agent/tools/MB-Lab/MB-Lab-master/data/textures")
OUT = ROOT / "renders_hyperreal"

BODY_ANGLES = {
    "front": (0.0, -2.6, 0.52),
    "threequarter_left": (1.6, -2.2, 0.55),
    "threequarter_right": (-1.6, -2.2, 0.55),
    "side_left": (2.5, 0.0, 0.55),
    "side_right": (-2.5, 0.0, 0.55),
    "back": (0.0, 2.6, 0.55),
}
HEAD_ANGLES = {
    "head_front": (0.0, -0.95, 0.88),
    "head_threequarter_left": (0.7, -0.85, 0.90),
    "head_threequarter_right": (-0.7, -0.85, 0.90),
    "head_side_left": (1.05, 0.0, 0.90),
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


def load_img(path: Path):
    for img in bpy.data.images:
        if img.name == path.name:
            return img
    if path.is_file():
        img = bpy.data.images.load(str(path))
        img.name = path.name
        return img
    return None


def hide_non_body():
    """Hide wardrobe proxies, hair cards, particle hair — keep body + eyes/teeth/etc on body object."""
    keep_substrings = ("body",)  # single mesh contains eyes/teeth in MB-Lab
    for o in bpy.data.objects:
        if o.type != "MESH":
            if o.type == "ARMATURE":
                o.hide_render = True
                o.hide_viewport = True
            continue
        name = o.name.lower()
        is_body = "body" in name and "hair" not in name
        o.hide_render = not is_body
        o.hide_viewport = not is_body
        # Disable particle systems if any remain on visible objs
        for ps in getattr(o, "particle_systems", []):
            o.modifiers[ps.name].show_render = False
            o.modifiers[ps.name].show_viewport = False
    # Also hide any leftover particle hair objects
    for o in bpy.data.objects:
        if "hair" in o.name.lower():
            o.hide_render = True
            o.hide_viewport = True
            for mod in o.modifiers:
                mod.show_render = False


def enhance_skin():
    albedo = load_img(TEX_DIR / "hum_f_asian_albedo.png")
    rough = load_img(TEX_DIR / "human_female_roughness.png")
    bump = load_img(TEX_DIR / "human_female_bump.png")
    if rough:
        try:
            rough.colorspace_settings.name = "Non-Color"
        except Exception:
            pass
    if bump:
        try:
            bump.colorspace_settings.name = "Non-Color"
        except Exception:
            pass

    for mat in bpy.data.materials:
        if not mat or not mat.use_nodes:
            continue
        nlow = mat.name.lower()
        if "skin" not in nlow and "skn" not in nlow:
            continue
        nt = mat.node_tree
        nodes, links = nt.nodes, nt.links
        principleds = [n for n in nodes if n.type == "BSDF_PRINCIPLED"]
        out = next((n for n in nodes if n.type == "OUTPUT_MATERIAL"), None)
        if not principleds and out is not None:
            # Build a clean Cycles skin shader using Asian albedo
            bsdf = nodes.new("ShaderNodeBsdfPrincipled")
            bsdf.location = (200, 0)
            tex = nodes.new("ShaderNodeTexImage")
            tex.image = albedo
            tex.location = (-400, 100)
            links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
            if "Subsurface Weight" in bsdf.inputs:
                bsdf.inputs["Subsurface Weight"].default_value = 0.22
            if "Subsurface Radius" in bsdf.inputs:
                bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.35, 0.2)
            if "Subsurface Color" in bsdf.inputs:
                bsdf.inputs["Subsurface Color"].default_value = (0.9, 0.4, 0.3, 1)
            bsdf.inputs["Roughness"].default_value = 0.4
            if rough:
                tr = nodes.new("ShaderNodeTexImage")
                tr.image = rough
                tr.location = (-400, -150)
                links.new(tr.outputs["Color"], bsdf.inputs["Roughness"])
            if bump and "Normal" in bsdf.inputs:
                tb = nodes.new("ShaderNodeTexImage")
                tb.image = bump
                tb.location = (-400, -400)
                bn = nodes.new("ShaderNodeBump")
                bn.inputs["Strength"].default_value = 0.28
                bn.location = (-100, -350)
                links.new(tb.outputs["Color"], bn.inputs["Height"])
                links.new(bn.outputs["Normal"], bsdf.inputs["Normal"])
            # Disconnect previous group if any
            for link in list(out.inputs["Surface"].links):
                links.remove(link)
            links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
            print("built clean skin shader for", mat.name)
            continue

        for bsdf in principleds:
            if "Subsurface Weight" in bsdf.inputs:
                bsdf.inputs["Subsurface Weight"].default_value = 0.2
            elif "Subsurface" in bsdf.inputs:
                bsdf.inputs["Subsurface"].default_value = 0.2
            if "Subsurface Radius" in bsdf.inputs:
                bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.35, 0.2)
            if "Subsurface Color" in bsdf.inputs:
                bsdf.inputs["Subsurface Color"].default_value = (0.9, 0.4, 0.3, 1)
            if "Roughness" in bsdf.inputs and not bsdf.inputs["Roughness"].is_linked:
                bsdf.inputs["Roughness"].default_value = 0.4
                if rough:
                    tr = nodes.new("ShaderNodeTexImage")
                    tr.image = rough
                    links.new(tr.outputs["Color"], bsdf.inputs["Roughness"])
            if bump and "Normal" in bsdf.inputs and not bsdf.inputs["Normal"].is_linked:
                tb = nodes.new("ShaderNodeTexImage")
                tb.image = bump
                bn = nodes.new("ShaderNodeBump")
                bn.inputs["Strength"].default_value = 0.28
                links.new(tb.outputs["Color"], bn.inputs["Height"])
                links.new(bn.outputs["Normal"], bsdf.inputs["Normal"])
            # Ensure base color uses Asian albedo if unlinked
            if albedo and "Base Color" in bsdf.inputs and not bsdf.inputs["Base Color"].is_linked:
                tex = nodes.new("ShaderNodeTexImage")
                tex.image = albedo
                links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        print("enhanced", mat.name)


def setup_eevee_quality():
    """Eevee is more reliable here for beauty look without denoise/hair blowups."""
    scn = bpy.context.scene
    scn.render.engine = "BLENDER_EEVEE"
    scn.eevee.taa_render_samples = 64
    scn.eevee.use_gtao = True
    scn.eevee.use_bloom = False
    scn.eevee.use_ssr = True
    scn.eevee.use_ssr_refraction = True
    scn.render.resolution_x = 1024
    scn.render.resolution_y = 1280
    world = bpy.data.worlds.get("StudioWorld") or bpy.data.worlds.new("StudioWorld")
    scn.world = world
    world.use_nodes = True
    nt = world.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Color"].default_value = (0.12, 0.12, 0.13, 1)
    bg.inputs["Strength"].default_value = 0.85
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def clear_lights_cams():
    for o in list(bpy.data.objects):
        if o.type in {"LIGHT", "CAMERA"}:
            bpy.data.objects.remove(o, do_unlink=True)


def studio(b):
    cx, cy, zmin, sz = b["cx"], b["cy"], b["zmin"], b["sz"]
    for name, loc, en, size in [
        ("key", (cx + 1.5, cy - 1.9, zmin + sz * 0.95), 500, 2.4),
        ("fill", (cx - 1.7, cy - 1.1, zmin + sz * 0.75), 180, 3.0),
        ("rim", (cx - 0.2, cy + 2.1, zmin + sz * 0.88), 240, 2.0),
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


def render_angles(angles, look_z, lens, prefix):
    bobj = body()
    b = bounds(bobj)
    look = Vector((b["cx"], b["cy"], b["zmin"] + b["sz"] * look_z))
    for name, off in angles.items():
        clear_lights_cams()
        studio(b)
        loc = Vector((b["cx"] + off[0], b["cy"] + off[1], b["zmin"] + b["sz"] * off[2]))
        cam_data = bpy.data.cameras.new("cam")
        cam = bpy.data.objects.new("cam", cam_data)
        bpy.context.scene.collection.objects.link(cam)
        bpy.context.scene.camera = cam
        cam.location = loc
        cam.rotation_euler = (look - loc).to_track_quat("-Z", "Y").to_euler()
        cam.data.lens = lens
        path = OUT / f"{prefix}_{name}.png"
        bpy.context.scene.render.filepath = str(path)
        print("rendering", path.name)
        bpy.ops.render.render(write_still=True)
        print("saved", path)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    # Clear old broken frames
    for p in OUT.glob("*.png"):
        p.unlink()

    bpy.ops.wm.open_mainfile(filepath=str(BLEND))
    hide_non_body()
    enhance_skin()
    bobj = body()
    # subdiv for smoother skin
    if not any(m.type == "SUBSURF" for m in bobj.modifiers):
        m = bobj.modifiers.new("skin_subdiv", "SUBSURF")
        m.levels = 1
        m.render_levels = 2
    else:
        for m in bobj.modifiers:
            if m.type == "SUBSURF":
                m.render_levels = max(m.render_levels, 2)
                m.show_render = True

    setup_eevee_quality()
    render_angles(BODY_ANGLES, 0.52, 55, "body")
    render_angles(HEAD_ANGLES, 0.86, 85, "skin")

    bpy.ops.wm.save_as_mainfile(filepath=str(ROOT / "AmojiSakura_realistic_hyper.blend"))
    print("done")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("FATAL", e)
        import traceback

        traceback.print_exc()
        sys.exit(1)
