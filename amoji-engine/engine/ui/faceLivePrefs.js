/**
 * Face Live UI prefs — session persistence via localStorage (browser) or memory (Node).
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';
import {
  matchDisneyExtremeHotkey,
  isDisneyExtremeNudgeHotkeyKey,
  disneyExtremeHistoryJumpIndex,
  buildDisneyExtremeLiveSnapshot,
  DISNEY_EXTREME_EASE_OVERDRIVE_GAIN,
  isDisneyExtremeSnapshotDirty,
  disneyExtremeSnapshotFingerprintShort,
} from '../layers/emotionMorphs.js';

export const FACE_LIVE_PREFS_KEY = 'amoji.faceLive.prefs.v1';
export const FACE_LIVE_PREFS_VERSION = 1;

/** @type {Record<string, any>|null} */
let memoryStore = null;

/**
 * Default prefs snapshot.
 */
export function defaultFaceLivePrefs() {
  return {
    version: FACE_LIVE_PREFS_VERSION,
    emotion: 'happy',
    intensity: 0.7,
    // Disney Extreme — separate shape multipliers + optional body/head deform.
    disneyExtreme: false,
    disneyExtremeFactor: 1.6,
    disneyExtremeBody: true,
    disneyExtremeBodyFactor: 1.6,
    disneyExtremeEyeFactor: 1.4,
    disneyExtremeMouthFactor: 1.5,
    personaId: 'companion',
    chassisId: 'desktop-buddy',
    robotPackId: 'face-servo-12',
    fingerPresetId: 'rest',
    liveLinkRemapId: 'identity',
    ttsPresetId: 'mock',
    ttsEndpoint: '',
    fingerEmblemSyncOn: true,
    audioSync: true,
    surfaceLevel: 6,
    probeToastSoundMuted: false,
    probeToastHapticMuted: false,
    probeToastLinkMute: true,
    probeToastVolume: 1,
  };
}

/**
 * Factory defaults for Disney Extreme × factors / body apply (master toggle excluded).
 */
export function disneyExtremeUiDefaults() {
  const d = defaultFaceLivePrefs();
  return {
    disneyExtremeFactor: d.disneyExtremeFactor,
    disneyExtremeBody: d.disneyExtremeBody,
    disneyExtremeBodyFactor: d.disneyExtremeBodyFactor,
    disneyExtremeEyeFactor: d.disneyExtremeEyeFactor,
    disneyExtremeMouthFactor: d.disneyExtremeMouthFactor,
  };
}

/**
 * Resolve Face Live Disney Extreme hotkey.
 * - `x` / `X` → toggle master
 * - `b` / `B` → toggle Apply to body/head (enables Extreme if needed)
 * - `h` / `H` / `?` → flash hotkey help on status
 * - `e` / `E` → flash ease curve label on status
 * - `Shift+E` → copy ease curve SVG to clipboard
 * - `m` / `M` → flash body mix label on status
 * - `Shift+M` → copy body mix SVG to clipboard
 * - `f` / `F` → flash factor bars label on status
 * - `Shift+F` → copy factor bars SVG to clipboard
 * - `n` / `N` → flash neck blend / body mix label on status
 * - `a` / `A` → flash combined Extreme bundle readout
 * - `Shift+A` → copy Extreme bundle text to clipboard
 * - `j` / `J` → copy Extreme snapshot JSON to clipboard
 * - `Shift+J` → paste / apply Extreme snapshot JSON from clipboard
 * - `d` / `D` → flash Extreme snapshot diff vs last copy/paste baseline
 * - `Shift+D` → restore Extreme factors from last copy/paste baseline
 * - `k` / `K` → clear Extreme snapshot baseline (dirty tracking off)
 * - `Shift+K` → clear Extreme baseline history + redo stacks (keep baseline)
 * - `p` / `P` → pin current Extreme factors as baseline
 * - `u` / `U` → undo Extreme baseline to previous history entry
 * - `Shift+U` → redo Extreme baseline from redo stack
 * - `y` / `Y` → copy Extreme snapshot share link (`#dxs=`)
 * - `l` / `L` → flash Extreme baseline history list
 * - `Shift+L` → copy Extreme baseline history JSON
 * - `i` / `I` → paste Extreme baseline history JSON from clipboard
 * - `Shift+I` → merge Extreme baseline history JSON into current stack
 * - `1`–`8` → jump to Extreme baseline history entry by index
 * - `Shift+1`–`8` → jump to Extreme baseline redo entry by index
 * - `Escape` → clear sticky status flash (only when a hold is active)
 * - `c` / `C` → copy Extreme prefs summary
 * - `Shift+C` → copy Extreme snapshot diff vs baseline
 * - `r` / `R` → reset × defaults
 * - `[` / `]` → nudge shape × (when Extreme is on; Shift = coarse 0.10; Alt = coarser 0.20)
 * - `-` / `=` → nudge body × (when Extreme is on; enables body apply if needed; Shift/Alt step)
 * - `,` / `.` → nudge eyes × (when Extreme is on; Shift/`</>` = coarse; Alt = coarser)
 * - `;` / `'` → nudge mouth × (when Extreme is on; Shift/Alt step)
 * Ignores when typing in form fields or with modifier keys (Escape exempt when holding; Shift/Alt allowed for nudge steps).
 * @param {KeyboardEvent|{ key?: string, metaKey?: boolean, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, target?: any, defaultPrevented?: boolean }} ev
 * @param {{ typing?: boolean, targetTag?: string, holdingStatus?: boolean }} [opts]
 * @returns {{ ok: boolean, action?: string, delta?: number, reason?: string }}
 */
export const DISNEY_EXTREME_FACTOR_STEP = 0.05;
export const DISNEY_EXTREME_FACTOR_COARSE_MULT = 2;
/** Alt nudge multiplier (0.20 steps). Takes precedence over Shift. */
export const DISNEY_EXTREME_FACTOR_COARSER_MULT = 4;
export const DISNEY_EXTREME_SHAPE_FACTOR_STEP = DISNEY_EXTREME_FACTOR_STEP;
export const DISNEY_EXTREME_SHAPE_FACTOR_MIN = 1;
export const DISNEY_EXTREME_SHAPE_FACTOR_MAX = 1.8;
export const DISNEY_EXTREME_BODY_FACTOR_MIN = 1;
export const DISNEY_EXTREME_BODY_FACTOR_MAX = 1.8;
export const DISNEY_EXTREME_EYE_FACTOR_MIN = 1;
export const DISNEY_EXTREME_EYE_FACTOR_MAX = 2.2;
export const DISNEY_EXTREME_MOUTH_FACTOR_MIN = 1;
export const DISNEY_EXTREME_MOUTH_FACTOR_MAX = 2.2;
/** Delay before held nudge keys start repeating. */
export const DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS = 320;
/** Interval between held nudge repeats. */
export const DISNEY_EXTREME_NUDGE_REPEAT_INTERVAL_MS = 55;

/**
 * Nudge step size — Shift ×2 (0.10), Alt ×4 (0.20; wins over Shift).
 * @param {boolean|{ shiftKey?: boolean, altKey?: boolean }} [shiftOrOpts]
 * @param {boolean} [altKey]
 * @returns {number}
 */
export function disneyExtremeNudgeStep(shiftOrOpts = false, altKey = false) {
  let shift = false;
  let alt = false;
  if (typeof shiftOrOpts === 'object' && shiftOrOpts) {
    shift = !!shiftOrOpts.shiftKey;
    alt = !!shiftOrOpts.altKey;
  } else {
    shift = !!shiftOrOpts;
    alt = !!altKey;
  }
  if (alt) return DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSER_MULT;
  if (shift) return DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSE_MULT;
  return DISNEY_EXTREME_FACTOR_STEP;
}

/**
 * @param {string|undefined} action
 * @returns {boolean}
 */
export function isDisneyExtremeNudgeAction(action) {
  return typeof action === 'string' && action.startsWith('nudge');
}

/**
 * Gate auto-repeat for Extreme factor nudge hotkeys.
 * First keydown always fires; repeats wait for initial delay then interval.
 * @param {{
 *   isRepeat?: boolean,
 *   startedMs?: number,
 *   lastFireMs?: number,
 *   nowMs?: number,
 *   initialMs?: number,
 *   intervalMs?: number,
 * }} [opts]
 * @returns {boolean}
 */
export function shouldRepeatDisneyExtremeNudge(opts = {}) {
  if (!opts.isRepeat) return true;
  const now = typeof opts.nowMs === 'number' ? opts.nowMs : 0;
  const started = typeof opts.startedMs === 'number' ? opts.startedMs : now;
  const last = typeof opts.lastFireMs === 'number' ? opts.lastFireMs : started;
  const initial =
    typeof opts.initialMs === 'number' && opts.initialMs >= 0
      ? opts.initialMs
      : DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS;
  const interval =
    typeof opts.intervalMs === 'number' && opts.intervalMs > 0
      ? opts.intervalMs
      : DISNEY_EXTREME_NUDGE_REPEAT_INTERVAL_MS;
  if (now - started < initial) return false;
  return now - last >= interval;
}

/** Short status flash while hold-nudging factors. */
export const DISNEY_EXTREME_NUDGE_FLASH_MS = 700;

/**
 * Status copy for a factor nudge flash.
 * Optional `delta` appends · Δstep when non-default (Shift/Alt coarse).
 * @param {string} action
 * @param {number|string} value
 * @param {{ delta?: number }} [opts]
 * @returns {string}
 */
export function formatDisneyExtremeNudgeFlash(action, value, opts = {}) {
  const v = typeof value === 'number' ? value : Number(value);
  const shown = Number.isFinite(v) ? v.toFixed(2) : '—';
  const a = String(action || '');
  let label = `× ${shown}`;
  if (a.includes('Shape')) label = `shape × ${shown}`;
  else if (a.includes('Body')) label = `body × ${shown}`;
  else if (a.includes('Eye')) label = `eye × ${shown}`;
  else if (a.includes('Mouth')) label = `mouth × ${shown}`;
  const absDelta =
    typeof opts.delta === 'number' && Number.isFinite(opts.delta)
      ? Math.abs(opts.delta)
      : null;
  if (
    absDelta != null &&
    absDelta > DISNEY_EXTREME_FACTOR_STEP + 1e-9
  ) {
    return `${label} · Δ${absDelta.toFixed(2)}`;
  }
  return label;
}

/**
 * Nudge / clamp a Disney Extreme factor slider value.
 * @param {number} current
 * @param {number} [delta]
 * @param {{ min?: number, max?: number, fallback?: number, step?: number }} [range]
 * @returns {number}
 */
export function nudgeDisneyExtremeFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP, range = {}) {
  const step =
    typeof range.step === 'number' && range.step > 0
      ? range.step
      : DISNEY_EXTREME_FACTOR_STEP;
  const min = typeof range.min === 'number' ? range.min : DISNEY_EXTREME_SHAPE_FACTOR_MIN;
  const max = typeof range.max === 'number' ? range.max : DISNEY_EXTREME_SHAPE_FACTOR_MAX;
  const fallback =
    typeof range.fallback === 'number' ? range.fallback : defaultFaceLivePrefs().disneyExtremeFactor;
  const d =
    typeof delta === 'number' && Number.isFinite(delta) ? delta : step;
  const raw =
    typeof current === 'number' && Number.isFinite(current) ? current : fallback;
  const next = Math.round((raw + d) / step) * step;
  return Math.max(min, Math.min(max, Number(next.toFixed(2))));
}

/**
 * Nudge / clamp Disney Extreme shape factor (slider range 1..1.8, step 0.05).
 * @param {number} current
 * @param {number} [delta]
 * @returns {number}
 */
export function nudgeDisneyExtremeShapeFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_SHAPE_FACTOR_MIN,
    max: DISNEY_EXTREME_SHAPE_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeFactor,
  });
}

/**
 * Nudge / clamp Disney Extreme body factor (1..1.8).
 * @param {number} current
 * @param {number} [delta]
 */
export function nudgeDisneyExtremeBodyFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_BODY_FACTOR_MIN,
    max: DISNEY_EXTREME_BODY_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeBodyFactor,
  });
}

/**
 * Nudge / clamp Disney Extreme eye factor (1..2.2).
 * @param {number} current
 * @param {number} [delta]
 */
export function nudgeDisneyExtremeEyeFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_EYE_FACTOR_MIN,
    max: DISNEY_EXTREME_EYE_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeEyeFactor,
  });
}

/**
 * Nudge / clamp Disney Extreme mouth factor (1..2.2).
 * @param {number} current
 * @param {number} [delta]
 */
export function nudgeDisneyExtremeMouthFactor(current, delta = DISNEY_EXTREME_FACTOR_STEP) {
  return nudgeDisneyExtremeFactor(current, delta, {
    min: DISNEY_EXTREME_MOUTH_FACTOR_MIN,
    max: DISNEY_EXTREME_MOUTH_FACTOR_MAX,
    fallback: defaultFaceLivePrefs().disneyExtremeMouthFactor,
  });
}

export function resolveDisneyExtremeHotkey(ev, opts = {}) {
  if (!ev || ev.defaultPrevented) return { ok: false, reason: 'none' };
  if (ev.metaKey || ev.ctrlKey) return { ok: false, reason: 'modifier' };
  const key = String(ev.key || '');
  if (key === 'Escape') {
    if (opts.holdingStatus) return { ok: true, action: 'clearStatusHold' };
    return { ok: false, reason: 'no_hold' };
  }
  const tag = String(opts.targetTag || ev.target?.tagName || '').toUpperCase();
  const typing =
    opts.typing === true ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    !!ev.target?.isContentEditable;
  if (typing) return { ok: false, reason: 'typing' };
  // Alt is reserved for coarser factor nudges — reject on letter/action hotkeys.
  if (ev.altKey && !isDisneyExtremeNudgeHotkeyKey(key)) {
    return { ok: false, reason: 'modifier' };
  }
  const matched = matchDisneyExtremeHotkey(key);
  if (!matched) return { ok: false, reason: 'key' };
  const { entry, dir } = matched;
  if (entry.kind === 'escape') {
    return { ok: false, reason: 'no_hold' };
  }
  if (entry.kind === 'action') {
    if (entry.id === 'showEaseCurve' && ev.shiftKey) {
      return { ok: true, action: 'copyEaseCurve' };
    }
    if (entry.id === 'showBodyMix' && ev.shiftKey) {
      return { ok: true, action: 'copyBodyMixCurve' };
    }
    if (entry.id === 'showFactorBars' && ev.shiftKey) {
      return { ok: true, action: 'copyFactorBars' };
    }
    if (entry.id === 'showBundle' && ev.shiftKey) {
      return { ok: true, action: 'copyBundle' };
    }
    if (entry.id === 'copySnapshotJson' && ev.shiftKey) {
      return { ok: true, action: 'pasteSnapshotJson' };
    }
    if (entry.id === 'showSnapshotDiff' && ev.shiftKey) {
      return { ok: true, action: 'restoreBaseline' };
    }
    if (entry.id === 'copySummary' && ev.shiftKey) {
      return { ok: true, action: 'copySnapshotDiff' };
    }
    if (entry.id === 'undoBaseline' && ev.shiftKey) {
      return { ok: true, action: 'redoBaseline' };
    }
    if (entry.id === 'showBaselineHistory' && ev.shiftKey) {
      return { ok: true, action: 'copyBaselineHistoryJson' };
    }
    if (entry.id === 'pasteBaselineHistoryJson' && ev.shiftKey) {
      return { ok: true, action: 'mergeBaselineHistoryJson' };
    }
    if (entry.id === 'clearBaseline' && ev.shiftKey) {
      return { ok: true, action: 'clearBaselineHistory' };
    }
    return { ok: true, action: entry.id };
  }
  if (entry.kind === 'jump') {
    if (ev.altKey) return { ok: false, reason: 'modifier' };
    const index = disneyExtremeHistoryJumpIndex(key);
    if (index == null) return { ok: false, reason: 'key' };
    if (ev.shiftKey) {
      return { ok: true, action: 'jumpBaselineRedo', index };
    }
    return { ok: true, action: 'jumpBaselineHistory', index };
  }
  if (entry.kind === 'nudge') {
    const step = disneyExtremeNudgeStep({
      shiftKey: !!ev.shiftKey,
      altKey: !!ev.altKey,
    });
    const factor = String(entry.factor || 'shape');
    const cap = factor.charAt(0).toUpperCase() + factor.slice(1);
    return {
      ok: true,
      action: `nudge${cap}${dir < 0 ? 'Down' : 'Up'}`,
      delta: dir < 0 ? -step : step,
    };
  }
  return { ok: false, reason: 'key' };
}

/**
 * One-line summary of Disney Extreme prefs (for landing toast / title tooltips).
 * When on, includes od/ease; overdrive recipe; body-on also appends mix + neck.
 * Optional `opts.baseline` appends dirty/clean + short fp.
 * @param {object} [prefs]
 * @param {{ baseline?: object|null }} [opts]
 * @returns {string}
 */
export function summarizeDisneyExtremePrefs(prefs, opts = {}) {
  const p = normalizeFaceLivePrefs(prefs);
  if (!p.disneyExtreme) return 'X off';
  const snap = buildDisneyExtremeLiveSnapshot({
    enabled: true,
    intensity: p.intensity,
    shapeFactor: p.disneyExtremeFactor,
    bodyOn: p.disneyExtremeBody,
    bodyFactor: p.disneyExtremeBodyFactor,
    eyeFactor: p.disneyExtremeEyeFactor,
    mouthFactor: p.disneyExtremeMouthFactor,
  });
  const body = snap.bodyOn
    ? `body×${Number(snap.bodyFactor).toFixed(2)}`
    : 'body off';
  /** @type {string[]} */
  const parts = [
    'X on',
    `shape×${Number(snap.shapeFactor).toFixed(2)}`,
    body,
    `eye×${Number(snap.eyeFactor).toFixed(2)}`,
    `mouth×${Number(snap.mouthFactor).toFixed(2)}`,
    `od×${DISNEY_EXTREME_EASE_OVERDRIVE_GAIN.toFixed(2)}`,
    `ease ${snap.ease.toFixed(2)}`,
  ];
  if (snap.shapeInt > 1 + 1e-9) {
    parts.push(`recipe ×${snap.recipe.toFixed(2)}`);
  }
  if (snap.bodyOn) {
    parts.push(`mix ${snap.bodyMix.toFixed(2)}`);
    parts.push(`neck ${snap.neckBlend.toFixed(2)}`);
  }
  if (opts.baseline) {
    const dirty = isDisneyExtremeSnapshotDirty(snap, opts.baseline);
    const fp = disneyExtremeSnapshotFingerprintShort(opts.baseline);
    parts.push(dirty ? `dirty ${fp}` : `clean ${fp}`);
  }
  return parts.join(' · ');
}

/**
 * @param {any} raw
 */
export function normalizeFaceLivePrefs(raw) {
  const base = defaultFaceLivePrefs();
  if (!raw || typeof raw !== 'object') return base;
  return {
    ...base,
    ...raw,
    version: FACE_LIVE_PREFS_VERSION,
    intensity:
      typeof raw.intensity === 'number'
        ? Math.max(0, Math.min(2.0, raw.intensity))
        : base.intensity,
    disneyExtreme: !!raw.disneyExtreme,
    disneyExtremeFactor:
      typeof raw.disneyExtremeFactor === 'number'
        ? Math.max(1, Math.min(1.8, raw.disneyExtremeFactor))
        : base.disneyExtremeFactor,
    disneyExtremeBody: raw.disneyExtremeBody !== false,
    disneyExtremeBodyFactor:
      typeof raw.disneyExtremeBodyFactor === 'number'
        ? Math.max(1, Math.min(1.8, raw.disneyExtremeBodyFactor))
        : base.disneyExtremeBodyFactor,
    disneyExtremeEyeFactor:
      typeof raw.disneyExtremeEyeFactor === 'number'
        ? Math.max(1, Math.min(2.2, raw.disneyExtremeEyeFactor))
        : base.disneyExtremeEyeFactor,
    disneyExtremeMouthFactor:
      typeof raw.disneyExtremeMouthFactor === 'number'
        ? Math.max(1, Math.min(2.2, raw.disneyExtremeMouthFactor))
        : base.disneyExtremeMouthFactor,
    fingerEmblemSyncOn: raw.fingerEmblemSyncOn !== false,
    audioSync: raw.audioSync !== false,
    surfaceLevel: Number(raw.surfaceLevel) || base.surfaceLevel,
    probeToastSoundMuted: !!raw.probeToastSoundMuted,
    probeToastHapticMuted: !!raw.probeToastHapticMuted,
    probeToastLinkMute: raw.probeToastLinkMute !== false,
    probeToastVolume:
      typeof raw.probeToastVolume === 'number'
        ? Math.max(0, Math.min(1, raw.probeToastVolume))
        : base.probeToastVolume,
  };
}

/**
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
function resolveStorage(opts = {}) {
  if (opts.storage) return opts.storage;
  if (opts.memory) return null;
  if (typeof localStorage !== 'undefined') return localStorage;
  return null;
}

/**
 * Load prefs (localStorage or in-memory fallback).
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
export function loadFaceLivePrefs(opts = {}) {
  const storage = resolveStorage(opts);
  try {
    if (storage) {
      const raw = storage.getItem(FACE_LIVE_PREFS_KEY);
      if (raw) {
        return applyComplianceGate(
          {
            kind: 'face_live_prefs',
            source: 'localStorage',
            prefs: normalizeFaceLivePrefs(JSON.parse(raw)),
          },
          {},
        );
      }
    } else if (memoryStore) {
      return applyComplianceGate(
        {
          kind: 'face_live_prefs',
          source: 'memory',
          prefs: normalizeFaceLivePrefs(memoryStore),
        },
        {},
      );
    }
  } catch {
    /* ignore corrupt */
  }
  return applyComplianceGate(
    {
      kind: 'face_live_prefs',
      source: 'default',
      prefs: defaultFaceLivePrefs(),
    },
    {},
  );
}

/**
 * Save prefs (merge with previous).
 * @param {Partial<ReturnType<typeof defaultFaceLivePrefs>>} partial
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
export function saveFaceLivePrefs(partial, opts = {}) {
  const prev = loadFaceLivePrefs(opts).prefs;
  const prefs = normalizeFaceLivePrefs({ ...prev, ...partial, updatedAt: Date.now() });
  const storage = resolveStorage(opts);
  try {
    if (storage) {
      storage.setItem(FACE_LIVE_PREFS_KEY, JSON.stringify(prefs));
    } else {
      memoryStore = prefs;
    }
  } catch {
    memoryStore = prefs;
  }
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_save',
      prefs,
      persisted: !!storage,
    },
    {},
  );
}

/**
 * Clear stored prefs.
 * @param {{ storage?: Storage|null, memory?: boolean }} [opts]
 */
export function clearFaceLivePrefs(opts = {}) {
  const storage = resolveStorage(opts);
  if (storage) storage.removeItem(FACE_LIVE_PREFS_KEY);
  memoryStore = null;
  return applyComplianceGate({ kind: 'face_live_prefs_clear', ok: true }, {});
}

/**
 * Compact prefs for URL hash (drop nullish / defaults where safe).
 * @param {object} prefs
 */
export function compactPrefsForHash(prefs) {
  const full = normalizeFaceLivePrefs(prefs);
  const base = defaultFaceLivePrefs();
  /** @type {Record<string, any>} */
  const out = {};
  for (const [k, v] of Object.entries(full)) {
    if (k === 'version' || k === 'updatedAt') continue;
    if (v === base[k]) continue;
    out[k] = v;
  }
  return out;
}

/**
 * Encode prefs → URL hash fragment (`#flp=...` base64url JSON).
 * @param {object} [prefs]
 */
export function encodePrefsHash(prefs) {
  const compact = compactPrefsForHash(prefs || defaultFaceLivePrefs());
  const json = JSON.stringify(compact);
  const b64 =
    typeof Buffer !== 'undefined'
      ? Buffer.from(json, 'utf8').toString('base64url')
      : btoa(unescape(encodeURIComponent(json)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/g, '');
  return `flp=${b64}`;
}

/**
 * Decode `#flp=...` or raw flp= payload → prefs.
 * @param {string} hashOrQuery
 */
export function decodePrefsHash(hashOrQuery) {
  if (!hashOrQuery || typeof hashOrQuery !== 'string') {
    return applyComplianceGate(
      { kind: 'face_live_prefs_hash', ok: false, error: 'empty' },
      {},
    );
  }
  let raw = hashOrQuery.replace(/^#/, '');
  const m = raw.match(/(?:^|&)?flp=([^&]+)/);
  if (m) raw = m[1];
  try {
    const pad = raw.length % 4 === 0 ? '' : '='.repeat(4 - (raw.length % 4));
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const json =
      typeof Buffer !== 'undefined'
        ? Buffer.from(b64, 'base64').toString('utf8')
        : decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(json);
    return applyComplianceGate(
      {
        kind: 'face_live_prefs_hash',
        ok: true,
        prefs: normalizeFaceLivePrefs(obj),
      },
      {},
    );
  } catch (err) {
    return applyComplianceGate(
      {
        kind: 'face_live_prefs_hash',
        ok: false,
        error: 'decode_failed',
        message: String(err?.message || err),
      },
      {},
    );
  }
}

/**
 * Read prefs from location.hash if present.
 * @param {{ hash?: string }} [loc]
 */
export function loadFaceLivePrefsFromHash(loc = {}) {
  const hash =
    loc.hash ||
    (typeof location !== 'undefined' ? location.hash : '') ||
    '';
  if (!hash.includes('flp=')) {
    return applyComplianceGate(
      { kind: 'face_live_prefs_hash', ok: false, error: 'no_flp' },
      {},
    );
  }
  return decodePrefsHash(hash);
}

/**
 * Build share URL with prefs in hash.
 * @param {object} prefs
 * @param {{ baseUrl?: string }} [opts]
 */
export function buildPrefsShareUrl(prefs, opts = {}) {
  const base =
    opts.baseUrl ||
    (typeof location !== 'undefined'
      ? `${location.origin}${location.pathname}${location.search}`
      : '');
  const frag = encodePrefsHash(prefs);
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_share',
      url: base ? `${base}#${frag}` : `#${frag}`,
      hash: frag,
    },
    {},
  );
}

/**
 * Export prefs as pretty JSON string (no secrets beyond optional endpoint).
 * @param {{ storage?: Storage|null, memory?: boolean, prefs?: object }} [opts]
 */
export function exportFaceLivePrefsJson(opts = {}) {
  const prefs = opts.prefs
    ? normalizeFaceLivePrefs(opts.prefs)
    : loadFaceLivePrefs(opts).prefs;
  const payload = {
    kind: 'amoji.faceLive.prefs',
    version: FACE_LIVE_PREFS_VERSION,
    exportedAt: new Date().toISOString(),
    prefs,
  };
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_export',
      json: JSON.stringify(payload, null, 2),
      prefs,
    },
    {},
  );
}

/**
 * Import prefs from JSON string or object; optionally persist.
 * @param {string|object} input
 * @param {{ storage?: Storage|null, memory?: boolean, persist?: boolean }} [opts]
 */
export function importFaceLivePrefsJson(input, opts = {}) {
  let parsed = input;
  try {
    if (typeof input === 'string') parsed = JSON.parse(input);
  } catch (err) {
    return applyComplianceGate(
      {
        kind: 'face_live_prefs_import',
        ok: false,
        error: 'invalid_json',
        message: String(err?.message || err),
      },
      {},
    );
  }
  if (!parsed || typeof parsed !== 'object') {
    return applyComplianceGate(
      { kind: 'face_live_prefs_import', ok: false, error: 'invalid_payload' },
      {},
    );
  }
  const rawPrefs = parsed.prefs && typeof parsed.prefs === 'object' ? parsed.prefs : parsed;
  const prefs = normalizeFaceLivePrefs(rawPrefs);
  if (opts.persist !== false) {
    saveFaceLivePrefs(prefs, opts);
  }
  return applyComplianceGate(
    {
      kind: 'face_live_prefs_import',
      ok: true,
      prefs,
      persisted: opts.persist !== false,
    },
    {},
  );
}
