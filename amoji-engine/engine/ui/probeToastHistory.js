/**
 * Rolling history stack for Face Live probe toast details.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

export const PROBE_TOAST_HISTORY_MAX = 8;

/**
 * @param {object|null} detail
 * @param {{ now?: number }} [opts]
 */
export function normalizeProbeToastHistoryEntry(detail, opts = {}) {
  if (!detail || detail.ok === false) return null;
  return {
    id: detail.id || `probe-${opts.now ?? Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: typeof detail.at === 'number' ? detail.at : opts.now ?? Date.now(),
    detail,
  };
}

/**
 * Create a probe-toast history stack with back/forward cursor.
 * @param {{ max?: number }} [opts]
 */
export function createProbeToastHistory(opts = {}) {
  const max = Math.max(2, opts.max ?? PROBE_TOAST_HISTORY_MAX);
  /** @type {NonNullable<ReturnType<typeof normalizeProbeToastHistoryEntry>>[]} */
  let entries = [];
  let index = -1;

  return {
    get size() {
      return entries.length;
    },
    get index() {
      return index;
    },
    get canBack() {
      return index > 0;
    },
    get canForward() {
      return index >= 0 && index < entries.length - 1;
    },
    get current() {
      return index >= 0 ? entries[index] : null;
    },
    get previous() {
      return index > 0 ? entries[index - 1] : null;
    },
    get canCompare() {
      return index > 0;
    },
    list() {
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_history',
          action: 'list',
          ok: true,
          entries: entries.slice(),
          index,
          count: entries.length,
          canBack: index > 0,
          canForward: index >= 0 && index < entries.length - 1,
        },
        {},
      );
    },
    push(detail, pushOpts = {}) {
      const entry = normalizeProbeToastHistoryEntry(detail, {
        now: pushOpts.now,
      });
      if (!entry) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_history',
            action: 'push',
            ok: false,
            reason: 'invalid_detail',
            entry: null,
            index,
            count: entries.length,
          },
          {},
        );
      }
      if (index < entries.length - 1) {
        entries = entries.slice(0, index + 1);
      }
      entries.push(entry);
      while (entries.length > max) {
        entries.shift();
      }
      index = entries.length - 1;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_history',
          action: 'push',
          ok: true,
          entry,
          index,
          count: entries.length,
          canBack: index > 0,
          canForward: false,
        },
        {},
      );
    },
    back() {
      if (index <= 0) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_history',
            action: 'back',
            ok: false,
            reason: 'at_start',
            entry: this.current,
            index,
            canBack: false,
            canForward: this.canForward,
          },
          {},
        );
      }
      index -= 1;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_history',
          action: 'back',
          ok: true,
          entry: entries[index],
          detail: entries[index].detail,
          index,
          count: entries.length,
          canBack: index > 0,
          canForward: true,
        },
        {},
      );
    },
    forward() {
      if (index < 0 || index >= entries.length - 1) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_history',
            action: 'forward',
            ok: false,
            reason: 'at_end',
            entry: this.current,
            index,
            canBack: this.canBack,
            canForward: false,
          },
          {},
        );
      }
      index += 1;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_history',
          action: 'forward',
          ok: true,
          entry: entries[index],
          detail: entries[index].detail,
          index,
          count: entries.length,
          canBack: true,
          canForward: index < entries.length - 1,
        },
        {},
      );
    },
    clear() {
      entries = [];
      index = -1;
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_history',
          action: 'clear',
          ok: true,
          count: 0,
          index: -1,
        },
        {},
      );
    },
  };
}
