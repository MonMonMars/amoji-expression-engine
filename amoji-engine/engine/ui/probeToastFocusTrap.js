/**
 * Focus trap helpers for Face Live probe detail toast.
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

/**
 * Cycle focus index within a focusable set (Tab / Shift+Tab).
 * @param {number} count
 * @param {number} index
 * @param {boolean} [shiftKey]
 */
export function cycleProbeToastFocusIndex(count, index, shiftKey = false) {
  const n = Math.max(0, Number(count) || 0);
  if (n <= 0) return 0;
  const i = ((Number(index) || 0) % n + n) % n;
  if (shiftKey) return (i - 1 + n) % n;
  return (i + 1) % n;
}

/**
 * Resolve whether a keydown should trap focus inside the probe toast.
 * @param {{ key?: string, shiftKey?: boolean }|string|null} ev
 * @param {{
 *   visible?: boolean,
 *   focusableCount?: number,
 *   activeIndex?: number,
 * }} [opts]
 */
export function resolveProbeToastFocusTrap(ev, opts = {}) {
  if (opts.visible === false) {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_focus_trap',
        ok: false,
        reason: 'toast_hidden',
        trap: false,
        nextIndex: null,
      },
      {},
    );
  }
  const key = typeof ev === 'string' ? ev : ev?.key || '';
  if (key !== 'Tab') {
    return applyComplianceGate(
      {
        kind: 'tts_gateway_health_probe_toast_focus_trap',
        ok: false,
        reason: 'not_tab',
        trap: false,
        nextIndex: null,
        key: key || null,
      },
      {},
    );
  }
  const count = Math.max(0, opts.focusableCount ?? 0);
  const activeIndex = opts.activeIndex ?? 0;
  const shiftKey = typeof ev === 'object' && ev ? !!ev.shiftKey : false;
  const nextIndex = cycleProbeToastFocusIndex(count, activeIndex, shiftKey);
  return applyComplianceGate(
    {
      kind: 'tts_gateway_health_probe_toast_focus_trap',
      ok: true,
      trap: count > 0,
      nextIndex: count > 0 ? nextIndex : null,
      activeIndex,
      shiftKey,
      key: 'Tab',
    },
    {},
  );
}

/**
 * DOM-backed focus trap for the probe toast element.
 * @param {{ document?: Document }} [opts]
 */
export function createProbeToastFocusTrap(opts = {}) {
  const doc = opts.document || (typeof document !== 'undefined' ? document : null);
  /** @type {HTMLElement|null} */
  let root = null;
  /** @type {Element|null} */
  let previous = null;
  let active = false;

  const focusables = () => {
    if (!root) return [];
    return Array.from(root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(
      (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
    );
  };

  return {
    get active() {
      return active;
    },
    get root() {
      return root;
    },
    activate(el) {
      root = el || null;
      previous = doc?.activeElement || null;
      active = !!root;
      const list = focusables();
      if (list[0] && typeof list[0].focus === 'function') list[0].focus();
      if (root) {
        root.setAttribute('aria-modal', 'true');
        root.setAttribute('role', 'alertdialog');
      }
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_focus_trap',
          action: 'activate',
          ok: active,
          focusableCount: list.length,
        },
        {},
      );
    },
    deactivate() {
      if (root) {
        root.setAttribute('role', 'status');
        root.removeAttribute('aria-modal');
      }
      active = false;
      root = null;
      const restore = previous;
      previous = null;
      if (restore && typeof restore.focus === 'function') {
        try {
          restore.focus();
        } catch {
          /* detached */
        }
      }
      return applyComplianceGate(
        {
          kind: 'tts_gateway_health_probe_toast_focus_trap',
          action: 'deactivate',
          ok: true,
        },
        {},
      );
    },
    handleKeydown(ev) {
      if (!active) {
        return applyComplianceGate(
          {
            kind: 'tts_gateway_health_probe_toast_focus_trap',
            ok: false,
            reason: 'inactive',
            trap: false,
          },
          {},
        );
      }
      const list = focusables();
      const activeEl = doc?.activeElement;
      const activeIndex = Math.max(0, list.indexOf(activeEl));
      const resolved = resolveProbeToastFocusTrap(ev, {
        visible: true,
        focusableCount: list.length,
        activeIndex: activeIndex >= 0 ? activeIndex : 0,
      });
      if (!resolved.ok || !resolved.trap || resolved.nextIndex == null) return resolved;
      const next = list[resolved.nextIndex];
      if (next && typeof next.focus === 'function') next.focus();
      if (typeof ev?.preventDefault === 'function') ev.preventDefault();
      return resolved;
    },
  };
}
