# Amoji Expression Engine

**A Bridge Between AI and Human** — rule-based expression & behavior engine.

Converts AI script semantics (`dialogue + emotion + mood`) into facial/body performance parameters for digital characters and robots.

> Demo character name **Lilith** is for development only. Product brand is **Amoji**.

## Status

| Phase | Scope | Status |
|---|---|---|
| Phase 0 | Repo skeleton + compliance gate (pure-generation boundary) | Done |
| Phase 1 | 8 basic emotions + 2D canvas lab + point catalogs (24/57/77) | Done (MVP) |
| Phase 2+ | Viseme LOCKED/CLAMPED/OPEN, muscle table, persona, Layer T… | Specced in `docs/source/` |

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

## Docs

Uploaded research/specs are mirrored under `docs/source/` (OnePagers, Phase checklists, AEP, Complete Spec, etc.).

## License

Private (`UNLICENSED`) for `amoji-core`-style engine code. Public AEP protocol is documented separately (CC-BY 4.0).
