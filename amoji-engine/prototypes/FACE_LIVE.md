# Amoji Face Live — realtime expression UI

Browser UI that drives **facial emotions** on Sakura **LO** and **HI** poly meshes.

## Run

```bash
cd amoji-engine
npm run face-live
# open http://127.0.0.1:5174/prototypes/face-live
```

## Assets

| LOD | File | ~Verts | Morphs |
|---|---|---|---|
| HI | `assets/characters/jp-female-v0/lod/sakura_hi.glb` | 18 210 | MB-Lab `Expressions_*` + `EMO_*` (+ subtle/medium/peak) |
| LO | `assets/characters/jp-female-v0/lod/sakura_lo.glb` | ~3.5k | `EMO_{emotion}_{subtle\|medium\|peak}` + legacy `EMO_*` |

### Texture LOD (independent of mesh)

Capcom-style packs under `lod/textures/{hi,mid,lo}/` — albedo, eyelash, sclera, teeth.

| Tex tier | Max edge | Typical use |
|---|---|---|
| hi | native (~2K) | Hero close-up |
| mid | 1024 | Default gameplay |
| lo | 512 | Mobile / crowd |

Rebuild:

```bash
blender -b -P assets/characters/jp-female-v0/export_lod_emotions.py
python3 assets/characters/jp-female-v0/build_texture_lods.py
```

## UI

- Toggle **Mesh** Low / High poly
- Toggle **Texture** 512 / 1K / 2K (does not reload mesh)
- Emotion buttons + intensity slider (hand-tuned subtle/medium/peak sculpts)
- **Phase 3:** Step-Out next · Force leak · Mood fear · emotion-modulated blink
- **Persona / Layer I:** companion·corporate·care·education·home + calm/alert/tense breath ladder (90s variant rotate)
- **Compound emotions:** 6 region-locked blends (e.g. 開心的驚訝)
- **Layer T:** Sim AI latency (gaze → pensive filler → secondary) + Improv noise
- **Layer W gait HUD:** speed / stride / arm origin / footfall weight
- **Live Link pub** → `npm run livelink` bridge for Unreal
- **Eye look-at** — track camera or manual X/Y; idle adds saccade noise on HI
- Idle sway / turntable / cycle emotions / blink
- HUD: mesh LOD, tex LOD, triangle count, emotion, FPS
- Debug: active morphs + **ARKit 52** nonzero export preview

## Code

- UI: `prototypes/face-live.html`
- Mapping: `engine/layers/emotionMorphs.js` + `data/emotions/intensity-sculpt-recipes.json`
- Temporal: `engine/layers/temporalLayer.js`
- Idle / personas: `engine/layers/idleMode.js` + `data/personas/catalog.json`
- Coarticulation: `engine/layers/coarticulation.js` (Emotion Lab checkbox)
- Eyes: `engine/layers/eyeLook.js`
- Textures: `engine/layers/textureLod.js`
- ARKit / Live Link: `engine/export/arkitExporter.js`, `liveLinkFace.js`, `prototypes/livelink-bridge.mjs`
- Unreal: `assets/characters/jp-female-v0/UNREAL_LIVELINK.md`
- Studio method reference: `docs/STUDIO_HUMAN_MODEL_REFERENCE.md`
