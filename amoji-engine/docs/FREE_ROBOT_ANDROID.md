# Free / open robot & android content

Commercial-friendly (or clearly labeled demo) robot / android assets for Face Live interop. Sakura stays the brand hero.

## Wired in Face Live

| Content | License | Where | Drive |
|---|---|---|---|
| **RobotExpressive** (Quaternius via three.js) | **CC0** | `assets/reference/robots/robot-expressive/` | Morphs `Angry` / `Surprised` / `Sad` + Idle/Walk |
| **Mixamo X Bot** | Mixamo RF (three.js redistrib) | `assets/reference/robots/xbot/` | `mixamorig:` body · idle/walk/run |
| **CesiumMan** | **CC BY 4.0** | `assets/reference/robots/cesium-man/` | Classic walk sample |
| **GDBot** (GDQuest) | **CC BY-NC-SA 4.0** art — **demo only** | `assets/reference/robots/gdquest-gdbot/` | Android face-panel sprites |
| **Gobot** (GDQuest) | **CC BY-NC-SA 4.0** art — **demo only** | `assets/reference/robots/gdquest-gobot/` | Eye open/hurt/closed panel |

## Engine adapters

| Module | Role |
|---|---|
| `engine/layers/robotCharacterCatalog.js` | Picker entries (merged into `HUMAN_HEAD_REFS`) |
| `engine/layers/robotEmotionDrive.js` | Emotion → robot morphs + `amoji.androidRobot.v1` bridge JSON |
| `engine/layers/androidFacePanel.js` | Billboard face panel on head bone (GDBot/Gobot) |
| `bodyMotionRetarget.js` profiles | `robotExpressive`, `mixamoColon` (Xbot), `gobot` |

Live bridge payload is exposed as `window.__amojiAndroidRobot` while a robot is selected (LED RGB + face panel + morphs).

**Unitree (Go2 / G1 / H1):** see `docs/UNITREE_BRIDGE.md` — `window.__amojiUnitree` (`amoji.unitree.v1`) + `scripts/unitree_amoji_bridge.py`.

**Multi-vendor (Spot, Pepper, Misty, …):** see `docs/ROBOT_VENDOR_BRIDGES.md` — `window.__amojiRobotVendor` (`amoji.robotVendor.v1`).

## Related OSS robot / Android stacks (not vendored)

| Project | License | Fit |
|---|---|---|
| [ob-f/OpenBot](https://github.com/ob-f/OpenBot) | MIT | Phone-as-brain Android robot (nav / follow) — consume `__amojiAndroidRobot` in a companion app |
| [unitree_sdk2_python](https://github.com/unitreerobotics/unitree_sdk2_python) | Unitree OSS | Go2 Sport / G1 Loco+Arm+LED — consume `__amojiUnitree` |
| [unitree_sdk2](https://github.com/unitreerobotics/unitree_sdk2) | Unitree OSS | C++ CycloneDDS twin of the Python SDK |
| [catprisbrey/Godot4-OpenAnimationLibraries](https://github.com/catprisbrey/Godot4-OpenAnimationLibraries) | CC0 OpenBot mannequin | Mixamo-compatible open humanoid (large `.blend`) |
| Quaternius Sci-Fi / Cyberpunk kits | CC0 | Extra robot enemies (itch / poly.pizza) |
| Styloo Robot Character | CC0 | Rigged GLB + anims (itch) |

## Excluded / caution

| Content | Why |
|---|---|
| GDQuest art beyond demo | **NC-SA** — do not ship in commercial products |
| Cesium trademark | Attribute + respect [Cesium trademark terms](https://github.com/AnalyticalGraphicsInc/cesium/wiki/CesiumTrademark.pdf) |

## How to add another robot

1. Confirm license (prefer CC0 / MIT / Mixamo RF / CC BY)  
2. Drop under `assets/reference/robots/<id>/`  
3. Register in `robotCharacterCatalog.js`  
4. Add a retarget profile in `bodyMotionRetarget.js` if bones are non-Mixamo  
5. If face is a screen/panel (not morphs), extend `androidFacePanel.js`
