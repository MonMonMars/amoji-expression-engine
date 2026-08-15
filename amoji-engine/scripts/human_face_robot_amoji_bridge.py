#!/usr/bin/env python3
"""
Amoji → human-face robot companion (Furhat live optional).

Reads `amoji.robotVendor.v1` or `amoji.humanFaceRobot.v1` JSON.
With --live-furhat IP, POSTs gesture to Furhat Remote API (:54321).

Examples:
  python3 human_face_robot_amoji_bridge.py --file /tmp/vendor.json
  python3 human_face_robot_amoji_bridge.py --file /tmp/vendor.json --live-furhat 192.168.1.20
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


def load_payload(args: argparse.Namespace) -> dict[str, Any]:
    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            return json.load(f)
    raw = sys.stdin.read().strip()
    if not raw:
        raise SystemExit("No JSON on stdin; pass --file")
    return json.loads(raw)


def extract_face(payload: dict[str, Any]) -> dict[str, Any]:
    if payload.get("schema") == "amoji.humanFaceRobot.v1":
        return payload
    nested = (payload.get("payload") or {}).get("humanFace")
    if nested:
        return nested
    return payload


def furhat_live(face: dict[str, Any], ip: str) -> None:
    face_body = face.get("face") or face
    named = face_body.get("namedGesture")
    custom = face_body.get("customGesture")
    base = f"http://{ip}:54321"

    if custom:
        # Swagger often expects gesture as form/query body string
        url = base + "/furhat/gesture"
        data = urllib.parse.urlencode({"body": json.dumps(custom)}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    elif named:
        url = base + "/furhat/gesture?" + urllib.parse.urlencode({"name": named})
        req = urllib.request.Request(url, method="POST", data=b"")
    else:
        raise SystemExit("No Furhat gesture in payload")

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(url.split("?")[0], resp.status, resp.read()[:300])
    except urllib.error.URLError as e:
        print(f"FAIL Furhat: {e}", file=sys.stderr)
        raise SystemExit(1) from e


def main() -> None:
    ap = argparse.ArgumentParser(description="Amoji human-face robot bridge")
    ap.add_argument("--file")
    ap.add_argument("--live-furhat", metavar="IP", help="Furhat robot / SDK IP")
    args = ap.parse_args()
    payload = load_payload(args)
    face = extract_face(payload)

    print(
        json.dumps(
            {
                "vendorId": face.get("vendorId") or (payload.get("vendor") or {}).get("id"),
                "emotion": face.get("emotion") or payload.get("emotion"),
                "steps": face.get("steps") or payload.get("steps") or [],
                "dry_run": not bool(args.live_furhat),
            },
            indent=2,
        )
    )

    if args.live_furhat:
        furhat_live(face, args.live_furhat)


if __name__ == "__main__":
    main()
