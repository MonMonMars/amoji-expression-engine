import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineCopyFlashLabel,
  formatDisneyExtremeBaselineAllStripsLabel,
  formatDisneyExtremeBaselineHudBundleLabel,
  formatDisneyExtremeBaselineHudBundleSummary,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 429 Extreme empty-filter copy polish', () => {
  it('formats empty/open copy flashes and HUD empty bundle', () => {
    expect(
      formatDisneyExtremeBaselineCopyFlashLabel({
        ok: false,
        empty: true,
        open: true,
        summary: 'all · filter · "zzz" · none',
      }),
    ).toBe('empty · open · all · filter · "zzz" · none');
    expect(
      formatDisneyExtremeBaselineCopyFlashLabel({
        ok: true,
        open: true,
        summary: 'all · hist 0/8',
      }),
    ).toBe('copied · open · all · hist 0/8');
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.1,
    });
    const stacks = { history: [snap], redo: [], favorites: [] };
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
      filterQuery: 'zzz',
      filterVisible: 0,
      filterTotal: 11,
      stripKeys: [],
    };
    expect(
      formatDisneyExtremeBaselineHudBundleLabel(stacks, opts),
    ).toBe('');
    expect(
      formatDisneyExtremeBaselineHudBundleSummary(stacks, opts),
    ).toContain('hud · filter · "zzz" · none');
    expect(
      formatDisneyExtremeBaselineAllStripsLabel(stacks, opts),
    ).toContain('filter · "zzz" · none');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('formatDisneyExtremeBaselineCopyFlashLabel');
    expect(src).toContain('const empty = !String(text');
  });
});
