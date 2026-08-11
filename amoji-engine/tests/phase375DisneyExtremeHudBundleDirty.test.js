import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineHudBundleSummary,
  formatDisneyExtremeBaselineHudBundleLabel,
  buildDisneyExtremeLiveSnapshot,
  DISNEY_EXTREME_HOTKEY_HELP,
} from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 375 Extreme HUD bundle includes dirty', () => {
  it('appends dirty strip to HUD summary and clipboard bundle', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.1,
    });
    const summary = formatDisneyExtremeBaselineHudBundleSummary(
      { history: [snap], redo: [], favorites: [] },
      {
        pin: snap,
        hasBaseline: true,
        dirty: true,
        changeCount: 2,
        fp: 'cafe',
      },
    );
    expect(summary).toContain('dirty · dirty×2 · fp cafe');
    expect(summary).toContain('curves ·');
    expect(summary).toContain('factors ·');
    const bundle = formatDisneyExtremeBaselineHudBundleLabel(
      { history: [snap], redo: [], favorites: [] },
      {
        pin: snap,
        hasBaseline: true,
        dirty: false,
        fp: 'cafe',
      },
    );
    expect(bundle.split('\n')).toHaveLength(8);
    expect(bundle.split('\n')[5]).toBe('dirty · clean · fp cafe');
    expect(bundle.split('\n')[6]).toMatch(/^factors · /);
    expect(bundle.split('\n')[7]).toMatch(/^curves · /);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'hud bundle · tips/roots/cap/active/pin/dirty/factors/curves',
    );
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('disneyExtremeDirtyStripOpts()');
    expect(src).toContain('changeCount: dirty.changeCount');
  });
});
