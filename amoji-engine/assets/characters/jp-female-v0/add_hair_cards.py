"""
Add exportable long dark hair mesh (hair cards) to Sakura blends.
Particle hair does not survive glTF well — this adds a visible long-hair mesh.
Also ensures wardrobe exists.
"""
from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent


def mat(name, color, roughness=0.45):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.35
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m


def body_obj():
    for o in bpy.data.objects:
        if o.type == "MESH" and ("body" in o.name.lower() or o.name.endswith("_body")):
            return o
    return next(o for o in bpy.data.objects if o.type == "MESH")


def bounds(obj):
    bb = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
    xs = [v.x for v in bb]
    ys = [v.y for v in bb]
    zs = [v.z for v in bb]
    return min(xs), max(xs), min(ys), max(ys), min(zs), max(zs)


def add_long_hair_cards(prefix: str, dark=(0.05, 0.03, 0.02)):
    # Remove prior cards
    for o in list(bpy.data.objects):
        if o.name.startswith(f"{prefix}_haircard"):
            bpy.data.objects.remove(o, do_unlink=True)

    body = body_obj()
    xmin, xmax, ymin, ymax, zmin, zmax = bounds(body)
    cx = (xmin + xmax) / 2
    cy = (ymin + ymax) / 2
    sz = zmax - zmin
    sx = xmax - xmin
    head_z = zmin + sz * 0.88
    scalp_r = sx * 0.18
    hair_mat = mat(f"{prefix}_hair_mat", dark, roughness=0.38)

    cards = []
    # Long rear / side strands as tapered ribbons
    for i, (ang, length, width, y_bias) in enumerate(
        [
            (math.pi * 0.5, sz * 0.55, sx * 0.22, 0.15),  # back center
            (math.pi * 0.35, sz * 0.52, sx * 0.16, 0.12),
            (math.pi * 0.65, sz * 0.52, sx * 0.16, 0.12),
            (math.pi * 0.2, sz * 0.48, sx * 0.12, 0.05),
            (math.pi * 0.8, sz * 0.48, sx * 0.12, 0.05),
            (math.pi * 0.1, sz * 0.42, sx * 0.10, -0.02),  # front side L
            (math.pi * 0.9, sz * 0.42, sx * 0.10, -0.02),  # front side R
            (math.pi * 0.45, sz * 0.50, sx * 0.14, 0.18),
            (math.pi * 0.55, sz * 0.50, sx * 0.14, 0.18),
        ]
    ):
        steps = 10
        verts = []
        faces = []
        for s in range(steps):
            t = s / (steps - 1)
            # hang down with slight curve toward back
            z = head_z - length * t
            flare = 1.0 + 0.35 * t
            r = scalp_r * (0.9 + 0.35 * t)
            x = cx + math.cos(ang) * r * flare * 0.35
            y = cy + math.sin(ang) * r * flare * 0.55 + y_bias * sx * (1 - t * 0.3)
            w = width * (1.0 - 0.55 * t)
            # two edges of card
            side = Vector((-math.sin(ang), math.cos(ang), 0)).normalized() * (w * 0.5)
            verts.append((x + side.x, y + side.y, z))
            verts.append((x - side.x, y - side.y, z))
        for s in range(steps - 1):
            a = s * 2
            faces.append((a, a + 1, a + 3, a + 2))
        mesh = bpy.data.meshes.new(f"{prefix}_haircard{i}_mesh")
        mesh.from_pydata(verts, [], faces)
        mesh.update()
        obj = bpy.data.objects.new(f"{prefix}_haircard{i}", mesh)
        bpy.context.scene.collection.objects.link(obj)
        if obj.data.materials:
            obj.data.materials[0] = hair_mat
        else:
            obj.data.materials.append(hair_mat)
        obj.parent = body
        cards.append(obj)

    # Simple scalp cap
    cap_verts = []
    cap_faces = []
    seg = 16
    rings = 4
    for ri in range(rings):
        rt = ri / (rings - 1)
        z = head_z + sz * 0.02 * (1 - rt) - sz * 0.01
        r = scalp_r * (0.15 + 0.85 * rt)
        for si in range(seg):
            a = (si / seg) * math.tau
            cap_verts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.85 + sx * 0.02, z))
    for ri in range(rings - 1):
        for si in range(seg):
            a = ri * seg + si
            b = ri * seg + (si + 1) % seg
            c = (ri + 1) * seg + (si + 1) % seg
            d = (ri + 1) * seg + si
            cap_faces.append((a, b, c, d))
    cap_mesh = bpy.data.meshes.new(f"{prefix}_scalpcap_mesh")
    cap_mesh.from_pydata(cap_verts, [], cap_faces)
    cap_mesh.update()
    cap = bpy.data.objects.new(f"{prefix}_scalpcap", cap_mesh)
    bpy.context.scene.collection.objects.link(cap)
    if cap.data.materials:
        cap.data.materials[0] = hair_mat
    else:
        cap.data.materials.append(hair_mat)
    cap.parent = body
    cards.append(cap)
    print(f"added {len(cards)} hair meshes")
    return cards


def process(blend: Path, prefix: str):
    bpy.ops.wm.open_mainfile(filepath=str(blend))
    add_long_hair_cards(prefix)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    glb = blend.with_suffix(".glb")
    bpy.ops.export_scene.gltf(filepath=str(glb), export_format="GLB", export_apply=True, export_animations=False)
    print("updated", blend.name)


def main():
    process(ROOT / "AmojiSakura_realistic.blend", "AmojiSakura_realistic")
    process(ROOT / "AmojiSakura_stylized.blend", "AmojiSakura_stylized")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("FATAL", e)
        import traceback

        traceback.print_exc()
        sys.exit(1)
