"""
Amoji → Unreal Live Link consumer (UE Python / Remote Control).

Paste into Unreal Editor Python console (or run via Remote Execution) after:
1. Import Sakura skeletal/morph mesh with ARKit-named morph targets (or a Control Rig map)
2. Start `node prototypes/livelink-bridge.mjs` on the same machine
3. This script polls /last and pushes blendshape weights onto the actor

Usage (Editor Python):
  import importlib.util, sys
  spec = importlib.util.spec_from_file_location(
      "amoji_ll",
      r"/absolute/path/to/AmojiLiveLinkConsumer.py",
  )
  mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
  mod.start_polling(actor_label="AmojiSakura", http_url="http://127.0.0.1:7879/last")
"""

from __future__ import annotations

import json
import threading
import time
import urllib.request
from typing import Callable, Optional

# Unreal Python API is only available inside UE.
try:
    import unreal  # type: ignore
except ImportError:  # running outside UE — still useful as a dry-run client
    unreal = None


ARKIT_CHANNELS = [
    "browDownLeft", "browDownRight", "browInnerUp", "browOuterUpLeft", "browOuterUpRight",
    "cheekPuff", "cheekSquintLeft", "cheekSquintRight", "eyeBlinkLeft", "eyeBlinkRight",
    "eyeLookDownLeft", "eyeLookDownRight", "eyeLookInLeft", "eyeLookInRight",
    "eyeLookOutLeft", "eyeLookOutRight", "eyeLookUpLeft", "eyeLookUpRight",
    "eyeSquintLeft", "eyeSquintRight", "eyeWideLeft", "eyeWideRight",
    "jawForward", "jawLeft", "jawRight", "jawOpen", "mouthClose",
    "mouthDimpleLeft", "mouthDimpleRight", "mouthFrownLeft", "mouthFrownRight",
    "mouthFunnel", "mouthLeft", "mouthRight", "mouthPucker",
    "mouthPressLeft", "mouthPressRight", "mouthRollLower", "mouthRollUpper",
    "mouthShrugLower", "mouthShrugUpper", "mouthSmileLeft", "mouthSmileRight",
    "mouthStretchLeft", "mouthStretchRight", "mouthUpperUpLeft", "mouthUpperUpRight",
    "noseSneerLeft", "noseSneerRight", "tongueOut",
    "mouthLowerDownLeft", "mouthLowerDownRight",
]


def fetch_last(http_url: str) -> dict:
    with urllib.request.urlopen(http_url, timeout=0.5) as resp:
        return json.loads(resp.read().decode("utf8"))


def find_actor_by_label(label: str):
    if unreal is None:
        return None
    for actor in unreal.EditorLevelLibrary.get_all_level_actors():
        if actor.get_actor_label() == label:
            return actor
    return None


def apply_blendshapes_to_skeletal_mesh(actor, blend_shapes: dict) -> int:
    """Best-effort: set morph target weights on the first skeletal mesh component."""
    if unreal is None or actor is None:
        return 0
    comps = actor.get_components_by_class(unreal.SkeletalMeshComponent)
    if not comps:
        return 0
    sk = comps[0]
    applied = 0
    for name, value in blend_shapes.items():
        try:
            sk.set_morph_target(name, float(value))
            applied += 1
        except Exception:
            # Name may need a Control Rig remap — leave 0
            pass
    return applied


_stop = threading.Event()
_thread: Optional[threading.Thread] = None


def start_polling(
    actor_label: str = "AmojiSakura",
    http_url: str = "http://127.0.0.1:7879/last",
    hz: float = 30.0,
    on_frame: Optional[Callable[[dict], None]] = None,
):
    """Background poll of the Amoji Live Link HTTP /last endpoint."""
    global _thread
    _stop.clear()
    period = 1.0 / max(1.0, hz)

    def loop():
        actor = find_actor_by_label(actor_label)
        print(f"[amoji-livelink] polling {http_url} → actor={actor_label} found={actor is not None}")
        while not _stop.is_set():
            try:
                frame = fetch_last(http_url)
                shapes = frame.get("blendShapes") or {}
                if on_frame:
                    on_frame(frame)
                if actor is not None and shapes:
                    apply_blendshapes_to_skeletal_mesh(actor, shapes)
                elif unreal is None and shapes:
                    # dry-run
                    active = {k: round(v, 2) for k, v in shapes.items() if v and v > 0.02}
                    if active:
                        print("[amoji-livelink]", active)
            except Exception as exc:
                print("[amoji-livelink] wait:", exc)
            time.sleep(period)

    _thread = threading.Thread(target=loop, name="amoji-livelink", daemon=True)
    _thread.start()
    return _thread


def stop_polling():
    _stop.set()


if __name__ == "__main__":
    # Dry-run outside UE
    print("Dry-run consumer — Ctrl+C to stop")
    start_polling()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        stop_polling()
