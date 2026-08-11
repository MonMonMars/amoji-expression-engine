"""
Export Amoji Sakura LO + HI poly GLBs with emotion morph targets.
HI keeps full MB-Lab expression shapekeys.
LO is decimated; 8 combined emotion shapes are transferred via bake→decimate→join.
"""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "AmojiSakura_realistic_hyper.blend"
OUT = ROOT / "lod"
MAP_OUT = ROOT / "emotion_morph_map.json"
# ROOT = .../jp-female-v0 → parents[2] = amoji-engine
SCULPT_JSON = ROOT.parents[2] / "data" / "emotions" / "intensity-sculpt-recipes.json"

# Hand-tuned intensity sculpts (not linear scales of peak)
with SCULPT_JSON.open() as f:
    _SCULPT = json.load(f)

EMOTION_TIER_RECIPES = _SCULPT["recipes"]
INTENSITY_SCULPTS = tuple(
    (tier, float(val)) for tier, val in _SCULPT["tiers"].items()
)
# Peak recipes kept for docs / legacy single-pose references
EMOTION_RECIPES = {
    emo: tiers.get("peak", {}) for emo, tiers in EMOTION_TIER_RECIPES.items()
}


def body():
    return next(o for o in bpy.data.objects if o.type == "MESH" and "body" in o.name.lower())


def hide_extras():
    for o in bpy.data.objects:
        if o.type == "MESH":
            keep = "body" in o.name.lower() and "hair" not in o.name.lower()
            o.hide_render = not keep
            o.hide_viewport = not keep
            o.hide_set(not keep)
        elif o.type == "ARMATURE":
            o.hide_render = False
            o.hide_viewport = False
            o.hide_set(False)
        if "hair" in o.name.lower():
            o.hide_set(True)
            o.hide_render = True


def reset_keys(obj):
    if not obj.data.shape_keys:
        return
    for kb in obj.data.shape_keys.key_blocks:
        kb.value = 0.0


def set_recipe(obj, recipe, intensity=1.0):
    reset_keys(obj)
    keys = {kb.name: kb for kb in obj.data.shape_keys.key_blocks}
    for name, w in recipe.items():
        if name in keys:
            keys[name].value = max(0.0, min(1.0, w * intensity))
    bpy.context.view_layer.update()


def bake_emotion_shapekeys(obj):
    """Create EMO_* shapekeys from hand-tuned tier recipes."""
    if not obj.data.shape_keys:
        obj.shape_key_add(name="Basis", from_mix=False)
    reset_keys(obj)
    bpy.context.view_layer.update()

    sk = obj.data.shape_keys
    to_remove = [kb for kb in sk.key_blocks if kb.name.startswith("EMO_")]
    for kb in to_remove:
        obj.shape_key_remove(kb)

    for emo, tiers in EMOTION_TIER_RECIPES.items():
        for tier, _intensity_mark in INTENSITY_SCULPTS:
            recipe = tiers.get(tier) or tiers.get("peak") or {}
            set_recipe(obj, recipe, 1.0)  # recipe already encodes intensity pose
            name = f"EMO_{emo}_{tier}"
            kb = obj.shape_key_add(name=name, from_mix=True)
            kb.value = 0.0
            print("baked", kb.name, flush=True)
        # Legacy alias = peak
        set_recipe(obj, tiers.get("peak") or {}, 1.0)
        kb = obj.shape_key_add(name=f"EMO_{emo}", from_mix=True)
        kb.value = 0.0
        print("baked", kb.name, "(legacy=peak)", flush=True)
    reset_keys(obj)


def duplicate_object(obj, name):
    dup = obj.copy()
    dup.data = obj.data.copy()
    dup.name = name
    dup.data.name = name + "_mesh"
    bpy.context.collection.objects.link(dup)
    return dup


def mesh_from_shapekey(obj, key_name, out_name, decimate_ratio=None):
    """Bake one shapekey to a static mesh (armature off so topology stays body-only)."""
    reset_keys(obj)
    if obj.data.shape_keys and key_name in obj.data.shape_keys.key_blocks:
        obj.data.shape_keys.key_blocks[key_name].value = 1.0

    # Disable deform modifiers — evaluated mesh must match body vertex count.
    mod_restore = []
    for mod in obj.modifiers:
        mod_restore.append((mod, mod.show_viewport))
        mod.show_viewport = False

    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    eval_obj = obj.evaluated_get(dg)
    mesh = bpy.data.meshes.new_from_object(eval_obj)
    mesh.name = out_name + "_mesh"
    dup = bpy.data.objects.new(out_name, mesh)
    bpy.context.collection.objects.link(dup)

    for mod, prev in mod_restore:
        mod.show_viewport = prev
    reset_keys(obj)

    bpy.ops.object.select_all(action="DESELECT")
    dup.select_set(True)
    bpy.context.view_layer.objects.active = dup

    if decimate_ratio and decimate_ratio < 0.999:
        mod = dup.modifiers.new("decimate", "DECIMATE")
        mod.decimate_type = "COLLAPSE"
        mod.ratio = decimate_ratio
        bpy.ops.object.modifier_apply(modifier="decimate")
    print(f"  {out_name} verts={len(dup.data.vertices)}", flush=True)
    return dup


def shrinkwrap_pose(lo_basis, hi_obj, key_name, out_name):
    """Copy LO topology, pull verts onto HI posed surface — identical vert count."""
    reset_keys(hi_obj)
    if hi_obj.data.shape_keys and key_name in hi_obj.data.shape_keys.key_blocks:
        hi_obj.data.shape_keys.key_blocks[key_name].value = 1.0

    mod_restore = []
    for mod in hi_obj.modifiers:
        mod_restore.append((mod, mod.show_viewport))
        mod.show_viewport = False

    bpy.context.view_layer.update()

    dup = lo_basis.copy()
    dup.data = lo_basis.data.copy()
    dup.name = out_name
    dup.data.name = out_name + "_mesh"
    bpy.context.collection.objects.link(dup)

    bpy.ops.object.select_all(action="DESELECT")
    dup.select_set(True)
    bpy.context.view_layer.objects.active = dup
    mod = dup.modifiers.new("sw", "SHRINKWRAP")
    mod.target = hi_obj
    mod.wrap_method = "NEAREST_SURFACEPOINT"
    bpy.ops.object.modifier_apply(modifier="sw")

    for m, prev in mod_restore:
        m.show_viewport = prev
    reset_keys(hi_obj)
    print(f"  {out_name} verts={len(dup.data.vertices)}", flush=True)
    return dup


def lo_emotion_key_names():
    """EMO morph names transferred to LO (tiers + legacy peak alias)."""
    names = []
    for emo in EMOTION_RECIPES:
        for tier, _ in INTENSITY_SCULPTS:
            names.append(f"EMO_{emo}_{tier}")
        names.append(f"EMO_{emo}")
    return names


def strip_non_emo_shapekeys(obj):
    """Keep basis + EMO_* only — shrinks LO evaluate/decimate cost."""
    if not obj.data.shape_keys:
        return
    keep = {"basis"}
    keep.update(lo_emotion_key_names())
    # MB-Lab basis may be lowercase
    for kb in list(obj.data.shape_keys.key_blocks):
        if kb.name.lower() == "basis":
            continue
        if kb.name not in keep:
            obj.shape_key_remove(kb)
    print("LO src keys", len(obj.data.shape_keys.key_blocks), flush=True)


def build_lo(src, ratio=0.2):
    """Decimate basis once, then shrinkwrap each EMO pose onto that LO topology."""
    strip_non_emo_shapekeys(src)

    basis_name = "basis"
    if src.data.shape_keys:
        for kb in src.data.shape_keys.key_blocks:
            if kb.name.lower() == "basis":
                basis_name = kb.name
                break

    print("LO building basis (single decimate)…", flush=True)
    lo_basis = mesh_from_shapekey(src, basis_name, "LO_basis", ratio)
    rename = {"LO_basis": "basis"}
    parts = [lo_basis]

    keys = lo_emotion_key_names()
    for i, key_name in enumerate(keys):
        safe = key_name.replace("EMO_", "LO_")
        print(f"LO shrinkwrap {i+1}/{len(keys)} {key_name}", flush=True)
        parts.append(shrinkwrap_pose(lo_basis, src, key_name, safe))
        rename[safe] = key_name

    counts = {p.name: len(p.data.vertices) for p in parts}
    print("LO vert counts", counts, flush=True)
    basis_count = len(parts[0].data.vertices)
    mismatched = [n for n, c in counts.items() if c != basis_count]
    if mismatched:
        raise RuntimeError(
            f"LO join_shapes blocked — vertex mismatch vs basis {basis_count}: {mismatched[:8]}"
        )

    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join_shapes()

    lo = parts[0]
    if lo.data.shape_keys:
        for kb in lo.data.shape_keys.key_blocks:
            if kb.name in rename:
                kb.name = rename[kb.name]

    for p in parts[1:]:
        mesh = p.data
        bpy.data.objects.remove(p, do_unlink=True)
        if mesh and mesh.users == 0:
            bpy.data.meshes.remove(mesh)

    lo.name = "Sakura_LO"
    nkeys = len(lo.data.shape_keys.key_blocks) if lo.data.shape_keys else 0
    print("LO verts", len(lo.data.vertices), "keys", nkeys, flush=True)
    return lo


def export_glb(path, objects):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objects:
        if o:
            o.hide_set(False)
            o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.export_scene.gltf(
        filepath=str(path),
        use_selection=True,
        export_format="GLB",
        export_apply=False,
        export_animations=True,
        export_morph=True,
        export_skins=True,
    )
    print("exported", path, "size", path.stat().st_size)


def add_idle_animation(arm):
    """Simple idle: slight spine/head sway for movement test."""
    if not arm:
        return
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode="POSE")
    action = bpy.data.actions.new("IdleSway")
    arm.animation_data_create()
    arm.animation_data.action = action

    def bone(name_substr):
        for b in arm.pose.bones:
            if name_substr.lower() in b.name.lower():
                return b
        return None

    targets = [
        (bone("spine"), "rotation_euler", 2, 0.04),
        (bone("head"), "rotation_euler", 2, 0.06),
        (bone("neck"), "rotation_euler", 0, 0.03),
    ]
    for pb, data_path, axis, amp in targets:
        if not pb:
            continue
        pb.rotation_mode = "XYZ"
        for frame, val in [(1, 0.0), (40, amp), (80, -amp), (120, 0.0)]:
            bpy.context.scene.frame_set(frame)
            pb.rotation_euler[axis] = val
            pb.keyframe_insert(data_path="rotation_euler", index=axis, frame=frame)
    bpy.ops.object.mode_set(mode="OBJECT")
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 120
    print("idle animation added")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    skip_hi = os.environ.get("SKIP_HI", "").strip() in ("1", "true", "yes")
    bpy.ops.wm.open_mainfile(filepath=str(SRC))
    hide_extras()
    src = body()
    arm = next((o for o in bpy.data.objects if o.type == "ARMATURE"), None)

    bake_emotion_shapekeys(src)
    if not skip_hi:
        add_idle_animation(arm)
        hi_path = OUT / "sakura_hi.glb"
        export_glb(hi_path, [src, arm] if arm else [src])
    else:
        print("SKIP_HI=1 — keeping existing sakura_hi.glb", flush=True)

    # LO build from a duplicate of src (with EMO keys)
    src_dup = duplicate_object(src, "Sakura_HI_src")
    lo = build_lo(src_dup, ratio=0.18)
    lo_path = OUT / "sakura_lo.glb"
    export_glb(lo_path, [lo])

    hi_morphs = [kb.name for kb in src.data.shape_keys.key_blocks] if src.data.shape_keys else []
    meta = {
        "emotions": list(EMOTION_RECIPES.keys()),
        "intensitySculpts": {tier: intensity for tier, intensity in INTENSITY_SCULPTS},
        "hi": {
            "file": "lod/sakura_hi.glb",
            "verts": len(src.data.vertices),
            "morphs": hi_morphs,
        },
        "lo": {
            "file": "lod/sakura_lo.glb",
            "verts": len(lo.data.vertices),
            "morphs": [kb.name for kb in lo.data.shape_keys.key_blocks] if lo.data.shape_keys else [],
        },
        "recipes": EMOTION_RECIPES,
        "tierRecipes": EMOTION_TIER_RECIPES,
        "sculptSource": "data/emotions/intensity-sculpt-recipes.json",
    }
    MAP_OUT.write_text(json.dumps(meta, indent=2))
    (OUT / "emotion_morph_map.json").write_text(json.dumps(meta, indent=2))
    print(json.dumps({k: meta[k] for k in ("emotions", "intensitySculpts")}, indent=2), flush=True)
    print("HI verts", meta["hi"]["verts"], "LO verts", meta["lo"]["verts"], flush=True)
    print("wrote", MAP_OUT, flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("FATAL", e, flush=True)
        import traceback

        traceback.print_exc()
        sys.exit(1)
