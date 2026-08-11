# Capture → Bake (authoring)

Offline pipeline: **video performance → ARKit curves → intensity sculpts + timing envelopes**.

This is **not** a runtime biometric path. Amoji stays pure-generation at ship time; capture only authors data.

## Why video

Expressions are continuous muscle motion. Timing (onset → apex → offset) is essential. A still photo can check one keyframe; it cannot author attack/release or blink cadence.

## Capture sources (existing tools)

| Source | Output | Notes |
|---|---|---|
| iPhone **Live Link Face** | ARKit 52 stream / recorded JSON | Best mobile quality; matches our Live Link bridge |
| Unreal Live Link recording | NDJSON / CSV of blendshapes | Reuse `amoji.livelink.arkit.v1` frames |
| MediaPipe Face Landmarker | landmarks → approximate AUs | Map to ARKit-like channels before bake |
| Desktop webcam trackers | ARKit-ish or FACS | Convert to our channel names |

Recommended: act the take on camera → export ARKit frames at 30–60 fps → bake here → **hand-tune** → merge into `data/emotions/`.

## Run

```bash
cd amoji-engine

# Synthetic demo (happy take with onset/hold/offset + blink)
npm run capture-bake -- --demo

# Real take
npm run capture-bake -- --emotion happy --in ./takes/smile.ndjson --out ./tools/capture-bake/out

# Preview merge (writes *.merged-recipes.json — does not overwrite data/)
npm run capture-bake -- --demo --merge-into ./data/emotions/intensity-sculpt-recipes.json --overwrite
```

## Outputs

| File | Purpose |
|---|---|
| `{emotion}.recipe-fragment.json` | `subtle` / `medium` / `peak` morph weights |
| `{emotion}.temporal.json` | onset / apex / offset, suggested Step-Out, blinks |
| `{emotion}.bake.json` | Full bake + energy curve (plot / review) |

## Code

- Library: `engine/capture/captureBake.js`
- CLI: `tools/capture-bake/cli.mjs`
- Fixture: `tools/capture-bake/fixtures/sample-happy-take.mjs`

## Workflow

1. Film the expression (or use Live Link Face while performing).
2. Dump frames as NDJSON (`blendShapes` + `t` or `frame`/`fps`).
3. `bakeCaptureTake` → review peak morphs vs Sakura `Expression_*`.
4. Hand-tune taste (asymmetry, eyes-before-mouth).
5. Merge into `intensity-sculpt-recipes.json`; optionally fold `suggestedStepOutSec` into `STEP_OUT_DURATION`.
6. Never stream the face video into the production engine.
