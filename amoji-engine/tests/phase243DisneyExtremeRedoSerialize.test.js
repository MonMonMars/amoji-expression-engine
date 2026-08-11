import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineHistory,
  serializeDisneyExtremeBaselineRedo,
  parseDisneyExtremeBaselineRedo,
  DISNEY_EXTREME_BASELINE_REDO_JSON_KIND,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 243 Extreme baseline redo JSON serialize/parse', () => {
  it('round-trips redo JSON and rejects bad kind', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const redo = pushDisneyExtremeBaselineHistory([], a);
    const raw = serializeDisneyExtremeBaselineRedo(redo, { pretty: true });
    const parsed = parseDisneyExtremeBaselineRedo(raw);
    expect(parsed.ok).toBe(true);
    expect(parsed.redo).toHaveLength(1);
    expect(JSON.parse(raw).kind).toBe(DISNEY_EXTREME_BASELINE_REDO_JSON_KIND);
    expect(parseDisneyExtremeBaselineRedo('').error).toBe('empty');
    expect(
      parseDisneyExtremeBaselineRedo(
        JSON.stringify({ kind: 'nope', items: [] }),
      ).error,
    ).toBe('kind');
    expect(typeof engine.serializeDisneyExtremeBaselineRedo).toBe('function');
    expect(typeof engine.parseDisneyExtremeBaselineRedo).toBe('function');
  });
});
