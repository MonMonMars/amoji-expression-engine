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

### Production gateway smoke

Point the smoke harness at your real gateway (same JSON contract: phonemes/alignment + `audioUrl`):

```bash
export AMOJI_TTS_GATEWAY=https://tts.yourco.com
export AMOJI_TTS_TOKEN=ghp_or_service_token

# Option A — full synthesize URL
AMOJI_TTS_ENDPOINT="$AMOJI_TTS_GATEWAY/v1/tts/step" npm run tts:smoke

# Option B — Face Live Gateway · Step preset expands:
#   ${AMOJI_TTS_GATEWAY}/v1/tts/step
# then click HTTP synthesize

# Option C — generic /synthesize root
AMOJI_TTS_ENDPOINT="$AMOJI_TTS_GATEWAY/synthesize" npm run tts:smoke
```

Pass criteria: `ok: true`, `hasToken: true` when token set, `phonemeCount > 0`, `audioUrl` present.  
401/403 → check Bearer header (`Authorization: Bearer …`). Empty gateway + Gateway preset → Face Live shows “set AMOJI_TTS_GATEWAY”.

Face Live **Probe gateway** runs `probeTtsGateway` (and auto-polls via `startGatewayHealthPoll` while an endpoint is set — base ~8s, exponential backoff on consecutive failures up to 60s, ± ±15% jitter). Chip shows rolling **SLA** (uptime % · p50 latency · streak) from `createGatewayHealthHistory`, plus an inline **sparkline** (`buildHealthSparklineSvg`). Click the sparkline to inspect a probe via `resolveSparklineProbeAt` / `formatHealthProbeDetail` (viewport toast via `describeHealthProbeToast` with **Prev / Next / Compare / Copy / MD / Re-probe / Pin / Dismiss** from `resolveProbeToastAction`, keyboard **[ ] = c / m / r / p / Escape** via `resolveProbeToastShortcut`, history via `createProbeToastHistory`, compare via `compareProbeToastDetails`, SLA badge via `describeProbeToastSlaBadge`, latency spark mini via `buildProbeToastSparkMini`, sound cue via `createProbeToastSound` (mute toggle · volume slider), **Tab** focus trap via `resolveProbeToastFocusTrap`, hover pause via `createProbeToastDismissTimer`), then **Copy probe** (`buildHealthProbeCopyPayload`) / **MD** (`buildHealthProbeMarkdownPayload`). Tones: `ok` / `warn` (auth) / `bad`.

Expected HTTP JSON: phonemes/alignment + `audioUrl` (or `audioBase64`). See `engine/tts/ttsProvider.js` + `ttsConfig.js` + `ttsSmoke.js` + `ttsPresets.js` + `ttsHealth.js`.
