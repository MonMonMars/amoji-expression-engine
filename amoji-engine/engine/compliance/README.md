# Compliance gate — non-bypassable

Any new Layer or feature **must** send output through `applyComplianceGate()` before the render layer.

Do **not** wire Layer → Renderer directly.

Code review checklist:

1. Does this change introduce a path that skips `applyComplianceGate()`?
2. Does any new input accept biometric raw data? (Forbidden — pure generation only.)
3. Crisis intervention overrides always win when triggered.
