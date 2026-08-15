# Free body-motion libraries (Sakura)

Amoji Face Live can retarget **multiple free / open** body-animation sources onto Sakura HI (and onto Quaternius / MPFB full-body refs).

| Source | Format | License | Status |
|---|---|---|---|
| **Adobe Mixamo** | FBX | Royalty-free commercial (no raw packs / no ML) | `../mixamo/` |
| **CMU MoCap** | BVH | Free research & commercial; do not resell raw data | `cmu/` (walk + wait/idle) |
| **Quaternius UAL1** | glTF | **CC0 1.0** | `quaternius/` (Idle_Loop, Walk_Loop, …) |
| **Quaternius UAL2** | GLB | **CC0 1.0** | `quaternius-ual2/` (extra idle / walk) |
| **three.js BVH** | BVH | Examples redistrib — verify before ship | `three-bvh/` |

**Full-body models:** `../full-body/` (Quaternius mannequin CC0 + MPFB CC0).

**Excluded:** Bandai Namco Motiondataset (**CC BY-NC**), LaFAN1 (research license pending review).

## Tools

- [Mesh2Motion](https://github.com/Mesh2Motion/mesh2motion-app) — OSS Mixamo-like auto-rig + export (uses Quaternius packs).
- Catalog / bone maps: `engine/layers/bodyMotionCatalog.js`, `bodyMotionRetarget.js`

## CMU citation

> The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217.
