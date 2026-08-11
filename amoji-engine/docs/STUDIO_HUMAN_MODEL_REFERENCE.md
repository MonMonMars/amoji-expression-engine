# Studio Human-Character Reference — Capcom · Square Enix · Naughty Dog

How three studios that “work very well on human models” actually think about faces, LODs, and emotion — mapped to **Amoji / Sakura / Face Live**.

This is a **production reference**, not a copy of their IP. Use it to judge our LO/HI meshes, morph set, and realtime UI against proven AAA patterns.

---

## 1. One-line DNA of each studio

| Studio | Human-face DNA | What they optimize for |
|---|---|---|
| **Naughty Dog** | Emotion systems + animator judgment | Believable *feeling* in gameplay, not just cinematics |
| **Square Enix** | FACS rig + non-linear muscle blends + style control | Delicate face motion without linear “morph pops” |
| **Capcom (RE Engine)** | Fidelity tiers + uniform facial rig + hybrid mocap/hand | Hero close-ups *and* many NPCs under budget |

---

## 2. Naughty Dog (Uncharted / The Last of Us)

### What they do
- **TLOU (2013):** body mocap, **faces hand-keyed** from performance reference — still among the most emotionally convincing game faces ever. Proves **judgment > raw capture**.
- **TLOU Part II:** *Emotional Systematic Facial Animation* — ~**20 emotion states**, ~**40 hand-sculpted poses per state**, ~**15 000** poses total across cast; tagged to dialogue / encounters; blends in/out of cinematics.
- Face rig: **macro muscle-group controls** + blendshapes for corrections / volume (e.g. yawn).
- Eyes: **look-at target** + layered **saccades** in idles (focus + thought). Matches Amoji Layer E.
- Neutral **idle + emotional overlays**; separate **breathing ladder** (calm → exhausted).

### Sources (public)
- PlayStation Blog — TLOU2 facial system (Keith Paciello)
- Game Anim — TLOU cinematic / Part II systemic face notes
- Amoji internal: `Amoji______DetroitLastOfUs_____v1_98c1.md`

### Steal for Amoji
| ND pattern | Amoji action |
|---|---|
| Systemic emotion library | Keep expanding `EMO_*` + Face Live emotion grid (done v0) |
| Idle + emotion overlay | Face Live: idle sway *while* emotion morph stays on |
| Look-at + saccades | Next: eye aim channel + micro `eyesHoriz/Vert` noise |
| Pose density per emotion | Don’t stop at 1 baked shape — add 3–5 intensity sculpt variants per emotion |
| Hand taste over mocap | Engine rules (Amoji) remain the “animator brain”; mesh is the puppet |

---

## 3. Square Enix (Final Fantasy · Squaresoft lineage)

### What they do
- **FFXVI facial:** FACS-based rig in Maya; poses registered; **driven-key curves** tuned so A→B is **not linear** (linear reads fake).
- **Layered pose blending** so simultaneous FACS poses don’t fight (same spirit as Amoji compound emotion by facial region).
- Pupil / eyelid micro-detail treated as first-class (rig ↔ anim collaboration from day one).
- Strategic lesson from **Spirits Within (2001)** vs later FF games: pure photoreal is a **trap**; successful FF faces sit in **styled realism** (eye proportion, material, motion exaggeration calibrated). Documented in Amoji Alita/FF case studies.

### Steal for Amoji
| SE pattern | Amoji action |
|---|---|
| FACS vocabulary | Map M1–M21 / Expression_* → FACS/ARKit explicitly |
| Non-linear blends | Morph lerp with ease-in/out / different rates per region (mouth faster than brow) |
| Layered poses | Keep compound emotion = region combine, not 50/50 average |
| Style calibration | Default Sakura to **Level 5–6 stylized-real**, not MetaHuman Level 8–9 |
| Rig quality gates Face Live | HI mesh needs clean face loops before more emotions |

---

## 4. Capcom (RE Engine · Resident Evil)

### What they do
- **Fidelity tiers:** hero vs secondary get different scan / expression budgets (3Lateral × Village): single neutral scan → dozens of expression scans by tier.
- **One uniform facial rig** shared by cinematics *and* gameplay (same topology language).
- RE Engine face drive: **joint additive** *or* **blendshapes** (session notes).
- Classic **RE4** lesson still gold:
  - ~36 hand-made expression morphs after mocap disappointed
  - **Expression packages per scene** (don’t load all morphs always)
  - Mix **mesh LOD** vs **texture LOD** independently (hi mesh + mid tex, or lo mesh + hi tex for close-up stills)
  - Multiple **eye textures** for different lighting

### Steal for Amoji
| Capcom pattern | Amoji action |
|---|---|
| Character tiers | Sakura Hero (HI + full morphs) vs NPC (LO + `EMO_*` only) — already matches Face Live LO/HI |
| Uniform rig/topology | Freeze a face topology contract before more outfits |
| Expression packages | Face Live can load only active emotion morphs on LO |
| Independent mesh/texture LOD | ✓ | — | ✓ | Face Live mesh × tex matrix | Done v1 |
| Eyes as special case | Fix eye shader / multi-iris textures before chasing skin pores |

---

## 5. Cross-studio checklist vs current Amoji Sakura

| Checklist item | ND | SE | Capcom | Sakura now | Priority |
|---|---|---|---|---|---|
| Emotion library (not one-off keys) | ✓ | ✓ | ✓ | `EMO_*` + Face Live | Raise pose count / intensity variants |
| LO + HI realtime paths | ✓ | ✓ | ✓ | Face Live LO/HI | Keep |
| Muscle / FACS language | ✓ | ✓ | ✓ | M1–M21 + Expression_* | Write ARKit export map |
| Eyes: aim + micro motion | ✓ | ✓ | ✓ (eye tex) | Face Live look-at + saccade + eye mat fix | Done v1 |
| Non-linear emotion blend | — | ✓ | — | `easeEmotionIntensity` + tier crossfade | Done v1 |
| Idle + emotion overlay | ✓ | — | — | Idle sway *with* emotion morphs | Done v1 |
| Style not pure photo | ✓* | ✓ | selective | Hyper pass overshot; stylized safer | **High** |
| Hand-authored taste layer | ✓ | ✓ | ✓ | Amoji engine | Keep as product core |
| 3 intensity sculpts / emotion | ✓ | — | — | `EMO_*_{subtle,medium,peak}` bake | Done v1 |
| ARKit 52 export map | — | ✓ | — | `data/arkit/arkit-mapping.json` | Done v1 |

\*ND looks “real” but is heavily art-directed performance, not “scan and pray”.

---

## 6. Recommended Sakura pipeline (studio-shaped)

```
Hero topology (locked face loops)
        │
        ├─ HI: Expression_* library (FACS-like) + EMO_* presets
        │     → Face Live / Unreal cinematic close-up
        │
        └─ LO: EMO_* package only (Capcom expression package)
              → Face Live gameplay / mobile

Amoji engine (ND “systemic emotion”)
  emotion id + intensity + mood
    → region blend (SE compound)
    → morph weights + eye aim/saccade + breath
    → compliance gate
```

### Near-term build order (after Face Live v0)
1. ~~**Eye system** — look target + saccade noise on HI `eyesHoriz/Vert`~~ ✓
2. ~~**Emotion overlays on idle** — never zero the face when idle sway runs~~ ✓
3. ~~**3 intensity sculpts per emotion** (subtle / medium / peak)~~ ✓
4. ~~**ARKit 52 export map** from Expression_* / M1–M21~~ ✓
5. ~~**Texture LOD packs** independent of mesh LOD (Capcom)~~ ✓
6. ~~**Hand-tune intensity sculpts** (non-linear per-tier recipes)~~ ✓
7. ~~**Unreal Live Link consumer** for ARKit vector~~ ✓ (bridge + UE Python stub)
8. ~~**Phase 3 timeline** (blink / leak / Step-Out)~~ ✓
9. ~~**Cohen–Massaro coarticulation** (continuous visemes)~~ ✓
10. ~~**Persona idle variants / Layer I breath ladder**~~ ✓
11. ~~**Layer T latency bridge / improvised reaction**~~ ✓
12. ~~**Compound emotion engine** (region-locked blends)~~ ✓
13. ~~**Layer W gait styles**~~ ✓
14. ~~**Full Layer G gesture stack** (Emblem → Adaptor)~~ ✓
15. ~~**Surface Renderer level switcher**~~ ✓
16. ~~**Layer B neck/shoulder/breath** (`accessoryMuscleActivation`)~~ ✓
17. ~~**TTS phoneme timing** → coarticulated visemes~~ ✓
18. ~~**Smile typology** (reward / affiliative / dominance)~~ ✓
19. ~~**Laughter** head-dominant → torso/shoulder PD + contagion freshness~~ ✓
20. ~~**Layer E** head–eye / VOR / pupil / Dyadic·Presentation gaze~~ ✓
21. ~~**Layer 0 script** normalize + `performScript` pipeline~~ ✓
22. ~~**Mood Engine** (bias / idle baseline / slow transition)~~ ✓
23. ~~**Body retarget** 40+ markers ↔ Layer B/W/G~~ ✓
24. ~~**Layer D Actor Discretion** (continuity / leak / gap improv)~~ ✓
25. ~~**Easter eggs** isolated namespace (default OFF, persona-locked)~~ ✓
26. ~~**Robot driver packs** (face-servo-12 → upper-body → humanoid stub)~~ ✓
27. ~~**Capture→bake** (video ARKit takes → intensity sculpts + onset/apex/offset)~~ ✓
28. ~~**MediaPipe Capture Studio** (webcam/video → ARKit NDJSON)~~ ✓
29. ~~**Bake→emotion-timing** (Step-Out / attack / blink from video envelopes)~~ ✓
30. ~~**Chassis calibration** (desktop/lobby/lab · scale/deadzone/slew)~~ ✓
31. ~~**Production TTS wiring** (Step/Index/Kokoro adapter + SpeechPlayer)~~ ✓
32. ~~**YouTube/video capture** (prep + MediaPipe batch + face quality gates)~~ ✓
33. ~~**Audio sync + Layer D UX** (demo tone clock, auto improv, continuity HUD)~~ ✓
34. ~~**TTS provider E2E** (Mock/HTTP synthesize → audioUrl → SpeechPlayer)~~ ✓
35. ~~**Live Link soak** (synthetic publish + `/stats` + memory/HTTP harness)~~ ✓
36. ~~**Easter egg apply** (multi-egg cues + Face Live panel)~~ ✓
37. ~~**Chassis pack variants** (expressive desktop · quiet lobby)~~ ✓
38. ~~**UE Mac Live Link soak notes** (checklist + consumer `--soak` / `/stats`)~~ ✓
39. ~~**More easter staging** (chin-think / nape-anxiety / open-palm honesty)~~ ✓
40. ~~**Chassis SKUs** (desktop quiet · lab demo + product-line helpers)~~ ✓
41. ~~**UE Control Rig remap samples** (Sakura / MetaHuman profile maps)~~ ✓
42. ~~**Hands DOF pack** (`upper-body-hands` + lobby-hands chassis)~~ ✓
43. ~~**TTS HTTP config wiring** (env / `__AMOJI_TTS__` → provider; Face Live endpoint)~~ ✓
44. ~~**More Control Rig profiles** (CC4 · UE5 flat MorphTarget_)~~ ✓
45. ~~**Finger articulation depth** (`upper-body-fingers` + cascade curls)~~ ✓
46. ~~**Authenticated TTS smoke** (`npm run tts:smoke` · local echo / real endpoint)~~ ✓
47. ~~**UE Live Link consumer remap** (`remap_profile` + `--remap-demo`)~~ ✓
48. ~~**Finger presets UI** (rest/fist/point/wave… → robot gesture)~~ ✓
49. ~~**TTS provider presets** (mock/Step/Index/Kokoro/local-smoke)~~ ✓
50. ~~**Face Live Live Link remap picker** (publish remapped blendShapes)~~ ✓
51. ~~**Emblem ↔ finger sync** (wave/ok/thumbs/point/stopPalm)~~ ✓
52. ~~**Gateway TTS presets** (`${AMOJI_TTS_GATEWAY}` Step/Index/Kokoro/root)~~ ✓
53. ~~**Face Live prefs persistence** (localStorage session restore)~~ ✓
54. ~~**Affect/adaptor → finger maps** (+ chin-rest / self-hug / fists presets)~~ ✓
55. ~~**Production gateway smoke docs** (TTS_WIRING pass criteria)~~ ✓
56. ~~**Prefs export/import JSON** (Face Live download / file restore)~~ ✓
57. ~~**Affect staging** (intensity bands + mood aliases + look bias)~~ ✓
58. ~~**Gateway health chip** (`probeTtsGateway` · Probe gateway button)~~ ✓
59. ~~**Auto gateway health poll** (`startGatewayHealthPoll` · 8s interval)~~ ✓
60. ~~**Prefs share URL hash** (`#flp=` encode/decode · Copy share link)~~ ✓
61. ~~**Compound affect staging** (`stageCompoundAffect` · primary-weighted fingers)~~ ✓
62. ~~**Health poll backoff** (`computeHealthPollInterval` · exponential on failures)~~ ✓
63. ~~**Prefs QR / short-link** (`buildPrefsShareBundle` · Show QR + copy short link)~~ ✓
64. ~~**Compound→emblem crossfade** (`crossfadeCompoundToEmblem` · eased gesture blend)~~ ✓
65. ~~**Health poll jitter** (`applyHealthPollJitter` · ±15% schedule)~~ ✓
66. ~~**Prefs deep-link landing toast** (`describePrefsDeepLink` · Face Live toast)~~ ✓
67. ~~**Emblem hold/release** (`compoundEmblemLifecycle` · hold then clear emblem)~~ ✓
68. ~~**Gateway SLA chip history** (`createGatewayHealthHistory` · uptime/p50)~~ ✓
69. ~~**Prefs link expiry / revoke** (`evaluatePrefsLinkExpiry` · Clear deep-link)~~ ✓
70. ~~**Cancel compound lifecycle on emotion** (`cancelCompoundEmblemLifecycle`)~~ ✓
71. ~~**SLA sparkline HUD** (`buildHealthSparklineSvg` · Face Live spark)~~ ✓
72. ~~**Prefs share audit log** (`createPrefsShareAudit` · share/QR/revoke)~~ ✓
73. ~~**Cancel compound on emblem pick** (manual emblem / Wave clears lifecycle)~~ ✓
74. ~~**Sparkline probe detail** (`resolveSparklineProbeAt` · click spark → detail)~~ ✓
75. ~~**Prefs audit export JSON** (`exportShareAuditJson` · Export audit button)~~ ✓
76. ~~**Cancel compound on finger preset** (manual finger pick clears lifecycle)~~ ✓
77. ~~**Probe detail copy** (`buildHealthProbeCopyPayload` · Copy probe button)~~ ✓
78. ~~**Audit clear / filter UI** (`filterShareAuditEntries` · Clear audit)~~ ✓
79. ~~**Cancel compound on chassis/pack** (robot pack / chassis change)~~ ✓
80. ~~**Probe detail toast** (`describeHealthProbeToast` · viewport toast)~~ ✓
81. ~~**Audit search** (free-text query over share audit log)~~ ✓
82. ~~**Cancel compound on Live Link remap** (remap picker clears lifecycle)~~ ✓
83. ~~**Probe toast actions** (`resolveProbeToastAction` · Copy / Re-probe / Dismiss)~~ ✓
84. ~~**Audit regex / date range** (`resolveAuditDateRange` · Regex + 1h/24h/7d)~~ ✓
85. ~~**Cancel compound on surface level** (Surface Renderer pick clears lifecycle)~~ ✓
86. ~~**Probe toast shortcuts** (`resolveProbeToastShortcut` · c / r / Escape)~~ ✓
87. ~~**Audit saved views** (`createAuditSavedViews` · Save view / picker)~~ ✓
88. ~~**Cancel compound on persona change** (persona picker clears lifecycle)~~ ✓
89. ~~**Probe toast focus trap** (`resolveProbeToastFocusTrap` · Tab cycle)~~ ✓
90. ~~**Audit views export/import** (`exportAuditSavedViewsJson` / `importAuditSavedViewsJson`)~~ ✓
91. ~~**Cancel compound on mood change** (mood picker clears lifecycle)~~ ✓
92. ~~**Probe toast pause-on-hover** (`createProbeToastDismissTimer` · hover pauses dismiss)~~ ✓
93. ~~**Audit views delete UI** (Delete view for selected saved view)~~ ✓
94. ~~**Cancel compound on smile/laugh** (smile type / Laugh clears lifecycle)~~ ✓
95. ~~**Probe toast sticky pin** (`pin` action · `p` · dismiss timer pin/unpin)~~ ✓
96. ~~**Audit views rename** (`renameAuditSavedView` · Rename view)~~ ✓
97. ~~**Cancel compound on gaze mode** (gaze picker clears lifecycle)~~ ✓
98. ~~**Probe toast history stack** (`createProbeToastHistory` · Prev/Next · `[` / `]`)~~ ✓
99. ~~**Audit views duplicate** (`duplicate` · Duplicate view)~~ ✓
100. ~~**Cancel compound on look-at track** (Track camera / Center clears lifecycle)~~ ✓
101. ~~**Probe toast compare mode** (`compareProbeToastDetails` · `=` toggle vs previous)~~ ✓
102. ~~**Audit views share snapshot** (`#flv=` · Share view link)~~ ✓
103. ~~**Cancel compound on idle toggle** (Idle sway clears lifecycle)~~ ✓
104. ~~**Probe toast SLA badge** (`describeProbeToastSlaBadge` · uptime/p50 on toast)~~ ✓
105. ~~**Audit views folders** (`groupAuditViewsByFolder` · Set folder / filter)~~ ✓
106. ~~**Cancel compound on spin/cycle** (Turntable / Cycle emotions clears lifecycle)~~ ✓
107. ~~**Probe toast latency spark mini** (`buildProbeToastSparkMini` · inline SVG)~~ ✓
108. ~~**Audit views drag reorder** (`reorder` / Move up·down · drag list)~~ ✓
109. ~~**Cancel compound on blink** (Blink clears lifecycle)~~ ✓
110. ~~**Probe toast copy-as-markdown** (`buildHealthProbeMarkdownPayload` · `m`)~~ ✓
111. ~~**Audit views star favorites** (`toggleStar` · starred sort)~~ ✓
112. ~~**Cancel compound on Live Link toggle** (Live Link pub clears lifecycle)~~ ✓
113. ~~**Probe toast sound cue** (`createProbeToastSound` · tone beep on show)~~ ✓
114. ~~**Audit views bulk star** (`starAll` / `unstarAll` · folder-scoped)~~ ✓
115. ~~**Cancel compound on step-out** (Step-Out next clears lifecycle)~~ ✓
116. ~~**Probe toast mute toggle** (`toggleMute` · Toast sound button)~~ ✓
117. ~~**Audit views starred-only filter** (`filterAuditSavedViews` · Starred only)~~ ✓
118. ~~**Cancel compound on mood leak** (Force leak / Mood fear clears lifecycle)~~ ✓
119. ~~**Probe toast volume slider** (`setVolume` · Toast vol range)~~ ✓
120. ~~**Audit views clear stars in folder** (`clearStarsInFolder` · Clear folder stars)~~ ✓
121. ~~**Cancel compound on improv** (Gap improv / Improv noise clears lifecycle)~~ ✓
122. ~~**Probe toast duck on pin** (`duck` / `unduck` · pin ducks cue)~~ ✓
123. ~~**Audit views export starred-only** (`exportStarred` · Export starred)~~ ✓
124. ~~**Cancel compound on arousal** (arousal segment clears lifecycle)~~ ✓
125. ~~**Probe toast cue rate-limit** (`resolveProbeToastSoundRateLimit` · 1.2s min)~~ ✓
126. ~~**Audit views prune unstarred** (`pruneUnstarred` · folder-scoped)~~ ✓
127. ~~**Cancel compound on robot walk** (Walk hips clears lifecycle)~~ ✓
128. ~~**Probe toast haptic stub** (`createProbeToastHaptic` · vibrate on show)~~ ✓
129. ~~**Audit views import merge starred** (`mergeStarredOnly` · import checkbox)~~ ✓
130. ~~**Cancel compound on robot slew** (Slew toggle clears lifecycle)~~ ✓
131. ~~**Probe toast haptic mute** (`toggleMute` · Toast haptic button)~~ ✓
132. ~~**Audit views import folder filter** (`folder` on merge import · checkbox)~~ ✓
133. ~~**Cancel compound on latency** (Latency bridge clears lifecycle)~~ ✓
134. ~~**Probe toast linked mute** (`createLinkedProbeToastMute` · Link sound + haptic)~~ ✓
135. ~~**Audit views export folder filter** (`exportFolder` · Export folder)~~ ✓
136. ~~**Cancel compound on threat/sigh** (Threat freeze / Sigh clears lifecycle)~~ ✓
137. ~~**Probe toast feedback prefs persist** (`faceLivePrefs` · mute/volume/link)~~ ✓
138. ~~**Audit views export starred+folder** (`exportStarredFolder` · Export starred folder)~~ ✓
139. ~~**Cancel compound on turn segment** (Turn state clears lifecycle)~~ ✓
140. ~~**Toast feedback hash restore** (`applyProbeToastFeedbackFromPrefs` · `#flp=` landing)~~ ✓
141. ~~**Audit views import starred+folder** (`resolveAuditViewsImportFilters` · export meta)~~ ✓
142. ~~**Cancel on speak/TTS** (`speak_pick` / `tts_pick` · Speaking / Play TTS)~~ ✓
143. ~~**Share bundle audit toast hash** (`buildShareBundleAuditPayload` · toast in `#flp=`)~~ ✓
144. ~~**Cancel on TTS stop/fixture** (`tts_stop_pick` / `tts_fixture_pick`)~~ ✓
145. ~~**Cancel compound on script deliver** (`deliver_pick` · Deliver line)~~ ✓
146. ~~**Audit toast hash export filter** (`toastInHashOnly` · Export toast hash)~~ ✓
147. ~~**Cancel on TTS synth/http** (`tts_synth_pick` / `tts_http_pick`)~~ ✓
148. ~~**Cancel on script hold/clear** (`script_hold_pick` / `clear_pick`)~~ ✓
149. ~~**Toast hash saved views** (`toastInHashOnly` · `#flv=` + saved views)~~ ✓
150. ~~**Cancel on TTS preset change** (`tts_preset_pick`)~~ ✓
151. ~~**Cancel compound on disc auto-improv** (`auto_improv_pick` · toggle + auto reaction)~~ ✓
152. ~~**Toast hash view export filter** (`exportToastHash` · Export toast hash views)~~ ✓
153. ~~**Cancel on disc stimulus change** (`stimulus_pick`)~~ ✓
154. ~~**Cancel on script hold release** (`script_hold_release_pick`)~~ ✓
155. ~~**Toast hash view import filter** (`toastInHashOnly` · import merge + inherit export meta)~~ ✓
156. ~~**Cancel on TTS endpoint change** (`tts_endpoint_pick`)~~ ✓
157. ~~**Cancel on disc deliver residue** (`deliver_residue_pick`)~~ ✓
158. ~~**Toast hash import inherit hint** (`formatAuditViewsImportInheritHint` · import preview)~~ ✓
159. ~~**Cancel on TTS endpoint blur/input** (`tts_endpoint_blur_pick` / `tts_endpoint_input_pick`)~~ ✓
160. ~~**Cancel on continuity residual tick** (`continuity_residual_pick` · Layer D tick)~~ ✓
161. ~~**Toast hash import drag preview** (`prefsAuditImportViewsDropZone` · previewText)~~ ✓
162. ~~**Cancel on TTS endpoint paste** (`tts_endpoint_paste_pick`)~~ ✓
163. ~~**Continuity residual morph overlay** (`mergeMorphOverlays` · residual morphs)~~ ✓
164. ~~**Import drag-drop UX polish** (`summarizeAuditViewsImportPreview` · drop zone label · dbl-click import)~~ ✓
165. ~~**Continuity residual decay** (`decayContinuityResidual` · half-life tick)~~ ✓
166. ~~**Residual morph intensity tune** (`tuneContinuityResidualIntensity` · blend-aware overlay)~~ ✓
167. ~~**Cancel on TTS endpoint Enter** (`tts_endpoint_enter_pick`)~~ ✓
168. ~~**Shift-drop auto-import** (`shouldAutoImportAuditViewsOnDrop` · Shift+drop)~~ ✓
169. ~~**Residual decay HUD bar** (`continuityResidualDecayProgress` · `#discResidualBar`)~~ ✓
170. ~~**Cancel on TTS endpoint Escape** (`tts_endpoint_escape_pick`)~~ ✓
171. ~~**Alt-drop replace import** (`shouldAutoImportAuditViewsOnDrop` · Alt+drop · merge:false)~~ ✓
172. ~~**Residual peak reset on deliver** (`resetContinuityResidualPeak` · deliver/ingest)~~ ✓
173. ~~**Cancel on TTS endpoint Tab blur** (`tts_endpoint_tab_blur_pick`)~~ ✓
174. ~~**Ctrl-drop append import** (`appendOnly` · Ctrl+drop merge skip-update)~~ ✓
175. ~~**Residual bar color by emotion** (`continuityResidualBarStyle` · `#discResidualBar`)~~ ✓
176. ~~**Cancel on TTS endpoint focus** (`tts_endpoint_focus_pick`)~~ ✓
177. ~~**Meta-drop import dry-run preview** (`previewAuditViewsImportDryRun` · Meta+drop)~~ ✓
178. ~~**Residual bar pulse on deliver** (`#discResidualBar.pulse` · Deliver line)~~ ✓
179. ~~**Cancel on TTS endpoint cut** (`tts_endpoint_cut_pick`)~~ ✓
180. ~~**Meta+Shift dry-run merge hint** (`formatAuditViewsImportDryRunMergeHint` · Meta+Shift+drop)~~ ✓
181. ~~**Residual pulse on residue deliver** (`continuityResidualDeliverPulseClass` · `#discResidualBar.pulse-residue`)~~ ✓
182. ~~**Cancel on TTS endpoint select-all** (`tts_endpoint_select_all_pick`)~~ ✓
183. ~~**Meta+Alt dry-run replace hint** (`formatAuditViewsImportDryRunMergeHint` · Meta+Alt+drop)~~ ✓
184. ~~**Residual pulse intensity by emotion** (`continuityResidualDeliverPulseClass` · `--disc-pulse-peak`)~~ ✓
185. ~~**Cancel on TTS endpoint copy** (`tts_endpoint_copy_pick`)~~ ✓
186. ~~**Meta+Ctrl dry-run append hint** (`formatAuditViewsImportDryRunMergeHint` · Meta+Ctrl+drop)~~ ✓
187. ~~**Residual pulse duration cap HUD** (`continuityResidualPulseDurationHud` · `#discContStatus`)~~ ✓
188. ~~**Cancel on TTS endpoint duplicate** (`tts_endpoint_duplicate_pick`)~~ ✓
189. ~~**Meta dry-run filter summary** (`formatAuditViewsImportDryRunFilterSummary` · Meta+drop)~~ ✓
190. ~~**Residual pulse peak cap HUD** (`continuityResidualPulsePeakHud` · `#discContStatus`)~~ ✓
191. ~~**Cancel on TTS endpoint context menu** (`tts_endpoint_context_menu_pick`)~~ ✓
192. ~~**Dry-run skip breakdown** (`previewAuditViewsImportDryRun` · Meta+drop)~~ ✓
193. ~~**Residual pulse combined HUD helper** (`resolveContinuityResidualPulseBits` · `discContStatus`)~~ ✓
194. ~~**Cancel on TTS endpoint drag/drop** (`tts_endpoint_drag_pick`)~~ ✓
195. ~~**Dry-run skip breakdown name-clash test** (`phase75DryRunSkipBreakdownNameClash`)~~ ✓
196. ~~**Combined pulse HUD engine helper** (`continuityResidualPulseCombinedHud`)~~ ✓
197. ~~**Dry-run skip breakdown helper** (`formatAuditViewsImportDryRunSkipBreakdown`)~~ ✓
198. ~~**Cancel on TTS endpoint drag-start** (`tts_endpoint_drag_start_pick`)~~ ✓
199. ~~**Pulse bits engine helper** (`resolveContinuityResidualPulseBits`)~~ ✓
200. ~~**Dry-run skip breakdown toast hash test** (`phase77DryRunSkipBreakdownToastHash`)~~ ✓
201. ~~**Cancel on TTS endpoint drag-end** (`tts_endpoint_drag_end_pick`)~~ ✓
---

## 7. What *not* to copy blindly

- Capcom photogrammetry hero budgets (Village-tier) — wrong cost for Amoji MVP  
- SE MetaHuman-adjacent film realism (Spirits Within path) — uncanny risk  
- ND’s 15 000 hand poses — scale later; start with systemic *structure*  
- Any studio’s **character likeness / actor IP** — reference *method*, not faces  

---

## 8. Links to keep open while modeling

- ND TLOU2 systemic face — PlayStation Blog (Paciello)  
- ND face notes — gameanim.com (TLOU / Part II)  
- SE FFXVI FACS rig — Autodesk M&E case study  
- Capcom RE Preview / face drive — Capcom Open Conference RE:2023  
- Capcom × 3Lateral Village fidelity tiers — 3lateral.com portfolio  
- Internal: Detroit/TLOU doc, FF / Alita docs, 10-level Surface Renderer, skeleton standards  

---

## 9. Face Live v0 alignment (already shipped)

| Studio idea | In repo now |
|---|---|
| Capcom LO/HI | `lod/sakura_lo.glb` (~6k tris) · `sakura_hi.glb` (~35k tris) |
| ND emotion states | Face Live emotion grid + `EMO_*` morphs |
| SE FACS-ish library | HI `Expressions_*` morph targets |
| Realtime test harness | `prototypes/face-live.html` → `npm run face-live` |

Next code increment: further production polish (Phase 124 TBD).
