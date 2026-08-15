# Multi-vendor robot bridges (big-name platforms)

Amoji Face Live stays the expression brain. Vendors receive dry-run JSON
(`amoji.robotVendor.v1`) via `window.__amojiRobotVendor` — companions execute
on the robot network with the vendor SDK.

## Vendors covered

| Vendor | Products | SDK depth | Emotion adapters |
|---|---|---|---|
| **Unitree** | Go2, B2, G1, H1 | full | Sport / Loco / Arm / VUI / LED (`unitreeBridge.js`) |
| **Boston Dynamics** | Spot | full | AudioVisual LEDs + buzzer behavior |
| **SoftBank Robotics** | Pepper, NAO | full | NAOqi ALAnimatedSpeech + ALLeds |
| **Misty Robotics** | Misty II | full | REST `/api/led`, face image, arms, head |
| **temi** | temi | partial | speak + facial status |
| **Xiaomi** | CyberDog | partial | Sport-like + LED (ROS2) |
| **UBTECH** | Walker, Alpha | partial | Action / emotion tags |
| **Deep Robotics** | X30, Lite3 | partial | Sport-like actions |
| **ANYbotics** | ANYmal | partial | ROS2 status / gait hints |
| **PAL Robotics** | ARI, TIAGo | partial | play_motion + ROS2 |
| **ROBOTIS** | OP3, TurtleBot | partial | OP3 actions + LED |
| **Engineered Arts** | Ameca | partial | Face channel intents |
| **Sony** | aibo | partial | Eyes LED + behavior (Cloud auth) |
| **Universal Robots** | UR arms | partial | Dashboard + wrist flourish |
| **Agility / Figure / Tesla / Apptronik / Fourier** | Digit, Figure, Optimus… | stub | Intent-only (no public SDK) |
| **ROS 2 expressive** | any | full | `/amoji/emotion`, `/amoji/led`, `/amoji/gesture` |

Catalog: `engine/layers/robotVendorCatalog.js`  
Mapper: `engine/layers/robotVendorBridge.js`  
Companion: `scripts/robot_vendor_amoji_bridge.py`  
Unitree deep-dive: `docs/UNITREE_BRIDGE.md`

## Face Live

1. Open Face Live → **Robot vendor bridge**  
2. Pick a vendor (and Unitree platform if Unitree)  
3. Drive emotions as usual  
4. Inspect `window.__amojiRobotVendor` (also keeps `__amojiUnitree` when Unitree)

```bash
# Dry-run steps
python3 amoji-engine/scripts/robot_vendor_amoji_bridge.py --file /tmp/vendor.json

# Misty live (HTTP)
python3 amoji-engine/scripts/robot_vendor_amoji_bridge.py --file /tmp/vendor.json --live-misty 192.168.1.50

# Unitree live
python3 amoji-engine/scripts/unitree_amoji_bridge.py --file /tmp/unitree.json --platform g1 --live eth0
```

## Design notes

- Prefer high-level expressive APIs (LED, face panel, canned gestures, TTS) over low-level torque  
- Closed platforms (Figure, Tesla Optimus, …) get intent stubs so the pipeline is ready when partner SDKs appear  
- Industrial arms (UR / KUKA / FANUC / ABB) are not social robots — only light expressive hooks where useful  
- Always clear workspace before live loco / arm dispatch  

## Not adapted (wrong fit or no API)

| Name | Why |
|---|---|
| DJI | Aerial platforms — not social/expressive humanoids |
| iRobot Roomba | Consumer vacuum — no expression surface |
| FANUC / KUKA / ABB cells | Industrial cells; use vendor PLC stacks separately |
| Honda ASIMO / Toyota T-HR3 | Legacy / no public emotion SDK |
