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
| Phase 119 | Escape clears Extreme status flash hold | Done |
| Phase 120 | Disney Extreme overdrive curve punch | Done |
| Phase 121 | Disney Extreme body extrapolation punch | Done |
| Phase 122 | Extreme HUD ease + body mix readout | Done |
| Phase 123 | Extreme nudge hold-to-repeat | Done |
| Phase 124 | Extreme Shift coarse nudge (0.10) | Done |
| Phase 125 | Extreme nudge factor value flash | Done |
| Phase 126 | Extreme X pill ease + mix | Done |
| Phase 127 | Extreme Alt coarser nudge (0.20) | Done |
| Phase 128 | Extreme hotkey catalog extract | Done |
| Phase 129 | Extreme nudge flash coarse Δ | Done |
| Phase 130 | Extreme ease curve spark UI | Done |
| Phase 131 | Extreme summary includes ease + od | Done |
| Phase 132 | Extreme title sync + ease spark click | Done |
| Phase 133 | Extreme E hotkey flash ease curve | Done |
| Phase 134 | Extreme ease spark off-state | Done |
| Phase 135 | Extreme ease label recipe punch | Done |
| Phase 136 | Extreme HUD mini ease spark | Done |
| Phase 137 | Extreme Shift+E copy ease SVG | Done |
| Phase 138 | Extreme body mix curve helpers | Done |
| Phase 139 | Extreme body mix spark panel | Done |
| Phase 140 | Extreme M hotkey flash body mix | Done |
| Phase 141 | Extreme HUD spark click flashes ease | Done |
| Phase 142 | Extreme Shift+M copy body mix SVG | Done |
| Phase 143 | Extreme HUD mini body mix spark | Done |
| Phase 144 | Extreme summary includes body mix | Done |
| Phase 145 | Extreme HUD body spark click flashes mix | Done |
| Phase 146 | Extreme factor bars helpers | Done |
| Phase 147 | Extreme factor bars panel | Done |
| Phase 148 | Extreme F hotkey flash factor bars | Done |
| Phase 149 | Extreme Shift+F copy factor bars SVG | Done |
| Phase 150 | Extreme live HUD recipe readout | Done |
| Phase 151 | Extreme live HUD neck blend | Done |
| Phase 152 | Extreme HUD mini factor bars | Done |
| Phase 153 | Extreme N neck flash + HUD factors click | Done |
| Phase 154 | Extreme live snapshot helper | Done |
| Phase 155 | Extreme bundle label | Done |
| Phase 156 | Extreme A hotkey flash bundle | Done |
| Phase 157 | Extreme summary recipe + neck | Done |
| Phase 158 | Extreme HUD from snapshot | Done |
| Phase 159 | Extreme Face Live snapshot wiring | Done |
| Phase 160 | Extreme Shift+A copy bundle | Done |
| Phase 161 | Extreme bundle copy text stable | Done |
| Phase 162 | Extreme snapshot fingerprint | Done |
| Phase 163 | Extreme spark rebuild fingerprint gate | Done |
| Phase 164 | Extreme snapshot JSON serialize | Done |
| Phase 165 | Extreme J copy snapshot JSON | Done |
| Phase 166 | Extreme parse snapshot JSON | Done |
| Phase 167 | Extreme short fingerprint | Done |
| Phase 168 | Extreme Shift+J paste snapshot JSON | Done |
| Phase 169 | Extreme Face Live paste JSON wiring | Done |
| Phase 170 | Extreme snapshot diff | Done |
| Phase 171 | Extreme snapshot diff label + dirty | Done |
| Phase 172 | Extreme D snapshot diff hotkey | Done |
| Phase 173 | Extreme Face Live diff baseline wiring | Done |
| Phase 174 | Extreme dirty HUD bit | Done |
| Phase 175 | Extreme live dirty pill wiring | Done |
| Phase 176 | Extreme Shift+D restore baseline | Done |
| Phase 177 | Extreme Face Live restore baseline wiring | Done |
| Phase 178 | Extreme capture baseline | Done |
| Phase 179 | Extreme dirty HUD bit with fp | Done |
| Phase 180 | Extreme K clear baseline | Done |
| Phase 181 | Extreme Face Live clear baseline + fp pill | Done |
| Phase 182 | Extreme baseline summary | Done |
| Phase 183 | Extreme baseline pill title wiring | Done |
| Phase 184 | Extreme X pill click flashes diff | Done |
| Phase 185 | Extreme baseline session storage | Done |
| Phase 186 | Extreme snapshot diff copy text | Done |
| Phase 187 | Extreme Shift+C copy snapshot diff | Done |
| Phase 188 | Extreme Face Live copy diff wiring | Done |
| Phase 189 | Extreme summary includes baseline dirty | Done |
| Phase 190 | Extreme snapshot preview label | Done |
| Phase 191 | Extreme drop JSON catalog note | Done |
| Phase 192 | Extreme Face Live drop apply wiring | Done |
| Phase 193 | Extreme Face Live Meta drop preview | Done |
| Phase 194 | Extreme dirty HUD change count | Done |
| Phase 195 | Extreme Face Live dirty×N pill wiring | Done |
| Phase 196 | Extreme dbl-click drop hint paste | Done |
| Phase 197 | Extreme dirty edge flash | Done |
| Phase 198 | Extreme baseline history helpers | Done |
| Phase 199 | Extreme U undo baseline | Done |
| Phase 200 | Extreme Face Live baseline history push | Done |
| Phase 201 | Extreme Face Live undo baseline wiring | Done |
| Phase 202 | Extreme baseline history session storage | Done |
| Phase 203 | Extreme Face Live history persist wiring | Done |
| Phase 204 | Extreme baseline summary history depth | Done |
| Phase 205 | Extreme Face Live hist depth tooltip | Done |
| Phase 206 | Extreme baseline redo session storage | Done |
| Phase 207 | Extreme Shift+U redo baseline | Done |
| Phase 208 | Extreme Face Live redo wiring | Done |
| Phase 209 | Extreme baseline redo depth + tooltip | Done |
| Phase 210 | Extreme auto-capture baseline helper | Done |
| Phase 211 | Extreme Face Live auto-baseline wiring | Done |
| Phase 212 | Extreme bundle label dirty bit | Done |
| Phase 213 | Extreme Face Live bundle dirty wiring | Done |
| Phase 214 | Extreme snapshot hash encode/decode | Done |
| Phase 215 | Extreme snapshot share URL + loadFromHash | Done |
| Phase 216 | Extreme Y share link hotkey | Done |
| Phase 217 | Extreme Face Live share link wiring | Done |
| Phase 218 | Extreme baseline history list labels | Done |
| Phase 219 | Extreme L history list hotkey | Done |
| Phase 220 | Extreme Face Live history chips UI | Done |
| Phase 221 | Extreme Face Live history list wiring | Done |
| Phase 222 | Extreme redo history chip labels | Done |
| Phase 223 | Extreme baseline history JSON serialize | Done |
| Phase 224 | Extreme Shift+L copy hist JSON | Done |
| Phase 225 | Extreme Face Live redo chips + hist export | Done |
| Phase 226 | Extreme baseline history JSON parse | Done |
| Phase 227 | Extreme hist preview label | Done |
| Phase 228 | Extreme I paste hist hotkey | Done |
| Phase 229 | Extreme Face Live hist import wiring | Done |
| Phase 230 | Extreme hist digit jump index | Done |
| Phase 231 | Extreme 1–8 hist jump hotkey | Done |
| Phase 232 | Extreme Shift+I merge hist hotkey | Done |
| Phase 233 | Extreme Face Live digit jump + merge wiring | Done |
| Phase 234 | Extreme has baseline history helper | Done |
| Phase 235 | Extreme Shift+K clear hist + Shift+digit redo jump | Done |
| Phase 236 | Extreme Face Live clear hist helper | Done |
| Phase 237 | Extreme Face Live clear hist + redo jump wiring | Done |
| Phase 238 | Extreme baseline chip preview label | Done |
| Phase 239 | Extreme P pin baseline hotkey | Done |
| Phase 240 | Extreme Face Live Meta chip preview | Done |
| Phase 241 | Extreme Face Live pin baseline wiring | Done |
| Phase 242 | Extreme baseline chip diff label | Done |
| Phase 243 | Extreme baseline redo JSON serialize/parse | Done |
| Phase 244 | Extreme O / Shift+O redo JSON hotkeys | Done |
| Phase 245 | Extreme Face Live chip Alt-diff + redo JSON wiring | Done |
| Phase 246 | Extreme W wipe redo stack | Done |
| Phase 247 | Extreme Alt+O merge redo + Shift-drop redo | Done |
| Phase 248 | Extreme dbl-click chip pin baseline | Done |
| Phase 249 | Extreme hist share URL `#dxh=` / Shift+Y | Done |
| Phase 250 | Extreme redo share URL `#dxr=` / Alt+Y | Done |
| Phase 251 | Extreme chip↔chip compare (Shift+Alt+click) | Done |
| Phase 252 | Extreme favorites S / Shift+S | Done |
| Phase 253 | Extreme More IO overflow declutter | Done |
| Phase 254 | Extreme G / Shift+G / Alt+G favorites JSON | Done |
| Phase 255 | Extreme favorites drop + preview label | Done |
| Phase 256 | Extreme Shift+W wipe favorites | Done |
| Phase 257 | Extreme fav share URL `#dxf=` / T | Done |
| Phase 258 | Extreme Shift+click chip star favorite | Done |
| Phase 259 | Extreme fav depth on X-pill baseline summary | Done |
| Phase 260 | Extreme Esc clears chip compare memory | Done |
| Phase 261 | Extreme Z / Shift+Z stacks JSON bundle | Done |
| Phase 262 | Extreme Alt+Z merge stacks | Done |
| Phase 263 | Extreme Q / Shift+Q cycle favorite | Done |
| Phase 264 | Extreme stacks share URL `#dxb=` / V | Done |
| Phase 265 | Extreme multi-hash load single toast | Done |
| Phase 266 | Extreme Alt+S unstar favorite | Done |
| Phase 267 | Extreme Alt+1–4 favorite jump | Done |
| Phase 268 | Extreme kit share URL `#dxs=`+`#dxb=` / Shift+V | Done |
| Phase 269 | Extreme active favorite chip highlight | Done |
| Phase 270 | Extreme Alt+W wipe stacks | Done |
| Phase 271 | Extreme Ctrl+click hist/redo chip remove | Done |
| Phase 272 | Extreme Alt+P copy fingerprint | Done |
| Phase 273 | Extreme active hist/redo chip highlight | Done |
| Phase 274 | Extreme Alt+L stacks summary | Done |
| Phase 275 | Extreme Alt+K clear pin only | Done |
| Phase 276 | Extreme Alt+V paste kit share | Done |
| Phase 277 | Extreme Esc clears active chips | Done |
| Phase 278 | Extreme Alt+T toggle More IO | Done |
| Phase 279 | Extreme Alt+H copy hotkey help | Done |
| Phase 280 | Extreme Alt+Q / ⇧Alt+Q cycle history | Done |
| Phase 281 | Extreme More IO open persist | Done |
| Phase 282 | Extreme Alt+U / ⇧Alt+U cycle redo | Done |
| Phase 283 | Extreme Alt+R jump pin | Done |
| Phase 284 | Extreme ⇧Alt+L copy stacks summary | Done |
| Phase 285 | Extreme Alt+B paste stacks share | Done |
| Phase 286 | Extreme Alt+F paste fav share | Done |
| Phase 287 | Extreme Alt+I paste hist share | Done |
| Phase 288 | Extreme ⇧Alt+Y paste redo share | Done |
| Phase 289 | Extreme Alt+J paste snap share | Done |
| Phase 290 | Extreme ⇧Alt+F merge fav share | Done |
| Phase 291 | Extreme ⇧Alt+I merge hist share | Done |
| Phase 292 | Extreme ⇧Alt+B merge stacks share | Done |
| Phase 293 | Extreme Alt+C share pin | Done |
| Phase 294 | Extreme ⇧Alt+V merge kit share | Done |
| Phase 295 | Extreme ⇧Alt+O merge redo share | Done |
| Phase 296 | Extreme Alt+D pin summary | Done |
| Phase 297 | Extreme Alt+X focus Extreme panel | Done |
| Phase 298+ | Further production polish… | Specced |

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
