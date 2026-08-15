# Free / open-source content map for Amoji

Master shortlist of **commercial-friendly** (or clearly licensed) free content for Sakura / Face Live. Prefer CC0 / MIT / Mixamo-style royalty-free. Skip NC-only unless demo-only.

## Already wired in-repo

| Content | License | Where |
|---|---|---|
| Adobe Mixamo body clips | Royalty-free commercial† | `assets/.../mixamo/` + Face Live |
| CMU MoCap BVH samples | Free commercial†† | `body-motion/cmu/` |
| Quaternius Universal Animation Library (free tier) | **CC0** | `body-motion/quaternius/` (~20 clips in picker) |
| Quaternius UAL2 Standard + Female Mannequin | **CC0** | `body-motion/quaternius-ual2/` + `full-body/quaternius-mannequin-f/` |
| MPFB full-body (TalkingHead sample) | **CC0** | `full-body/mpfb/` |
| three.js `pirouette.bvh` | Examples redistrib | `body-motion/three-bvh/` |
| three.js `facecap.glb` (ARKit 52) | **MIT** | `assets/reference/arkit/` |
| ICT FaceKit Light (neutral + sample exprs) | **MIT** | `assets/reference/human-head/ict-facekit/` |
| Filmic Worlds ARKit solve dataset | **CC0** | `assets/reference/human-head/filmic-worlds/` |
| Rocketbox Female_Adult_01 (FBX + head/body maps) | **MIT** | `assets/reference/human-head/rocketbox/` · Face Live picker |
| VALID Asian_F_1_Busi.glb (ARKit 52) | **CC BY 4.0** | `assets/reference/human-head/valid-vrm/` · Face Live picker |
| MediaPipe Tasks Vision | Apache-2.0 (npm) | Capture Studio / yt-capture |
| three.js runtime | MIT | `package.json` |

† No raw Mixamo redistrib as asset packs; no ML training.  
†† Do not resell raw CMU data; cite NSF EIA-0196217.

## High-value next downloads (not yet shipped — often large)

| Content | License | Use for Sakura | URL |
|---|---|---|---|
| Quaternius **Universal Base Characters** (female + 20 hairstyles) | CC0 | Alt body / hair kit | https://quaternius.com/packs/universalbasecharacters.html |
| Quaternius **Modular Character Outfits** | CC0 | Wardrobe experiments | https://quaternius.com/packs/modularcharacteroutfitsfantasy.html |
| Quaternius UAL **PRO** | CC0 | More body clips | https://quaternius.com/ |
| [Mesh2Motion](https://github.com/Mesh2Motion/mesh2motion-app) | OSS | Auto-rig custom meshes | https://mesh2motion.org / GitHub |
| [mesh2motion-assets](https://github.com/Mesh2Motion/mesh2motion-assets) | CC0 | Source packs for Mesh2Motion | GitHub |
| [MPFB2 / MakeHuman](https://static.makehumancommunity.org/mpfb.html) | AGPL + community CC0/BY assets | Alt base human (license care) | makehumancommunity.org |
| [VRoid Studio](https://vroid.com/en/studio) | Pixiv ToS (commercial OK w/ conditions) | Anime JP-female hero path | vroid.com |
| [Polygonal Mind 100 Avatars](https://github.com/PolygonalMind/initiative-opensource-release) | CC0 | Stylized avatar pack | GitHub releases |
| [Poly Pizza](https://poly.pizza/) | Mixed (filter CC0/CC-BY) | Props / env | poly.pizza |
| [Kenney.nl](https://kenney.nl/assets) | CC0 | UI / props / audio | kenney.nl |
| Filmic Worlds ARKit solve dataset | CC0 | Face blendshape research | **in-repo** + filmicworlds.com |
| [ICT-FaceKit](https://github.com/USC-ICT/ICT-FaceKit) full Light OBJs | MIT | Face morphable model (full set) | GitHub (`FaceXModel/`) |
| [Microsoft Rocketbox](https://github.com/microsoft/Microsoft-Rocketbox) more avatars | **MIT** | Extra identities beyond Female_Adult_01 | Sparse-clone (~26 GB full) |
| [VALID → VRM ARKit](https://github.com/TLTMedia/valid-vrm-avatars) more identities | CC BY 4.0 | Extra VALID outfits / faces | GitHub LFS |
| [M3-org/base-meshes](https://github.com/M3-org/base-meshes) | CC0 | Greybox body/head | GitHub |
| OpenGameArt Quaternius mirrors | CC0 | Backup downloads | opengameart.org |

**Face/head deep-dive:** `docs/FREE_HUMAN_HEAD_FACE.md`

## Excluded / caution

| Content | Why |
|---|---|
| Bandai Namco Research Motiondataset | **CC BY-NC** — non-commercial |
| Ubisoft LaFAN1 | Research license — review before ship |
| MetaHuman head redistribs marked “study only” | Not commercial-clear |
| MB-Lab base mesh | **AGPL-3** — shipping binary may impose obligations; lawyer review |

## Sakura gap → best free fill

| Gap | Best free fill |
|---|---|
| Body motion variety | Quaternius UAL (done) + Mesh2Motion exports + more CMU BVH |
| Hair | Quaternius Universal Base hairstyles (CC0) or VRoid hair → GLB |
| Clothes | Quaternius modular outfits (CC0) |
| ARKit interop face | facecap (done) + Filmic Worlds / ICT subset (done); Rocketbox / VALID for library scale |
| Human head morph research | ICT-FaceKit Light (subset in-repo; full on GitHub) |
| JP voice | No strong CC0 JP TTS bank found; keep Kokoro/IndexTTS HTTP adapters |
| Eyes | Custom art still preferred (Alita iris pass); Kenney lacks hero eyes |

## How to add a pack

1. Confirm license allows commercial + redistribution of baked assets  
2. Drop under `assets/characters/jp-female-v0/` or `assets/reference/`  
3. Register clips in `engine/layers/bodyMotionCatalog.js` (or a new catalog)  
4. Note attribution in the folder README  

See also: `docs/FREE_HUMAN_HEAD_FACE.md`, `docs/FREE_BODY_MOTION.md`, `assets/.../body-motion/README.md`, `RESEARCH_PACK.md`.
