"""
Export Amoji Sakura LO + HI poly GLBs with emotion morph targets.
HI keeps full MB-Lab expression shapekeys.
LO is decimated; 8 combined emotion shapes are transferred via bake→decimate→join.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "AmojiSakura_realistic_hyper.blend"
OUT = ROOT / "lod"
MAP_OUT = ROOT / "emotion_morph_map.json"

# Combined emotion recipes → MB-Lab Expression_* weights (0..1)
EMOTION_RECIPES = {
    "happy": {
        "Expressions_mouthSmile_max": 0.85,
        "Expressions_mouthSmileL_max": 0.55,
        "Expressions_mouthSmileR_max": 0.55,
        "Expressions_eyeSquintL_max": 0.35,
        "Expressions_eyeSquintR_max": 0.35,
        "Expressions_browsMidVert_min": 0.15,
    },
    "sad": {
        "Expressions_mouthSmile_min": 0.55,
        "Expressions_browsMidVert_max": 0.7,
        "Expressions_browOutVertL_max": 0.35,
        "Expressions_browOutVertR_max": 0.35,
        "Expressions_eyeClosedL_max": 0.15,
        "Expressions_eyeClosedR_max": 0.15,
    },
    "angry": {
        "Expressions_browSqueezeL_max": 0.8,
        "Expressions_browSqueezeR_max": 0.8,
        "Expressions_browsMidVert_min": 0.55,
        "Expressions_mouthOpenAggr_max": 0.35,
        "Expressions_eyeSquintL_max": 0.4,
        "Expressions_eyeSquintR_max": 0.4,
        "Expressions_nostrilsExpansion_max": 0.45,
    },
    "surprised": {
        "Expressions_mouthOpenLarge_max": 0.7,
        "Expressions_browsMidVert_max": 0.85,
        "Expressions_browOutVertL_max": 0.55,
        "Expressions_browOutVertR_max": 0.55,
        "Expressions_eyeClosedL_min": 0.5,
        "Expressions_eyeClosedR_min": 0.5,
    },
    "fear": {
        "Expressions_mouthOpen_max": 0.45,
        "Expressions_browsMidVert_max": 0.6,
        "Expressions_browSqueezeL_max": 0.35,
        "Expressions_browSqueezeR_max": 0.35,
        "Expressions_eyeClosedL_min": 0.4,
        "Expressions_eyeClosedR_min": 0.4,
        "Expressions_nostrilsExpansion_max": 0.3,
    },
    "disgust": {
        "Expressions_cheekSneerL_max": 0.7,
        "Expressions_cheekSneerR_max": 0.55,
        "Expressions_nostrilsExpansion_max": 0.65,
        "Expressions_mouthBite_max": 0.4,
        "Expressions_browSqueezeL_max": 0.4,
        "Expressions_browSqueezeR_max": 0.3,
    },
    "thinking": {
        "Expressions_browOutVertL_max": 0.45,
        "Expressions_browSqueezeR_max": 0.35,
        "Expressions_mouthClosed_max": 0.4,
        "Expressions_eyesHoriz_max": 0.25,
    },
    "smile_open": {
        "Expressions_mouthSmileOpen_max": 0.85,
        "Expressions_mouthSmileL_max": 0.5,
        "Expressions_mouthSmileR_max": 0.5,
        "Expressions_eyeSquintL_max": 0.45,
        "Expressions_eyeSquintR_max": 0.45,
    },
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
    """Create EMO_* shapekeys from recipes (combined poses)."""
    # Ensure basis exists
    if not obj.data.shape_keys:
        obj.shape_key_add(name="Basis", from_mix=False)
    reset_keys(obj)
    bpy.context.view_layer.update()

    # Remove prior EMO_ keys
    sk = obj.data.shape_keys
    to_remove = [kb for kb in sk.key_blocks if kb.name.startswith("EMO_")]
    for kb in to_remove:
        obj.shape_key_remove(kb)

    for emo, recipe in EMOTION_RECIPES.items():
        set_recipe(obj, recipe, 1.0)
        kb = obj.shape_key_add(name=f"EMO_{emo}", from_mix=True)
        kb.value = 0.0
        print("baked", kb.name)
    reset_keys(obj)


def duplicate_object(obj, name):
    dup = obj.copy()
    dup.data = obj.data.copy()
    dup.name = name
    dup.data.name = name + "_mesh"
    bpy.context.collection.objects.link(dup)
    return dup


def mesh_from_shapekey(obj, key_name, out_name, decimate_ratio=None):
    """Duplicate obj, apply only key_name shape (or basis), optional decimate, return object."""
    dup = duplicate_object(obj, out_name)
    bpy.ops.object.select_all(action="DESELECT")
    dup.select_set(True)
    bpy.context.view_layer.objects.active = dup

    if dup.data.shape_keys:
        for kb in dup.data.shape_keys.key_blocks:
            kb.value = 1.0 if kb.name == key_name else 0.0
        bpy.context.view_layer.update()
        # Remove shapekeys keeping current deformation
        while dup.data.shape_keys:
            dup.active_shape_key_index = 0
            bpy.ops.object.shape_key_remove(all=True)
            break

    if decimate_ratio and decimate_ratio < 0.999:
        mod = dup.modifiers.new("decimate", "DECIMATE")
        mod.ratio = decimate_ratio
        bpy.ops.object.modifier_apply(modifier="decimate")
    return dup


def build_lo(src, ratio=0.2):
    """Basis + EMO_* keys baked through identical decimation, then joined as shapes."""
    # Need EMO keys on source first
    emo_names = ["Basis"] + [f"EMO_{e}" for e in EMOTION_RECIPES]
    # Basis key on MB-Lab is often named 'basis'
    basis_name = "basis"
    if src.data.shape_keys:
        for kb in src.data.shape_keys.key_blocks:
            if kb.name.lower() == "basis":
                basis_name = kb.name
                break

    parts = []
    # Basis
    parts.append(mesh_from_shapekey(src, basis_name, "LO_basis", ratio))
    for emo in EMOTION_RECIPES:
        parts.append(mesh_from_shapekey(src, f"EMO_{emo}", f"LO_{emo}", ratio))

    # Join as shapes: select all, active = basis
    bpy.ops.object.select_all(action="DESELECT")
    for p in parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.join_shapes()

    # Rename shapekeys
    lo = parts[0]
    if lo.data.shape_keys:
        blocks = lo.data.shape_keys.key_blocks
        # After join_shapes, keys are named after objects
        rename = {"LO_basis": "basis"}
        for emo in EMOTION_RECIPES:
            rename[f"LO_{emo}"] = f"EMO_{emo}"
        for kb in blocks:
            if kb.name in rename:
                kb.name = rename[kb.name]

    # Delete helper meshes (the shaped ones — join_shapes keeps geometry from active only)
    for p in parts[1:]:
        bpy.data.objects.remove(p, do_unlink=True)

    lo.name = "Sakura_LO"
    print("LO verts", len(lo.data.vertices), "keys", len(lo.data.shape_keys.key_blocks) if lo.data.shape_keys else 0)
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
    bpy.ops.wm.open_mainfile(filepath=str(SRC))
    hide_extras()
    src = body()
    arm = next((o for o in bpy.data.objects if o.type == "ARMATURE"), None)

    bake_emotion_shapekeys(src)
    add_idle_animation(arm)

    # HI export — full mesh + all keys + EMO_ + armature
    hi_path = OUT / "sakura_hi.glb"
    export_glb(hi_path, [src, arm] if arm else [src])

    # LO build from a duplicate of src (with EMO keys)
    src_dup = duplicate_object(src, "Sakura_HI_src")
    lo = build_lo(src_dup, ratio=0.18)
    # Parent LO under armature if possible for skinning — LO may lose weights on decimate.
    # Re-export LO mesh only with morphs (body movement tested via procedural three.js on LO).
    lo_path = OUT / "sakura_lo.glb"
    export_glb(lo_path, [lo])

    meta = {
        "emotions": list(EMOTION_RECIPES.keys()),
        "hi": {
            "file": "lod/sakura_hi.glb",
            "verts": len(src.data.vertices),
            "morphs": [kb.name for kb in src.data.shape_keys.key_blocks] if src.data.shape_keys else [],
        },
        "lo": {
            "file": "lod/sakura_lo.glb",
            "verts": len(lo.data.vertices),
            "morphs": [kb.name for kb in lo.data.shape_keys.key_blocks] if lo.data.shape_keys else [],
        },
        "recipes": EMOTION_RECIPES,
    }
    MAP_OUT.write_text(json.dumps(meta, indent=2))
    print(json.dumps({k: meta[k] for k in ("emotions",)}, indent=2))
    print("HI verts", meta["hi"]["verts"], "LO verts", meta["lo"]["verts"])
    print("wrote", MAP_OUT)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("FATAL", e)
        import traceback

        traceback.print_exc()
        sys.exit(1)
