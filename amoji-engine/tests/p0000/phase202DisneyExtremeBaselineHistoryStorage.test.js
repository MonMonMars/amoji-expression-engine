import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineHistory,
  saveDisneyExtremeBaselineHistory,
  loadDisneyExtremeBaselineHistory,
  clearDisneyExtremeBaselineHistoryStorage,
  DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY,
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

describe('Phase 202 Extreme baseline history session storage', () => {
  it('saves, loads, and clears history via injected storage', () => {
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
    const hist = pushDisneyExtremeBaselineHistory(
      pushDisneyExtremeBaselineHistory([], a),
      b,
    );
    expect(saveDisneyExtremeBaselineHistory(hist, { storage }).ok).toBe(true);
    expect(
      storage.getItem(DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY),
    ).toBeTruthy();
    const loaded = loadDisneyExtremeBaselineHistory({ storage });
    expect(loaded).toHaveLength(2);
    expect(disneyExtremeSnapshotFingerprint(loaded[1])).toBe(
      disneyExtremeSnapshotFingerprint(b),
    );
    clearDisneyExtremeBaselineHistoryStorage({ storage });
    expect(loadDisneyExtremeBaselineHistory({ storage })).toEqual([]);
    expect(engine.DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY).toBe(
      DISNEY_EXTREME_BASELINE_HISTORY_STORAGE_KEY,
    );
  });
});
