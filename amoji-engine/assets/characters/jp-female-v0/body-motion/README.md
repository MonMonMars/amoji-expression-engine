# Free body-motion libraries (Sakura)

Amoji Face Live can retarget **multiple free / open** body-animation sources onto Sakura HI.

| Source | Format | License | Status |
|---|---|---|---|
| **Adobe Mixamo** | FBX | Royalty-free commercial (no raw packs / no ML) | `mixamo/` |
| **CMU MoCap** | BVH | Free research & commercial; do not resell raw data | `body-motion/cmu/` |
| **Quaternius UAL** | glTF | **CC0 1.0** | `body-motion/quaternius/` |
| **three.js BVH** | BVH | Examples redistrib — verify before ship | `body-motion/three-bvh/` |

**Excluded:** Bandai Namco Motiondataset (**CC BY-NC**), LaFAN1 (research license pending review).

## Tools

- [Mesh2Motion](https://github.com/Mesh2Motion/mesh2motion-app) — OSS Mixamo-like auto-rig + export (uses Quaternius packs). Assets: [mesh2motion-assets](https://github.com/Mesh2Motion/mesh2motion-assets) (CC0).
- Catalog / bone maps: `engine/layers/bodyMotionCatalog.js`, `bodyMotionRetarget.js`

## CMU citation

> The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217.

## Add your own

1. Drop FBX / BVH / glTF under this tree (or `mixamo/`)
2. Register a clip in `BODY_MOTION_CLIPS` with the right `boneProfile`
3. Face Live picker updates from the catalog

Quaternius PRO packs (more clips) stay CC0 — download from [quaternius.com](https://quaternius.com/) and point `file` / `animationName` at them.
