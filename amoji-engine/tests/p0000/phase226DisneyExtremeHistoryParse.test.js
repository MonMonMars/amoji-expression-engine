import { describe, expect, it } from 'vitest';
import {
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineHistory,
  serializeDisneyExtremeBaselineHistory,
  parseDisneyExtremeBaselineHistory,
  DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND,
} from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 226 Extreme baseline history JSON parse', () => {
  it('round-trips serialize → parse and rejects bad kind', () => {
    const a = buildDisneyExtremeLiveSnapshot({
      enabled: true,
      intensity: 0.8,
      shapeFactor: 1.5,
      bodyOn: true,
      bodyFactor: 1.4,
      eyeFactor: 1.4,
      mouthFactor: 1.5,
    });
    const hist = pushDisneyExtremeBaselineHistory([], a);
    const raw = serializeDisneyExtremeBaselineHistory(hist);
    const parsed = parseDisneyExtremeBaselineHistory(raw);
    expect(parsed.ok).toBe(true);
    expect(parsed.history).toHaveLength(1);
    expect(parsed.history[0].shapeFactor).toBeCloseTo(1.5);
    expect(parseDisneyExtremeBaselineHistory('').error).toBe('empty');
    expect(parseDisneyExtremeBaselineHistory('{').error).toBe('invalid_json');
    expect(
      parseDisneyExtremeBaselineHistory(
        JSON.stringify({ kind: 'nope', items: [] }),
      ).error,
    ).toBe('kind');
    expect(
      parseDisneyExtremeBaselineHistory({
        kind: DISNEY_EXTREME_BASELINE_HISTORY_JSON_KIND,
        items: [],
      }).history,
    ).toEqual([]);
    expect(typeof engine.parseDisneyExtremeBaselineHistory).toBe('function');
  });
});
