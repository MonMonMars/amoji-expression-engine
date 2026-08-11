import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBaselineHistoryEntry,
  formatDisneyExtremeBaselineHistoryList,
  disneyExtremeSnapshotFingerprintShort,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 218 Extreme baseline history list labels', () => {
  it('formats entry + empty/full list with redo depth', () => {
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
      formatDisneyExtremeBaselineHistoryEntry(snap, {
        index: 2,
        compact: true,
      }),
    ).toBe(`#2 ${fp}`);
    expect(
      formatDisneyExtremeBaselineHistoryEntry(snap, { index: 1 }),
    ).toContain(`#1 fp ${fp}`);
    expect(formatDisneyExtremeBaselineHistoryEntry(null)).toBe('—');
    expect(formatDisneyExtremeBaselineHistoryList([])).toBe(
      'hist · empty · U undo · ⇧U redo · L list · ⇧L copy',
    );
    expect(
      formatDisneyExtremeBaselineHistoryList([snap], { redoDepth: 1 }),
    ).toBe(
      `hist 1 · redo 1 · #1 ${fp} · U undo · ⇧U redo · L list · ⇧L copy`,
    );
    expect(typeof engine.formatDisneyExtremeBaselineHistoryList).toBe(
      'function',
    );
  });
});
