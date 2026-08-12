import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineAllStripsLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 420 Extreme filter-aware all-strips flash/copy', () => {
  it('embeds filter bit in label and wires face-live opts', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.4,
      shapeFactor: 1.1,
    });
    const label = formatDisneyExtremeBaselineAllStripsLabel(
      { history: [snap], redo: [], favorites: [] },
      {
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
      },
    );
    expect(label).toContain('all · filter · "pin" · 1/11 ·');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('function disneyExtremeAllStripsVisibleKeys');
    expect(src).toContain('stripKeys: disneyExtremeAllStripsVisibleKeys()');
    expect(src).toContain('filterQuery: q');
    expect(src).toContain('filtered bundle when filter active');
  });
});
