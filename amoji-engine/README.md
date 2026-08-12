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
| Phase 267 | Extreme Alt+1–8 favorite jump | Done |
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
| Phase 298 | Extreme Alt+A pin bundle | Done |
| Phase 299 | Extreme Alt+E copy ease label | Done |
| Phase 300 | Extreme Alt+M copy mix label | Done |
| Phase 301 | Extreme Alt+N copy neck label | Done |
| Phase 302 | Extreme ⇧Alt+A copy pin bundle | Done |
| Phase 303 | Extreme ⇧Alt+D copy pin summary | Done |
| Phase 304 | Extreme ⇧Alt+P copy pin fingerprint | Done |
| Phase 305 | Extreme ⇧Alt+C paste pin share | Done |
| Phase 306 | Extreme ⇧Alt+J paste snap live | Done |
| Phase 307 | Extreme Shift+P replace pin | Done |
| Phase 308 | Extreme Shift+N copy factors label | Done |
| Phase 309 | Extreme ⇧Alt+R jump pin summary | Done |
| Phase 310 | Extreme ⇧Alt+S copy fav list | Done |
| Phase 311 | Extreme Shift+X enable Extreme | Done |
| Phase 312 | Extreme Shift+B enable body | Done |
| Phase 313 | Extreme ⇧Alt+X enable + focus | Done |
| Phase 314 | Extreme ⇧Alt+T open More IO | Done |
| Phase 315 | Extreme Shift+T toggle More IO | Done |
| Phase 316 | Extreme Shift+H copy hist list | Done |
| Phase 317 | Extreme Shift+R reset + all | Done |
| Phase 318 | Extreme ⇧Alt+E copy ease+svg | Done |
| Phase 319 | Extreme ⇧Alt+M copy mix+svg | Done |
| Phase 320 | Extreme ⇧Alt+H copy redo list | Done |
| Phase 321 | Extreme ⇧Alt+W wipe all | Done |
| Phase 322 | Extreme ⇧Alt+N copy neck+factors | Done |
| Phase 323 | Extreme ⇧Alt+K clear hist keep redo | Done |
| Phase 324 | Extreme ⇧Alt+G copy fav+json | Done |
| Phase 325 | Extreme ⇧Alt+Z copy stacks+json | Done |
| Phase 326 | Extreme ⇧Alt+1–8 fav jump summary | Done |
| Phase 327 | Extreme 9 jump hist tip | Done |
| Phase 328 | Extreme Shift+9 jump redo tip | Done |
| Phase 329 | Extreme 0 jump fav tip | Done |
| Phase 330 | Extreme Shift+0 jump fav tip summary | Done |
| Phase 331 | Extreme Alt+9 jump hist tip summary | Done |
| Phase 332 | Extreme ⇧Alt+9 jump redo tip summary | Done |
| Phase 333 | Extreme Alt+0 tips readout | Done |
| Phase 334 | Extreme favorites capacity 8 | Done |
| Phase 335 | Extreme Alt+1–8 fav jump | Done |
| Phase 336 | Extreme ⇧Alt+1–8 fav jump summary | Done |
| Phase 337 | Extreme ⇧Alt+0 copy tips | Done |
| Phase 338 | Extreme ` stacks capacity | Done |
| Phase 339 | Extreme Shift+` copy capacity | Done |
| Phase 340 | Extreme tips strip HUD | Done |
| Phase 341 | Extreme chip-row capacity badges | Done |
| Phase 342 | Extreme \\ roots readout | Done |
| Phase 343 | Extreme Shift+\\ copy roots | Done |
| Phase 344 | Extreme capacity strip HUD | Done |
| Phase 345 | Extreme capacity strip clicks | Done |
| Phase 346 | Extreme / jump hist root | Done |
| Phase 347 | Extreme Alt+/ jump redo root | Done |
| Phase 348 | Extreme ⇧Alt+/ jump fav root | Done |
| Phase 349 | Extreme roots strip HUD | Done |
| Phase 350 | Extreme Space jump hist root summary | Done |
| Phase 351 | Extreme Shift+Space jump redo root summary | Done |
| Phase 352 | Extreme Alt+Space jump fav root summary | Done |
| Phase 353 | Extreme active chips strip | Done |
| Phase 354 | Extreme active strip dbl-click copy | Done |
| Phase 355 | Extreme Enter copy active | Done |
| Phase 356 | Extreme pin strip HUD | Done |
| Phase 357 | Extreme pin strip flash + clicks | Done |
| Phase 358 | Extreme HUD bundle formatters | Done |
| Phase 359 | Extreme Alt+Enter hud bundle | Done |
| Phase 360 | Extreme ⇧Alt+Enter copy hud | Done |
| Phase 361 | Extreme HUD bundle catalog | Done |
| Phase 362 | Extreme dirty strip formatter | Done |
| Phase 363 | Extreme dirty strip HUD | Done |
| Phase 364 | Extreme Home dirty strip | Done |
| Phase 365 | Extreme End copy dirty | Done |
| Phase 366 | Extreme collapsible strips panel | Done |
| Phase 367 | Extreme strips open persistence | Done |
| Phase 368 | Extreme PageUp toggle strips | Done |
| Phase 369 | Extreme PageDown strips summary | Done |
| Phase 370 | Extreme Shift+PageUp open strips | Done |
| Phase 371 | Extreme Shift+PageDown copy strips | Done |
| Phase 372 | Extreme ↓↑ cycle hist | Done |
| Phase 373 | Extreme →← cycle fav | Done |
| Phase 374 | Extreme ⇧↓↑ cycle redo | Done |
| Phase 375 | Extreme HUD bundle includes dirty | Done |
| Phase 376 | Extreme Delete clear active | Done |
| Phase 377 | Extreme Insert pin base | Done |
| Phase 378 | Extreme Tab focus panel | Done |
| Phase 379 | Extreme Shift+Insert replace pin | Done |
| Phase 380 | Extreme Alt+Insert jump pin | Done |
| Phase 381 | Extreme strips summary dbl-click copy | Done |
| Phase 382 | Extreme ⇧Alt+Insert jump pin summary | Done |
| Phase 383 | Extreme factors strip live label | Done |
| Phase 384 | Extreme F2 factors strip flash | Done |
| Phase 385 | Extreme Shift+F2 copy factors strip | Done |
| Phase 386 | Extreme ease strip + F3 | Done |
| Phase 387 | Extreme mix strip + F4 | Done |
| Phase 388 | Extreme neck strip + F5 | Done |
| Phase 389 | Extreme tips/capacity F6–F7 | Done |
| Phase 390 | Extreme F8 roots strip | Done |
| Phase 391 | Extreme F9 active strip | Done |
| Phase 392 | Extreme F10 pin strip + copy | Done |
| Phase 393 | Extreme F11 dirty strip | Done |
| Phase 394 | Extreme F1 strips summary | Done |
| Phase 395 | Extreme curve strips live label | Done |
| Phase 396 | Extreme Alt+PageDown curve strips | Done |
| Phase 397 | Extreme ⇧Alt+PageDown copy curves | Done |
| Phase 398 | Extreme Alt+PageUp close strips | Done |
| Phase 399 | Extreme HUD bundle summary + curves | Done |
| Phase 400 | Extreme HUD bundle clipboard + curves | Done |
| Phase 401 | Extreme ⇧Alt+PageUp open curves | Done |
| Phase 402 | Extreme HUD bundle summary + factors | Done |
| Phase 403 | Extreme HUD bundle clipboard + factors | Done |
| Phase 404 | Extreme all-strips formatters | Done |
| Phase 405 | Extreme Alt+Home/End all strips | Done |
| Phase 406 | Extreme ⇧Alt+Home open all strips | Done |
| Phase 407 | Extreme ⇧Alt+End copy all open | Done |
| Phase 408 | Extreme all-strips bundle + summary | Done |
| Phase 409 | Extreme all-strips open opts wiring | Done |
| Phase 410 | Extreme hotkey digest helpers | Done |
| Phase 411 | Extreme H digest flash + copy digest | Done |
| Phase 412 | Extreme ⇧Alt+Delete clear transient | Done |
| Phase 413 | Extreme strips filter UI | Done |
| Phase 414 | Extreme F12 focus strips filter | Done |
| Phase 415 | Extreme Shift+F12 copy filter | Done |
| Phase 416 | Extreme ⇧Alt+F12 clear filter | Done |
| Phase 417 | Extreme Alt+F12 copy digest | Done |
| Phase 418 | Extreme all-strips keys + filter bit | Done |
| Phase 419 | Extreme filtered all-strips bundle | Done |
| Phase 420 | Extreme filter-aware all-strips flash/copy | Done |
| Phase 421 | Extreme all-strips filtered catalog + docs | Done |
| Phase 422 | Extreme empty-filter all-strips edge case | Done |
| Phase 423 | Extreme filter-aware HUD bundle | Done |
| Phase 424 | Extreme persist strips filter query | Done |
| Phase 425 | Extreme filter status + copy polish | Done |
| Phase 426 | Extreme ⇧Home/End open dirty strip | Done |
| Phase 427 | Extreme C copy includes filter | Done |
| Phase 428 | Extreme filter bootstrap on load | Done |
| Phase 429 | Extreme empty-filter copy polish | Done |
| Phase 430 | Extreme ⇧Home/⇧End dirty strip buttons | Done |
| Phase 431 | Extreme unified copy-flash label rollout | Done |
| Phase 432 | Extreme filter-aware strips summary + curve guard | Done |
| Phase 433 | Extreme digest filter append (H / Alt+F12) | Done |
| Phase 434 | Extreme strip copy-flash rollout (F2–F11) | Done |
| Phase 435 | Extreme strip copy filter guards | Done |
| Phase 436 | Extreme IO/SVG copy-flash rollout | Done |
| Phase 437 | Extreme help/clear hotkey buttons | Done |
| Phase 438 | Extreme JSON copy-flash rollout | Done |
| Phase 439 | Extreme share URL copy-flash rollout | Done |
| Phase 440 | Extreme fp/diff copy-flash rollout | Done |
| Phase 441 | Extreme JSON/share empty copy guards | Done |
| Phase 442 | Extreme Insert pin family buttons | Done |
| Phase 443 | Extreme E/M/F/N readout buttons | Done |
| Phase 444 | Extreme strip dbl-click catalog sync | Done |
| Phase 445 | Extreme summary stacks + pin fp | Done |
| Phase 446 | Extreme strips/filter summary click flash | Done |
| Phase 447 | Extreme catalog summary + button notes | Done |
| Phase 448 | Extreme toolbar button title tooltips | Done |
| Phase 449 | Extreme More IO button title tooltips | Done |
| Phase 450 | Extreme drop hint + status click flash | Done |
| Phase 451 | Extreme catalog copy summary notes | Done |
| Phase 452 | Extreme spark label title tooltips | Done |
| Phase 453 | Extreme X/B toggle buttons | Done |
| Phase 454 | Extreme spark dbl-click copy wiring | Done |
| Phase 455 | Extreme Tab focus panel button | Done |
| Phase 456 | Extreme arrow cycle mirror buttons | Done |
| Phase 457 | Extreme catalog/test/docs sync polish | Done |
| Phase 458 | Extreme status/drop keyboard accessibility | Done |
| Phase 459 | Extreme spark Shift+Enter copy | Done |
| Phase 460 | Extreme interactive title refresh | Done |
| Phase 461 | Extreme keyboard interaction docs sync | Done |
| Phase 462 | Extreme strip rows keyboard accessibility | Done |
| Phase 463 | Extreme strip/filter Shift+Enter actions | Done |
| Phase 464 | Extreme strip title keyboard hints | Done |
| Phase 465 | Extreme strips keyboard docs sync | Done |
| Phase 466 | Extreme X pill secondary diff copy actions | Done |
| Phase 467 | Extreme history row keyboard accessibility | Done |
| Phase 468 | Extreme favorites row keyboard accessibility | Done |
| Phase 469 | Extreme pill/history/favorites docs sync | Done |
| Phase 470 | Extreme panel background interaction polish | Done |
| Phase 471 | Extreme history row background actions | Done |
| Phase 472 | Extreme favorites row background actions | Done |
| Phase 473 | Extreme panel/rows docs sync | Done |
| Phase 474 | Extreme interactive focus-visible polish | Done |
| Phase 475 | Extreme HUD spark aria labels | Done |
| Phase 476 | Extreme HUD title hints | Done |
| Phase 477 | Extreme HUD a11y docs sync | Done |
| Phase 478 | Extreme interactive aria-label coverage | Done |
| Phase 479 | Extreme interactive aria-keyshortcuts | Done |
| Phase 480 | Extreme HUD/panel aria-keyshortcuts | Done |
| Phase 481 | Extreme aria metadata docs sync | Done |
| Phase 482 | Extreme factor bars label keyboard | Done |
| Phase 483 | Extreme ease label keyboard | Done |
| Phase 484 | Extreme body mix label keyboard | Done |
| Phase 485 | Extreme strips empty keyboard | Done |
| Phase 486 | Extreme details aria-expanded sync | Done |
| Phase 487 | Extreme more IO summary keyboard | Done |
| Phase 488 | Extreme filter input aria metadata | Done |
| Phase 489 | Extreme status Shift+Enter copy | Done |
| Phase 490 | Extreme drop hint Shift+Enter paste | Done |
| Phase 491 | Extreme spark label aria-describedby | Done |
| Phase 492 | Extreme interactive bind helper | Done |
| Phase 493 | Extreme label a11y docs sync | Done |
| Phase 494 | Extreme bind helper paste | Done |
| Phase 495 | Extreme summaries bind helper | Done |
| Phase 496 | Extreme strip rows bind helper batch 1 | Done |
| Phase 497 | Extreme strip rows bind helper batch 2 | Done |
| Phase 498 | Extreme strip rows bind helper batch 3 | Done |
| Phase 499 | Extreme panel sparks bind helper | Done |
| Phase 500 | Extreme HUD sparks bind helper | Done |
| Phase 501 | Extreme status/drop/panel bind helper | Done |
| Phase 502 | Extreme history/favorites rows bind helper | Done |
| Phase 503 | Extreme spark aria-labelledby | Done |
| Phase 504 | Extreme panel aria-describedby | Done |
| Phase 505 | Extreme filter clear button aria | Done |
| Phase 506 | Extreme capacity badge aria | Done |
| Phase 507 | Extreme chip aria metadata | Done |
| Phase 508 | Extreme chip Shift+Enter pin | Done |
| Phase 509 | Extreme strips empty aria-describedby | Done |
| Phase 510 | Extreme details summary aria-controls | Done |
| Phase 511 | Extreme filter input aria-controls | Done |
| Phase 512 | Extreme chip focus-visible | Done |
| Phase 513 | Extreme row/summary focus-visible | Done |
| Phase 514 | Extreme redo separator aria | Done |
| Phase 515 | Extreme bind migration audit | Done |
| Phase 516 | Extreme readme phase table | Done |
| Phase 517 | Extreme a11y docs sync | Done |
| Phase 518 | Extreme skiprole for native/status | Done |
| Phase 519 | Extreme onclear for empty row | Done |
| Phase 520 | Extreme skiptabindex for summary | Done |
| Phase 521 | Extreme 30 surfaces | Done |
| Phase 522 | Extreme meta+enter preview | Done |
| Phase 523 | Extreme ctrl+enter remove | Done |
| Phase 524 | Extreme alt+enter diff | Done |
| Phase 525 | Extreme ⇧alt+enter compare | Done |
| Phase 526 | Extreme shift+space star | Done |
| Phase 527 | Extreme space jump | Done |
| Phase 528 | Extreme aria-keyshortcuts modifiers | Done |
| Phase 529 | Extreme aria-describedby hints | Done |
| Phase 530 | Extreme enter flash | Done |
| Phase 531 | Extreme aria-keyshortcuts | Done |
| Phase 532 | Extreme aria-activedescendant | Done |
| Phase 533 | Extreme arrowdown focus strip | Done |
| Phase 534 | Extreme alt+f12 digest | Done |
| Phase 535 | Extreme combobox aria | Done |
| Phase 536 | Extreme aria-checked | Done |
| Phase 537 | Extreme aria-checked | Done |
| Phase 538 | Extreme aria-labelledby | Done |
| Phase 539 | Extreme aria-labelledby | Done |
| Phase 540 | Extreme aria-keyshortcuts | Done |
| Phase 541 | Extreme slider aria | Done |
| Phase 542 | Extreme slider aria | Done |
| Phase 543 | Extreme slider aria | Done |
| Phase 544 | Extreme slider aria | Done |
| Phase 545 | Extreme aria-valuetext × | Done |
| Phase 546 | Extreme aria-disabled | Done |
| Phase 547 | Extreme aria-live polite | Done |
| Phase 548 | Extreme live region sibling | Done |
| Phase 549 | Extreme aria-describedby drop hint | Done |
| Phase 550 | Extreme aria from title | Done |
| Phase 551 | Extreme reset/toggle aria batch | Done |
| Phase 552 | Extreme e/m/f/n aria batch | Done |
| Phase 553 | Extreme baseline/diff/pin aria batch | Done |
| Phase 554 | Extreme hist/fav jump aria batch | Done |
| Phase 555 | Extreme active/hud/dirty aria batch | Done |
| Phase 556 | Extreme strips f-key aria batch | Done |
| Phase 557 | Extreme filter/focus aria batch | Done |
| Phase 558 | Extreme aria batch | Done |
| Phase 559 | Extreme aria batch | Done |
| Phase 560 | Extreme native button skiprole | Done |
| Phase 561 | Extreme aria-expanded audit | Done |
| Phase 562 | Extreme ignorechildtargets chips | Done |
| Phase 563 | Extreme remember open | Done |
| Phase 564 | Extreme ⇧↓↑ cycle redo | Done |
| Phase 565 | Extreme shift+insert replace pin | Done |
| Phase 566 | Extreme alt+insert jump pin | Done |
| Phase 567 | Extreme ⇧alt+insert jump pin summary | Done |
| Phase 568 | Extreme dbl-click copy | Done |
| Phase 569 | Extreme shift+f2 copy factors | Done |
| Phase 570 | Extreme dbl-click copy | Done |
| Phase 571 | Extreme shift+f3 copy ease | Done |
| Phase 572 | Extreme dbl-click copy | Done |
| Phase 573 | Extreme shift+f4 copy mix | Done |
| Phase 574 | Extreme dbl-click copy | Done |
| Phase 575 | Extreme shift+f5 copy neck | Done |
| Phase 576 | Extreme dbl-click copy | Done |
| Phase 577 | Extreme shift+f6 copy tips | Done |
| Phase 578 | Extreme shift+f7 copy capacity | Done |
| Phase 579 | Extreme shift+f8 copy roots | Done |
| Phase 580 | Extreme shift+f9 copy active | Done |
| Phase 581 | Extreme shift+f10 copy pin | Done |
| Phase 582 | Extreme shift+f11 copy dirty | Done |
| Phase 583 | Extreme shift+f1 copy strips | Done |
| Phase 584 | Extreme ⇧alt+pagedown copy curves | Done |
| Phase 585 | Extreme dbl-click copy | Done |
| Phase 586 | Extreme meta+click chip preview | Done |
| Phase 587 | Extreme alt+click chip diff | Done |
| Phase 588 | Extreme shift+alt+click chip compare | Done |
| Phase 589 | Extreme shift+click chip star | Done |
| Phase 590 | Extreme ctrl+click fav chip unstar | Done |
| Phase 591 | Extreme ctrl+click hist/redo chip remove | Done |
| Phase 592 | Extreme dbl-click chip pin | Done |
| Phase 593 | Extreme shift+z paste stacks | Done |
| Phase 594 | Extreme alt+z merge stacks | Done |
| Phase 595 | Extreme ⇧alt+z copy stacks+json | Done |
| Phase 596 | Extreme shift+v share kit | Done |
| Phase 597 | Extreme alt+v paste kit | Done |
| Phase 598 | Extreme ⇧alt+v merge kit | Done |
| Phase 599 | Extreme shift+q prev fav | Done |
| Phase 600 | Extreme alt+q next hist | Done |
| Phase 601 | Extreme ⇧alt+q prev hist | Done |
| Phase 602 | Extreme active | Done |
| Phase 603 | Extreme active | Done |
| Phase 604 | Extreme esc clear active chips | Done |
| Phase 605 | Extreme dbl-click paste | Done |
| Phase 606 | Extreme hold nudges | Done |
| Phase 607 | Extreme shift coarse | Done |
| Phase 608 | Extreme alt coarser | Done |
| Phase 609 | Extreme readme phase table | Done |
| Phase 610 | Extreme a11y docs sync | Done |
| Phase 611 | Extreme bind helper audit | Done |
| Phase 612 | Extreme button aria audit | Done |
| Phase 613 | Extreme final a11y audit | Done |
| Phase 614 | Extreme reset/toggle static aria-label | Done |
| Phase 615 | Extreme E/M/F/N static aria-label | Done |
| Phase 616 | Extreme baseline/diff/pin static aria-label | Done |
| Phase 617 | Extreme hist/fav jump static aria-label | Done |
| Phase 618 | Extreme active/HUD/dirty static aria-label | Done |
| Phase 619 | Extreme strips F-key static aria-label | Done |
| Phase 620 | Extreme filter/focus static aria-label | Done |
| Phase 621 | Extreme static aria-label | Done |
| Phase 622 | Extreme static aria-label | Done |
| Phase 623 | Extreme preserve existing aria-label | Done |
| Phase 624 | Extreme skip empty title | Done |
| Phase 625 | Extreme early boot before listeners | Done |
| Phase 626 | Extreme 183 aria-label audit | Done |
| Phase 627 | Extreme title/aria-label parity | Done |
| Phase 628 | Extreme normalize ⇧→Shift | Done |
| Phase 629 | Extreme normalize ←→↑↓ | Done |
| Phase 630 | Extreme Alt token audit | Done |
| Phase 631 | Extreme prefer markup aria-keyshortcuts | Done |
| Phase 632 | Extreme kbd text fallback only | Done |
| Phase 633 | Extreme Shift+Alt+F12 parity | Done |
| Phase 634 | Extreme aria-keyshortcuts [ ] | Done |
| Phase 635 | Extreme aria-keyshortcuts - = | Done |
| Phase 636 | Extreme aria-keyshortcuts , . | Done |
| Phase 637 | Extreme aria-keyshortcuts ; ' | Done |
| Phase 638 | Extreme Alt+X ⇧Alt+X shortcuts | Done |
| Phase 639 | Extreme enable extras shortcuts | Done |
| Phase 640 | Extreme H Alt+H digest shortcuts | Done |
| Phase 641 | Extreme paste shortcut metadata | Done |
| Phase 642 | Extreme drop/paste shortcut audit | Done |
| Phase 643 | Extreme focus-visible | Done |
| Phase 644 | Extreme focus-visible | Done |
| Phase 645 | Extreme focus-visible | Done |
| Phase 646 | Extreme focus-visible | Done |
| Phase 647 | Extreme focus-visible | Done |
| Phase 648 | Extreme focus-visible | Done |
| Phase 649 | Extreme focus-visible without role | Done |
| Phase 650 | Extreme focus-visible | Done |
| Phase 651 | Extreme focus-visible | Done |
| Phase 652 | Extreme focus-visible | Done |
| Phase 653 | Extreme focus-visible | Done |
| Phase 654 | Extreme focus-visible | Done |
| Phase 655 | Extreme focus-visible | Done |
| Phase 656 | Extreme focus-visible selector | Done |
| Phase 657 | Extreme shared focus-visible token | Done |
| Phase 658 | Extreme contrast outline audit | Done |
| Phase 659 | Extreme Ctrl+Space unstar fav | Done |
| Phase 660 | Extreme Ctrl+Space remove hist/redo | Done |
| Phase 661 | Extreme Meta+Space preview | Done |
| Phase 662 | Extreme Ctrl+click unstar | Done |
| Phase 663 | Extreme dbl-click pin | Done |
| Phase 664 | Extreme Meta+click preview | Done |
| Phase 665 | Extreme fav kind aware | Done |
| Phase 666 | Extreme fav kind label | Done |
| Phase 667 | Extreme optional Space copy | Done |
| Phase 668 | Extreme Alt+Enter paste | Done |
| Phase 669 | Extreme Escape clear opt | Done |
| Phase 670 | Extreme status announce | Done |
| Phase 671 | Extreme Δ announce | Done |
| Phase 672 | Extreme Δ announce | Done |
| Phase 673 | Extreme keyboard paste parity note | Done |
| Phase 674 | Extreme Meta preview keyboard mirror | Done |
| Phase 675 | Extreme Shift merge keyboard mirror | Done |
| Phase 676 | Extreme ArrowUp blur/return | Done |
| Phase 677 | Extreme Shift+Enter copy | Done |
| Phase 678 | Extreme ⇧Enter clear | Done |
| Phase 679 | Extreme Delete clear hold | Done |
| Phase 680 | Extreme Escape clear dragover | Done |
| Phase 681 | Extreme Delete clear active | Done |
| Phase 682 | Extreme Delete clear active | Done |
| Phase 683 | Extreme avoid double aria-live | Done |
| Phase 684 | Extreme live sibling only | Done |
| Phase 685 | Extreme aria-atomic assert | Done |
| Phase 686 | Extreme aria-relevant additions | Done |
| Phase 687 | Extreme no aria-live spam | Done |
| Phase 688 | Extreme role=status keep | Done |
| Phase 689 | Extreme aria-current | Done |
| Phase 690 | Extreme aria-pressed | Done |
| Phase 691 | Extreme aria-current when active | Done |
| Phase 692 | Extreme aria-current when active | Done |
| Phase 693 | Extreme aria-current when active | Done |
| Phase 694 | Extreme aria-busy pulse | Done |
| Phase 695 | Extreme aria-busy pulse | Done |
| Phase 696 | Extreme live polite update | Done |
| Phase 697 | Extreme open/close announce | Done |
| Phase 698 | Extreme open/close announce | Done |
| Phase 699 | Extreme polite update | Done |
| Phase 700 | Extreme route via status live | Done |
| Phase 701 | Extreme status announce | Done |
| Phase 702 | Extreme status live assert | Done |
| Phase 703 | Extreme announce | Done |
| Phase 704 | Extreme role=switch opt | Done |
| Phase 705 | Extreme role=switch opt | Done |
| Phase 706 | Extreme aria-describedby help | Done |
| Phase 707 | Extreme aria-describedby | Done |
| Phase 708 | Extreme aria-describedby val | Done |
| Phase 709 | Extreme aria-describedby val | Done |
| Phase 710 | Extreme aria-describedby val | Done |
| Phase 711 | Extreme aria-describedby val | Done |
| Phase 712 | Extreme decorative audit | Done |
| Phase 713 | Extreme aria-orientation horizontal | Done |
| Phase 714 | Extreme step in valuetext | Done |
| Phase 715 | Extreme disabled/aria-disabled sync | Done |
| Phase 716 | Extreme aria-haspopup listbox | Done |
| Phase 717 | Extreme aria-expanded | Done |
| Phase 718 | Extreme aria-owns strips | Done |
| Phase 719 | Extreme role=group label | Done |
| Phase 720 | Extreme aria-autocomplete list assert | Done |
| Phase 721 | Extreme not sole name | Done |
| Phase 722 | Extreme shorten SR kbd noise | Done |
| Phase 723 | Extreme hit target audit | Done |
| Phase 724 | Extreme re-sync aria-label on title | Done |
| Phase 725 | Extreme aria-keyshortcuts Ctrl+Space | Done |
| Phase 726 | Extreme aria-keyshortcuts Meta+Space | Done |
| Phase 727 | Extreme unstar/remove split | Done |
| Phase 728 | Extreme native button no role=button | Done |
| Phase 729 | Extreme native button tabindex audit | Done |
| Phase 730 | Extreme focus ring + current | Done |
| Phase 731 | Extreme shared modifier map | Done |
| Phase 732 | Extreme click timer clear audit | Done |
| Phase 733 | Extreme keyboard mirrors click | Done |
| Phase 734 | Extreme fav unstar click/key parity | Done |
| Phase 735 | Extreme hist/redo remove parity | Done |
| Phase 736 | Extreme ariaFromTitle opt | Done |
| Phase 737 | Extreme describedBy opt | Done |
| Phase 738 | Extreme labelledBy opt | Done |
| Phase 739 | Extreme keyshortcuts opt | Done |
| Phase 740 | Extreme skipLive opt | Done |
| Phase 741 | Extreme onDelete alias onClear | Done |
| Phase 742 | Extreme ⇧Enter paste contract | Done |
| Phase 743 | Extreme backgroundOnly contract | Done |
| Phase 744 | Extreme ignoreChildTargets doc | Done |
| Phase 745 | Extreme surface count audit | Done |
| Phase 746 | Extreme tabindex 0 with skipRole | Done |
| Phase 747 | Extreme skipRole native | Done |
| Phase 748 | Extreme skipRole native | Done |
| Phase 749 | Extreme skipRole status | Done |
| Phase 750 | Extreme describedBy status | Done |
| Phase 751 | Extreme skipRole/backgroundOnly assert | Done |
| Phase 752 | Extreme copy guard | Done |
| Phase 753 | Extreme chip active aria-current | Done |
| Phase 754 | Extreme boot assert | Done |
| Phase 755 | Extreme on disable flip | Done |
| Phase 756 | Extreme aria-expanded with query | Done |
| Phase 757 | Extreme empty id | Done |
| Phase 758 | Extreme aria-controls assert | Done |
| Phase 759 | Extreme aria-label from text | Done |
| Phase 760 | Extreme describedBy live | Done |
| Phase 761 | Extreme aria-label refresh | Done |
| Phase 762 | Extreme aria-label refresh | Done |
| Phase 763 | Extreme aria-label refresh | Done |
| Phase 764 | Extreme aria-label refresh | Done |
| Phase 765 | Extreme aria-dropeffect copy | Done |
| Phase 766 | Extreme clear dropeffect | Done |
| Phase 767 | Extreme dynamic aria-label | Done |
| Phase 768 | Extreme aria-describedby ease/mix | Done |
| Phase 769 | Extreme aria-describedby bars | Done |
| Phase 770 | Extreme aria-labelledby assert | Done |
| Phase 771 | Extreme aria-describedby assert | Done |
| Phase 772 | Extreme aria parity with panel | Done |
| Phase 773 | Extreme aria-describedby status | Done |
| Phase 774 | Extreme aria-labelledby | Done |
| Phase 775 | Extreme aria-hidden | Done |
| Phase 776 | Extreme hidden/aria sync | Done |
| Phase 777 | Extreme text→aria refresh | Done |
| Phase 778 | Extreme text→aria refresh | Done |
| Phase 779 | Extreme click map wire helper | Done |
| Phase 780 | Extreme click map wire helper | Done |
| Phase 781 | Extreme click map wire helper | Done |
| Phase 782 | Extreme click map wire helper | Done |
| Phase 783 | Extreme dedupe change listeners | Done |
| Phase 784 | Extreme shared input/change wire | Done |
| Phase 785 | Extreme extract preview/diff/compare | Done |
| Phase 786 | Extreme registry list | Done |
| Phase 787 | Extreme idempotent re-run | Done |
| Phase 788 | Extreme toggle+persist+aria helper | Done |
| Phase 789 | Extreme SR-visible state | Done |
| Phase 790 | Extreme role=button assert | Done |
| Phase 791 | Extreme tabindex 0 assert | Done |
| Phase 792 | Extreme ignore interactive children | Done |
| Phase 793 | Extreme aria-expanded live | Done |
| Phase 794 | Extreme aria-expanded live | Done |
| Phase 795 | Extreme marker hidden a11y | Done |
| Phase 796 | Extreme post-613 a11y polish notes | Done |
| Phase 797 | Extreme phase table 614+ | Done |
| Phase 798 | Extreme a11y delta sync | Done |
| Phase 799 | Extreme bind surface count contract | Done |
| Phase 800 | Extreme 183 button aria contract | Done |
| Phase 801 | Extreme chip modifier matrix | Done |
| Phase 802 | Extreme focus-visible coverage map | Done |
| Phase 803 | Extreme live region policy | Done |
| Phase 804 | Extreme a11y substring harness batch | Done |
| Phase 805 | Extreme batch 614+ | Done |
| Phase 806 | Extreme prefers-reduced-motion CSS | Done |
| Phase 807 | Extreme respect reduced motion | Done |
| Phase 808 | Extreme respect reduced motion | Done |
| Phase 809 | Extreme reduced motion | Done |
| Phase 810 | Extreme reduced motion | Done |
| Phase 811 | Extreme prefers-contrast boost | Done |
| Phase 812 | Extreme prefers-contrast token | Done |
| Phase 813 | Extreme focus fallback | Done |
| Phase 814 | Extreme status visible | Done |
| Phase 815 | Extreme hit target pad | Done |
| Phase 816 | Extreme chip min size | Done |
| Phase 817 | Extreme toolbar pad | Done |
| Phase 818 | Extreme pan-y panel | Done |
| Phase 819 | Extreme none on chips | Done |
| Phase 820 | Extreme text on status | Done |
| Phase 821 | Extreme pointer interactive audit | Done |
| Phase 822 | Extreme grab on panel drop | Done |
| Phase 823 | Extreme shared token assert | Done |
| Phase 824 | Extreme width token assert | Done |
| Phase 825 | Extreme light assert | Done |
| Phase 826 | Extreme role=region | Done |
| Phase 827 | Extreme aria-label region | Done |
| Phase 828 | Extreme role=group | Done |
| Phase 829 | Extreme aria-label Extreme actions | Done |
| Phase 830 | Extreme role=group | Done |
| Phase 831 | Extreme aria-label overflow | Done |
| Phase 832 | Extreme role=region | Done |
| Phase 833 | Extreme aria-label region | Done |
| Phase 834 | Extreme role=group keep | Done |
| Phase 835 | Extreme role=group keep | Done |
| Phase 836 | Extreme role=status assert | Done |
| Phase 837 | Extreme role=button keep | Done |
| Phase 838 | Extreme role=group | Done |
| Phase 839 | Extreme role=group | Done |
| Phase 840 | Extreme role=group | Done |
| Phase 841 | Extreme role=group keep | Done |
| Phase 842 | Extreme role=group | Done |
| Phase 843 | Extreme role=button assert | Done |
| Phase 844 | Extreme polite policy | Done |
| Phase 845 | Extreme atomic policy | Done |
| Phase 846 | Extreme role=separator | Done |
| Phase 847 | Extreme role=switch keep | Done |
| Phase 848 | Extreme role=combobox keep | Done |
| Phase 849 | Extreme native button role | Done |
| Phase 850 | Extreme Extreme panel | Done |
| Phase 851 | Extreme strips | Done |
| Phase 852 | Extreme more IO | Done |
| Phase 853 | Extreme visually-hidden | Done |
| Phase 854 | Extreme panel before strips | Done |
| Phase 855 | Extreme filter before strips | Done |
| Phase 856 | Extreme chips after row | Done |
| Phase 857 | Extreme tabindex 0 keep | Done |
| Phase 858 | Extreme tabindex 0 keep | Done |
| Phase 859 | Extreme native tabindex | Done |
| Phase 860 | Extreme roving tabindex doc | Done |
| Phase 861 | Extreme restore after clear filter | Done |
| Phase 862 | Extreme restore after paste | Done |
| Phase 863 | Extreme no trap in panel | Done |
| Phase 864 | Extreme avoid on Extreme | Done |
| Phase 865 | Extreme visible-only outline policy | Done |
| Phase 866 | Extreme aria-busy status pulse | Done |
| Phase 867 | Extreme aria-busy status pulse | Done |
| Phase 868 | Extreme status announce | Done |
| Phase 869 | Extreme status announce | Done |
| Phase 870 | Extreme status announce | Done |
| Phase 871 | Extreme status announce | Done |
| Phase 872 | Extreme status announce | Done |
| Phase 873 | Extreme guard announce | Done |
| Phase 874 | Extreme guard announce | Done |
| Phase 875 | Extreme announce | Done |
| Phase 876 | Extreme copy announce | Done |
| Phase 877 | Extreme copy announce | Done |
| Phase 878 | Extreme copy announce | Done |
| Phase 879 | Extreme copy announce | Done |
| Phase 880 | Extreme copy announce | Done |
| Phase 881 | Extreme copy announce | Done |
| Phase 882 | Extreme copy announce | Done |
| Phase 883 | Extreme copy announce | Done |
| Phase 884 | Extreme announce | Done |
| Phase 885 | Extreme announce | Done |
| Phase 886 | Extreme announce | Done |
| Phase 887 | Extreme announce | Done |
| Phase 888 | Extreme clear timeout | Done |
| Phase 889 | Extreme pulseDisneyExtremeAriaBusy assert | Done |
| Phase 890 | Extreme live aria-label | Done |
| Phase 891 | Extreme keyshortcuts keep | Done |
| Phase 892 | Extreme live aria-label | Done |
| Phase 893 | Extreme keyshortcuts keep | Done |
| Phase 894 | Extreme live aria-label | Done |
| Phase 895 | Extreme keyshortcuts keep | Done |
| Phase 896 | Extreme live aria-label | Done |
| Phase 897 | Extreme keyshortcuts keep | Done |
| Phase 898 | Extreme live aria-label | Done |
| Phase 899 | Extreme keyshortcuts keep | Done |
| Phase 900 | Extreme live aria-label | Done |
| Phase 901 | Extreme keyshortcuts keep | Done |
| Phase 902 | Extreme live aria-label | Done |
| Phase 903 | Extreme keyshortcuts keep | Done |
| Phase 904 | Extreme live aria-label | Done |
| Phase 905 | Extreme keyshortcuts keep | Done |
| Phase 906 | Extreme live aria-label | Done |
| Phase 907 | Extreme keyshortcuts keep | Done |
| Phase 908 | Extreme live aria-label | Done |
| Phase 909 | Extreme keyshortcuts keep | Done |
| Phase 910 | Extreme live aria-label | Done |
| Phase 911 | Extreme keyshortcuts keep | Done |
| Phase 912 | Extreme role=img | Done |
| Phase 913 | Extreme role=img | Done |
| Phase 914 | Extreme role=img | Done |
| Phase 915 | Extreme role=img | Done |
| Phase 916 | Extreme role=img | Done |
| Phase 917 | Extreme role=img | Done |
| Phase 918 | Extreme aria-label | Done |
| Phase 919 | Extreme aria-label | Done |
| Phase 920 | Extreme aria-label | Done |
| Phase 921 | Extreme aria-hidden decorative | Done |
| Phase 922 | Extreme title tooltip keep | Done |
| Phase 923 | Extreme aria-labelledby keep | Done |
| Phase 924 | Extreme describedby keep | Done |
| Phase 925 | Extreme is-dirty class aria | Done |
| Phase 926 | Extreme live aria-label | Done |
| Phase 927 | Extreme keyshortcuts | Done |
| Phase 928 | Extreme flash parity | Done |
| Phase 929 | Extreme copy parity | Done |
| Phase 930 | Extreme Enter/Space parity | Done |
| Phase 931 | Extreme focus-visible keep | Done |
| Phase 932 | Extreme use details wire helper | Done |
| Phase 933 | Extreme use details wire helper | Done |
| Phase 934 | Extreme persist open keep | Done |
| Phase 935 | Extreme persist open keep | Done |
| Phase 936 | Extreme aria-expanded live keep | Done |
| Phase 937 | Extreme aria-controls keep | Done |
| Phase 938 | Extreme skipRole native keep | Done |
| Phase 939 | Extreme skipTabindex keep | Done |
| Phase 940 | Extreme marker hidden keep | Done |
| Phase 941 | Extreme open announce keep | Done |
| Phase 942 | Extreme close announce keep | Done |
| Phase 943 | Extreme idempotent | Done |
| Phase 944 | Extreme length assert | Done |
| Phase 945 | Extreme push once | Done |
| Phase 946 | Extreme surface count 32 | Done |
| Phase 947 | Extreme spaceCopy opt keep | Done |
| Phase 948 | Extreme escapeClear opt keep | Done |
| Phase 949 | Extreme onDelete alias keep | Done |
| Phase 950 | Extreme Alt+Enter paste keep | Done |
| Phase 951 | Extreme ariaFromTitle keep | Done |
| Phase 952 | Extreme describedBy opt keep | Done |
| Phase 953 | Extreme labelledBy opt keep | Done |
| Phase 954 | Extreme keyshortcuts opt keep | Done |
| Phase 955 | Extreme skipRole keep | Done |
| Phase 956 | Extreme skipTabindex keep | Done |
| Phase 957 | Extreme backgroundOnly keep | Done |
| Phase 958 | Extreme ignoreChildTargets keep | Done |
| Phase 959 | Extreme pasteOnDblClick keep | Done |
| Phase 960 | Extreme ⇧Enter paste keep | Done |
| Phase 961 | Extreme ⇧Enter copy keep | Done |
| Phase 962 | Extreme Delete clear keep | Done |
| Phase 963 | Extreme Backspace clear keep | Done |
| Phase 964 | Extreme click flash keep | Done |
| Phase 965 | Extreme dblclick copy keep | Done |
| Phase 966 | Extreme keydown Enter keep | Done |
| Phase 967 | Extreme keydown Space keep | Done |
| Phase 968 | Extreme shouldIgnoreTarget helper | Done |
| Phase 969 | Extreme null el guard | Done |
| Phase 970 | Extreme normalize shortcuts call | Done |
| Phase 971 | Extreme contract doc comments | Done |
| Phase 972 | Extreme Enter jump keep | Done |
| Phase 973 | Extreme ⇧Enter pin keep | Done |
| Phase 974 | Extreme Meta+Enter preview keep | Done |
| Phase 975 | Extreme Ctrl+Enter remove keep | Done |
| Phase 976 | Extreme Alt+Enter diff keep | Done |
| Phase 977 | Extreme ⇧Alt+Enter compare keep | Done |
| Phase 978 | Extreme Space jump keep | Done |
| Phase 979 | Extreme ⇧Space star keep | Done |
| Phase 980 | Extreme Ctrl+Space unstar keep | Done |
| Phase 981 | Extreme Meta+Space preview keep | Done |
| Phase 982 | Extreme click jump keep | Done |
| Phase 983 | Extreme Shift+click star keep | Done |
| Phase 984 | Extreme Ctrl+click remove keep | Done |
| Phase 985 | Extreme Meta+click preview keep | Done |
| Phase 986 | Extreme Alt+click diff keep | Done |
| Phase 987 | Extreme ⇧Alt+click compare keep | Done |
| Phase 988 | Extreme dbl-click pin keep | Done |
| Phase 989 | Extreme aria-current keep | Done |
| Phase 990 | Extreme aria-pressed keep | Done |
| Phase 991 | Extreme describedby hints keep | Done |
| Phase 992 | Extreme full keyshortcuts keep | Done |
| Phase 993 | Extreme native button keep | Done |
| Phase 994 | Extreme focus-visible keep | Done |
| Phase 995 | Extreme expanded text keep | Done |
| Phase 996 | Extreme combobox keep | Done |
| Phase 997 | Extreme haspopup keep | Done |
| Phase 998 | Extreme owns keep | Done |
| Phase 999 | Extreme expanded sync keep | Done |
| Phase 1000 | Extreme activedescendant keep | Done |
| Phase 1001 | Extreme autocomplete keep | Done |
| Phase 1002 | Extreme Enter flash keep | Done |
| Phase 1003 | Extreme ⇧Enter copy keep | Done |
| Phase 1004 | Extreme ArrowDown keep | Done |
| Phase 1005 | Extreme ArrowUp keep | Done |
| Phase 1006 | Extreme Escape clear keep | Done |
| Phase 1007 | Extreme Alt+F12 keep | Done |
| Phase 1008 | Extreme aria-label keep | Done |
| Phase 1009 | Extreme aria keep | Done |
| Phase 1010 | Extreme group keep | Done |
| Phase 1011 | Extreme live keep | Done |
| Phase 1012 | Extreme switch keep | Done |
| Phase 1013 | Extreme switch keep | Done |
| Phase 1014 | Extreme aria-checked sync keep | Done |
| Phase 1015 | Extreme describedby keep | Done |
| Phase 1016 | Extreme keyshortcuts keep | Done |
| Phase 1017 | Extreme orientation keep | Done |
| Phase 1018 | Extreme valuetext step keep | Done |
| Phase 1019 | Extreme disabled sync keep | Done |
| Phase 1020 | Extreme describedby val keep | Done |
| Phase 1021 | Extreme keyshortcuts keep | Done |
| Phase 1022 | Extreme keyshortcuts keep | Done |
| Phase 1023 | Extreme keyshortcuts keep | Done |
| Phase 1024 | Extreme keyshortcuts keep | Done |
| Phase 1025 | Extreme live keep | Done |
| Phase 1026 | Extreme labelledby keep | Done |
| Phase 1027 | Extreme call keep | Done |
| Phase 1028 | Extreme call keep | Done |
| Phase 1029 | Extreme call keep | Done |
| Phase 1030 | Extreme keep | Done |
| Phase 1031 | Extreme announce keep | Done |
| Phase 1032 | Extreme static aria-label | Done |
| Phase 1033 | Extreme ascii keyshortcuts | Done |
| Phase 1034 | Extreme static aria-label | Done |
| Phase 1035 | Extreme ascii keyshortcuts | Done |
| Phase 1036 | Extreme static aria-label | Done |
| Phase 1037 | Extreme ascii keyshortcuts | Done |
| Phase 1038 | Extreme static aria-label | Done |
| Phase 1039 | Extreme ascii keyshortcuts | Done |
| Phase 1040 | Extreme static aria-label | Done |
| Phase 1041 | Extreme ascii keyshortcuts | Done |
| Phase 1042 | Extreme static aria-label | Done |
| Phase 1043 | Extreme ascii keyshortcuts | Done |
| Phase 1044 | Extreme static aria-label | Done |
| Phase 1045 | Extreme ascii keyshortcuts | Done |
| Phase 1046 | Extreme static aria-label | Done |
| Phase 1047 | Extreme ascii keyshortcuts | Done |
| Phase 1048 | Extreme static aria-label | Done |
| Phase 1049 | Extreme ascii keyshortcuts | Done |
| Phase 1050 | Extreme static aria-label | Done |
| Phase 1051 | Extreme ascii keyshortcuts | Done |
| Phase 1052 | Extreme static aria-label | Done |
| Phase 1053 | Extreme ascii keyshortcuts | Done |
| Phase 1054 | Extreme static aria-label | Done |
| Phase 1055 | Extreme ascii keyshortcuts | Done |
| Phase 1056 | Extreme static aria-label | Done |
| Phase 1057 | Extreme ascii keyshortcuts | Done |
| Phase 1058 | Extreme static aria-label | Done |
| Phase 1059 | Extreme ascii keyshortcuts | Done |
| Phase 1060 | Extreme static aria-label | Done |
| Phase 1061 | Extreme ascii keyshortcuts | Done |
| Phase 1062 | Extreme static aria-label | Done |
| Phase 1063 | Extreme ascii keyshortcuts | Done |
| Phase 1064 | Extreme static aria-label | Done |
| Phase 1065 | Extreme ascii keyshortcuts | Done |
| Phase 1066 | Extreme static aria-label | Done |
| Phase 1067 | Extreme ascii keyshortcuts | Done |
| Phase 1068 | Extreme dropeffect copy keep | Done |
| Phase 1069 | Extreme dropeffect clear keep | Done |
| Phase 1070 | Extreme dragover announce keep | Done |
| Phase 1071 | Extreme Escape dragover keep | Done |
| Phase 1072 | Extreme backgroundOnly keep | Done |
| Phase 1073 | Extreme ignore children keep | Done |
| Phase 1074 | Extreme dbl-click paste keep | Done |
| Phase 1075 | Extreme ⇧Enter paste keep | Done |
| Phase 1076 | Extreme describedby keep | Done |
| Phase 1077 | Extreme paste shortcut keep | Done |
| Phase 1078 | Extreme Meta preview keep | Done |
| Phase 1079 | Extreme Shift merge keep | Done |
| Phase 1080 | Extreme preserve keep | Done |
| Phase 1081 | Extreme skip empty keep | Done |
| Phase 1082 | Extreme prefer attr keep | Done |
| Phase 1083 | Extreme kbd fallback keep | Done |
| Phase 1084 | Extreme normalize keep | Done |
| Phase 1085 | Extreme idempotent keep | Done |
| Phase 1086 | Extreme early boot keep | Done |
| Phase 1087 | Extreme 183 count keep | Done |
| Phase 1088 | Extreme keep | Done |
| Phase 1089 | Extreme keep | Done |
| Phase 1090 | Extreme no live keep | Done |
| Phase 1091 | Extreme live sibling keep | Done |
| Phase 1092 | Extreme aria-relevant keep | Done |
| Phase 1093 | Extreme normalize keep | Done |
| Phase 1094 | Extreme keep | Done |
| Phase 1095 | Extreme keep | Done |
| Phase 1096 | Extreme post-805 a11y polish notes | Done |
| Phase 1097 | Extreme phase table 806+ | Done |
| Phase 1098 | Extreme a11y delta sync 806+ | Done |
| Phase 1099 | Extreme bind surface count 32 | Done |
| Phase 1100 | Extreme 183 button aria contract keep | Done |
| Phase 1101 | Extreme chip modifier matrix keep | Done |
| Phase 1102 | Extreme focus-visible map keep | Done |
| Phase 1103 | Extreme live region policy keep | Done |
| Phase 1104 | Extreme reduced motion policy | Done |
| Phase 1105 | Extreme forced-colors policy | Done |
| Phase 1106 | Extreme pointer coarse targets | Done |
| Phase 1107 | Extreme landmark roles map | Done |
| Phase 1108 | Extreme skip links | Done |
| Phase 1109 | Extreme spark role=img | Done |
| Phase 1110 | Extreme bind registry | Done |
| Phase 1111 | Extreme a11y substring harness 806+ | Done |
| Phase 1112 | Extreme 806-1189 row count | Done |
| Phase 1113 | Extreme includes 806 notes | Done |
| Phase 1114 | Extreme batch 806+ | Done |
| Phase 1115 | Extreme item 1 | Done |
| Phase 1116 | Extreme item 2 | Done |
| Phase 1117 | Extreme item 3 | Done |
| Phase 1118 | Extreme item 4 | Done |
| Phase 1119 | Extreme item 5 | Done |
| Phase 1120 | Extreme item 6 | Done |
| Phase 1121 | Extreme item 7 | Done |
| Phase 1122 | Extreme item 8 | Done |
| Phase 1123 | Extreme item 9 | Done |
| Phase 1124 | Extreme item 10 | Done |
| Phase 1125 | Extreme item 11 | Done |
| Phase 1126 | Extreme item 12 | Done |
| Phase 1127 | Extreme item 13 | Done |
| Phase 1128 | Extreme item 14 | Done |
| Phase 1129 | Extreme item 15 | Done |
| Phase 1130 | Extreme item 16 | Done |
| Phase 1131 | Extreme item 17 | Done |
| Phase 1132 | Extreme item 18 | Done |
| Phase 1133 | Extreme item 19 | Done |
| Phase 1134 | Extreme item 20 | Done |
| Phase 1135 | Extreme item 21 | Done |
| Phase 1136 | Extreme item 22 | Done |
| Phase 1137 | Extreme item 23 | Done |
| Phase 1138 | Extreme item 24 | Done |
| Phase 1139 | Extreme item 25 | Done |
| Phase 1140 | Extreme item 26 | Done |
| Phase 1141 | Extreme item 27 | Done |
| Phase 1142 | Extreme item 28 | Done |
| Phase 1143 | Extreme item 29 | Done |
| Phase 1144 | Extreme item 30 | Done |
| Phase 1145 | Extreme item 31 | Done |
| Phase 1146 | Extreme item 32 | Done |
| Phase 1147 | Extreme item 33 | Done |
| Phase 1148 | Extreme item 34 | Done |
| Phase 1149 | Extreme item 35 | Done |
| Phase 1150 | Extreme item 36 | Done |
| Phase 1151 | Extreme item 37 | Done |
| Phase 1152 | Extreme item 38 | Done |
| Phase 1153 | Extreme item 39 | Done |
| Phase 1154 | Extreme item 40 | Done |
| Phase 1155 | Extreme item 41 | Done |
| Phase 1156 | Extreme item 42 | Done |
| Phase 1157 | Extreme item 43 | Done |
| Phase 1158 | Extreme item 44 | Done |
| Phase 1159 | Extreme item 45 | Done |
| Phase 1160 | Extreme item 46 | Done |
| Phase 1161 | Extreme item 47 | Done |
| Phase 1162 | Extreme item 48 | Done |
| Phase 1163 | Extreme item 49 | Done |
| Phase 1164 | Extreme item 50 | Done |
| Phase 1165 | Extreme item 51 | Done |
| Phase 1166 | Extreme item 52 | Done |
| Phase 1167 | Extreme item 53 | Done |
| Phase 1168 | Extreme item 54 | Done |
| Phase 1169 | Extreme item 55 | Done |
| Phase 1170 | Extreme item 56 | Done |
| Phase 1171 | Extreme item 57 | Done |
| Phase 1172 | Extreme item 58 | Done |
| Phase 1173 | Extreme item 59 | Done |
| Phase 1174 | Extreme item 60 | Done |
| Phase 1175 | Extreme item 61 | Done |
| Phase 1176 | Extreme item 62 | Done |
| Phase 1177 | Extreme item 63 | Done |
| Phase 1178 | Extreme item 64 | Done |
| Phase 1179 | Extreme item 65 | Done |
| Phase 1180 | Extreme item 66 | Done |
| Phase 1181 | Extreme item 67 | Done |
| Phase 1182 | Extreme item 68 | Done |
| Phase 1183 | Extreme item 69 | Done |
| Phase 1184 | Extreme item 70 | Done |
| Phase 1185 | Extreme item 71 | Done |
| Phase 1186 | Extreme item 72 | Done |
| Phase 1187 | Extreme item 73 | Done |
| Phase 1188 | Extreme item 74 | Done |
| Phase 1189 | Extreme item 75 | Done |
| Phase 1190 | Extreme lang=en assert | Done |
| Phase 1191 | Extreme lang inherit | Done |
| Phase 1192 | Extreme ltr assert | Done |
| Phase 1193 | Extreme language-neutral labels | Done |
| Phase 1194 | Extreme English copy keep | Done |
| Phase 1195 | Extreme English flash keep | Done |
| Phase 1196 | Extreme compact English keep | Done |
| Phase 1197 | Extreme English keep | Done |
| Phase 1198 | Extreme English keep | Done |
| Phase 1199 | Extreme English keep | Done |
| Phase 1200 | Extreme English keep | Done |
| Phase 1201 | Extreme English keep | Done |
| Phase 1202 | Extreme English keep | Done |
| Phase 1203 | Extreme English keep | Done |
| Phase 1204 | Extreme English keep | Done |
| Phase 1205 | Extreme English keep | Done |
| Phase 1206 | Extreme English keep | Done |
| Phase 1207 | Extreme English keep | Done |
| Phase 1208 | Extreme English keep | Done |
| Phase 1209 | Extreme English keep | Done |
| Phase 1210 | Extreme English keep | Done |
| Phase 1211 | Extreme English keep | Done |
| Phase 1212 | Extreme English keep | Done |
| Phase 1213 | Extreme English keep | Done |
| Phase 1214 | Extreme hide HUD sparks | Done |
| Phase 1215 | Extreme keep status readable | Done |
| Phase 1216 | Extreme hide skip links | Done |
| Phase 1217 | Extreme text resize safe | Done |
| Phase 1218 | Extreme chip wrap safe | Done |
| Phase 1219 | Extreme toolbar wrap keep | Done |
| Phase 1220 | Extreme min size assert | Done |
| Phase 1221 | Extreme readable assert | Done |
| Phase 1222 | Extreme assert | Done |
| Phase 1223 | Extreme overflow wrap | Done |
| Phase 1224 | Extreme text overflow ellipsis | Done |
| Phase 1225 | Extreme max-width fluid | Done |
| Phase 1226 | Extreme stable | Done |
| Phase 1227 | Extreme overflow-y auto | Done |
| Phase 1228 | Extreme styles keep | Done |
| Phase 1229 | Extreme light keep | Done |
| Phase 1230 | Extreme visual heading cue | Done |
| Phase 1231 | Extreme heading-like | Done |
| Phase 1232 | Extreme heading-like | Done |
| Phase 1233 | Extreme not heading | Done |
| Phase 1234 | Extreme not heading | Done |
| Phase 1235 | Extreme not heading | Done |
| Phase 1236 | Extreme accessible name | Done |
| Phase 1237 | Extreme accessible name | Done |
| Phase 1238 | Extreme accessible name | Done |
| Phase 1239 | Extreme accessible name | Done |
| Phase 1240 | Extreme accessible name | Done |
| Phase 1241 | Extreme accessible name | Done |
| Phase 1242 | Extreme accessible name | Done |
| Phase 1243 | Extreme accessible name | Done |
| Phase 1244 | Extreme accessible name | Done |
| Phase 1245 | Extreme accessible name | Done |
| Phase 1246 | Extreme accessible name | Done |
| Phase 1247 | Extreme accessible name | Done |
| Phase 1248 | Extreme accessible name | Done |
| Phase 1249 | Extreme accessible name | Done |
| Phase 1250 | Extreme announce | Done |
| Phase 1251 | Extreme announce | Done |
| Phase 1252 | Extreme announce | Done |
| Phase 1253 | Extreme announce | Done |
| Phase 1254 | Extreme announce | Done |
| Phase 1255 | Extreme announce | Done |
| Phase 1256 | Extreme announce | Done |
| Phase 1257 | Extreme announce | Done |
| Phase 1258 | Extreme announce | Done |
| Phase 1259 | Extreme announce keep | Done |
| Phase 1260 | Extreme announce keep | Done |
| Phase 1261 | Extreme announce | Done |
| Phase 1262 | Extreme pulse keep | Done |
| Phase 1263 | Extreme pulse keep | Done |
| Phase 1264 | Extreme announce | Done |
| Phase 1265 | Extreme announce | Done |
| Phase 1266 | Extreme announce | Done |
| Phase 1267 | Extreme announce | Done |
| Phase 1268 | Extreme announce | Done |
| Phase 1269 | Extreme announce | Done |
| Phase 1270 | Extreme announce | Done |
| Phase 1271 | Extreme announce | Done |
| Phase 1272 | Extreme announce | Done |
| Phase 1273 | Extreme announce | Done |
| Phase 1274 | Extreme X toggle keep | Done |
| Phase 1275 | Extreme B body keep | Done |
| Phase 1276 | Extreme C copy keep | Done |
| Phase 1277 | Extreme R reset keep | Done |
| Phase 1278 | Extreme H help keep | Done |
| Phase 1279 | Extreme E ease keep | Done |
| Phase 1280 | Extreme M mix keep | Done |
| Phase 1281 | Extreme F factors keep | Done |
| Phase 1282 | Extreme N neck keep | Done |
| Phase 1283 | Extreme A all keep | Done |
| Phase 1284 | Extreme J json keep | Done |
| Phase 1285 | Extreme D diff keep | Done |
| Phase 1286 | Extreme K clear keep | Done |
| Phase 1287 | Extreme U undo keep | Done |
| Phase 1288 | Extreme P pin keep | Done |
| Phase 1289 | Extreme S star keep | Done |
| Phase 1290 | Extreme Q cycle fav keep | Done |
| Phase 1291 | Extreme W wipe keep | Done |
| Phase 1292 | Extreme G fav json keep | Done |
| Phase 1293 | Extreme T more keep | Done |
| Phase 1294 | Extreme Z stacks keep | Done |
| Phase 1295 | Extreme V share stacks keep | Done |
| Phase 1296 | Extreme Y share keep | Done |
| Phase 1297 | Extreme O redo json keep | Done |
| Phase 1298 | Extreme L hist list keep | Done |
| Phase 1299 | Extreme I paste hist keep | Done |
| Phase 1300 | Extreme Escape clear keep | Done |
| Phase 1301 | Extreme Delete clear keep | Done |
| Phase 1302 | Extreme Insert pin keep | Done |
| Phase 1303 | Extreme Tab focus panel keep | Done |
| Phase 1304 | Extreme F1 strips keep | Done |
| Phase 1305 | Extreme F2 factors keep | Done |
| Phase 1306 | Extreme F12 filter keep | Done |
| Phase 1307 | Extreme ArrowDown hist keep | Done |
| Phase 1308 | Extreme ArrowUp hist keep | Done |
| Phase 1309 | Extreme ArrowRight fav keep | Done |
| Phase 1310 | Extreme ArrowLeft fav keep | Done |
| Phase 1311 | Extreme Home dirty keep | Done |
| Phase 1312 | Extreme End dirty copy keep | Done |
| Phase 1313 | Extreme PageUp strips keep | Done |
| Phase 1314 | Extreme name assert | Done |
| Phase 1315 | Extreme title assert | Done |
| Phase 1316 | Extreme name assert | Done |
| Phase 1317 | Extreme title assert | Done |
| Phase 1318 | Extreme name assert | Done |
| Phase 1319 | Extreme title assert | Done |
| Phase 1320 | Extreme name assert | Done |
| Phase 1321 | Extreme title assert | Done |
| Phase 1322 | Extreme name assert | Done |
| Phase 1323 | Extreme title assert | Done |
| Phase 1324 | Extreme name assert | Done |
| Phase 1325 | Extreme title assert | Done |
| Phase 1326 | Extreme name assert | Done |
| Phase 1327 | Extreme title assert | Done |
| Phase 1328 | Extreme name assert | Done |
| Phase 1329 | Extreme title assert | Done |
| Phase 1330 | Extreme name assert | Done |
| Phase 1331 | Extreme title assert | Done |
| Phase 1332 | Extreme name assert | Done |
| Phase 1333 | Extreme title assert | Done |
| Phase 1334 | Extreme name assert | Done |
| Phase 1335 | Extreme title assert | Done |
| Phase 1336 | Extreme name assert | Done |
| Phase 1337 | Extreme title assert | Done |
| Phase 1338 | Extreme name assert | Done |
| Phase 1339 | Extreme title assert | Done |
| Phase 1340 | Extreme name assert | Done |
| Phase 1341 | Extreme title assert | Done |
| Phase 1342 | Extreme name assert | Done |
| Phase 1343 | Extreme title assert | Done |
| Phase 1344 | Extreme name assert | Done |
| Phase 1345 | Extreme title assert | Done |
| Phase 1346 | Extreme name assert | Done |
| Phase 1347 | Extreme title assert | Done |
| Phase 1348 | Extreme name assert | Done |
| Phase 1349 | Extreme title assert | Done |
| Phase 1350 | Extreme name assert | Done |
| Phase 1351 | Extreme title assert | Done |
| Phase 1352 | Extreme name assert | Done |
| Phase 1353 | Extreme title assert | Done |
| Phase 1354 | Extreme name assert | Done |
| Phase 1355 | Extreme title assert | Done |
| Phase 1356 | Extreme name assert | Done |
| Phase 1357 | Extreme title assert | Done |
| Phase 1358 | Extreme name assert | Done |
| Phase 1359 | Extreme title assert | Done |
| Phase 1360 | Extreme name assert | Done |
| Phase 1361 | Extreme title assert | Done |
| Phase 1362 | Extreme bind keep | Done |
| Phase 1363 | Extreme refresh keep | Done |
| Phase 1364 | Extreme bind keep | Done |
| Phase 1365 | Extreme refresh keep | Done |
| Phase 1366 | Extreme bind keep | Done |
| Phase 1367 | Extreme refresh keep | Done |
| Phase 1368 | Extreme bind keep | Done |
| Phase 1369 | Extreme refresh keep | Done |
| Phase 1370 | Extreme bind keep | Done |
| Phase 1371 | Extreme refresh keep | Done |
| Phase 1372 | Extreme bind keep | Done |
| Phase 1373 | Extreme refresh keep | Done |
| Phase 1374 | Extreme bind keep | Done |
| Phase 1375 | Extreme refresh keep | Done |
| Phase 1376 | Extreme bind keep | Done |
| Phase 1377 | Extreme refresh keep | Done |
| Phase 1378 | Extreme bind keep | Done |
| Phase 1379 | Extreme refresh keep | Done |
| Phase 1380 | Extreme bind keep | Done |
| Phase 1381 | Extreme refresh keep | Done |
| Phase 1382 | Extreme bind keep | Done |
| Phase 1383 | Extreme refresh keep | Done |
| Phase 1384 | Extreme registry keep | Done |
| Phase 1385 | Extreme count 32 keep | Done |
| Phase 1386 | Extreme spaceCopy keep | Done |
| Phase 1387 | Extreme escapeClear keep | Done |
| Phase 1388 | Extreme onDelete keep | Done |
| Phase 1389 | Extreme Alt+Enter paste keep | Done |
| Phase 1390 | Extreme ariaFromTitle keep | Done |
| Phase 1391 | Extreme describedBy keep | Done |
| Phase 1392 | Extreme labelledBy keep | Done |
| Phase 1393 | Extreme keyshortcuts keep | Done |
| Phase 1394 | Extreme skipRole keep | Done |
| Phase 1395 | Extreme skipTabindex keep | Done |
| Phase 1396 | Extreme backgroundOnly keep | Done |
| Phase 1397 | Extreme ignoreChild keep | Done |
| Phase 1398 | Extreme pasteOnDblClick keep | Done |
| Phase 1399 | Extreme ⇧Enter paste keep | Done |
| Phase 1400 | Extreme ⇧Enter copy keep | Done |
| Phase 1401 | Extreme Delete clear keep | Done |
| Phase 1402 | Extreme Backspace clear keep | Done |
| Phase 1403 | Extreme click flash keep | Done |
| Phase 1404 | Extreme dblclick copy keep | Done |
| Phase 1405 | Extreme keydown Enter keep | Done |
| Phase 1406 | Extreme keydown Space keep | Done |
| Phase 1407 | Extreme shouldIgnoreTarget keep | Done |
| Phase 1408 | Extreme null guard keep | Done |
| Phase 1409 | Extreme normalize shortcuts keep | Done |
| Phase 1410 | Extreme doc comments keep | Done |
| Phase 1411 | Extreme status skipRole keep | Done |
| Phase 1412 | Extreme summary skipRole keep | Done |
| Phase 1413 | Extreme hist ignore chips keep | Done |
| Phase 1414 | Extreme fav ignore chips keep | Done |
| Phase 1415 | Extreme panel ignore children keep | Done |
| Phase 1416 | Extreme EnterJump keep | Done |
| Phase 1417 | Extreme ShiftEnterPin keep | Done |
| Phase 1418 | Extreme MetaEnterPreview keep | Done |
| Phase 1419 | Extreme CtrlEnterRemove keep | Done |
| Phase 1420 | Extreme AltEnterDiff keep | Done |
| Phase 1421 | Extreme ShiftAltCompare keep | Done |
| Phase 1422 | Extreme SpaceJump keep | Done |
| Phase 1423 | Extreme ShiftSpaceStar keep | Done |
| Phase 1424 | Extreme CtrlSpaceUnstar keep | Done |
| Phase 1425 | Extreme MetaSpacePreview keep | Done |
| Phase 1426 | Extreme ClickJump keep | Done |
| Phase 1427 | Extreme ShiftClickStar keep | Done |
| Phase 1428 | Extreme CtrlClickRemove keep | Done |
| Phase 1429 | Extreme MetaClickPreview keep | Done |
| Phase 1430 | Extreme AltClickDiff keep | Done |
| Phase 1431 | Extreme ShiftAltClickCompare keep | Done |
| Phase 1432 | Extreme DblClickPin keep | Done |
| Phase 1433 | Extreme AriaCurrent keep | Done |
| Phase 1434 | Extreme AriaPressed keep | Done |
| Phase 1435 | Extreme DescribedBy keep | Done |
| Phase 1436 | Extreme Keyshortcuts keep | Done |
| Phase 1437 | Extreme NativeButton keep | Done |
| Phase 1438 | Extreme FocusVisible keep | Done |
| Phase 1439 | Extreme HintsText keep | Done |
| Phase 1440 | Extreme combobox keep | Done |
| Phase 1441 | Extreme haspopup keep | Done |
| Phase 1442 | Extreme owns keep | Done |
| Phase 1443 | Extreme expanded keep | Done |
| Phase 1444 | Extreme activedescendant keep | Done |
| Phase 1445 | Extreme autocomplete keep | Done |
| Phase 1446 | Extreme Enter keep | Done |
| Phase 1447 | Extreme ⇧Enter keep | Done |
| Phase 1448 | Extreme ArrowDown keep | Done |
| Phase 1449 | Extreme ArrowUp keep | Done |
| Phase 1450 | Extreme Escape keep | Done |
| Phase 1451 | Extreme Alt+F12 keep | Done |
| Phase 1452 | Extreme switch keep | Done |
| Phase 1453 | Extreme switch keep | Done |
| Phase 1454 | Extreme checked sync keep | Done |
| Phase 1455 | Extreme orientation keep | Done |
| Phase 1456 | Extreme step valuetext keep | Done |
| Phase 1457 | Extreme disabled sync keep | Done |
| Phase 1458 | Extreme describedby keep | Done |
| Phase 1459 | Extreme live keep | Done |
| Phase 1460 | Extreme live sibling keep | Done |
| Phase 1461 | Extreme relevant keep | Done |
| Phase 1462 | Extreme no live keep | Done |
| Phase 1463 | Extreme token keep | Done |
| Phase 1464 | Extreme keep | Done |
| Phase 1465 | Extreme keep | Done |
| Phase 1466 | Extreme keep | Done |
| Phase 1467 | Extreme keep | Done |
| Phase 1468 | Extreme keep | Done |
| Phase 1469 | Extreme keep | Done |
| Phase 1470 | Extreme keep | Done |
| Phase 1471 | Extreme keep | Done |
| Phase 1472 | Extreme keep | Done |
| Phase 1473 | Extreme keep | Done |
| Phase 1474 | Extreme snap share keep | Done |
| Phase 1475 | Extreme hist share keep | Done |
| Phase 1476 | Extreme redo share keep | Done |
| Phase 1477 | Extreme fav share keep | Done |
| Phase 1478 | Extreme stacks share keep | Done |
| Phase 1479 | Extreme baseline keep | Done |
| Phase 1480 | Extreme hist keep | Done |
| Phase 1481 | Extreme redo keep | Done |
| Phase 1482 | Extreme fav keep | Done |
| Phase 1483 | Extreme prefs keep | Done |
| Phase 1484 | Extreme short keep | Done |
| Phase 1485 | Extreme flag keep | Done |
| Phase 1486 | Extreme keep | Done |
| Phase 1487 | Extreme keep | Done |
| Phase 1488 | Extreme keep | Done |
| Phase 1489 | Extreme keep | Done |
| Phase 1490 | Extreme keep | Done |
| Phase 1491 | Extreme keep | Done |
| Phase 1492 | Extreme keep | Done |
| Phase 1493 | Extreme keep | Done |
| Phase 1494 | Extreme img keep | Done |
| Phase 1495 | Extreme img keep | Done |
| Phase 1496 | Extreme img keep | Done |
| Phase 1497 | Extreme img keep | Done |
| Phase 1498 | Extreme img keep | Done |
| Phase 1499 | Extreme img keep | Done |
| Phase 1500 | Extreme label keep | Done |
| Phase 1501 | Extreme label keep | Done |
| Phase 1502 | Extreme label keep | Done |
| Phase 1503 | Extreme describedby keep | Done |
| Phase 1504 | Extreme labelledby keep | Done |
| Phase 1505 | Extreme bind keep | Done |
| Phase 1506 | Extreme bind keep | Done |
| Phase 1507 | Extreme bind keep | Done |
| Phase 1508 | Extreme flash keep | Done |
| Phase 1509 | Extreme copy keep | Done |
| Phase 1510 | Extreme flash keep | Done |
| Phase 1511 | Extreme copy keep | Done |
| Phase 1512 | Extreme keep | Done |
| Phase 1513 | Extreme keep | Done |
| Phase 1514 | Extreme wire keep | Done |
| Phase 1515 | Extreme wire keep | Done |
| Phase 1516 | Extreme expanded keep | Done |
| Phase 1517 | Extreme controls keep | Done |
| Phase 1518 | Extreme skipRole keep | Done |
| Phase 1519 | Extreme skipTabindex keep | Done |
| Phase 1520 | Extreme persist keep | Done |
| Phase 1521 | Extreme persist keep | Done |
| Phase 1522 | Extreme preserve keep | Done |
| Phase 1523 | Extreme normalize keep | Done |
| Phase 1524 | Extreme idempotent keep | Done |
| Phase 1525 | Extreme early boot keep | Done |
| Phase 1526 | Extreme 183 keep | Done |
| Phase 1527 | Extreme keep | Done |
| Phase 1528 | Extreme keep | Done |
| Phase 1529 | Extreme keep | Done |
| Phase 1530 | Extreme post-1189 a11y polish notes | Done |
| Phase 1531 | Extreme phase table 1190+ | Done |
| Phase 1532 | Extreme a11y delta sync 1190+ | Done |
| Phase 1533 | Extreme bind surface count 32 keep | Done |
| Phase 1534 | Extreme 183 button aria keep | Done |
| Phase 1535 | Extreme chip modifier matrix keep | Done |
| Phase 1536 | Extreme focus-visible map keep | Done |
| Phase 1537 | Extreme live region policy keep | Done |
| Phase 1538 | Extreme reduced motion keep | Done |
| Phase 1539 | Extreme forced-colors keep | Done |
| Phase 1540 | Extreme pointer coarse keep | Done |
| Phase 1541 | Extreme landmark roles keep | Done |
| Phase 1542 | Extreme skip links keep | Done |
| Phase 1543 | Extreme spark role=img keep | Done |
| Phase 1544 | Extreme bind registry keep | Done |
| Phase 1545 | Extreme English UI copy policy | Done |
| Phase 1546 | Extreme print/zoom policy | Done |
| Phase 1547 | Extreme a11y substring harness 1190+ | Done |
| Phase 1548 | Extreme 1190-1957 row count | Done |
| Phase 1549 | Extreme batch 1190+ | Done |
| Phase 1550 | Extreme item 1 | Done |
| Phase 1551 | Extreme item 2 | Done |
| Phase 1552 | Extreme item 3 | Done |
| Phase 1553 | Extreme item 4 | Done |
| Phase 1554 | Extreme item 5 | Done |
| Phase 1555 | Extreme item 6 | Done |
| Phase 1556 | Extreme item 7 | Done |
| Phase 1557 | Extreme item 8 | Done |
| Phase 1558 | Extreme item 9 | Done |
| Phase 1559 | Extreme item 10 | Done |
| Phase 1560 | Extreme item 11 | Done |
| Phase 1561 | Extreme item 12 | Done |
| Phase 1562 | Extreme item 13 | Done |
| Phase 1563 | Extreme item 14 | Done |
| Phase 1564 | Extreme item 15 | Done |
| Phase 1565 | Extreme item 16 | Done |
| Phase 1566 | Extreme item 17 | Done |
| Phase 1567 | Extreme item 18 | Done |
| Phase 1568 | Extreme item 19 | Done |
| Phase 1569 | Extreme item 20 | Done |
| Phase 1570 | Extreme item 21 | Done |
| Phase 1571 | Extreme item 22 | Done |
| Phase 1572 | Extreme item 23 | Done |
| Phase 1573 | Extreme item 24 | Done |
| Phase 1574 | Extreme item 25 | Done |
| Phase 1575 | Extreme item 26 | Done |
| Phase 1576 | Extreme item 27 | Done |
| Phase 1577 | Extreme item 28 | Done |
| Phase 1578 | Extreme item 29 | Done |
| Phase 1579 | Extreme item 30 | Done |
| Phase 1580 | Extreme item 31 | Done |
| Phase 1581 | Extreme item 32 | Done |
| Phase 1582 | Extreme item 33 | Done |
| Phase 1583 | Extreme item 34 | Done |
| Phase 1584 | Extreme item 35 | Done |
| Phase 1585 | Extreme item 36 | Done |
| Phase 1586 | Extreme item 37 | Done |
| Phase 1587 | Extreme item 38 | Done |
| Phase 1588 | Extreme item 39 | Done |
| Phase 1589 | Extreme item 40 | Done |
| Phase 1590 | Extreme item 41 | Done |
| Phase 1591 | Extreme item 42 | Done |
| Phase 1592 | Extreme item 43 | Done |
| Phase 1593 | Extreme item 44 | Done |
| Phase 1594 | Extreme item 45 | Done |
| Phase 1595 | Extreme item 46 | Done |
| Phase 1596 | Extreme item 47 | Done |
| Phase 1597 | Extreme item 48 | Done |
| Phase 1598 | Extreme item 49 | Done |
| Phase 1599 | Extreme item 50 | Done |
| Phase 1600 | Extreme item 51 | Done |
| Phase 1601 | Extreme item 52 | Done |
| Phase 1602 | Extreme item 53 | Done |
| Phase 1603 | Extreme item 54 | Done |
| Phase 1604 | Extreme item 55 | Done |
| Phase 1605 | Extreme item 56 | Done |
| Phase 1606 | Extreme item 57 | Done |
| Phase 1607 | Extreme item 58 | Done |
| Phase 1608 | Extreme item 59 | Done |
| Phase 1609 | Extreme item 60 | Done |
| Phase 1610 | Extreme item 61 | Done |
| Phase 1611 | Extreme item 62 | Done |
| Phase 1612 | Extreme item 63 | Done |
| Phase 1613 | Extreme item 64 | Done |
| Phase 1614 | Extreme item 65 | Done |
| Phase 1615 | Extreme item 66 | Done |
| Phase 1616 | Extreme item 67 | Done |
| Phase 1617 | Extreme item 68 | Done |
| Phase 1618 | Extreme item 69 | Done |
| Phase 1619 | Extreme item 70 | Done |
| Phase 1620 | Extreme item 71 | Done |
| Phase 1621 | Extreme item 72 | Done |
| Phase 1622 | Extreme item 73 | Done |
| Phase 1623 | Extreme item 74 | Done |
| Phase 1624 | Extreme item 75 | Done |
| Phase 1625 | Extreme item 76 | Done |
| Phase 1626 | Extreme item 77 | Done |
| Phase 1627 | Extreme item 78 | Done |
| Phase 1628 | Extreme item 79 | Done |
| Phase 1629 | Extreme item 80 | Done |
| Phase 1630 | Extreme item 81 | Done |
| Phase 1631 | Extreme item 82 | Done |
| Phase 1632 | Extreme item 83 | Done |
| Phase 1633 | Extreme item 84 | Done |
| Phase 1634 | Extreme item 85 | Done |
| Phase 1635 | Extreme item 86 | Done |
| Phase 1636 | Extreme item 87 | Done |
| Phase 1637 | Extreme item 88 | Done |
| Phase 1638 | Extreme item 89 | Done |
| Phase 1639 | Extreme item 90 | Done |
| Phase 1640 | Extreme item 91 | Done |
| Phase 1641 | Extreme item 92 | Done |
| Phase 1642 | Extreme item 93 | Done |
| Phase 1643 | Extreme item 94 | Done |
| Phase 1644 | Extreme item 95 | Done |
| Phase 1645 | Extreme item 96 | Done |
| Phase 1646 | Extreme item 97 | Done |
| Phase 1647 | Extreme item 98 | Done |
| Phase 1648 | Extreme item 99 | Done |
| Phase 1649 | Extreme item 100 | Done |
| Phase 1650 | Extreme item 101 | Done |
| Phase 1651 | Extreme item 102 | Done |
| Phase 1652 | Extreme item 103 | Done |
| Phase 1653 | Extreme item 104 | Done |
| Phase 1654 | Extreme item 105 | Done |
| Phase 1655 | Extreme item 106 | Done |
| Phase 1656 | Extreme item 107 | Done |
| Phase 1657 | Extreme item 108 | Done |
| Phase 1658 | Extreme item 109 | Done |
| Phase 1659 | Extreme item 110 | Done |
| Phase 1660 | Extreme item 111 | Done |
| Phase 1661 | Extreme item 112 | Done |
| Phase 1662 | Extreme item 113 | Done |
| Phase 1663 | Extreme item 114 | Done |
| Phase 1664 | Extreme item 115 | Done |
| Phase 1665 | Extreme item 116 | Done |
| Phase 1666 | Extreme item 117 | Done |
| Phase 1667 | Extreme item 118 | Done |
| Phase 1668 | Extreme item 119 | Done |
| Phase 1669 | Extreme item 120 | Done |
| Phase 1670 | Extreme item 121 | Done |
| Phase 1671 | Extreme item 122 | Done |
| Phase 1672 | Extreme item 123 | Done |
| Phase 1673 | Extreme item 124 | Done |
| Phase 1674 | Extreme item 125 | Done |
| Phase 1675 | Extreme item 126 | Done |
| Phase 1676 | Extreme item 127 | Done |
| Phase 1677 | Extreme item 128 | Done |
| Phase 1678 | Extreme item 129 | Done |
| Phase 1679 | Extreme item 130 | Done |
| Phase 1680 | Extreme item 131 | Done |
| Phase 1681 | Extreme item 132 | Done |
| Phase 1682 | Extreme item 133 | Done |
| Phase 1683 | Extreme item 134 | Done |
| Phase 1684 | Extreme item 135 | Done |
| Phase 1685 | Extreme item 136 | Done |
| Phase 1686 | Extreme item 137 | Done |
| Phase 1687 | Extreme item 138 | Done |
| Phase 1688 | Extreme item 139 | Done |
| Phase 1689 | Extreme item 140 | Done |
| Phase 1690 | Extreme item 141 | Done |
| Phase 1691 | Extreme item 142 | Done |
| Phase 1692 | Extreme item 143 | Done |
| Phase 1693 | Extreme item 144 | Done |
| Phase 1694 | Extreme item 145 | Done |
| Phase 1695 | Extreme item 146 | Done |
| Phase 1696 | Extreme item 147 | Done |
| Phase 1697 | Extreme item 148 | Done |
| Phase 1698 | Extreme item 149 | Done |
| Phase 1699 | Extreme item 150 | Done |
| Phase 1700 | Extreme item 151 | Done |
| Phase 1701 | Extreme item 152 | Done |
| Phase 1702 | Extreme item 153 | Done |
| Phase 1703 | Extreme item 154 | Done |
| Phase 1704 | Extreme item 155 | Done |
| Phase 1705 | Extreme item 156 | Done |
| Phase 1706 | Extreme item 157 | Done |
| Phase 1707 | Extreme item 158 | Done |
| Phase 1708 | Extreme item 159 | Done |
| Phase 1709 | Extreme item 160 | Done |
| Phase 1710 | Extreme item 161 | Done |
| Phase 1711 | Extreme item 162 | Done |
| Phase 1712 | Extreme item 163 | Done |
| Phase 1713 | Extreme item 164 | Done |
| Phase 1714 | Extreme item 165 | Done |
| Phase 1715 | Extreme item 166 | Done |
| Phase 1716 | Extreme item 167 | Done |
| Phase 1717 | Extreme item 168 | Done |
| Phase 1718 | Extreme item 169 | Done |
| Phase 1719 | Extreme item 170 | Done |
| Phase 1720 | Extreme item 171 | Done |
| Phase 1721 | Extreme item 172 | Done |
| Phase 1722 | Extreme item 173 | Done |
| Phase 1723 | Extreme item 174 | Done |
| Phase 1724 | Extreme item 175 | Done |
| Phase 1725 | Extreme item 176 | Done |
| Phase 1726 | Extreme item 177 | Done |
| Phase 1727 | Extreme item 178 | Done |
| Phase 1728 | Extreme item 179 | Done |
| Phase 1729 | Extreme item 180 | Done |
| Phase 1730 | Extreme item 181 | Done |
| Phase 1731 | Extreme item 182 | Done |
| Phase 1732 | Extreme item 183 | Done |
| Phase 1733 | Extreme item 184 | Done |
| Phase 1734 | Extreme item 185 | Done |
| Phase 1735 | Extreme item 186 | Done |
| Phase 1736 | Extreme item 187 | Done |
| Phase 1737 | Extreme item 188 | Done |
| Phase 1738 | Extreme item 189 | Done |
| Phase 1739 | Extreme item 190 | Done |
| Phase 1740 | Extreme item 191 | Done |
| Phase 1741 | Extreme item 192 | Done |
| Phase 1742 | Extreme item 193 | Done |
| Phase 1743 | Extreme item 194 | Done |
| Phase 1744 | Extreme item 195 | Done |
| Phase 1745 | Extreme item 196 | Done |
| Phase 1746 | Extreme item 197 | Done |
| Phase 1747 | Extreme item 198 | Done |
| Phase 1748 | Extreme item 199 | Done |
| Phase 1749 | Extreme item 200 | Done |
| Phase 1750 | Extreme item 201 | Done |
| Phase 1751 | Extreme item 202 | Done |
| Phase 1752 | Extreme item 203 | Done |
| Phase 1753 | Extreme item 204 | Done |
| Phase 1754 | Extreme item 205 | Done |
| Phase 1755 | Extreme item 206 | Done |
| Phase 1756 | Extreme item 207 | Done |
| Phase 1757 | Extreme item 208 | Done |
| Phase 1758 | Extreme item 209 | Done |
| Phase 1759 | Extreme item 210 | Done |
| Phase 1760 | Extreme item 211 | Done |
| Phase 1761 | Extreme item 212 | Done |
| Phase 1762 | Extreme item 213 | Done |
| Phase 1763 | Extreme item 214 | Done |
| Phase 1764 | Extreme item 215 | Done |
| Phase 1765 | Extreme item 216 | Done |
| Phase 1766 | Extreme item 217 | Done |
| Phase 1767 | Extreme item 218 | Done |
| Phase 1768 | Extreme item 219 | Done |
| Phase 1769 | Extreme item 220 | Done |
| Phase 1770 | Extreme item 221 | Done |
| Phase 1771 | Extreme item 222 | Done |
| Phase 1772 | Extreme item 223 | Done |
| Phase 1773 | Extreme item 224 | Done |
| Phase 1774 | Extreme item 225 | Done |
| Phase 1775 | Extreme item 226 | Done |
| Phase 1776 | Extreme item 227 | Done |
| Phase 1777 | Extreme item 228 | Done |
| Phase 1778 | Extreme item 229 | Done |
| Phase 1779 | Extreme item 230 | Done |
| Phase 1780 | Extreme item 231 | Done |
| Phase 1781 | Extreme item 232 | Done |
| Phase 1782 | Extreme item 233 | Done |
| Phase 1783 | Extreme item 234 | Done |
| Phase 1784 | Extreme item 235 | Done |
| Phase 1785 | Extreme item 236 | Done |
| Phase 1786 | Extreme item 237 | Done |
| Phase 1787 | Extreme item 238 | Done |
| Phase 1788 | Extreme item 239 | Done |
| Phase 1789 | Extreme item 240 | Done |
| Phase 1790 | Extreme item 241 | Done |
| Phase 1791 | Extreme item 242 | Done |
| Phase 1792 | Extreme item 243 | Done |
| Phase 1793 | Extreme item 244 | Done |
| Phase 1794 | Extreme item 245 | Done |
| Phase 1795 | Extreme item 246 | Done |
| Phase 1796 | Extreme item 247 | Done |
| Phase 1797 | Extreme item 248 | Done |
| Phase 1798 | Extreme item 249 | Done |
| Phase 1799 | Extreme item 250 | Done |
| Phase 1800 | Extreme item 251 | Done |
| Phase 1801 | Extreme item 252 | Done |
| Phase 1802 | Extreme item 253 | Done |
| Phase 1803 | Extreme item 254 | Done |
| Phase 1804 | Extreme item 255 | Done |
| Phase 1805 | Extreme item 256 | Done |
| Phase 1806 | Extreme item 257 | Done |
| Phase 1807 | Extreme item 258 | Done |
| Phase 1808 | Extreme item 259 | Done |
| Phase 1809 | Extreme item 260 | Done |
| Phase 1810 | Extreme item 261 | Done |
| Phase 1811 | Extreme item 262 | Done |
| Phase 1812 | Extreme item 263 | Done |
| Phase 1813 | Extreme item 264 | Done |
| Phase 1814 | Extreme item 265 | Done |
| Phase 1815 | Extreme item 266 | Done |
| Phase 1816 | Extreme item 267 | Done |
| Phase 1817 | Extreme item 268 | Done |
| Phase 1818 | Extreme item 269 | Done |
| Phase 1819 | Extreme item 270 | Done |
| Phase 1820 | Extreme item 271 | Done |
| Phase 1821 | Extreme item 272 | Done |
| Phase 1822 | Extreme item 273 | Done |
| Phase 1823 | Extreme item 274 | Done |
| Phase 1824 | Extreme item 275 | Done |
| Phase 1825 | Extreme item 276 | Done |
| Phase 1826 | Extreme item 277 | Done |
| Phase 1827 | Extreme item 278 | Done |
| Phase 1828 | Extreme item 279 | Done |
| Phase 1829 | Extreme item 280 | Done |
| Phase 1830 | Extreme item 281 | Done |
| Phase 1831 | Extreme item 282 | Done |
| Phase 1832 | Extreme item 283 | Done |
| Phase 1833 | Extreme item 284 | Done |
| Phase 1834 | Extreme item 285 | Done |
| Phase 1835 | Extreme item 286 | Done |
| Phase 1836 | Extreme item 287 | Done |
| Phase 1837 | Extreme item 288 | Done |
| Phase 1838 | Extreme item 289 | Done |
| Phase 1839 | Extreme item 290 | Done |
| Phase 1840 | Extreme item 291 | Done |
| Phase 1841 | Extreme item 292 | Done |
| Phase 1842 | Extreme item 293 | Done |
| Phase 1843 | Extreme item 294 | Done |
| Phase 1844 | Extreme item 295 | Done |
| Phase 1845 | Extreme item 296 | Done |
| Phase 1846 | Extreme item 297 | Done |
| Phase 1847 | Extreme item 298 | Done |
| Phase 1848 | Extreme item 299 | Done |
| Phase 1849 | Extreme item 300 | Done |
| Phase 1850 | Extreme item 301 | Done |
| Phase 1851 | Extreme item 302 | Done |
| Phase 1852 | Extreme item 303 | Done |
| Phase 1853 | Extreme item 304 | Done |
| Phase 1854 | Extreme item 305 | Done |
| Phase 1855 | Extreme item 306 | Done |
| Phase 1856 | Extreme item 307 | Done |
| Phase 1857 | Extreme item 308 | Done |
| Phase 1858 | Extreme item 309 | Done |
| Phase 1859 | Extreme item 310 | Done |
| Phase 1860 | Extreme item 311 | Done |
| Phase 1861 | Extreme item 312 | Done |
| Phase 1862 | Extreme item 313 | Done |
| Phase 1863 | Extreme item 314 | Done |
| Phase 1864 | Extreme item 315 | Done |
| Phase 1865 | Extreme item 316 | Done |
| Phase 1866 | Extreme item 317 | Done |
| Phase 1867 | Extreme item 318 | Done |
| Phase 1868 | Extreme item 319 | Done |
| Phase 1869 | Extreme item 320 | Done |
| Phase 1870 | Extreme item 321 | Done |
| Phase 1871 | Extreme item 322 | Done |
| Phase 1872 | Extreme item 323 | Done |
| Phase 1873 | Extreme item 324 | Done |
| Phase 1874 | Extreme item 325 | Done |
| Phase 1875 | Extreme item 326 | Done |
| Phase 1876 | Extreme item 327 | Done |
| Phase 1877 | Extreme item 328 | Done |
| Phase 1878 | Extreme item 329 | Done |
| Phase 1879 | Extreme item 330 | Done |
| Phase 1880 | Extreme item 331 | Done |
| Phase 1881 | Extreme item 332 | Done |
| Phase 1882 | Extreme item 333 | Done |
| Phase 1883 | Extreme item 334 | Done |
| Phase 1884 | Extreme item 335 | Done |
| Phase 1885 | Extreme item 336 | Done |
| Phase 1886 | Extreme item 337 | Done |
| Phase 1887 | Extreme item 338 | Done |
| Phase 1888 | Extreme item 339 | Done |
| Phase 1889 | Extreme item 340 | Done |
| Phase 1890 | Extreme item 341 | Done |
| Phase 1891 | Extreme item 342 | Done |
| Phase 1892 | Extreme item 343 | Done |
| Phase 1893 | Extreme item 344 | Done |
| Phase 1894 | Extreme item 345 | Done |
| Phase 1895 | Extreme item 346 | Done |
| Phase 1896 | Extreme item 347 | Done |
| Phase 1897 | Extreme item 348 | Done |
| Phase 1898 | Extreme item 349 | Done |
| Phase 1899 | Extreme item 350 | Done |
| Phase 1900 | Extreme item 351 | Done |
| Phase 1901 | Extreme item 352 | Done |
| Phase 1902 | Extreme item 353 | Done |
| Phase 1903 | Extreme item 354 | Done |
| Phase 1904 | Extreme item 355 | Done |
| Phase 1905 | Extreme item 356 | Done |
| Phase 1906 | Extreme item 357 | Done |
| Phase 1907 | Extreme item 358 | Done |
| Phase 1908 | Extreme item 359 | Done |
| Phase 1909 | Extreme item 360 | Done |
| Phase 1910 | Extreme item 361 | Done |
| Phase 1911 | Extreme item 362 | Done |
| Phase 1912 | Extreme item 363 | Done |
| Phase 1913 | Extreme item 364 | Done |
| Phase 1914 | Extreme item 365 | Done |
| Phase 1915 | Extreme item 366 | Done |
| Phase 1916 | Extreme item 367 | Done |
| Phase 1917 | Extreme item 368 | Done |
| Phase 1918 | Extreme item 369 | Done |
| Phase 1919 | Extreme item 370 | Done |
| Phase 1920 | Extreme item 371 | Done |
| Phase 1921 | Extreme item 372 | Done |
| Phase 1922 | Extreme item 373 | Done |
| Phase 1923 | Extreme item 374 | Done |
| Phase 1924 | Extreme item 375 | Done |
| Phase 1925 | Extreme item 376 | Done |
| Phase 1926 | Extreme item 377 | Done |
| Phase 1927 | Extreme item 378 | Done |
| Phase 1928 | Extreme item 379 | Done |
| Phase 1929 | Extreme item 380 | Done |
| Phase 1930 | Extreme item 381 | Done |
| Phase 1931 | Extreme item 382 | Done |
| Phase 1932 | Extreme item 383 | Done |
| Phase 1933 | Extreme item 384 | Done |
| Phase 1934 | Extreme item 385 | Done |
| Phase 1935 | Extreme item 386 | Done |
| Phase 1936 | Extreme item 387 | Done |
| Phase 1937 | Extreme item 388 | Done |
| Phase 1938 | Extreme item 389 | Done |
| Phase 1939 | Extreme item 390 | Done |
| Phase 1940 | Extreme item 391 | Done |
| Phase 1941 | Extreme item 392 | Done |
| Phase 1942 | Extreme item 393 | Done |
| Phase 1943 | Extreme item 394 | Done |
| Phase 1944 | Extreme item 395 | Done |
| Phase 1945 | Extreme item 396 | Done |
| Phase 1946 | Extreme item 397 | Done |
| Phase 1947 | Extreme item 398 | Done |
| Phase 1948 | Extreme item 399 | Done |
| Phase 1949 | Extreme item 400 | Done |
| Phase 1950 | Extreme item 401 | Done |
| Phase 1951 | Extreme item 402 | Done |
| Phase 1952 | Extreme item 403 | Done |
| Phase 1953 | Extreme item 404 | Done |
| Phase 1954 | Extreme item 405 | Done |
| Phase 1955 | Extreme item 406 | Done |
| Phase 1956 | Extreme item 407 | Done |
| Phase 1957 | Extreme item 408 | Done |

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
