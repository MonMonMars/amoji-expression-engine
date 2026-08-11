/**
 * Auto-dismiss timer with pause-on-hover for Face Live probe toast.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { PROBE_DETAIL_TOAST_DISMISS_MS } from '../tts/ttsHealthHistory.js';

/**
 * Map pointer enter/leave to pause / resume intents.
 * @param {string|{ type?: string }|null} ev
 * @param {{ visible?: boolean, paused?: boolean }} [opts]
 */
export function resolveProbeToastHoverPause(ev, opts = {}) {
  if (opts.visible === false) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_hover',
        ok: false,
        reason: 'toast_hidden',
        pause: false,
        resume: false,
      },
      {},
    );
  }
  const type =
    typeof ev === 'string'
      ? ev
      : ev?.type || (typeof ev === 'object' && ev?.event) || '';
  const t = String(type).toLowerCase();
  if (t === 'mouseenter' || t === 'pointerenter' || t === 'focusin') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_hover',
        ok: true,
        pause: true,
        resume: false,
        event: t,
        wasPaused: !!opts.paused,
      },
      {},
    );
  }
  if (t === 'mouseleave' || t === 'pointerleave' || t === 'focusout') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_hover',
        ok: true,
        pause: false,
        resume: true,
        event: t,
        wasPaused: !!opts.paused,
      },
      {},
    );
  }
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_hover',
      ok: false,
      reason: 'unbound',
      pause: false,
      resume: false,
      event: t || null,
    },
    {},
  );
}

/**
 * Remaining ms after a pause/resume segment.
 * @param {{ remainingMs: number, startedAt: number|null, now?: number, paused?: boolean }} state
 */
export function computeProbeToastRemainingMs(state = {}) {
  const now = state.now ?? Date.now();
  const remaining = Math.max(0, Number(state.remainingMs) || 0);
  if (state.paused || state.startedAt == null) return remaining;
  const elapsed = Math.max(0, now - state.startedAt);
  return Math.max(0, remaining - elapsed);
}

/**
 * Create a dismiss timer that can pause while the pointer is over the toast.
 * @param {{
 *   dismissMs?: number,
 *   setTimeout?: typeof setTimeout,
 *   clearTimeout?: typeof clearTimeout,
 *   now?: () => number,
 *   onExpire?: () => void,
 * }} [opts]
 */
export function createProbeToastDismissTimer(opts = {}) {
  const setT = opts.setTimeout || setTimeout;
  const clearT = opts.clearTimeout || clearTimeout;
  const nowFn = opts.now || (() => Date.now());
  let remainingMs = opts.dismissMs ?? PROBE_DETAIL_TOAST_DISMISS_MS;
  let startedAt = null;
  let paused = false;
  let active = false;
  /** @type {ReturnType<typeof setTimeout>|null} */
  let handle = null;

  const clearHandle = () => {
    if (handle != null) {
      clearT(handle);
      handle = null;
    }
  };

  const schedule = () => {
    clearHandle();
    if (!active || paused || remainingMs <= 0) {
      if (active && !paused && remainingMs <= 0 && typeof opts.onExpire === 'function') {
        active = false;
        opts.onExpire();
      }
      return;
    }
    startedAt = nowFn();
    handle = setT(() => {
      handle = null;
      remainingMs = 0;
      active = false;
      paused = false;
      startedAt = null;
      if (typeof opts.onExpire === 'function') opts.onExpire();
    }, remainingMs);
  };

  return {
    get active() {
      return active;
    },
    get paused() {
      return paused;
    },
    get remainingMs() {
      return computeProbeToastRemainingMs({
        remainingMs,
        startedAt,
        paused,
        now: nowFn(),
      });
    },
    start(ms) {
      clearHandle();
      remainingMs =
        typeof ms === 'number' && ms >= 0
          ? ms
          : opts.dismissMs ?? PROBE_DETAIL_TOAST_DISMISS_MS;
      paused = false;
      active = true;
      startedAt = null;
      schedule();
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_dismiss',
          action: 'start',
          ok: true,
          remainingMs,
          paused: false,
        },
        {},
      );
    },
    pause() {
      if (!active || paused) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_dismiss',
            action: 'pause',
            ok: active,
            reason: !active ? 'inactive' : 'already_paused',
            remainingMs: this.remainingMs,
            paused,
          },
          {},
        );
      }
      remainingMs = computeProbeToastRemainingMs({
        remainingMs,
        startedAt,
        paused: false,
        now: nowFn(),
      });
      clearHandle();
      startedAt = null;
      paused = true;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_dismiss',
          action: 'pause',
          ok: true,
          remainingMs,
          paused: true,
        },
        {},
      );
    },
    resume() {
      if (!active || !paused) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_dismiss',
            action: 'resume',
            ok: active,
            reason: !active ? 'inactive' : 'not_paused',
            remainingMs: this.remainingMs,
            paused,
          },
          {},
        );
      }
      paused = false;
      schedule();
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_dismiss',
          action: 'resume',
          ok: true,
          remainingMs,
          paused: false,
        },
        {},
      );
    },
    cancel() {
      clearHandle();
      active = false;
      paused = false;
      startedAt = null;
      remainingMs = 0;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_dismiss',
          action: 'cancel',
          ok: true,
          remainingMs: 0,
          paused: false,
        },
        {},
      );
    },
    handleHover(ev, hoverOpts = {}) {
      const resolved = resolveProbeToastHoverPause(ev, {
        visible: active || hoverOpts.visible,
        paused,
      });
      if (resolved.pause) return { ...resolved, timer: this.pause() };
      if (resolved.resume) return { ...resolved, timer: this.resume() };
      return resolved;
    },
  };
}
