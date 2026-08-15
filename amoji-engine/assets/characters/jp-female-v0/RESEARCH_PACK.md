# Amoji Character Modeling Research Pack — JP Female v0

**Goal:** Own human head + body for Amoji expression engine demos.  
**Demo character:** **Amoji Sakura** — adult East-Asian / Japanese–inspired young female (soft features). Mood reference only (e.g. soft beauty adjacent to actresses like 今田美櫻). **Not** a celebrity likeness, deepfake, or licensed persona.  
**Variants:** stylized (`f_an01`) + realistic (`f_as01` + `east_asian`).  
**Wardrobe:** sailor seifuku + long dark hair + white underlayer (prototype meshes).  
**Generated:** 2026-08-10 via Blender 4.0.2 + MB-Lab. See also `REALTIME_UNREAL_SETUP.md`.

---

## 1. What was downloaded / installed (this environment)

| Asset | Location | Notes |
|---|---|---|
| **BlenderMCP server** (`blender-mcp` 1.8.0) | `/agent/tools/blender-mcp/` + venv `/agent/tools/.venv-blender-mcp/` | From PyPI. Run via `uvx blender-mcp` or the venv. |
| **BlenderMCP addon.py** | `/agent/tools/blender-mcp/addon.py` | Recovered from PyPI **0.1.0** only. GitHub `MCPBlender/blender-mcp` currently **404**. Prefer downloading a fresh `addon.py` from [blendermcp.org](https://blendermcp.org/) / releases on your local machine. |
| **MB-Lab 1.8.1** | `/agent/tools/MB-Lab/MB-Lab-master/` | Full human generator (AGPL-3). Asian female = `f_as01`. |
| **ARKit Blendshape Baker** | `/agent/tools/ARKit-Creator-Blender-Addon/` | Guides baking Apple’s **52** ARKit shape keys (Rigify / AutoRig Pro). |
| **Blender** | apt `4.0.2` | Official blender.org tarballs returned 403 here; apt build works for headless. |
| **uv** | `~/.local/bin/uv` | Required by BlenderMCP docs. |

MB-Lab addon must be linked as a valid Python module name:

```bash
mkdir -p ~/.config/blender/4.0/scripts/addons
ln -sfn /agent/tools/MB-Lab/MB-Lab-master ~/.config/blender/4.0/scripts/addons/mb_lab
```

---

## 2. Blender MCP — how it works (for your Mac)

BlenderMCP is **two pieces**:

1. **Addon inside Blender** — opens TCP socket (default `localhost:9876`)
2. **MCP server process** — Cursor/Claude talk to it; it forwards to the addon

### Local Cursor config (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["--python", "3.11", "blender-mcp"],
      "env": {
        "DISABLE_TELEMETRY": "true",
        "BLENDER_HOST": "localhost",
        "BLENDER_PORT": "9876"
      }
    }
  }
}
```

### Steps on your machine

1. Install Blender **4.2+ LTS** (recommended) or 4.0+
2. Install `uv` → https://docs.astral.sh/uv/
3. Download **latest** `addon.py` from BlenderMCP site / GitHub when available
4. Blender → Edit → Preferences → Add-ons → Install → enable **Interface: Blender MCP**
5. N-panel → BlenderMCP → **Connect**
6. Restart Cursor with the mcp.json above

**Hard limit of this Cloud Agent:** no interactive Blender GUI / no live MCP socket to a desktop Blender. Generation here is **headless scripts only**. Full sculpt / beauty pass / hair / clothing needs your local Blender + MCP.

---

## 3. Amoji requirements that drive the model (from your specs)

### Face / expression (must eventually support)

| Layer | Spec source | Modeling implication |
|---|---|---|
| Points L/P/E (24 / 57 / 77) | Complete Spec | Edge loops around brows, lids, lips, nasolabial, jaw |
| M1–M21 muscles + perimeter | Phase 2 / muscles doc | Prefer FACS-friendly topology; jaw bone separate from lip shapes |
| Preston Blair visemes + LOCKED/CLAMPED/OPEN | Phase 2 | Clean mouth bag, teeth, tongue; jaw open/close bone |
| ARKit 52 export | Skeleton standards doc | Bake 52 shape keys (ARKit Baker) as interop layer |
| Eyes priority | Alita / uncanny-valley docs | Invest in iris/pupil/sclera; avoid “whole eyeball scale” |

### Body / skeleton

| System | Amoji internal | Interop target |
|---|---|---|
| Body markers | 117-point system | Map → **VRM Humanoid** (+ Mixamo for animation library) |
| Face drive | 77 pts + M1–M21 | Map → **ARKit 52** blendshapes |
| Mouth | jaw bone + lip shapes | Matches industry split (bones vs blendshapes) |

### Art direction (critical)

Your own research says **do not default to MetaHuman-class photoreal**:

- Uncanny valley risk peaks at near-real (Levels 7–8 of your 10-level Surface Renderer)
- Prefer **stylized realism / soft anime-adjacent / low–mid poly consistency**
- Alita lesson: exaggerate **iris/pupil**, not raw eyeball diameter
- Keep face / voice / motion **matched** in realism (Kokoro + Amoji sync)

**Recommended Surface Level for this demo character:** Level 5–6 (Pixar-ish / soft stylized) or anime-realistic MB-Lab `f_an*` if you want clearer “not human photo”.

---

## 4. Recommended modeling pipeline (own character)

```
1. Base mesh     MB-Lab f_as01 + east_asian phenotype  (DONE → v0)
2. Beauty sculpt Soften jaw, enlarge iris materials, refine lids  (local Blender)
3. Hair          Particle / geometry hair or VRM hair mesh
4. Clothing      Separate mesh, weight to body
5. Rig body      MB-Lab armature → retarget / rename toward VRM Humanoid
6. Face rig      MB-Lab face expressions → OR Rigify face + ARKit Baker (52)
7. Map Amoji     77 points / M1–M21 / visemes → shape keys or bones
8. Export        GLB (Three.js MVP) + optional VRM
9. Drive         amoji-engine → ARKit weights / custom channels
```

### Open alternatives (if MB-Lab AGPL is a problem for commercial)

| Tool | License note | Role |
|---|---|---|
| **MakeHuman** | AGPL for app; exports commonly used | Standalone base human |
| **Human Generator** (paid) | Commercial | Faster beauty / textures |
| **Ready Player Me / VRoid** | ToS / CC limits | Fast avatar, less “own IP” |
| **Manual box-model** | Full ownership | Slowest, cleanest IP |

### Mixamo + free body libraries (wired in Face Live)

Face Live → **Body motion** retargets:

| Library | License | Path |
|---|---|---|
| Adobe Mixamo | Royalty-free commercial (no raw packs / no ML) | `mixamo/` |
| CMU MoCap | Free commercial; do not resell raw data | `body-motion/cmu/` |
| Quaternius UAL | **CC0** | `body-motion/quaternius/` |
| Mesh2Motion | OSS auto-rig tool (+ CC0 assets) | tooling |

Maps: `engine/layers/bodyMotionRetarget.js`. Catalog: `bodyMotionCatalog.js`. **Excluded:** Bandai Namco Motiondataset (CC BY-NC).

MB-Lab is **AGPL-3** — if Amoji ships the mesh binary derived from MB-Lab, get a lawyer’s read on AGPL obligations (or rebuild topology from scratch using it only as reference).

---

## 5. Japanese / East-Asian face & body notes (production checklist)

Use as **art direction**, not stereotypes:

**Face (East Asian phenotype starting point → personalize)**
- Softer brow ridge; epicanthic fold optional (sculpt / texture, not only morph)
- Lower nasal bridge / shorter tip projection (MB-Lab east_asian already biases this)
- Wider zygomatic relative to Caucasian base; keep elegant, not exaggerated
- Youth cues: slightly larger eyes (iris), fuller midface, softer mandible — age meta ≈ young adult
- Avoid: porcelain-skin + dead eyes + 8K pores (uncanny combo)

**Body**
- Female average proportions from MB-Lab anthropometry; then shorten/lengthen for character identity
- Keep topology: clean loops at shoulders, elbows, hips, knees for Mixamo/VRM retarget
- Separate head mesh optional later for LODs / ARKit focus

**Hair / makeup / wardrobe** (next art pass — not in v0)
- Define identity separate from Lilith (dev-only name)
- Pick one silhouette so first viewport reads as brand character

---

## 6. v0 output (generated here)

| File | Description |
|---|---|
| `amoji_jp_female_v0.blend` | Editable Blender scene (finalized MB-Lab → shapekeys) |
| `amoji_jp_female_v0.glb` | glTF binary for Three.js / web MVP |
| `preview_head.png` | Workbench head crop (if render succeeded) |
| `generate_mblab_asian_female.py` | Reproducible headless generator |

**Stats:** ~18 210 verts, ~17 288 polys, **83** shapekeys, 1 armature.  
**Template:** `f_as01` + phenotype `east_asian.json` + `character_age = -0.35` + light beauty morph bias.

Regenerate:

```bash
export PATH="/usr/bin:/bin"
blender -b -P assets/characters/jp-female-v0/generate_mblab_asian_female.py
```

---

## 7. Gaps / next concrete steps

1. **Local BlenderMCP** — get current `addon.py` (repo 404 from cloud); connect Cursor on your Mac
2. **Beauty sculpt + eyes** — iris/pupil materials; lids; brows
3. **Hair + outfit** identity pass
4. **ARKit 52 bake** with the downloaded baker (or map MB-Lab expression shapekeys → ARKit names)
5. **Amoji channel map** JSON: `pointId / muscleId / viseme → shapeKey or bone`
6. **Legal** — confirm AGPL path vs re-topo for commercial Amoji assets
7. **Do not** treat this v0 as production “pretty final” — it is a correct **base** for iteration

---

## 8. Key links

- BlenderMCP site: https://blendermcp.org/
- BlenderMCP PyPI: https://pypi.org/project/blender-mcp/
- MB-Lab: https://github.com/animate1978/MB-Lab
- MB-Lab docs (base characters): https://mb-lab-docs.readthedocs.io/en/latest/base_char.html
- ARKit Baker: https://github.com/tsikerdekis/ARKit-Creator-Blender-Addon
- Amoji specs (local): `docs/source/Amoji_3D_______v1_11d1.md`, `Amoji_______________v1_0ac8.md` (skeleton standards), Alita uncanny notes
