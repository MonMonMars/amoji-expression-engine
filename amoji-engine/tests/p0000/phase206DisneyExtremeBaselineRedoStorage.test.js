import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineHistory,
  saveDisneyExtremeBaselineRedo,
  loadDisneyExtremeBaselineRedo,
  clearDisneyExtremeBaselineRedoStorage,
  DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

function memoryStorage() {
  /** @type {Map<string, string>} */
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => {
      map.set(k, String(v));
    },
    removeItem: (k) => {
      map.delete(k);
    },
  };
}

describe('Phase 206 Extreme baseline redo session storage', () => {
  it('saves, loads, and clears redo via injected storage', () => {
    const storage = memoryStorage();
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: false,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const redo = pushDisneyExtremeBaselineHistory(
      pushDisneyExtremeBaselineHistory([], a),
      b,
    );
    expect(saveDisneyExtremeBaselineRedo(redo, { storage }).ok).toBe(true);
    expect(
      storage.getItem(DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY),
    ).toBeTruthy();
    const loaded = loadDisneyExtremeBaselineRedo({ storage });
    expect(loaded).toHaveLength(2);
    expect(disneyExtremeSnapshotFingerprint(loaded[1])).toBe(
      disneyExtremeSnapshotFingerprint(b),
    );
    clearDisneyExtremeBaselineRedoStorage({ storage });
    expect(loadDisneyExtremeBaselineRedo({ storage })).toEqual([]);
    expect(engine.DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY).toBe(
      DISNEY_EXTREME_BASELINE_REDO_STORAGE_KEY,
    );
  });
});
