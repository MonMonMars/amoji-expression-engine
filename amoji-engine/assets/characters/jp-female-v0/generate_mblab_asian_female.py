"""
Headless MB-Lab generator — Amoji demo base: young East-Asian female.

Usage:
  PATH=/usr/bin:/bin:/usr/sbin:/sbin:/home/ubuntu/.local/bin \\
  blender -b -P generate_mblab_asian_female.py

Outputs (next to this script):
  - amoji_jp_female_v0.blend
  - amoji_jp_female_v0.glb
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import bpy
import addon_utils

OUT_DIR = Path(__file__).resolve().parent
BLEND_OUT = OUT_DIR / "amoji_jp_female_v0.blend"
GLB_OUT = OUT_DIR / "amoji_jp_female_v0.glb"
PHENOTYPE = "east_asian.json"
# MB-Lab age meta: ~ -0.5 young adult, 0.0 mid, +0.7 older (approximate).
YOUNG_AGE = -0.35
CHARACTER_ID = "f_as01"  # Asian female template
FINAL_PREFIX = "AmojiJP"


def _enable_mblab() -> None:
    # Folder must be a valid Python identifier (mb_lab), not "MB-Lab".
    mod = addon_utils.enable("mb_lab", default_set=True, persistent=True)
    if not mod:
        raise RuntimeError("Failed to enable MB-Lab addon (mb_lab)")
    import mb_lab  # noqa: F401


def _clear_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def main() -> None:
    _clear_scene()
    _enable_mblab()

    from mb_lab import start_lab_session, mblab_humanoid

    scn = bpy.context.scene
    scn.mblab_character_name = CHARACTER_ID
    scn.mblab_use_ik = False
    scn.mblab_use_muscle = False
    scn.mblab_use_cycles = False
    scn.mblab_use_eevee = False
    scn.mblab_use_lamps = False
    scn.mblab_final_prefix = FINAL_PREFIX
    scn.mblab_remove_all_modifiers = False

    # Disable MB-Lab modesty censors (black cone placeholders).
    try:
        prefs = bpy.context.preferences.addons["mb_lab"].preferences
        prefs.use_censors = False
    except Exception as exc:
        print(f"[amoji] could not set use_censors=False: {exc}")

    print(f"[amoji] Creating MB-Lab character {CHARACTER_ID}…")
    start_lab_session()
    from mb_lab import algorithms as mblab_algorithms

    mblab_algorithms.remove_censors()

    if not mblab_humanoid.has_data:
        raise RuntimeError("MB-Lab session failed — no humanoid data")

    body = mblab_humanoid.get_object()
    if body is None:
        raise RuntimeError("No body object after init")

    phenotype_path = os.path.join(
        mblab_humanoid.phenotypes_path, PHENOTYPE
    )
    if not os.path.isfile(phenotype_path):
        raise FileNotFoundError(phenotype_path)

    print(f"[amoji] Loading phenotype {phenotype_path}")
    mblab_humanoid.load_character(phenotype_path)

    # Soften toward a youthful look via meta age (negative = younger).
    if hasattr(body, "character_age"):
        body.character_age = YOUNG_AGE
        mblab_humanoid.update_character(mode="update_metadata")
        print(f"[amoji] character_age = {YOUNG_AGE}")

    # Light beauty bias — subtle, not a cartoon caricature.
    beauty_tweaks = {
        # Eyes slightly larger / more open (Alita lesson: iris/pupil bias later in materials)
        "Eyes_SizeZ": 0.42,
        "Eyes_SizeX": 0.55,
        "Nose_SizeY": 0.48,
        "Nose_BaseSizeX": 0.32,
        "Jaw_Prominence": 0.22,
        "Chin_SizeZ": 0.40,
        "Mouth_SizeX": 0.55,
    }
    for key, val in beauty_tweaks.items():
        if key in mblab_humanoid.character_data:
            mblab_humanoid.character_data[key] = val
    mblab_humanoid.update_character(mode="update_all")
    mblab_humanoid.update_materials()

    print("[amoji] Finalizing to shapekeys…")
    bpy.ops.mbast.finalize_character()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_OUT))
    print(f"[amoji] Saved {BLEND_OUT}")

    # Export glTF binary for Three.js / Studio MVP pipeline
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_OUT),
        export_format="GLB",
        export_apply=True,
        export_animations=False,
    )
    print(f"[amoji] Exported {GLB_OUT}")

    # Stats
    meshes = [o for o in bpy.data.objects if o.type == "MESH"]
    armatures = [o for o in bpy.data.objects if o.type == "ARMATURE"]
    print(f"[amoji] meshes={len(meshes)} armatures={len(armatures)}")
    for o in meshes:
        me = o.data
        print(f"  mesh {o.name}: verts={len(me.vertices)} polys={len(me.polygons)} shapekeys={len(me.shape_keys.key_blocks) if me.shape_keys else 0}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"[amoji] FATAL: {exc}", file=sys.stderr)
        import traceback

        traceback.print_exc()
        sys.exit(1)
