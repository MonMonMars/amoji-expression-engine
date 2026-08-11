import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  formatDisneyExtremeSnapshotPreviewLabel,
  disneyExtremeSnapshotFingerprintShort,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 190 Extreme snapshot preview label', () => {
  it('formats off and on preview copy with fp', () => {
    expect(formatDisneyExtremeSnapshotPreviewLabel(null)).toBe(
      'preview · invalid',
    );
    const off = buildDisneyExtremeLiveSnapshot({ enabled: false });
    expect(formatDisneyExtremeSnapshotPreviewLabel(off)).toBe(
      `preview · off · fp ${disneyExtremeSnapshotFingerprintShort(off)}`,
    );
    const on = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const label = formatDisneyExtremeSnapshotPreviewLabel(on);
    expect(label).toContain('preview · shape×1.60');
    expect(label).toContain('body×1.50');
    expect(label).toContain('eye×1.40');
    expect(label).toContain('mouth×1.50');
    expect(label).toContain(
      `fp ${disneyExtremeSnapshotFingerprintShort(on)}`,
    );
    expect(typeof engine.formatDisneyExtremeSnapshotPreviewLabel).toBe(
      'function',
    );
  });
});
