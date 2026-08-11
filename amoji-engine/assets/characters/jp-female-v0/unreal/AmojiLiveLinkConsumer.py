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
  mod.start_polling(
      actor_label="AmojiSakura",
      http_url="http://127.0.0.1:7879/last",
      remap_profile="sakura-expression",  # or metahuman-ctrlrig-sample / cc4-arkit / ue5-morph-flat / identity
  )

Mac soak dry-run (outside UE):
  python3 AmojiLiveLinkConsumer.py --soak 5
  python3 AmojiLiveLinkConsumer.py --stats
  python3 AmojiLiveLinkConsumer.py --remap-demo sakura-expression
"""

from __future__ import annotations

import argparse
import json
import threading
import time
import urllib.request
from pathlib import Path
from typing import Callable, Dict, Optional
from urllib.parse import urlparse, urlunparse

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

_REMAP_CACHE: Dict[str, dict] = {}


def _default_remap_json_path() -> Path:
    # Walk up from …/unreal/this.py until data/ue/control-rig-arkit-remap.json is found.
    here = Path(__file__).resolve().parent
    for parent in [here, *here.parents]:
        candidate = parent / "data" / "ue" / "control-rig-arkit-remap.json"
        if candidate.is_file():
            return candidate
    return here.parents[3] / "data" / "ue" / "control-rig-arkit-remap.json"


def load_remap_catalog(path: Optional[str] = None) -> dict:
    p = Path(path) if path else _default_remap_json_path()
    key = str(p)
    if key in _REMAP_CACHE:
        return _REMAP_CACHE[key]
    with p.open("r", encoding="utf8") as f:
        data = json.load(f)
    _REMAP_CACHE[key] = data
    return data


def get_remap_map(profile_id: str = "identity", catalog_path: Optional[str] = None) -> dict:
    """Return arkit→morph map for a profile (empty for identity / missing)."""
    if not profile_id or profile_id == "identity":
        return {}
    catalog = load_remap_catalog(catalog_path)
    profile = (catalog.get("profiles") or {}).get(profile_id) or {}
    return dict(profile.get("map") or {})


def remap_arkit_to_morphs(
    blend_shapes: dict,
    profile_id: str = "identity",
    keep_unmapped: bool = True,
    catalog_path: Optional[str] = None,
) -> dict:
    """Mirror of engine/export/controlRigRemap.js remapArkitToMorphs."""
    mapping = get_remap_map(profile_id, catalog_path)
    if not mapping:
        return dict(blend_shapes or {})
    out: Dict[str, float] = {}
    for ch, value in (blend_shapes or {}).items():
        if not isinstance(value, (int, float)):
            continue
        target = mapping.get(ch)
        if target:
            out[target] = float(out.get(target, 0.0)) + float(value)
        elif keep_unmapped:
            out[ch] = float(value)
    return out


def _sibling_url(http_url: str, path: str) -> str:
    parsed = urlparse(http_url)
    return urlunparse((parsed.scheme, parsed.netloc, path, "", "", ""))


def fetch_json(http_url: str, timeout: float = 0.5) -> dict:
    with urllib.request.urlopen(http_url, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf8"))


def fetch_last(http_url: str) -> dict:
    return fetch_json(http_url)


def fetch_stats(base_or_last_url: str = "http://127.0.0.1:7879/last") -> dict:
    """Read bridge /stats (accepts /last or /stats URL)."""
    if base_or_last_url.rstrip("/").endswith("/stats"):
        return fetch_json(base_or_last_url)
    return fetch_json(_sibling_url(base_or_last_url, "/stats"))


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
    remap_profile: str = "identity",
    keep_unmapped: bool = True,
    remap_catalog_path: Optional[str] = None,
):
    """Background poll of the Amoji Live Link HTTP /last endpoint."""
    global _thread
    _stop.clear()
    period = 1.0 / max(1.0, hz)

    def loop():
        actor = find_actor_by_label(actor_label)
        print(
            f"[amoji-livelink] polling {http_url} → actor={actor_label} "
            f"found={actor is not None} remap={remap_profile}"
        )
        while not _stop.is_set():
            try:
                frame = fetch_last(http_url)
                shapes = frame.get("blendShapes") or {}
                morphs = remap_arkit_to_morphs(
                    shapes,
                    profile_id=remap_profile,
                    keep_unmapped=keep_unmapped,
                    catalog_path=remap_catalog_path,
                )
                if on_frame:
                    on_frame({**frame, "morphs": morphs, "remapProfile": remap_profile})
                if actor is not None and morphs:
                    apply_blendshapes_to_skeletal_mesh(actor, morphs)
                elif unreal is None and morphs:
                    active = {k: round(v, 2) for k, v in morphs.items() if v and v > 0.02}
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


def soak_report(
    seconds: float = 5.0,
    hz: float = 30.0,
    http_url: str = "http://127.0.0.1:7879/last",
) -> dict:
    """
    Poll /last for N seconds and summarize frame growth (Mac soak validation).
    Does not require Unreal.
    """
    period = 1.0 / max(1.0, hz)
    deadline = time.time() + max(0.1, seconds)
    frames_seen = 0
    unique_indices = set()
    errors = 0
    last_jaw = None
    last_frame_idx = None

    while time.time() < deadline:
        try:
            frame = fetch_last(http_url)
            shapes = frame.get("blendShapes") or {}
            if shapes:
                frames_seen += 1
                idx = frame.get("frame")
                if isinstance(idx, int):
                    unique_indices.add(idx)
                    last_frame_idx = idx
                jaw = shapes.get("jawOpen")
                if isinstance(jaw, (int, float)):
                    last_jaw = float(jaw)
        except Exception:
            errors += 1
        time.sleep(period)

    expected = max(1, int(seconds * hz))
    report = {
        "ok": errors == 0 and frames_seen > 0,
        "seconds": seconds,
        "hz": hz,
        "framesSeen": frames_seen,
        "uniqueFrameIndices": len(unique_indices),
        "lastFrameIndex": last_frame_idx,
        "lastJawOpen": last_jaw,
        "errors": errors,
        "expectedPolls": expected,
    }
    try:
        report["bridgeStats"] = fetch_stats(http_url)
    except Exception as exc:
        report["bridgeStatsError"] = str(exc)
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Amoji Live Link consumer / Mac soak")
    parser.add_argument("--soak", type=float, default=0, help="Run soak_report for N seconds")
    parser.add_argument("--hz", type=float, default=30.0)
    parser.add_argument("--url", default="http://127.0.0.1:7879/last")
    parser.add_argument("--stats", action="store_true", help="Print /stats once and exit")
    parser.add_argument(
        "--remap-demo",
        metavar="PROFILE",
        help="Print remapped sample jawOpen for PROFILE and exit",
    )
    parser.add_argument("--remap", default="identity", help="Remap profile for dry-run polling")
    args = parser.parse_args()

    if args.remap_demo:
        demo = remap_arkit_to_morphs(
            {"jawOpen": 0.6, "mouthSmileLeft": 0.4},
            profile_id=args.remap_demo,
            keep_unmapped=False,
        )
        print(json.dumps({"profile": args.remap_demo, "morphs": demo}, indent=2))
    elif args.stats:
        print(json.dumps(fetch_stats(args.url), indent=2))
    elif args.soak > 0:
        report = soak_report(seconds=args.soak, hz=args.hz, http_url=args.url)
        print(json.dumps(report, indent=2))
        raise SystemExit(0 if report.get("ok") else 1)
    else:
        print("Dry-run consumer — Ctrl+C to stop")
        start_polling(http_url=args.url, hz=args.hz, remap_profile=args.remap)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            stop_polling()
