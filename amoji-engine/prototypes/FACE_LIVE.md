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
- Emotion buttons + intensity slider (hand-tuned subtle/medium/peak sculpts; max **2.0**)
- **Disney Extreme**: optional cartoon deform tier — master toggle (`X`) · body apply (`B`) + shape × (`[` `]`) · body × (`-` `=`, enables Apply to body/head) · eyes × (`,` `.`) · mouth × (`;` `'`) · Copy (`C`) · Copy diff (`Shift+C`) · Reset (`R`) · Help (`H` / `?`) · Ease (`E`) · Copy ease SVG (`Shift+E`) · Body mix (`M`) · Copy mix SVG (`Shift+M`) · Factors (`F`) · Copy factors SVG (`Shift+F`) · Neck (`N`) · All (`A`) · Copy all (`Shift+A`) · JSON (`J`) · Paste JSON (`Shift+J`) · Diff baseline (`D` · click X pill) · Restore baseline (`Shift+D`) · Clear baseline (`K`) · Undo baseline (`U`) · Redo baseline (`Shift+U`) · Share link (`Y` · `#dxs=`) · History list (`L` · chips) · drop snapshot JSON on Extreme panel (Meta = preview · dbl-click hint = paste) · Esc clears sticky status flash · hold factor nudges to repeat · Shift = coarse 0.10 steps · Alt = coarser 0.20 steps · nudge flashes current × value (+ Δ when coarse) (~0.7s) (persisted, live value labels, Reset × defaults, Copy summary, shared hotkey help legend (catalog-driven), sticky status flash hold ~2.2s, prefs summary tooltip + landing toast · Copy includes od× + ease + recipe + mix/neck when applicable · summary/title append dirty/clean fp when baseline set · X pill tooltip shows hist N / redo N · auto-baseline on X-on when none · A/⇧A bundle appends dirty/clean · `#dxs=` share/load); `buildDisneyExtremeLiveSnapshot` / `formatDisneyExtremeBundleLabel` (`A` · `Shift+A` copy) · `serializeDisneyExtremeSnapshot` (`J`) · `parseDisneyExtremeSnapshot` (`Shift+J`) · `diffDisneyExtremeSnapshots` / dirty vs last copy·paste (`D`) · `formatDisneyExtremeSnapshotDiffCopyText` (`Shift+C`) · `formatDisneyExtremeSnapshotPreviewLabel` (Meta drop) · restore baseline (`Shift+D`) · `captureDisneyExtremeBaseline` · baseline history (`pushDisneyExtremeBaselineHistory` / `U` undo · `Shift+U` redo · `L` list · chips · sessionStorage) · `saveDisneyExtremeBaseline` / `loadDisneyExtremeBaseline` (sessionStorage) · clear baseline (`K`) · live X pill dirty×N/clean + baseline fp + tooltip + `is-dirty` + dirty-edge flash · short fingerprint on copy/paste flash · Face Live animate/flashes via snapshot · spark SVG rebuilds gated by fingerprint; stronger Extreme-band ease/recipe overdrive gains + body mix cap 1.5 / neck scale blend 0.75; live ease curve spark (`buildDisneyExtremeEaseSparkSvg` · marker = shapeInt · dim when off · click flashes label · HUD mini spark clickable) + label (recipe × when overdrive); body mix spark (`buildDisneyExtremeBodyMixSparkSvg` · marker = bodyInt · `M` · HUD mini · clickable · `Shift+M` copy SVG) + label; factor bars (`buildDisneyExtremeFactorBarsSvg` · shape/body/eye/mouth · `F` · `Shift+F` copy · HUD mini clickable); neck flash (`N` · `formatDisneyExtremeNeckLabel`); live HUD shows `ease` + `mix` + `recipe ×` (when overdrive) + `neck` (when body on) with shape/body ints; `computeDisneyExtremeIntensities` for shape/body/residual ints; `amplifyDisneyExtremeMorphs` amplifies eye/brow/lid + mouth/lip/jaw morphs late in the frame (cap 2.0); extrapolates Layer B + scales head/neck bones; live `formatDisneyExtremeLiveHud` status + X pill (`shape · e{ease} · m{mix}`) and body status / HUD show `bodyInt` when Extreme is on
- **Phase 3:** Step-Out next · Force leak · Mood fear · emotion-modulated blink
- **Persona / Layer I:** companion·corporate·care·education·home + calm/alert/tense breath ladder (90s variant rotate)
- **Compound emotions:** 6 region-locked blends (e.g. 開心的驚訝)
- **Layer T:** Sim AI latency (gaze → pensive filler → secondary) + Improv noise
- **Layer W gait HUD:** speed / stride / arm origin / footfall weight
- **Layer G gesture:** Emblem select / Wave / Speaking (Illustrator) / turn Regulators — Affect from emotion, Adaptor after ~3s gap; drives Sakura arm bones
- **Layer B neck/shoulder:** emotion-driven head tilt + accessory-muscle breath; Threat freeze / Sigh; head-down×gaze lock → anger vs sad
- **Layer -1 Mood:** slow-transition background mood (embarrassed/anxious/…) biases intensity + leaks signature morphs; retarget HUD for body points
- **Layer D Discretion:** emotion continuity across picks; Gap improv (blocked while Script hold); passive mood leak
- **Easter eggs:** multi-toggle (NLP / nose / aversion / arms / chin-think / nape / open-palm) — default off, locked for corporate/care/education, non-science
- **Smile / Laugh:** reward · affiliative · dominance (persona defaults); Laugh → head bob with PD-derived torso/shoulders + contagion freshness
- **Surface Renderer L1–10:** same emotion → glow / pixel / emoji / mesh fidelity hints (uncanny risk chip); L1–3 abstract overlay
- **Live Link pub** → `npm run livelink` bridge; soak with `npm run livelink:soak`; Face Live **LL remap** picker
- **Eye look-at / Layer E:** camera track or manual; gaze modes lock/avoid/scan/presentation/camera; Turn-start/end; VOR vs head; pupil scale
- Idle sway / turntable / cycle emotions / blink
- HUD: mesh LOD, tex LOD, surface, gesture, body, eyes, tris, emotion, FPS
- Debug: active morphs + **ARKit 52** + **robot DOF** nonzero export preview
- **Robot packs**: face-servo-12 / upper-body-companion / upper-body-hands / upper-body-fingers / humanoid-stub
- **Finger presets**: rest · fist · open-palm · point · ok · wave · pinch · thumbs-up · chin-rest · self-hug · fists (emblem / affect / adaptor sync)
- **Prefs**: Face Live restores from `localStorage`; share audit with filter / search / **regex** / **time range** / **toast in hash** (saved views + `#flv=` + **export toast hash views**) / **saved views** (folders · stars · starred-only · bulk star · clear folder stars · prune unstarred · export starred / folder / **starred folder** · import merge starred / folder / **toast hash** filter / **inherit export meta** / **inherit hint preview** / **drag-drop preview label** / **Meta+drop dry-run** / **Meta+Shift merge hint** / **Meta+Alt replace hint** / **Meta+Ctrl append hint** / **Shift+drop merge** / **Alt+drop replace** / **Ctrl+drop append** · drag reorder · export/import/delete/rename/duplicate/share `#flv=`) / Export / **Export toast hash** / Clear · **probe toast feedback** (mute/volume/link) persisted + **hash restore** · share audit records **toast-in-hash** · TTS endpoint edits cancel compound lifecycle (input · paste · cut · copy · drag-start · drag-end · drag-leave · …)
- **TTS speak**: Probe gateway sparkline → probe toast (**Prev / Next / Compare / Copy / MD / Re-probe / Pin / Dismiss**, **SLA badge** + **latency spark mini** + **sound cue** / mute / volume / duck on pin / rate-limit / **haptic** / mute / **linked mute** (persisted + hash restore), shortcuts **[ ] = c m r p esc**, history + compare, **Tab** focus trap, **hover pause**) → **Copy probe**
- **Compound emotions**: lifecycle cancelled by emotion / emblem / finger / chassis / pack / remap / surface / persona / mood / smile / laugh / gaze / look / idle / spin / cycle / blink / Live Link / step-out / mood leak / improv / **auto-improv** / **stimulus** / arousal / robot walk / robot slew / latency / threat / sigh / **turn** / **speak** / **TTS play·stop·fixture·synth·http·preset·endpoint·focus·blur·tab-blur·input·paste·cut·copy·select-all·duplicate·context-menu·enter·escape** / **deliver·deliver residue·continuity residual·script hold·hold release·clear** picks
- **Layer D**: Deliver line / Clear residue / stimulus / auto improv / gap meter / **residual decay bar (emotion tint · pulse-residue intensity · duration/peak cap HUD)** / continuity HUD · **residual decay + tuned morph overlay**
- **Chassis calib**: desktop-buddy (+ expressive/quiet) / lobby-companion (+ quiet/hands/fingers) / lab-humanoid (+ demo) — gains, invert, deadzone, slew

## Code

- UI: `prototypes/face-live.html`
- Mapping: `engine/layers/emotionMorphs.js` + `data/emotions/intensity-sculpt-recipes.json`
- Temporal: `engine/layers/temporalLayer.js`
- Idle / personas: `engine/layers/idleMode.js` + `data/personas/catalog.json`
- Mood: `engine/layers/moodEngine.js` + `data/moods/catalog.json`
- Discretion: `engine/layers/discretion.js`
- Easter eggs: `engine/easterEggs/index.js` + `data/easterEggs/catalog.json` (non-science)
- Latency: `engine/layers/latencyBridge.js` + `data/fillers/filler-pools.json`
- Compounds: `engine/layers/compoundEmotion.js` + `data/compounds/region-ownership.json`
- Gait: `engine/layers/gait.js` + `data/gait/emotion-gait.json`
- Gesture: `engine/layers/gesture.js` + `data/gestures/catalog.json`
- Body: `engine/layers/neckShoulder.js` + `data/body/emotion-neck-shoulder.json`
- Retarget: `engine/layers/bodyRetarget.js` + `data/points/body-40.json`
- Eyes: `engine/layers/eyeLook.js` + `engine/layers/eyeAnchor.js` + `data/eyes/layer-e.json`
- Script: `engine/layers/scriptLine.js` + `data/script/line-schema.json` (`performScript`)
- Smile / laugh: `engine/layers/smileLaugh.js` + `data/emotions/smile-types.json`
- Phoneme timing: `engine/layers/phonemeTiming.js` + `data/visemes/phoneme-to-viseme.json`
- TTS wiring: `engine/tts/*` + `docs/TTS_WIRING.md` + `data/tts/fixtures/`
- Surface: `engine/layers/surfaceRenderer.js` + `data/surface/levels.json`
- Coarticulation: `engine/layers/coarticulation.js` (Emotion Lab checkbox)
- Textures: `engine/layers/textureLod.js`
- ARKit / Live Link: `engine/export/arkitExporter.js`, `liveLinkFace.js`, `liveLinkSoak.js`, `controlRigRemap.js`, `prototypes/livelink-bridge.mjs`, `livelink-soak.mjs`
- Robot drivers: `engine/export/robotDriver.js` + `fingerArticulation.js` + `fingerPresets.js` + `emblemFingerSync.js` + `data/robots/catalog.json` + `data/gestures/finger-presets.json`
- Chassis calib: `engine/export/chassisCalibrate.js` + `data/robots/chassis.json` (Face Live chassis + slew + variants)
- TTS config: `engine/tts/ttsConfig.js` · presets `ttsPresets.js` · smoke `ttsSmoke.js` (`npm run tts:smoke`)
- Capture→bake (authoring): `engine/capture/captureBake.js` + `tools/capture-bake/` — video ARKit → sculpts/timing; not runtime
- Capture Studio: `prototypes/capture-studio.html` (`npm run capture-studio`) — MediaPipe webcam/video → NDJSON
- YT/video batch: `tools/yt-capture/` + `prototypes/yt-capture-batch.html` — prep clip → quality gate → bake
- Emotion timing: `data/temporal/emotion-timing.json` — Step-Out / attack / blink (updated via `capture-bake --apply-temporal`)
- Unreal: `assets/characters/jp-female-v0/UNREAL_LIVELINK.md`
- Studio method reference: `docs/STUDIO_HUMAN_MODEL_REFERENCE.md`
