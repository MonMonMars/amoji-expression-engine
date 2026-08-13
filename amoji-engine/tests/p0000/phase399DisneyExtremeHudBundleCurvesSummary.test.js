import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineHudBundleSummary,
  buildDisneyExtremeLiveSnapshot,
  DISNEY_EXTREME_HOTKEY_HELP,
} from '../../engine/layers/emotionMorphs.js';

describe('Phase 399 Extreme HUD bundle summary includes curves', () => {
  it('appends curve strips to HUD one-line summary', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.5,
      shapeFactor: 1.2,
      bodyOn: true,
    });
    const summary = formatDisneyExtremeBaselineHudBundleSummary(
      { history: [snap], redo: [], favorites: [] },
      {
        pin: snap,
        hasBaseline: true,
        dirty: false,
        fp: 'abcd',
        enabled: true,
        shapeInt: snap.shapeInt,
        bodyOn: true,
        bodyInt: snap.bodyInt,
        neckBlend: snap.neckBlend,
        bodyMix: snap.bodyMix,
      },
    );
    expect(summary).toContain('curves ·');
    expect(summary).toMatch(/hud · .* · curves · /);
    expect(summary).toContain('factors ·');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'hud bundle · tips/roots/cap/active/pin/dirty/factors/curves',
    );
  });
});
