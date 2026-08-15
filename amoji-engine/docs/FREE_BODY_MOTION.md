# Free / open body-motion sources (research)

Shortlist for Amoji Sakura body animation beyond Adobe Mixamo.

| Library | License | Commercial? | Wired? | Notes |
|---|---|---|---|---|
| [Adobe Mixamo](https://www.mixamo.com/) | Adobe Mixamo ToS | Yes (baked-in) | Yes | No raw redistribution; no ML training |
| [CMU MoCap](http://mocap.cs.cmu.edu/) | CMU free use | Yes | Yes (BVH samples) | Do not resell raw data; cite NSF EIA-0196217 |
| [Quaternius UAL](https://quaternius.com/) | CC0 | Yes | Yes (free-tier glTF) | Best CC0 human clip pack; PRO has more |
| [Mesh2Motion](https://github.com/Mesh2Motion/mesh2motion-app) | OSS app | Tool | Documented | Browser auto-rig; Quaternius packs |
| [mesh2motion-assets](https://github.com/Mesh2Motion/mesh2motion-assets) | CC0 | Yes | Tooling | Source art / packs for Mesh2Motion |
| [Bandai Namco Motiondataset](https://github.com/BandaiNamcoResearchInc/Bandai-Namco-Research-Motiondataset) | CC BY-NC 4.0 | **No** | Excluded | Non-commercial only |
| [Ubisoft LaFAN1](https://github.com/ubisoft/ubisoft-laforge-animation-dataset) | Research | Check | Excluded | Legal review before ship |
| three.js `pirouette.bvh` | Examples redistrib | Verify | Experimental | Partial bone map |

Runtime: Face Live **Body motion** panel → `SkeletonUtils.retargetClip` via `engine/layers/bodyMotionRetarget.js`.

For the full free/OSS content map (characters, face, hair, tools), see [`FREE_OPEN_CONTENT.md`](./FREE_OPEN_CONTENT.md).
