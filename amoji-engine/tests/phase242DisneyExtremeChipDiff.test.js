import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBaselineChipDiffLabel,
  disneyExtremeSnapshotFingerprintShort,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 242 Extreme baseline chip diff label', () => {
  it('labels match/mismatch vs live current', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const fp = disneyExtremeSnapshotFingerprintShort(snap);
    expect(
      formatDisneyExtremeBaselineChipDiffLabel(snap, snap, { index: 1 }),
    ).toContain('chip · #1');
    expect(
      formatDisneyExtremeBaselineChipDiffLabel(snap, snap, { index: 1 }),
    ).toContain('diff · match');
    const dirty = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(
      formatDisneyExtremeBaselineChipDiffLabel(dirty, snap, {
        index: 2,
        kind: 'redo',
      }),
    ).toMatch(/chip · R#2/);
    expect(
      formatDisneyExtremeBaselineChipDiffLabel(dirty, snap, {
        index: 2,
        kind: 'redo',
      }),
    ).toContain('diff ·');
    expect(formatDisneyExtremeBaselineChipDiffLabel(snap, null)).toContain(
      'invalid',
    );
    expect(fp).toBeTruthy();
    expect(typeof engine.formatDisneyExtremeBaselineChipDiffLabel).toBe(
      'function',
    );
  });
});
