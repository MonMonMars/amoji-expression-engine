import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  buildDisneyExtremeLiveSnapshot,
  saveDisneyExtremeBaseline,
  loadDisneyExtremeBaseline,
  clearDisneyExtremeBaselineStorage,
  DISNEY_EXTREME_BASELINE_STORAGE_KEY,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../../prototypes/face-live.html', import.meta.url),
);

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

describe('Phase 185 Extreme baseline session storage', () => {
  it('saves, loads, and clears baseline via injected storage', () => {
    const storage = memoryStorage();
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const saved = saveDisneyExtremeBaseline(snap, { storage });
    expect(saved.ok).toBe(true);
    expect(storage.getItem(DISNEY_EXTREME_BASELINE_STORAGE_KEY)).toBeTruthy();
    const loaded = loadDisneyExtremeBaseline({ storage });
    expect(disneyExtremeSnapshotFingerprint(loaded)).toBe(
      disneyExtremeSnapshotFingerprint(snap),
    );
    clearDisneyExtremeBaselineStorage({ storage });
    expect(loadDisneyExtremeBaseline({ storage })).toBe(null);
    expect(engine.DISNEY_EXTREME_BASELINE_STORAGE_KEY).toBe(
      DISNEY_EXTREME_BASELINE_STORAGE_KEY,
    );
    expect(typeof engine.saveDisneyExtremeBaseline).toBe('function');
  });

  it('Face Live persists baseline on copy/paste/clear and restores on load', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('loadDisneyExtremeBaseline()');
    expect(src).toContain('saveDisneyExtremeBaseline(snap)');
    expect(src).toContain('setDisneyExtremeBaseline(snap)');
    expect(src).toContain('setDisneyExtremeBaseline(parsed.snap)');
    expect(src).toContain('clearDisneyExtremeBaselineStorage()');
  });
});
