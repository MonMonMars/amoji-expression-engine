import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeSnapshotDiffLabel,
  isDisneyExtremeSnapshotDirty,
  buildDisneyExtremeLiveSnapshot,
  diffDisneyExtremeSnapshots,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 171 Extreme snapshot diff label + dirty', () => {
  it('formats match/dirty labels and dirty helper', () => {
    expect(formatDisneyExtremeSnapshotDiffLabel({ equal: true, changes: [] })).toBe(
      'diff · match',
    );
    expect(
      formatDisneyExtremeSnapshotDiffLabel({
        equal: false,
        changes: ['shapeFactor', 'bodyOn'],
      }),
    ).toBe('diff · shapeFactor · bodyOn');
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 1,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.6,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 1,
      shapeFactor: 1.7,
      bodyOn: true,
      bodyFactor: 1.6,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(isDisneyExtremeSnapshotDirty(a, null)).toBe(false);
    expect(isDisneyExtremeSnapshotDirty(a, a)).toBe(false);
    expect(isDisneyExtremeSnapshotDirty(a, b)).toBe(true);
    expect(formatDisneyExtremeSnapshotDiffLabel(diffDisneyExtremeSnapshots(a, b))).toContain(
      'shapeFactor',
    );
    expect(typeof engine.formatDisneyExtremeSnapshotDiffLabel).toBe('function');
    expect(typeof engine.isDisneyExtremeSnapshotDirty).toBe('function');
  });
});
