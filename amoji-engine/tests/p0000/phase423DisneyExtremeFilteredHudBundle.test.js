import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeHudBundleEntries,
  formatDisneyExtremeBaselineHudBundleLabel,
  formatDisneyExtremeBaselineHudBundleSummary,
  buildDisneyExtremeLiveSnapshot,
  DISNEY_EXTREME_HOTKEY_HELP,
} from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 423 Extreme filter-aware HUD bundle', () => {
  it('filters HUD bundle and summary by stripKeys', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.1,
    });
    const stacks = { history: [snap], redo: [], favorites: [snap] };
    const opts = {
      pin: snap,
      enabled: true,
      shapeFactor: snap.shapeFactor,
      bodyOn: snap.bodyOn,
      bodyFactor: snap.bodyFactor,
      eyeFactor: snap.eyeFactor,
      mouthFactor: snap.mouthFactor,
      shapeInt: snap.shapeInt,
      bodyInt: snap.bodyInt,
      neckBlend: snap.neckBlend,
      bodyMix: snap.bodyMix,
      filterQuery: 'pin',
      filterVisible: 1,
      filterTotal: 11,
      stripKeys: ['pin'],
    };
    expect(buildDisneyExtremeHudBundleEntries(stacks, opts)).toHaveLength(8);
    const summary = formatDisneyExtremeBaselineHudBundleSummary(stacks, opts);
    expect(summary).toContain('hud · filter · "pin" · 1/11 ·');
    const bundle = formatDisneyExtremeBaselineHudBundleLabel(stacks, opts);
    expect(bundle.split('\n')).toHaveLength(1);
    expect(bundle).toMatch(/^pin · /);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('hud bundle · filtered');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function disneyExtremeHudBundleFilterOpts');
    expect(src).toContain('disneyExtremeHudBundleFilterOpts()');
  });
});
