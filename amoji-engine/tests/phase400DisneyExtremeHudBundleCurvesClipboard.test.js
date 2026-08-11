import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineHudBundleLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 400 Extreme HUD bundle clipboard includes curves', () => {
  it('appends curves line to HUD clipboard bundle and Face Live passes curve opts', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.1,
    });
    const bundle = formatDisneyExtremeBaselineHudBundleLabel(
      { history: [snap], redo: [], favorites: [] },
      {
        pin: snap,
        hasBaseline: true,
        dirty: true,
        changeCount: 1,
        fp: 'beef',
        enabled: snap.enabled,
        shapeInt: snap.shapeInt,
        bodyOn: snap.bodyOn,
        bodyInt: snap.bodyInt,
        neckBlend: snap.neckBlend,
        bodyMix: snap.bodyMix,
      },
    );
    const lines = bundle.split('\n');
    expect(lines).toHaveLength(7);
    expect(lines[6]).toMatch(/^curves · /);
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('disneyExtremeCurveStripOpts()');
    expect(src).toContain('neckBlend: curves.neckBlend');
  });
});
