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

Rebuild LODs from Blender:

```bash
blender -b -P assets/characters/jp-female-v0/export_lod_emotions.py
```

## UI

- Toggle **Low poly / High poly**
- Emotion buttons + intensity slider (LO crossfades intensity sculpts; HI uses eased Expression recipes)
- **Eye look-at** — track camera or manual X/Y; idle adds saccade noise on HI
- Idle sway / turntable / cycle emotions / blink
- HUD: LOD, triangle count, emotion, FPS
- Debug: active morphs + **ARKit 52** nonzero export preview

## Code

- UI: `prototypes/face-live.html`
- Mapping: `engine/layers/emotionMorphs.js`
- Eyes: `engine/layers/eyeLook.js`
- ARKit: `data/arkit/arkit-mapping.json` + `engine/export/arkitExporter.js`
- Studio method reference (Capcom / Square Enix / Naughty Dog): `docs/STUDIO_HUMAN_MODEL_REFERENCE.md`
