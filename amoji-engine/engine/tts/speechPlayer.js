/**
 * SpeechPlayer — realtime tick over performSpeech / TTS-normalized frames.
 * Drives mouth (and reports paralinguistic hooks) for Face Live / robot mouth.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { performSpeech } from '../layers/performSpeech.js';
import { normalizeTtsPayload, ttsToSpeechContext } from './ttsAdapter.js';
import { paralinguisticToHook } from '../layers/phonemeTiming.js';

/**
 * Pick frame nearest to time t.
 * @param {Array<{ meta?: { t?: number }, t?: number }>} frames
 * @param {number} t
 */
export function frameAtTime(frames, t) {
  if (!frames?.length) return null;
  let best = frames[0];
  let bestD = Infinity;
  for (const f of frames) {
    const ft = f.meta?.t ?? f.t ?? 0;
    const d = Math.abs(ft - t);
    if (d < bestD) {
      bestD = d;
      best = f;
    }
  }
  return best;
}

export class SpeechPlayer {
  /**
   * @param {{ emotion?: string, intensity?: number, fps?: number }} [opts]
   */
  constructor(opts = {}) {
    this.emotion = opts.emotion || 'happy';
    this.intensity = opts.intensity ?? 0.7;
    this.fps = opts.fps ?? 30;
    /** @type {ReturnType<typeof performSpeech>|null} */
    this.performance = null;
    this.playing = false;
    this.t = 0;
    this.duration = 0;
    /** @type {Set<string>} */
    this._firedHooks = new Set();
    /** @type {object[]} */
    this.hookQueue = [];
  }

  /**
   * Load from raw TTS payload or already-normalized tts_payload.
   * @param {object} payload
   * @param {{ emotion?: string, intensity?: number, text?: string }} [opts]
   */
  loadTts(payload, opts = {}) {
    if (opts.emotion) this.emotion = opts.emotion;
    if (typeof opts.intensity === 'number') this.intensity = opts.intensity;
    const { ok, context, normalized, error } = ttsToSpeechContext(payload, {
      text: opts.text,
      fps: this.fps,
      emotion: this.emotion,
      intensity: this.intensity,
    });
    if (!ok) {
      this.performance = null;
      return applyComplianceGate(
        { kind: 'speech_player', error: error || 'load_failed', normalized },
        {},
      );
    }
    const text = normalized.text || opts.text || '';
    this.performance = performSpeech(text, this.emotion, this.intensity, context);
    this.duration = this.performance.duration || normalized.duration || 0;
    this.t = 0;
    this.playing = false;
    this._firedHooks = new Set();
    this.hookQueue = [];
    return applyComplianceGate(
      {
        kind: 'speech_player',
        loaded: true,
        provider: normalized.provider,
        duration: this.duration,
        frames: this.performance.frames?.length || 0,
        estimateSource: normalized.estimateSource,
        audioUrl: normalized.audioUrl,
      },
      {},
    );
  }

  /**
   * Load from plain text (estimates phonemes when no TTS stamps).
   * @param {string} text
   * @param {{ emotion?: string, intensity?: number, durationSec?: number }} [opts]
   */
  loadText(text, opts = {}) {
    return this.loadTts(
      {
        provider: 'generic',
        text,
        duration: opts.durationSec,
      },
      opts,
    );
  }

  play() {
    if (!this.performance) return false;
    this.playing = true;
    if (this.t >= this.duration) this.t = 0;
    this._firedHooks = new Set();
    return true;
  }

  stop() {
    this.playing = false;
    this.t = 0;
    this.hookQueue = [];
  }

  pause() {
    this.playing = false;
  }

  /**
   * @param {number} dt
   */
  tick(dt) {
    if (!this.performance || !this.playing) {
      return applyComplianceGate(
        {
          kind: 'speech_tick',
          playing: false,
          t: this.t,
          mouth: null,
          viseme: 'REST',
          hooks: [],
          done: !this.performance,
        },
        {},
      );
    }

    this.t += dt;
    const done = this.t >= this.duration;
    if (done) {
      this.playing = false;
      this.t = this.duration;
    }

    const frame = frameAtTime(this.performance.frames, this.t);
    const mouth = frame?.meta?.mouth || frame?.mouth || null;
    const viseme = frame?.meta?.viseme || mouth?.viseme || 'REST';
    const params = frame?.params || null;

    /** @type {object[]} */
    const hooks = [];
    for (const ev of this.performance.paralinguistics || []) {
      const key = `${ev.tag}@${ev.t}`;
      if (ev.t <= this.t && !this._firedHooks.has(key)) {
        this._firedHooks.add(key);
        const hook = { ...ev, ...paralinguisticToHook(ev.tag, { arousal: this.intensity }) };
        hooks.push(hook);
        this.hookQueue.push(hook);
      }
    }

    return applyComplianceGate(
      {
        kind: 'speech_tick',
        playing: this.playing,
        t: Number(this.t.toFixed(4)),
        duration: this.duration,
        mouth,
        viseme,
        params,
        hooks,
        done,
        progress: this.duration > 0 ? Math.min(1, this.t / this.duration) : 1,
      },
      {},
    );
  }

  /**
   * Drain queued hooks (laugh / sigh) for gesture/body layers.
   */
  consumeHooks() {
    const q = this.hookQueue;
    this.hookQueue = [];
    return q;
  }
}

export { normalizeTtsPayload, ttsToSpeechContext };
