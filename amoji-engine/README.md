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
| Phase 3 | Blink / micro-leak / Step-Out temporal layer + Live Link bridge | Done (engine + Face Live + UE consumer stub) |
| Phase 4+ | Personas, Layer T, coarticulation… | Specced in `docs/source/` |

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

**TODO:** Cohen–Massaro coarticulation (continuous blend) — MVP uses discrete per-character visemes. See `docs/source` coarticulation spec.

## Docs

Uploaded research/specs are mirrored under `docs/source/` (OnePagers, Phase checklists, AEP, Complete Spec, etc.).

## License

Private (`UNLICENSED`) for `amoji-core`-style engine code. Public AEP protocol is documented separately (CC-BY 4.0).
