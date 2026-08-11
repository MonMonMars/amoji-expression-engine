/**
 * Subtle Web Audio cue for Face Live probe toast show/hide.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

/** Default cue frequencies (Hz) by toast tone. */
export const PROBE_TOAST_SOUND_FREQ = {
  ok: 880,
  warn: 660,
  bad: 420,
  default: 720,
};

/** Base oscillator gain before volume multiplier. */
export const PROBE_TOAST_SOUND_BASE_GAIN = 0.035;

/** Volume multiplier applied while the toast is pinned (ducked). */
export const PROBE_TOAST_SOUND_DUCK_FACTOR = 0.35;

/**
 * Clamp toast cue volume to [0, 1].
 * @param {unknown} value
 * @param {number} [fallback=1]
 */
export function clampProbeToastVolume(value, fallback = 1) {
  const n = Number(value);
  if (!Number.isFinite(n)) return Math.min(1, Math.max(0, fallback));
  return Math.min(1, Math.max(0, n));
}

/**
 * Effective playback volume after optional pin-duck.
 * @param {{ volume?: number, ducked?: boolean, duckFactor?: number }} [opts]
 */
export function effectiveProbeToastVolume(opts = {}) {
  const volume = clampProbeToastVolume(opts.volume, 1);
  if (!opts.ducked) return volume;
  const factor = clampProbeToastVolume(
    opts.duckFactor ?? PROBE_TOAST_SOUND_DUCK_FACTOR,
    PROBE_TOAST_SOUND_DUCK_FACTOR,
  );
  return clampProbeToastVolume(volume * factor, 0);
}

/**
 * Resolve whether / how to play a probe toast sound cue.
 * @param {{
 *   enabled?: boolean,
 *   tone?: string|null,
 *   muted?: boolean,
 *   volume?: number,
 *   ducked?: boolean,
 *   duckFactor?: number,
 *   event?: string,
 * }} [opts]
 */
export function resolveProbeToastSound(opts = {}) {
  const baseVolume = clampProbeToastVolume(opts.volume, 1);
  const ducked = !!opts.ducked;
  const volume = effectiveProbeToastVolume({
    volume: baseVolume,
    ducked,
    duckFactor: opts.duckFactor,
  });
  if (opts.enabled === false || opts.muted) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_sound',
        ok: false,
        play: false,
        reason: opts.muted ? 'muted' : 'disabled',
        frequencyHz: null,
        durationMs: 0,
        volume,
        baseVolume,
        ducked,
      },
      {},
    );
  }
  const event = opts.event || 'show';
  if (event !== 'show') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_sound',
        ok: false,
        play: false,
        reason: 'event',
        event,
        frequencyHz: null,
        durationMs: 0,
        volume,
        baseVolume,
        ducked,
      },
      {},
    );
  }
  if (volume <= 0) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_sound',
        ok: false,
        play: false,
        reason: 'volume',
        frequencyHz: null,
        durationMs: 0,
        volume: 0,
        baseVolume,
        ducked,
      },
      {},
    );
  }
  const tone = opts.tone || 'default';
  const frequencyHz =
    PROBE_TOAST_SOUND_FREQ[tone] || PROBE_TOAST_SOUND_FREQ.default;
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_sound',
      ok: true,
      play: true,
      tone,
      frequencyHz,
      durationMs: 90,
      volume,
      baseVolume,
      ducked,
      duckFactor: ducked
        ? clampProbeToastVolume(
            opts.duckFactor ?? PROBE_TOAST_SOUND_DUCK_FACTOR,
            PROBE_TOAST_SOUND_DUCK_FACTOR,
          )
        : 1,
      gain: PROBE_TOAST_SOUND_BASE_GAIN * volume,
      event: 'show',
    },
    {},
  );
}

/**
 * Create a tiny oscillator cue player (Web Audio).
 * @param {{
 *   enabled?: boolean,
 *   volume?: number,
 *   duckFactor?: number,
 *   AudioContext?: typeof AudioContext,
 *   now?: () => number,
 * }} [opts]
 */
export function createProbeToastSound(opts = {}) {
  let enabled = opts.enabled !== false;
  let muted = false;
  let volume = clampProbeToastVolume(opts.volume, 1);
  let ducked = false;
  const duckFactor = clampProbeToastVolume(
    opts.duckFactor ?? PROBE_TOAST_SOUND_DUCK_FACTOR,
    PROBE_TOAST_SOUND_DUCK_FACTOR,
  );
  /** @type {AudioContext|null} */
  let ctx = null;
  const AC =
    opts.AudioContext ||
    (typeof globalThis !== 'undefined'
      ? globalThis.AudioContext || globalThis.webkitAudioContext
      : null);

  const ensureCtx = () => {
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    return ctx;
  };

  return {
    get enabled() {
      return enabled;
    },
    get muted() {
      return muted;
    },
    get volume() {
      return volume;
    },
    get ducked() {
      return ducked;
    },
    get duckFactor() {
      return duckFactor;
    },
    setEnabled(on) {
      enabled = !!on;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_sound',
          action: 'set_enabled',
          ok: true,
          enabled,
        },
        {},
      );
    },
    setMuted(on) {
      muted = !!on;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_sound',
          action: 'set_muted',
          ok: true,
          muted,
        },
        {},
      );
    },
    toggleMute() {
      muted = !muted;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_sound',
          action: 'toggle_mute',
          ok: true,
          muted,
        },
        {},
      );
    },
    /**
     * @param {number} next
     */
    setVolume(next) {
      volume = clampProbeToastVolume(next, volume);
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_sound',
          action: 'set_volume',
          ok: true,
          volume,
        },
        {},
      );
    },
    /**
     * Duck cue level while toast is pinned.
     * @param {boolean} on
     */
    setDucked(on) {
      ducked = !!on;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_sound',
          action: 'set_ducked',
          ok: true,
          ducked,
          duckFactor,
        },
        {},
      );
    },
    duck() {
      return this.setDucked(true);
    },
    unduck() {
      return this.setDucked(false);
    },
    /**
     * @param {{ tone?: string, event?: string, volume?: number, ducked?: boolean }} [playOpts]
     */
    play(playOpts = {}) {
      const resolved = resolveProbeToastSound({
        enabled,
        muted,
        volume:
          playOpts.volume != null
            ? clampProbeToastVolume(playOpts.volume, volume)
            : volume,
        ducked: playOpts.ducked != null ? !!playOpts.ducked : ducked,
        duckFactor,
        tone: playOpts.tone,
        event: playOpts.event || 'show',
      });
      if (!resolved.play) return resolved;
      try {
        const audio = ensureCtx();
        if (!audio) {
          return applyComplianceGate(
            {
              ...resolved,
              ok: false,
              play: false,
              reason: 'no_audio_context',
            },
            {},
          );
        }
        if (audio.state === 'suspended' && typeof audio.resume === 'function') {
          audio.resume();
        }
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.type = 'sine';
        osc.frequency.value = resolved.frequencyHz;
        const t0 = audio.currentTime;
        const dur = (resolved.durationMs || 90) / 1000;
        const g = resolved.gain ?? PROBE_TOAST_SOUND_BASE_GAIN;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(g, t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
        return applyComplianceGate(
          {
            ...resolved,
            played: true,
          },
          {},
        );
      } catch (err) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_sound',
            ok: false,
            play: false,
            reason: 'error',
            error: String(err?.message || err),
          },
          {},
        );
      }
    },
  };
}
