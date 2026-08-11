/**
 * SpeechPlayer — realtime tick over performSpeech / TTS-normalized frames.
 * Drives mouth (and reports paralinguistic hooks) for Face Live / robot mouth.
 * Optional HTMLAudioElement sync: mouth clock follows audio.currentTime.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { performSpeech } from '../layers/performSpeech.js';
import { normalizeTtsPayload, ttsToSpeechContext } from './ttsAdapter.js';
import { paralinguisticToHook } from '../layers/phonemeTiming.js';
import { timingToneObjectUrl } from './demoAudio.js';

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
    /** @type {'clock'|'audio'} */
    this.syncMode = 'clock';
    /** @type {HTMLAudioElement|null} */
    this.audio = null;
    this.audioUrl = null;
    this._ownsAudioUrl = false;
    this._demoAudioUrl = null;
  }

  /**
   * Attach audio for sync. Pass URL string, HTMLAudioElement, or null to detach.
   * @param {string|HTMLAudioElement|null} src
   * @param {{ sync?: boolean }} [opts]
   */
  attachAudio(src, opts = {}) {
    this._revokeOwnedAudio();
    if (!src) {
      this.audio = null;
      this.audioUrl = null;
      this.syncMode = 'clock';
      return;
    }
    if (typeof HTMLAudioElement !== 'undefined' && src instanceof HTMLAudioElement) {
      this.audio = src;
      this.audioUrl = src.src || null;
    } else if (typeof Audio !== 'undefined') {
      this.audio = new Audio(String(src));
      this.audio.preload = 'auto';
      this.audioUrl = String(src);
    } else {
      // Node / non-DOM — keep URL for metadata only
      this.audio = null;
      this.audioUrl = String(src);
    }
    if (opts.sync !== false && this.audio) this.syncMode = 'audio';
  }

  /**
   * Create/attach a soft timing-tone WAV matching current performance duration.
   * Browser-only helper for demos without real TTS audio.
   */
  attachDemoTone() {
    if (!this.performance) return null;
    this._revokeOwnedAudio();
    const url = timingToneObjectUrl(this.duration || 0.5);
    this._demoAudioUrl = url;
    this._ownsAudioUrl = true;
    this.attachAudio(url, { sync: true });
    return url;
  }

  _revokeOwnedAudio() {
    if (this._ownsAudioUrl && this._demoAudioUrl && typeof URL !== 'undefined') {
      try {
        URL.revokeObjectURL(this._demoAudioUrl);
      } catch {
        /* ignore */
      }
    }
    this._ownsAudioUrl = false;
    this._demoAudioUrl = null;
  }

  /**
   * Load from raw TTS payload or already-normalized tts_payload.
   * @param {object} payload
   * @param {{ emotion?: string, intensity?: number, text?: string, attachAudio?: boolean, demoTone?: boolean }} [opts]
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

    if (opts.attachAudio !== false && normalized.audioUrl) {
      this.attachAudio(normalized.audioUrl, { sync: true });
    } else if (opts.demoTone && typeof Audio !== 'undefined') {
      this.attachDemoTone();
    }

    return applyComplianceGate(
      {
        kind: 'speech_player',
        loaded: true,
        provider: normalized.provider,
        duration: this.duration,
        frames: this.performance.frames?.length || 0,
        estimateSource: normalized.estimateSource,
        audioUrl: this.audioUrl || normalized.audioUrl,
        syncMode: this.syncMode,
      },
      {},
    );
  }

  /**
   * Load from plain text (estimates phonemes when no TTS stamps).
   * @param {string} text
   * @param {{ emotion?: string, intensity?: number, durationSec?: number, demoTone?: boolean }} [opts]
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
    if (this.audio && this.syncMode === 'audio') {
      try {
        this.audio.currentTime = this.t;
        const p = this.audio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch {
        /* autoplay may fail — fall back to clock */
        this.syncMode = 'clock';
      }
    }
    return true;
  }

  stop() {
    this.playing = false;
    this.t = 0;
    this.hookQueue = [];
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }

  pause() {
    this.playing = false;
    if (this.audio) {
      try {
        this.audio.pause();
      } catch {
        /* ignore */
      }
    }
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
          syncMode: this.syncMode,
        },
        {},
      );
    }

    if (this.syncMode === 'audio' && this.audio) {
      this.t = Number(this.audio.currentTime) || 0;
      if (this.audio.ended) this.t = Math.max(this.t, this.duration);
    } else {
      this.t += dt;
    }

    const done = this.t >= this.duration - 1e-3 || (this.audio && this.audio.ended);
    if (done) {
      this.playing = false;
      this.t = this.duration;
      if (this.audio && !this.audio.paused) {
        try {
          this.audio.pause();
        } catch {
          /* ignore */
        }
      }
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
        done: !!done,
        progress: this.duration > 0 ? Math.min(1, this.t / this.duration) : 1,
        syncMode: this.syncMode,
        audioDrift:
          this.syncMode === 'audio' && this.audio
            ? Number((this.audio.currentTime - this.t).toFixed(4))
            : 0,
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
