import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeSnapshotDiffCopyText,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 186 Extreme snapshot diff copy text', () => {
  it('formats no-baseline, match, and field change lines', () => {
    expect(formatDisneyExtremeSnapshotDiffCopyText(null, null)).toBe(
      'diff · no baseline',
    );
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const match = formatDisneyExtremeSnapshotDiffCopyText(a, a);
    expect(match).toContain('diff · match · clean · fp');
    expect(match).not.toContain('\n');
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.7,
      bodyOn: false,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const text = formatDisneyExtremeSnapshotDiffCopyText(b, a);
    expect(text).toContain('diff · bodyOn · shapeFactor · dirty · fp');
    expect(text).toContain('shapeFactor: 1.60 → 1.70');
    expect(text).toContain('bodyOn: on → off');
    expect(typeof engine.formatDisneyExtremeSnapshotDiffCopyText).toBe(
      'function',
    );
  });
});
