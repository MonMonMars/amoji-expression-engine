"""Improve wardrobe fit (shrinkwrap) + rebuild hanging long hair for Sakura blends."""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent


def body_of(prefix):
    for n in (f"{prefix}_body",):
        if n in bpy.data.objects:
            return bpy.data.objects[n]
    for o in bpy.data.objects:
        if o.type == "MESH" and "body" in o.name.lower():
            return o
    return next(o for o in bpy.data.objects if o.type == "MESH")


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
        "sx": max(xs) - min(xs),
        "sy": max(ys) - min(ys),
        "sz": max(zs) - min(zs),
    }


def mat(name, color, roughness=0.5):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m


def clear_prefix_meshes(prefix, keys):
    for o in list(bpy.data.objects):
        if any(o.name.startswith(f"{prefix}_{k}") for k in keys):
            bpy.data.objects.remove(o, do_unlink=True)


def tube(name, cx, cy, z0, z1, r0, r1, segments, y_scale, material, body):
    verts, faces = [], []
    for i in range(segments):
        a0 = i / segments * math.tau
        a1 = (i + 1) / segments * math.tau
        for a, z, r in ((a0, z0, r0), (a0, z1, r1), (a1, z1, r1), (a1, z0, r0)):
            verts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * y_scale, z))
        b = i * 4
        faces.append((b, b + 1, b + 2, b + 3))
    me = bpy.data.meshes.new(name + "_mesh")
    me.from_pydata(verts, [], faces)
    me.update()
    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.materials.append(material)
    # Shrinkwrap to hug body
    sw = obj.modifiers.new("fit", "SHRINKWRAP")
    sw.target = body
    sw.wrap_method = "NEAREST_SURFACEPOINT"
    sw.offset = 0.008
    obj.parent = body
    return obj


def rebuild_wardrobe(prefix, dark_hair=True):
    body = body_of(prefix)
    b = bounds(body)
    cx, cy = b["cx"], b["cy"]
    zmin, sz = b["zmin"], b["sz"]
    base_r = max(b["sx"], b["sy"]) * 0.20

    clear_prefix_meshes(
        prefix,
        ["blouse", "collar", "skirt", "ribbon", "bra", "briefs", "haircard", "scalpcap"],
    )

    navy = mat(f"{prefix}_navy", (0.07, 0.10, 0.26), 0.62)
    white = mat(f"{prefix}_white", (0.93, 0.93, 0.95), 0.42)
    red = mat(f"{prefix}_red", (0.62, 0.07, 0.10), 0.48)
    under = mat(f"{prefix}_under", (0.96, 0.96, 0.98), 0.4)
    hair_c = (0.035, 0.022, 0.015) if dark_hair else (0.04, 0.03, 0.02)
    hair_mat = mat(f"{prefix}_hair_mat", hair_c, 0.35)

    z_chest = zmin + sz * 0.70
    z_waist = zmin + sz * 0.55
    z_hip = zmin + sz * 0.50
    z_hem = zmin + sz * 0.36
    z_neck = zmin + sz * 0.80
    z_collar = zmin + sz * 0.83

    # Underlayer (hidden under clothes; slight negative offset via smaller radius then wrap)
    tube(f"{prefix}_bra", cx, cy, z_chest - sz * 0.025, z_chest + sz * 0.02, base_r * 0.92, base_r * 0.98, 28, 0.72, under, body)
    tube(f"{prefix}_briefs", cx, cy, z_hip - sz * 0.045, z_waist - sz * 0.005, base_r * 0.88, base_r * 0.96, 28, 0.75, under, body)

    # Blouse + skirt + collar
    tube(f"{prefix}_blouse", cx, cy, z_waist, z_neck, base_r * 1.02, base_r * 0.78, 32, 0.70, white, body)
    tube(f"{prefix}_skirt", cx, cy, z_waist, z_hem, base_r * 1.05, base_r * 1.45, 36, 0.82, navy, body)
    collar = tube(f"{prefix}_collar", cx, cy, z_neck, z_collar + sz * 0.015, base_r * 0.75, base_r * 1.20, 32, 0.85, navy, body)
    # Pull collar slightly back
    for v in collar.data.vertices:
        co = collar.matrix_world @ v.co
        if (co.y - cy) > 0:
            v.co.y += 0.01

    # Ribbon at front neck
    rw, rh, rd = base_r * 0.28, sz * 0.035, base_r * 0.12
    rv = [
        (cx - rw, cy - base_r * 0.85 - rd, z_neck - rh),
        (cx + rw, cy - base_r * 0.85 - rd, z_neck - rh),
        (cx + rw, cy - base_r * 0.85 + rd, z_neck - rh),
        (cx - rw, cy - base_r * 0.85 + rd, z_neck - rh),
        (cx - rw, cy - base_r * 0.85 - rd, z_neck + rh),
        (cx + rw, cy - base_r * 0.85 - rd, z_neck + rh),
        (cx + rw, cy - base_r * 0.85 + rd, z_neck + rh),
        (cx - rw, cy - base_r * 0.85 + rd, z_neck + rh),
    ]
    rf = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    rmesh = bpy.data.meshes.new(f"{prefix}_ribbon_mesh")
    rmesh.from_pydata(rv, [], rf)
    ribbon = bpy.data.objects.new(f"{prefix}_ribbon", rmesh)
    bpy.context.scene.collection.objects.link(ribbon)
    ribbon.data.materials.append(red)
    ribbon.parent = body

    # Long hair cards hanging from crown
    head_z = zmin + sz * 0.90
    scalp_r = b["sx"] * 0.16
    for i, ang in enumerate([0.5, 0.35, 0.65, 0.25, 0.75, 0.15, 0.85, 0.45, 0.55, 0.4, 0.6]):
        ang *= math.pi
        length = sz * (0.50 + 0.06 * math.sin(i))
        width = b["sx"] * (0.10 + 0.04 * (i % 3))
        steps = 12
        verts = []
        faces = []
        for s in range(steps):
            t = s / (steps - 1)
            z = head_z - length * (t ** 0.9)
            # swing toward back as it lengthens
            back = 0.25 * t
            r = scalp_r * (0.55 + 0.9 * t)
            x = cx + math.cos(ang) * r * 0.55
            y = cy + math.sin(ang) * r * 0.35 + b["sy"] * back
            w = width * (1.0 - 0.6 * t)
            side = Vector((-math.sin(ang), math.cos(ang), 0)).normalized() * (w * 0.5)
            verts.append((x + side.x, y + side.y, z))
            verts.append((x - side.x, y - side.y, z))
        for s in range(steps - 1):
            a = s * 2
            faces.append((a, a + 1, a + 3, a + 2))
        me = bpy.data.meshes.new(f"{prefix}_haircard{i}_mesh")
        me.from_pydata(verts, [], faces)
        obj = bpy.data.objects.new(f"{prefix}_haircard{i}", me)
        bpy.context.scene.collection.objects.link(obj)
        obj.data.materials.append(hair_mat)
        obj.parent = body

    # Scalp cap
    cap_v, cap_f = [], []
    seg, rings = 18, 5
    for ri in range(rings):
        rt = ri / (rings - 1)
        z = head_z + sz * 0.03 * (1 - rt)
        r = scalp_r * (0.1 + 0.95 * rt)
        for si in range(seg):
            a = si / seg * math.tau
            cap_v.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.9 + b["sy"] * 0.02, z))
    for ri in range(rings - 1):
        for si in range(seg):
            a = ri * seg + si
            b0 = ri * seg + (si + 1) % seg
            c = (ri + 1) * seg + (si + 1) % seg
            d = (ri + 1) * seg + si
            cap_f.append((a, b0, c, d))
    cme = bpy.data.meshes.new(f"{prefix}_scalpcap_mesh")
    cme.from_pydata(cap_v, [], cap_f)
    cap = bpy.data.objects.new(f"{prefix}_scalpcap", cme)
    bpy.context.scene.collection.objects.link(cap)
    cap.data.materials.append(hair_mat)
    cap.parent = body

    # Apply shrinkwraps for stable export
    bpy.context.view_layer.update()
    for o in list(bpy.data.objects):
        if o.name.startswith(prefix) and o.modifiers:
            bpy.context.view_layer.objects.active = o
            o.select_set(True)
            try:
                bpy.ops.object.modifier_apply(modifier="fit")
            except Exception:
                pass
            o.select_set(False)

    print(f"{prefix}: wardrobe+hair rebuilt")


def render(blend, png, mode="full"):
    bpy.ops.wm.open_mainfile(filepath=str(blend))
    for o in list(bpy.data.objects):
        if o.type in {"CAMERA", "LIGHT"}:
            bpy.data.objects.remove(o, do_unlink=True)
    body = next(o for o in bpy.data.objects if o.type == "MESH" and "body" in o.name.lower())
    b = bounds(body)
    cx, cy, zmin, sz = b["cx"], b["cy"], b["zmin"], b["sz"]
    cam_data = bpy.data.cameras.new("c")
    cam = bpy.data.objects.new("c", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam
    if mode == "head":
        target = Vector((cx, cy, zmin + sz * 0.88))
        cam.location = (cx + 0.15, cy - 1.15, target.z)
        cam_data.lens = 85
    else:
        target = Vector((cx, cy, zmin + sz * 0.52))
        cam.location = (cx + 0.4, cy - 2.6, zmin + sz * 0.52)
        cam_data.lens = 50
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    for name, loc, en in [("k", (cx + 1.3, cy - 1.1, zmin + sz * 0.95), 320), ("f", (cx - 1.1, cy - 0.9, zmin + sz * 0.7), 110)]:
        ld = bpy.data.lights.new(name, "AREA")
        ld.energy = en
        ld.size = 2.2
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


def process(blend_name, prefix):
    path = ROOT / blend_name
    bpy.ops.wm.open_mainfile(filepath=str(path))
    rebuild_wardrobe(prefix, dark_hair=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(path))
    bpy.ops.export_scene.gltf(filepath=str(path.with_suffix(".glb")), export_format="GLB", export_apply=True, export_animations=False)


def main():
    process("AmojiSakura_realistic.blend", "AmojiSakura_realistic")
    process("AmojiSakura_stylized.blend", "AmojiSakura_stylized")
    render(ROOT / "AmojiSakura_realistic.blend", ROOT / "AmojiSakura_realistic_full.png", "full")
    render(ROOT / "AmojiSakura_realistic.blend", ROOT / "AmojiSakura_realistic_head.png", "head")
    render(ROOT / "AmojiSakura_stylized.blend", ROOT / "AmojiSakura_stylized_full.png", "full")
    render(ROOT / "AmojiSakura_stylized.blend", ROOT / "AmojiSakura_stylized_head.png", "head")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("FATAL", e)
        import traceback

        traceback.print_exc()
        sys.exit(1)
