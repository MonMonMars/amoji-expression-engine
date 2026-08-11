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

/**
 * Resolve whether / how to play a probe toast sound cue.
 * @param {{
 *   enabled?: boolean,
 *   tone?: string|null,
 *   muted?: boolean,
 *   event?: string,
 * }} [opts]
 */
export function resolveProbeToastSound(opts = {}) {
  if (opts.enabled === false || opts.muted) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_sound',
        ok: false,
        play: false,
        reason: opts.muted ? 'muted' : 'disabled',
        frequencyHz: null,
        durationMs: 0,
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
      gain: 0.035,
      event: 'show',
    },
    {},
  );
}

/**
 * Create a tiny oscillator cue player (Web Audio).
 * @param {{
 *   enabled?: boolean,
 *   AudioContext?: typeof AudioContext,
 *   now?: () => number,
 * }} [opts]
 */
export function createProbeToastSound(opts = {}) {
  let enabled = opts.enabled !== false;
  let muted = false;
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
    /**
     * @param {{ tone?: string, event?: string }} [playOpts]
     */
    play(playOpts = {}) {
      const resolved = resolveProbeToastSound({
        enabled,
        muted,
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
        const g = resolved.gain ?? 0.035;
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
