# Amoji Expression Engine

**A Bridge Between AI and Human** — rule-based expression & behavior engine.

Converts AI script semantics (`dialogue + emotion + mood`) into facial/body performance parameters for digital characters and robots.

> Demo character name **Lilith** is for development only. Product brand is **Amoji**.

## Status

| Phase | Scope | Status |
|---|---|---|

## Quick start

```bash
cd amoji-engine
npm install
npm test
npx --yes serve . -p 5173
# open http://localhost:5173/prototypes/emotion-lab.html
```

## Architecture rules

1. **Pure generation only** — abstract semantic inputs (AEP / `ScriptLine`). No biometric raw streams. See `engine/README.md`.
2. **Compliance gate is mandatory** — every Layer output → `applyComplianceGate()` → renderer. See `engine/compliance/README.md`.
3. **Renderer is swappable** — formulas emit abstract params; `render/canvasRenderer2D.js` is a placeholder face.

## Add an emotion

1. Add a keyframe set + formula in `engine/layers/emotionFormulas.js`
2. Register it in `BASIC_EMOTIONS` / `emotionFormulas`
3. Add unit coverage in `tests/emotions.test.js`
4. Lab dropdown picks it up automatically

Do **not** special-case the renderer for the new emotion.

## Add a viseme

1. Add one entry to `data/visemes/preston-blair-10.json` with `jaw` / `width` / `corner` rules
2. Optionally extend `charToViseme()` mapping
3. `resolveMouth()` needs no code change for new keys

Mouth override is LOCKED / CLAMPED / OPEN (not additive). MBP always forces `jaw = 0`.

Continuous speech: `performSpeech(text, emotion, t, { mode: 'coarticulated' })` uses Cohen–Massaro dominance functions (`engine/layers/coarticulation.js`).

Production TTS: `normalizeTtsPayload` / `SpeechPlayer` — see `docs/TTS_WIRING.md`.

## YouTube / video capture (authoring)

```bash
npm run yt-capture -- --in ./talk.mp4 --emotion happy --start 12 --duration 6
# or: --url 'https://www.youtube.com/watch?v=...'  (yt-dlp)
npm run yt-capture-batch
# http://127.0.0.1:5176/prototypes/yt-capture-batch.html
```

See `tools/yt-capture/README.md`. Respect ToS/copyright; bake curves only.

## Capture → bake (authoring)

Video ARKit takes → intensity sculpts + onset/apex/offset timing. Offline only — not a runtime biometric path.

```bash
npm run capture-bake -- --demo
# npm run capture-bake -- --emotion happy --in ./takes/smile.ndjson

# Webcam / video file → NDJSON (then bake)
npm run capture-studio
# open http://127.0.0.1:5175/prototypes/capture-studio.html
```

See `tools/capture-bake/README.md`.

## Docs

Uploaded research/specs are mirrored under `docs/source/` (OnePagers, Phase checklists, AEP, Complete Spec, etc.).

## License

Private (`UNLICENSED`) for `amoji-core`-style engine code. Public AEP protocol is documented separately (CC-BY 4.0).
