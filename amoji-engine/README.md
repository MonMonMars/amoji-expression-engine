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
| Phase 1958 | Extreme meta keep | Done |
| Phase 1959 | Extreme panel inset | Done |
| Phase 1960 | Extreme toolbar inset | Done |
| Phase 1961 | Extreme panel query ready | Done |
| Phase 1962 | Extreme min-height assert | Done |
| Phase 1963 | Extreme max-height fluid | Done |
| Phase 1964 | Extreme aspect-ratio keep | Done |
| Phase 1965 | Extreme object-fit keep | Done |
| Phase 1966 | Extreme contain layout | Done |
| Phase 1967 | Extreme isolation isolate | Done |
| Phase 1968 | Extreme avoid on panel | Done |
| Phase 1969 | Extreme avoid gpu on chips | Done |
| Phase 1970 | Extreme keep | Done |
| Phase 1971 | Extreme contain | Done |
| Phase 1972 | Extreme avoid on hist | Done |
| Phase 1973 | Extreme skip link | Done |
| Phase 1974 | Extreme avoid experimental | Done |
| Phase 1975 | Extreme auto strips | Done |
| Phase 1976 | Extreme strips | Done |
| Phase 1977 | Extreme none on panel | Done |
| Phase 1978 | Extreme border-box assert | Done |
| Phase 1979 | Extreme min-width 0 children | Done |
| Phase 1980 | Extreme toolbar token assert | Done |
| Phase 1981 | Extreme panel token assert | Done |
| Phase 1982 | Extreme strips token assert | Done |
| Phase 1983 | Extreme token assert | Done |
| Phase 1984 | Extreme token assert | Done |
| Phase 1985 | Extreme disabled sync keep | Done |
| Phase 1986 | Extreme hidden live offscreen | Done |
| Phase 1987 | Extreme avoid on interactive | Done |
| Phase 1988 | Extreme avoid on buttons | Done |
| Phase 1989 | Extreme avoid | Done |
| Phase 1990 | Extreme prefers-contrast more | Done |
| Phase 1991 | Extreme prefers-contrast less | Done |
| Phase 1992 | Extreme buttons visible | Done |
| Phase 1993 | Extreme skip links visible | Done |
| Phase 1994 | Extreme chips visible | Done |
| Phase 1995 | Extreme slider thumb | Done |
| Phase 1996 | Extreme switch track | Done |
| Phase 1997 | Extreme dark avoid | Done |
| Phase 1998 | Extreme token assert | Done |
| Phase 1999 | Extreme filter input | Done |
| Phase 2000 | Extreme solid assert | Done |
| Phase 2001 | Extreme token assert | Done |
| Phase 2002 | Extreme ink | Done |
| Phase 2003 | Extreme color inherit skip | Done |
| Phase 2004 | Extreme no distinct color | Done |
| Phase 2005 | Extreme contrast assert | Done |
| Phase 2006 | Extreme contrast assert | Done |
| Phase 2007 | Extreme contrast assert | Done |
| Phase 2008 | Extreme contrast assert | Done |
| Phase 2009 | Extreme contrast assert | Done |
| Phase 2010 | Extreme contrast assert | Done |
| Phase 2011 | Extreme contrast keep | Done |
| Phase 2012 | Extreme contrast keep | Done |
| Phase 2013 | Extreme avoid on status | Done |
| Phase 2014 | Extreme color keep | Done |
| Phase 2015 | Extreme avoid | Done |
| Phase 2016 | Extreme currentColor keep | Done |
| Phase 2017 | Extreme fill/stroke keep | Done |
| Phase 2018 | Extreme system stack keep | Done |
| Phase 2019 | Extreme root rem base | Done |
| Phase 2020 | Extreme status readable | Done |
| Phase 2021 | Extreme chip readable | Done |
| Phase 2022 | Extreme toolbar readable | Done |
| Phase 2023 | Extreme label readable | Done |
| Phase 2024 | Extreme normal body | Done |
| Phase 2025 | Extreme bold labels | Done |
| Phase 2026 | Extreme tabular | Done |
| Phase 2027 | Extreme default | Done |
| Phase 2028 | Extreme status 1.4+ | Done |
| Phase 2029 | Extreme chip 1.3+ | Done |
| Phase 2030 | Extreme normal | Done |
| Phase 2031 | Extreme normal | Done |
| Phase 2032 | Extreme none on chips | Done |
| Phase 2033 | Extreme none keep | Done |
| Phase 2034 | Extreme status wrap | Done |
| Phase 2035 | Extreme chip nowrap ellipsis | Done |
| Phase 2036 | Extreme start keep | Done |
| Phase 2037 | Extreme zero | Done |
| Phase 2038 | Extreme default | Done |
| Phase 2039 | Extreme horizontal-tb | Done |
| Phase 2040 | Extreme ltr assert | Done |
| Phase 2041 | Extreme normal | Done |
| Phase 2042 | Extreme none | Done |
| Phase 2043 | Extreme auto | Done |
| Phase 2044 | Extreme normal | Done |
| Phase 2045 | Extreme optimizeLegibility | Done |
| Phase 2046 | Extreme antialiased | Done |
| Phase 2047 | Extreme break-word status | Done |
| Phase 2048 | Extreme normal chips | Done |
| Phase 2049 | Extreme avoid on status | Done |
| Phase 2050 | Extreme auto interactive | Done |
| Phase 2051 | Extreme none decor | Done |
| Phase 2052 | Extreme manipulation buttons | Done |
| Phase 2053 | Extreme pan-y panel | Done |
| Phase 2054 | Extreme none toolbar labels | Done |
| Phase 2055 | Extreme text status | Done |
| Phase 2056 | Extreme all avoid | Done |
| Phase 2057 | Extreme default panel bg | Done |
| Phase 2058 | Extreme pointer buttons | Done |
| Phase 2059 | Extreme not-allowed disabled | Done |
| Phase 2060 | Extreme grab drop zone | Done |
| Phase 2061 | Extreme grabbing active drop | Done |
| Phase 2062 | Extreme text filter input | Done |
| Phase 2063 | Extreme help on title attr | Done |
| Phase 2064 | Extreme transparent | Done |
| Phase 2065 | Extreme contain | Done |
| Phase 2066 | Extreme auto | Done |
| Phase 2067 | Extreme avoid on panel | Done |
| Phase 2068 | Extreme avoid experimental | Done |
| Phase 2069 | Extreme avoid native | Done |
| Phase 2070 | Extreme native keep | Done |
| Phase 2071 | Extreme native keep | Done |
| Phase 2072 | Extreme type=button assert | Done |
| Phase 2073 | Extreme type search filter | Done |
| Phase 2074 | Extreme autocomplete off filter | Done |
| Phase 2075 | Extreme spellcheck off filter | Done |
| Phase 2076 | Extreme autocorrect off filter | Done |
| Phase 2077 | Extreme autocapitalize off filter | Done |
| Phase 2078 | Extreme enterkeyhint search | Done |
| Phase 2079 | Extreme inputmode search | Done |
| Phase 2080 | Extreme avoid in Extreme | Done |
| Phase 2081 | Extreme avoid in Extreme | Done |
| Phase 2082 | Extreme avoid | Done |
| Phase 2083 | Extreme false chips | Done |
| Phase 2084 | Extreme true drop hint | Done |
| Phase 2085 | Extreme effect copy keep | Done |
| Phase 2086 | Extreme X toggle keep3 | Done |
| Phase 2087 | Extreme B body keep3 | Done |
| Phase 2088 | Extreme C copy keep3 | Done |
| Phase 2089 | Extreme R reset keep3 | Done |
| Phase 2090 | Extreme H help keep3 | Done |
| Phase 2091 | Extreme E ease keep3 | Done |
| Phase 2092 | Extreme M mix keep3 | Done |
| Phase 2093 | Extreme F factors keep3 | Done |
| Phase 2094 | Extreme N neck keep3 | Done |
| Phase 2095 | Extreme A all keep3 | Done |
| Phase 2096 | Extreme J json keep3 | Done |
| Phase 2097 | Extreme D diff keep3 | Done |
| Phase 2098 | Extreme K clear keep3 | Done |
| Phase 2099 | Extreme U undo keep3 | Done |
| Phase 2100 | Extreme P pin keep3 | Done |
| Phase 2101 | Extreme S star keep3 | Done |
| Phase 2102 | Extreme Q cycle fav keep3 | Done |
| Phase 2103 | Extreme W wipe keep3 | Done |
| Phase 2104 | Extreme G fav json keep3 | Done |
| Phase 2105 | Extreme T more keep3 | Done |
| Phase 2106 | Extreme Z stacks keep3 | Done |
| Phase 2107 | Extreme V share stacks keep3 | Done |
| Phase 2108 | Extreme Y share keep3 | Done |
| Phase 2109 | Extreme O redo json keep3 | Done |
| Phase 2110 | Extreme L hist list keep3 | Done |
| Phase 2111 | Extreme I paste hist keep3 | Done |
| Phase 2112 | Extreme Escape clear keep3 | Done |
| Phase 2113 | Extreme Delete clear keep3 | Done |
| Phase 2114 | Extreme Insert pin keep3 | Done |
| Phase 2115 | Extreme Tab focus panel keep3 | Done |
| Phase 2116 | Extreme F1 strips keep3 | Done |
| Phase 2117 | Extreme F2 factors keep3 | Done |
| Phase 2118 | Extreme F12 filter keep3 | Done |
| Phase 2119 | Extreme ArrowDown hist keep3 | Done |
| Phase 2120 | Extreme ArrowUp hist keep3 | Done |
| Phase 2121 | Extreme ArrowRight fav keep3 | Done |
| Phase 2122 | Extreme ArrowLeft fav keep3 | Done |
| Phase 2123 | Extreme Home dirty keep3 | Done |
| Phase 2124 | Extreme End dirty copy keep3 | Done |
| Phase 2125 | Extreme PageUp strips keep3 | Done |
| Phase 2126 | Extreme PageDown strips keep3 | Done |
| Phase 2127 | Extreme Backspace clear keep3 | Done |
| Phase 2128 | Extreme Space copy keep3 | Done |
| Phase 2129 | Extreme Enter activate keep3 | Done |
| Phase 2130 | Extreme Shift modifier keep3 | Done |
| Phase 2131 | Extreme Ctrl modifier keep3 | Done |
| Phase 2132 | Extreme Alt modifier keep3 | Done |
| Phase 2133 | Extreme Meta modifier keep3 | Done |
| Phase 2134 | Extreme name keep3 | Done |
| Phase 2135 | Extreme title keep3 | Done |
| Phase 2136 | Extreme name keep3 | Done |
| Phase 2137 | Extreme title keep3 | Done |
| Phase 2138 | Extreme name keep3 | Done |
| Phase 2139 | Extreme title keep3 | Done |
| Phase 2140 | Extreme name keep3 | Done |
| Phase 2141 | Extreme title keep3 | Done |
| Phase 2142 | Extreme name keep3 | Done |
| Phase 2143 | Extreme title keep3 | Done |
| Phase 2144 | Extreme name keep3 | Done |
| Phase 2145 | Extreme title keep3 | Done |
| Phase 2146 | Extreme name keep3 | Done |
| Phase 2147 | Extreme title keep3 | Done |
| Phase 2148 | Extreme name keep3 | Done |
| Phase 2149 | Extreme title keep3 | Done |
| Phase 2150 | Extreme name keep3 | Done |
| Phase 2151 | Extreme title keep3 | Done |
| Phase 2152 | Extreme name keep3 | Done |
| Phase 2153 | Extreme title keep3 | Done |
| Phase 2154 | Extreme name keep3 | Done |
| Phase 2155 | Extreme title keep3 | Done |
| Phase 2156 | Extreme name keep3 | Done |
| Phase 2157 | Extreme title keep3 | Done |
| Phase 2158 | Extreme name keep3 | Done |
| Phase 2159 | Extreme title keep3 | Done |
| Phase 2160 | Extreme name keep3 | Done |
| Phase 2161 | Extreme title keep3 | Done |
| Phase 2162 | Extreme name keep3 | Done |
| Phase 2163 | Extreme title keep3 | Done |
| Phase 2164 | Extreme name keep3 | Done |
| Phase 2165 | Extreme title keep3 | Done |
| Phase 2166 | Extreme name keep3 | Done |
| Phase 2167 | Extreme title keep3 | Done |
| Phase 2168 | Extreme name keep3 | Done |
| Phase 2169 | Extreme title keep3 | Done |
| Phase 2170 | Extreme name keep3 | Done |
| Phase 2171 | Extreme title keep3 | Done |
| Phase 2172 | Extreme name keep3 | Done |
| Phase 2173 | Extreme title keep3 | Done |
| Phase 2174 | Extreme name keep3 | Done |
| Phase 2175 | Extreme title keep3 | Done |
| Phase 2176 | Extreme name keep3 | Done |
| Phase 2177 | Extreme title keep3 | Done |
| Phase 2178 | Extreme name keep3 | Done |
| Phase 2179 | Extreme title keep3 | Done |
| Phase 2180 | Extreme name keep3 | Done |
| Phase 2181 | Extreme title keep3 | Done |
| Phase 2182 | Extreme bind keep3 | Done |
| Phase 2183 | Extreme refresh keep3 | Done |
| Phase 2184 | Extreme bind keep3 | Done |
| Phase 2185 | Extreme refresh keep3 | Done |
| Phase 2186 | Extreme bind keep3 | Done |
| Phase 2187 | Extreme refresh keep3 | Done |
| Phase 2188 | Extreme bind keep3 | Done |
| Phase 2189 | Extreme refresh keep3 | Done |
| Phase 2190 | Extreme bind keep3 | Done |
| Phase 2191 | Extreme refresh keep3 | Done |
| Phase 2192 | Extreme bind keep3 | Done |
| Phase 2193 | Extreme refresh keep3 | Done |
| Phase 2194 | Extreme bind keep3 | Done |
| Phase 2195 | Extreme refresh keep3 | Done |
| Phase 2196 | Extreme bind keep3 | Done |
| Phase 2197 | Extreme refresh keep3 | Done |
| Phase 2198 | Extreme bind keep3 | Done |
| Phase 2199 | Extreme refresh keep3 | Done |
| Phase 2200 | Extreme bind keep3 | Done |
| Phase 2201 | Extreme refresh keep3 | Done |
| Phase 2202 | Extreme bind keep3 | Done |
| Phase 2203 | Extreme refresh keep3 | Done |
| Phase 2204 | Extreme registry keep3 | Done |
| Phase 2205 | Extreme count 32 keep3 | Done |
| Phase 2206 | Extreme spaceCopy keep3 | Done |
| Phase 2207 | Extreme escapeClear keep3 | Done |
| Phase 2208 | Extreme onDelete keep3 | Done |
| Phase 2209 | Extreme Alt+Enter paste keep3 | Done |
| Phase 2210 | Extreme ariaFromTitle keep3 | Done |
| Phase 2211 | Extreme describedBy keep3 | Done |
| Phase 2212 | Extreme labelledBy keep3 | Done |
| Phase 2213 | Extreme keyshortcuts keep3 | Done |
| Phase 2214 | Extreme skipRole keep3 | Done |
| Phase 2215 | Extreme skipTabindex keep3 | Done |
| Phase 2216 | Extreme backgroundOnly keep3 | Done |
| Phase 2217 | Extreme ignoreChild keep3 | Done |
| Phase 2218 | Extreme pasteOnDblClick keep3 | Done |
| Phase 2219 | Extreme ⇧Enter paste keep3 | Done |
| Phase 2220 | Extreme ⇧Enter copy keep3 | Done |
| Phase 2221 | Extreme Delete clear keep3 | Done |
| Phase 2222 | Extreme Backspace clear keep3 | Done |
| Phase 2223 | Extreme click flash keep3 | Done |
| Phase 2224 | Extreme dblclick copy keep3 | Done |
| Phase 2225 | Extreme keydown Enter keep3 | Done |
| Phase 2226 | Extreme keydown Space keep3 | Done |
| Phase 2227 | Extreme shouldIgnoreTarget keep3 | Done |
| Phase 2228 | Extreme null guard keep3 | Done |
| Phase 2229 | Extreme normalize shortcuts keep3 | Done |
| Phase 2230 | Extreme doc comments keep3 | Done |
| Phase 2231 | Extreme status skipRole keep3 | Done |
| Phase 2232 | Extreme summary skipRole keep3 | Done |
| Phase 2233 | Extreme hist ignore chips keep3 | Done |
| Phase 2234 | Extreme fav ignore chips keep3 | Done |
| Phase 2235 | Extreme panel ignore children keep3 | Done |
| Phase 2236 | Extreme EnterJump keep3 | Done |
| Phase 2237 | Extreme ShiftEnterPin keep3 | Done |
| Phase 2238 | Extreme MetaEnterPreview keep3 | Done |
| Phase 2239 | Extreme CtrlEnterRemove keep3 | Done |
| Phase 2240 | Extreme AltEnterDiff keep3 | Done |
| Phase 2241 | Extreme ShiftAltCompare keep3 | Done |
| Phase 2242 | Extreme SpaceJump keep3 | Done |
| Phase 2243 | Extreme ShiftSpaceStar keep3 | Done |
| Phase 2244 | Extreme CtrlSpaceUnstar keep3 | Done |
| Phase 2245 | Extreme MetaSpacePreview keep3 | Done |
| Phase 2246 | Extreme ClickJump keep3 | Done |
| Phase 2247 | Extreme ShiftClickStar keep3 | Done |
| Phase 2248 | Extreme CtrlClickRemove keep3 | Done |
| Phase 2249 | Extreme MetaClickPreview keep3 | Done |
| Phase 2250 | Extreme AltClickDiff keep3 | Done |
| Phase 2251 | Extreme ShiftAltClickCompare keep3 | Done |
| Phase 2252 | Extreme DblClickPin keep3 | Done |
| Phase 2253 | Extreme AriaCurrent keep3 | Done |
| Phase 2254 | Extreme AriaPressed keep3 | Done |
| Phase 2255 | Extreme DescribedBy keep3 | Done |
| Phase 2256 | Extreme Keyshortcuts keep3 | Done |
| Phase 2257 | Extreme NativeButton keep3 | Done |
| Phase 2258 | Extreme FocusVisible keep3 | Done |
| Phase 2259 | Extreme HintsText keep3 | Done |
| Phase 2260 | Extreme combobox keep3 | Done |
| Phase 2261 | Extreme haspopup keep3 | Done |
| Phase 2262 | Extreme owns keep3 | Done |
| Phase 2263 | Extreme expanded keep3 | Done |
| Phase 2264 | Extreme activedescendant keep3 | Done |
| Phase 2265 | Extreme autocomplete keep3 | Done |
| Phase 2266 | Extreme Enter keep3 | Done |
| Phase 2267 | Extreme ⇧Enter keep3 | Done |
| Phase 2268 | Extreme ArrowDown keep3 | Done |
| Phase 2269 | Extreme ArrowUp keep3 | Done |
| Phase 2270 | Extreme Escape keep3 | Done |
| Phase 2271 | Extreme Alt+F12 keep3 | Done |
| Phase 2272 | Extreme switch keep3 | Done |
| Phase 2273 | Extreme switch keep3 | Done |
| Phase 2274 | Extreme checked sync keep3 | Done |
| Phase 2275 | Extreme orientation keep3 | Done |
| Phase 2276 | Extreme step valuetext keep3 | Done |
| Phase 2277 | Extreme disabled sync keep3 | Done |
| Phase 2278 | Extreme describedby keep3 | Done |
| Phase 2279 | Extreme live keep3 | Done |
| Phase 2280 | Extreme live sibling keep3 | Done |
| Phase 2281 | Extreme relevant keep3 | Done |
| Phase 2282 | Extreme no live keep3 | Done |
| Phase 2283 | Extreme token keep3 | Done |
| Phase 2284 | Extreme keep3 | Done |
| Phase 2285 | Extreme keep3 | Done |
| Phase 2286 | Extreme keep3 | Done |
| Phase 2287 | Extreme keep3 | Done |
| Phase 2288 | Extreme keep3 | Done |
| Phase 2289 | Extreme keep3 | Done |
| Phase 2290 | Extreme keep3 | Done |
| Phase 2291 | Extreme keep3 | Done |
| Phase 2292 | Extreme keep3 | Done |
| Phase 2293 | Extreme keep3 | Done |
| Phase 2294 | Extreme snap share keep3 | Done |
| Phase 2295 | Extreme hist share keep3 | Done |
| Phase 2296 | Extreme redo share keep3 | Done |
| Phase 2297 | Extreme fav share keep3 | Done |
| Phase 2298 | Extreme stacks share keep3 | Done |
| Phase 2299 | Extreme baseline keep3 | Done |
| Phase 2300 | Extreme hist keep3 | Done |
| Phase 2301 | Extreme redo keep3 | Done |
| Phase 2302 | Extreme fav keep3 | Done |
| Phase 2303 | Extreme prefs keep3 | Done |
| Phase 2304 | Extreme short keep3 | Done |
| Phase 2305 | Extreme flag keep3 | Done |
| Phase 2306 | Extreme keep3 | Done |
| Phase 2307 | Extreme keep3 | Done |
| Phase 2308 | Extreme keep3 | Done |
| Phase 2309 | Extreme keep3 | Done |
| Phase 2310 | Extreme keep3 | Done |
| Phase 2311 | Extreme keep3 | Done |
| Phase 2312 | Extreme keep3 | Done |
| Phase 2313 | Extreme keep3 | Done |
| Phase 2314 | Extreme img keep3 | Done |
| Phase 2315 | Extreme img keep3 | Done |
| Phase 2316 | Extreme img keep3 | Done |
| Phase 2317 | Extreme img keep3 | Done |
| Phase 2318 | Extreme img keep3 | Done |
| Phase 2319 | Extreme img keep3 | Done |
| Phase 2320 | Extreme label keep3 | Done |
| Phase 2321 | Extreme label keep3 | Done |
| Phase 2322 | Extreme label keep3 | Done |
| Phase 2323 | Extreme describedby keep3 | Done |
| Phase 2324 | Extreme labelledby keep3 | Done |
| Phase 2325 | Extreme bind keep3 | Done |
| Phase 2326 | Extreme bind keep3 | Done |
| Phase 2327 | Extreme bind keep3 | Done |
| Phase 2328 | Extreme flash keep3 | Done |
| Phase 2329 | Extreme copy keep3 | Done |
| Phase 2330 | Extreme flash keep3 | Done |
| Phase 2331 | Extreme copy keep3 | Done |
| Phase 2332 | Extreme keep3 | Done |
| Phase 2333 | Extreme keep3 | Done |
| Phase 2334 | Extreme wire keep3 | Done |
| Phase 2335 | Extreme wire keep3 | Done |
| Phase 2336 | Extreme expanded keep3 | Done |
| Phase 2337 | Extreme controls keep3 | Done |
| Phase 2338 | Extreme skipRole keep3 | Done |
| Phase 2339 | Extreme skipTabindex keep3 | Done |
| Phase 2340 | Extreme persist keep3 | Done |
| Phase 2341 | Extreme persist keep3 | Done |
| Phase 2342 | Extreme preserve keep3 | Done |
| Phase 2343 | Extreme normalize keep3 | Done |
| Phase 2344 | Extreme idempotent keep3 | Done |
| Phase 2345 | Extreme early boot keep3 | Done |
| Phase 2346 | Extreme 183 keep3 | Done |
| Phase 2347 | Extreme keep3 | Done |
| Phase 2348 | Extreme keep3 | Done |
| Phase 2349 | Extreme keep3 | Done |
| Phase 2350 | Extreme announce keep3 | Done |
| Phase 2351 | Extreme announce keep3 | Done |
| Phase 2352 | Extreme announce keep3 | Done |
| Phase 2353 | Extreme announce keep3 | Done |
| Phase 2354 | Extreme announce keep3 | Done |
| Phase 2355 | Extreme announce keep3 | Done |
| Phase 2356 | Extreme announce keep3 | Done |
| Phase 2357 | Extreme announce keep3 | Done |
| Phase 2358 | Extreme announce keep3 | Done |
| Phase 2359 | Extreme announce keep3 | Done |
| Phase 2360 | Extreme announce keep3 | Done |
| Phase 2361 | Extreme announce keep3 | Done |
| Phase 2362 | Extreme pulse keep3 | Done |
| Phase 2363 | Extreme pulse keep3 | Done |
| Phase 2364 | Extreme announce keep3 | Done |
| Phase 2365 | Extreme announce keep3 | Done |
| Phase 2366 | Extreme announce keep3 | Done |
| Phase 2367 | Extreme announce keep3 | Done |
| Phase 2368 | Extreme announce keep3 | Done |
| Phase 2369 | Extreme announce keep3 | Done |
| Phase 2370 | Extreme announce keep3 | Done |
| Phase 2371 | Extreme announce keep3 | Done |
| Phase 2372 | Extreme announce keep3 | Done |
| Phase 2373 | Extreme announce keep3 | Done |
| Phase 2374 | Extreme announce keep3 | Done |
| Phase 2375 | Extreme announce keep3 | Done |
| Phase 2376 | Extreme announce keep3 | Done |
| Phase 2377 | Extreme announce keep3 | Done |
| Phase 2378 | Extreme announce keep3 | Done |
| Phase 2379 | Extreme announce keep3 | Done |
| Phase 2380 | Extreme announce keep3 | Done |
| Phase 2381 | Extreme announce keep3 | Done |
| Phase 2382 | Extreme announce keep3 | Done |
| Phase 2383 | Extreme announce keep3 | Done |
| Phase 2384 | Extreme announce keep3 | Done |
| Phase 2385 | Extreme announce keep3 | Done |
| Phase 2386 | Extreme announce keep3 | Done |
| Phase 2387 | Extreme announce keep3 | Done |
| Phase 2388 | Extreme announce keep3 | Done |
| Phase 2389 | Extreme announce keep3 | Done |
| Phase 2390 | Extreme lang=en assert keep3 | Done |
| Phase 2391 | Extreme ltr assert keep3 | Done |
| Phase 2392 | Extreme English keep3 | Done |
| Phase 2393 | Extreme English keep3 | Done |
| Phase 2394 | Extreme English keep3 | Done |
| Phase 2395 | Extreme English keep3 | Done |
| Phase 2396 | Extreme English keep3 | Done |
| Phase 2397 | Extreme English keep3 | Done |
| Phase 2398 | Extreme English keep3 | Done |
| Phase 2399 | Extreme English keep3 | Done |
| Phase 2400 | Extreme English keep3 | Done |
| Phase 2401 | Extreme English keep3 | Done |
| Phase 2402 | Extreme English keep3 | Done |
| Phase 2403 | Extreme English keep3 | Done |
| Phase 2404 | Extreme English keep3 | Done |
| Phase 2405 | Extreme English keep3 | Done |
| Phase 2406 | Extreme English keep3 | Done |
| Phase 2407 | Extreme English keep3 | Done |
| Phase 2408 | Extreme English keep3 | Done |
| Phase 2409 | Extreme English keep3 | Done |
| Phase 2410 | Extreme English keep3 | Done |
| Phase 2411 | Extreme English keep3 | Done |
| Phase 2412 | Extreme English keep3 | Done |
| Phase 2413 | Extreme English keep3 | Done |
| Phase 2414 | Extreme hide HUD keep3 | Done |
| Phase 2415 | Extreme status readable keep3 | Done |
| Phase 2416 | Extreme hide skip keep3 | Done |
| Phase 2417 | Extreme text resize keep3 | Done |
| Phase 2418 | Extreme chip wrap keep3 | Done |
| Phase 2419 | Extreme toolbar wrap keep3 | Done |
| Phase 2420 | Extreme min size keep3 | Done |
| Phase 2421 | Extreme readable keep3 | Done |
| Phase 2422 | Extreme stable keep3 | Done |
| Phase 2423 | Extreme overflow keep3 | Done |
| Phase 2424 | Extreme max-width keep3 | Done |
| Phase 2425 | Extreme word-break keep3 | Done |
| Phase 2426 | Extreme ellipsis keep3 | Done |
| Phase 2427 | Extreme flex-wrap keep3 | Done |
| Phase 2428 | Extreme keep3 | Done |
| Phase 2429 | Extreme light keep3 | Done |
| Phase 2430 | Extreme post-1957 a11y polish notes | Done |
| Phase 2431 | Extreme phase table 1958+ | Done |
| Phase 2432 | Extreme a11y delta sync 1958+ | Done |
| Phase 2433 | Extreme bind surface count 32 keep4 | Done |
| Phase 2434 | Extreme 183 button aria keep4 | Done |
| Phase 2435 | Extreme chip modifier matrix keep4 | Done |
| Phase 2436 | Extreme focus-visible map keep4 | Done |
| Phase 2437 | Extreme live region policy keep4 | Done |
| Phase 2438 | Extreme reduced motion keep4 | Done |
| Phase 2439 | Extreme forced-colors keep4 | Done |
| Phase 2440 | Extreme pointer coarse keep4 | Done |
| Phase 2441 | Extreme landmark roles keep4 | Done |
| Phase 2442 | Extreme skip links keep4 | Done |
| Phase 2443 | Extreme spark role=img keep4 | Done |
| Phase 2444 | Extreme bind registry keep4 | Done |
| Phase 2445 | Extreme typography policy keep4 | Done |
| Phase 2446 | Extreme interaction policy keep4 | Done |
| Phase 2447 | Extreme a11y substring harness 1958+ | Done |
| Phase 2448 | Extreme 1958-3493 row count | Done |
| Phase 2449 | Extreme batch 1958+ | Done |
| Phase 2450 | Extreme item 1 | Done |
| Phase 2451 | Extreme item 2 | Done |
| Phase 2452 | Extreme item 3 | Done |
| Phase 2453 | Extreme item 4 | Done |
| Phase 2454 | Extreme item 5 | Done |
| Phase 2455 | Extreme item 6 | Done |
| Phase 2456 | Extreme item 7 | Done |
| Phase 2457 | Extreme item 8 | Done |
| Phase 2458 | Extreme item 9 | Done |
| Phase 2459 | Extreme item 10 | Done |
| Phase 2460 | Extreme item 11 | Done |
| Phase 2461 | Extreme item 12 | Done |
| Phase 2462 | Extreme item 13 | Done |
| Phase 2463 | Extreme item 14 | Done |
| Phase 2464 | Extreme item 15 | Done |
| Phase 2465 | Extreme item 16 | Done |
| Phase 2466 | Extreme item 17 | Done |
| Phase 2467 | Extreme item 18 | Done |
| Phase 2468 | Extreme item 19 | Done |
| Phase 2469 | Extreme item 20 | Done |
| Phase 2470 | Extreme item 21 | Done |
| Phase 2471 | Extreme item 22 | Done |
| Phase 2472 | Extreme item 23 | Done |
| Phase 2473 | Extreme item 24 | Done |
| Phase 2474 | Extreme item 25 | Done |
| Phase 2475 | Extreme item 26 | Done |
| Phase 2476 | Extreme item 27 | Done |
| Phase 2477 | Extreme item 28 | Done |
| Phase 2478 | Extreme item 29 | Done |
| Phase 2479 | Extreme item 30 | Done |
| Phase 2480 | Extreme item 31 | Done |
| Phase 2481 | Extreme item 32 | Done |
| Phase 2482 | Extreme item 33 | Done |
| Phase 2483 | Extreme item 34 | Done |
| Phase 2484 | Extreme item 35 | Done |
| Phase 2485 | Extreme item 36 | Done |
| Phase 2486 | Extreme item 37 | Done |
| Phase 2487 | Extreme item 38 | Done |
| Phase 2488 | Extreme item 39 | Done |
| Phase 2489 | Extreme item 40 | Done |
| Phase 2490 | Extreme item 41 | Done |
| Phase 2491 | Extreme item 42 | Done |
| Phase 2492 | Extreme item 43 | Done |
| Phase 2493 | Extreme item 44 | Done |
| Phase 2494 | Extreme item 45 | Done |
| Phase 2495 | Extreme item 46 | Done |
| Phase 2496 | Extreme item 47 | Done |
| Phase 2497 | Extreme item 48 | Done |
| Phase 2498 | Extreme item 49 | Done |
| Phase 2499 | Extreme item 50 | Done |
| Phase 2500 | Extreme item 51 | Done |
| Phase 2501 | Extreme item 52 | Done |
| Phase 2502 | Extreme item 53 | Done |
| Phase 2503 | Extreme item 54 | Done |
| Phase 2504 | Extreme item 55 | Done |
| Phase 2505 | Extreme item 56 | Done |
| Phase 2506 | Extreme item 57 | Done |
| Phase 2507 | Extreme item 58 | Done |
| Phase 2508 | Extreme item 59 | Done |
| Phase 2509 | Extreme item 60 | Done |
| Phase 2510 | Extreme item 61 | Done |
| Phase 2511 | Extreme item 62 | Done |
| Phase 2512 | Extreme item 63 | Done |
| Phase 2513 | Extreme item 64 | Done |
| Phase 2514 | Extreme item 65 | Done |
| Phase 2515 | Extreme item 66 | Done |
| Phase 2516 | Extreme item 67 | Done |
| Phase 2517 | Extreme item 68 | Done |
| Phase 2518 | Extreme item 69 | Done |
| Phase 2519 | Extreme item 70 | Done |
| Phase 2520 | Extreme item 71 | Done |
| Phase 2521 | Extreme item 72 | Done |
| Phase 2522 | Extreme item 73 | Done |
| Phase 2523 | Extreme item 74 | Done |
| Phase 2524 | Extreme item 75 | Done |
| Phase 2525 | Extreme item 76 | Done |
| Phase 2526 | Extreme item 77 | Done |
| Phase 2527 | Extreme item 78 | Done |
| Phase 2528 | Extreme item 79 | Done |
| Phase 2529 | Extreme item 80 | Done |
| Phase 2530 | Extreme item 81 | Done |
| Phase 2531 | Extreme item 82 | Done |
| Phase 2532 | Extreme item 83 | Done |
| Phase 2533 | Extreme item 84 | Done |
| Phase 2534 | Extreme item 85 | Done |
| Phase 2535 | Extreme item 86 | Done |
| Phase 2536 | Extreme item 87 | Done |
| Phase 2537 | Extreme item 88 | Done |
| Phase 2538 | Extreme item 89 | Done |
| Phase 2539 | Extreme item 90 | Done |
| Phase 2540 | Extreme item 91 | Done |
| Phase 2541 | Extreme item 92 | Done |
| Phase 2542 | Extreme item 93 | Done |
| Phase 2543 | Extreme item 94 | Done |
| Phase 2544 | Extreme item 95 | Done |
| Phase 2545 | Extreme item 96 | Done |
| Phase 2546 | Extreme item 97 | Done |
| Phase 2547 | Extreme item 98 | Done |
| Phase 2548 | Extreme item 99 | Done |
| Phase 2549 | Extreme item 100 | Done |
| Phase 2550 | Extreme item 101 | Done |
| Phase 2551 | Extreme item 102 | Done |
| Phase 2552 | Extreme item 103 | Done |
| Phase 2553 | Extreme item 104 | Done |
| Phase 2554 | Extreme item 105 | Done |
| Phase 2555 | Extreme item 106 | Done |
| Phase 2556 | Extreme item 107 | Done |
| Phase 2557 | Extreme item 108 | Done |
| Phase 2558 | Extreme item 109 | Done |
| Phase 2559 | Extreme item 110 | Done |
| Phase 2560 | Extreme item 111 | Done |
| Phase 2561 | Extreme item 112 | Done |
| Phase 2562 | Extreme item 113 | Done |
| Phase 2563 | Extreme item 114 | Done |
| Phase 2564 | Extreme item 115 | Done |
| Phase 2565 | Extreme item 116 | Done |
| Phase 2566 | Extreme item 117 | Done |
| Phase 2567 | Extreme item 118 | Done |
| Phase 2568 | Extreme item 119 | Done |
| Phase 2569 | Extreme item 120 | Done |
| Phase 2570 | Extreme item 121 | Done |
| Phase 2571 | Extreme item 122 | Done |
| Phase 2572 | Extreme item 123 | Done |
| Phase 2573 | Extreme item 124 | Done |
| Phase 2574 | Extreme item 125 | Done |
| Phase 2575 | Extreme item 126 | Done |
| Phase 2576 | Extreme item 127 | Done |
| Phase 2577 | Extreme item 128 | Done |
| Phase 2578 | Extreme item 129 | Done |
| Phase 2579 | Extreme item 130 | Done |
| Phase 2580 | Extreme item 131 | Done |
| Phase 2581 | Extreme item 132 | Done |
| Phase 2582 | Extreme item 133 | Done |
| Phase 2583 | Extreme item 134 | Done |
| Phase 2584 | Extreme item 135 | Done |
| Phase 2585 | Extreme item 136 | Done |
| Phase 2586 | Extreme item 137 | Done |
| Phase 2587 | Extreme item 138 | Done |
| Phase 2588 | Extreme item 139 | Done |
| Phase 2589 | Extreme item 140 | Done |
| Phase 2590 | Extreme item 141 | Done |
| Phase 2591 | Extreme item 142 | Done |
| Phase 2592 | Extreme item 143 | Done |
| Phase 2593 | Extreme item 144 | Done |
| Phase 2594 | Extreme item 145 | Done |
| Phase 2595 | Extreme item 146 | Done |
| Phase 2596 | Extreme item 147 | Done |
| Phase 2597 | Extreme item 148 | Done |
| Phase 2598 | Extreme item 149 | Done |
| Phase 2599 | Extreme item 150 | Done |
| Phase 2600 | Extreme item 151 | Done |
| Phase 2601 | Extreme item 152 | Done |
| Phase 2602 | Extreme item 153 | Done |
| Phase 2603 | Extreme item 154 | Done |
| Phase 2604 | Extreme item 155 | Done |
| Phase 2605 | Extreme item 156 | Done |
| Phase 2606 | Extreme item 157 | Done |
| Phase 2607 | Extreme item 158 | Done |
| Phase 2608 | Extreme item 159 | Done |
| Phase 2609 | Extreme item 160 | Done |
| Phase 2610 | Extreme item 161 | Done |
| Phase 2611 | Extreme item 162 | Done |
| Phase 2612 | Extreme item 163 | Done |
| Phase 2613 | Extreme item 164 | Done |
| Phase 2614 | Extreme item 165 | Done |
| Phase 2615 | Extreme item 166 | Done |
| Phase 2616 | Extreme item 167 | Done |
| Phase 2617 | Extreme item 168 | Done |
| Phase 2618 | Extreme item 169 | Done |
| Phase 2619 | Extreme item 170 | Done |
| Phase 2620 | Extreme item 171 | Done |
| Phase 2621 | Extreme item 172 | Done |
| Phase 2622 | Extreme item 173 | Done |
| Phase 2623 | Extreme item 174 | Done |
| Phase 2624 | Extreme item 175 | Done |
| Phase 2625 | Extreme item 176 | Done |
| Phase 2626 | Extreme item 177 | Done |
| Phase 2627 | Extreme item 178 | Done |
| Phase 2628 | Extreme item 179 | Done |
| Phase 2629 | Extreme item 180 | Done |
| Phase 2630 | Extreme item 181 | Done |
| Phase 2631 | Extreme item 182 | Done |
| Phase 2632 | Extreme item 183 | Done |
| Phase 2633 | Extreme item 184 | Done |
| Phase 2634 | Extreme item 185 | Done |
| Phase 2635 | Extreme item 186 | Done |
| Phase 2636 | Extreme item 187 | Done |
| Phase 2637 | Extreme item 188 | Done |
| Phase 2638 | Extreme item 189 | Done |
| Phase 2639 | Extreme item 190 | Done |
| Phase 2640 | Extreme item 191 | Done |
| Phase 2641 | Extreme item 192 | Done |
| Phase 2642 | Extreme item 193 | Done |
| Phase 2643 | Extreme item 194 | Done |
| Phase 2644 | Extreme item 195 | Done |
| Phase 2645 | Extreme item 196 | Done |
| Phase 2646 | Extreme item 197 | Done |
| Phase 2647 | Extreme item 198 | Done |
| Phase 2648 | Extreme item 199 | Done |
| Phase 2649 | Extreme item 200 | Done |
| Phase 2650 | Extreme item 201 | Done |
| Phase 2651 | Extreme item 202 | Done |
| Phase 2652 | Extreme item 203 | Done |
| Phase 2653 | Extreme item 204 | Done |
| Phase 2654 | Extreme item 205 | Done |
| Phase 2655 | Extreme item 206 | Done |
| Phase 2656 | Extreme item 207 | Done |
| Phase 2657 | Extreme item 208 | Done |
| Phase 2658 | Extreme item 209 | Done |
| Phase 2659 | Extreme item 210 | Done |
| Phase 2660 | Extreme item 211 | Done |
| Phase 2661 | Extreme item 212 | Done |
| Phase 2662 | Extreme item 213 | Done |
| Phase 2663 | Extreme item 214 | Done |
| Phase 2664 | Extreme item 215 | Done |
| Phase 2665 | Extreme item 216 | Done |
| Phase 2666 | Extreme item 217 | Done |
| Phase 2667 | Extreme item 218 | Done |
| Phase 2668 | Extreme item 219 | Done |
| Phase 2669 | Extreme item 220 | Done |
| Phase 2670 | Extreme item 221 | Done |
| Phase 2671 | Extreme item 222 | Done |
| Phase 2672 | Extreme item 223 | Done |
| Phase 2673 | Extreme item 224 | Done |
| Phase 2674 | Extreme item 225 | Done |
| Phase 2675 | Extreme item 226 | Done |
| Phase 2676 | Extreme item 227 | Done |
| Phase 2677 | Extreme item 228 | Done |
| Phase 2678 | Extreme item 229 | Done |
| Phase 2679 | Extreme item 230 | Done |
| Phase 2680 | Extreme item 231 | Done |
| Phase 2681 | Extreme item 232 | Done |
| Phase 2682 | Extreme item 233 | Done |
| Phase 2683 | Extreme item 234 | Done |
| Phase 2684 | Extreme item 235 | Done |
| Phase 2685 | Extreme item 236 | Done |
| Phase 2686 | Extreme item 237 | Done |
| Phase 2687 | Extreme item 238 | Done |
| Phase 2688 | Extreme item 239 | Done |
| Phase 2689 | Extreme item 240 | Done |
| Phase 2690 | Extreme item 241 | Done |
| Phase 2691 | Extreme item 242 | Done |
| Phase 2692 | Extreme item 243 | Done |
| Phase 2693 | Extreme item 244 | Done |
| Phase 2694 | Extreme item 245 | Done |
| Phase 2695 | Extreme item 246 | Done |
| Phase 2696 | Extreme item 247 | Done |
| Phase 2697 | Extreme item 248 | Done |
| Phase 2698 | Extreme item 249 | Done |
| Phase 2699 | Extreme item 250 | Done |
| Phase 2700 | Extreme item 251 | Done |
| Phase 2701 | Extreme item 252 | Done |
| Phase 2702 | Extreme item 253 | Done |
| Phase 2703 | Extreme item 254 | Done |
| Phase 2704 | Extreme item 255 | Done |
| Phase 2705 | Extreme item 256 | Done |
| Phase 2706 | Extreme item 257 | Done |
| Phase 2707 | Extreme item 258 | Done |
| Phase 2708 | Extreme item 259 | Done |
| Phase 2709 | Extreme item 260 | Done |
| Phase 2710 | Extreme item 261 | Done |
| Phase 2711 | Extreme item 262 | Done |
| Phase 2712 | Extreme item 263 | Done |
| Phase 2713 | Extreme item 264 | Done |
| Phase 2714 | Extreme item 265 | Done |
| Phase 2715 | Extreme item 266 | Done |
| Phase 2716 | Extreme item 267 | Done |
| Phase 2717 | Extreme item 268 | Done |
| Phase 2718 | Extreme item 269 | Done |
| Phase 2719 | Extreme item 270 | Done |
| Phase 2720 | Extreme item 271 | Done |
| Phase 2721 | Extreme item 272 | Done |
| Phase 2722 | Extreme item 273 | Done |
| Phase 2723 | Extreme item 274 | Done |
| Phase 2724 | Extreme item 275 | Done |
| Phase 2725 | Extreme item 276 | Done |
| Phase 2726 | Extreme item 277 | Done |
| Phase 2727 | Extreme item 278 | Done |
| Phase 2728 | Extreme item 279 | Done |
| Phase 2729 | Extreme item 280 | Done |
| Phase 2730 | Extreme item 281 | Done |
| Phase 2731 | Extreme item 282 | Done |
| Phase 2732 | Extreme item 283 | Done |
| Phase 2733 | Extreme item 284 | Done |
| Phase 2734 | Extreme item 285 | Done |
| Phase 2735 | Extreme item 286 | Done |
| Phase 2736 | Extreme item 287 | Done |
| Phase 2737 | Extreme item 288 | Done |
| Phase 2738 | Extreme item 289 | Done |
| Phase 2739 | Extreme item 290 | Done |
| Phase 2740 | Extreme item 291 | Done |
| Phase 2741 | Extreme item 292 | Done |
| Phase 2742 | Extreme item 293 | Done |
| Phase 2743 | Extreme item 294 | Done |
| Phase 2744 | Extreme item 295 | Done |
| Phase 2745 | Extreme item 296 | Done |
| Phase 2746 | Extreme item 297 | Done |
| Phase 2747 | Extreme item 298 | Done |
| Phase 2748 | Extreme item 299 | Done |
| Phase 2749 | Extreme item 300 | Done |
| Phase 2750 | Extreme item 301 | Done |
| Phase 2751 | Extreme item 302 | Done |
| Phase 2752 | Extreme item 303 | Done |
| Phase 2753 | Extreme item 304 | Done |
| Phase 2754 | Extreme item 305 | Done |
| Phase 2755 | Extreme item 306 | Done |
| Phase 2756 | Extreme item 307 | Done |
| Phase 2757 | Extreme item 308 | Done |
| Phase 2758 | Extreme item 309 | Done |
| Phase 2759 | Extreme item 310 | Done |
| Phase 2760 | Extreme item 311 | Done |
| Phase 2761 | Extreme item 312 | Done |
| Phase 2762 | Extreme item 313 | Done |
| Phase 2763 | Extreme item 314 | Done |
| Phase 2764 | Extreme item 315 | Done |
| Phase 2765 | Extreme item 316 | Done |
| Phase 2766 | Extreme item 317 | Done |
| Phase 2767 | Extreme item 318 | Done |
| Phase 2768 | Extreme item 319 | Done |
| Phase 2769 | Extreme item 320 | Done |
| Phase 2770 | Extreme item 321 | Done |
| Phase 2771 | Extreme item 322 | Done |
| Phase 2772 | Extreme item 323 | Done |
| Phase 2773 | Extreme item 324 | Done |
| Phase 2774 | Extreme item 325 | Done |
| Phase 2775 | Extreme item 326 | Done |
| Phase 2776 | Extreme item 327 | Done |
| Phase 2777 | Extreme item 328 | Done |
| Phase 2778 | Extreme item 329 | Done |
| Phase 2779 | Extreme item 330 | Done |
| Phase 2780 | Extreme item 331 | Done |
| Phase 2781 | Extreme item 332 | Done |
| Phase 2782 | Extreme item 333 | Done |
| Phase 2783 | Extreme item 334 | Done |
| Phase 2784 | Extreme item 335 | Done |
| Phase 2785 | Extreme item 336 | Done |
| Phase 2786 | Extreme item 337 | Done |
| Phase 2787 | Extreme item 338 | Done |
| Phase 2788 | Extreme item 339 | Done |
| Phase 2789 | Extreme item 340 | Done |
| Phase 2790 | Extreme item 341 | Done |
| Phase 2791 | Extreme item 342 | Done |
| Phase 2792 | Extreme item 343 | Done |
| Phase 2793 | Extreme item 344 | Done |
| Phase 2794 | Extreme item 345 | Done |
| Phase 2795 | Extreme item 346 | Done |
| Phase 2796 | Extreme item 347 | Done |
| Phase 2797 | Extreme item 348 | Done |
| Phase 2798 | Extreme item 349 | Done |
| Phase 2799 | Extreme item 350 | Done |
| Phase 2800 | Extreme item 351 | Done |
| Phase 2801 | Extreme item 352 | Done |
| Phase 2802 | Extreme item 353 | Done |
| Phase 2803 | Extreme item 354 | Done |
| Phase 2804 | Extreme item 355 | Done |
| Phase 2805 | Extreme item 356 | Done |
| Phase 2806 | Extreme item 357 | Done |
| Phase 2807 | Extreme item 358 | Done |
| Phase 2808 | Extreme item 359 | Done |
| Phase 2809 | Extreme item 360 | Done |
| Phase 2810 | Extreme item 361 | Done |
| Phase 2811 | Extreme item 362 | Done |
| Phase 2812 | Extreme item 363 | Done |
| Phase 2813 | Extreme item 364 | Done |
| Phase 2814 | Extreme item 365 | Done |
| Phase 2815 | Extreme item 366 | Done |
| Phase 2816 | Extreme item 367 | Done |
| Phase 2817 | Extreme item 368 | Done |
| Phase 2818 | Extreme item 369 | Done |
| Phase 2819 | Extreme item 370 | Done |
| Phase 2820 | Extreme item 371 | Done |
| Phase 2821 | Extreme item 372 | Done |
| Phase 2822 | Extreme item 373 | Done |
| Phase 2823 | Extreme item 374 | Done |
| Phase 2824 | Extreme item 375 | Done |
| Phase 2825 | Extreme item 376 | Done |
| Phase 2826 | Extreme item 377 | Done |
| Phase 2827 | Extreme item 378 | Done |
| Phase 2828 | Extreme item 379 | Done |
| Phase 2829 | Extreme item 380 | Done |
| Phase 2830 | Extreme item 381 | Done |
| Phase 2831 | Extreme item 382 | Done |
| Phase 2832 | Extreme item 383 | Done |
| Phase 2833 | Extreme item 384 | Done |
| Phase 2834 | Extreme item 385 | Done |
| Phase 2835 | Extreme item 386 | Done |
| Phase 2836 | Extreme item 387 | Done |
| Phase 2837 | Extreme item 388 | Done |
| Phase 2838 | Extreme item 389 | Done |
| Phase 2839 | Extreme item 390 | Done |
| Phase 2840 | Extreme item 391 | Done |
| Phase 2841 | Extreme item 392 | Done |
| Phase 2842 | Extreme item 393 | Done |
| Phase 2843 | Extreme item 394 | Done |
| Phase 2844 | Extreme item 395 | Done |
| Phase 2845 | Extreme item 396 | Done |
| Phase 2846 | Extreme item 397 | Done |
| Phase 2847 | Extreme item 398 | Done |
| Phase 2848 | Extreme item 399 | Done |
| Phase 2849 | Extreme item 400 | Done |
| Phase 2850 | Extreme item 401 | Done |
| Phase 2851 | Extreme item 402 | Done |
| Phase 2852 | Extreme item 403 | Done |
| Phase 2853 | Extreme item 404 | Done |
| Phase 2854 | Extreme item 405 | Done |
| Phase 2855 | Extreme item 406 | Done |
| Phase 2856 | Extreme item 407 | Done |
| Phase 2857 | Extreme item 408 | Done |
| Phase 2858 | Extreme item 409 | Done |
| Phase 2859 | Extreme item 410 | Done |
| Phase 2860 | Extreme item 411 | Done |
| Phase 2861 | Extreme item 412 | Done |
| Phase 2862 | Extreme item 413 | Done |
| Phase 2863 | Extreme item 414 | Done |
| Phase 2864 | Extreme item 415 | Done |
| Phase 2865 | Extreme item 416 | Done |
| Phase 2866 | Extreme item 417 | Done |
| Phase 2867 | Extreme item 418 | Done |
| Phase 2868 | Extreme item 419 | Done |
| Phase 2869 | Extreme item 420 | Done |
| Phase 2870 | Extreme item 421 | Done |
| Phase 2871 | Extreme item 422 | Done |
| Phase 2872 | Extreme item 423 | Done |
| Phase 2873 | Extreme item 424 | Done |
| Phase 2874 | Extreme item 425 | Done |
| Phase 2875 | Extreme item 426 | Done |
| Phase 2876 | Extreme item 427 | Done |
| Phase 2877 | Extreme item 428 | Done |
| Phase 2878 | Extreme item 429 | Done |
| Phase 2879 | Extreme item 430 | Done |
| Phase 2880 | Extreme item 431 | Done |
| Phase 2881 | Extreme item 432 | Done |
| Phase 2882 | Extreme item 433 | Done |
| Phase 2883 | Extreme item 434 | Done |
| Phase 2884 | Extreme item 435 | Done |
| Phase 2885 | Extreme item 436 | Done |
| Phase 2886 | Extreme item 437 | Done |
| Phase 2887 | Extreme item 438 | Done |
| Phase 2888 | Extreme item 439 | Done |
| Phase 2889 | Extreme item 440 | Done |
| Phase 2890 | Extreme item 441 | Done |
| Phase 2891 | Extreme item 442 | Done |
| Phase 2892 | Extreme item 443 | Done |
| Phase 2893 | Extreme item 444 | Done |
| Phase 2894 | Extreme item 445 | Done |
| Phase 2895 | Extreme item 446 | Done |
| Phase 2896 | Extreme item 447 | Done |
| Phase 2897 | Extreme item 448 | Done |
| Phase 2898 | Extreme item 449 | Done |
| Phase 2899 | Extreme item 450 | Done |
| Phase 2900 | Extreme item 451 | Done |
| Phase 2901 | Extreme item 452 | Done |
| Phase 2902 | Extreme item 453 | Done |
| Phase 2903 | Extreme item 454 | Done |
| Phase 2904 | Extreme item 455 | Done |
| Phase 2905 | Extreme item 456 | Done |
| Phase 2906 | Extreme item 457 | Done |
| Phase 2907 | Extreme item 458 | Done |
| Phase 2908 | Extreme item 459 | Done |
| Phase 2909 | Extreme item 460 | Done |
| Phase 2910 | Extreme item 461 | Done |
| Phase 2911 | Extreme item 462 | Done |
| Phase 2912 | Extreme item 463 | Done |
| Phase 2913 | Extreme item 464 | Done |
| Phase 2914 | Extreme item 465 | Done |
| Phase 2915 | Extreme item 466 | Done |
| Phase 2916 | Extreme item 467 | Done |
| Phase 2917 | Extreme item 468 | Done |
| Phase 2918 | Extreme item 469 | Done |
| Phase 2919 | Extreme item 470 | Done |
| Phase 2920 | Extreme item 471 | Done |
| Phase 2921 | Extreme item 472 | Done |
| Phase 2922 | Extreme item 473 | Done |
| Phase 2923 | Extreme item 474 | Done |
| Phase 2924 | Extreme item 475 | Done |
| Phase 2925 | Extreme item 476 | Done |
| Phase 2926 | Extreme item 477 | Done |
| Phase 2927 | Extreme item 478 | Done |
| Phase 2928 | Extreme item 479 | Done |
| Phase 2929 | Extreme item 480 | Done |
| Phase 2930 | Extreme item 481 | Done |
| Phase 2931 | Extreme item 482 | Done |
| Phase 2932 | Extreme item 483 | Done |
| Phase 2933 | Extreme item 484 | Done |
| Phase 2934 | Extreme item 485 | Done |
| Phase 2935 | Extreme item 486 | Done |
| Phase 2936 | Extreme item 487 | Done |
| Phase 2937 | Extreme item 488 | Done |
| Phase 2938 | Extreme item 489 | Done |
| Phase 2939 | Extreme item 490 | Done |
| Phase 2940 | Extreme item 491 | Done |
| Phase 2941 | Extreme item 492 | Done |
| Phase 2942 | Extreme item 493 | Done |
| Phase 2943 | Extreme item 494 | Done |
| Phase 2944 | Extreme item 495 | Done |
| Phase 2945 | Extreme item 496 | Done |
| Phase 2946 | Extreme item 497 | Done |
| Phase 2947 | Extreme item 498 | Done |
| Phase 2948 | Extreme item 499 | Done |
| Phase 2949 | Extreme item 500 | Done |
| Phase 2950 | Extreme item 501 | Done |
| Phase 2951 | Extreme item 502 | Done |
| Phase 2952 | Extreme item 503 | Done |
| Phase 2953 | Extreme item 504 | Done |
| Phase 2954 | Extreme item 505 | Done |
| Phase 2955 | Extreme item 506 | Done |
| Phase 2956 | Extreme item 507 | Done |
| Phase 2957 | Extreme item 508 | Done |
| Phase 2958 | Extreme item 509 | Done |
| Phase 2959 | Extreme item 510 | Done |
| Phase 2960 | Extreme item 511 | Done |
| Phase 2961 | Extreme item 512 | Done |
| Phase 2962 | Extreme item 513 | Done |
| Phase 2963 | Extreme item 514 | Done |
| Phase 2964 | Extreme item 515 | Done |
| Phase 2965 | Extreme item 516 | Done |
| Phase 2966 | Extreme item 517 | Done |
| Phase 2967 | Extreme item 518 | Done |
| Phase 2968 | Extreme item 519 | Done |
| Phase 2969 | Extreme item 520 | Done |
| Phase 2970 | Extreme item 521 | Done |
| Phase 2971 | Extreme item 522 | Done |
| Phase 2972 | Extreme item 523 | Done |
| Phase 2973 | Extreme item 524 | Done |
| Phase 2974 | Extreme item 525 | Done |
| Phase 2975 | Extreme item 526 | Done |
| Phase 2976 | Extreme item 527 | Done |
| Phase 2977 | Extreme item 528 | Done |
| Phase 2978 | Extreme item 529 | Done |
| Phase 2979 | Extreme item 530 | Done |
| Phase 2980 | Extreme item 531 | Done |
| Phase 2981 | Extreme item 532 | Done |
| Phase 2982 | Extreme item 533 | Done |
| Phase 2983 | Extreme item 534 | Done |
| Phase 2984 | Extreme item 535 | Done |
| Phase 2985 | Extreme item 536 | Done |
| Phase 2986 | Extreme item 537 | Done |
| Phase 2987 | Extreme item 538 | Done |
| Phase 2988 | Extreme item 539 | Done |
| Phase 2989 | Extreme item 540 | Done |
| Phase 2990 | Extreme item 541 | Done |
| Phase 2991 | Extreme item 542 | Done |
| Phase 2992 | Extreme item 543 | Done |
| Phase 2993 | Extreme item 544 | Done |
| Phase 2994 | Extreme item 545 | Done |
| Phase 2995 | Extreme item 546 | Done |
| Phase 2996 | Extreme item 547 | Done |
| Phase 2997 | Extreme item 548 | Done |
| Phase 2998 | Extreme item 549 | Done |
| Phase 2999 | Extreme item 550 | Done |
| Phase 3000 | Extreme item 551 | Done |
| Phase 3001 | Extreme item 552 | Done |
| Phase 3002 | Extreme item 553 | Done |
| Phase 3003 | Extreme item 554 | Done |
| Phase 3004 | Extreme item 555 | Done |
| Phase 3005 | Extreme item 556 | Done |
| Phase 3006 | Extreme item 557 | Done |
| Phase 3007 | Extreme item 558 | Done |
| Phase 3008 | Extreme item 559 | Done |
| Phase 3009 | Extreme item 560 | Done |
| Phase 3010 | Extreme item 561 | Done |
| Phase 3011 | Extreme item 562 | Done |
| Phase 3012 | Extreme item 563 | Done |
| Phase 3013 | Extreme item 564 | Done |
| Phase 3014 | Extreme item 565 | Done |
| Phase 3015 | Extreme item 566 | Done |
| Phase 3016 | Extreme item 567 | Done |
| Phase 3017 | Extreme item 568 | Done |
| Phase 3018 | Extreme item 569 | Done |
| Phase 3019 | Extreme item 570 | Done |
| Phase 3020 | Extreme item 571 | Done |
| Phase 3021 | Extreme item 572 | Done |
| Phase 3022 | Extreme item 573 | Done |
| Phase 3023 | Extreme item 574 | Done |
| Phase 3024 | Extreme item 575 | Done |
| Phase 3025 | Extreme item 576 | Done |
| Phase 3026 | Extreme item 577 | Done |
| Phase 3027 | Extreme item 578 | Done |
| Phase 3028 | Extreme item 579 | Done |
| Phase 3029 | Extreme item 580 | Done |
| Phase 3030 | Extreme item 581 | Done |
| Phase 3031 | Extreme item 582 | Done |
| Phase 3032 | Extreme item 583 | Done |
| Phase 3033 | Extreme item 584 | Done |
| Phase 3034 | Extreme item 585 | Done |
| Phase 3035 | Extreme item 586 | Done |
| Phase 3036 | Extreme item 587 | Done |
| Phase 3037 | Extreme item 588 | Done |
| Phase 3038 | Extreme item 589 | Done |
| Phase 3039 | Extreme item 590 | Done |
| Phase 3040 | Extreme item 591 | Done |
| Phase 3041 | Extreme item 592 | Done |
| Phase 3042 | Extreme item 593 | Done |
| Phase 3043 | Extreme item 594 | Done |
| Phase 3044 | Extreme item 595 | Done |
| Phase 3045 | Extreme item 596 | Done |
| Phase 3046 | Extreme item 597 | Done |
| Phase 3047 | Extreme item 598 | Done |
| Phase 3048 | Extreme item 599 | Done |
| Phase 3049 | Extreme item 600 | Done |
| Phase 3050 | Extreme item 601 | Done |
| Phase 3051 | Extreme item 602 | Done |
| Phase 3052 | Extreme item 603 | Done |
| Phase 3053 | Extreme item 604 | Done |
| Phase 3054 | Extreme item 605 | Done |
| Phase 3055 | Extreme item 606 | Done |
| Phase 3056 | Extreme item 607 | Done |
| Phase 3057 | Extreme item 608 | Done |
| Phase 3058 | Extreme item 609 | Done |
| Phase 3059 | Extreme item 610 | Done |
| Phase 3060 | Extreme item 611 | Done |
| Phase 3061 | Extreme item 612 | Done |
| Phase 3062 | Extreme item 613 | Done |
| Phase 3063 | Extreme item 614 | Done |
| Phase 3064 | Extreme item 615 | Done |
| Phase 3065 | Extreme item 616 | Done |
| Phase 3066 | Extreme item 617 | Done |
| Phase 3067 | Extreme item 618 | Done |
| Phase 3068 | Extreme item 619 | Done |
| Phase 3069 | Extreme item 620 | Done |
| Phase 3070 | Extreme item 621 | Done |
| Phase 3071 | Extreme item 622 | Done |
| Phase 3072 | Extreme item 623 | Done |
| Phase 3073 | Extreme item 624 | Done |
| Phase 3074 | Extreme item 625 | Done |
| Phase 3075 | Extreme item 626 | Done |
| Phase 3076 | Extreme item 627 | Done |
| Phase 3077 | Extreme item 628 | Done |
| Phase 3078 | Extreme item 629 | Done |
| Phase 3079 | Extreme item 630 | Done |
| Phase 3080 | Extreme item 631 | Done |
| Phase 3081 | Extreme item 632 | Done |
| Phase 3082 | Extreme item 633 | Done |
| Phase 3083 | Extreme item 634 | Done |
| Phase 3084 | Extreme item 635 | Done |
| Phase 3085 | Extreme item 636 | Done |
| Phase 3086 | Extreme item 637 | Done |
| Phase 3087 | Extreme item 638 | Done |
| Phase 3088 | Extreme item 639 | Done |
| Phase 3089 | Extreme item 640 | Done |
| Phase 3090 | Extreme item 641 | Done |
| Phase 3091 | Extreme item 642 | Done |
| Phase 3092 | Extreme item 643 | Done |
| Phase 3093 | Extreme item 644 | Done |
| Phase 3094 | Extreme item 645 | Done |
| Phase 3095 | Extreme item 646 | Done |
| Phase 3096 | Extreme item 647 | Done |
| Phase 3097 | Extreme item 648 | Done |
| Phase 3098 | Extreme item 649 | Done |
| Phase 3099 | Extreme item 650 | Done |
| Phase 3100 | Extreme item 651 | Done |
| Phase 3101 | Extreme item 652 | Done |
| Phase 3102 | Extreme item 653 | Done |
| Phase 3103 | Extreme item 654 | Done |
| Phase 3104 | Extreme item 655 | Done |
| Phase 3105 | Extreme item 656 | Done |
| Phase 3106 | Extreme item 657 | Done |
| Phase 3107 | Extreme item 658 | Done |
| Phase 3108 | Extreme item 659 | Done |
| Phase 3109 | Extreme item 660 | Done |
| Phase 3110 | Extreme item 661 | Done |
| Phase 3111 | Extreme item 662 | Done |
| Phase 3112 | Extreme item 663 | Done |
| Phase 3113 | Extreme item 664 | Done |
| Phase 3114 | Extreme item 665 | Done |
| Phase 3115 | Extreme item 666 | Done |
| Phase 3116 | Extreme item 667 | Done |
| Phase 3117 | Extreme item 668 | Done |
| Phase 3118 | Extreme item 669 | Done |
| Phase 3119 | Extreme item 670 | Done |
| Phase 3120 | Extreme item 671 | Done |
| Phase 3121 | Extreme item 672 | Done |
| Phase 3122 | Extreme item 673 | Done |
| Phase 3123 | Extreme item 674 | Done |
| Phase 3124 | Extreme item 675 | Done |
| Phase 3125 | Extreme item 676 | Done |
| Phase 3126 | Extreme item 677 | Done |
| Phase 3127 | Extreme item 678 | Done |
| Phase 3128 | Extreme item 679 | Done |
| Phase 3129 | Extreme item 680 | Done |
| Phase 3130 | Extreme item 681 | Done |
| Phase 3131 | Extreme item 682 | Done |
| Phase 3132 | Extreme item 683 | Done |
| Phase 3133 | Extreme item 684 | Done |
| Phase 3134 | Extreme item 685 | Done |
| Phase 3135 | Extreme item 686 | Done |
| Phase 3136 | Extreme item 687 | Done |
| Phase 3137 | Extreme item 688 | Done |
| Phase 3138 | Extreme item 689 | Done |
| Phase 3139 | Extreme item 690 | Done |
| Phase 3140 | Extreme item 691 | Done |
| Phase 3141 | Extreme item 692 | Done |
| Phase 3142 | Extreme item 693 | Done |
| Phase 3143 | Extreme item 694 | Done |
| Phase 3144 | Extreme item 695 | Done |
| Phase 3145 | Extreme item 696 | Done |
| Phase 3146 | Extreme item 697 | Done |
| Phase 3147 | Extreme item 698 | Done |
| Phase 3148 | Extreme item 699 | Done |
| Phase 3149 | Extreme item 700 | Done |
| Phase 3150 | Extreme item 701 | Done |
| Phase 3151 | Extreme item 702 | Done |
| Phase 3152 | Extreme item 703 | Done |
| Phase 3153 | Extreme item 704 | Done |
| Phase 3154 | Extreme item 705 | Done |
| Phase 3155 | Extreme item 706 | Done |
| Phase 3156 | Extreme item 707 | Done |
| Phase 3157 | Extreme item 708 | Done |
| Phase 3158 | Extreme item 709 | Done |
| Phase 3159 | Extreme item 710 | Done |
| Phase 3160 | Extreme item 711 | Done |
| Phase 3161 | Extreme item 712 | Done |
| Phase 3162 | Extreme item 713 | Done |
| Phase 3163 | Extreme item 714 | Done |
| Phase 3164 | Extreme item 715 | Done |
| Phase 3165 | Extreme item 716 | Done |
| Phase 3166 | Extreme item 717 | Done |
| Phase 3167 | Extreme item 718 | Done |
| Phase 3168 | Extreme item 719 | Done |
| Phase 3169 | Extreme item 720 | Done |
| Phase 3170 | Extreme item 721 | Done |
| Phase 3171 | Extreme item 722 | Done |
| Phase 3172 | Extreme item 723 | Done |
| Phase 3173 | Extreme item 724 | Done |
| Phase 3174 | Extreme item 725 | Done |
| Phase 3175 | Extreme item 726 | Done |
| Phase 3176 | Extreme item 727 | Done |
| Phase 3177 | Extreme item 728 | Done |
| Phase 3178 | Extreme item 729 | Done |
| Phase 3179 | Extreme item 730 | Done |
| Phase 3180 | Extreme item 731 | Done |
| Phase 3181 | Extreme item 732 | Done |
| Phase 3182 | Extreme item 733 | Done |
| Phase 3183 | Extreme item 734 | Done |
| Phase 3184 | Extreme item 735 | Done |
| Phase 3185 | Extreme item 736 | Done |
| Phase 3186 | Extreme item 737 | Done |
| Phase 3187 | Extreme item 738 | Done |
| Phase 3188 | Extreme item 739 | Done |
| Phase 3189 | Extreme item 740 | Done |
| Phase 3190 | Extreme item 741 | Done |
| Phase 3191 | Extreme item 742 | Done |
| Phase 3192 | Extreme item 743 | Done |
| Phase 3193 | Extreme item 744 | Done |
| Phase 3194 | Extreme item 745 | Done |
| Phase 3195 | Extreme item 746 | Done |
| Phase 3196 | Extreme item 747 | Done |
| Phase 3197 | Extreme item 748 | Done |
| Phase 3198 | Extreme item 749 | Done |
| Phase 3199 | Extreme item 750 | Done |
| Phase 3200 | Extreme item 751 | Done |
| Phase 3201 | Extreme item 752 | Done |
| Phase 3202 | Extreme item 753 | Done |
| Phase 3203 | Extreme item 754 | Done |
| Phase 3204 | Extreme item 755 | Done |
| Phase 3205 | Extreme item 756 | Done |
| Phase 3206 | Extreme item 757 | Done |
| Phase 3207 | Extreme item 758 | Done |
| Phase 3208 | Extreme item 759 | Done |
| Phase 3209 | Extreme item 760 | Done |
| Phase 3210 | Extreme item 761 | Done |
| Phase 3211 | Extreme item 762 | Done |
| Phase 3212 | Extreme item 763 | Done |
| Phase 3213 | Extreme item 764 | Done |
| Phase 3214 | Extreme item 765 | Done |
| Phase 3215 | Extreme item 766 | Done |
| Phase 3216 | Extreme item 767 | Done |
| Phase 3217 | Extreme item 768 | Done |
| Phase 3218 | Extreme item 769 | Done |
| Phase 3219 | Extreme item 770 | Done |
| Phase 3220 | Extreme item 771 | Done |
| Phase 3221 | Extreme item 772 | Done |
| Phase 3222 | Extreme item 773 | Done |
| Phase 3223 | Extreme item 774 | Done |
| Phase 3224 | Extreme item 775 | Done |
| Phase 3225 | Extreme item 776 | Done |
| Phase 3226 | Extreme item 777 | Done |
| Phase 3227 | Extreme item 778 | Done |
| Phase 3228 | Extreme item 779 | Done |
| Phase 3229 | Extreme item 780 | Done |
| Phase 3230 | Extreme item 781 | Done |
| Phase 3231 | Extreme item 782 | Done |
| Phase 3232 | Extreme item 783 | Done |
| Phase 3233 | Extreme item 784 | Done |
| Phase 3234 | Extreme item 785 | Done |
| Phase 3235 | Extreme item 786 | Done |
| Phase 3236 | Extreme item 787 | Done |
| Phase 3237 | Extreme item 788 | Done |
| Phase 3238 | Extreme item 789 | Done |
| Phase 3239 | Extreme item 790 | Done |
| Phase 3240 | Extreme item 791 | Done |
| Phase 3241 | Extreme item 792 | Done |
| Phase 3242 | Extreme item 793 | Done |
| Phase 3243 | Extreme item 794 | Done |
| Phase 3244 | Extreme item 795 | Done |
| Phase 3245 | Extreme item 796 | Done |
| Phase 3246 | Extreme item 797 | Done |
| Phase 3247 | Extreme item 798 | Done |
| Phase 3248 | Extreme item 799 | Done |
| Phase 3249 | Extreme item 800 | Done |
| Phase 3250 | Extreme item 801 | Done |
| Phase 3251 | Extreme item 802 | Done |
| Phase 3252 | Extreme item 803 | Done |
| Phase 3253 | Extreme item 804 | Done |
| Phase 3254 | Extreme item 805 | Done |
| Phase 3255 | Extreme item 806 | Done |
| Phase 3256 | Extreme item 807 | Done |
| Phase 3257 | Extreme item 808 | Done |
| Phase 3258 | Extreme item 809 | Done |
| Phase 3259 | Extreme item 810 | Done |
| Phase 3260 | Extreme item 811 | Done |
| Phase 3261 | Extreme item 812 | Done |
| Phase 3262 | Extreme item 813 | Done |
| Phase 3263 | Extreme item 814 | Done |
| Phase 3264 | Extreme item 815 | Done |
| Phase 3265 | Extreme item 816 | Done |
| Phase 3266 | Extreme item 817 | Done |
| Phase 3267 | Extreme item 818 | Done |
| Phase 3268 | Extreme item 819 | Done |
| Phase 3269 | Extreme item 820 | Done |
| Phase 3270 | Extreme item 821 | Done |
| Phase 3271 | Extreme item 822 | Done |
| Phase 3272 | Extreme item 823 | Done |
| Phase 3273 | Extreme item 824 | Done |
| Phase 3274 | Extreme item 825 | Done |
| Phase 3275 | Extreme item 826 | Done |
| Phase 3276 | Extreme item 827 | Done |
| Phase 3277 | Extreme item 828 | Done |
| Phase 3278 | Extreme item 829 | Done |
| Phase 3279 | Extreme item 830 | Done |
| Phase 3280 | Extreme item 831 | Done |
| Phase 3281 | Extreme item 832 | Done |
| Phase 3282 | Extreme item 833 | Done |
| Phase 3283 | Extreme item 834 | Done |
| Phase 3284 | Extreme item 835 | Done |
| Phase 3285 | Extreme item 836 | Done |
| Phase 3286 | Extreme item 837 | Done |
| Phase 3287 | Extreme item 838 | Done |
| Phase 3288 | Extreme item 839 | Done |
| Phase 3289 | Extreme item 840 | Done |
| Phase 3290 | Extreme item 841 | Done |
| Phase 3291 | Extreme item 842 | Done |
| Phase 3292 | Extreme item 843 | Done |
| Phase 3293 | Extreme item 844 | Done |
| Phase 3294 | Extreme item 845 | Done |
| Phase 3295 | Extreme item 846 | Done |
| Phase 3296 | Extreme item 847 | Done |
| Phase 3297 | Extreme item 848 | Done |
| Phase 3298 | Extreme item 849 | Done |
| Phase 3299 | Extreme item 850 | Done |
| Phase 3300 | Extreme item 851 | Done |
| Phase 3301 | Extreme item 852 | Done |
| Phase 3302 | Extreme item 853 | Done |
| Phase 3303 | Extreme item 854 | Done |
| Phase 3304 | Extreme item 855 | Done |
| Phase 3305 | Extreme item 856 | Done |
| Phase 3306 | Extreme item 857 | Done |
| Phase 3307 | Extreme item 858 | Done |
| Phase 3308 | Extreme item 859 | Done |
| Phase 3309 | Extreme item 860 | Done |
| Phase 3310 | Extreme item 861 | Done |
| Phase 3311 | Extreme item 862 | Done |
| Phase 3312 | Extreme item 863 | Done |
| Phase 3313 | Extreme item 864 | Done |
| Phase 3314 | Extreme item 865 | Done |
| Phase 3315 | Extreme item 866 | Done |
| Phase 3316 | Extreme item 867 | Done |
| Phase 3317 | Extreme item 868 | Done |
| Phase 3318 | Extreme item 869 | Done |
| Phase 3319 | Extreme item 870 | Done |
| Phase 3320 | Extreme item 871 | Done |
| Phase 3321 | Extreme item 872 | Done |
| Phase 3322 | Extreme item 873 | Done |
| Phase 3323 | Extreme item 874 | Done |
| Phase 3324 | Extreme item 875 | Done |
| Phase 3325 | Extreme item 876 | Done |
| Phase 3326 | Extreme item 877 | Done |
| Phase 3327 | Extreme item 878 | Done |
| Phase 3328 | Extreme item 879 | Done |
| Phase 3329 | Extreme item 880 | Done |
| Phase 3330 | Extreme item 881 | Done |
| Phase 3331 | Extreme item 882 | Done |
| Phase 3332 | Extreme item 883 | Done |
| Phase 3333 | Extreme item 884 | Done |
| Phase 3334 | Extreme item 885 | Done |
| Phase 3335 | Extreme item 886 | Done |
| Phase 3336 | Extreme item 887 | Done |
| Phase 3337 | Extreme item 888 | Done |
| Phase 3338 | Extreme item 889 | Done |
| Phase 3339 | Extreme item 890 | Done |
| Phase 3340 | Extreme item 891 | Done |
| Phase 3341 | Extreme item 892 | Done |
| Phase 3342 | Extreme item 893 | Done |
| Phase 3343 | Extreme item 894 | Done |
| Phase 3344 | Extreme item 895 | Done |
| Phase 3345 | Extreme item 896 | Done |
| Phase 3346 | Extreme item 897 | Done |
| Phase 3347 | Extreme item 898 | Done |
| Phase 3348 | Extreme item 899 | Done |
| Phase 3349 | Extreme item 900 | Done |
| Phase 3350 | Extreme item 901 | Done |
| Phase 3351 | Extreme item 902 | Done |
| Phase 3352 | Extreme item 903 | Done |
| Phase 3353 | Extreme item 904 | Done |
| Phase 3354 | Extreme item 905 | Done |
| Phase 3355 | Extreme item 906 | Done |
| Phase 3356 | Extreme item 907 | Done |
| Phase 3357 | Extreme item 908 | Done |
| Phase 3358 | Extreme item 909 | Done |
| Phase 3359 | Extreme item 910 | Done |
| Phase 3360 | Extreme item 911 | Done |
| Phase 3361 | Extreme item 912 | Done |
| Phase 3362 | Extreme item 913 | Done |
| Phase 3363 | Extreme item 914 | Done |
| Phase 3364 | Extreme item 915 | Done |
| Phase 3365 | Extreme item 916 | Done |
| Phase 3366 | Extreme item 917 | Done |
| Phase 3367 | Extreme item 918 | Done |
| Phase 3368 | Extreme item 919 | Done |
| Phase 3369 | Extreme item 920 | Done |
| Phase 3370 | Extreme item 921 | Done |
| Phase 3371 | Extreme item 922 | Done |
| Phase 3372 | Extreme item 923 | Done |
| Phase 3373 | Extreme item 924 | Done |
| Phase 3374 | Extreme item 925 | Done |
| Phase 3375 | Extreme item 926 | Done |
| Phase 3376 | Extreme item 927 | Done |
| Phase 3377 | Extreme item 928 | Done |
| Phase 3378 | Extreme item 929 | Done |
| Phase 3379 | Extreme item 930 | Done |
| Phase 3380 | Extreme item 931 | Done |
| Phase 3381 | Extreme item 932 | Done |
| Phase 3382 | Extreme item 933 | Done |
| Phase 3383 | Extreme item 934 | Done |
| Phase 3384 | Extreme item 935 | Done |
| Phase 3385 | Extreme item 936 | Done |
| Phase 3386 | Extreme item 937 | Done |
| Phase 3387 | Extreme item 938 | Done |
| Phase 3388 | Extreme item 939 | Done |
| Phase 3389 | Extreme item 940 | Done |
| Phase 3390 | Extreme item 941 | Done |
| Phase 3391 | Extreme item 942 | Done |
| Phase 3392 | Extreme item 943 | Done |
| Phase 3393 | Extreme item 944 | Done |
| Phase 3394 | Extreme item 945 | Done |
| Phase 3395 | Extreme item 946 | Done |
| Phase 3396 | Extreme item 947 | Done |
| Phase 3397 | Extreme item 948 | Done |
| Phase 3398 | Extreme item 949 | Done |
| Phase 3399 | Extreme item 950 | Done |
| Phase 3400 | Extreme item 951 | Done |
| Phase 3401 | Extreme item 952 | Done |
| Phase 3402 | Extreme item 953 | Done |
| Phase 3403 | Extreme item 954 | Done |
| Phase 3404 | Extreme item 955 | Done |
| Phase 3405 | Extreme item 956 | Done |
| Phase 3406 | Extreme item 957 | Done |
| Phase 3407 | Extreme item 958 | Done |
| Phase 3408 | Extreme item 959 | Done |
| Phase 3409 | Extreme item 960 | Done |
| Phase 3410 | Extreme item 961 | Done |
| Phase 3411 | Extreme item 962 | Done |
| Phase 3412 | Extreme item 963 | Done |
| Phase 3413 | Extreme item 964 | Done |
| Phase 3414 | Extreme item 965 | Done |
| Phase 3415 | Extreme item 966 | Done |
| Phase 3416 | Extreme item 967 | Done |
| Phase 3417 | Extreme item 968 | Done |
| Phase 3418 | Extreme item 969 | Done |
| Phase 3419 | Extreme item 970 | Done |
| Phase 3420 | Extreme item 971 | Done |
| Phase 3421 | Extreme item 972 | Done |
| Phase 3422 | Extreme item 973 | Done |
| Phase 3423 | Extreme item 974 | Done |
| Phase 3424 | Extreme item 975 | Done |
| Phase 3425 | Extreme item 976 | Done |
| Phase 3426 | Extreme item 977 | Done |
| Phase 3427 | Extreme item 978 | Done |
| Phase 3428 | Extreme item 979 | Done |
| Phase 3429 | Extreme item 980 | Done |
| Phase 3430 | Extreme item 981 | Done |
| Phase 3431 | Extreme item 982 | Done |
| Phase 3432 | Extreme item 983 | Done |
| Phase 3433 | Extreme item 984 | Done |
| Phase 3434 | Extreme item 985 | Done |
| Phase 3435 | Extreme item 986 | Done |
| Phase 3436 | Extreme item 987 | Done |
| Phase 3437 | Extreme item 988 | Done |
| Phase 3438 | Extreme item 989 | Done |
| Phase 3439 | Extreme item 990 | Done |
| Phase 3440 | Extreme item 991 | Done |
| Phase 3441 | Extreme item 992 | Done |
| Phase 3442 | Extreme item 993 | Done |
| Phase 3443 | Extreme item 994 | Done |
| Phase 3444 | Extreme item 995 | Done |
| Phase 3445 | Extreme item 996 | Done |
| Phase 3446 | Extreme item 997 | Done |
| Phase 3447 | Extreme item 998 | Done |
| Phase 3448 | Extreme item 999 | Done |
| Phase 3449 | Extreme item 1000 | Done |
| Phase 3450 | Extreme item 1001 | Done |
| Phase 3451 | Extreme item 1002 | Done |
| Phase 3452 | Extreme item 1003 | Done |
| Phase 3453 | Extreme item 1004 | Done |
| Phase 3454 | Extreme item 1005 | Done |
| Phase 3455 | Extreme item 1006 | Done |
| Phase 3456 | Extreme item 1007 | Done |
| Phase 3457 | Extreme item 1008 | Done |
| Phase 3458 | Extreme item 1009 | Done |
| Phase 3459 | Extreme item 1010 | Done |
| Phase 3460 | Extreme item 1011 | Done |
| Phase 3461 | Extreme item 1012 | Done |
| Phase 3462 | Extreme item 1013 | Done |
| Phase 3463 | Extreme item 1014 | Done |
| Phase 3464 | Extreme item 1015 | Done |
| Phase 3465 | Extreme item 1016 | Done |
| Phase 3466 | Extreme item 1017 | Done |
| Phase 3467 | Extreme item 1018 | Done |
| Phase 3468 | Extreme item 1019 | Done |
| Phase 3469 | Extreme item 1020 | Done |
| Phase 3470 | Extreme item 1021 | Done |
| Phase 3471 | Extreme item 1022 | Done |
| Phase 3472 | Extreme item 1023 | Done |
| Phase 3473 | Extreme item 1024 | Done |
| Phase 3474 | Extreme item 1025 | Done |
| Phase 3475 | Extreme item 1026 | Done |
| Phase 3476 | Extreme item 1027 | Done |
| Phase 3477 | Extreme item 1028 | Done |
| Phase 3478 | Extreme item 1029 | Done |
| Phase 3479 | Extreme item 1030 | Done |
| Phase 3480 | Extreme item 1031 | Done |
| Phase 3481 | Extreme item 1032 | Done |
| Phase 3482 | Extreme item 1033 | Done |
| Phase 3483 | Extreme item 1034 | Done |
| Phase 3484 | Extreme item 1035 | Done |
| Phase 3485 | Extreme item 1036 | Done |
| Phase 3486 | Extreme item 1037 | Done |
| Phase 3487 | Extreme item 1038 | Done |
| Phase 3488 | Extreme item 1039 | Done |
| Phase 3489 | Extreme item 1040 | Done |
| Phase 3490 | Extreme item 1041 | Done |
| Phase 3491 | Extreme item 1042 | Done |
| Phase 3492 | Extreme item 1043 | Done |
| Phase 3493 | Extreme item 1044 | Done |
| Phase 3494 | Extreme meta keep | Done |
| Phase 3495 | Extreme panel inset | Done |
| Phase 3496 | Extreme toolbar inset | Done |
| Phase 3497 | Extreme panel query ready | Done |
| Phase 3498 | Extreme min-height assert | Done |
| Phase 3499 | Extreme max-height fluid | Done |
| Phase 3500 | Extreme aspect-ratio keep | Done |
| Phase 3501 | Extreme object-fit keep | Done |
| Phase 3502 | Extreme contain layout | Done |
| Phase 3503 | Extreme isolation isolate | Done |
| Phase 3504 | Extreme avoid on panel | Done |
| Phase 3505 | Extreme avoid gpu on chips | Done |
| Phase 3506 | Extreme keep | Done |
| Phase 3507 | Extreme contain | Done |
| Phase 3508 | Extreme avoid on hist | Done |
| Phase 3509 | Extreme skip link | Done |
| Phase 3510 | Extreme avoid experimental | Done |
| Phase 3511 | Extreme auto strips | Done |
| Phase 3512 | Extreme strips | Done |
| Phase 3513 | Extreme none on panel | Done |
| Phase 3514 | Extreme border-box assert | Done |
| Phase 3515 | Extreme min-width 0 children | Done |
| Phase 3516 | Extreme toolbar token assert | Done |
| Phase 3517 | Extreme panel token assert | Done |
| Phase 3518 | Extreme strips token assert | Done |
| Phase 3519 | Extreme token assert | Done |
| Phase 3520 | Extreme token assert | Done |
| Phase 3521 | Extreme disabled sync keep | Done |
| Phase 3522 | Extreme hidden live offscreen | Done |
| Phase 3523 | Extreme avoid on interactive | Done |
| Phase 3524 | Extreme avoid on buttons | Done |
| Phase 3525 | Extreme avoid | Done |
| Phase 3526 | Extreme prefers-contrast more | Done |
| Phase 3527 | Extreme prefers-contrast less | Done |
| Phase 3528 | Extreme buttons visible | Done |
| Phase 3529 | Extreme skip links visible | Done |
| Phase 3530 | Extreme chips visible | Done |
| Phase 3531 | Extreme slider thumb | Done |
| Phase 3532 | Extreme switch track | Done |
| Phase 3533 | Extreme dark avoid | Done |
| Phase 3534 | Extreme token assert | Done |
| Phase 3535 | Extreme filter input | Done |
| Phase 3536 | Extreme solid assert | Done |
| Phase 3537 | Extreme token assert | Done |
| Phase 3538 | Extreme ink | Done |
| Phase 3539 | Extreme color inherit skip | Done |
| Phase 3540 | Extreme no distinct color | Done |
| Phase 3541 | Extreme contrast assert | Done |
| Phase 3542 | Extreme contrast assert | Done |
| Phase 3543 | Extreme contrast assert | Done |
| Phase 3544 | Extreme contrast assert | Done |
| Phase 3545 | Extreme contrast assert | Done |
| Phase 3546 | Extreme contrast assert | Done |
| Phase 3547 | Extreme contrast keep | Done |
| Phase 3548 | Extreme contrast keep | Done |
| Phase 3549 | Extreme avoid on status | Done |
| Phase 3550 | Extreme color keep | Done |
| Phase 3551 | Extreme avoid | Done |
| Phase 3552 | Extreme currentColor keep | Done |
| Phase 3553 | Extreme fill/stroke keep | Done |
| Phase 3554 | Extreme system stack keep | Done |
| Phase 3555 | Extreme root rem base | Done |
| Phase 3556 | Extreme status readable | Done |
| Phase 3557 | Extreme chip readable | Done |
| Phase 3558 | Extreme toolbar readable | Done |
| Phase 3559 | Extreme label readable | Done |
| Phase 3560 | Extreme normal body | Done |
| Phase 3561 | Extreme bold labels | Done |
| Phase 3562 | Extreme tabular | Done |
| Phase 3563 | Extreme default | Done |
| Phase 3564 | Extreme status 1.4+ | Done |
| Phase 3565 | Extreme chip 1.3+ | Done |
| Phase 3566 | Extreme normal | Done |
| Phase 3567 | Extreme normal | Done |
| Phase 3568 | Extreme none on chips | Done |
| Phase 3569 | Extreme none keep | Done |
| Phase 3570 | Extreme status wrap | Done |
| Phase 3571 | Extreme chip nowrap ellipsis | Done |
| Phase 3572 | Extreme start keep | Done |
| Phase 3573 | Extreme zero | Done |
| Phase 3574 | Extreme default | Done |
| Phase 3575 | Extreme horizontal-tb | Done |
| Phase 3576 | Extreme ltr assert | Done |
| Phase 3577 | Extreme normal | Done |
| Phase 3578 | Extreme none | Done |
| Phase 3579 | Extreme auto | Done |
| Phase 3580 | Extreme normal | Done |
| Phase 3581 | Extreme optimizeLegibility | Done |
| Phase 3582 | Extreme antialiased | Done |
| Phase 3583 | Extreme break-word status | Done |
| Phase 3584 | Extreme normal chips | Done |
| Phase 3585 | Extreme avoid on status | Done |
| Phase 3586 | Extreme auto interactive | Done |
| Phase 3587 | Extreme none decor | Done |
| Phase 3588 | Extreme manipulation buttons | Done |
| Phase 3589 | Extreme pan-y panel | Done |
| Phase 3590 | Extreme none toolbar labels | Done |
| Phase 3591 | Extreme text status | Done |
| Phase 3592 | Extreme all avoid | Done |
| Phase 3593 | Extreme default panel bg | Done |
| Phase 3594 | Extreme pointer buttons | Done |
| Phase 3595 | Extreme not-allowed disabled | Done |
| Phase 3596 | Extreme grab drop zone | Done |
| Phase 3597 | Extreme grabbing active drop | Done |
| Phase 3598 | Extreme text filter input | Done |
| Phase 3599 | Extreme help on title attr | Done |
| Phase 3600 | Extreme transparent | Done |
| Phase 3601 | Extreme contain | Done |
| Phase 3602 | Extreme auto | Done |
| Phase 3603 | Extreme avoid on panel | Done |
| Phase 3604 | Extreme avoid experimental | Done |
| Phase 3605 | Extreme avoid native | Done |
| Phase 3606 | Extreme native keep | Done |
| Phase 3607 | Extreme native keep | Done |
| Phase 3608 | Extreme type=button assert | Done |
| Phase 3609 | Extreme type search filter | Done |
| Phase 3610 | Extreme autocomplete off filter | Done |
| Phase 3611 | Extreme spellcheck off filter | Done |
| Phase 3612 | Extreme autocorrect off filter | Done |
| Phase 3613 | Extreme autocapitalize off filter | Done |
| Phase 3614 | Extreme enterkeyhint search | Done |
| Phase 3615 | Extreme inputmode search | Done |
| Phase 3616 | Extreme avoid in Extreme | Done |
| Phase 3617 | Extreme avoid in Extreme | Done |
| Phase 3618 | Extreme avoid | Done |
| Phase 3619 | Extreme false chips | Done |
| Phase 3620 | Extreme true drop hint | Done |
| Phase 3621 | Extreme effect copy keep | Done |
| Phase 3622 | Extreme X toggle keep3 | Done |
| Phase 3623 | Extreme B body keep3 | Done |
| Phase 3624 | Extreme C copy keep3 | Done |
| Phase 3625 | Extreme R reset keep3 | Done |
| Phase 3626 | Extreme H help keep3 | Done |
| Phase 3627 | Extreme E ease keep3 | Done |
| Phase 3628 | Extreme M mix keep3 | Done |
| Phase 3629 | Extreme F factors keep3 | Done |
| Phase 3630 | Extreme N neck keep3 | Done |
| Phase 3631 | Extreme A all keep3 | Done |
| Phase 3632 | Extreme J json keep3 | Done |
| Phase 3633 | Extreme D diff keep3 | Done |
| Phase 3634 | Extreme K clear keep3 | Done |
| Phase 3635 | Extreme U undo keep3 | Done |
| Phase 3636 | Extreme P pin keep3 | Done |
| Phase 3637 | Extreme S star keep3 | Done |
| Phase 3638 | Extreme Q cycle fav keep3 | Done |
| Phase 3639 | Extreme W wipe keep3 | Done |
| Phase 3640 | Extreme G fav json keep3 | Done |
| Phase 3641 | Extreme T more keep3 | Done |
| Phase 3642 | Extreme Z stacks keep3 | Done |
| Phase 3643 | Extreme V share stacks keep3 | Done |
| Phase 3644 | Extreme Y share keep3 | Done |
| Phase 3645 | Extreme O redo json keep3 | Done |
| Phase 3646 | Extreme L hist list keep3 | Done |
| Phase 3647 | Extreme I paste hist keep3 | Done |
| Phase 3648 | Extreme Escape clear keep3 | Done |
| Phase 3649 | Extreme Delete clear keep3 | Done |
| Phase 3650 | Extreme Insert pin keep3 | Done |
| Phase 3651 | Extreme Tab focus panel keep3 | Done |
| Phase 3652 | Extreme F1 strips keep3 | Done |
| Phase 3653 | Extreme F2 factors keep3 | Done |
| Phase 3654 | Extreme F12 filter keep3 | Done |
| Phase 3655 | Extreme ArrowDown hist keep3 | Done |
| Phase 3656 | Extreme ArrowUp hist keep3 | Done |
| Phase 3657 | Extreme ArrowRight fav keep3 | Done |
| Phase 3658 | Extreme ArrowLeft fav keep3 | Done |
| Phase 3659 | Extreme Home dirty keep3 | Done |
| Phase 3660 | Extreme End dirty copy keep3 | Done |
| Phase 3661 | Extreme PageUp strips keep3 | Done |
| Phase 3662 | Extreme PageDown strips keep3 | Done |
| Phase 3663 | Extreme Backspace clear keep3 | Done |
| Phase 3664 | Extreme Space copy keep3 | Done |
| Phase 3665 | Extreme Enter activate keep3 | Done |
| Phase 3666 | Extreme Shift modifier keep3 | Done |
| Phase 3667 | Extreme Ctrl modifier keep3 | Done |
| Phase 3668 | Extreme Alt modifier keep3 | Done |
| Phase 3669 | Extreme Meta modifier keep3 | Done |
| Phase 3670 | Extreme name keep3 | Done |
| Phase 3671 | Extreme title keep3 | Done |
| Phase 3672 | Extreme name keep3 | Done |
| Phase 3673 | Extreme title keep3 | Done |
| Phase 3674 | Extreme name keep3 | Done |
| Phase 3675 | Extreme title keep3 | Done |
| Phase 3676 | Extreme name keep3 | Done |
| Phase 3677 | Extreme title keep3 | Done |
| Phase 3678 | Extreme name keep3 | Done |
| Phase 3679 | Extreme title keep3 | Done |
| Phase 3680 | Extreme name keep3 | Done |
| Phase 3681 | Extreme title keep3 | Done |
| Phase 3682 | Extreme name keep3 | Done |
| Phase 3683 | Extreme title keep3 | Done |
| Phase 3684 | Extreme name keep3 | Done |
| Phase 3685 | Extreme title keep3 | Done |
| Phase 3686 | Extreme name keep3 | Done |
| Phase 3687 | Extreme title keep3 | Done |
| Phase 3688 | Extreme name keep3 | Done |
| Phase 3689 | Extreme title keep3 | Done |
| Phase 3690 | Extreme name keep3 | Done |
| Phase 3691 | Extreme title keep3 | Done |
| Phase 3692 | Extreme name keep3 | Done |
| Phase 3693 | Extreme title keep3 | Done |
| Phase 3694 | Extreme name keep3 | Done |
| Phase 3695 | Extreme title keep3 | Done |
| Phase 3696 | Extreme name keep3 | Done |
| Phase 3697 | Extreme title keep3 | Done |
| Phase 3698 | Extreme name keep3 | Done |
| Phase 3699 | Extreme title keep3 | Done |
| Phase 3700 | Extreme name keep3 | Done |
| Phase 3701 | Extreme title keep3 | Done |
| Phase 3702 | Extreme name keep3 | Done |
| Phase 3703 | Extreme title keep3 | Done |
| Phase 3704 | Extreme name keep3 | Done |
| Phase 3705 | Extreme title keep3 | Done |
| Phase 3706 | Extreme name keep3 | Done |
| Phase 3707 | Extreme title keep3 | Done |
| Phase 3708 | Extreme name keep3 | Done |
| Phase 3709 | Extreme title keep3 | Done |
| Phase 3710 | Extreme name keep3 | Done |
| Phase 3711 | Extreme title keep3 | Done |
| Phase 3712 | Extreme name keep3 | Done |
| Phase 3713 | Extreme title keep3 | Done |
| Phase 3714 | Extreme name keep3 | Done |
| Phase 3715 | Extreme title keep3 | Done |
| Phase 3716 | Extreme name keep3 | Done |
| Phase 3717 | Extreme title keep3 | Done |
| Phase 3718 | Extreme bind keep3 | Done |
| Phase 3719 | Extreme refresh keep3 | Done |
| Phase 3720 | Extreme bind keep3 | Done |
| Phase 3721 | Extreme refresh keep3 | Done |
| Phase 3722 | Extreme bind keep3 | Done |
| Phase 3723 | Extreme refresh keep3 | Done |
| Phase 3724 | Extreme bind keep3 | Done |
| Phase 3725 | Extreme refresh keep3 | Done |
| Phase 3726 | Extreme bind keep3 | Done |
| Phase 3727 | Extreme refresh keep3 | Done |
| Phase 3728 | Extreme bind keep3 | Done |
| Phase 3729 | Extreme refresh keep3 | Done |
| Phase 3730 | Extreme bind keep3 | Done |
| Phase 3731 | Extreme refresh keep3 | Done |
| Phase 3732 | Extreme bind keep3 | Done |
| Phase 3733 | Extreme refresh keep3 | Done |
| Phase 3734 | Extreme bind keep3 | Done |
| Phase 3735 | Extreme refresh keep3 | Done |
| Phase 3736 | Extreme bind keep3 | Done |
| Phase 3737 | Extreme refresh keep3 | Done |
| Phase 3738 | Extreme bind keep3 | Done |
| Phase 3739 | Extreme refresh keep3 | Done |
| Phase 3740 | Extreme registry keep3 | Done |
| Phase 3741 | Extreme count 32 keep3 | Done |
| Phase 3742 | Extreme spaceCopy keep3 | Done |
| Phase 3743 | Extreme escapeClear keep3 | Done |
| Phase 3744 | Extreme onDelete keep3 | Done |
| Phase 3745 | Extreme Alt+Enter paste keep3 | Done |
| Phase 3746 | Extreme ariaFromTitle keep3 | Done |
| Phase 3747 | Extreme describedBy keep3 | Done |
| Phase 3748 | Extreme labelledBy keep3 | Done |
| Phase 3749 | Extreme keyshortcuts keep3 | Done |
| Phase 3750 | Extreme skipRole keep3 | Done |
| Phase 3751 | Extreme skipTabindex keep3 | Done |
| Phase 3752 | Extreme backgroundOnly keep3 | Done |
| Phase 3753 | Extreme ignoreChild keep3 | Done |
| Phase 3754 | Extreme pasteOnDblClick keep3 | Done |
| Phase 3755 | Extreme ⇧Enter paste keep3 | Done |
| Phase 3756 | Extreme ⇧Enter copy keep3 | Done |
| Phase 3757 | Extreme Delete clear keep3 | Done |
| Phase 3758 | Extreme Backspace clear keep3 | Done |
| Phase 3759 | Extreme click flash keep3 | Done |
| Phase 3760 | Extreme dblclick copy keep3 | Done |
| Phase 3761 | Extreme keydown Enter keep3 | Done |
| Phase 3762 | Extreme keydown Space keep3 | Done |
| Phase 3763 | Extreme shouldIgnoreTarget keep3 | Done |
| Phase 3764 | Extreme null guard keep3 | Done |
| Phase 3765 | Extreme normalize shortcuts keep3 | Done |
| Phase 3766 | Extreme doc comments keep3 | Done |
| Phase 3767 | Extreme status skipRole keep3 | Done |
| Phase 3768 | Extreme summary skipRole keep3 | Done |
| Phase 3769 | Extreme hist ignore chips keep3 | Done |
| Phase 3770 | Extreme fav ignore chips keep3 | Done |
| Phase 3771 | Extreme panel ignore children keep3 | Done |
| Phase 3772 | Extreme EnterJump keep3 | Done |
| Phase 3773 | Extreme ShiftEnterPin keep3 | Done |
| Phase 3774 | Extreme MetaEnterPreview keep3 | Done |
| Phase 3775 | Extreme CtrlEnterRemove keep3 | Done |
| Phase 3776 | Extreme AltEnterDiff keep3 | Done |
| Phase 3777 | Extreme ShiftAltCompare keep3 | Done |
| Phase 3778 | Extreme SpaceJump keep3 | Done |
| Phase 3779 | Extreme ShiftSpaceStar keep3 | Done |
| Phase 3780 | Extreme CtrlSpaceUnstar keep3 | Done |
| Phase 3781 | Extreme MetaSpacePreview keep3 | Done |
| Phase 3782 | Extreme ClickJump keep3 | Done |
| Phase 3783 | Extreme ShiftClickStar keep3 | Done |
| Phase 3784 | Extreme CtrlClickRemove keep3 | Done |
| Phase 3785 | Extreme MetaClickPreview keep3 | Done |
| Phase 3786 | Extreme AltClickDiff keep3 | Done |
| Phase 3787 | Extreme ShiftAltClickCompare keep3 | Done |
| Phase 3788 | Extreme DblClickPin keep3 | Done |
| Phase 3789 | Extreme AriaCurrent keep3 | Done |
| Phase 3790 | Extreme AriaPressed keep3 | Done |
| Phase 3791 | Extreme DescribedBy keep3 | Done |
| Phase 3792 | Extreme Keyshortcuts keep3 | Done |
| Phase 3793 | Extreme NativeButton keep3 | Done |
| Phase 3794 | Extreme FocusVisible keep3 | Done |
| Phase 3795 | Extreme HintsText keep3 | Done |
| Phase 3796 | Extreme combobox keep3 | Done |
| Phase 3797 | Extreme haspopup keep3 | Done |
| Phase 3798 | Extreme owns keep3 | Done |
| Phase 3799 | Extreme expanded keep3 | Done |
| Phase 3800 | Extreme activedescendant keep3 | Done |
| Phase 3801 | Extreme autocomplete keep3 | Done |
| Phase 3802 | Extreme Enter keep3 | Done |
| Phase 3803 | Extreme ⇧Enter keep3 | Done |
| Phase 3804 | Extreme ArrowDown keep3 | Done |
| Phase 3805 | Extreme ArrowUp keep3 | Done |
| Phase 3806 | Extreme Escape keep3 | Done |
| Phase 3807 | Extreme Alt+F12 keep3 | Done |
| Phase 3808 | Extreme switch keep3 | Done |
| Phase 3809 | Extreme switch keep3 | Done |
| Phase 3810 | Extreme checked sync keep3 | Done |
| Phase 3811 | Extreme orientation keep3 | Done |
| Phase 3812 | Extreme step valuetext keep3 | Done |
| Phase 3813 | Extreme disabled sync keep3 | Done |
| Phase 3814 | Extreme describedby keep3 | Done |
| Phase 3815 | Extreme live keep3 | Done |
| Phase 3816 | Extreme live sibling keep3 | Done |
| Phase 3817 | Extreme relevant keep3 | Done |
| Phase 3818 | Extreme no live keep3 | Done |
| Phase 3819 | Extreme token keep3 | Done |
| Phase 3820 | Extreme keep3 | Done |
| Phase 3821 | Extreme keep3 | Done |
| Phase 3822 | Extreme keep3 | Done |
| Phase 3823 | Extreme keep3 | Done |
| Phase 3824 | Extreme keep3 | Done |
| Phase 3825 | Extreme keep3 | Done |
| Phase 3826 | Extreme keep3 | Done |
| Phase 3827 | Extreme keep3 | Done |
| Phase 3828 | Extreme keep3 | Done |
| Phase 3829 | Extreme keep3 | Done |
| Phase 3830 | Extreme snap share keep3 | Done |
| Phase 3831 | Extreme hist share keep3 | Done |
| Phase 3832 | Extreme redo share keep3 | Done |
| Phase 3833 | Extreme fav share keep3 | Done |
| Phase 3834 | Extreme stacks share keep3 | Done |
| Phase 3835 | Extreme baseline keep3 | Done |
| Phase 3836 | Extreme hist keep3 | Done |
| Phase 3837 | Extreme redo keep3 | Done |
| Phase 3838 | Extreme fav keep3 | Done |
| Phase 3839 | Extreme prefs keep3 | Done |
| Phase 3840 | Extreme short keep3 | Done |
| Phase 3841 | Extreme flag keep3 | Done |
| Phase 3842 | Extreme keep3 | Done |
| Phase 3843 | Extreme keep3 | Done |
| Phase 3844 | Extreme keep3 | Done |
| Phase 3845 | Extreme keep3 | Done |
| Phase 3846 | Extreme keep3 | Done |
| Phase 3847 | Extreme keep3 | Done |
| Phase 3848 | Extreme keep3 | Done |
| Phase 3849 | Extreme keep3 | Done |
| Phase 3850 | Extreme img keep3 | Done |
| Phase 3851 | Extreme img keep3 | Done |
| Phase 3852 | Extreme img keep3 | Done |
| Phase 3853 | Extreme img keep3 | Done |
| Phase 3854 | Extreme img keep3 | Done |
| Phase 3855 | Extreme img keep3 | Done |
| Phase 3856 | Extreme label keep3 | Done |
| Phase 3857 | Extreme label keep3 | Done |
| Phase 3858 | Extreme label keep3 | Done |
| Phase 3859 | Extreme describedby keep3 | Done |
| Phase 3860 | Extreme labelledby keep3 | Done |
| Phase 3861 | Extreme bind keep3 | Done |
| Phase 3862 | Extreme bind keep3 | Done |
| Phase 3863 | Extreme bind keep3 | Done |
| Phase 3864 | Extreme flash keep3 | Done |
| Phase 3865 | Extreme copy keep3 | Done |
| Phase 3866 | Extreme flash keep3 | Done |
| Phase 3867 | Extreme copy keep3 | Done |
| Phase 3868 | Extreme keep3 | Done |
| Phase 3869 | Extreme keep3 | Done |
| Phase 3870 | Extreme wire keep3 | Done |
| Phase 3871 | Extreme wire keep3 | Done |
| Phase 3872 | Extreme expanded keep3 | Done |
| Phase 3873 | Extreme controls keep3 | Done |
| Phase 3874 | Extreme skipRole keep3 | Done |
| Phase 3875 | Extreme skipTabindex keep3 | Done |
| Phase 3876 | Extreme persist keep3 | Done |
| Phase 3877 | Extreme persist keep3 | Done |
| Phase 3878 | Extreme preserve keep3 | Done |
| Phase 3879 | Extreme normalize keep3 | Done |
| Phase 3880 | Extreme idempotent keep3 | Done |
| Phase 3881 | Extreme early boot keep3 | Done |
| Phase 3882 | Extreme 183 keep3 | Done |
| Phase 3883 | Extreme keep3 | Done |
| Phase 3884 | Extreme keep3 | Done |
| Phase 3885 | Extreme keep3 | Done |
| Phase 3886 | Extreme announce keep3 | Done |
| Phase 3887 | Extreme announce keep3 | Done |
| Phase 3888 | Extreme announce keep3 | Done |
| Phase 3889 | Extreme announce keep3 | Done |
| Phase 3890 | Extreme announce keep3 | Done |
| Phase 3891 | Extreme announce keep3 | Done |
| Phase 3892 | Extreme announce keep3 | Done |
| Phase 3893 | Extreme announce keep3 | Done |
| Phase 3894 | Extreme announce keep3 | Done |
| Phase 3895 | Extreme announce keep3 | Done |
| Phase 3896 | Extreme announce keep3 | Done |
| Phase 3897 | Extreme announce keep3 | Done |
| Phase 3898 | Extreme pulse keep3 | Done |
| Phase 3899 | Extreme pulse keep3 | Done |
| Phase 3900 | Extreme announce keep3 | Done |
| Phase 3901 | Extreme announce keep3 | Done |
| Phase 3902 | Extreme announce keep3 | Done |
| Phase 3903 | Extreme announce keep3 | Done |
| Phase 3904 | Extreme announce keep3 | Done |
| Phase 3905 | Extreme announce keep3 | Done |
| Phase 3906 | Extreme announce keep3 | Done |
| Phase 3907 | Extreme announce keep3 | Done |
| Phase 3908 | Extreme announce keep3 | Done |
| Phase 3909 | Extreme announce keep3 | Done |
| Phase 3910 | Extreme announce keep3 | Done |
| Phase 3911 | Extreme announce keep3 | Done |
| Phase 3912 | Extreme announce keep3 | Done |
| Phase 3913 | Extreme announce keep3 | Done |
| Phase 3914 | Extreme announce keep3 | Done |
| Phase 3915 | Extreme announce keep3 | Done |
| Phase 3916 | Extreme announce keep3 | Done |
| Phase 3917 | Extreme announce keep3 | Done |
| Phase 3918 | Extreme announce keep3 | Done |
| Phase 3919 | Extreme announce keep3 | Done |
| Phase 3920 | Extreme announce keep3 | Done |
| Phase 3921 | Extreme announce keep3 | Done |
| Phase 3922 | Extreme announce keep3 | Done |
| Phase 3923 | Extreme announce keep3 | Done |
| Phase 3924 | Extreme announce keep3 | Done |
| Phase 3925 | Extreme announce keep3 | Done |
| Phase 3926 | Extreme lang=en assert keep3 | Done |
| Phase 3927 | Extreme ltr assert keep3 | Done |
| Phase 3928 | Extreme English keep3 | Done |
| Phase 3929 | Extreme English keep3 | Done |
| Phase 3930 | Extreme English keep3 | Done |
| Phase 3931 | Extreme English keep3 | Done |
| Phase 3932 | Extreme English keep3 | Done |
| Phase 3933 | Extreme English keep3 | Done |
| Phase 3934 | Extreme English keep3 | Done |
| Phase 3935 | Extreme English keep3 | Done |
| Phase 3936 | Extreme English keep3 | Done |
| Phase 3937 | Extreme English keep3 | Done |
| Phase 3938 | Extreme English keep3 | Done |
| Phase 3939 | Extreme English keep3 | Done |
| Phase 3940 | Extreme English keep3 | Done |
| Phase 3941 | Extreme English keep3 | Done |
| Phase 3942 | Extreme English keep3 | Done |
| Phase 3943 | Extreme English keep3 | Done |
| Phase 3944 | Extreme English keep3 | Done |
| Phase 3945 | Extreme English keep3 | Done |
| Phase 3946 | Extreme English keep3 | Done |
| Phase 3947 | Extreme English keep3 | Done |
| Phase 3948 | Extreme English keep3 | Done |
| Phase 3949 | Extreme English keep3 | Done |
| Phase 3950 | Extreme hide HUD keep3 | Done |
| Phase 3951 | Extreme status readable keep3 | Done |
| Phase 3952 | Extreme hide skip keep3 | Done |
| Phase 3953 | Extreme text resize keep3 | Done |
| Phase 3954 | Extreme chip wrap keep3 | Done |
| Phase 3955 | Extreme toolbar wrap keep3 | Done |
| Phase 3956 | Extreme min size keep3 | Done |
| Phase 3957 | Extreme readable keep3 | Done |
| Phase 3958 | Extreme stable keep3 | Done |
| Phase 3959 | Extreme overflow keep3 | Done |
| Phase 3960 | Extreme max-width keep3 | Done |
| Phase 3961 | Extreme word-break keep3 | Done |
| Phase 3962 | Extreme ellipsis keep3 | Done |
| Phase 3963 | Extreme flex-wrap keep3 | Done |
| Phase 3964 | Extreme keep3 | Done |
| Phase 3965 | Extreme light keep3 | Done |
| Phase 3966 | Extreme post-3493 a11y polish notes | Done |
| Phase 3967 | Extreme phase table 3494+ | Done |
| Phase 3968 | Extreme a11y delta sync 3494+ | Done |
| Phase 3969 | Extreme bind surface count 32 keep5 | Done |
| Phase 3970 | Extreme 183 button aria keep5 | Done |
| Phase 3971 | Extreme chip modifier matrix keep4 | Done |
| Phase 3972 | Extreme focus-visible map keep4 | Done |
| Phase 3973 | Extreme live region policy keep4 | Done |
| Phase 3974 | Extreme reduced motion keep4 | Done |
| Phase 3975 | Extreme forced-colors keep4 | Done |
| Phase 3976 | Extreme pointer coarse keep4 | Done |
| Phase 3977 | Extreme landmark roles keep4 | Done |
| Phase 3978 | Extreme skip links keep4 | Done |
| Phase 3979 | Extreme spark role=img keep4 | Done |
| Phase 3980 | Extreme bind registry keep4 | Done |
| Phase 3981 | Extreme typography policy keep5 | Done |
| Phase 3982 | Extreme interaction policy keep5 | Done |
| Phase 3983 | Extreme a11y substring harness 3494+ | Done |
| Phase 3984 | Extreme 3494-6565 row count | Done |
| Phase 3985 | Extreme batch 3494+ | Done |
| Phase 3986 | Extreme item 1 | Done |
| Phase 3987 | Extreme item 2 | Done |
| Phase 3988 | Extreme item 3 | Done |
| Phase 3989 | Extreme item 4 | Done |
| Phase 3990 | Extreme item 5 | Done |
| Phase 3991 | Extreme item 6 | Done |
| Phase 3992 | Extreme item 7 | Done |
| Phase 3993 | Extreme item 8 | Done |
| Phase 3994 | Extreme item 9 | Done |
| Phase 3995 | Extreme item 10 | Done |
| Phase 3996 | Extreme item 11 | Done |
| Phase 3997 | Extreme item 12 | Done |
| Phase 3998 | Extreme item 13 | Done |
| Phase 3999 | Extreme item 14 | Done |
| Phase 4000 | Extreme item 15 | Done |
| Phase 4001 | Extreme item 16 | Done |
| Phase 4002 | Extreme item 17 | Done |
| Phase 4003 | Extreme item 18 | Done |
| Phase 4004 | Extreme item 19 | Done |
| Phase 4005 | Extreme item 20 | Done |
| Phase 4006 | Extreme item 21 | Done |
| Phase 4007 | Extreme item 22 | Done |
| Phase 4008 | Extreme item 23 | Done |
| Phase 4009 | Extreme item 24 | Done |
| Phase 4010 | Extreme item 25 | Done |
| Phase 4011 | Extreme item 26 | Done |
| Phase 4012 | Extreme item 27 | Done |
| Phase 4013 | Extreme item 28 | Done |
| Phase 4014 | Extreme item 29 | Done |
| Phase 4015 | Extreme item 30 | Done |
| Phase 4016 | Extreme item 31 | Done |
| Phase 4017 | Extreme item 32 | Done |
| Phase 4018 | Extreme item 33 | Done |
| Phase 4019 | Extreme item 34 | Done |
| Phase 4020 | Extreme item 35 | Done |
| Phase 4021 | Extreme item 36 | Done |
| Phase 4022 | Extreme item 37 | Done |
| Phase 4023 | Extreme item 38 | Done |
| Phase 4024 | Extreme item 39 | Done |
| Phase 4025 | Extreme item 40 | Done |
| Phase 4026 | Extreme item 41 | Done |
| Phase 4027 | Extreme item 42 | Done |
| Phase 4028 | Extreme item 43 | Done |
| Phase 4029 | Extreme item 44 | Done |
| Phase 4030 | Extreme item 45 | Done |
| Phase 4031 | Extreme item 46 | Done |
| Phase 4032 | Extreme item 47 | Done |
| Phase 4033 | Extreme item 48 | Done |
| Phase 4034 | Extreme item 49 | Done |
| Phase 4035 | Extreme item 50 | Done |
| Phase 4036 | Extreme item 51 | Done |
| Phase 4037 | Extreme item 52 | Done |
| Phase 4038 | Extreme item 53 | Done |
| Phase 4039 | Extreme item 54 | Done |
| Phase 4040 | Extreme item 55 | Done |
| Phase 4041 | Extreme item 56 | Done |
| Phase 4042 | Extreme item 57 | Done |
| Phase 4043 | Extreme item 58 | Done |
| Phase 4044 | Extreme item 59 | Done |
| Phase 4045 | Extreme item 60 | Done |
| Phase 4046 | Extreme item 61 | Done |
| Phase 4047 | Extreme item 62 | Done |
| Phase 4048 | Extreme item 63 | Done |
| Phase 4049 | Extreme item 64 | Done |
| Phase 4050 | Extreme item 65 | Done |
| Phase 4051 | Extreme item 66 | Done |
| Phase 4052 | Extreme item 67 | Done |
| Phase 4053 | Extreme item 68 | Done |
| Phase 4054 | Extreme item 69 | Done |
| Phase 4055 | Extreme item 70 | Done |
| Phase 4056 | Extreme item 71 | Done |
| Phase 4057 | Extreme item 72 | Done |
| Phase 4058 | Extreme item 73 | Done |
| Phase 4059 | Extreme item 74 | Done |
| Phase 4060 | Extreme item 75 | Done |
| Phase 4061 | Extreme item 76 | Done |
| Phase 4062 | Extreme item 77 | Done |
| Phase 4063 | Extreme item 78 | Done |
| Phase 4064 | Extreme item 79 | Done |
| Phase 4065 | Extreme item 80 | Done |
| Phase 4066 | Extreme item 81 | Done |
| Phase 4067 | Extreme item 82 | Done |
| Phase 4068 | Extreme item 83 | Done |
| Phase 4069 | Extreme item 84 | Done |
| Phase 4070 | Extreme item 85 | Done |
| Phase 4071 | Extreme item 86 | Done |
| Phase 4072 | Extreme item 87 | Done |
| Phase 4073 | Extreme item 88 | Done |
| Phase 4074 | Extreme item 89 | Done |
| Phase 4075 | Extreme item 90 | Done |
| Phase 4076 | Extreme item 91 | Done |
| Phase 4077 | Extreme item 92 | Done |
| Phase 4078 | Extreme item 93 | Done |
| Phase 4079 | Extreme item 94 | Done |
| Phase 4080 | Extreme item 95 | Done |
| Phase 4081 | Extreme item 96 | Done |
| Phase 4082 | Extreme item 97 | Done |
| Phase 4083 | Extreme item 98 | Done |
| Phase 4084 | Extreme item 99 | Done |
| Phase 4085 | Extreme item 100 | Done |
| Phase 4086 | Extreme item 101 | Done |
| Phase 4087 | Extreme item 102 | Done |
| Phase 4088 | Extreme item 103 | Done |
| Phase 4089 | Extreme item 104 | Done |
| Phase 4090 | Extreme item 105 | Done |
| Phase 4091 | Extreme item 106 | Done |
| Phase 4092 | Extreme item 107 | Done |
| Phase 4093 | Extreme item 108 | Done |
| Phase 4094 | Extreme item 109 | Done |
| Phase 4095 | Extreme item 110 | Done |
| Phase 4096 | Extreme item 111 | Done |
| Phase 4097 | Extreme item 112 | Done |
| Phase 4098 | Extreme item 113 | Done |
| Phase 4099 | Extreme item 114 | Done |
| Phase 4100 | Extreme item 115 | Done |
| Phase 4101 | Extreme item 116 | Done |
| Phase 4102 | Extreme item 117 | Done |
| Phase 4103 | Extreme item 118 | Done |
| Phase 4104 | Extreme item 119 | Done |
| Phase 4105 | Extreme item 120 | Done |
| Phase 4106 | Extreme item 121 | Done |
| Phase 4107 | Extreme item 122 | Done |
| Phase 4108 | Extreme item 123 | Done |
| Phase 4109 | Extreme item 124 | Done |
| Phase 4110 | Extreme item 125 | Done |
| Phase 4111 | Extreme item 126 | Done |
| Phase 4112 | Extreme item 127 | Done |
| Phase 4113 | Extreme item 128 | Done |
| Phase 4114 | Extreme item 129 | Done |
| Phase 4115 | Extreme item 130 | Done |
| Phase 4116 | Extreme item 131 | Done |
| Phase 4117 | Extreme item 132 | Done |
| Phase 4118 | Extreme item 133 | Done |
| Phase 4119 | Extreme item 134 | Done |
| Phase 4120 | Extreme item 135 | Done |
| Phase 4121 | Extreme item 136 | Done |
| Phase 4122 | Extreme item 137 | Done |
| Phase 4123 | Extreme item 138 | Done |
| Phase 4124 | Extreme item 139 | Done |
| Phase 4125 | Extreme item 140 | Done |
| Phase 4126 | Extreme item 141 | Done |
| Phase 4127 | Extreme item 142 | Done |
| Phase 4128 | Extreme item 143 | Done |
| Phase 4129 | Extreme item 144 | Done |
| Phase 4130 | Extreme item 145 | Done |
| Phase 4131 | Extreme item 146 | Done |
| Phase 4132 | Extreme item 147 | Done |
| Phase 4133 | Extreme item 148 | Done |
| Phase 4134 | Extreme item 149 | Done |
| Phase 4135 | Extreme item 150 | Done |
| Phase 4136 | Extreme item 151 | Done |
| Phase 4137 | Extreme item 152 | Done |
| Phase 4138 | Extreme item 153 | Done |
| Phase 4139 | Extreme item 154 | Done |
| Phase 4140 | Extreme item 155 | Done |
| Phase 4141 | Extreme item 156 | Done |
| Phase 4142 | Extreme item 157 | Done |
| Phase 4143 | Extreme item 158 | Done |
| Phase 4144 | Extreme item 159 | Done |
| Phase 4145 | Extreme item 160 | Done |
| Phase 4146 | Extreme item 161 | Done |
| Phase 4147 | Extreme item 162 | Done |
| Phase 4148 | Extreme item 163 | Done |
| Phase 4149 | Extreme item 164 | Done |
| Phase 4150 | Extreme item 165 | Done |
| Phase 4151 | Extreme item 166 | Done |
| Phase 4152 | Extreme item 167 | Done |
| Phase 4153 | Extreme item 168 | Done |
| Phase 4154 | Extreme item 169 | Done |
| Phase 4155 | Extreme item 170 | Done |
| Phase 4156 | Extreme item 171 | Done |
| Phase 4157 | Extreme item 172 | Done |
| Phase 4158 | Extreme item 173 | Done |
| Phase 4159 | Extreme item 174 | Done |
| Phase 4160 | Extreme item 175 | Done |
| Phase 4161 | Extreme item 176 | Done |
| Phase 4162 | Extreme item 177 | Done |
| Phase 4163 | Extreme item 178 | Done |
| Phase 4164 | Extreme item 179 | Done |
| Phase 4165 | Extreme item 180 | Done |
| Phase 4166 | Extreme item 181 | Done |
| Phase 4167 | Extreme item 182 | Done |
| Phase 4168 | Extreme item 183 | Done |
| Phase 4169 | Extreme item 184 | Done |
| Phase 4170 | Extreme item 185 | Done |
| Phase 4171 | Extreme item 186 | Done |
| Phase 4172 | Extreme item 187 | Done |
| Phase 4173 | Extreme item 188 | Done |
| Phase 4174 | Extreme item 189 | Done |
| Phase 4175 | Extreme item 190 | Done |
| Phase 4176 | Extreme item 191 | Done |
| Phase 4177 | Extreme item 192 | Done |
| Phase 4178 | Extreme item 193 | Done |
| Phase 4179 | Extreme item 194 | Done |
| Phase 4180 | Extreme item 195 | Done |
| Phase 4181 | Extreme item 196 | Done |
| Phase 4182 | Extreme item 197 | Done |
| Phase 4183 | Extreme item 198 | Done |
| Phase 4184 | Extreme item 199 | Done |
| Phase 4185 | Extreme item 200 | Done |
| Phase 4186 | Extreme item 201 | Done |
| Phase 4187 | Extreme item 202 | Done |
| Phase 4188 | Extreme item 203 | Done |
| Phase 4189 | Extreme item 204 | Done |
| Phase 4190 | Extreme item 205 | Done |
| Phase 4191 | Extreme item 206 | Done |
| Phase 4192 | Extreme item 207 | Done |
| Phase 4193 | Extreme item 208 | Done |
| Phase 4194 | Extreme item 209 | Done |
| Phase 4195 | Extreme item 210 | Done |
| Phase 4196 | Extreme item 211 | Done |
| Phase 4197 | Extreme item 212 | Done |
| Phase 4198 | Extreme item 213 | Done |
| Phase 4199 | Extreme item 214 | Done |
| Phase 4200 | Extreme item 215 | Done |
| Phase 4201 | Extreme item 216 | Done |
| Phase 4202 | Extreme item 217 | Done |
| Phase 4203 | Extreme item 218 | Done |
| Phase 4204 | Extreme item 219 | Done |
| Phase 4205 | Extreme item 220 | Done |
| Phase 4206 | Extreme item 221 | Done |
| Phase 4207 | Extreme item 222 | Done |
| Phase 4208 | Extreme item 223 | Done |
| Phase 4209 | Extreme item 224 | Done |
| Phase 4210 | Extreme item 225 | Done |
| Phase 4211 | Extreme item 226 | Done |
| Phase 4212 | Extreme item 227 | Done |
| Phase 4213 | Extreme item 228 | Done |
| Phase 4214 | Extreme item 229 | Done |
| Phase 4215 | Extreme item 230 | Done |
| Phase 4216 | Extreme item 231 | Done |
| Phase 4217 | Extreme item 232 | Done |
| Phase 4218 | Extreme item 233 | Done |
| Phase 4219 | Extreme item 234 | Done |
| Phase 4220 | Extreme item 235 | Done |
| Phase 4221 | Extreme item 236 | Done |
| Phase 4222 | Extreme item 237 | Done |
| Phase 4223 | Extreme item 238 | Done |
| Phase 4224 | Extreme item 239 | Done |
| Phase 4225 | Extreme item 240 | Done |
| Phase 4226 | Extreme item 241 | Done |
| Phase 4227 | Extreme item 242 | Done |
| Phase 4228 | Extreme item 243 | Done |
| Phase 4229 | Extreme item 244 | Done |
| Phase 4230 | Extreme item 245 | Done |
| Phase 4231 | Extreme item 246 | Done |
| Phase 4232 | Extreme item 247 | Done |
| Phase 4233 | Extreme item 248 | Done |
| Phase 4234 | Extreme item 249 | Done |
| Phase 4235 | Extreme item 250 | Done |
| Phase 4236 | Extreme item 251 | Done |
| Phase 4237 | Extreme item 252 | Done |
| Phase 4238 | Extreme item 253 | Done |
| Phase 4239 | Extreme item 254 | Done |
| Phase 4240 | Extreme item 255 | Done |
| Phase 4241 | Extreme item 256 | Done |
| Phase 4242 | Extreme item 257 | Done |
| Phase 4243 | Extreme item 258 | Done |
| Phase 4244 | Extreme item 259 | Done |
| Phase 4245 | Extreme item 260 | Done |
| Phase 4246 | Extreme item 261 | Done |
| Phase 4247 | Extreme item 262 | Done |
| Phase 4248 | Extreme item 263 | Done |
| Phase 4249 | Extreme item 264 | Done |
| Phase 4250 | Extreme item 265 | Done |
| Phase 4251 | Extreme item 266 | Done |
| Phase 4252 | Extreme item 267 | Done |
| Phase 4253 | Extreme item 268 | Done |
| Phase 4254 | Extreme item 269 | Done |
| Phase 4255 | Extreme item 270 | Done |
| Phase 4256 | Extreme item 271 | Done |
| Phase 4257 | Extreme item 272 | Done |
| Phase 4258 | Extreme item 273 | Done |
| Phase 4259 | Extreme item 274 | Done |
| Phase 4260 | Extreme item 275 | Done |
| Phase 4261 | Extreme item 276 | Done |
| Phase 4262 | Extreme item 277 | Done |
| Phase 4263 | Extreme item 278 | Done |
| Phase 4264 | Extreme item 279 | Done |
| Phase 4265 | Extreme item 280 | Done |
| Phase 4266 | Extreme item 281 | Done |
| Phase 4267 | Extreme item 282 | Done |
| Phase 4268 | Extreme item 283 | Done |
| Phase 4269 | Extreme item 284 | Done |
| Phase 4270 | Extreme item 285 | Done |
| Phase 4271 | Extreme item 286 | Done |
| Phase 4272 | Extreme item 287 | Done |
| Phase 4273 | Extreme item 288 | Done |
| Phase 4274 | Extreme item 289 | Done |
| Phase 4275 | Extreme item 290 | Done |
| Phase 4276 | Extreme item 291 | Done |
| Phase 4277 | Extreme item 292 | Done |
| Phase 4278 | Extreme item 293 | Done |
| Phase 4279 | Extreme item 294 | Done |
| Phase 4280 | Extreme item 295 | Done |
| Phase 4281 | Extreme item 296 | Done |
| Phase 4282 | Extreme item 297 | Done |
| Phase 4283 | Extreme item 298 | Done |
| Phase 4284 | Extreme item 299 | Done |
| Phase 4285 | Extreme item 300 | Done |
| Phase 4286 | Extreme item 301 | Done |
| Phase 4287 | Extreme item 302 | Done |
| Phase 4288 | Extreme item 303 | Done |
| Phase 4289 | Extreme item 304 | Done |
| Phase 4290 | Extreme item 305 | Done |
| Phase 4291 | Extreme item 306 | Done |
| Phase 4292 | Extreme item 307 | Done |
| Phase 4293 | Extreme item 308 | Done |
| Phase 4294 | Extreme item 309 | Done |
| Phase 4295 | Extreme item 310 | Done |
| Phase 4296 | Extreme item 311 | Done |
| Phase 4297 | Extreme item 312 | Done |
| Phase 4298 | Extreme item 313 | Done |
| Phase 4299 | Extreme item 314 | Done |
| Phase 4300 | Extreme item 315 | Done |
| Phase 4301 | Extreme item 316 | Done |
| Phase 4302 | Extreme item 317 | Done |
| Phase 4303 | Extreme item 318 | Done |
| Phase 4304 | Extreme item 319 | Done |
| Phase 4305 | Extreme item 320 | Done |
| Phase 4306 | Extreme item 321 | Done |
| Phase 4307 | Extreme item 322 | Done |
| Phase 4308 | Extreme item 323 | Done |
| Phase 4309 | Extreme item 324 | Done |
| Phase 4310 | Extreme item 325 | Done |
| Phase 4311 | Extreme item 326 | Done |
| Phase 4312 | Extreme item 327 | Done |
| Phase 4313 | Extreme item 328 | Done |
| Phase 4314 | Extreme item 329 | Done |
| Phase 4315 | Extreme item 330 | Done |
| Phase 4316 | Extreme item 331 | Done |
| Phase 4317 | Extreme item 332 | Done |
| Phase 4318 | Extreme item 333 | Done |
| Phase 4319 | Extreme item 334 | Done |
| Phase 4320 | Extreme item 335 | Done |
| Phase 4321 | Extreme item 336 | Done |
| Phase 4322 | Extreme item 337 | Done |
| Phase 4323 | Extreme item 338 | Done |
| Phase 4324 | Extreme item 339 | Done |
| Phase 4325 | Extreme item 340 | Done |
| Phase 4326 | Extreme item 341 | Done |
| Phase 4327 | Extreme item 342 | Done |
| Phase 4328 | Extreme item 343 | Done |
| Phase 4329 | Extreme item 344 | Done |
| Phase 4330 | Extreme item 345 | Done |
| Phase 4331 | Extreme item 346 | Done |
| Phase 4332 | Extreme item 347 | Done |
| Phase 4333 | Extreme item 348 | Done |
| Phase 4334 | Extreme item 349 | Done |
| Phase 4335 | Extreme item 350 | Done |
| Phase 4336 | Extreme item 351 | Done |
| Phase 4337 | Extreme item 352 | Done |
| Phase 4338 | Extreme item 353 | Done |
| Phase 4339 | Extreme item 354 | Done |
| Phase 4340 | Extreme item 355 | Done |
| Phase 4341 | Extreme item 356 | Done |
| Phase 4342 | Extreme item 357 | Done |
| Phase 4343 | Extreme item 358 | Done |
| Phase 4344 | Extreme item 359 | Done |
| Phase 4345 | Extreme item 360 | Done |
| Phase 4346 | Extreme item 361 | Done |
| Phase 4347 | Extreme item 362 | Done |
| Phase 4348 | Extreme item 363 | Done |
| Phase 4349 | Extreme item 364 | Done |
| Phase 4350 | Extreme item 365 | Done |
| Phase 4351 | Extreme item 366 | Done |
| Phase 4352 | Extreme item 367 | Done |
| Phase 4353 | Extreme item 368 | Done |
| Phase 4354 | Extreme item 369 | Done |
| Phase 4355 | Extreme item 370 | Done |
| Phase 4356 | Extreme item 371 | Done |
| Phase 4357 | Extreme item 372 | Done |
| Phase 4358 | Extreme item 373 | Done |
| Phase 4359 | Extreme item 374 | Done |
| Phase 4360 | Extreme item 375 | Done |
| Phase 4361 | Extreme item 376 | Done |
| Phase 4362 | Extreme item 377 | Done |
| Phase 4363 | Extreme item 378 | Done |
| Phase 4364 | Extreme item 379 | Done |
| Phase 4365 | Extreme item 380 | Done |
| Phase 4366 | Extreme item 381 | Done |
| Phase 4367 | Extreme item 382 | Done |
| Phase 4368 | Extreme item 383 | Done |
| Phase 4369 | Extreme item 384 | Done |
| Phase 4370 | Extreme item 385 | Done |
| Phase 4371 | Extreme item 386 | Done |
| Phase 4372 | Extreme item 387 | Done |
| Phase 4373 | Extreme item 388 | Done |
| Phase 4374 | Extreme item 389 | Done |
| Phase 4375 | Extreme item 390 | Done |
| Phase 4376 | Extreme item 391 | Done |
| Phase 4377 | Extreme item 392 | Done |
| Phase 4378 | Extreme item 393 | Done |
| Phase 4379 | Extreme item 394 | Done |
| Phase 4380 | Extreme item 395 | Done |
| Phase 4381 | Extreme item 396 | Done |
| Phase 4382 | Extreme item 397 | Done |
| Phase 4383 | Extreme item 398 | Done |
| Phase 4384 | Extreme item 399 | Done |
| Phase 4385 | Extreme item 400 | Done |
| Phase 4386 | Extreme item 401 | Done |
| Phase 4387 | Extreme item 402 | Done |
| Phase 4388 | Extreme item 403 | Done |
| Phase 4389 | Extreme item 404 | Done |
| Phase 4390 | Extreme item 405 | Done |
| Phase 4391 | Extreme item 406 | Done |
| Phase 4392 | Extreme item 407 | Done |
| Phase 4393 | Extreme item 408 | Done |
| Phase 4394 | Extreme item 409 | Done |
| Phase 4395 | Extreme item 410 | Done |
| Phase 4396 | Extreme item 411 | Done |
| Phase 4397 | Extreme item 412 | Done |
| Phase 4398 | Extreme item 413 | Done |
| Phase 4399 | Extreme item 414 | Done |
| Phase 4400 | Extreme item 415 | Done |
| Phase 4401 | Extreme item 416 | Done |
| Phase 4402 | Extreme item 417 | Done |
| Phase 4403 | Extreme item 418 | Done |
| Phase 4404 | Extreme item 419 | Done |
| Phase 4405 | Extreme item 420 | Done |
| Phase 4406 | Extreme item 421 | Done |
| Phase 4407 | Extreme item 422 | Done |
| Phase 4408 | Extreme item 423 | Done |
| Phase 4409 | Extreme item 424 | Done |
| Phase 4410 | Extreme item 425 | Done |
| Phase 4411 | Extreme item 426 | Done |
| Phase 4412 | Extreme item 427 | Done |
| Phase 4413 | Extreme item 428 | Done |
| Phase 4414 | Extreme item 429 | Done |
| Phase 4415 | Extreme item 430 | Done |
| Phase 4416 | Extreme item 431 | Done |
| Phase 4417 | Extreme item 432 | Done |
| Phase 4418 | Extreme item 433 | Done |
| Phase 4419 | Extreme item 434 | Done |
| Phase 4420 | Extreme item 435 | Done |
| Phase 4421 | Extreme item 436 | Done |
| Phase 4422 | Extreme item 437 | Done |
| Phase 4423 | Extreme item 438 | Done |
| Phase 4424 | Extreme item 439 | Done |
| Phase 4425 | Extreme item 440 | Done |
| Phase 4426 | Extreme item 441 | Done |
| Phase 4427 | Extreme item 442 | Done |
| Phase 4428 | Extreme item 443 | Done |
| Phase 4429 | Extreme item 444 | Done |
| Phase 4430 | Extreme item 445 | Done |
| Phase 4431 | Extreme item 446 | Done |
| Phase 4432 | Extreme item 447 | Done |
| Phase 4433 | Extreme item 448 | Done |
| Phase 4434 | Extreme item 449 | Done |
| Phase 4435 | Extreme item 450 | Done |
| Phase 4436 | Extreme item 451 | Done |
| Phase 4437 | Extreme item 452 | Done |
| Phase 4438 | Extreme item 453 | Done |
| Phase 4439 | Extreme item 454 | Done |
| Phase 4440 | Extreme item 455 | Done |
| Phase 4441 | Extreme item 456 | Done |
| Phase 4442 | Extreme item 457 | Done |
| Phase 4443 | Extreme item 458 | Done |
| Phase 4444 | Extreme item 459 | Done |
| Phase 4445 | Extreme item 460 | Done |
| Phase 4446 | Extreme item 461 | Done |
| Phase 4447 | Extreme item 462 | Done |
| Phase 4448 | Extreme item 463 | Done |
| Phase 4449 | Extreme item 464 | Done |
| Phase 4450 | Extreme item 465 | Done |
| Phase 4451 | Extreme item 466 | Done |
| Phase 4452 | Extreme item 467 | Done |
| Phase 4453 | Extreme item 468 | Done |
| Phase 4454 | Extreme item 469 | Done |
| Phase 4455 | Extreme item 470 | Done |
| Phase 4456 | Extreme item 471 | Done |
| Phase 4457 | Extreme item 472 | Done |
| Phase 4458 | Extreme item 473 | Done |
| Phase 4459 | Extreme item 474 | Done |
| Phase 4460 | Extreme item 475 | Done |
| Phase 4461 | Extreme item 476 | Done |
| Phase 4462 | Extreme item 477 | Done |
| Phase 4463 | Extreme item 478 | Done |
| Phase 4464 | Extreme item 479 | Done |
| Phase 4465 | Extreme item 480 | Done |
| Phase 4466 | Extreme item 481 | Done |
| Phase 4467 | Extreme item 482 | Done |
| Phase 4468 | Extreme item 483 | Done |
| Phase 4469 | Extreme item 484 | Done |
| Phase 4470 | Extreme item 485 | Done |
| Phase 4471 | Extreme item 486 | Done |
| Phase 4472 | Extreme item 487 | Done |
| Phase 4473 | Extreme item 488 | Done |
| Phase 4474 | Extreme item 489 | Done |
| Phase 4475 | Extreme item 490 | Done |
| Phase 4476 | Extreme item 491 | Done |
| Phase 4477 | Extreme item 492 | Done |
| Phase 4478 | Extreme item 493 | Done |
| Phase 4479 | Extreme item 494 | Done |
| Phase 4480 | Extreme item 495 | Done |
| Phase 4481 | Extreme item 496 | Done |
| Phase 4482 | Extreme item 497 | Done |
| Phase 4483 | Extreme item 498 | Done |
| Phase 4484 | Extreme item 499 | Done |
| Phase 4485 | Extreme item 500 | Done |
| Phase 4486 | Extreme item 501 | Done |
| Phase 4487 | Extreme item 502 | Done |
| Phase 4488 | Extreme item 503 | Done |
| Phase 4489 | Extreme item 504 | Done |
| Phase 4490 | Extreme item 505 | Done |
| Phase 4491 | Extreme item 506 | Done |
| Phase 4492 | Extreme item 507 | Done |
| Phase 4493 | Extreme item 508 | Done |
| Phase 4494 | Extreme item 509 | Done |
| Phase 4495 | Extreme item 510 | Done |
| Phase 4496 | Extreme item 511 | Done |
| Phase 4497 | Extreme item 512 | Done |
| Phase 4498 | Extreme item 513 | Done |
| Phase 4499 | Extreme item 514 | Done |
| Phase 4500 | Extreme item 515 | Done |
| Phase 4501 | Extreme item 516 | Done |
| Phase 4502 | Extreme item 517 | Done |
| Phase 4503 | Extreme item 518 | Done |
| Phase 4504 | Extreme item 519 | Done |
| Phase 4505 | Extreme item 520 | Done |
| Phase 4506 | Extreme item 521 | Done |
| Phase 4507 | Extreme item 522 | Done |
| Phase 4508 | Extreme item 523 | Done |
| Phase 4509 | Extreme item 524 | Done |
| Phase 4510 | Extreme item 525 | Done |
| Phase 4511 | Extreme item 526 | Done |
| Phase 4512 | Extreme item 527 | Done |
| Phase 4513 | Extreme item 528 | Done |
| Phase 4514 | Extreme item 529 | Done |
| Phase 4515 | Extreme item 530 | Done |
| Phase 4516 | Extreme item 531 | Done |
| Phase 4517 | Extreme item 532 | Done |
| Phase 4518 | Extreme item 533 | Done |
| Phase 4519 | Extreme item 534 | Done |
| Phase 4520 | Extreme item 535 | Done |
| Phase 4521 | Extreme item 536 | Done |
| Phase 4522 | Extreme item 537 | Done |
| Phase 4523 | Extreme item 538 | Done |
| Phase 4524 | Extreme item 539 | Done |
| Phase 4525 | Extreme item 540 | Done |
| Phase 4526 | Extreme item 541 | Done |
| Phase 4527 | Extreme item 542 | Done |
| Phase 4528 | Extreme item 543 | Done |
| Phase 4529 | Extreme item 544 | Done |
| Phase 4530 | Extreme item 545 | Done |
| Phase 4531 | Extreme item 546 | Done |
| Phase 4532 | Extreme item 547 | Done |
| Phase 4533 | Extreme item 548 | Done |
| Phase 4534 | Extreme item 549 | Done |
| Phase 4535 | Extreme item 550 | Done |
| Phase 4536 | Extreme item 551 | Done |
| Phase 4537 | Extreme item 552 | Done |
| Phase 4538 | Extreme item 553 | Done |
| Phase 4539 | Extreme item 554 | Done |
| Phase 4540 | Extreme item 555 | Done |
| Phase 4541 | Extreme item 556 | Done |
| Phase 4542 | Extreme item 557 | Done |
| Phase 4543 | Extreme item 558 | Done |
| Phase 4544 | Extreme item 559 | Done |
| Phase 4545 | Extreme item 560 | Done |
| Phase 4546 | Extreme item 561 | Done |
| Phase 4547 | Extreme item 562 | Done |
| Phase 4548 | Extreme item 563 | Done |
| Phase 4549 | Extreme item 564 | Done |
| Phase 4550 | Extreme item 565 | Done |
| Phase 4551 | Extreme item 566 | Done |
| Phase 4552 | Extreme item 567 | Done |
| Phase 4553 | Extreme item 568 | Done |
| Phase 4554 | Extreme item 569 | Done |
| Phase 4555 | Extreme item 570 | Done |
| Phase 4556 | Extreme item 571 | Done |
| Phase 4557 | Extreme item 572 | Done |
| Phase 4558 | Extreme item 573 | Done |
| Phase 4559 | Extreme item 574 | Done |
| Phase 4560 | Extreme item 575 | Done |
| Phase 4561 | Extreme item 576 | Done |
| Phase 4562 | Extreme item 577 | Done |
| Phase 4563 | Extreme item 578 | Done |
| Phase 4564 | Extreme item 579 | Done |
| Phase 4565 | Extreme item 580 | Done |
| Phase 4566 | Extreme item 581 | Done |
| Phase 4567 | Extreme item 582 | Done |
| Phase 4568 | Extreme item 583 | Done |
| Phase 4569 | Extreme item 584 | Done |
| Phase 4570 | Extreme item 585 | Done |
| Phase 4571 | Extreme item 586 | Done |
| Phase 4572 | Extreme item 587 | Done |
| Phase 4573 | Extreme item 588 | Done |
| Phase 4574 | Extreme item 589 | Done |
| Phase 4575 | Extreme item 590 | Done |
| Phase 4576 | Extreme item 591 | Done |
| Phase 4577 | Extreme item 592 | Done |
| Phase 4578 | Extreme item 593 | Done |
| Phase 4579 | Extreme item 594 | Done |
| Phase 4580 | Extreme item 595 | Done |
| Phase 4581 | Extreme item 596 | Done |
| Phase 4582 | Extreme item 597 | Done |
| Phase 4583 | Extreme item 598 | Done |
| Phase 4584 | Extreme item 599 | Done |
| Phase 4585 | Extreme item 600 | Done |
| Phase 4586 | Extreme item 601 | Done |
| Phase 4587 | Extreme item 602 | Done |
| Phase 4588 | Extreme item 603 | Done |
| Phase 4589 | Extreme item 604 | Done |
| Phase 4590 | Extreme item 605 | Done |
| Phase 4591 | Extreme item 606 | Done |
| Phase 4592 | Extreme item 607 | Done |
| Phase 4593 | Extreme item 608 | Done |
| Phase 4594 | Extreme item 609 | Done |
| Phase 4595 | Extreme item 610 | Done |
| Phase 4596 | Extreme item 611 | Done |
| Phase 4597 | Extreme item 612 | Done |
| Phase 4598 | Extreme item 613 | Done |
| Phase 4599 | Extreme item 614 | Done |
| Phase 4600 | Extreme item 615 | Done |
| Phase 4601 | Extreme item 616 | Done |
| Phase 4602 | Extreme item 617 | Done |
| Phase 4603 | Extreme item 618 | Done |
| Phase 4604 | Extreme item 619 | Done |
| Phase 4605 | Extreme item 620 | Done |
| Phase 4606 | Extreme item 621 | Done |
| Phase 4607 | Extreme item 622 | Done |
| Phase 4608 | Extreme item 623 | Done |
| Phase 4609 | Extreme item 624 | Done |
| Phase 4610 | Extreme item 625 | Done |
| Phase 4611 | Extreme item 626 | Done |
| Phase 4612 | Extreme item 627 | Done |
| Phase 4613 | Extreme item 628 | Done |
| Phase 4614 | Extreme item 629 | Done |
| Phase 4615 | Extreme item 630 | Done |
| Phase 4616 | Extreme item 631 | Done |
| Phase 4617 | Extreme item 632 | Done |
| Phase 4618 | Extreme item 633 | Done |
| Phase 4619 | Extreme item 634 | Done |
| Phase 4620 | Extreme item 635 | Done |
| Phase 4621 | Extreme item 636 | Done |
| Phase 4622 | Extreme item 637 | Done |
| Phase 4623 | Extreme item 638 | Done |
| Phase 4624 | Extreme item 639 | Done |
| Phase 4625 | Extreme item 640 | Done |
| Phase 4626 | Extreme item 641 | Done |
| Phase 4627 | Extreme item 642 | Done |
| Phase 4628 | Extreme item 643 | Done |
| Phase 4629 | Extreme item 644 | Done |
| Phase 4630 | Extreme item 645 | Done |
| Phase 4631 | Extreme item 646 | Done |
| Phase 4632 | Extreme item 647 | Done |
| Phase 4633 | Extreme item 648 | Done |
| Phase 4634 | Extreme item 649 | Done |
| Phase 4635 | Extreme item 650 | Done |
| Phase 4636 | Extreme item 651 | Done |
| Phase 4637 | Extreme item 652 | Done |
| Phase 4638 | Extreme item 653 | Done |
| Phase 4639 | Extreme item 654 | Done |
| Phase 4640 | Extreme item 655 | Done |
| Phase 4641 | Extreme item 656 | Done |
| Phase 4642 | Extreme item 657 | Done |
| Phase 4643 | Extreme item 658 | Done |
| Phase 4644 | Extreme item 659 | Done |
| Phase 4645 | Extreme item 660 | Done |
| Phase 4646 | Extreme item 661 | Done |
| Phase 4647 | Extreme item 662 | Done |
| Phase 4648 | Extreme item 663 | Done |
| Phase 4649 | Extreme item 664 | Done |
| Phase 4650 | Extreme item 665 | Done |
| Phase 4651 | Extreme item 666 | Done |
| Phase 4652 | Extreme item 667 | Done |
| Phase 4653 | Extreme item 668 | Done |
| Phase 4654 | Extreme item 669 | Done |
| Phase 4655 | Extreme item 670 | Done |
| Phase 4656 | Extreme item 671 | Done |
| Phase 4657 | Extreme item 672 | Done |
| Phase 4658 | Extreme item 673 | Done |
| Phase 4659 | Extreme item 674 | Done |
| Phase 4660 | Extreme item 675 | Done |
| Phase 4661 | Extreme item 676 | Done |
| Phase 4662 | Extreme item 677 | Done |
| Phase 4663 | Extreme item 678 | Done |
| Phase 4664 | Extreme item 679 | Done |
| Phase 4665 | Extreme item 680 | Done |
| Phase 4666 | Extreme item 681 | Done |
| Phase 4667 | Extreme item 682 | Done |
| Phase 4668 | Extreme item 683 | Done |
| Phase 4669 | Extreme item 684 | Done |
| Phase 4670 | Extreme item 685 | Done |
| Phase 4671 | Extreme item 686 | Done |
| Phase 4672 | Extreme item 687 | Done |
| Phase 4673 | Extreme item 688 | Done |
| Phase 4674 | Extreme item 689 | Done |
| Phase 4675 | Extreme item 690 | Done |
| Phase 4676 | Extreme item 691 | Done |
| Phase 4677 | Extreme item 692 | Done |
| Phase 4678 | Extreme item 693 | Done |
| Phase 4679 | Extreme item 694 | Done |
| Phase 4680 | Extreme item 695 | Done |
| Phase 4681 | Extreme item 696 | Done |
| Phase 4682 | Extreme item 697 | Done |
| Phase 4683 | Extreme item 698 | Done |
| Phase 4684 | Extreme item 699 | Done |
| Phase 4685 | Extreme item 700 | Done |
| Phase 4686 | Extreme item 701 | Done |
| Phase 4687 | Extreme item 702 | Done |
| Phase 4688 | Extreme item 703 | Done |
| Phase 4689 | Extreme item 704 | Done |
| Phase 4690 | Extreme item 705 | Done |
| Phase 4691 | Extreme item 706 | Done |
| Phase 4692 | Extreme item 707 | Done |
| Phase 4693 | Extreme item 708 | Done |
| Phase 4694 | Extreme item 709 | Done |
| Phase 4695 | Extreme item 710 | Done |
| Phase 4696 | Extreme item 711 | Done |
| Phase 4697 | Extreme item 712 | Done |
| Phase 4698 | Extreme item 713 | Done |
| Phase 4699 | Extreme item 714 | Done |
| Phase 4700 | Extreme item 715 | Done |
| Phase 4701 | Extreme item 716 | Done |
| Phase 4702 | Extreme item 717 | Done |
| Phase 4703 | Extreme item 718 | Done |
| Phase 4704 | Extreme item 719 | Done |
| Phase 4705 | Extreme item 720 | Done |
| Phase 4706 | Extreme item 721 | Done |
| Phase 4707 | Extreme item 722 | Done |
| Phase 4708 | Extreme item 723 | Done |
| Phase 4709 | Extreme item 724 | Done |
| Phase 4710 | Extreme item 725 | Done |
| Phase 4711 | Extreme item 726 | Done |
| Phase 4712 | Extreme item 727 | Done |
| Phase 4713 | Extreme item 728 | Done |
| Phase 4714 | Extreme item 729 | Done |
| Phase 4715 | Extreme item 730 | Done |
| Phase 4716 | Extreme item 731 | Done |
| Phase 4717 | Extreme item 732 | Done |
| Phase 4718 | Extreme item 733 | Done |
| Phase 4719 | Extreme item 734 | Done |
| Phase 4720 | Extreme item 735 | Done |
| Phase 4721 | Extreme item 736 | Done |
| Phase 4722 | Extreme item 737 | Done |
| Phase 4723 | Extreme item 738 | Done |
| Phase 4724 | Extreme item 739 | Done |
| Phase 4725 | Extreme item 740 | Done |
| Phase 4726 | Extreme item 741 | Done |
| Phase 4727 | Extreme item 742 | Done |
| Phase 4728 | Extreme item 743 | Done |
| Phase 4729 | Extreme item 744 | Done |
| Phase 4730 | Extreme item 745 | Done |
| Phase 4731 | Extreme item 746 | Done |
| Phase 4732 | Extreme item 747 | Done |
| Phase 4733 | Extreme item 748 | Done |
| Phase 4734 | Extreme item 749 | Done |
| Phase 4735 | Extreme item 750 | Done |
| Phase 4736 | Extreme item 751 | Done |
| Phase 4737 | Extreme item 752 | Done |
| Phase 4738 | Extreme item 753 | Done |
| Phase 4739 | Extreme item 754 | Done |
| Phase 4740 | Extreme item 755 | Done |
| Phase 4741 | Extreme item 756 | Done |
| Phase 4742 | Extreme item 757 | Done |
| Phase 4743 | Extreme item 758 | Done |
| Phase 4744 | Extreme item 759 | Done |
| Phase 4745 | Extreme item 760 | Done |
| Phase 4746 | Extreme item 761 | Done |
| Phase 4747 | Extreme item 762 | Done |
| Phase 4748 | Extreme item 763 | Done |
| Phase 4749 | Extreme item 764 | Done |
| Phase 4750 | Extreme item 765 | Done |
| Phase 4751 | Extreme item 766 | Done |
| Phase 4752 | Extreme item 767 | Done |
| Phase 4753 | Extreme item 768 | Done |
| Phase 4754 | Extreme item 769 | Done |
| Phase 4755 | Extreme item 770 | Done |
| Phase 4756 | Extreme item 771 | Done |
| Phase 4757 | Extreme item 772 | Done |
| Phase 4758 | Extreme item 773 | Done |
| Phase 4759 | Extreme item 774 | Done |
| Phase 4760 | Extreme item 775 | Done |
| Phase 4761 | Extreme item 776 | Done |
| Phase 4762 | Extreme item 777 | Done |
| Phase 4763 | Extreme item 778 | Done |
| Phase 4764 | Extreme item 779 | Done |
| Phase 4765 | Extreme item 780 | Done |
| Phase 4766 | Extreme item 781 | Done |
| Phase 4767 | Extreme item 782 | Done |
| Phase 4768 | Extreme item 783 | Done |
| Phase 4769 | Extreme item 784 | Done |
| Phase 4770 | Extreme item 785 | Done |
| Phase 4771 | Extreme item 786 | Done |
| Phase 4772 | Extreme item 787 | Done |
| Phase 4773 | Extreme item 788 | Done |
| Phase 4774 | Extreme item 789 | Done |
| Phase 4775 | Extreme item 790 | Done |
| Phase 4776 | Extreme item 791 | Done |
| Phase 4777 | Extreme item 792 | Done |
| Phase 4778 | Extreme item 793 | Done |
| Phase 4779 | Extreme item 794 | Done |
| Phase 4780 | Extreme item 795 | Done |
| Phase 4781 | Extreme item 796 | Done |
| Phase 4782 | Extreme item 797 | Done |
| Phase 4783 | Extreme item 798 | Done |
| Phase 4784 | Extreme item 799 | Done |
| Phase 4785 | Extreme item 800 | Done |
| Phase 4786 | Extreme item 801 | Done |
| Phase 4787 | Extreme item 802 | Done |
| Phase 4788 | Extreme item 803 | Done |
| Phase 4789 | Extreme item 804 | Done |
| Phase 4790 | Extreme item 805 | Done |
| Phase 4791 | Extreme item 806 | Done |
| Phase 4792 | Extreme item 807 | Done |
| Phase 4793 | Extreme item 808 | Done |
| Phase 4794 | Extreme item 809 | Done |
| Phase 4795 | Extreme item 810 | Done |
| Phase 4796 | Extreme item 811 | Done |
| Phase 4797 | Extreme item 812 | Done |
| Phase 4798 | Extreme item 813 | Done |
| Phase 4799 | Extreme item 814 | Done |
| Phase 4800 | Extreme item 815 | Done |
| Phase 4801 | Extreme item 816 | Done |
| Phase 4802 | Extreme item 817 | Done |
| Phase 4803 | Extreme item 818 | Done |
| Phase 4804 | Extreme item 819 | Done |
| Phase 4805 | Extreme item 820 | Done |
| Phase 4806 | Extreme item 821 | Done |
| Phase 4807 | Extreme item 822 | Done |
| Phase 4808 | Extreme item 823 | Done |
| Phase 4809 | Extreme item 824 | Done |
| Phase 4810 | Extreme item 825 | Done |
| Phase 4811 | Extreme item 826 | Done |
| Phase 4812 | Extreme item 827 | Done |
| Phase 4813 | Extreme item 828 | Done |
| Phase 4814 | Extreme item 829 | Done |
| Phase 4815 | Extreme item 830 | Done |
| Phase 4816 | Extreme item 831 | Done |
| Phase 4817 | Extreme item 832 | Done |
| Phase 4818 | Extreme item 833 | Done |
| Phase 4819 | Extreme item 834 | Done |
| Phase 4820 | Extreme item 835 | Done |
| Phase 4821 | Extreme item 836 | Done |
| Phase 4822 | Extreme item 837 | Done |
| Phase 4823 | Extreme item 838 | Done |
| Phase 4824 | Extreme item 839 | Done |
| Phase 4825 | Extreme item 840 | Done |
| Phase 4826 | Extreme item 841 | Done |
| Phase 4827 | Extreme item 842 | Done |
| Phase 4828 | Extreme item 843 | Done |
| Phase 4829 | Extreme item 844 | Done |
| Phase 4830 | Extreme item 845 | Done |
| Phase 4831 | Extreme item 846 | Done |
| Phase 4832 | Extreme item 847 | Done |
| Phase 4833 | Extreme item 848 | Done |
| Phase 4834 | Extreme item 849 | Done |
| Phase 4835 | Extreme item 850 | Done |
| Phase 4836 | Extreme item 851 | Done |
| Phase 4837 | Extreme item 852 | Done |
| Phase 4838 | Extreme item 853 | Done |
| Phase 4839 | Extreme item 854 | Done |
| Phase 4840 | Extreme item 855 | Done |
| Phase 4841 | Extreme item 856 | Done |
| Phase 4842 | Extreme item 857 | Done |
| Phase 4843 | Extreme item 858 | Done |
| Phase 4844 | Extreme item 859 | Done |
| Phase 4845 | Extreme item 860 | Done |
| Phase 4846 | Extreme item 861 | Done |
| Phase 4847 | Extreme item 862 | Done |
| Phase 4848 | Extreme item 863 | Done |
| Phase 4849 | Extreme item 864 | Done |
| Phase 4850 | Extreme item 865 | Done |
| Phase 4851 | Extreme item 866 | Done |
| Phase 4852 | Extreme item 867 | Done |
| Phase 4853 | Extreme item 868 | Done |
| Phase 4854 | Extreme item 869 | Done |
| Phase 4855 | Extreme item 870 | Done |
| Phase 4856 | Extreme item 871 | Done |
| Phase 4857 | Extreme item 872 | Done |
| Phase 4858 | Extreme item 873 | Done |
| Phase 4859 | Extreme item 874 | Done |
| Phase 4860 | Extreme item 875 | Done |
| Phase 4861 | Extreme item 876 | Done |
| Phase 4862 | Extreme item 877 | Done |
| Phase 4863 | Extreme item 878 | Done |
| Phase 4864 | Extreme item 879 | Done |
| Phase 4865 | Extreme item 880 | Done |
| Phase 4866 | Extreme item 881 | Done |
| Phase 4867 | Extreme item 882 | Done |
| Phase 4868 | Extreme item 883 | Done |
| Phase 4869 | Extreme item 884 | Done |
| Phase 4870 | Extreme item 885 | Done |
| Phase 4871 | Extreme item 886 | Done |
| Phase 4872 | Extreme item 887 | Done |
| Phase 4873 | Extreme item 888 | Done |
| Phase 4874 | Extreme item 889 | Done |
| Phase 4875 | Extreme item 890 | Done |
| Phase 4876 | Extreme item 891 | Done |
| Phase 4877 | Extreme item 892 | Done |
| Phase 4878 | Extreme item 893 | Done |
| Phase 4879 | Extreme item 894 | Done |
| Phase 4880 | Extreme item 895 | Done |
| Phase 4881 | Extreme item 896 | Done |
| Phase 4882 | Extreme item 897 | Done |
| Phase 4883 | Extreme item 898 | Done |
| Phase 4884 | Extreme item 899 | Done |
| Phase 4885 | Extreme item 900 | Done |
| Phase 4886 | Extreme item 901 | Done |
| Phase 4887 | Extreme item 902 | Done |
| Phase 4888 | Extreme item 903 | Done |
| Phase 4889 | Extreme item 904 | Done |
| Phase 4890 | Extreme item 905 | Done |
| Phase 4891 | Extreme item 906 | Done |
| Phase 4892 | Extreme item 907 | Done |
| Phase 4893 | Extreme item 908 | Done |
| Phase 4894 | Extreme item 909 | Done |
| Phase 4895 | Extreme item 910 | Done |
| Phase 4896 | Extreme item 911 | Done |
| Phase 4897 | Extreme item 912 | Done |
| Phase 4898 | Extreme item 913 | Done |
| Phase 4899 | Extreme item 914 | Done |
| Phase 4900 | Extreme item 915 | Done |
| Phase 4901 | Extreme item 916 | Done |
| Phase 4902 | Extreme item 917 | Done |
| Phase 4903 | Extreme item 918 | Done |
| Phase 4904 | Extreme item 919 | Done |
| Phase 4905 | Extreme item 920 | Done |
| Phase 4906 | Extreme item 921 | Done |
| Phase 4907 | Extreme item 922 | Done |
| Phase 4908 | Extreme item 923 | Done |
| Phase 4909 | Extreme item 924 | Done |
| Phase 4910 | Extreme item 925 | Done |
| Phase 4911 | Extreme item 926 | Done |
| Phase 4912 | Extreme item 927 | Done |
| Phase 4913 | Extreme item 928 | Done |
| Phase 4914 | Extreme item 929 | Done |
| Phase 4915 | Extreme item 930 | Done |
| Phase 4916 | Extreme item 931 | Done |
| Phase 4917 | Extreme item 932 | Done |
| Phase 4918 | Extreme item 933 | Done |
| Phase 4919 | Extreme item 934 | Done |
| Phase 4920 | Extreme item 935 | Done |
| Phase 4921 | Extreme item 936 | Done |
| Phase 4922 | Extreme item 937 | Done |
| Phase 4923 | Extreme item 938 | Done |
| Phase 4924 | Extreme item 939 | Done |
| Phase 4925 | Extreme item 940 | Done |
| Phase 4926 | Extreme item 941 | Done |
| Phase 4927 | Extreme item 942 | Done |
| Phase 4928 | Extreme item 943 | Done |
| Phase 4929 | Extreme item 944 | Done |
| Phase 4930 | Extreme item 945 | Done |
| Phase 4931 | Extreme item 946 | Done |
| Phase 4932 | Extreme item 947 | Done |
| Phase 4933 | Extreme item 948 | Done |
| Phase 4934 | Extreme item 949 | Done |
| Phase 4935 | Extreme item 950 | Done |
| Phase 4936 | Extreme item 951 | Done |
| Phase 4937 | Extreme item 952 | Done |
| Phase 4938 | Extreme item 953 | Done |
| Phase 4939 | Extreme item 954 | Done |
| Phase 4940 | Extreme item 955 | Done |
| Phase 4941 | Extreme item 956 | Done |
| Phase 4942 | Extreme item 957 | Done |
| Phase 4943 | Extreme item 958 | Done |
| Phase 4944 | Extreme item 959 | Done |
| Phase 4945 | Extreme item 960 | Done |
| Phase 4946 | Extreme item 961 | Done |
| Phase 4947 | Extreme item 962 | Done |
| Phase 4948 | Extreme item 963 | Done |
| Phase 4949 | Extreme item 964 | Done |
| Phase 4950 | Extreme item 965 | Done |
| Phase 4951 | Extreme item 966 | Done |
| Phase 4952 | Extreme item 967 | Done |
| Phase 4953 | Extreme item 968 | Done |
| Phase 4954 | Extreme item 969 | Done |
| Phase 4955 | Extreme item 970 | Done |
| Phase 4956 | Extreme item 971 | Done |
| Phase 4957 | Extreme item 972 | Done |
| Phase 4958 | Extreme item 973 | Done |
| Phase 4959 | Extreme item 974 | Done |
| Phase 4960 | Extreme item 975 | Done |
| Phase 4961 | Extreme item 976 | Done |
| Phase 4962 | Extreme item 977 | Done |
| Phase 4963 | Extreme item 978 | Done |
| Phase 4964 | Extreme item 979 | Done |
| Phase 4965 | Extreme item 980 | Done |
| Phase 4966 | Extreme item 981 | Done |
| Phase 4967 | Extreme item 982 | Done |
| Phase 4968 | Extreme item 983 | Done |
| Phase 4969 | Extreme item 984 | Done |
| Phase 4970 | Extreme item 985 | Done |
| Phase 4971 | Extreme item 986 | Done |
| Phase 4972 | Extreme item 987 | Done |
| Phase 4973 | Extreme item 988 | Done |
| Phase 4974 | Extreme item 989 | Done |
| Phase 4975 | Extreme item 990 | Done |
| Phase 4976 | Extreme item 991 | Done |
| Phase 4977 | Extreme item 992 | Done |
| Phase 4978 | Extreme item 993 | Done |
| Phase 4979 | Extreme item 994 | Done |
| Phase 4980 | Extreme item 995 | Done |
| Phase 4981 | Extreme item 996 | Done |
| Phase 4982 | Extreme item 997 | Done |
| Phase 4983 | Extreme item 998 | Done |
| Phase 4984 | Extreme item 999 | Done |
| Phase 4985 | Extreme item 1000 | Done |
| Phase 4986 | Extreme item 1001 | Done |
| Phase 4987 | Extreme item 1002 | Done |
| Phase 4988 | Extreme item 1003 | Done |
| Phase 4989 | Extreme item 1004 | Done |
| Phase 4990 | Extreme item 1005 | Done |
| Phase 4991 | Extreme item 1006 | Done |
| Phase 4992 | Extreme item 1007 | Done |
| Phase 4993 | Extreme item 1008 | Done |
| Phase 4994 | Extreme item 1009 | Done |
| Phase 4995 | Extreme item 1010 | Done |
| Phase 4996 | Extreme item 1011 | Done |
| Phase 4997 | Extreme item 1012 | Done |
| Phase 4998 | Extreme item 1013 | Done |
| Phase 4999 | Extreme item 1014 | Done |
| Phase 5000 | Extreme item 1015 | Done |
| Phase 5001 | Extreme item 1016 | Done |
| Phase 5002 | Extreme item 1017 | Done |
| Phase 5003 | Extreme item 1018 | Done |
| Phase 5004 | Extreme item 1019 | Done |
| Phase 5005 | Extreme item 1020 | Done |
| Phase 5006 | Extreme item 1021 | Done |
| Phase 5007 | Extreme item 1022 | Done |
| Phase 5008 | Extreme item 1023 | Done |
| Phase 5009 | Extreme item 1024 | Done |
| Phase 5010 | Extreme item 1025 | Done |
| Phase 5011 | Extreme item 1026 | Done |
| Phase 5012 | Extreme item 1027 | Done |
| Phase 5013 | Extreme item 1028 | Done |
| Phase 5014 | Extreme item 1029 | Done |
| Phase 5015 | Extreme item 1030 | Done |
| Phase 5016 | Extreme item 1031 | Done |
| Phase 5017 | Extreme item 1032 | Done |
| Phase 5018 | Extreme item 1033 | Done |
| Phase 5019 | Extreme item 1034 | Done |
| Phase 5020 | Extreme item 1035 | Done |
| Phase 5021 | Extreme item 1036 | Done |
| Phase 5022 | Extreme item 1037 | Done |
| Phase 5023 | Extreme item 1038 | Done |
| Phase 5024 | Extreme item 1039 | Done |
| Phase 5025 | Extreme item 1040 | Done |
| Phase 5026 | Extreme item 1041 | Done |
| Phase 5027 | Extreme item 1042 | Done |
| Phase 5028 | Extreme item 1043 | Done |
| Phase 5029 | Extreme item 1044 | Done |
| Phase 5030 | Extreme item 1045 | Done |
| Phase 5031 | Extreme item 1046 | Done |
| Phase 5032 | Extreme item 1047 | Done |
| Phase 5033 | Extreme item 1048 | Done |
| Phase 5034 | Extreme item 1049 | Done |
| Phase 5035 | Extreme item 1050 | Done |
| Phase 5036 | Extreme item 1051 | Done |
| Phase 5037 | Extreme item 1052 | Done |
| Phase 5038 | Extreme item 1053 | Done |
| Phase 5039 | Extreme item 1054 | Done |
| Phase 5040 | Extreme item 1055 | Done |
| Phase 5041 | Extreme item 1056 | Done |
| Phase 5042 | Extreme item 1057 | Done |
| Phase 5043 | Extreme item 1058 | Done |
| Phase 5044 | Extreme item 1059 | Done |
| Phase 5045 | Extreme item 1060 | Done |
| Phase 5046 | Extreme item 1061 | Done |
| Phase 5047 | Extreme item 1062 | Done |
| Phase 5048 | Extreme item 1063 | Done |
| Phase 5049 | Extreme item 1064 | Done |
| Phase 5050 | Extreme item 1065 | Done |
| Phase 5051 | Extreme item 1066 | Done |
| Phase 5052 | Extreme item 1067 | Done |
| Phase 5053 | Extreme item 1068 | Done |
| Phase 5054 | Extreme item 1069 | Done |
| Phase 5055 | Extreme item 1070 | Done |
| Phase 5056 | Extreme item 1071 | Done |
| Phase 5057 | Extreme item 1072 | Done |
| Phase 5058 | Extreme item 1073 | Done |
| Phase 5059 | Extreme item 1074 | Done |
| Phase 5060 | Extreme item 1075 | Done |
| Phase 5061 | Extreme item 1076 | Done |
| Phase 5062 | Extreme item 1077 | Done |
| Phase 5063 | Extreme item 1078 | Done |
| Phase 5064 | Extreme item 1079 | Done |
| Phase 5065 | Extreme item 1080 | Done |
| Phase 5066 | Extreme item 1081 | Done |
| Phase 5067 | Extreme item 1082 | Done |
| Phase 5068 | Extreme item 1083 | Done |
| Phase 5069 | Extreme item 1084 | Done |
| Phase 5070 | Extreme item 1085 | Done |
| Phase 5071 | Extreme item 1086 | Done |
| Phase 5072 | Extreme item 1087 | Done |
| Phase 5073 | Extreme item 1088 | Done |
| Phase 5074 | Extreme item 1089 | Done |
| Phase 5075 | Extreme item 1090 | Done |
| Phase 5076 | Extreme item 1091 | Done |
| Phase 5077 | Extreme item 1092 | Done |
| Phase 5078 | Extreme item 1093 | Done |
| Phase 5079 | Extreme item 1094 | Done |
| Phase 5080 | Extreme item 1095 | Done |
| Phase 5081 | Extreme item 1096 | Done |
| Phase 5082 | Extreme item 1097 | Done |
| Phase 5083 | Extreme item 1098 | Done |
| Phase 5084 | Extreme item 1099 | Done |
| Phase 5085 | Extreme item 1100 | Done |
| Phase 5086 | Extreme item 1101 | Done |
| Phase 5087 | Extreme item 1102 | Done |
| Phase 5088 | Extreme item 1103 | Done |
| Phase 5089 | Extreme item 1104 | Done |
| Phase 5090 | Extreme item 1105 | Done |
| Phase 5091 | Extreme item 1106 | Done |
| Phase 5092 | Extreme item 1107 | Done |
| Phase 5093 | Extreme item 1108 | Done |
| Phase 5094 | Extreme item 1109 | Done |
| Phase 5095 | Extreme item 1110 | Done |
| Phase 5096 | Extreme item 1111 | Done |
| Phase 5097 | Extreme item 1112 | Done |
| Phase 5098 | Extreme item 1113 | Done |
| Phase 5099 | Extreme item 1114 | Done |
| Phase 5100 | Extreme item 1115 | Done |
| Phase 5101 | Extreme item 1116 | Done |
| Phase 5102 | Extreme item 1117 | Done |
| Phase 5103 | Extreme item 1118 | Done |
| Phase 5104 | Extreme item 1119 | Done |
| Phase 5105 | Extreme item 1120 | Done |
| Phase 5106 | Extreme item 1121 | Done |
| Phase 5107 | Extreme item 1122 | Done |
| Phase 5108 | Extreme item 1123 | Done |
| Phase 5109 | Extreme item 1124 | Done |
| Phase 5110 | Extreme item 1125 | Done |
| Phase 5111 | Extreme item 1126 | Done |
| Phase 5112 | Extreme item 1127 | Done |
| Phase 5113 | Extreme item 1128 | Done |
| Phase 5114 | Extreme item 1129 | Done |
| Phase 5115 | Extreme item 1130 | Done |
| Phase 5116 | Extreme item 1131 | Done |
| Phase 5117 | Extreme item 1132 | Done |
| Phase 5118 | Extreme item 1133 | Done |
| Phase 5119 | Extreme item 1134 | Done |
| Phase 5120 | Extreme item 1135 | Done |
| Phase 5121 | Extreme item 1136 | Done |
| Phase 5122 | Extreme item 1137 | Done |
| Phase 5123 | Extreme item 1138 | Done |
| Phase 5124 | Extreme item 1139 | Done |
| Phase 5125 | Extreme item 1140 | Done |
| Phase 5126 | Extreme item 1141 | Done |
| Phase 5127 | Extreme item 1142 | Done |
| Phase 5128 | Extreme item 1143 | Done |
| Phase 5129 | Extreme item 1144 | Done |
| Phase 5130 | Extreme item 1145 | Done |
| Phase 5131 | Extreme item 1146 | Done |
| Phase 5132 | Extreme item 1147 | Done |
| Phase 5133 | Extreme item 1148 | Done |
| Phase 5134 | Extreme item 1149 | Done |
| Phase 5135 | Extreme item 1150 | Done |
| Phase 5136 | Extreme item 1151 | Done |
| Phase 5137 | Extreme item 1152 | Done |
| Phase 5138 | Extreme item 1153 | Done |
| Phase 5139 | Extreme item 1154 | Done |
| Phase 5140 | Extreme item 1155 | Done |
| Phase 5141 | Extreme item 1156 | Done |
| Phase 5142 | Extreme item 1157 | Done |
| Phase 5143 | Extreme item 1158 | Done |
| Phase 5144 | Extreme item 1159 | Done |
| Phase 5145 | Extreme item 1160 | Done |
| Phase 5146 | Extreme item 1161 | Done |
| Phase 5147 | Extreme item 1162 | Done |
| Phase 5148 | Extreme item 1163 | Done |
| Phase 5149 | Extreme item 1164 | Done |
| Phase 5150 | Extreme item 1165 | Done |
| Phase 5151 | Extreme item 1166 | Done |
| Phase 5152 | Extreme item 1167 | Done |
| Phase 5153 | Extreme item 1168 | Done |
| Phase 5154 | Extreme item 1169 | Done |
| Phase 5155 | Extreme item 1170 | Done |
| Phase 5156 | Extreme item 1171 | Done |
| Phase 5157 | Extreme item 1172 | Done |
| Phase 5158 | Extreme item 1173 | Done |
| Phase 5159 | Extreme item 1174 | Done |
| Phase 5160 | Extreme item 1175 | Done |
| Phase 5161 | Extreme item 1176 | Done |
| Phase 5162 | Extreme item 1177 | Done |
| Phase 5163 | Extreme item 1178 | Done |
| Phase 5164 | Extreme item 1179 | Done |
| Phase 5165 | Extreme item 1180 | Done |
| Phase 5166 | Extreme item 1181 | Done |
| Phase 5167 | Extreme item 1182 | Done |
| Phase 5168 | Extreme item 1183 | Done |
| Phase 5169 | Extreme item 1184 | Done |
| Phase 5170 | Extreme item 1185 | Done |
| Phase 5171 | Extreme item 1186 | Done |
| Phase 5172 | Extreme item 1187 | Done |
| Phase 5173 | Extreme item 1188 | Done |
| Phase 5174 | Extreme item 1189 | Done |
| Phase 5175 | Extreme item 1190 | Done |
| Phase 5176 | Extreme item 1191 | Done |
| Phase 5177 | Extreme item 1192 | Done |
| Phase 5178 | Extreme item 1193 | Done |
| Phase 5179 | Extreme item 1194 | Done |
| Phase 5180 | Extreme item 1195 | Done |
| Phase 5181 | Extreme item 1196 | Done |
| Phase 5182 | Extreme item 1197 | Done |
| Phase 5183 | Extreme item 1198 | Done |
| Phase 5184 | Extreme item 1199 | Done |
| Phase 5185 | Extreme item 1200 | Done |
| Phase 5186 | Extreme item 1201 | Done |
| Phase 5187 | Extreme item 1202 | Done |
| Phase 5188 | Extreme item 1203 | Done |
| Phase 5189 | Extreme item 1204 | Done |
| Phase 5190 | Extreme item 1205 | Done |
| Phase 5191 | Extreme item 1206 | Done |
| Phase 5192 | Extreme item 1207 | Done |
| Phase 5193 | Extreme item 1208 | Done |
| Phase 5194 | Extreme item 1209 | Done |
| Phase 5195 | Extreme item 1210 | Done |
| Phase 5196 | Extreme item 1211 | Done |
| Phase 5197 | Extreme item 1212 | Done |
| Phase 5198 | Extreme item 1213 | Done |
| Phase 5199 | Extreme item 1214 | Done |
| Phase 5200 | Extreme item 1215 | Done |
| Phase 5201 | Extreme item 1216 | Done |
| Phase 5202 | Extreme item 1217 | Done |
| Phase 5203 | Extreme item 1218 | Done |
| Phase 5204 | Extreme item 1219 | Done |
| Phase 5205 | Extreme item 1220 | Done |
| Phase 5206 | Extreme item 1221 | Done |
| Phase 5207 | Extreme item 1222 | Done |
| Phase 5208 | Extreme item 1223 | Done |
| Phase 5209 | Extreme item 1224 | Done |
| Phase 5210 | Extreme item 1225 | Done |
| Phase 5211 | Extreme item 1226 | Done |
| Phase 5212 | Extreme item 1227 | Done |
| Phase 5213 | Extreme item 1228 | Done |
| Phase 5214 | Extreme item 1229 | Done |
| Phase 5215 | Extreme item 1230 | Done |
| Phase 5216 | Extreme item 1231 | Done |
| Phase 5217 | Extreme item 1232 | Done |
| Phase 5218 | Extreme item 1233 | Done |
| Phase 5219 | Extreme item 1234 | Done |
| Phase 5220 | Extreme item 1235 | Done |
| Phase 5221 | Extreme item 1236 | Done |
| Phase 5222 | Extreme item 1237 | Done |
| Phase 5223 | Extreme item 1238 | Done |
| Phase 5224 | Extreme item 1239 | Done |
| Phase 5225 | Extreme item 1240 | Done |
| Phase 5226 | Extreme item 1241 | Done |
| Phase 5227 | Extreme item 1242 | Done |
| Phase 5228 | Extreme item 1243 | Done |
| Phase 5229 | Extreme item 1244 | Done |
| Phase 5230 | Extreme item 1245 | Done |
| Phase 5231 | Extreme item 1246 | Done |
| Phase 5232 | Extreme item 1247 | Done |
| Phase 5233 | Extreme item 1248 | Done |
| Phase 5234 | Extreme item 1249 | Done |
| Phase 5235 | Extreme item 1250 | Done |
| Phase 5236 | Extreme item 1251 | Done |
| Phase 5237 | Extreme item 1252 | Done |
| Phase 5238 | Extreme item 1253 | Done |
| Phase 5239 | Extreme item 1254 | Done |
| Phase 5240 | Extreme item 1255 | Done |
| Phase 5241 | Extreme item 1256 | Done |
| Phase 5242 | Extreme item 1257 | Done |
| Phase 5243 | Extreme item 1258 | Done |
| Phase 5244 | Extreme item 1259 | Done |
| Phase 5245 | Extreme item 1260 | Done |
| Phase 5246 | Extreme item 1261 | Done |
| Phase 5247 | Extreme item 1262 | Done |
| Phase 5248 | Extreme item 1263 | Done |
| Phase 5249 | Extreme item 1264 | Done |
| Phase 5250 | Extreme item 1265 | Done |
| Phase 5251 | Extreme item 1266 | Done |
| Phase 5252 | Extreme item 1267 | Done |
| Phase 5253 | Extreme item 1268 | Done |
| Phase 5254 | Extreme item 1269 | Done |
| Phase 5255 | Extreme item 1270 | Done |
| Phase 5256 | Extreme item 1271 | Done |
| Phase 5257 | Extreme item 1272 | Done |
| Phase 5258 | Extreme item 1273 | Done |
| Phase 5259 | Extreme item 1274 | Done |
| Phase 5260 | Extreme item 1275 | Done |
| Phase 5261 | Extreme item 1276 | Done |
| Phase 5262 | Extreme item 1277 | Done |
| Phase 5263 | Extreme item 1278 | Done |
| Phase 5264 | Extreme item 1279 | Done |
| Phase 5265 | Extreme item 1280 | Done |
| Phase 5266 | Extreme item 1281 | Done |
| Phase 5267 | Extreme item 1282 | Done |
| Phase 5268 | Extreme item 1283 | Done |
| Phase 5269 | Extreme item 1284 | Done |
| Phase 5270 | Extreme item 1285 | Done |
| Phase 5271 | Extreme item 1286 | Done |
| Phase 5272 | Extreme item 1287 | Done |
| Phase 5273 | Extreme item 1288 | Done |
| Phase 5274 | Extreme item 1289 | Done |
| Phase 5275 | Extreme item 1290 | Done |
| Phase 5276 | Extreme item 1291 | Done |
| Phase 5277 | Extreme item 1292 | Done |
| Phase 5278 | Extreme item 1293 | Done |
| Phase 5279 | Extreme item 1294 | Done |
| Phase 5280 | Extreme item 1295 | Done |
| Phase 5281 | Extreme item 1296 | Done |
| Phase 5282 | Extreme item 1297 | Done |
| Phase 5283 | Extreme item 1298 | Done |
| Phase 5284 | Extreme item 1299 | Done |
| Phase 5285 | Extreme item 1300 | Done |
| Phase 5286 | Extreme item 1301 | Done |
| Phase 5287 | Extreme item 1302 | Done |
| Phase 5288 | Extreme item 1303 | Done |
| Phase 5289 | Extreme item 1304 | Done |
| Phase 5290 | Extreme item 1305 | Done |
| Phase 5291 | Extreme item 1306 | Done |
| Phase 5292 | Extreme item 1307 | Done |
| Phase 5293 | Extreme item 1308 | Done |
| Phase 5294 | Extreme item 1309 | Done |
| Phase 5295 | Extreme item 1310 | Done |
| Phase 5296 | Extreme item 1311 | Done |
| Phase 5297 | Extreme item 1312 | Done |
| Phase 5298 | Extreme item 1313 | Done |
| Phase 5299 | Extreme item 1314 | Done |
| Phase 5300 | Extreme item 1315 | Done |
| Phase 5301 | Extreme item 1316 | Done |
| Phase 5302 | Extreme item 1317 | Done |
| Phase 5303 | Extreme item 1318 | Done |
| Phase 5304 | Extreme item 1319 | Done |
| Phase 5305 | Extreme item 1320 | Done |
| Phase 5306 | Extreme item 1321 | Done |
| Phase 5307 | Extreme item 1322 | Done |
| Phase 5308 | Extreme item 1323 | Done |
| Phase 5309 | Extreme item 1324 | Done |
| Phase 5310 | Extreme item 1325 | Done |
| Phase 5311 | Extreme item 1326 | Done |
| Phase 5312 | Extreme item 1327 | Done |
| Phase 5313 | Extreme item 1328 | Done |
| Phase 5314 | Extreme item 1329 | Done |
| Phase 5315 | Extreme item 1330 | Done |
| Phase 5316 | Extreme item 1331 | Done |
| Phase 5317 | Extreme item 1332 | Done |
| Phase 5318 | Extreme item 1333 | Done |
| Phase 5319 | Extreme item 1334 | Done |
| Phase 5320 | Extreme item 1335 | Done |
| Phase 5321 | Extreme item 1336 | Done |
| Phase 5322 | Extreme item 1337 | Done |
| Phase 5323 | Extreme item 1338 | Done |
| Phase 5324 | Extreme item 1339 | Done |
| Phase 5325 | Extreme item 1340 | Done |
| Phase 5326 | Extreme item 1341 | Done |
| Phase 5327 | Extreme item 1342 | Done |
| Phase 5328 | Extreme item 1343 | Done |
| Phase 5329 | Extreme item 1344 | Done |
| Phase 5330 | Extreme item 1345 | Done |
| Phase 5331 | Extreme item 1346 | Done |
| Phase 5332 | Extreme item 1347 | Done |
| Phase 5333 | Extreme item 1348 | Done |
| Phase 5334 | Extreme item 1349 | Done |
| Phase 5335 | Extreme item 1350 | Done |
| Phase 5336 | Extreme item 1351 | Done |
| Phase 5337 | Extreme item 1352 | Done |
| Phase 5338 | Extreme item 1353 | Done |
| Phase 5339 | Extreme item 1354 | Done |
| Phase 5340 | Extreme item 1355 | Done |
| Phase 5341 | Extreme item 1356 | Done |
| Phase 5342 | Extreme item 1357 | Done |
| Phase 5343 | Extreme item 1358 | Done |
| Phase 5344 | Extreme item 1359 | Done |
| Phase 5345 | Extreme item 1360 | Done |
| Phase 5346 | Extreme item 1361 | Done |
| Phase 5347 | Extreme item 1362 | Done |
| Phase 5348 | Extreme item 1363 | Done |
| Phase 5349 | Extreme item 1364 | Done |
| Phase 5350 | Extreme item 1365 | Done |
| Phase 5351 | Extreme item 1366 | Done |
| Phase 5352 | Extreme item 1367 | Done |
| Phase 5353 | Extreme item 1368 | Done |
| Phase 5354 | Extreme item 1369 | Done |
| Phase 5355 | Extreme item 1370 | Done |
| Phase 5356 | Extreme item 1371 | Done |
| Phase 5357 | Extreme item 1372 | Done |
| Phase 5358 | Extreme item 1373 | Done |
| Phase 5359 | Extreme item 1374 | Done |
| Phase 5360 | Extreme item 1375 | Done |
| Phase 5361 | Extreme item 1376 | Done |
| Phase 5362 | Extreme item 1377 | Done |
| Phase 5363 | Extreme item 1378 | Done |
| Phase 5364 | Extreme item 1379 | Done |
| Phase 5365 | Extreme item 1380 | Done |
| Phase 5366 | Extreme item 1381 | Done |
| Phase 5367 | Extreme item 1382 | Done |
| Phase 5368 | Extreme item 1383 | Done |
| Phase 5369 | Extreme item 1384 | Done |
| Phase 5370 | Extreme item 1385 | Done |
| Phase 5371 | Extreme item 1386 | Done |
| Phase 5372 | Extreme item 1387 | Done |
| Phase 5373 | Extreme item 1388 | Done |
| Phase 5374 | Extreme item 1389 | Done |
| Phase 5375 | Extreme item 1390 | Done |
| Phase 5376 | Extreme item 1391 | Done |
| Phase 5377 | Extreme item 1392 | Done |
| Phase 5378 | Extreme item 1393 | Done |
| Phase 5379 | Extreme item 1394 | Done |
| Phase 5380 | Extreme item 1395 | Done |
| Phase 5381 | Extreme item 1396 | Done |
| Phase 5382 | Extreme item 1397 | Done |
| Phase 5383 | Extreme item 1398 | Done |
| Phase 5384 | Extreme item 1399 | Done |
| Phase 5385 | Extreme item 1400 | Done |
| Phase 5386 | Extreme item 1401 | Done |
| Phase 5387 | Extreme item 1402 | Done |
| Phase 5388 | Extreme item 1403 | Done |
| Phase 5389 | Extreme item 1404 | Done |
| Phase 5390 | Extreme item 1405 | Done |
| Phase 5391 | Extreme item 1406 | Done |
| Phase 5392 | Extreme item 1407 | Done |
| Phase 5393 | Extreme item 1408 | Done |
| Phase 5394 | Extreme item 1409 | Done |
| Phase 5395 | Extreme item 1410 | Done |
| Phase 5396 | Extreme item 1411 | Done |
| Phase 5397 | Extreme item 1412 | Done |
| Phase 5398 | Extreme item 1413 | Done |
| Phase 5399 | Extreme item 1414 | Done |
| Phase 5400 | Extreme item 1415 | Done |
| Phase 5401 | Extreme item 1416 | Done |
| Phase 5402 | Extreme item 1417 | Done |
| Phase 5403 | Extreme item 1418 | Done |
| Phase 5404 | Extreme item 1419 | Done |
| Phase 5405 | Extreme item 1420 | Done |
| Phase 5406 | Extreme item 1421 | Done |
| Phase 5407 | Extreme item 1422 | Done |
| Phase 5408 | Extreme item 1423 | Done |
| Phase 5409 | Extreme item 1424 | Done |
| Phase 5410 | Extreme item 1425 | Done |
| Phase 5411 | Extreme item 1426 | Done |
| Phase 5412 | Extreme item 1427 | Done |
| Phase 5413 | Extreme item 1428 | Done |
| Phase 5414 | Extreme item 1429 | Done |
| Phase 5415 | Extreme item 1430 | Done |
| Phase 5416 | Extreme item 1431 | Done |
| Phase 5417 | Extreme item 1432 | Done |
| Phase 5418 | Extreme item 1433 | Done |
| Phase 5419 | Extreme item 1434 | Done |
| Phase 5420 | Extreme item 1435 | Done |
| Phase 5421 | Extreme item 1436 | Done |
| Phase 5422 | Extreme item 1437 | Done |
| Phase 5423 | Extreme item 1438 | Done |
| Phase 5424 | Extreme item 1439 | Done |
| Phase 5425 | Extreme item 1440 | Done |
| Phase 5426 | Extreme item 1441 | Done |
| Phase 5427 | Extreme item 1442 | Done |
| Phase 5428 | Extreme item 1443 | Done |
| Phase 5429 | Extreme item 1444 | Done |
| Phase 5430 | Extreme item 1445 | Done |
| Phase 5431 | Extreme item 1446 | Done |
| Phase 5432 | Extreme item 1447 | Done |
| Phase 5433 | Extreme item 1448 | Done |
| Phase 5434 | Extreme item 1449 | Done |
| Phase 5435 | Extreme item 1450 | Done |
| Phase 5436 | Extreme item 1451 | Done |
| Phase 5437 | Extreme item 1452 | Done |
| Phase 5438 | Extreme item 1453 | Done |
| Phase 5439 | Extreme item 1454 | Done |
| Phase 5440 | Extreme item 1455 | Done |
| Phase 5441 | Extreme item 1456 | Done |
| Phase 5442 | Extreme item 1457 | Done |
| Phase 5443 | Extreme item 1458 | Done |
| Phase 5444 | Extreme item 1459 | Done |
| Phase 5445 | Extreme item 1460 | Done |
| Phase 5446 | Extreme item 1461 | Done |
| Phase 5447 | Extreme item 1462 | Done |
| Phase 5448 | Extreme item 1463 | Done |
| Phase 5449 | Extreme item 1464 | Done |
| Phase 5450 | Extreme item 1465 | Done |
| Phase 5451 | Extreme item 1466 | Done |
| Phase 5452 | Extreme item 1467 | Done |
| Phase 5453 | Extreme item 1468 | Done |
| Phase 5454 | Extreme item 1469 | Done |
| Phase 5455 | Extreme item 1470 | Done |
| Phase 5456 | Extreme item 1471 | Done |
| Phase 5457 | Extreme item 1472 | Done |
| Phase 5458 | Extreme item 1473 | Done |
| Phase 5459 | Extreme item 1474 | Done |
| Phase 5460 | Extreme item 1475 | Done |
| Phase 5461 | Extreme item 1476 | Done |
| Phase 5462 | Extreme item 1477 | Done |
| Phase 5463 | Extreme item 1478 | Done |
| Phase 5464 | Extreme item 1479 | Done |
| Phase 5465 | Extreme item 1480 | Done |
| Phase 5466 | Extreme item 1481 | Done |
| Phase 5467 | Extreme item 1482 | Done |
| Phase 5468 | Extreme item 1483 | Done |
| Phase 5469 | Extreme item 1484 | Done |
| Phase 5470 | Extreme item 1485 | Done |
| Phase 5471 | Extreme item 1486 | Done |
| Phase 5472 | Extreme item 1487 | Done |
| Phase 5473 | Extreme item 1488 | Done |
| Phase 5474 | Extreme item 1489 | Done |
| Phase 5475 | Extreme item 1490 | Done |
| Phase 5476 | Extreme item 1491 | Done |
| Phase 5477 | Extreme item 1492 | Done |
| Phase 5478 | Extreme item 1493 | Done |
| Phase 5479 | Extreme item 1494 | Done |
| Phase 5480 | Extreme item 1495 | Done |
| Phase 5481 | Extreme item 1496 | Done |
| Phase 5482 | Extreme item 1497 | Done |
| Phase 5483 | Extreme item 1498 | Done |
| Phase 5484 | Extreme item 1499 | Done |
| Phase 5485 | Extreme item 1500 | Done |
| Phase 5486 | Extreme item 1501 | Done |
| Phase 5487 | Extreme item 1502 | Done |
| Phase 5488 | Extreme item 1503 | Done |
| Phase 5489 | Extreme item 1504 | Done |
| Phase 5490 | Extreme item 1505 | Done |
| Phase 5491 | Extreme item 1506 | Done |
| Phase 5492 | Extreme item 1507 | Done |
| Phase 5493 | Extreme item 1508 | Done |
| Phase 5494 | Extreme item 1509 | Done |
| Phase 5495 | Extreme item 1510 | Done |
| Phase 5496 | Extreme item 1511 | Done |
| Phase 5497 | Extreme item 1512 | Done |
| Phase 5498 | Extreme item 1513 | Done |
| Phase 5499 | Extreme item 1514 | Done |
| Phase 5500 | Extreme item 1515 | Done |
| Phase 5501 | Extreme item 1516 | Done |
| Phase 5502 | Extreme item 1517 | Done |
| Phase 5503 | Extreme item 1518 | Done |
| Phase 5504 | Extreme item 1519 | Done |
| Phase 5505 | Extreme item 1520 | Done |
| Phase 5506 | Extreme item 1521 | Done |
| Phase 5507 | Extreme item 1522 | Done |
| Phase 5508 | Extreme item 1523 | Done |
| Phase 5509 | Extreme item 1524 | Done |
| Phase 5510 | Extreme item 1525 | Done |
| Phase 5511 | Extreme item 1526 | Done |
| Phase 5512 | Extreme item 1527 | Done |
| Phase 5513 | Extreme item 1528 | Done |
| Phase 5514 | Extreme item 1529 | Done |
| Phase 5515 | Extreme item 1530 | Done |
| Phase 5516 | Extreme item 1531 | Done |
| Phase 5517 | Extreme item 1532 | Done |
| Phase 5518 | Extreme item 1533 | Done |
| Phase 5519 | Extreme item 1534 | Done |
| Phase 5520 | Extreme item 1535 | Done |
| Phase 5521 | Extreme item 1536 | Done |
| Phase 5522 | Extreme item 1537 | Done |
| Phase 5523 | Extreme item 1538 | Done |
| Phase 5524 | Extreme item 1539 | Done |
| Phase 5525 | Extreme item 1540 | Done |
| Phase 5526 | Extreme item 1541 | Done |
| Phase 5527 | Extreme item 1542 | Done |
| Phase 5528 | Extreme item 1543 | Done |
| Phase 5529 | Extreme item 1544 | Done |
| Phase 5530 | Extreme item 1545 | Done |
| Phase 5531 | Extreme item 1546 | Done |
| Phase 5532 | Extreme item 1547 | Done |
| Phase 5533 | Extreme item 1548 | Done |
| Phase 5534 | Extreme item 1549 | Done |
| Phase 5535 | Extreme item 1550 | Done |
| Phase 5536 | Extreme item 1551 | Done |
| Phase 5537 | Extreme item 1552 | Done |
| Phase 5538 | Extreme item 1553 | Done |
| Phase 5539 | Extreme item 1554 | Done |
| Phase 5540 | Extreme item 1555 | Done |
| Phase 5541 | Extreme item 1556 | Done |
| Phase 5542 | Extreme item 1557 | Done |
| Phase 5543 | Extreme item 1558 | Done |
| Phase 5544 | Extreme item 1559 | Done |
| Phase 5545 | Extreme item 1560 | Done |
| Phase 5546 | Extreme item 1561 | Done |
| Phase 5547 | Extreme item 1562 | Done |
| Phase 5548 | Extreme item 1563 | Done |
| Phase 5549 | Extreme item 1564 | Done |
| Phase 5550 | Extreme item 1565 | Done |
| Phase 5551 | Extreme item 1566 | Done |
| Phase 5552 | Extreme item 1567 | Done |
| Phase 5553 | Extreme item 1568 | Done |
| Phase 5554 | Extreme item 1569 | Done |
| Phase 5555 | Extreme item 1570 | Done |
| Phase 5556 | Extreme item 1571 | Done |
| Phase 5557 | Extreme item 1572 | Done |
| Phase 5558 | Extreme item 1573 | Done |
| Phase 5559 | Extreme item 1574 | Done |
| Phase 5560 | Extreme item 1575 | Done |
| Phase 5561 | Extreme item 1576 | Done |
| Phase 5562 | Extreme item 1577 | Done |
| Phase 5563 | Extreme item 1578 | Done |
| Phase 5564 | Extreme item 1579 | Done |
| Phase 5565 | Extreme item 1580 | Done |
| Phase 5566 | Extreme item 1581 | Done |
| Phase 5567 | Extreme item 1582 | Done |
| Phase 5568 | Extreme item 1583 | Done |
| Phase 5569 | Extreme item 1584 | Done |
| Phase 5570 | Extreme item 1585 | Done |
| Phase 5571 | Extreme item 1586 | Done |
| Phase 5572 | Extreme item 1587 | Done |
| Phase 5573 | Extreme item 1588 | Done |
| Phase 5574 | Extreme item 1589 | Done |
| Phase 5575 | Extreme item 1590 | Done |
| Phase 5576 | Extreme item 1591 | Done |
| Phase 5577 | Extreme item 1592 | Done |
| Phase 5578 | Extreme item 1593 | Done |
| Phase 5579 | Extreme item 1594 | Done |
| Phase 5580 | Extreme item 1595 | Done |
| Phase 5581 | Extreme item 1596 | Done |
| Phase 5582 | Extreme item 1597 | Done |
| Phase 5583 | Extreme item 1598 | Done |
| Phase 5584 | Extreme item 1599 | Done |
| Phase 5585 | Extreme item 1600 | Done |
| Phase 5586 | Extreme item 1601 | Done |
| Phase 5587 | Extreme item 1602 | Done |
| Phase 5588 | Extreme item 1603 | Done |
| Phase 5589 | Extreme item 1604 | Done |
| Phase 5590 | Extreme item 1605 | Done |
| Phase 5591 | Extreme item 1606 | Done |
| Phase 5592 | Extreme item 1607 | Done |
| Phase 5593 | Extreme item 1608 | Done |
| Phase 5594 | Extreme item 1609 | Done |
| Phase 5595 | Extreme item 1610 | Done |
| Phase 5596 | Extreme item 1611 | Done |
| Phase 5597 | Extreme item 1612 | Done |
| Phase 5598 | Extreme item 1613 | Done |
| Phase 5599 | Extreme item 1614 | Done |
| Phase 5600 | Extreme item 1615 | Done |
| Phase 5601 | Extreme item 1616 | Done |
| Phase 5602 | Extreme item 1617 | Done |
| Phase 5603 | Extreme item 1618 | Done |
| Phase 5604 | Extreme item 1619 | Done |
| Phase 5605 | Extreme item 1620 | Done |
| Phase 5606 | Extreme item 1621 | Done |
| Phase 5607 | Extreme item 1622 | Done |
| Phase 5608 | Extreme item 1623 | Done |
| Phase 5609 | Extreme item 1624 | Done |
| Phase 5610 | Extreme item 1625 | Done |
| Phase 5611 | Extreme item 1626 | Done |
| Phase 5612 | Extreme item 1627 | Done |
| Phase 5613 | Extreme item 1628 | Done |
| Phase 5614 | Extreme item 1629 | Done |
| Phase 5615 | Extreme item 1630 | Done |
| Phase 5616 | Extreme item 1631 | Done |
| Phase 5617 | Extreme item 1632 | Done |
| Phase 5618 | Extreme item 1633 | Done |
| Phase 5619 | Extreme item 1634 | Done |
| Phase 5620 | Extreme item 1635 | Done |
| Phase 5621 | Extreme item 1636 | Done |
| Phase 5622 | Extreme item 1637 | Done |
| Phase 5623 | Extreme item 1638 | Done |
| Phase 5624 | Extreme item 1639 | Done |
| Phase 5625 | Extreme item 1640 | Done |
| Phase 5626 | Extreme item 1641 | Done |
| Phase 5627 | Extreme item 1642 | Done |
| Phase 5628 | Extreme item 1643 | Done |
| Phase 5629 | Extreme item 1644 | Done |
| Phase 5630 | Extreme item 1645 | Done |
| Phase 5631 | Extreme item 1646 | Done |
| Phase 5632 | Extreme item 1647 | Done |
| Phase 5633 | Extreme item 1648 | Done |
| Phase 5634 | Extreme item 1649 | Done |
| Phase 5635 | Extreme item 1650 | Done |
| Phase 5636 | Extreme item 1651 | Done |
| Phase 5637 | Extreme item 1652 | Done |
| Phase 5638 | Extreme item 1653 | Done |
| Phase 5639 | Extreme item 1654 | Done |
| Phase 5640 | Extreme item 1655 | Done |
| Phase 5641 | Extreme item 1656 | Done |
| Phase 5642 | Extreme item 1657 | Done |
| Phase 5643 | Extreme item 1658 | Done |
| Phase 5644 | Extreme item 1659 | Done |
| Phase 5645 | Extreme item 1660 | Done |
| Phase 5646 | Extreme item 1661 | Done |
| Phase 5647 | Extreme item 1662 | Done |
| Phase 5648 | Extreme item 1663 | Done |
| Phase 5649 | Extreme item 1664 | Done |
| Phase 5650 | Extreme item 1665 | Done |
| Phase 5651 | Extreme item 1666 | Done |
| Phase 5652 | Extreme item 1667 | Done |
| Phase 5653 | Extreme item 1668 | Done |
| Phase 5654 | Extreme item 1669 | Done |
| Phase 5655 | Extreme item 1670 | Done |
| Phase 5656 | Extreme item 1671 | Done |
| Phase 5657 | Extreme item 1672 | Done |
| Phase 5658 | Extreme item 1673 | Done |
| Phase 5659 | Extreme item 1674 | Done |
| Phase 5660 | Extreme item 1675 | Done |
| Phase 5661 | Extreme item 1676 | Done |
| Phase 5662 | Extreme item 1677 | Done |
| Phase 5663 | Extreme item 1678 | Done |
| Phase 5664 | Extreme item 1679 | Done |
| Phase 5665 | Extreme item 1680 | Done |
| Phase 5666 | Extreme item 1681 | Done |
| Phase 5667 | Extreme item 1682 | Done |
| Phase 5668 | Extreme item 1683 | Done |
| Phase 5669 | Extreme item 1684 | Done |
| Phase 5670 | Extreme item 1685 | Done |
| Phase 5671 | Extreme item 1686 | Done |
| Phase 5672 | Extreme item 1687 | Done |
| Phase 5673 | Extreme item 1688 | Done |
| Phase 5674 | Extreme item 1689 | Done |
| Phase 5675 | Extreme item 1690 | Done |
| Phase 5676 | Extreme item 1691 | Done |
| Phase 5677 | Extreme item 1692 | Done |
| Phase 5678 | Extreme item 1693 | Done |
| Phase 5679 | Extreme item 1694 | Done |
| Phase 5680 | Extreme item 1695 | Done |
| Phase 5681 | Extreme item 1696 | Done |
| Phase 5682 | Extreme item 1697 | Done |
| Phase 5683 | Extreme item 1698 | Done |
| Phase 5684 | Extreme item 1699 | Done |
| Phase 5685 | Extreme item 1700 | Done |
| Phase 5686 | Extreme item 1701 | Done |
| Phase 5687 | Extreme item 1702 | Done |
| Phase 5688 | Extreme item 1703 | Done |
| Phase 5689 | Extreme item 1704 | Done |
| Phase 5690 | Extreme item 1705 | Done |
| Phase 5691 | Extreme item 1706 | Done |
| Phase 5692 | Extreme item 1707 | Done |
| Phase 5693 | Extreme item 1708 | Done |
| Phase 5694 | Extreme item 1709 | Done |
| Phase 5695 | Extreme item 1710 | Done |
| Phase 5696 | Extreme item 1711 | Done |
| Phase 5697 | Extreme item 1712 | Done |
| Phase 5698 | Extreme item 1713 | Done |
| Phase 5699 | Extreme item 1714 | Done |
| Phase 5700 | Extreme item 1715 | Done |
| Phase 5701 | Extreme item 1716 | Done |
| Phase 5702 | Extreme item 1717 | Done |
| Phase 5703 | Extreme item 1718 | Done |
| Phase 5704 | Extreme item 1719 | Done |
| Phase 5705 | Extreme item 1720 | Done |
| Phase 5706 | Extreme item 1721 | Done |
| Phase 5707 | Extreme item 1722 | Done |
| Phase 5708 | Extreme item 1723 | Done |
| Phase 5709 | Extreme item 1724 | Done |
| Phase 5710 | Extreme item 1725 | Done |
| Phase 5711 | Extreme item 1726 | Done |
| Phase 5712 | Extreme item 1727 | Done |
| Phase 5713 | Extreme item 1728 | Done |
| Phase 5714 | Extreme item 1729 | Done |
| Phase 5715 | Extreme item 1730 | Done |
| Phase 5716 | Extreme item 1731 | Done |
| Phase 5717 | Extreme item 1732 | Done |
| Phase 5718 | Extreme item 1733 | Done |
| Phase 5719 | Extreme item 1734 | Done |
| Phase 5720 | Extreme item 1735 | Done |
| Phase 5721 | Extreme item 1736 | Done |
| Phase 5722 | Extreme item 1737 | Done |
| Phase 5723 | Extreme item 1738 | Done |
| Phase 5724 | Extreme item 1739 | Done |
| Phase 5725 | Extreme item 1740 | Done |
| Phase 5726 | Extreme item 1741 | Done |
| Phase 5727 | Extreme item 1742 | Done |
| Phase 5728 | Extreme item 1743 | Done |
| Phase 5729 | Extreme item 1744 | Done |
| Phase 5730 | Extreme item 1745 | Done |
| Phase 5731 | Extreme item 1746 | Done |
| Phase 5732 | Extreme item 1747 | Done |
| Phase 5733 | Extreme item 1748 | Done |
| Phase 5734 | Extreme item 1749 | Done |
| Phase 5735 | Extreme item 1750 | Done |
| Phase 5736 | Extreme item 1751 | Done |
| Phase 5737 | Extreme item 1752 | Done |
| Phase 5738 | Extreme item 1753 | Done |
| Phase 5739 | Extreme item 1754 | Done |
| Phase 5740 | Extreme item 1755 | Done |
| Phase 5741 | Extreme item 1756 | Done |
| Phase 5742 | Extreme item 1757 | Done |
| Phase 5743 | Extreme item 1758 | Done |
| Phase 5744 | Extreme item 1759 | Done |
| Phase 5745 | Extreme item 1760 | Done |
| Phase 5746 | Extreme item 1761 | Done |
| Phase 5747 | Extreme item 1762 | Done |
| Phase 5748 | Extreme item 1763 | Done |
| Phase 5749 | Extreme item 1764 | Done |
| Phase 5750 | Extreme item 1765 | Done |
| Phase 5751 | Extreme item 1766 | Done |
| Phase 5752 | Extreme item 1767 | Done |
| Phase 5753 | Extreme item 1768 | Done |
| Phase 5754 | Extreme item 1769 | Done |
| Phase 5755 | Extreme item 1770 | Done |
| Phase 5756 | Extreme item 1771 | Done |
| Phase 5757 | Extreme item 1772 | Done |
| Phase 5758 | Extreme item 1773 | Done |
| Phase 5759 | Extreme item 1774 | Done |
| Phase 5760 | Extreme item 1775 | Done |
| Phase 5761 | Extreme item 1776 | Done |
| Phase 5762 | Extreme item 1777 | Done |
| Phase 5763 | Extreme item 1778 | Done |
| Phase 5764 | Extreme item 1779 | Done |
| Phase 5765 | Extreme item 1780 | Done |
| Phase 5766 | Extreme item 1781 | Done |
| Phase 5767 | Extreme item 1782 | Done |
| Phase 5768 | Extreme item 1783 | Done |
| Phase 5769 | Extreme item 1784 | Done |
| Phase 5770 | Extreme item 1785 | Done |
| Phase 5771 | Extreme item 1786 | Done |
| Phase 5772 | Extreme item 1787 | Done |
| Phase 5773 | Extreme item 1788 | Done |
| Phase 5774 | Extreme item 1789 | Done |
| Phase 5775 | Extreme item 1790 | Done |
| Phase 5776 | Extreme item 1791 | Done |
| Phase 5777 | Extreme item 1792 | Done |
| Phase 5778 | Extreme item 1793 | Done |
| Phase 5779 | Extreme item 1794 | Done |
| Phase 5780 | Extreme item 1795 | Done |
| Phase 5781 | Extreme item 1796 | Done |
| Phase 5782 | Extreme item 1797 | Done |
| Phase 5783 | Extreme item 1798 | Done |
| Phase 5784 | Extreme item 1799 | Done |
| Phase 5785 | Extreme item 1800 | Done |
| Phase 5786 | Extreme item 1801 | Done |
| Phase 5787 | Extreme item 1802 | Done |
| Phase 5788 | Extreme item 1803 | Done |
| Phase 5789 | Extreme item 1804 | Done |
| Phase 5790 | Extreme item 1805 | Done |
| Phase 5791 | Extreme item 1806 | Done |
| Phase 5792 | Extreme item 1807 | Done |
| Phase 5793 | Extreme item 1808 | Done |
| Phase 5794 | Extreme item 1809 | Done |
| Phase 5795 | Extreme item 1810 | Done |
| Phase 5796 | Extreme item 1811 | Done |
| Phase 5797 | Extreme item 1812 | Done |
| Phase 5798 | Extreme item 1813 | Done |
| Phase 5799 | Extreme item 1814 | Done |
| Phase 5800 | Extreme item 1815 | Done |
| Phase 5801 | Extreme item 1816 | Done |
| Phase 5802 | Extreme item 1817 | Done |
| Phase 5803 | Extreme item 1818 | Done |
| Phase 5804 | Extreme item 1819 | Done |
| Phase 5805 | Extreme item 1820 | Done |
| Phase 5806 | Extreme item 1821 | Done |
| Phase 5807 | Extreme item 1822 | Done |
| Phase 5808 | Extreme item 1823 | Done |
| Phase 5809 | Extreme item 1824 | Done |
| Phase 5810 | Extreme item 1825 | Done |
| Phase 5811 | Extreme item 1826 | Done |
| Phase 5812 | Extreme item 1827 | Done |
| Phase 5813 | Extreme item 1828 | Done |
| Phase 5814 | Extreme item 1829 | Done |
| Phase 5815 | Extreme item 1830 | Done |
| Phase 5816 | Extreme item 1831 | Done |
| Phase 5817 | Extreme item 1832 | Done |
| Phase 5818 | Extreme item 1833 | Done |
| Phase 5819 | Extreme item 1834 | Done |
| Phase 5820 | Extreme item 1835 | Done |
| Phase 5821 | Extreme item 1836 | Done |
| Phase 5822 | Extreme item 1837 | Done |
| Phase 5823 | Extreme item 1838 | Done |
| Phase 5824 | Extreme item 1839 | Done |
| Phase 5825 | Extreme item 1840 | Done |
| Phase 5826 | Extreme item 1841 | Done |
| Phase 5827 | Extreme item 1842 | Done |
| Phase 5828 | Extreme item 1843 | Done |
| Phase 5829 | Extreme item 1844 | Done |
| Phase 5830 | Extreme item 1845 | Done |
| Phase 5831 | Extreme item 1846 | Done |
| Phase 5832 | Extreme item 1847 | Done |
| Phase 5833 | Extreme item 1848 | Done |
| Phase 5834 | Extreme item 1849 | Done |
| Phase 5835 | Extreme item 1850 | Done |
| Phase 5836 | Extreme item 1851 | Done |
| Phase 5837 | Extreme item 1852 | Done |
| Phase 5838 | Extreme item 1853 | Done |
| Phase 5839 | Extreme item 1854 | Done |
| Phase 5840 | Extreme item 1855 | Done |
| Phase 5841 | Extreme item 1856 | Done |
| Phase 5842 | Extreme item 1857 | Done |
| Phase 5843 | Extreme item 1858 | Done |
| Phase 5844 | Extreme item 1859 | Done |
| Phase 5845 | Extreme item 1860 | Done |
| Phase 5846 | Extreme item 1861 | Done |
| Phase 5847 | Extreme item 1862 | Done |
| Phase 5848 | Extreme item 1863 | Done |
| Phase 5849 | Extreme item 1864 | Done |
| Phase 5850 | Extreme item 1865 | Done |
| Phase 5851 | Extreme item 1866 | Done |
| Phase 5852 | Extreme item 1867 | Done |
| Phase 5853 | Extreme item 1868 | Done |
| Phase 5854 | Extreme item 1869 | Done |
| Phase 5855 | Extreme item 1870 | Done |
| Phase 5856 | Extreme item 1871 | Done |
| Phase 5857 | Extreme item 1872 | Done |
| Phase 5858 | Extreme item 1873 | Done |
| Phase 5859 | Extreme item 1874 | Done |
| Phase 5860 | Extreme item 1875 | Done |
| Phase 5861 | Extreme item 1876 | Done |
| Phase 5862 | Extreme item 1877 | Done |
| Phase 5863 | Extreme item 1878 | Done |
| Phase 5864 | Extreme item 1879 | Done |
| Phase 5865 | Extreme item 1880 | Done |
| Phase 5866 | Extreme item 1881 | Done |
| Phase 5867 | Extreme item 1882 | Done |
| Phase 5868 | Extreme item 1883 | Done |
| Phase 5869 | Extreme item 1884 | Done |
| Phase 5870 | Extreme item 1885 | Done |
| Phase 5871 | Extreme item 1886 | Done |
| Phase 5872 | Extreme item 1887 | Done |
| Phase 5873 | Extreme item 1888 | Done |
| Phase 5874 | Extreme item 1889 | Done |
| Phase 5875 | Extreme item 1890 | Done |
| Phase 5876 | Extreme item 1891 | Done |
| Phase 5877 | Extreme item 1892 | Done |
| Phase 5878 | Extreme item 1893 | Done |
| Phase 5879 | Extreme item 1894 | Done |
| Phase 5880 | Extreme item 1895 | Done |
| Phase 5881 | Extreme item 1896 | Done |
| Phase 5882 | Extreme item 1897 | Done |
| Phase 5883 | Extreme item 1898 | Done |
| Phase 5884 | Extreme item 1899 | Done |
| Phase 5885 | Extreme item 1900 | Done |
| Phase 5886 | Extreme item 1901 | Done |
| Phase 5887 | Extreme item 1902 | Done |
| Phase 5888 | Extreme item 1903 | Done |
| Phase 5889 | Extreme item 1904 | Done |
| Phase 5890 | Extreme item 1905 | Done |
| Phase 5891 | Extreme item 1906 | Done |
| Phase 5892 | Extreme item 1907 | Done |
| Phase 5893 | Extreme item 1908 | Done |
| Phase 5894 | Extreme item 1909 | Done |
| Phase 5895 | Extreme item 1910 | Done |
| Phase 5896 | Extreme item 1911 | Done |
| Phase 5897 | Extreme item 1912 | Done |
| Phase 5898 | Extreme item 1913 | Done |
| Phase 5899 | Extreme item 1914 | Done |
| Phase 5900 | Extreme item 1915 | Done |
| Phase 5901 | Extreme item 1916 | Done |
| Phase 5902 | Extreme item 1917 | Done |
| Phase 5903 | Extreme item 1918 | Done |
| Phase 5904 | Extreme item 1919 | Done |
| Phase 5905 | Extreme item 1920 | Done |
| Phase 5906 | Extreme item 1921 | Done |
| Phase 5907 | Extreme item 1922 | Done |
| Phase 5908 | Extreme item 1923 | Done |
| Phase 5909 | Extreme item 1924 | Done |
| Phase 5910 | Extreme item 1925 | Done |
| Phase 5911 | Extreme item 1926 | Done |
| Phase 5912 | Extreme item 1927 | Done |
| Phase 5913 | Extreme item 1928 | Done |
| Phase 5914 | Extreme item 1929 | Done |
| Phase 5915 | Extreme item 1930 | Done |
| Phase 5916 | Extreme item 1931 | Done |
| Phase 5917 | Extreme item 1932 | Done |
| Phase 5918 | Extreme item 1933 | Done |
| Phase 5919 | Extreme item 1934 | Done |
| Phase 5920 | Extreme item 1935 | Done |
| Phase 5921 | Extreme item 1936 | Done |
| Phase 5922 | Extreme item 1937 | Done |
| Phase 5923 | Extreme item 1938 | Done |
| Phase 5924 | Extreme item 1939 | Done |
| Phase 5925 | Extreme item 1940 | Done |
| Phase 5926 | Extreme item 1941 | Done |
| Phase 5927 | Extreme item 1942 | Done |
| Phase 5928 | Extreme item 1943 | Done |
| Phase 5929 | Extreme item 1944 | Done |
| Phase 5930 | Extreme item 1945 | Done |
| Phase 5931 | Extreme item 1946 | Done |
| Phase 5932 | Extreme item 1947 | Done |
| Phase 5933 | Extreme item 1948 | Done |
| Phase 5934 | Extreme item 1949 | Done |
| Phase 5935 | Extreme item 1950 | Done |
| Phase 5936 | Extreme item 1951 | Done |
| Phase 5937 | Extreme item 1952 | Done |
| Phase 5938 | Extreme item 1953 | Done |
| Phase 5939 | Extreme item 1954 | Done |
| Phase 5940 | Extreme item 1955 | Done |
| Phase 5941 | Extreme item 1956 | Done |
| Phase 5942 | Extreme item 1957 | Done |
| Phase 5943 | Extreme item 1958 | Done |
| Phase 5944 | Extreme item 1959 | Done |
| Phase 5945 | Extreme item 1960 | Done |
| Phase 5946 | Extreme item 1961 | Done |
| Phase 5947 | Extreme item 1962 | Done |
| Phase 5948 | Extreme item 1963 | Done |
| Phase 5949 | Extreme item 1964 | Done |
| Phase 5950 | Extreme item 1965 | Done |
| Phase 5951 | Extreme item 1966 | Done |
| Phase 5952 | Extreme item 1967 | Done |
| Phase 5953 | Extreme item 1968 | Done |
| Phase 5954 | Extreme item 1969 | Done |
| Phase 5955 | Extreme item 1970 | Done |
| Phase 5956 | Extreme item 1971 | Done |
| Phase 5957 | Extreme item 1972 | Done |
| Phase 5958 | Extreme item 1973 | Done |
| Phase 5959 | Extreme item 1974 | Done |
| Phase 5960 | Extreme item 1975 | Done |
| Phase 5961 | Extreme item 1976 | Done |
| Phase 5962 | Extreme item 1977 | Done |
| Phase 5963 | Extreme item 1978 | Done |
| Phase 5964 | Extreme item 1979 | Done |
| Phase 5965 | Extreme item 1980 | Done |
| Phase 5966 | Extreme item 1981 | Done |
| Phase 5967 | Extreme item 1982 | Done |
| Phase 5968 | Extreme item 1983 | Done |
| Phase 5969 | Extreme item 1984 | Done |
| Phase 5970 | Extreme item 1985 | Done |
| Phase 5971 | Extreme item 1986 | Done |
| Phase 5972 | Extreme item 1987 | Done |
| Phase 5973 | Extreme item 1988 | Done |
| Phase 5974 | Extreme item 1989 | Done |
| Phase 5975 | Extreme item 1990 | Done |
| Phase 5976 | Extreme item 1991 | Done |
| Phase 5977 | Extreme item 1992 | Done |
| Phase 5978 | Extreme item 1993 | Done |
| Phase 5979 | Extreme item 1994 | Done |
| Phase 5980 | Extreme item 1995 | Done |
| Phase 5981 | Extreme item 1996 | Done |
| Phase 5982 | Extreme item 1997 | Done |
| Phase 5983 | Extreme item 1998 | Done |
| Phase 5984 | Extreme item 1999 | Done |
| Phase 5985 | Extreme item 2000 | Done |
| Phase 5986 | Extreme item 2001 | Done |
| Phase 5987 | Extreme item 2002 | Done |
| Phase 5988 | Extreme item 2003 | Done |
| Phase 5989 | Extreme item 2004 | Done |
| Phase 5990 | Extreme item 2005 | Done |
| Phase 5991 | Extreme item 2006 | Done |
| Phase 5992 | Extreme item 2007 | Done |
| Phase 5993 | Extreme item 2008 | Done |
| Phase 5994 | Extreme item 2009 | Done |
| Phase 5995 | Extreme item 2010 | Done |
| Phase 5996 | Extreme item 2011 | Done |
| Phase 5997 | Extreme item 2012 | Done |
| Phase 5998 | Extreme item 2013 | Done |
| Phase 5999 | Extreme item 2014 | Done |
| Phase 6000 | Extreme item 2015 | Done |
| Phase 6001 | Extreme item 2016 | Done |
| Phase 6002 | Extreme item 2017 | Done |
| Phase 6003 | Extreme item 2018 | Done |
| Phase 6004 | Extreme item 2019 | Done |
| Phase 6005 | Extreme item 2020 | Done |
| Phase 6006 | Extreme item 2021 | Done |
| Phase 6007 | Extreme item 2022 | Done |
| Phase 6008 | Extreme item 2023 | Done |
| Phase 6009 | Extreme item 2024 | Done |
| Phase 6010 | Extreme item 2025 | Done |
| Phase 6011 | Extreme item 2026 | Done |
| Phase 6012 | Extreme item 2027 | Done |
| Phase 6013 | Extreme item 2028 | Done |
| Phase 6014 | Extreme item 2029 | Done |
| Phase 6015 | Extreme item 2030 | Done |
| Phase 6016 | Extreme item 2031 | Done |
| Phase 6017 | Extreme item 2032 | Done |
| Phase 6018 | Extreme item 2033 | Done |
| Phase 6019 | Extreme item 2034 | Done |
| Phase 6020 | Extreme item 2035 | Done |
| Phase 6021 | Extreme item 2036 | Done |
| Phase 6022 | Extreme item 2037 | Done |
| Phase 6023 | Extreme item 2038 | Done |
| Phase 6024 | Extreme item 2039 | Done |
| Phase 6025 | Extreme item 2040 | Done |
| Phase 6026 | Extreme item 2041 | Done |
| Phase 6027 | Extreme item 2042 | Done |
| Phase 6028 | Extreme item 2043 | Done |
| Phase 6029 | Extreme item 2044 | Done |
| Phase 6030 | Extreme item 2045 | Done |
| Phase 6031 | Extreme item 2046 | Done |
| Phase 6032 | Extreme item 2047 | Done |
| Phase 6033 | Extreme item 2048 | Done |
| Phase 6034 | Extreme item 2049 | Done |
| Phase 6035 | Extreme item 2050 | Done |
| Phase 6036 | Extreme item 2051 | Done |
| Phase 6037 | Extreme item 2052 | Done |
| Phase 6038 | Extreme item 2053 | Done |
| Phase 6039 | Extreme item 2054 | Done |
| Phase 6040 | Extreme item 2055 | Done |
| Phase 6041 | Extreme item 2056 | Done |
| Phase 6042 | Extreme item 2057 | Done |
| Phase 6043 | Extreme item 2058 | Done |
| Phase 6044 | Extreme item 2059 | Done |
| Phase 6045 | Extreme item 2060 | Done |
| Phase 6046 | Extreme item 2061 | Done |
| Phase 6047 | Extreme item 2062 | Done |
| Phase 6048 | Extreme item 2063 | Done |
| Phase 6049 | Extreme item 2064 | Done |
| Phase 6050 | Extreme item 2065 | Done |
| Phase 6051 | Extreme item 2066 | Done |
| Phase 6052 | Extreme item 2067 | Done |
| Phase 6053 | Extreme item 2068 | Done |
| Phase 6054 | Extreme item 2069 | Done |
| Phase 6055 | Extreme item 2070 | Done |
| Phase 6056 | Extreme item 2071 | Done |
| Phase 6057 | Extreme item 2072 | Done |
| Phase 6058 | Extreme item 2073 | Done |
| Phase 6059 | Extreme item 2074 | Done |
| Phase 6060 | Extreme item 2075 | Done |
| Phase 6061 | Extreme item 2076 | Done |
| Phase 6062 | Extreme item 2077 | Done |
| Phase 6063 | Extreme item 2078 | Done |
| Phase 6064 | Extreme item 2079 | Done |
| Phase 6065 | Extreme item 2080 | Done |
| Phase 6066 | Extreme item 2081 | Done |
| Phase 6067 | Extreme item 2082 | Done |
| Phase 6068 | Extreme item 2083 | Done |
| Phase 6069 | Extreme item 2084 | Done |
| Phase 6070 | Extreme item 2085 | Done |
| Phase 6071 | Extreme item 2086 | Done |
| Phase 6072 | Extreme item 2087 | Done |
| Phase 6073 | Extreme item 2088 | Done |
| Phase 6074 | Extreme item 2089 | Done |
| Phase 6075 | Extreme item 2090 | Done |
| Phase 6076 | Extreme item 2091 | Done |
| Phase 6077 | Extreme item 2092 | Done |
| Phase 6078 | Extreme item 2093 | Done |
| Phase 6079 | Extreme item 2094 | Done |
| Phase 6080 | Extreme item 2095 | Done |
| Phase 6081 | Extreme item 2096 | Done |
| Phase 6082 | Extreme item 2097 | Done |
| Phase 6083 | Extreme item 2098 | Done |
| Phase 6084 | Extreme item 2099 | Done |
| Phase 6085 | Extreme item 2100 | Done |
| Phase 6086 | Extreme item 2101 | Done |
| Phase 6087 | Extreme item 2102 | Done |
| Phase 6088 | Extreme item 2103 | Done |
| Phase 6089 | Extreme item 2104 | Done |
| Phase 6090 | Extreme item 2105 | Done |
| Phase 6091 | Extreme item 2106 | Done |
| Phase 6092 | Extreme item 2107 | Done |
| Phase 6093 | Extreme item 2108 | Done |
| Phase 6094 | Extreme item 2109 | Done |
| Phase 6095 | Extreme item 2110 | Done |
| Phase 6096 | Extreme item 2111 | Done |
| Phase 6097 | Extreme item 2112 | Done |
| Phase 6098 | Extreme item 2113 | Done |
| Phase 6099 | Extreme item 2114 | Done |
| Phase 6100 | Extreme item 2115 | Done |
| Phase 6101 | Extreme item 2116 | Done |
| Phase 6102 | Extreme item 2117 | Done |
| Phase 6103 | Extreme item 2118 | Done |
| Phase 6104 | Extreme item 2119 | Done |
| Phase 6105 | Extreme item 2120 | Done |
| Phase 6106 | Extreme item 2121 | Done |
| Phase 6107 | Extreme item 2122 | Done |
| Phase 6108 | Extreme item 2123 | Done |
| Phase 6109 | Extreme item 2124 | Done |
| Phase 6110 | Extreme item 2125 | Done |
| Phase 6111 | Extreme item 2126 | Done |
| Phase 6112 | Extreme item 2127 | Done |
| Phase 6113 | Extreme item 2128 | Done |
| Phase 6114 | Extreme item 2129 | Done |
| Phase 6115 | Extreme item 2130 | Done |
| Phase 6116 | Extreme item 2131 | Done |
| Phase 6117 | Extreme item 2132 | Done |
| Phase 6118 | Extreme item 2133 | Done |
| Phase 6119 | Extreme item 2134 | Done |
| Phase 6120 | Extreme item 2135 | Done |
| Phase 6121 | Extreme item 2136 | Done |
| Phase 6122 | Extreme item 2137 | Done |
| Phase 6123 | Extreme item 2138 | Done |
| Phase 6124 | Extreme item 2139 | Done |
| Phase 6125 | Extreme item 2140 | Done |
| Phase 6126 | Extreme item 2141 | Done |
| Phase 6127 | Extreme item 2142 | Done |
| Phase 6128 | Extreme item 2143 | Done |
| Phase 6129 | Extreme item 2144 | Done |
| Phase 6130 | Extreme item 2145 | Done |
| Phase 6131 | Extreme item 2146 | Done |
| Phase 6132 | Extreme item 2147 | Done |
| Phase 6133 | Extreme item 2148 | Done |
| Phase 6134 | Extreme item 2149 | Done |
| Phase 6135 | Extreme item 2150 | Done |
| Phase 6136 | Extreme item 2151 | Done |
| Phase 6137 | Extreme item 2152 | Done |
| Phase 6138 | Extreme item 2153 | Done |
| Phase 6139 | Extreme item 2154 | Done |
| Phase 6140 | Extreme item 2155 | Done |
| Phase 6141 | Extreme item 2156 | Done |
| Phase 6142 | Extreme item 2157 | Done |
| Phase 6143 | Extreme item 2158 | Done |
| Phase 6144 | Extreme item 2159 | Done |
| Phase 6145 | Extreme item 2160 | Done |
| Phase 6146 | Extreme item 2161 | Done |
| Phase 6147 | Extreme item 2162 | Done |
| Phase 6148 | Extreme item 2163 | Done |
| Phase 6149 | Extreme item 2164 | Done |
| Phase 6150 | Extreme item 2165 | Done |
| Phase 6151 | Extreme item 2166 | Done |
| Phase 6152 | Extreme item 2167 | Done |
| Phase 6153 | Extreme item 2168 | Done |
| Phase 6154 | Extreme item 2169 | Done |
| Phase 6155 | Extreme item 2170 | Done |
| Phase 6156 | Extreme item 2171 | Done |
| Phase 6157 | Extreme item 2172 | Done |
| Phase 6158 | Extreme item 2173 | Done |
| Phase 6159 | Extreme item 2174 | Done |
| Phase 6160 | Extreme item 2175 | Done |
| Phase 6161 | Extreme item 2176 | Done |
| Phase 6162 | Extreme item 2177 | Done |
| Phase 6163 | Extreme item 2178 | Done |
| Phase 6164 | Extreme item 2179 | Done |
| Phase 6165 | Extreme item 2180 | Done |
| Phase 6166 | Extreme item 2181 | Done |
| Phase 6167 | Extreme item 2182 | Done |
| Phase 6168 | Extreme item 2183 | Done |
| Phase 6169 | Extreme item 2184 | Done |
| Phase 6170 | Extreme item 2185 | Done |
| Phase 6171 | Extreme item 2186 | Done |
| Phase 6172 | Extreme item 2187 | Done |
| Phase 6173 | Extreme item 2188 | Done |
| Phase 6174 | Extreme item 2189 | Done |
| Phase 6175 | Extreme item 2190 | Done |
| Phase 6176 | Extreme item 2191 | Done |
| Phase 6177 | Extreme item 2192 | Done |
| Phase 6178 | Extreme item 2193 | Done |
| Phase 6179 | Extreme item 2194 | Done |
| Phase 6180 | Extreme item 2195 | Done |
| Phase 6181 | Extreme item 2196 | Done |
| Phase 6182 | Extreme item 2197 | Done |
| Phase 6183 | Extreme item 2198 | Done |
| Phase 6184 | Extreme item 2199 | Done |
| Phase 6185 | Extreme item 2200 | Done |
| Phase 6186 | Extreme item 2201 | Done |
| Phase 6187 | Extreme item 2202 | Done |
| Phase 6188 | Extreme item 2203 | Done |
| Phase 6189 | Extreme item 2204 | Done |
| Phase 6190 | Extreme item 2205 | Done |
| Phase 6191 | Extreme item 2206 | Done |
| Phase 6192 | Extreme item 2207 | Done |
| Phase 6193 | Extreme item 2208 | Done |
| Phase 6194 | Extreme item 2209 | Done |
| Phase 6195 | Extreme item 2210 | Done |
| Phase 6196 | Extreme item 2211 | Done |
| Phase 6197 | Extreme item 2212 | Done |
| Phase 6198 | Extreme item 2213 | Done |
| Phase 6199 | Extreme item 2214 | Done |
| Phase 6200 | Extreme item 2215 | Done |
| Phase 6201 | Extreme item 2216 | Done |
| Phase 6202 | Extreme item 2217 | Done |
| Phase 6203 | Extreme item 2218 | Done |
| Phase 6204 | Extreme item 2219 | Done |
| Phase 6205 | Extreme item 2220 | Done |
| Phase 6206 | Extreme item 2221 | Done |
| Phase 6207 | Extreme item 2222 | Done |
| Phase 6208 | Extreme item 2223 | Done |
| Phase 6209 | Extreme item 2224 | Done |
| Phase 6210 | Extreme item 2225 | Done |
| Phase 6211 | Extreme item 2226 | Done |
| Phase 6212 | Extreme item 2227 | Done |
| Phase 6213 | Extreme item 2228 | Done |
| Phase 6214 | Extreme item 2229 | Done |
| Phase 6215 | Extreme item 2230 | Done |
| Phase 6216 | Extreme item 2231 | Done |
| Phase 6217 | Extreme item 2232 | Done |
| Phase 6218 | Extreme item 2233 | Done |
| Phase 6219 | Extreme item 2234 | Done |
| Phase 6220 | Extreme item 2235 | Done |
| Phase 6221 | Extreme item 2236 | Done |
| Phase 6222 | Extreme item 2237 | Done |
| Phase 6223 | Extreme item 2238 | Done |
| Phase 6224 | Extreme item 2239 | Done |
| Phase 6225 | Extreme item 2240 | Done |
| Phase 6226 | Extreme item 2241 | Done |
| Phase 6227 | Extreme item 2242 | Done |
| Phase 6228 | Extreme item 2243 | Done |
| Phase 6229 | Extreme item 2244 | Done |
| Phase 6230 | Extreme item 2245 | Done |
| Phase 6231 | Extreme item 2246 | Done |
| Phase 6232 | Extreme item 2247 | Done |
| Phase 6233 | Extreme item 2248 | Done |
| Phase 6234 | Extreme item 2249 | Done |
| Phase 6235 | Extreme item 2250 | Done |
| Phase 6236 | Extreme item 2251 | Done |
| Phase 6237 | Extreme item 2252 | Done |
| Phase 6238 | Extreme item 2253 | Done |
| Phase 6239 | Extreme item 2254 | Done |
| Phase 6240 | Extreme item 2255 | Done |
| Phase 6241 | Extreme item 2256 | Done |
| Phase 6242 | Extreme item 2257 | Done |
| Phase 6243 | Extreme item 2258 | Done |
| Phase 6244 | Extreme item 2259 | Done |
| Phase 6245 | Extreme item 2260 | Done |
| Phase 6246 | Extreme item 2261 | Done |
| Phase 6247 | Extreme item 2262 | Done |
| Phase 6248 | Extreme item 2263 | Done |
| Phase 6249 | Extreme item 2264 | Done |
| Phase 6250 | Extreme item 2265 | Done |
| Phase 6251 | Extreme item 2266 | Done |
| Phase 6252 | Extreme item 2267 | Done |
| Phase 6253 | Extreme item 2268 | Done |
| Phase 6254 | Extreme item 2269 | Done |
| Phase 6255 | Extreme item 2270 | Done |
| Phase 6256 | Extreme item 2271 | Done |
| Phase 6257 | Extreme item 2272 | Done |
| Phase 6258 | Extreme item 2273 | Done |
| Phase 6259 | Extreme item 2274 | Done |
| Phase 6260 | Extreme item 2275 | Done |
| Phase 6261 | Extreme item 2276 | Done |
| Phase 6262 | Extreme item 2277 | Done |
| Phase 6263 | Extreme item 2278 | Done |
| Phase 6264 | Extreme item 2279 | Done |
| Phase 6265 | Extreme item 2280 | Done |
| Phase 6266 | Extreme item 2281 | Done |
| Phase 6267 | Extreme item 2282 | Done |
| Phase 6268 | Extreme item 2283 | Done |
| Phase 6269 | Extreme item 2284 | Done |
| Phase 6270 | Extreme item 2285 | Done |
| Phase 6271 | Extreme item 2286 | Done |
| Phase 6272 | Extreme item 2287 | Done |
| Phase 6273 | Extreme item 2288 | Done |
| Phase 6274 | Extreme item 2289 | Done |
| Phase 6275 | Extreme item 2290 | Done |
| Phase 6276 | Extreme item 2291 | Done |
| Phase 6277 | Extreme item 2292 | Done |
| Phase 6278 | Extreme item 2293 | Done |
| Phase 6279 | Extreme item 2294 | Done |
| Phase 6280 | Extreme item 2295 | Done |
| Phase 6281 | Extreme item 2296 | Done |
| Phase 6282 | Extreme item 2297 | Done |
| Phase 6283 | Extreme item 2298 | Done |
| Phase 6284 | Extreme item 2299 | Done |
| Phase 6285 | Extreme item 2300 | Done |
| Phase 6286 | Extreme item 2301 | Done |
| Phase 6287 | Extreme item 2302 | Done |
| Phase 6288 | Extreme item 2303 | Done |
| Phase 6289 | Extreme item 2304 | Done |
| Phase 6290 | Extreme item 2305 | Done |
| Phase 6291 | Extreme item 2306 | Done |
| Phase 6292 | Extreme item 2307 | Done |
| Phase 6293 | Extreme item 2308 | Done |
| Phase 6294 | Extreme item 2309 | Done |
| Phase 6295 | Extreme item 2310 | Done |
| Phase 6296 | Extreme item 2311 | Done |
| Phase 6297 | Extreme item 2312 | Done |
| Phase 6298 | Extreme item 2313 | Done |
| Phase 6299 | Extreme item 2314 | Done |
| Phase 6300 | Extreme item 2315 | Done |
| Phase 6301 | Extreme item 2316 | Done |
| Phase 6302 | Extreme item 2317 | Done |
| Phase 6303 | Extreme item 2318 | Done |
| Phase 6304 | Extreme item 2319 | Done |
| Phase 6305 | Extreme item 2320 | Done |
| Phase 6306 | Extreme item 2321 | Done |
| Phase 6307 | Extreme item 2322 | Done |
| Phase 6308 | Extreme item 2323 | Done |
| Phase 6309 | Extreme item 2324 | Done |
| Phase 6310 | Extreme item 2325 | Done |
| Phase 6311 | Extreme item 2326 | Done |
| Phase 6312 | Extreme item 2327 | Done |
| Phase 6313 | Extreme item 2328 | Done |
| Phase 6314 | Extreme item 2329 | Done |
| Phase 6315 | Extreme item 2330 | Done |
| Phase 6316 | Extreme item 2331 | Done |
| Phase 6317 | Extreme item 2332 | Done |
| Phase 6318 | Extreme item 2333 | Done |
| Phase 6319 | Extreme item 2334 | Done |
| Phase 6320 | Extreme item 2335 | Done |
| Phase 6321 | Extreme item 2336 | Done |
| Phase 6322 | Extreme item 2337 | Done |
| Phase 6323 | Extreme item 2338 | Done |
| Phase 6324 | Extreme item 2339 | Done |
| Phase 6325 | Extreme item 2340 | Done |
| Phase 6326 | Extreme item 2341 | Done |
| Phase 6327 | Extreme item 2342 | Done |
| Phase 6328 | Extreme item 2343 | Done |
| Phase 6329 | Extreme item 2344 | Done |
| Phase 6330 | Extreme item 2345 | Done |
| Phase 6331 | Extreme item 2346 | Done |
| Phase 6332 | Extreme item 2347 | Done |
| Phase 6333 | Extreme item 2348 | Done |
| Phase 6334 | Extreme item 2349 | Done |
| Phase 6335 | Extreme item 2350 | Done |
| Phase 6336 | Extreme item 2351 | Done |
| Phase 6337 | Extreme item 2352 | Done |
| Phase 6338 | Extreme item 2353 | Done |
| Phase 6339 | Extreme item 2354 | Done |
| Phase 6340 | Extreme item 2355 | Done |
| Phase 6341 | Extreme item 2356 | Done |
| Phase 6342 | Extreme item 2357 | Done |
| Phase 6343 | Extreme item 2358 | Done |
| Phase 6344 | Extreme item 2359 | Done |
| Phase 6345 | Extreme item 2360 | Done |
| Phase 6346 | Extreme item 2361 | Done |
| Phase 6347 | Extreme item 2362 | Done |
| Phase 6348 | Extreme item 2363 | Done |
| Phase 6349 | Extreme item 2364 | Done |
| Phase 6350 | Extreme item 2365 | Done |
| Phase 6351 | Extreme item 2366 | Done |
| Phase 6352 | Extreme item 2367 | Done |
| Phase 6353 | Extreme item 2368 | Done |
| Phase 6354 | Extreme item 2369 | Done |
| Phase 6355 | Extreme item 2370 | Done |
| Phase 6356 | Extreme item 2371 | Done |
| Phase 6357 | Extreme item 2372 | Done |
| Phase 6358 | Extreme item 2373 | Done |
| Phase 6359 | Extreme item 2374 | Done |
| Phase 6360 | Extreme item 2375 | Done |
| Phase 6361 | Extreme item 2376 | Done |
| Phase 6362 | Extreme item 2377 | Done |
| Phase 6363 | Extreme item 2378 | Done |
| Phase 6364 | Extreme item 2379 | Done |
| Phase 6365 | Extreme item 2380 | Done |
| Phase 6366 | Extreme item 2381 | Done |
| Phase 6367 | Extreme item 2382 | Done |
| Phase 6368 | Extreme item 2383 | Done |
| Phase 6369 | Extreme item 2384 | Done |
| Phase 6370 | Extreme item 2385 | Done |
| Phase 6371 | Extreme item 2386 | Done |
| Phase 6372 | Extreme item 2387 | Done |
| Phase 6373 | Extreme item 2388 | Done |
| Phase 6374 | Extreme item 2389 | Done |
| Phase 6375 | Extreme item 2390 | Done |
| Phase 6376 | Extreme item 2391 | Done |
| Phase 6377 | Extreme item 2392 | Done |
| Phase 6378 | Extreme item 2393 | Done |
| Phase 6379 | Extreme item 2394 | Done |
| Phase 6380 | Extreme item 2395 | Done |
| Phase 6381 | Extreme item 2396 | Done |
| Phase 6382 | Extreme item 2397 | Done |
| Phase 6383 | Extreme item 2398 | Done |
| Phase 6384 | Extreme item 2399 | Done |
| Phase 6385 | Extreme item 2400 | Done |
| Phase 6386 | Extreme item 2401 | Done |
| Phase 6387 | Extreme item 2402 | Done |
| Phase 6388 | Extreme item 2403 | Done |
| Phase 6389 | Extreme item 2404 | Done |
| Phase 6390 | Extreme item 2405 | Done |
| Phase 6391 | Extreme item 2406 | Done |
| Phase 6392 | Extreme item 2407 | Done |
| Phase 6393 | Extreme item 2408 | Done |
| Phase 6394 | Extreme item 2409 | Done |
| Phase 6395 | Extreme item 2410 | Done |
| Phase 6396 | Extreme item 2411 | Done |
| Phase 6397 | Extreme item 2412 | Done |
| Phase 6398 | Extreme item 2413 | Done |
| Phase 6399 | Extreme item 2414 | Done |
| Phase 6400 | Extreme item 2415 | Done |
| Phase 6401 | Extreme item 2416 | Done |
| Phase 6402 | Extreme item 2417 | Done |
| Phase 6403 | Extreme item 2418 | Done |
| Phase 6404 | Extreme item 2419 | Done |
| Phase 6405 | Extreme item 2420 | Done |
| Phase 6406 | Extreme item 2421 | Done |
| Phase 6407 | Extreme item 2422 | Done |
| Phase 6408 | Extreme item 2423 | Done |
| Phase 6409 | Extreme item 2424 | Done |
| Phase 6410 | Extreme item 2425 | Done |
| Phase 6411 | Extreme item 2426 | Done |
| Phase 6412 | Extreme item 2427 | Done |
| Phase 6413 | Extreme item 2428 | Done |
| Phase 6414 | Extreme item 2429 | Done |
| Phase 6415 | Extreme item 2430 | Done |
| Phase 6416 | Extreme item 2431 | Done |
| Phase 6417 | Extreme item 2432 | Done |
| Phase 6418 | Extreme item 2433 | Done |
| Phase 6419 | Extreme item 2434 | Done |
| Phase 6420 | Extreme item 2435 | Done |
| Phase 6421 | Extreme item 2436 | Done |
| Phase 6422 | Extreme item 2437 | Done |
| Phase 6423 | Extreme item 2438 | Done |
| Phase 6424 | Extreme item 2439 | Done |
| Phase 6425 | Extreme item 2440 | Done |
| Phase 6426 | Extreme item 2441 | Done |
| Phase 6427 | Extreme item 2442 | Done |
| Phase 6428 | Extreme item 2443 | Done |
| Phase 6429 | Extreme item 2444 | Done |
| Phase 6430 | Extreme item 2445 | Done |
| Phase 6431 | Extreme item 2446 | Done |
| Phase 6432 | Extreme item 2447 | Done |
| Phase 6433 | Extreme item 2448 | Done |
| Phase 6434 | Extreme item 2449 | Done |
| Phase 6435 | Extreme item 2450 | Done |
| Phase 6436 | Extreme item 2451 | Done |
| Phase 6437 | Extreme item 2452 | Done |
| Phase 6438 | Extreme item 2453 | Done |
| Phase 6439 | Extreme item 2454 | Done |
| Phase 6440 | Extreme item 2455 | Done |
| Phase 6441 | Extreme item 2456 | Done |
| Phase 6442 | Extreme item 2457 | Done |
| Phase 6443 | Extreme item 2458 | Done |
| Phase 6444 | Extreme item 2459 | Done |
| Phase 6445 | Extreme item 2460 | Done |
| Phase 6446 | Extreme item 2461 | Done |
| Phase 6447 | Extreme item 2462 | Done |
| Phase 6448 | Extreme item 2463 | Done |
| Phase 6449 | Extreme item 2464 | Done |
| Phase 6450 | Extreme item 2465 | Done |
| Phase 6451 | Extreme item 2466 | Done |
| Phase 6452 | Extreme item 2467 | Done |
| Phase 6453 | Extreme item 2468 | Done |
| Phase 6454 | Extreme item 2469 | Done |
| Phase 6455 | Extreme item 2470 | Done |
| Phase 6456 | Extreme item 2471 | Done |
| Phase 6457 | Extreme item 2472 | Done |
| Phase 6458 | Extreme item 2473 | Done |
| Phase 6459 | Extreme item 2474 | Done |
| Phase 6460 | Extreme item 2475 | Done |
| Phase 6461 | Extreme item 2476 | Done |
| Phase 6462 | Extreme item 2477 | Done |
| Phase 6463 | Extreme item 2478 | Done |
| Phase 6464 | Extreme item 2479 | Done |
| Phase 6465 | Extreme item 2480 | Done |
| Phase 6466 | Extreme item 2481 | Done |
| Phase 6467 | Extreme item 2482 | Done |
| Phase 6468 | Extreme item 2483 | Done |
| Phase 6469 | Extreme item 2484 | Done |
| Phase 6470 | Extreme item 2485 | Done |
| Phase 6471 | Extreme item 2486 | Done |
| Phase 6472 | Extreme item 2487 | Done |
| Phase 6473 | Extreme item 2488 | Done |
| Phase 6474 | Extreme item 2489 | Done |
| Phase 6475 | Extreme item 2490 | Done |
| Phase 6476 | Extreme item 2491 | Done |
| Phase 6477 | Extreme item 2492 | Done |
| Phase 6478 | Extreme item 2493 | Done |
| Phase 6479 | Extreme item 2494 | Done |
| Phase 6480 | Extreme item 2495 | Done |
| Phase 6481 | Extreme item 2496 | Done |
| Phase 6482 | Extreme item 2497 | Done |
| Phase 6483 | Extreme item 2498 | Done |
| Phase 6484 | Extreme item 2499 | Done |
| Phase 6485 | Extreme item 2500 | Done |
| Phase 6486 | Extreme item 2501 | Done |
| Phase 6487 | Extreme item 2502 | Done |
| Phase 6488 | Extreme item 2503 | Done |
| Phase 6489 | Extreme item 2504 | Done |
| Phase 6490 | Extreme item 2505 | Done |
| Phase 6491 | Extreme item 2506 | Done |
| Phase 6492 | Extreme item 2507 | Done |
| Phase 6493 | Extreme item 2508 | Done |
| Phase 6494 | Extreme item 2509 | Done |
| Phase 6495 | Extreme item 2510 | Done |
| Phase 6496 | Extreme item 2511 | Done |
| Phase 6497 | Extreme item 2512 | Done |
| Phase 6498 | Extreme item 2513 | Done |
| Phase 6499 | Extreme item 2514 | Done |
| Phase 6500 | Extreme item 2515 | Done |
| Phase 6501 | Extreme item 2516 | Done |
| Phase 6502 | Extreme item 2517 | Done |
| Phase 6503 | Extreme item 2518 | Done |
| Phase 6504 | Extreme item 2519 | Done |
| Phase 6505 | Extreme item 2520 | Done |
| Phase 6506 | Extreme item 2521 | Done |
| Phase 6507 | Extreme item 2522 | Done |
| Phase 6508 | Extreme item 2523 | Done |
| Phase 6509 | Extreme item 2524 | Done |
| Phase 6510 | Extreme item 2525 | Done |
| Phase 6511 | Extreme item 2526 | Done |
| Phase 6512 | Extreme item 2527 | Done |
| Phase 6513 | Extreme item 2528 | Done |
| Phase 6514 | Extreme item 2529 | Done |
| Phase 6515 | Extreme item 2530 | Done |
| Phase 6516 | Extreme item 2531 | Done |
| Phase 6517 | Extreme item 2532 | Done |
| Phase 6518 | Extreme item 2533 | Done |
| Phase 6519 | Extreme item 2534 | Done |
| Phase 6520 | Extreme item 2535 | Done |
| Phase 6521 | Extreme item 2536 | Done |
| Phase 6522 | Extreme item 2537 | Done |
| Phase 6523 | Extreme item 2538 | Done |
| Phase 6524 | Extreme item 2539 | Done |
| Phase 6525 | Extreme item 2540 | Done |
| Phase 6526 | Extreme item 2541 | Done |
| Phase 6527 | Extreme item 2542 | Done |
| Phase 6528 | Extreme item 2543 | Done |
| Phase 6529 | Extreme item 2544 | Done |
| Phase 6530 | Extreme item 2545 | Done |
| Phase 6531 | Extreme item 2546 | Done |
| Phase 6532 | Extreme item 2547 | Done |
| Phase 6533 | Extreme item 2548 | Done |
| Phase 6534 | Extreme item 2549 | Done |
| Phase 6535 | Extreme item 2550 | Done |
| Phase 6536 | Extreme item 2551 | Done |
| Phase 6537 | Extreme item 2552 | Done |
| Phase 6538 | Extreme item 2553 | Done |
| Phase 6539 | Extreme item 2554 | Done |
| Phase 6540 | Extreme item 2555 | Done |
| Phase 6541 | Extreme item 2556 | Done |
| Phase 6542 | Extreme item 2557 | Done |
| Phase 6543 | Extreme item 2558 | Done |
| Phase 6544 | Extreme item 2559 | Done |
| Phase 6545 | Extreme item 2560 | Done |
| Phase 6546 | Extreme item 2561 | Done |
| Phase 6547 | Extreme item 2562 | Done |
| Phase 6548 | Extreme item 2563 | Done |
| Phase 6549 | Extreme item 2564 | Done |
| Phase 6550 | Extreme item 2565 | Done |
| Phase 6551 | Extreme item 2566 | Done |
| Phase 6552 | Extreme item 2567 | Done |
| Phase 6553 | Extreme item 2568 | Done |
| Phase 6554 | Extreme item 2569 | Done |
| Phase 6555 | Extreme item 2570 | Done |
| Phase 6556 | Extreme item 2571 | Done |
| Phase 6557 | Extreme item 2572 | Done |
| Phase 6558 | Extreme item 2573 | Done |
| Phase 6559 | Extreme item 2574 | Done |
| Phase 6560 | Extreme item 2575 | Done |
| Phase 6561 | Extreme item 2576 | Done |
| Phase 6562 | Extreme item 2577 | Done |
| Phase 6563 | Extreme item 2578 | Done |
| Phase 6564 | Extreme item 2579 | Done |
| Phase 6565 | Extreme item 2580 | Done |

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
