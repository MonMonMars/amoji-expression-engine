# Free / open-source human face & head models

Shortlist of **commercial-friendly** (or clearly licensed) human **face / head** sources for Amoji Face Live interop and research.

**Brand rule:** Sakura (`assets/characters/jp-female-v0/lod/sakura_*.glb`) stays the hero. OSS heads are for ARKit interop, morph research, and topology reference — not a brand swap.

Prefer **CC0 / MIT / Apache-2.0 / Mixamo-style RF**. Skip **NC-only** unless demo-only.

---

## Already in-repo

| Asset | License | Path | What you get |
|---|---|---|---|
| three.js `facecap.glb` | **MIT** | `assets/reference/arkit/facecap.glb` | Full **ARKit 52** blendshapes (~333 KB) — Live Link / MediaPipe target |
| ICT Face Model Light (subset) | **MIT** | `assets/reference/human-head/ict-facekit/` | Neutral OBJ + sample expression OBJs (`eyeBlink_L`, `jawOpen`) + LICENSE |
| Filmic Worlds ARKit solve set | **CC0** | `assets/reference/human-head/filmic-worlds/` | `colin_shape_data.zip` (FBX + 102 pose JSON → 52 ARKit weights) |

---

## Best picks by job

| Job | Best OSS pick | License | Notes |
|---|---|---|---|
| ARKit 52 realtime reference | three.js facecap | MIT | Already wired as reference |
| Morphable identity + ~53 expressions | [ICT-FaceKit](https://github.com/USC-ICT/ICT-FaceKit) Light | MIT | Full FaceXModel on GitHub (~100 PCA IDs + expression OBJs). Full commercial ICT model is a separate USC license |
| Scan → ARKit blendshape solve research | [Filmic Worlds](https://filmicworlds.com/blog/solving-face-scans-for-arkit/) | CC0 | Production-minded FBX head + JSON weight maps |
| Full-body + ARKit/FACS heads (library) | [Microsoft Rocketbox](https://github.com/microsoft/Microsoft-Rocketbox) | **MIT** | ~115 avatars, ARKit 52 via Headbox; repo ~**26 GB** — sparse-clone one avatar |
| Inclusive heads + ARKit 52 (VRM) | [VALID → VRM](https://github.com/TLTMedia/valid-vrm-avatars) | **CC BY 4.0** | Google VALID conversions; Asian_F_* GLBs ~60–70 MB; attribute Google + TLTMedia |
| Talking avatar pipeline reference | [TalkingHead](https://github.com/met4citizen/TalkingHead) | MIT (code) | Docs for Rocketbox / MPFB / VRoid / AvatarSDK paths |
| Parametric human builder | [MPFB2](https://static.makehumancommunity.org/mpfb.html) / MakeHuman | **AGPL** + mixed community assets | Great tooling; AGPL may affect shipping — lawyer review |
| Anime JP female head | [VRoid Studio](https://vroid.com/en/studio) | Pixiv ToS | Commercial OK under ToS conditions; not OSI “open source” |
| Greybox body/head blockout | [M3-org/base-meshes](https://github.com/M3-org/base-meshes) | **CC0** | Not a hero face |

---

## How to get larger packs (not vendored)

### ICT FaceKit — full Light model
```bash
git clone --depth 1 https://github.com/USC-ICT/ICT-FaceKit.git
# meshes: ICT-FaceKit/FaceXModel/*.obj  (~53 expression names + 100 identity PCA OBJs)
```

### Microsoft Rocketbox — one avatar (sparse)
```bash
git clone --filter=blob:none --sparse https://github.com/microsoft/Microsoft-Rocketbox.git
cd Microsoft-Rocketbox
git sparse-checkout set Assets/Avatars   # then pull only the folders you need
```
Facial blendshapes / ARKit transfer: [openVRlab/Headbox](https://github.com/openVRlab/Headbox).

### VALID VRM (CC BY 4.0)
```bash
# Git LFS required for .vrm; .glb files are full binaries on raw.githubusercontent.com
curl -LO https://raw.githubusercontent.com/TLTMedia/valid-vrm-avatars/master/Asian/Asian_F_1_Busi.glb
```
Attribute: Google VALID + TLTMedia ARKit conversion.

### Filmic Worlds (already downloaded)
Source: https://filmicworlds.com/downloads/2021_11_26_arkit/colin_shape_data.zip  
Blog: https://filmicworlds.com/blog/solving-face-scans-for-arkit/

---

## Excluded / caution

| Source | Why |
|---|---|
| **Basel Face Model (BFM)** | Non-commercial by default; paid commercial license |
| MetaHuman redistribs / “study only” heads | Not commercial-clear |
| MB-Lab base mesh | **AGPL-3** — shipping may impose obligations |
| Bandai Namco Motiondataset faces/mocap | **CC BY-NC** |
| Random Sketchfab “free” scans | Often NC / no clear commercial grant |

---

## Sakura mapping

| Need | Use |
|---|---|
| Hero JP female character | Keep Sakura HI/LO |
| ARKit / Live Link ground truth | `facecap.glb` |
| Expression naming / solve research | Filmic Worlds JSON + ICT expression OBJs |
| Diverse / inclusive NPC heads later | VALID (BY) or Rocketbox (MIT) |
| Stylized anime alt path | VRoid → GLB/VRM (ToS) |

See also: `docs/FREE_OPEN_CONTENT.md`, `assets/reference/arkit/README.md`, `assets/reference/human-head/README.md`.
