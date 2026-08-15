# Unitree robot bridge

Map Amoji Face Live emotions onto **Unitree** high-level APIs (sdk2 / sdk2_python / ros2).

Sakura (or any picker character) stays the expression brain. The robot receives a dry-run JSON bundle — no DDS from the browser.

## Stack (researched)

| Layer | Role |
|---|---|
| [unitree_sdk2](https://github.com/unitreerobotics/unitree_sdk2) | C++ CycloneDDS SDK — Go2, B2, H1, G1 |
| [unitree_sdk2_python](https://github.com/unitreerobotics/unitree_sdk2_python) | Python twin — Sport / Loco / Arm / Audio / VUI |
| [unitree_ros2](https://github.com/unitreerobotics/unitree_ros2) | Same topics as ROS2 msgs |
| DDS | `rt/lowcmd` · `rt/lowstate` · `/api/sport/request` |
| IDL | `unitree_go` (Go2/B2/H1) · `unitree_hg` (G1/H1-2) |

### Emotion-relevant APIs we target

| Platform | Client | Examples |
|---|---|---|
| **Go2 / B2** | `SportClient` | Hello, Heart, Dance1/2, Sit, Stretch, Content, Scrape, StopMove |
| **Go2 / B2** | `VuiClient` | SetBrightness, SetVolume (chassis light / volume) |
| **G1** | `LocoClient` | WaveHand, ShakeHand, HighStand, LowStand, Move |
| **G1** | `G1ArmActionClient` | clap, heart, hug, reject, face wave, shake hand, hands up… |
| **G1** | `AudioClient` | `LedControl(R,G,B)`, SetVolume, TtsMaker |

Unsafe sport (flips, handstand, pounce) is **blocked** unless `allowUnsafe` / `--allow-unsafe`.

## In-repo adapters

| File | Role |
|---|---|
| `engine/layers/unitreeBridge.js` | `emotionToUnitreeBridge` → `amoji.unitree.v1` |
| `scripts/unitree_amoji_bridge.py` | Dry-run planner + optional `--live IFACE` dispatcher |
| Face Live | Platform select + `window.__amojiUnitree` live payload |

## Face Live usage

1. `npm run face-live` → open prototype  
2. Pick emotions as usual (Sakura or robot refs)  
3. Choose **Unitree bridge** platform (Auto / Go2 / G1 / H1)  
4. Inspect `window.__amojiUnitree` in DevTools  
5. On a robot-connected machine:

```bash
# copy JSON from the console, or:
node -e "..." > /tmp/unitree.json
python3 amoji-engine/scripts/unitree_amoji_bridge.py --file /tmp/unitree.json --platform g1
# live (requires unitree_sdk2_python + NIC to robot):
python3 amoji-engine/scripts/unitree_amoji_bridge.py --file /tmp/unitree.json --platform g1 --live eth0
```

## Example mapping

| Amoji emotion | Go2 Sport | G1 Arm | G1 LED |
|---|---|---|---|
| happy | Heart (Dance1 if intense) | high five / clap | green |
| sad | Sit / Scrape | release arm | blue |
| angry | StopMove | reject | red |
| surprised | Stretch | hands up | yellow |
| greeting | Hello | shake hand | soft white-blue |

## Safety

- Clear workspace; Unitree docs warn before loco / arm examples  
- Prefer high-level Sport/Loco/Arm over `rt/lowcmd` for expression  
- Release conflicting motion services before low-level (MotionSwitcher)  
- NC / commercial: Unitree SDKs are open for development; robot hardware ToS still apply  

See also: `docs/FREE_ROBOT_ANDROID.md`, [Unitree opensource](https://www.unitree.com/opensource).
