import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeAllStripsEntries,
  formatDisneyExtremeBaselineAllStripsBundle,
  buildDisneyExtremeLiveSnapshot,
} from '../../engine/layers/emotionMorphs.js';

describe('Phase 419 Extreme filtered all-strips bundle', () => {
  it('filters bundle lines by stripKeys and keeps default 11 lines', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.5,
      shapeFactor: 1.2,
      bodyOn: true,
    });
    const stacks = { history: [snap], redo: [], favorites: [snap] };
    const opts = {
      historyIndex: 0,
      favoriteIndex: 0,
      pin: snap,
      hasBaseline: true,
      dirty: false,
      fp: 'flt1',
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
    };
    const entries = buildDisneyExtremeAllStripsEntries(stacks, opts);
    expect(entries.some((e) => e.key === 'curves')).toBe(true);
    expect(entries.some((e) => e.key === 'summary')).toBe(true);

    const full = formatDisneyExtremeBaselineAllStripsBundle(stacks, opts);
    expect(full.split('\n')).toHaveLength(11);

    const filtered = formatDisneyExtremeBaselineAllStripsBundle(stacks, {
      ...opts,
      stripKeys: ['pin', 'dirty'],
    });
    const lines = filtered.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^pin · /);
    expect(lines[1]).toMatch(/^dirty · /);

    const curvesOnly = formatDisneyExtremeBaselineAllStripsBundle(stacks, {
      ...opts,
      stripKeys: ['curves'],
    });
    expect(curvesOnly.split('\n')).toHaveLength(1);
    expect(curvesOnly).toMatch(/^curves · /);
  });
});
