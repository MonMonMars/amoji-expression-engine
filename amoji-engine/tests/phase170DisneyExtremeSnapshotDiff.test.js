import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  diffDisneyExtremeSnapshots,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 170 Extreme snapshot diff', () => {
  it('reports equal and lists changed fields', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const same = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.6,
      bodyOn: true,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    expect(diffDisneyExtremeSnapshots(a, same)).toEqual({
      equal: true,
      changes: [],
    });
    const b = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.7,
      bodyOn: false,
      bodyFactor: 1.5,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const diff = diffDisneyExtremeSnapshots(a, b);
    expect(diff.equal).toBe(false);
    expect(diff.changes).toContain('shapeFactor');
    expect(diff.changes).toContain('bodyOn');
    expect(typeof engine.diffDisneyExtremeSnapshots).toBe('function');
  });
});
