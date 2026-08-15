#!/usr/bin/env python3
"""
Amoji → human-face robot companion.

Modes:
  • Dry-run JSON from --file / stdin (default)
  • --live-furhat IP  → POST gestures to Furhat Remote API
  • --subscribe       → listen to robot-bridge WS and forward to Furhat

Examples:
  python3 human_face_robot_amoji_bridge.py --file /tmp/vendor.json
  python3 human_face_robot_amoji_bridge.py --file /tmp/v.json --live-furhat 192.168.1.20
  python3 human_face_robot_amoji_bridge.py --subscribe --live-furhat 192.168.1.20
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
        raise SystemExit("No JSON on stdin; pass --file or --subscribe")
    return json.loads(raw)


def extract_face(payload: dict[str, Any]) -> dict[str, Any]:
    if payload.get("schema") == "amoji.humanFaceRobot.v1":
        return payload
    if payload.get("type") == "robotVendor" and payload.get("payload"):
        payload = payload["payload"]
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
        print("No Furhat gesture in payload", file=sys.stderr)
        return

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            print("furhat", resp.status, (custom and "custom") or named)
    except urllib.error.URLError as e:
        print(f"FAIL Furhat: {e}", file=sys.stderr)


def subscribe_loop(ws_url: str, furhat_ip: str | None) -> None:
    try:
        import websocket  # type: ignore
    except ImportError as e:
        raise SystemExit(
            "websocket-client required for --subscribe: pip install websocket-client\n"
            + str(e)
        ) from e

    def on_message(_ws, message: str) -> None:
        try:
            msg = json.loads(message)
        except json.JSONDecodeError:
            return
        if msg.get("type") == "hello":
            print("connected", msg.get("protocol"))
            return
        face = extract_face(msg if msg.get("type") == "robotVendor" else msg)
        vendor = face.get("vendorId") or (msg.get("payload") or {}).get("vendor", {}).get("id")
        emotion = face.get("emotion") or (msg.get("payload") or {}).get("emotion")
        print(f"frame vendor={vendor} emotion={emotion}")
        if furhat_ip and (vendor == "furhat" or face.get("face", {}).get("sdk", "").startswith("Furhat")):
            furhat_live(face, furhat_ip)
        elif furhat_ip and (msg.get("payload") or {}).get("vendor", {}).get("id") == "furhat":
            furhat_live(extract_face(msg.get("payload") or {}), furhat_ip)

    ws = websocket.WebSocketApp(ws_url, on_message=on_message)
    print(f"subscribing {ws_url}")
    ws.run_forever()


def main() -> None:
    ap = argparse.ArgumentParser(description="Amoji human-face robot bridge")
    ap.add_argument("--file")
    ap.add_argument("--live-furhat", metavar="IP", help="Furhat robot / SDK IP")
    ap.add_argument(
        "--subscribe",
        action="store_true",
        help="Listen to robot-bridge WebSocket (default ws://127.0.0.1:7880)",
    )
    ap.add_argument(
        "--ws",
        default="ws://127.0.0.1:7880",
        help="robot-bridge WebSocket URL",
    )
    args = ap.parse_args()

    if args.subscribe:
        subscribe_loop(args.ws, args.live_furhat)
        return

    payload = load_payload(args)
    face = extract_face(payload)

    print(
        json.dumps(
            {
                "vendorId": face.get("vendorId") or (payload.get("vendor") or {}).get("id"),
                "emotion": face.get("emotion") or payload.get("emotion"),
                "steps": face.get("steps") or payload.get("steps") or [],
                "streaming": (face.get("face") or {}).get("streaming"),
                "dry_run": not bool(args.live_furhat),
            },
            indent=2,
        )
    )

    if args.live_furhat:
        furhat_live(face, args.live_furhat)


if __name__ == "__main__":
    main()
