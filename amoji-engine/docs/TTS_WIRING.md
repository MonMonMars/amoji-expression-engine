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
# TTS speak panel: Play TTS · Load Step fixture · Mock synthesize · Attach audio · Stop
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
Face Live checkbox **Audio sync** uses fixture WAV (`hello-mama.wav`) when present, else demo tone.

## Provider client (E2E)

```js
import { MockTtsProvider, HttpTtsProvider, playWithProvider, SpeechPlayer } from './engine/index.js';

const player = new SpeechPlayer({ emotion: 'happy' });
const mock = new MockTtsProvider(); // phonemes + /data/tts/fixtures/hello-mama.wav
await playWithProvider(player, mock, { text: 'Hello mama.', emotion: 'happy' });

// Real service:
const http = new HttpTtsProvider({ endpoint: 'https://your-tts/synthesize' });
await playWithProvider(player, http, { text: '你好', emotion: 'happy' });
```

Expected HTTP JSON: phonemes/alignment + `audioUrl` (or `audioBase64`). See `engine/tts/ttsProvider.js`.
