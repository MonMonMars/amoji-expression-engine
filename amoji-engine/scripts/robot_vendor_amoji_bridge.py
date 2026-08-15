#!/usr/bin/env python3
"""
Amoji multi-vendor robot bridge — dry-run planner (default).

Reads `amoji.robotVendor.v1` JSON from stdin or --file and prints planned steps.
Optional Misty live dispatch via HTTP when --live-misty IP is set.
Unitree live dispatch: use scripts/unitree_amoji_bridge.py instead.

Examples:
  node -e "..." | python3 robot_vendor_amoji_bridge.py
  python3 robot_vendor_amoji_bridge.py --file /tmp/vendor.json
  python3 robot_vendor_amoji_bridge.py --file /tmp/vendor.json --live-misty 192.168.1.50
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from typing import Any


def load_payload(args: argparse.Namespace) -> dict[str, Any]:
    if args.file:
        with open(args.file, "r", encoding="utf-8") as f:
            return json.load(f)
    raw = sys.stdin.read().strip()
    if not raw:
        raise SystemExit("No JSON on stdin; pass --file or pipe amoji.robotVendor.v1")
    return json.loads(raw)


def misty_live(payload: dict[str, Any], ip: str) -> None:
    misty = (payload.get("payload") or {}).get("misty") or {}
    base = f"http://{ip}"
    for req in misty.get("requests") or []:
        url = base + req.get("path", "")
        body = json.dumps(req.get("body") or {}).encode("utf-8")
        http_req = urllib.request.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json"},
            method=req.get("method") or "POST",
        )
        try:
            with urllib.request.urlopen(http_req, timeout=10) as resp:
                print(url, resp.status, resp.read()[:200])
        except urllib.error.URLError as e:
            print(f"FAIL {url}: {e}", file=sys.stderr)


def main() -> None:
    ap = argparse.ArgumentParser(description="Amoji multi-vendor robot bridge")
    ap.add_argument("--file", help="Path to amoji.robotVendor.v1 JSON")
    ap.add_argument(
        "--live-misty",
        metavar="IP",
        help="POST Misty REST requests to this robot IP",
    )
    args = ap.parse_args()
    payload = load_payload(args)
    if payload.get("schema") != "amoji.robotVendor.v1":
        print("Warning: schema is not amoji.robotVendor.v1", file=sys.stderr)

    out = {
        "vendor": (payload.get("vendor") or {}).get("id"),
        "emotion": payload.get("emotion"),
        "intensity": payload.get("intensity"),
        "steps": payload.get("steps") or [],
        "dry_run": not bool(args.live_misty),
    }
    print(json.dumps(out, indent=2))

    if args.live_misty:
        if (payload.get("vendor") or {}).get("id") != "misty":
            raise SystemExit("--live-misty requires vendor misty payload")
        misty_live(payload, args.live_misty)


if __name__ == "__main__":
    main()
