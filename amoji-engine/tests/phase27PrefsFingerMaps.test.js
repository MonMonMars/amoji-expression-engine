import { describe, expect, it } from 'vitest';
import {
  defaultFaceLivePrefs,
  normalizeFaceLivePrefs,
  loadFaceLivePrefs,
  saveFaceLivePrefs,
  clearFaceLivePrefs,
  FACE_LIVE_PREFS_KEY,
} from '../engine/ui/faceLivePrefs.js';
import {
  syncAffectToFinger,
  syncAdaptorToFinger,
  fingerPresetForAffect,
  fingerPresetForAdaptor,
} from '../engine/export/emblemFingerSync.js';
import { listFingerPresets, resolveFingerPreset } from '../engine/export/fingerPresets.js';

describe('Phase 27 Face Live prefs', () => {
  it('normalizes and clamps intensity', () => {
    const n = normalizeFaceLivePrefs({ intensity: 9, emotion: 'sad' });
    expect(n.intensity).toBe(1.25);
    expect(n.emotion).toBe('sad');
    expect(n.version).toBe(defaultFaceLivePrefs().version);
  });

  it('saves and loads via memory store', () => {
    clearFaceLivePrefs({ memory: true });
    saveFaceLivePrefs(
      { emotion: 'angry', chassisId: 'lab-humanoid-demo', liveLinkRemapId: 'sakura-expression' },
      { memory: true },
    );
    const loaded = loadFaceLivePrefs({ memory: true });
    expect(loaded.source).toBe('memory');
    expect(loaded.prefs.emotion).toBe('angry');
    expect(loaded.prefs.chassisId).toBe('lab-humanoid-demo');
    expect(loaded.prefs.liveLinkRemapId).toBe('sakura-expression');
    clearFaceLivePrefs({ memory: true });
    expect(loadFaceLivePrefs({ memory: true }).source).toBe('default');
  });

  it('uses Storage mock like localStorage', () => {
    /** @type {Record<string, string>} */
    const bag = {};
    const storage = {
      getItem: (k) => (k in bag ? bag[k] : null),
      setItem: (k, v) => {
        bag[k] = String(v);
      },
      removeItem: (k) => {
        delete bag[k];
      },
    };
    saveFaceLivePrefs({ fingerPresetId: 'fists', ttsPresetId: 'gateway-step' }, { storage });
    expect(bag[FACE_LIVE_PREFS_KEY]).toBeTruthy();
    const loaded = loadFaceLivePrefs({ storage });
    expect(loaded.source).toBe('localStorage');
    expect(loaded.prefs.fingerPresetId).toBe('fists');
    expect(loaded.prefs.ttsPresetId).toBe('gateway-step');
    clearFaceLivePrefs({ storage });
    expect(bag[FACE_LIVE_PREFS_KEY]).toBeUndefined();
  });
});

describe('Phase 27 affect/adaptor finger maps', () => {
  it('lists new chin-rest / self-hug / fists presets', () => {
    const ids = listFingerPresets().map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining(['chin-rest', 'self-hug', 'fists', 'thumbs-up']),
    );
  });

  it('maps affect emotions to finger presets', () => {
    expect(fingerPresetForAffect('thinking')).toBe('chin-rest');
    expect(fingerPresetForAffect('angry')).toBe('fists');
    expect(fingerPresetForAffect('sad')).toBe('self-hug');
    const synced = syncAffectToFinger('thinking');
    expect(synced.synced).toBe(true);
    expect(synced.fingerPresetId).toBe('chin-rest');
    expect(resolveFingerPreset('chin-rest').gesture.fist).toBeGreaterThan(0.2);
  });

  it('maps adaptors to finger presets', () => {
    expect(fingerPresetForAdaptor('fistClench')).toBe('fists');
    expect(fingerPresetForAdaptor('chinTouch')).toBe('chin-rest');
    const synced = syncAdaptorToFinger('armsSelfHug');
    expect(synced.synced).toBe(true);
    expect(synced.fingerPresetId).toBe('self-hug');
  });
});
