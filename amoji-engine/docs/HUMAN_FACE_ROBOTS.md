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

Furhat FaceCore accepts ARKit-compatible gesture params. Face Live already computes ARKit 52 from Sakura morphs; the vendor bridge packs them into a Furhat `Gesture` definition (or a named smile/sad/anger gesture).

```bash
# From Face Live: window.__amojiRobotVendor (vendor = Furhat)
python3 amoji-engine/scripts/human_face_robot_amoji_bridge.py \
  --file /tmp/vendor.json --live-furhat 192.168.1.20
```

## Face Live

1. **Robot vendor bridge** — human-face vendors are listed first (marked `face`)  
2. Default recommendation: **Furhat** or **Ameca** / **QTrobot**  
3. ARKit weights from the live face are passed into the payload automatically  

See also: `docs/ROBOT_VENDOR_BRIDGES.md`, `docs/UNITREE_BRIDGE.md`.
