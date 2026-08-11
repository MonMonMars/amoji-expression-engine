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
import { resolveTtsConfig, createTtsProviderFromConfig } from './engine/index.js';

const player = new SpeechPlayer({ emotion: 'happy' });
const mock = new MockTtsProvider(); // phonemes + /data/tts/fixtures/hello-mama.wav
await playWithProvider(player, mock, { text: 'Hello mama.', emotion: 'happy' });

// Config from env (AMOJI_TTS_ENDPOINT / AMOJI_TTS_TOKEN / AMOJI_TTS_PROVIDER)
// or browser globalThis.__AMOJI_TTS__ — falls back to mock when unset:
const provider = createTtsProviderFromConfig();
await playWithProvider(player, provider, { text: '你好', emotion: 'happy' });

// Explicit HTTP:
const http = new HttpTtsProvider({ endpoint: 'https://your-tts/synthesize' });
await playWithProvider(player, http, { text: '你好', emotion: 'happy' });
```

Face Live: pick a **TTS preset** (mock / Step / Index / Kokoro / local-smoke / **Gateway ·***) or paste endpoint → **HTTP synthesize**.

Gateway presets expand `AMOJI_TTS_GATEWAY`:

```bash
export AMOJI_TTS_GATEWAY=https://tts.yourco.com
export AMOJI_TTS_TOKEN=…   # optional Bearer
# Face Live → Gateway · Step  → https://tts.yourco.com/v1/tts/step
```

Smoke (auth round-trip):

```bash
npm run tts:smoke            # local Bearer echo if no env
AMOJI_TTS_ENDPOINT=https://… AMOJI_TTS_TOKEN=… npm run tts:smoke
npm run tts:smoke -- --local
```

Expected HTTP JSON: phonemes/alignment + `audioUrl` (or `audioBase64`). See `engine/tts/ttsProvider.js` + `ttsConfig.js` + `ttsSmoke.js`.
