#!/usr/bin/env python3
"""
Amoji → Unitree companion bridge (dry-run by default).

Reads `amoji.unitree.v1` JSON from stdin (one object) or --file, and either:
  • prints the planned SDK calls (default), or
  • with --live + networkInterface, dispatches via unitree_sdk2_python.

Install (on a machine that can reach the robot):
  git clone https://github.com/unitreerobotics/unitree_sdk2_python
  # + cyclone DDS 0.10.x per upstream README
  pip install -e .

Examples:
  echo '{"schema":"amoji.unitree.v1",...}' | python3 unitree_amoji_bridge.py
  python3 unitree_amoji_bridge.py --file /tmp/unitree.json --platform g1
  python3 unitree_amoji_bridge.py --file /tmp/unitree.json --live eth0 --platform go2

Safety: refuses FrontFlip / HandStand / etc. unless --allow-unsafe.
Does not open DDS unless --live is set.
"""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any


UNSAFE_SPORT = {
    "FrontFlip",
    "FrontJump",
    "FrontPounce",
    "LeftFlip",
    "BackFlip",
    "HandStand",
}


def load_payload(args: argparse.Namespace) -> dict[str, Any]:
    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            return json.load(f)
    raw = sys.stdin.read().strip()
    if not raw:
        raise SystemExit("No JSON on stdin; pass --file or pipe amoji.unitree.v1")
    return json.loads(raw)


def plan_steps(payload: dict[str, Any], platform: str) -> list[dict[str, Any]]:
    p = platform if platform != "auto" else payload.get("platform") or "auto"
    steps: list[dict[str, Any]] = []
    if p in ("go2", "b2", "auto"):
        sport = payload.get("go2", {}).get("sport") or {}
        steps.append({"target": "SportClient", "call": sport.get("method"), "apiId": sport.get("apiId")})
        vui = payload.get("go2", {}).get("vui", {})
        br = vui.get("brightness") or {}
        steps.append({"target": "VuiClient", "call": "SetBrightness", "level": br.get("level")})
    if p in ("g1", "auto"):
        loco = payload.get("g1", {}).get("loco") or {}
        arm = payload.get("g1", {}).get("arm") or {}
        led = (payload.get("g1", {}).get("audio") or {}).get("led") or {}
        steps.append({"target": "LocoClient", "call": loco.get("method"), "args": loco.get("args")})
        steps.append(
            {
                "target": "G1ArmActionClient",
                "call": "ExecuteAction",
                "action": arm.get("action"),
                "actionId": arm.get("actionId"),
            }
        )
        steps.append({"target": "AudioClient", "call": "LedControl", "rgb": led.get("rgb")})
        tts = (payload.get("g1", {}).get("audio") or {}).get("tts")
        if tts:
            steps.append({"target": "AudioClient", "call": "TtsMaker", "text": tts.get("text")})
    if p == "h1":
        loco = payload.get("h1", {}).get("loco") or payload.get("g1", {}).get("loco") or {}
        steps.append({"target": "LocoClient(H1)", "call": loco.get("method"), "args": loco.get("args")})
    return steps


def execute_live(payload: dict[str, Any], iface: str, platform: str, allow_unsafe: bool) -> None:
    try:
        from unitree_sdk2py.core.channel import ChannelFactoryInitialize
    except ImportError as e:
        raise SystemExit(
            "unitree_sdk2_python not installed. Dry-run only on this host.\n" + str(e)
        ) from e

    ChannelFactoryInitialize(0, iface)
    p = platform if platform != "auto" else "g1"

    sport_method = (payload.get("go2") or {}).get("sport", {}).get("method")
    if sport_method in UNSAFE_SPORT and not allow_unsafe:
        print(f"Blocked unsafe sport {sport_method}", file=sys.stderr)
        sport_method = "BalanceStand"

    if p in ("go2", "b2"):
        from unitree_sdk2py.go2.sport.sport_client import SportClient
        from unitree_sdk2py.go2.vui.vui_client import VuiClient

        sport = SportClient()
        sport.SetTimeout(10.0)
        sport.Init()
        vui = VuiClient()
        vui.SetTimeout(5.0)
        vui.Init()
        fn = getattr(sport, sport_method or "BalanceStand", None)
        if callable(fn):
            print("SportClient." + sport_method, fn())
        br = ((payload.get("go2") or {}).get("vui") or {}).get("brightness") or {}
        if br.get("level") is not None:
            print("VuiClient.SetBrightness", vui.SetBrightness(int(br["level"])))
        return

    # g1 / h1 path
    from unitree_sdk2py.g1.loco.g1_loco_client import LocoClient
    from unitree_sdk2py.g1.arm.g1_arm_action_client import G1ArmActionClient
    from unitree_sdk2py.g1.audio.g1_audio_client import AudioClient

    loco = LocoClient()
    loco.SetTimeout(10.0)
    loco.Init()
    arm = G1ArmActionClient()
    arm.SetTimeout(10.0)
    arm.Init()
    audio = AudioClient()
    audio.SetTimeout(10.0)
    audio.Init()

    loco_spec = (payload.get("g1") or {}).get("loco") or {}
    method = loco_spec.get("method") or "WaveHand"
    args = loco_spec.get("args") or []
    # StopMove is not on LocoClient — map to zero velocity
    if method == "StopMove":
        print("LocoClient.Move(0,0,0)", loco.Move(0, 0, 0))
    else:
        fn = getattr(loco, method, None)
        if callable(fn):
            print(f"LocoClient.{method}", fn(*args) if args is not None else fn())

    arm_spec = (payload.get("g1") or {}).get("arm") or {}
    action_id = arm_spec.get("actionId")
    if action_id is not None:
        print("G1ArmActionClient.ExecuteAction", arm.ExecuteAction(int(action_id)))

    led = ((payload.get("g1") or {}).get("audio") or {}).get("led") or {}
    rgb = led.get("rgb") or [110, 130, 150]
    print("AudioClient.LedControl", audio.LedControl(int(rgb[0]), int(rgb[1]), int(rgb[2])))

    vol = ((payload.get("g1") or {}).get("audio") or {}).get("volume") or {}
    if vol.get("level") is not None:
        print("AudioClient.SetVolume", audio.SetVolume(int(vol["level"])))

    tts = ((payload.get("g1") or {}).get("audio") or {}).get("tts")
    if tts and tts.get("text"):
        print("AudioClient.TtsMaker", audio.TtsMaker(str(tts["text"]), int(tts.get("speakerId") or 0)))


def main() -> None:
    ap = argparse.ArgumentParser(description="Amoji Unitree companion bridge")
    ap.add_argument("--file", help="Path to amoji.unitree.v1 JSON")
    ap.add_argument(
        "--platform",
        default="auto",
        choices=["auto", "go2", "g1", "h1", "b2"],
        help="Which Unitree stack to target",
    )
    ap.add_argument(
        "--live",
        metavar="IFACE",
        help="Network interface to robot (e.g. eth0). Omit for dry-run.",
    )
    ap.add_argument(
        "--allow-unsafe",
        action="store_true",
        help="Allow flips / handstand sport APIs",
    )
    args = ap.parse_args()
    payload = load_payload(args)
    if payload.get("schema") != "amoji.unitree.v1":
        print("Warning: schema is not amoji.unitree.v1", file=sys.stderr)

    steps = plan_steps(payload, args.platform)
    print(json.dumps({"dry_run": not bool(args.live), "steps": steps}, indent=2))

    if args.live:
        print("WARNING: live Unitree dispatch — ensure clear workspace.", file=sys.stderr)
        execute_live(payload, args.live, args.platform, args.allow_unsafe)


if __name__ == "__main__":
    main()
