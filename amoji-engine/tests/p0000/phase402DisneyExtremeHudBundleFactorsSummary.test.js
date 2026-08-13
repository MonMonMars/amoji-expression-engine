import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineHudBundleSummary,
  buildDisneyExtremeLiveSnapshot,
  DISNEY_EXTREME_HOTKEY_HELP,
} from '../../engine/layers/emotionMorphs.js';

describe('Phase 402 Extreme HUD bundle summary includes factors', () => {
  it('appends factors strip to HUD one-line summary', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.5,
      shapeFactor: 1.3,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.5,
      mouthFactor: 1.6,
    });
    const summary = formatDisneyExtremeBaselineHudBundleSummary(
      { history: [snap], redo: [], favorites: [] },
      {
        pin: snap,
        hasBaseline: true,
        dirty: false,
        fp: 'fac1',
        enabled: true,
        shapeFactor: snap.shapeFactor,
        bodyOn: true,
        bodyFactor: snap.bodyFactor,
        eyeFactor: snap.eyeFactor,
        mouthFactor: snap.mouthFactor,
        shapeInt: snap.shapeInt,
        bodyInt: snap.bodyInt,
        neckBlend: snap.neckBlend,
        bodyMix: snap.bodyMix,
      },
    );
    expect(summary).toContain('factors ·');
    expect(summary).toMatch(/shape×1\.30/);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'hud bundle · tips/roots/cap/active/pin/dirty/factors/curves',
    );
  });
});
