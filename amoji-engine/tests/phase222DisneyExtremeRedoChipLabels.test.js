import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBaselineHistoryEntry,
  formatDisneyExtremeBaselineHistoryList,
  disneyExtremeSnapshotFingerprintShort,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 222 Extreme redo history chips labels', () => {
  it('formats R#n entries and includes redo chips in list', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.5,
      bodyOn: false,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const fp = disneyExtremeSnapshotFingerprintShort(snap);
    expect(
      formatDisneyExtremeBaselineHistoryEntry(snap, {
        index: 1,
        compact: true,
        kind: 'redo',
      }),
    ).toBe(`R#1 ${fp}`);
    expect(
      formatDisneyExtremeBaselineHistoryList([], { redo: [snap] }),
    ).toContain(`R#1 ${fp}`);
    expect(
      formatDisneyExtremeBaselineHistoryList([], { redo: [snap] }),
    ).toContain('⇧L copy');
    expect(typeof engine.formatDisneyExtremeBaselineHistoryEntry).toBe(
      'function',
    );
  });
});
