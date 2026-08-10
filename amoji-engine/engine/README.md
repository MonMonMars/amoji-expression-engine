# Amoji Engine

Pure **generation** layer: abstract emotion/script semantics → facial & body performance parameters.

## Architecture boundary (non-negotiable)

This engine **only accepts abstract semantic labels** (text / numeric emotion tags such as AEP `EmotionFrame`).

It must **never** process user biometric raw data:

- no `rawCameraFrame` / video buffers
- no `rawAudioWaveform`
- no biometric sensor streams

If a host app needs emotion *detection*, that logic stays in the host. Only converted semantic tags may enter this engine.

## Pipeline rule

Every Layer output must pass through `applyComplianceGate()` before reaching any renderer. Layers must not bypass the compliance gate.
