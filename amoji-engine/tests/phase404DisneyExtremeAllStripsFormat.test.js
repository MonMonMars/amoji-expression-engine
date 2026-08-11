import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineAllStripsLabel,
  formatDisneyExtremeBaselineAllStripsBundle,
  buildDisneyExtremeLiveSnapshot,
  DISNEY_EXTREME_HOTKEY_HELP,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 404 Extreme all-strips formatters', () => {
  it('formats all-strips summary and 10-line clipboard bundle', () => {
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
      fp: 'all1',
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
    const summary = formatDisneyExtremeBaselineAllStripsLabel(stacks, opts);
    expect(summary.startsWith('all ·')).toBe(true);
    expect(summary).toContain('factors ·');
    expect(summary).toContain('curves ·');
    const bundle = formatDisneyExtremeBaselineAllStripsBundle(stacks, opts);
    const lines = bundle.split('\n');
    expect(lines).toHaveLength(10);
    expect(lines[0]).toMatch(/^tips · /);
    expect(lines[6]).toMatch(/^factors · /);
    expect(lines[7]).toMatch(/^ease · /);
    expect(lines[8]).toMatch(/^mix · /);
    expect(lines[9]).toMatch(/^neck · /);
    expect(typeof engine.formatDisneyExtremeBaselineAllStripsLabel).toBe(
      'function',
    );
    expect(typeof engine.formatDisneyExtremeBaselineAllStripsBundle).toBe(
      'function',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('all strips · bundle');
  });
});
