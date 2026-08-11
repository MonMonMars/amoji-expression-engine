/**
 * Optional vibration stub for Face Live probe toast show/hide.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

/** Vibration patterns (ms) by toast tone. */
export const PROBE_TOAST_HAPTIC_PATTERN = {
  ok: 12,
  warn: [8, 40, 8],
  bad: [12, 35, 12, 35, 12],
  default: 10,
};

/**
 * Resolve whether / how to trigger a probe toast haptic cue.
 * @param {{
 *   enabled?: boolean,
 *   tone?: string|null,
 *   event?: string,
 * }} [opts]
 */
export function resolveProbeToastHaptic(opts = {}) {
  if (opts.enabled === false) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_haptic',
        ok: false,
        vibrate: false,
        reason: 'disabled',
        pattern: null,
      },
      {},
    );
  }
  const event = opts.event || 'show';
  if (event !== 'show') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_haptic',
        ok: false,
        vibrate: false,
        reason: 'event',
        event,
        pattern: null,
      },
      {},
    );
  }
  const tone = opts.tone || 'default';
  const pattern =
    PROBE_TOAST_HAPTIC_PATTERN[tone] || PROBE_TOAST_HAPTIC_PATTERN.default;
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_haptic',
      ok: true,
      vibrate: true,
      tone,
      pattern,
      event: 'show',
    },
    {},
  );
}

/**
 * Create a navigator.vibrate stub player for probe toast cues.
 * @param {{
 *   enabled?: boolean,
 *   vibrate?: ((pattern: number|number[]) => boolean) | null,
 * }} [opts]
 */
export function createProbeToastHaptic(opts = {}) {
  let enabled = opts.enabled !== false;
  const vibrateFn =
    opts.vibrate ??
    (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
      ? navigator.vibrate.bind(navigator)
      : null);

  return {
    get enabled() {
      return enabled;
    },
    setEnabled(on) {
      enabled = !!on;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_haptic',
          action: 'set_enabled',
          ok: true,
          enabled,
        },
        {},
      );
    },
    /**
     * @param {{ tone?: string, event?: string }} [playOpts]
     */
    play(playOpts = {}) {
      const resolved = resolveProbeToastHaptic({
        enabled,
        tone: playOpts.tone,
        event: playOpts.event || 'show',
      });
      if (!resolved.vibrate) return resolved;
      if (!vibrateFn) {
        return applyComplianceGate(
          {
            ...resolved,
            ok: false,
            vibrate: false,
            reason: 'no_vibrate_api',
          },
          {},
        );
      }
      try {
        const ok = !!vibrateFn(resolved.pattern);
        return applyComplianceGate(
          {
            ...resolved,
            vibrated: ok,
          },
          {},
        );
      } catch (err) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_haptic',
            ok: false,
            vibrate: false,
            reason: 'error',
            error: String(err?.message || err),
          },
          {},
        );
      }
    },
  };
}
