import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeBaselineChipCompareLabel,
  disneyExtremeSnapshotFingerprint,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 251 Extreme chip↔chip compare label', () => {
  it('formats A↔B chip compare and documents Shift+Alt+click', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.7,
      shapeFactor: 1.4,
      bodyOn: false,
      bodyFactor: 1.4,
      eyeFactor: 1.3,
      mouthFactor: 1.4,
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.9,
      shapeFactor: 1.7,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.6,
      mouthFactor: 1.7,
    });
    expect(
      formatDisneyExtremeBaselineChipCompareLabel(null, b),
    ).toContain('no A');
    const same = formatDisneyExtremeBaselineChipCompareLabel(a, a, {
      aIndex: 1,
      bIndex: 2,
    });
    expect(same).toContain('compare ·');
    expect(same).toContain('↔');
    expect(same).toContain('diff · match');
    const diff = formatDisneyExtremeBaselineChipCompareLabel(a, b, {
      aIndex: 1,
      bIndex: 2,
      aKind: 'hist',
      bKind: 'redo',
    });
    expect(diff).toContain('R#2');
    expect(diff).not.toContain('diff · match');
    expect(disneyExtremeSnapshotFingerprint(a)).not.toBe(
      disneyExtremeSnapshotFingerprint(b),
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'Shift+Alt+click chip compare',
    );
    expect(typeof engine.formatDisneyExtremeBaselineChipCompareLabel).toBe(
      'function',
    );
  });
});
