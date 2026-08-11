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

Next code increment: chassis-specific robot tuning; production TTS wiring; Actor discretion UX depth.
