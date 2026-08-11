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
  };
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
        ? Math.max(0, Math.min(1.25, raw.intensity))
        : base.intensity,
    fingerEmblemSyncOn: raw.fingerEmblemSyncOn !== false,
    audioSync: raw.audioSync !== false,
    surfaceLevel: Number(raw.surfaceLevel) || base.surfaceLevel,
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
