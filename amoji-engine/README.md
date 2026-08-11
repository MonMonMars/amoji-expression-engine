# Amoji Expression Engine

**A Bridge Between AI and Human** — rule-based expression & behavior engine.

Converts AI script semantics (`dialogue + emotion + mood`) into facial/body performance parameters for digital characters and robots.

> Demo character name **Lilith** is for development only. Product brand is **Amoji**.

## Status

| Phase | Scope | Status |
|---|---|---|
| Phase 0 | Repo skeleton + compliance gate (pure-generation boundary) | Done |
| Phase 1 | 8 basic emotions + 2D canvas lab + point catalogs (24/57/77) | Done |
| Phase 2 | Muscle M1–M21 perimeter + Preston Blair visemes + LOCKED/CLAMPED/OPEN mouth resolve | Done (MVP discrete) |
| Phase 3 | Blink / micro-leak / Step-Out temporal layer + Live Link bridge | Done |
| Phase 4 | Cohen–Massaro coarticulation + Layer I personas / breath / 90s idle | Done |
| Phase 5 | Layer T latency bridge + compound emotions + Layer W gait | Done |
| Phase 6 | Layer G gesture stack (Emblem→Adaptor) + Surface Renderer L1–10 | Done |
| Phase 7 | Layer B neck/shoulder/breath + TTS phoneme timing | Done |
| Phase 8 | Smile typology (reward/affiliative/dominance) + laugh head→torso PD | Done |
| Phase 9 | Layer E eyes (VOR/pupil/gaze modes) + Layer 0 script pipeline | Done |
| Phase 10 | MoodEngine (Layer -1) + full-body point retarget (B/W/G) | Done |
| Phase 11 | Layer D Actor Discretion + isolated easter-egg namespace | Done |
| Phase 12 | Robot driver packs (face / upper-body / humanoid) | Done |
| Phase 13 | Capture→bake authoring (video ARKit → sculpts + timing) | Done |
| Phase 14 | MediaPipe Capture Studio (webcam/video → NDJSON) | Done |
| Phase 15 | Bake → emotion-timing (Step-Out / attack / blink) | Done |
| Phase 16 | Chassis calibration (scale/slew) on robot packs | Done |
| Phase 17 | Production TTS wiring (adapter + SpeechPlayer) | Done |
| Phase 18 | YouTube/video capture ingest + face quality gates | Done |
| Phase 19 | Audio sync + Actor Discretion UX depth | Done |
| Phase 20 | TTS provider client (mock/HTTP + audioUrl E2E) | Done |
| Phase 21 | Live Link soak · easter apply · chassis variants | Done |
| Phase 22 | UE Mac soak notes · staging eggs · chassis SKUs | Done |
| Phase 23 | Control Rig remap · hands DOF pack · TTS HTTP config | Done |
| Phase 24 | More remaps · finger articulation · TTS auth smoke | Done |
| Phase 25 | UE consumer remap · finger presets UI · TTS presets | Done |
| Phase 26 | Face Live LL remap · emblem↔finger · gateway TTS | Done |
| Phase 27 | Face Live prefs · affect/adaptor finger maps · gateway smoke docs | Done |
| Phase 28 | Prefs JSON import/export · affect staging · gateway health chip | Done |
| Phase 29 | Auto health poll · prefs URL hash · compound affect staging | Done |
| Phase 30 | Poll backoff · prefs QR/short-link · compound→emblem crossfade | Done |
| Phase 31 | Poll jitter · deep-link landing toast · emblem hold/release | Done |
| Phase 32 | Gateway SLA history · prefs link expiry/revoke · lifecycle cancel | Done |
| Phase 33 | SLA sparkline · prefs share audit · cancel on emblem pick | Done |
| Phase 34 | Sparkline probe detail · audit export JSON · finger-pick cancel | Done |
| Phase 35+ | Further production polish… | Specced |

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
