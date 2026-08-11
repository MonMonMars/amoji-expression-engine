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
| Phase 35 | Probe copy · audit clear/filter · chassis/pack cancel | Done |
| Phase 36 | Probe toast · audit search · Live Link remap cancel | Done |
| Phase 37 | Probe toast actions · audit regex/range · surface cancel | Done |
| Phase 38 | Toast shortcuts · audit saved views · persona cancel | Done |
| Phase 39 | Toast focus trap · views export/import · mood cancel | Done |
| Phase 40 | Toast pause-on-hover · views delete · smile/laugh cancel | Done |
| Phase 41 | Toast sticky pin · views rename · gaze cancel | Done |
| Phase 42 | Toast history stack · views duplicate · look cancel | Done |
| Phase 43 | Toast compare · views share snapshot · idle cancel | Done |
| Phase 44 | Toast SLA badge · views folders · spin/cycle cancel | Done |
| Phase 45 | Toast spark mini · views reorder · blink cancel | Done |
| Phase 46 | Toast markdown · views star · Live Link cancel | Done |
| Phase 47 | Toast sound cue · views bulk star · step-out cancel | Done |
| Phase 48 | Toast mute · views starred filter · leak cancel | Done |
| Phase 49 | Toast volume · views clear folder stars · improv cancel | Done |
| Phase 50 | Toast duck on pin · views export starred · arousal cancel | Done |
| Phase 51 | Toast rate-limit · views prune unstarred · robot walk cancel | Done |
| Phase 52 | Toast haptic stub · views import merge starred · robot slew cancel | Done |
| Phase 53 | Toast haptic mute · views import folder filter · latency cancel | Done |
| Phase 54 | Toast linked mute · views export folder · threat/sigh cancel | Done |
| Phase 55 | Toast feedback prefs persist · export starred+folder · turn cancel | Done |
| Phase 56 | Toast feedback hash restore · import starred+folder · speak/TTS cancel | Done |
| Phase 57 | Share audit toast hash · TTS stop/fixture cancel · deliver cancel | Done |
| Phase 58 | Audit toast export filter · TTS synth/http cancel · script hold/clear cancel | Done |
| Phase 59 | Toast hash saved views · TTS preset cancel · disc auto-improv cancel | Done |
| Phase 60 | Toast hash view export · disc stimulus cancel · script hold release cancel | Done |
| Phase 61 | Toast hash view import · TTS endpoint cancel · deliver residue cancel | Done |
| Phase 62 | Toast hash import inherit hint · TTS endpoint blur/input cancel · continuity residual tick cancel | Done |
| Phase 63 | Toast hash import drag preview · TTS endpoint paste cancel · continuity residual morph overlay | Done |
| Phase 64 | Import drag-drop UX · residual decay/tune · TTS endpoint Enter cancel | Done |
| Phase 65 | Shift-drop auto-import · residual decay HUD bar · TTS Escape cancel | Done |
| Phase 66 | Alt-drop replace import · residual peak reset on deliver · TTS Tab blur cancel | Done |
| Phase 67 | Ctrl-drop append import · residual bar color by emotion · TTS focus cancel | Done |
| Phase 68 | Meta-drop dry-run import · residual bar pulse on deliver · TTS cut cancel | Done |
| Phase 69 | Meta+Shift dry-run merge hint · residual pulse on residue deliver · TTS select-all cancel | Done |
| Phase 70 | Meta+Alt dry-run replace hint · residual pulse intensity by emotion · TTS copy cancel | Done |
| Phase 71 | Meta+Ctrl dry-run append hint · residual pulse duration cap HUD · TTS duplicate cancel | Done |
| Phase 72 | Meta dry-run filter summary · residual pulse peak cap HUD · TTS context menu cancel | Done |
| Phase 73 | Dry-run skip breakdown · residual pulse combined HUD helper · endpoint drag cancel | Done |
| Phase 74 | endpoint drag cancel hardening (dragover preventDefault) | Done |
| Phase 75 | Dry-run skip breakdown name-clash test coverage | Done |
| Phase 76 | Combined pulse HUD engine helper · skip breakdown helper · TTS drag-start cancel | Done |
| Phase 77 | Pulse bits engine helper · toast hash dry-run skip test · TTS drag-end cancel | Done |
| Phase 78 | TTS drag-leave cancel | Done |
| Phase 79 | TTS drag cancel allowlist coverage test | Done |
| Phase 80 | TTS dragover cancel reliability | Done |
| Phase 81 | TTS dragover guard coverage test | Done |
| Phase 82 | TTS dragover sets active flag | Done |
| Phase 83 | TTS dragover side effects test | Done |
| Phase 84 | TTS drag-leave resets active flag | Done |
| Phase 85 | TTS dragenter side effects test | Done |
| Phase 86 | TTS dragenter ordering test | Done |
| Phase 87 | TTS dragenter cancel-before-persist test | Done |
| Phase 88 | TTS dragend resets active flag test | Done |
| Phase 89 | TTS dragenter guard sets active test | Done |
| Phase 90 | TTS dragover/dragenter consistency test | Done |
| Phase 91 | TTS drop reset/persist reliability test | Done |
| Phase 92 | TTS dragstart no persist/sync test | Done |
| Phase 93 | Prefs dropzone drag/meta wiring consistency test | Done |
| Phase 94 | Prefs dropzone dragover sets copy dropEffect | Done |
| Phase 95 | Prefs dropzone dragleave/drop removes dragover class | Done |
| Phase 96 | Prefs dropzone inheritExportMeta wiring | Done |
| Phase 97 | Prefs dropzone modifier wiring | Done |
| Phase 98 | Prefs drop refresh order test | Done |
| Phase 99 | Prefs drop sets preview text before refresh | Done |
| Phase 100 | Prefs drop sets preview label before refresh | Done |
| Phase 101 | Prefs drop summarize inheritExportMeta | Done |
| Phase 102 | Face Live intensity slider max 2.0 | Done |
| Phase 103 | Disney Extreme tier (face/body/eye/mouth · prefs · morph clamp) | Done |
| Phase 104 | Disney Extreme amplify helper (engine) | Done |
| Phase 105 | Disney Extreme factor value labels + bodyInt HUD | Done |
| Phase 106 | Disney Extreme Reset × defaults | Done |
| Phase 107 | Disney Extreme live HUD (shapeInt pill + status) | Done |
| Phase 108 | Disney Extreme intensities helper (shape/body) | Done |
| Phase 109 | Disney Extreme hotkey X toggle | Done |
| Phase 110 | Extreme prefs summary + residual intensities | Done |
| Phase 111 | Disney Extreme shape × nudge hotkeys [ ] | Done |
| Phase 112 | Disney Extreme eye/mouth × nudge hotkeys | Done |
| Phase 113 | Disney Extreme body × nudge hotkeys -/= | Done |
| Phase 114 | Extreme hotkey help helper + Copy summary | Done |
| Phase 115 | Extreme C copy + R reset hotkeys | Done |
| Phase 116 | Extreme B body-apply toggle hotkey | Done |
| Phase 117 | Extreme H/? show help hotkey | Done |
| Phase 118 | Extreme status flash hold (copy/help/reset) | Done |
| Phase 119+ | Further production polish… | Specced |

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
