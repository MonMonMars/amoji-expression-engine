# Amoji Capture Studio

Browser authoring UI: **webcam or video file → MediaPipe Face Landmarker → ARKit NDJSON → bake preview**.

## Run

```bash
cd amoji-engine
npm run capture-studio
# open http://127.0.0.1:5175/prototypes/capture-studio.html
```

Needs network once for MediaPipe WASM + face model (CDN). Camera permission for webcam.

## Flow

1. Start **Webcam** or pick a **Video file** (preferred for timing accuracy).
2. Label the emotion.
3. **Record** a take (onset → apex → offset).
4. **Download NDJSON** / take JSON.
5. **Bake preview** in-page, or:

```bash
npm run capture-bake -- --emotion happy --in ./happy-capture.ndjson
```

6. Hand-tune, then merge into `data/emotions/intensity-sculpt-recipes.json`.

## Boundary

Authoring only. Do not stream Capture Studio into the production runtime — Amoji ships pure generation.
