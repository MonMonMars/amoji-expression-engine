# Human-face robot companies

Companies whose robots are built around an **expressive human (or humanoid) face** — projected (Furhat), screen (Misty / QT / Pepper tablet), mechatronic (Ameca, Sophia, iCub), or digital humans.

Catalog: `engine/layers/humanFaceRobotCatalog.js`  
Mapper: `engine/layers/humanFaceRobotBridge.js` (merged into Face Live vendor list)  
Companion: `scripts/human_face_robot_amoji_bridge.py`

## Platforms adapted

| Company | Product | Face drive | Depth |
|---|---|---|---|
| **Furhat Robotics** | Furhat | FaceCore **ARKitParams** gestures | full |
| **Engineered Arts** | Ameca / Mesmer | Tritium DOF + presets | full |
| **LuxAI** | QTrobot | `show_emotion("QT/…")` video face | full |
| **Hanson Robotics** | Sophia / Grace | Named expressions (partner) | partial |
| **SoftBank** | Pepper | Tablet + NAOqi | full |
| **Misty Robotics** | Misty II | Screen emotion images | full |
| **Realbotix** | Abyss / Harmony | Partner DOF | partial |
| **IIT** | iCub | YARP eyelids/mouth/LEDs | partial |
| **Robopec** | Reeti | Face motors | partial |
| **Flash Robotics** | EMYS | Expressive sphere face | partial |
| **Promobot** | V4 / Robo-C | Screen / mechatronic | partial |
| **Soul Machines / Uneeq** | Digital People | Cloud blendshapes / events | partial |
| **EX Robots / Ishiguro Lab / Embodied** | Androids / Moxie | Intent stubs | stub |

## Best interop: Furhat ← Amoji ARKit

Furhat FaceCore accepts ARKit-compatible gesture params. Face Live already computes ARKit 52 from Sakura morphs; the vendor bridge packs them into a **streaming** Furhat `Gesture` (no reset frame) for continuous drive.

```bash
# Terminal A — relay
cd amoji-engine && npm run robot-bridge

# Terminal B — Face Live (enable "Stream to robot-bridge")
npm run face-live

# Terminal C — Furhat companion
python3 scripts/human_face_robot_amoji_bridge.py --subscribe --live-furhat 192.168.1.20
```

Or one-shot:

```bash
python3 scripts/human_face_robot_amoji_bridge.py \
  --file /tmp/vendor.json --live-furhat 192.168.1.20
```

## Face Live

1. **Robot vendor bridge** — human-face vendors listed first (`face ·`)  
2. **Human-face vendors only** checkbox filters the list  
3. **Stream to robot-bridge** publishes `amoji.robotVendor.v1` to `ws://127.0.0.1:7880`  
4. ARKit weights from the live face are included automatically  

See also: `docs/ROBOT_VENDOR_BRIDGES.md`, `docs/UNITREE_BRIDGE.md`.
