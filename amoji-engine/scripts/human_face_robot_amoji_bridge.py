#!/usr/bin/env python3
"""
Amoji → human-face robot companion.

Modes:
  • Dry-run JSON from --file / stdin (default)
  • --live-furhat IP      → POST gestures to Furhat Remote API
  • --live-qtrobot HOST  → print / optionally call QTrobot show_emotion
  • --subscribe          → listen to robot-bridge WS and forward

Examples:
  python3 human_face_robot_amoji_bridge.py --file /tmp/vendor.json
  python3 human_face_robot_amoji_bridge.py --subscribe --live-furhat 192.168.1.20
  python3 human_face_robot_amoji_bridge.py --subscribe --live-qtrobot 192.168.1.30
"""

from __future__ import annotations

import argparse
import json
import sys
import time
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


def unwrap_vendor(msg: dict[str, Any]) -> dict[str, Any]:
    """Normalize robot-bridge envelope or raw vendor JSON."""
    if msg.get("type") == "robotVendor" and isinstance(msg.get("payload"), dict):
        return msg["payload"]
    if msg.get("schema") == "amoji.robotVendor.v1":
        return msg
    return msg


def extract_face(payload: dict[str, Any]) -> dict[str, Any]:
    payload = unwrap_vendor(payload)
    if payload.get("schema") == "amoji.humanFaceRobot.v1":
        return payload
    nested = (payload.get("payload") or {}).get("humanFace")
    if nested:
        return nested
    return payload


def vendor_id_of(payload: dict[str, Any], face: dict[str, Any]) -> str:
    payload = unwrap_vendor(payload)
    return (
        face.get("vendorId")
        or (payload.get("vendor") or {}).get("id")
        or ""
    )


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


def qtrobot_dispatch(face: dict[str, Any], host: str, live: bool) -> None:
    face_body = face.get("face") or face
    show = face_body.get("showEmotion") or {}
    emotion = show.get("emotion") or "QT/neutral"
    speed = show.get("speed", 1.0)
    look = face_body.get("look")

    print(
        json.dumps(
            {
                "qtrobot": {
                    "host": host,
                    "python": f'robot.face.show_emotion("{emotion}", speed={speed})',
                    "ros2": (
                        "ros2 service call /qtrobot/face/emotion/show "
                        f"qtrobot_interfaces/srv/FaceEmotionShow "
                        f'"{{emotion: \'{emotion}\', speed: {speed}}}"'
                    ),
                    "look": look,
                }
            },
            indent=2,
        )
    )

    if not live:
        return

    # Optional: luxai SDK if installed on PATH host network
    try:
        from luxai import Robot  # type: ignore

        robot = Robot(host)
        robot.face.show_emotion(emotion, speed=float(speed))
        if look:
            robot.face.look(
                l_eye=look.get("l_eye"),
                r_eye=look.get("r_eye"),
                duration=look.get("duration") or 0,
            )
        print("qtrobot live ok", emotion)
    except Exception as e:  # noqa: BLE001 — companion best-effort
        print(f"QTrobot live skipped ({e}); use printed SDK/ROS2 commands", file=sys.stderr)


def dispatch_frame(
    msg: dict[str, Any],
    *,
    furhat_ip: str | None,
    qtrobot_host: str | None,
    qtrobot_live: bool,
) -> None:
    vendor_payload = unwrap_vendor(msg)
    face = extract_face(vendor_payload)
    vid = vendor_id_of(vendor_payload, face)
    emotion = face.get("emotion") or vendor_payload.get("emotion")
    print(f"frame vendor={vid or '?'} emotion={emotion}")

    if furhat_ip and vid == "furhat":
        furhat_live(face, furhat_ip)
    if qtrobot_host and vid == "qtrobot":
        qtrobot_dispatch(face, qtrobot_host, live=qtrobot_live)


def subscribe_loop(
    ws_url: str,
    *,
    furhat_ip: str | None,
    qtrobot_host: str | None,
    qtrobot_live: bool,
    min_interval: float,
) -> None:
    try:
        import websocket  # type: ignore
    except ImportError as e:
        raise SystemExit(
            "websocket-client required for --subscribe: pip install websocket-client\n"
            + str(e)
        ) from e

    last_sent = 0.0

    def on_message(_ws, message: str) -> None:
        nonlocal last_sent
        try:
            msg = json.loads(message)
        except json.JSONDecodeError:
            return
        if msg.get("type") == "hello":
            print("connected", msg.get("protocol"))
            return
        now = time.time()
        if now - last_sent < min_interval:
            return
        last_sent = now
        dispatch_frame(
            msg,
            furhat_ip=furhat_ip,
            qtrobot_host=qtrobot_host,
            qtrobot_live=qtrobot_live,
        )

    ws = websocket.WebSocketApp(ws_url, on_message=on_message)
    print(f"subscribing {ws_url}")
    ws.run_forever()


def main() -> None:
    ap = argparse.ArgumentParser(description="Amoji human-face robot bridge")
    ap.add_argument("--file")
    ap.add_argument("--live-furhat", metavar="IP", help="Furhat robot / SDK IP")
    ap.add_argument(
        "--live-qtrobot",
        metavar="HOST",
        help="QTrobot host — prints SDK/ROS2; uses luxai SDK if installed",
    )
    ap.add_argument(
        "--qtrobot-execute",
        action="store_true",
        help="With --live-qtrobot, attempt luxai Robot SDK call",
    )
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
    ap.add_argument(
        "--min-interval",
        type=float,
        default=0.12,
        help="Min seconds between live dispatches when subscribed (default 0.12)",
    )
    args = ap.parse_args()

    if args.subscribe:
        subscribe_loop(
            args.ws,
            furhat_ip=args.live_furhat,
            qtrobot_host=args.live_qtrobot,
            qtrobot_live=args.qtrobot_execute,
            min_interval=max(0.05, args.min_interval),
        )
        return

    payload = load_payload(args)
    face = extract_face(payload)
    vid = vendor_id_of(payload, face)

    print(
        json.dumps(
            {
                "vendorId": vid,
                "emotion": face.get("emotion") or payload.get("emotion"),
                "steps": face.get("steps") or payload.get("steps") or [],
                "streaming": (face.get("face") or {}).get("streaming"),
                "dry_run": not bool(args.live_furhat or args.qtrobot_execute),
            },
            indent=2,
        )
    )

    if args.live_furhat and (vid == "furhat" or not vid):
        furhat_live(face, args.live_furhat)
    if args.live_qtrobot and (vid == "qtrobot" or not vid):
        qtrobot_dispatch(face, args.live_qtrobot, live=args.qtrobot_execute)


if __name__ == "__main__":
    main()
