# Production TTS wiring

Normalize vendor TTS payloads → phoneme-timed `performSpeech` → Face Live / robot mouth.

## Flow

```
Step Audio EditX / IndexTTS2 / Kokoro / words-only
        │
        ▼
 normalizeTtsPayload()     engine/tts/ttsAdapter.js
        │
        ├─ phonemes (+ estimate if missing)
        └─ paralinguistic tags (laugh / sigh / breath)
        │
        ▼
 performSpeech(..., { mode: 'phoneme_timed', phonemes, paralinguistics })
        │
        ▼
 SpeechPlayer.tick(dt) → mouth / viseme / hooks
        │
        ▼
 mouthChannelsToMorphWeights → Sakura Expression_* overlay
```

## Run Face Live

```bash
npm run face-live
# TTS speak panel: Play TTS · Load Step fixture · Stop
```

## Code

| Module | Role |
|---|---|
| `engine/tts/ttsAdapter.js` | Vendor detect + normalize |
| `engine/tts/estimatePhonemes.js` | Text/words → approximate phones |
| `engine/tts/speechPlayer.js` | Realtime playback |
| `engine/tts/mouthMorphs.js` | jaw/width/corner → morphs |
| `data/tts/fixtures/sample-payloads.json` | Step / Index / Kokoro examples |

Prefer real TTS phoneme timestamps. Estimation is a fallback for text-only demos.

## Audio sync

`SpeechPlayer.attachAudio(url)` or `attachDemoTone()` — mouth clock follows `audio.currentTime`.
Face Live checkbox **Audio sync (demo tone)** generates a soft WAV matching take duration when no TTS `audioUrl` is present.
