/**
 * TTS provider client — fetch or mock synthesize → normalized payload + audioUrl.
 * Plugs into SpeechPlayer for end-to-end mouth↔audio sync.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { normalizeTtsPayload, ttsToSpeechContext } from './ttsAdapter.js';
import { SpeechPlayer } from './speechPlayer.js';
import { synthesizeTimingToneWav } from './demoAudio.js';
import samplePayloads from '../../data/tts/fixtures/sample-payloads.json' with { type: 'json' };

export const DEFAULT_TTS_ENDPOINT = '';

/**
 * @typedef {{
 *   text: string,
 *   emotion?: string,
 *   voice?: string,
 *   language?: string,
 *   provider?: string,
 *   style?: string,
 * }} TtsRequest
 */

/**
 * Resolve audio bytes/URL from a vendor-ish response field.
 * @param {object} payload
 * @returns {string|null}
 */
export function resolveAudioUrl(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const u =
    payload.audioUrl ||
    payload.audio_url ||
    payload.audio ||
    payload.wav_url ||
    payload.url ||
    null;
  if (typeof u === 'string' && u.length) return u;
  if (payload.audioBase64) {
    const mime = payload.audioMime || 'audio/wav';
    return `data:${mime};base64,${payload.audioBase64}`;
  }
  return null;
}

/**
 * Mock provider — returns fixture phonemes + generated (or fixture) audio URL.
 * No network. Safe for Face Live / CI.
 */
export class MockTtsProvider {
  /**
   * @param {{
   *   fixture?: keyof typeof samplePayloads | object,
   *   audioUrl?: string,
   *   generateTone?: boolean,
   * }} [opts]
   */
  constructor(opts = {}) {
    this.fixtureKey = typeof opts.fixture === 'string' ? opts.fixture : 'stepAudioEditX';
    this.fixtureOverride = typeof opts.fixture === 'object' ? opts.fixture : null;
    this.audioUrl = opts.audioUrl || '/data/tts/fixtures/hello-mama.wav';
    this.generateTone = opts.generateTone === true;
    this.id = 'mock';
  }

  /**
   * @param {TtsRequest} req
   */
  async synthesize(req) {
    const base =
      this.fixtureOverride ||
      samplePayloads[this.fixtureKey] ||
      samplePayloads.stepAudioEditX;
    const text = req.text || base.text || '';
    /** @type {object} */
    let payload = {
      ...base,
      provider: base.provider || 'mock',
      text,
      audioUrl: this.audioUrl || base.audioUrl || null,
    };

    if (this.generateTone && typeof Blob !== 'undefined') {
      const dur =
        typeof payload.duration === 'number'
          ? payload.duration
          : typeof payload.duration_ms === 'number'
            ? payload.duration_ms / 1000
            : 1;
      const blob = synthesizeTimingToneWav(dur);
      if (typeof URL !== 'undefined' && URL.createObjectURL) {
        payload = {
          ...payload,
          audioUrl: URL.createObjectURL(blob),
          _ownsAudioUrl: true,
        };
      }
    }

    // If request text differs from fixture, keep phonemes but update text label
    const normalized = normalizeTtsPayload(payload, { text });
    return applyComplianceGate(
      {
        kind: 'tts_synthesize',
        provider: 'mock',
        request: { text, emotion: req.emotion || null },
        payload,
        normalized,
        audioUrl: resolveAudioUrl(payload) || normalized.audioUrl,
      },
      {},
    );
  }
}

/**
 * HTTP provider — POST JSON { text, emotion, voice… } → vendor payload.
 * Expects JSON body with phonemes/alignment and audioUrl (or audioBase64).
 */
export class HttpTtsProvider {
  /**
   * @param {{
   *   endpoint: string,
   *   headers?: Record<string, string>,
   *   providerHint?: string,
   *   fetchImpl?: typeof fetch,
   * }} opts
   */
  constructor(opts) {
    if (!opts?.endpoint) throw new Error('HttpTtsProvider requires endpoint');
    this.endpoint = opts.endpoint;
    this.headers = {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    };
    this.providerHint = opts.providerHint || 'auto';
    this.fetchImpl = opts.fetchImpl || globalThis.fetch;
    this.id = 'http';
  }

  /**
   * @param {TtsRequest} req
   */
  async synthesize(req) {
    if (!this.fetchImpl) {
      return applyComplianceGate(
        { kind: 'tts_synthesize', error: 'fetch_unavailable', provider: 'http' },
        {},
      );
    }
    const res = await this.fetchImpl(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        text: req.text,
        emotion: req.emotion,
        voice: req.voice,
        language: req.language,
        style: req.style,
        provider: req.provider || this.providerHint,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return applyComplianceGate(
        {
          kind: 'tts_synthesize',
          error: 'http_error',
          status: res.status,
          body: body.slice(0, 400),
          provider: 'http',
        },
        {},
      );
    }
    const payload = await res.json();
    if (!payload.provider && this.providerHint !== 'auto') {
      payload.provider = this.providerHint;
    }
    const audioUrl = resolveAudioUrl(payload);
    if (audioUrl && !payload.audioUrl) payload.audioUrl = audioUrl;
    const normalized = normalizeTtsPayload(payload, { text: req.text });
    return applyComplianceGate(
      {
        kind: 'tts_synthesize',
        provider: 'http',
        endpoint: this.endpoint,
        request: { text: req.text, emotion: req.emotion || null },
        payload,
        normalized,
        audioUrl: audioUrl || normalized.audioUrl,
      },
      {},
    );
  }
}

/**
 * Create a provider from a config object.
 * @param {{ type?: 'mock'|'http', endpoint?: string, audioUrl?: string, fixture?: string }} [cfg]
 */
export function createTtsProvider(cfg = {}) {
  if (cfg.type === 'http' || cfg.endpoint) {
    return new HttpTtsProvider({
      endpoint: cfg.endpoint || DEFAULT_TTS_ENDPOINT,
      providerHint: cfg.provider,
      headers: cfg.headers,
    });
  }
  return new MockTtsProvider({
    fixture: cfg.fixture || 'stepAudioEditX',
    audioUrl: cfg.audioUrl || '/data/tts/fixtures/hello-mama.wav',
    generateTone: cfg.generateTone,
  });
}

/**
 * End-to-end: synthesize → load SpeechPlayer with audio sync.
 * @param {SpeechPlayer} player
 * @param {MockTtsProvider|HttpTtsProvider} provider
 * @param {TtsRequest} req
 * @param {{ demoToneFallback?: boolean }} [opts]
 */
export async function playWithProvider(player, provider, req, opts = {}) {
  const result = await provider.synthesize(req);
  if (result.error) {
    return applyComplianceGate(
      { kind: 'tts_play', error: result.error, detail: result },
      {},
    );
  }
  const payload = {
    ...result.payload,
    audioUrl: result.audioUrl || result.payload?.audioUrl || null,
  };
  const loaded = player.loadTts(payload, {
    emotion: req.emotion,
    text: req.text,
    attachAudio: true,
    demoTone: !payload.audioUrl && opts.demoToneFallback !== false,
  });
  if (!loaded.loaded) {
    return applyComplianceGate(
      { kind: 'tts_play', error: loaded.error || 'load_failed', loaded },
      {},
    );
  }
  // Prefer provider audio over demo tone
  if (result.audioUrl) {
    player.attachAudio(result.audioUrl, { sync: true });
  }
  const started = player.play();
  return applyComplianceGate(
    {
      kind: 'tts_play',
      ok: !!started,
      provider: result.provider,
      audioUrl: player.audioUrl,
      syncMode: player.syncMode,
      duration: player.duration,
      loaded,
    },
    {},
  );
}

export { ttsToSpeechContext, normalizeTtsPayload };
