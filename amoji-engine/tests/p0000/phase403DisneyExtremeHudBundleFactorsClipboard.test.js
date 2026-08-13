import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineHudBundleLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('Phase 403 Extreme HUD bundle clipboard includes factors', () => {
  it('inserts factors line before curves in HUD clipboard bundle', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.2,
    });
    const bundle = formatDisneyExtremeBaselineHudBundleLabel(
      { history: [snap], redo: [], favorites: [] },
      {
        pin: snap,
        hasBaseline: true,
        dirty: true,
        changeCount: 1,
        fp: 'fac2',
        enabled: snap.enabled,
        shapeFactor: snap.shapeFactor,
        bodyOn: snap.bodyOn,
        bodyFactor: snap.bodyFactor,
        eyeFactor: snap.eyeFactor,
        mouthFactor: snap.mouthFactor,
        shapeInt: snap.shapeInt,
        bodyInt: snap.bodyInt,
        neckBlend: snap.neckBlend,
        bodyMix: snap.bodyMix,
      },
    );
    const lines = bundle.split('\n');
    expect(lines).toHaveLength(8);
    expect(lines[6]).toMatch(/^factors · /);
    expect(lines[7]).toMatch(/^curves · /);
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('shapeFactor: factors.shapeFactor');
    expect(src).toContain('eyeFactor: factors.eyeFactor');
  });
});
