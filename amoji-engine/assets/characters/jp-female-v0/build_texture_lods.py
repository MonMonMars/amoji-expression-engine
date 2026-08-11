#!/usr/bin/env python3
"""
Build Capcom-style texture LOD packs independent of mesh LOD.

Extracts images from sakura_hi.glb and writes:
  lod/textures/hi|mid|lo/*.png
  lod/textures/manifest.json

hi  = source resolution
mid = max edge 1024
lo  = max edge 512
"""
from __future__ import annotations

import io
import json
import struct
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
GLB = ROOT / "lod" / "sakura_hi.glb"
OUT = ROOT / "lod" / "textures"

# Canonical pack filenames (stable for Face Live)
PACK_FILES = {
    "eyelash": 1,  # RGBA eyelash (image index in GLB)
    "eyelash_rgb": 0,
    "sclera": 2,
    "albedo": 3,
    "teeth": 4,
}

TIERS = {
    "hi": None,  # keep native
    "mid": 1024,
    "lo": 512,
}


def load_glb_images(path: Path):
    data = path.read_bytes()
    chunk_len = struct.unpack_from("<I", data, 12)[0]
    gltf = json.loads(data[20 : 20 + chunk_len])
    json_end = 20 + chunk_len
    if json_end % 4:
        json_end += 4 - (json_end % 4)
    bin_len = struct.unpack_from("<I", data, json_end)[0]
    blob = data[json_end + 8 : json_end + 8 + bin_len]
    images = []
    for img in gltf.get("images", []):
        bv = gltf["bufferViews"][img["bufferView"]]
        off = bv.get("byteOffset", 0)
        raw = blob[off : off + bv["byteLength"]]
        im = Image.open(io.BytesIO(raw))
        im.load()
        images.append({"name": img.get("name") or f"img_{len(images)}", "image": im})
    return images, gltf


def fit_max_edge(im: Image.Image, max_edge: int | None) -> Image.Image:
    if not max_edge:
        return im.copy()
    w, h = im.size
    edge = max(w, h)
    if edge <= max_edge:
        return im.copy()
    scale = max_edge / edge
    nw, nh = max(1, int(round(w * scale))), max(1, int(round(h * scale)))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def main():
    if not GLB.exists():
        print("FATAL missing", GLB, file=sys.stderr)
        sys.exit(1)

    images, gltf = load_glb_images(GLB)
    print("source images:")
    for i, entry in enumerate(images):
        im = entry["image"]
        print(f"  [{i}] {entry['name']} {im.size} {im.mode}")

    manifest = {
        "version": 1,
        "sourceGlb": "lod/sakura_hi.glb",
        "note": "Texture LOD packs are independent of mesh LOD (Capcom pattern).",
        "tiers": {},
        "materialBindings": {
            "skin": {"match": ["skin", "mblab_skin"], "map": "albedo"},
            "eyelash": {"match": ["eyelash"], "map": "eyelash"},
            "sclera": {"match": ["human_eyes", "sclera"], "map": "sclera"},
            "teeth": {"match": ["teeth"], "map": "teeth"},
            "tongue": {"match": ["tongue"], "map": "teeth"},
        },
    }

    for tier, max_edge in TIERS.items():
        tier_dir = OUT / tier
        tier_dir.mkdir(parents=True, exist_ok=True)
        files = {}
        for key, idx in PACK_FILES.items():
            if key == "eyelash_rgb":
                continue  # skip duplicate rgb eyelash in pack UI; keep file for completeness
            src = images[idx]["image"]
            out = fit_max_edge(src, max_edge)
            # Prefer PNG with alpha for eyelash
            if key == "eyelash" and out.mode != "RGBA":
                out = out.convert("RGBA")
            elif out.mode not in ("RGB", "RGBA"):
                out = out.convert("RGB")
            fname = f"{key}.png"
            out_path = tier_dir / fname
            out.save(out_path, optimize=True)
            files[key] = {
                "file": f"lod/textures/{tier}/{fname}",
                "width": out.size[0],
                "height": out.size[1],
                "bytes": out_path.stat().st_size,
            }
            print(f"wrote {out_path} {out.size}")
        # also write eyelash_rgb for normal-ish fallback
        src = images[0]["image"]
        out = fit_max_edge(src, max_edge).convert("RGB")
        out_path = tier_dir / "eyelash_rgb.png"
        out.save(out_path, optimize=True)
        files["eyelash_rgb"] = {
            "file": f"lod/textures/{tier}/eyelash_rgb.png",
            "width": out.size[0],
            "height": out.size[1],
            "bytes": out_path.stat().st_size,
        }
        manifest["tiers"][tier] = {
            "maxEdge": max_edge,
            "files": files,
            "totalBytes": sum(f["bytes"] for f in files.values()),
        }

    OUT.mkdir(parents=True, exist_ok=True)
    man_path = OUT / "manifest.json"
    man_path.write_text(json.dumps(manifest, indent=2))
    print("wrote", man_path)
    for tier, info in manifest["tiers"].items():
        print(f"  {tier}: {info['totalBytes']/1024:.1f} KB")


if __name__ == "__main__":
    main()
