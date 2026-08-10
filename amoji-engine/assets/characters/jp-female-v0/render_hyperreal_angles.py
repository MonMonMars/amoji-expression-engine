"""
Hyper-real skin pass + multi-angle Cycles renders for AmojiSakura_realistic.
Uses existing MB-Lab Asian albedo / bump / melanin maps + principled SSS.
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Euler, Vector

ROOT = Path(__file__).resolve().parent
BLEND = ROOT / "AmojiSakura_realistic.blend"
TEX_DIR = Path("/agent/tools/MB-Lab/MB-Lab-master/data/textures")
OUT = ROOT / "renders_hyperreal"
ANGLES = {
    "front": (0.0, -2.55, 0.52),
    "threequarter_left": (1.55, -2.15, 0.55),
    "threequarter_right": (-1.55, -2.15, 0.55),
    "side_left": (2.45, 0.05, 0.55),
    "side_right": (-2.45, 0.05, 0.55),
    "back": (0.15, 2.55, 0.55),
    "high_threequarter": (1.2, -2.0, 1.05),
}
HEAD_ANGLES = {
    "head_front": (0.05, -0.95, 0.88),
    "head_threequarter_left": (0.65, -0.85, 0.90),
    "head_threequarter_right": (-0.65, -0.85, 0.90),
    "head_side_left": (1.05, 0.05, 0.90),
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
        "zmax": max(zs),
        "sz": max(zs) - min(zs),
        "center": Vector(((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2)),
    }


def load_img(path: Path):
    for img in bpy.data.images:
        if img.filepath.endswith(path.name) or img.name == path.name:
            return img
    if not path.is_file():
        return None
    img = bpy.data.images.load(str(path))
    img.name = path.name
    return img


def enhance_skin_materials():
    """Push MB-Lab skin toward more believable Cycles look."""
    rough = load_img(TEX_DIR / "human_female_roughness.png")
    albedo = load_img(TEX_DIR / "hum_f_asian_albedo.png")
    bump = load_img(TEX_DIR / "human_female_bump.png")

    for mat in bpy.data.materials:
        if not mat or not mat.use_nodes:
            continue
        name = mat.name.lower()
        if "skin" not in name and "skn" not in name:
            continue
        nt = mat.node_tree
        nodes, links = nt.nodes, nt.links

        # Find principled nodes (may be inside group; also add outer override)
        principleds = [n for n in nodes if n.type == "BSDF_PRINCIPLED"]
        if not principleds:
            # Create a Cycles-friendly override layered after group if possible
            out = next((n for n in nodes if n.type == "OUTPUT_MATERIAL"), None)
            if not out:
                continue
            bsdf = nodes.new("ShaderNodeBsdfPrincipled")
            bsdf.location = (-200, 0)
            # Try to use albedo texture if present
            tex = nodes.new("ShaderNodeTexImage")
            tex.location = (-600, 0)
            if albedo:
                tex.image = albedo
                links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
            links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
            principleds = [bsdf]

        for bsdf in principleds:
            # Subsurface for flesh
            if "Subsurface Weight" in bsdf.inputs:
                bsdf.inputs["Subsurface Weight"].default_value = 0.18
            elif "Subsurface" in bsdf.inputs:
                bsdf.inputs["Subsurface"].default_value = 0.18
            if "Subsurface Radius" in bsdf.inputs:
                bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.35, 0.2)
            if "Subsurface Color" in bsdf.inputs and albedo:
                # warm flesh fallback
                bsdf.inputs["Subsurface Color"].default_value = (0.85, 0.45, 0.35, 1.0)
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = 0.42
            if "Specular IOR Level" in bsdf.inputs:
                bsdf.inputs["Specular IOR Level"].default_value = 0.45
            elif "Specular" in bsdf.inputs:
                bsdf.inputs["Specular"].default_value = 0.45
            if "Sheen Weight" in bsdf.inputs:
                bsdf.inputs["Sheen Weight"].default_value = 0.08

            # Wire roughness map if available and not already linked
            if rough and not bsdf.inputs["Roughness"].is_linked:
                tex_r = nodes.new("ShaderNodeTexImage")
                tex_r.image = rough
                tex_r.location = (-650, -250)
                try:
                    rough.colorspace_settings.name = "Non-Color"
                except Exception:
                    pass
                links.new(tex_r.outputs["Color"], bsdf.inputs["Roughness"])

            # Bump from bump map if Normal not linked
            if bump and "Normal" in bsdf.inputs and not bsdf.inputs["Normal"].is_linked:
                tex_b = nodes.new("ShaderNodeTexImage")
                tex_b.image = bump
                tex_b.location = (-650, -500)
                try:
                    bump.colorspace_settings.name = "Non-Color"
                except Exception:
                    pass
                bump_node = nodes.new("ShaderNodeBump")
                bump_node.inputs["Strength"].default_value = 0.35
                bump_node.location = (-350, -450)
                links.new(tex_b.outputs["Color"], bump_node.inputs["Height"])
                links.new(bump_node.outputs["Normal"], bsdf.inputs["Normal"])

        print(f"enhanced skin mat: {mat.name}")


def setup_cycles():
    scn = bpy.context.scene
    scn.render.engine = "CYCLES"
    scn.cycles.device = "CPU"
    scn.cycles.samples = 128
    scn.cycles.use_denoising = False  # apt Blender build has no OpenImageDenoiser
    scn.render.resolution_x = 1024
    scn.render.resolution_y = 1280
    scn.render.image_settings.file_format = "PNG"
    scn.render.film_transparent = False
    # World soft gray
    world = bpy.data.worlds.new("StudioWorld") if "StudioWorld" not in bpy.data.worlds else bpy.data.worlds["StudioWorld"]
    scn.world = world
    world.use_nodes = True
    nt = world.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Color"].default_value = (0.08, 0.08, 0.09, 1)
    bg.inputs["Strength"].default_value = 0.6
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def clear_lights_cams():
    for o in list(bpy.data.objects):
        if o.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(o, do_unlink=True)


def studio_lights(b):
    cx, cy, zmin, sz = b["cx"], b["cy"], b["zmin"], b["sz"]
    specs = [
        ("key", "AREA", (cx + 1.6, cy - 1.8, zmin + sz * 0.95), 450, 2.5),
        ("fill", "AREA", (cx - 1.8, cy - 1.2, zmin + sz * 0.75), 160, 3.0),
        ("rim", "AREA", (cx - 0.3, cy + 2.0, zmin + sz * 0.9), 220, 2.0),
        ("head", "AREA", (cx + 0.4, cy - 0.9, zmin + sz * 1.05), 90, 1.2),
    ]
    for name, typ, loc, energy, size in specs:
        data = bpy.data.lights.new(name, typ)
        data.energy = energy
        if typ == "AREA":
            data.size = size
            data.color = (1.0, 0.97, 0.94)
        obj = bpy.data.objects.new(name, data)
        bpy.context.scene.collection.objects.link(obj)
        obj.location = loc
        # Aim roughly at torso
        target = Vector((cx, cy, zmin + sz * 0.6))
        obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def aim_camera(loc, look_at):
    cam_data = bpy.data.cameras.new("render_cam")
    cam = bpy.data.objects.new("render_cam", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    cam.location = loc
    cam.rotation_euler = (look_at - loc).to_track_quat("-Z", "Y").to_euler()
    return cam


def ensure_subdiv(body_obj):
    has = any(m.type == "SUBSURF" for m in body_obj.modifiers)
    if not has:
        m = body_obj.modifiers.new("skin_subdiv", "SUBSURF")
        m.levels = 1
        m.render_levels = 2
    else:
        for m in body_obj.modifiers:
            if m.type == "SUBSURF":
                m.render_levels = max(m.render_levels, 2)


def hide_proxy_wardrobe(hide=True):
    """Optional: hide crude proxy clothes for nude-skin study renders — keep modest parts."""
    # Keep clothes for character context; only hide haircards that clip badly if needed.
    pass


def render_set(angle_map, look_factor_z, lens, tag_prefix):
    bobj = body()
    b = bounds(bobj)
    look = Vector((b["cx"], b["cy"], b["zmin"] + b["sz"] * look_factor_z))
    for name, offset in angle_map.items():
        clear_lights_cams()
        studio_lights(b)
        loc = Vector((b["cx"] + offset[0], b["cy"] + offset[1], b["zmin"] + b["sz"] * offset[2]))
        cam = aim_camera(loc, look)
        cam.data.lens = lens
        out = OUT / f"{tag_prefix}_{name}.png"
        bpy.context.scene.render.filepath = str(out)
        print(f"rendering {out.name} …")
        bpy.ops.render.render(write_still=True)
        print(f"saved {out}")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.open_mainfile(filepath=str(BLEND))
    bobj = body()
    enhance_skin_materials()
    ensure_subdiv(bobj)
    setup_cycles()

    # Full-body angles
    render_set(ANGLES, look_factor_z=0.52, lens=55, tag_prefix="body")
    # Head / bust closeups for skin detail
    render_set(HEAD_ANGLES, look_factor_z=0.86, lens=85, tag_prefix="skin")

    # Save enhanced blend
    out_blend = ROOT / "AmojiSakura_realistic_hyper.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(out_blend))
    print("saved", out_blend)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("FATAL", e)
        import traceback

        traceback.print_exc()
        sys.exit(1)
