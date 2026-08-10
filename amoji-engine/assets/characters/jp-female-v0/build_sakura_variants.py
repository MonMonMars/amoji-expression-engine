"""
Generate two Amoji character variants:
  A) stylized (MB-Lab anime female) — "not very real"
  B) realistic (MB-Lab Asian female) — higher realism base

Both: long dark hair, Japanese sailor-style school uniform, white underlayer.

Character is an ORIGINAL Amoji demo avatar inspired by soft East-Asian beauty
aesthetics (reference mood: actresses like Imada Mio). It is NOT a photoreal
celebrity likeness / deepfake.

Usage:
  PATH=/usr/bin:/bin blender -b -P build_sakura_variants.py
"""

from __future__ import annotations

import math
import os
import sys
from pathlib import Path

import bpy
import addon_utils
from mathutils import Vector

OUT = Path(__file__).resolve().parent
CHAR_NAME = "AmojiSakura"


def enable_mblab():
    mod = addon_utils.enable("mb_lab", default_set=True, persistent=True)
    if not mod:
        raise RuntimeError("mb_lab addon missing")


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name: str, color, metallic=0.0, roughness=0.55, alpha=1.0):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if "Alpha" in bsdf.inputs:
        bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1.0:
        m.blend_method = "BLEND"
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m


def assign(obj, material):
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)


def body_bounds(body):
    bb = [body.matrix_world @ Vector(c) for c in body.bound_box]
    xs = [v.x for v in bb]
    ys = [v.y for v in bb]
    zs = [v.z for v in bb]
    return {
        "min": Vector((min(xs), min(ys), min(zs))),
        "max": Vector((max(xs), max(ys), max(zs))),
        "center": Vector(((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2)),
        "size": Vector((max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))),
    }


def make_mesh(name, verts, faces, material):
    mesh = bpy.data.meshes.new(name + "_mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    assign(obj, material)
    return obj


def add_school_uniform(body, prefix: str):
    """Procedural sailor seifuku + white underlayer, sized from body bounds."""
    b = body_bounds(body)
    cx, cy, cz = b["center"]
    sx, sy, sz = b["size"]
    z0, z1 = b["min"].z, b["max"].z

    # Approximate landmarks (MB-Lab A-pose standing on XY, Z up)
    z_hip = z0 + sz * 0.52
    z_waist = z0 + sz * 0.56
    z_chest = z0 + sz * 0.70
    z_neck = z0 + sz * 0.82
    z_skirt_hem = z0 + sz * 0.38
    torso_r = max(sx, sy) * 0.22
    hip_r = max(sx, sy) * 0.24

    navy = mat(f"{prefix}_navy", (0.08, 0.12, 0.28), roughness=0.65)
    white = mat(f"{prefix}_white", (0.92, 0.92, 0.94), roughness=0.45)
    red = mat(f"{prefix}_red", (0.65, 0.08, 0.12), roughness=0.5)
    under_w = mat(f"{prefix}_under_white", (0.95, 0.95, 0.97), roughness=0.4)

    objs = []

    # --- White underwear (underlayer) ---
    # Soft bralette band
    bra_verts = []
    bra_faces = []
    segments = 24
    for i in range(segments):
        a0 = (i / segments) * math.tau
        a1 = ((i + 1) / segments) * math.tau
        for a, z, r in (
            (a0, z_chest - sz * 0.02, torso_r * 0.95),
            (a0, z_chest + sz * 0.015, torso_r * 1.02),
            (a1, z_chest + sz * 0.015, torso_r * 1.02),
            (a1, z_chest - sz * 0.02, torso_r * 0.95),
        ):
            bra_verts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.7, z))
        base = i * 4
        bra_faces.append((base, base + 1, base + 2, base + 3))
    objs.append(make_mesh(f"{prefix}_bra", bra_verts, bra_faces, under_w))

    # Briefs
    brief_verts = []
    brief_faces = []
    for i in range(segments):
        a0 = (i / segments) * math.tau
        a1 = ((i + 1) / segments) * math.tau
        for a, z, r in (
            (a0, z_hip - sz * 0.04, hip_r * 0.85),
            (a0, z_waist - sz * 0.01, hip_r * 0.95),
            (a1, z_waist - sz * 0.01, hip_r * 0.95),
            (a1, z_hip - sz * 0.04, hip_r * 0.85),
        ):
            brief_verts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.75, z))
        base = i * 4
        brief_faces.append((base, base + 1, base + 2, base + 3))
    objs.append(make_mesh(f"{prefix}_briefs", brief_verts, brief_faces, under_w))

    # --- Sailor blouse (white body + navy collar) ---
    blouse_verts = []
    blouse_faces = []
    for i in range(segments):
        a0 = (i / segments) * math.tau
        a1 = ((i + 1) / segments) * math.tau
        for a, z, r in (
            (a0, z_waist, torso_r * 1.05),
            (a0, z_neck - sz * 0.02, torso_r * 0.72),
            (a1, z_neck - sz * 0.02, torso_r * 0.72),
            (a1, z_waist, torso_r * 1.05),
        ):
            blouse_verts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.72, z))
        base = i * 4
        blouse_faces.append((base, base + 1, base + 2, base + 3))
    objs.append(make_mesh(f"{prefix}_blouse", blouse_verts, blouse_faces, white))

    # Navy sailor collar (flat ring flare)
    collar_verts = []
    collar_faces = []
    for i in range(segments):
        a0 = (i / segments) * math.tau
        a1 = ((i + 1) / segments) * math.tau
        for a, z, r in (
            (a0, z_neck - sz * 0.01, torso_r * 0.7),
            (a0, z_neck + sz * 0.01, torso_r * 1.15),
            (a1, z_neck + sz * 0.01, torso_r * 1.15),
            (a1, z_neck - sz * 0.01, torso_r * 0.7),
        ):
            # Bias collar toward back
            bias = 0.85 if math.sin(a) > 0 else 1.15
            collar_verts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.7 * bias, z))
        base = i * 4
        collar_faces.append((base, base + 1, base + 2, base + 3))
    objs.append(make_mesh(f"{prefix}_collar", collar_verts, collar_faces, navy))

    # Red neckerchief / ribbon block
    rw, rh, rd = torso_r * 0.35, sz * 0.04, torso_r * 0.15
    ribbon = bpy.data.meshes.new(f"{prefix}_ribbon_mesh")
    rv = [
        (cx - rw, cy - torso_r * 0.75 - rd, z_neck - rh),
        (cx + rw, cy - torso_r * 0.75 - rd, z_neck - rh),
        (cx + rw, cy - torso_r * 0.75 + rd, z_neck - rh),
        (cx - rw, cy - torso_r * 0.75 + rd, z_neck - rh),
        (cx - rw, cy - torso_r * 0.75 - rd, z_neck + rh),
        (cx + rw, cy - torso_r * 0.75 - rd, z_neck + rh),
        (cx + rw, cy - torso_r * 0.75 + rd, z_neck + rh),
        (cx - rw, cy - torso_r * 0.75 + rd, z_neck + rh),
    ]
    rf = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    ribbon.from_pydata(rv, [], rf)
    ribbon.update()
    ribbon_obj = bpy.data.objects.new(f"{prefix}_ribbon", ribbon)
    bpy.context.scene.collection.objects.link(ribbon_obj)
    assign(ribbon_obj, red)
    objs.append(ribbon_obj)

    # Pleated skirt (navy) — tapered cylinder
    skirt_verts = []
    skirt_faces = []
    pleats = 32
    for i in range(pleats):
        a0 = (i / pleats) * math.tau
        a1 = ((i + 1) / pleats) * math.tau
        flare0 = 1.0 + 0.08 * math.sin(i * 3)
        flare1 = 1.0 + 0.08 * math.sin((i + 1) * 3)
        for a, z, flare in (
            (a0, z_waist, 1.0),
            (a0, z_skirt_hem, 1.35 * flare0),
            (a1, z_skirt_hem, 1.35 * flare1),
            (a1, z_waist, 1.0),
        ):
            r = hip_r * flare
            skirt_verts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.8, z))
        base = i * 4
        skirt_faces.append((base, base + 1, base + 2, base + 3))
    objs.append(make_mesh(f"{prefix}_skirt", skirt_verts, skirt_faces, navy))

    # Parent clothing to body for export cohesion
    for o in objs:
        o.parent = body
        o["amoji_wardrobe"] = "seifuku_v0"

    return objs


def lengthen_hair(hair_obj, length=0.55, count=1800):
    for ps in hair_obj.particle_systems:
        s = ps.settings
        s.hair_length = length
        s.count = count
        s.hair_step = 8
        s.child_type = "INTERPOLATED"
        s.rendered_child_count = 40
        s.child_length = 0.95
        try:
            s.root_radius = 0.02
        except Exception:
            pass


def create_character(character_id: str, prefix: str, young_age: float, beauty: dict, use_cycles: bool):
    from mb_lab import start_lab_session, mblab_humanoid, algorithms as mblab_algorithms

    clear_scene()
    enable_mblab()
    # re-import after clear? addon stays
    from mb_lab import start_lab_session, mblab_humanoid, algorithms as mblab_algorithms

    scn = bpy.context.scene
    scn.mblab_character_name = character_id
    scn.mblab_use_ik = False
    scn.mblab_use_muscle = False
    scn.mblab_use_cycles = use_cycles
    scn.mblab_use_eevee = not use_cycles
    scn.mblab_use_lamps = False
    scn.mblab_final_prefix = prefix
    scn.mblab_remove_all_modifiers = False

    try:
        bpy.context.preferences.addons["mb_lab"].preferences.use_censors = False
    except Exception:
        pass

    print(f"[{prefix}] create {character_id}")
    start_lab_session()
    mblab_algorithms.remove_censors()
    if not mblab_humanoid.has_data:
        raise RuntimeError("MB-Lab init failed")

    body = mblab_humanoid.get_object()

    # Phenotype / age
    if character_id == "f_as01":
        ph = os.path.join(mblab_humanoid.phenotypes_path, "east_asian.json")
        if os.path.isfile(ph):
            mblab_humanoid.load_character(ph)
    if hasattr(body, "character_age"):
        body.character_age = young_age
        mblab_humanoid.update_character(mode="update_metadata")

    for k, v in beauty.items():
        if k in mblab_humanoid.character_data:
            mblab_humanoid.character_data[k] = v
    mblab_humanoid.update_character(mode="update_all")
    mblab_humanoid.update_materials()

    # Hair BEFORE finalize (needs manuellab body + character_id on scene)
    # Prefer dark brown / black hair colors from MB-Lab presets if available
    try:
        # Enum items vary; try common dark labels
        for candidate in ("Black", "Dark_Brown", "Brunette", "brown_dark", "black"):
            try:
                scn.mblab_hair_color = candidate
                break
            except Exception:
                continue
        bpy.ops.mbast.particle_hair()
        if "Head_Hair" in bpy.data.objects:
            lengthen_hair(bpy.data.objects["Head_Hair"], length=0.62 if "an" in character_id else 0.58)
            bpy.data.objects["Head_Hair"].name = f"{prefix}_hair"
            print(f"[{prefix}] long particle hair added")
    except Exception as exc:
        print(f"[{prefix}] hair failed: {exc}")

    clothing = add_school_uniform(body, prefix)
    print(f"[{prefix}] wardrobe pieces: {len(clothing)}")

    # Finalize body shapekeys (hair/clothes remain)
    bpy.ops.mbast.finalize_character()

    # Rename body if needed
    body = next((o for o in bpy.data.objects if o.type == "MESH" and o.name.startswith(prefix)), body)

    out_blend = OUT / f"{prefix}.blend"
    out_glb = OUT / f"{prefix}.glb"
    bpy.ops.wm.save_as_mainfile(filepath=str(out_blend))

    # GLB export — particle hair may not export; that's OK for web MVP
    bpy.ops.export_scene.gltf(
        filepath=str(out_glb),
        export_format="GLB",
        export_apply=True,
        export_animations=False,
    )
    print(f"[{prefix}] saved {out_blend.name} / {out_glb.name}")
    return out_blend, out_glb


def render_preview(blend_path: Path, png_path: Path, frame="full"):
    bpy.ops.wm.open_mainfile(filepath=str(blend_path))
    for o in list(bpy.data.objects):
        if o.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(o, do_unlink=True)

    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    if not meshes:
        return
    # Prefer body mesh for framing
    body = next((o for o in meshes if "body" in o.name.lower() or o.name.endswith("_body")), meshes[0])
    b = body_bounds(body)
    cx, cy, cz = b["center"]
    sz = b["size"].z

    cam_data = bpy.data.cameras.new("preview_cam")
    cam = bpy.data.objects.new("preview_cam", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    if frame == "head":
        target = Vector((cx, cy, b["min"].z + sz * 0.88))
        cam.location = (cx + 0.1, cy - 1.0, target.z + 0.02)
        cam_data.lens = 85
    else:
        target = Vector((cx, cy, b["min"].z + sz * 0.55))
        cam.location = (cx + 0.3, cy - 2.4, b["min"].z + sz * 0.55)
        cam_data.lens = 50
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()

    light_data = bpy.data.lights.new("key", "AREA")
    light_data.energy = 250
    light_data.size = 2.0
    light = bpy.data.objects.new("key", light_data)
    bpy.context.scene.collection.objects.link(light)
    light.location = (cx + 1.2, cy - 1.0, b["min"].z + sz * 0.9)

    fill = bpy.data.lights.new("fill", "AREA")
    fill.energy = 80
    fill.size = 2.5
    fill_o = bpy.data.objects.new("fill", fill)
    bpy.context.scene.collection.objects.link(fill_o)
    fill_o.location = (cx - 1.0, cy - 0.8, b["min"].z + sz * 0.7)

    scn = bpy.context.scene
    scn.render.engine = "BLENDER_EEVEE"
    scn.render.resolution_x = 768
    scn.render.resolution_y = 1024
    scn.render.filepath = str(png_path)
    bpy.ops.render.render(write_still=True)
    print(f"rendered {png_path}")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    enable_mblab()

    # Soft pretty bias shared (adult young woman)
    beauty_real = {
        "Eyes_SizeZ": 0.40,
        "Eyes_SizeX": 0.54,
        "Nose_SizeY": 0.46,
        "Nose_BaseSizeX": 0.30,
        "Jaw_Prominence": 0.20,
        "Chin_SizeZ": 0.38,
        "Mouth_SizeX": 0.52,
        "Face_Ellipse": 0.55,
    }
    beauty_anime = {
        "Eyes_SizeZ": 0.72,
        "Eyes_SizeX": 0.70,
        "Nose_SizeY": 0.35,
        "Mouth_SizeX": 0.45,
        "Jaw_Prominence": 0.18,
    }

    create_character(
        character_id="f_as01",
        prefix=f"{CHAR_NAME}_realistic",
        young_age=-0.32,
        beauty=beauty_real,
        use_cycles=True,
    )
    create_character(
        character_id="f_an01",
        prefix=f"{CHAR_NAME}_stylized",
        young_age=-0.25,
        beauty=beauty_anime,
        use_cycles=False,
    )

    render_preview(OUT / f"{CHAR_NAME}_realistic.blend", OUT / f"{CHAR_NAME}_realistic_full.png", "full")
    render_preview(OUT / f"{CHAR_NAME}_realistic.blend", OUT / f"{CHAR_NAME}_realistic_head.png", "head")
    render_preview(OUT / f"{CHAR_NAME}_stylized.blend", OUT / f"{CHAR_NAME}_stylized_full.png", "full")
    render_preview(OUT / f"{CHAR_NAME}_stylized.blend", OUT / f"{CHAR_NAME}_stylized_head.png", "head")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("FATAL", exc, file=sys.stderr)
        import traceback

        traceback.print_exc()
        sys.exit(1)
