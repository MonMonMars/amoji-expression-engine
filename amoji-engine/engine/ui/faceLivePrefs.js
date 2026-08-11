/**
 * Face Live UI prefs — session persistence via localStorage (browser) or memory (Node).
 */
import { applyComplianceGate } from '../compliance/complianceGate.js';

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
 * Resolve Face Live Disney Extreme hotkey (plain `x` / `X` toggles master).
 * Ignores when typing in form fields or with modifier keys.
 * @param {KeyboardEvent|{ key?: string, metaKey?: boolean, ctrlKey?: boolean, altKey?: boolean, target?: any, defaultPrevented?: boolean }} ev
 * @param {{ typing?: boolean, targetTag?: string }} [opts]
 * @returns {{ ok: boolean, action?: 'toggle', reason?: string }}
 */
export function resolveDisneyExtremeHotkey(ev, opts = {}) {
  if (!ev || ev.defaultPrevented) return { ok: false, reason: 'none' };
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return { ok: false, reason: 'modifier' };
  const key = String(ev.key || '');
  if (key !== 'x' && key !== 'X') return { ok: false, reason: 'key' };
  const tag = String(opts.targetTag || ev.target?.tagName || '').toUpperCase();
  const typing =
    opts.typing === true ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    !!ev.target?.isContentEditable;
  if (typing) return { ok: false, reason: 'typing' };
  return { ok: true, action: 'toggle' };
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
