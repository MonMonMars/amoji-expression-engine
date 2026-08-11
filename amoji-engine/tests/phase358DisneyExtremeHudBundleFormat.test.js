import { describe, expect, it } from 'vitest';
import {
  formatDisneyExtremeBaselineHudBundleSummary,
  formatDisneyExtremeBaselineHudBundleLabel,
  buildDisneyExtremeLiveSnapshot,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 358 Extreme HUD bundle formatters', () => {
  it('formats one-line summary and multiline clipboard bundle', () => {
    const snap = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.5,
      shapeFactor: 1.2,
    });
    const stacks = {
      history: [snap],
      redo: [],
      favorites: [snap],
    };
    const opts = {
      historyIndex: 0,
      redoIndex: null,
      favoriteIndex: 0,
      pin: snap,
    };
    const summary = formatDisneyExtremeBaselineHudBundleSummary(stacks, opts);
    expect(summary.startsWith('hud ·')).toBe(true);
    expect(summary).toContain('hist 1/8');
    expect(summary).toContain('active ·');
    expect(summary).toContain('pin ·');
    expect(summary).toContain('dirty ·');
    expect(summary).toContain('curves ·');
    expect(summary).toContain('factors ·');
    const bundle = formatDisneyExtremeBaselineHudBundleLabel(stacks, opts);
    expect(bundle).toContain('tips ·');
    expect(bundle).toContain('roots ·');
    expect(bundle).toContain('stacks ·');
    expect(bundle).toContain('active ·');
    expect(bundle).toContain('pin ·');
    expect(bundle).toContain('dirty ·');
    expect(bundle).toContain('factors ·');
    expect(bundle).toContain('curves ·');
    expect(bundle.split('\n')).toHaveLength(8);
    expect(typeof engine.formatDisneyExtremeBaselineHudBundleSummary).toBe(
      'function',
    );
    expect(typeof engine.formatDisneyExtremeBaselineHudBundleLabel).toBe(
      'function',
    );
  });
});
