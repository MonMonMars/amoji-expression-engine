import { describe, expect, it } from 'vitest';
import { formatDisneyExtremeBaselineSummary } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 182 Extreme baseline summary', () => {
  it('formats none / clean / dirty tooltips', () => {
    expect(formatDisneyExtremeBaselineSummary({})).toBe(
      'baseline · none · D diff · ⇧D restore · K clear · P pin · U undo · ⇧U redo',
    );
    expect(
      formatDisneyExtremeBaselineSummary({
        hasBaseline: true,
        dirty: false,
        fp: 'abcd1234',
      }),
    ).toBe(
      'baseline · clean · fp abcd1234 · D diff · ⇧D restore · K clear · P pin · U undo · ⇧U redo',
    );
    expect(
      formatDisneyExtremeBaselineSummary({
        hasBaseline: true,
        dirty: true,
        fp: 'deadbeef',
        historyDepth: 2,
      }),
    ).toContain(' · hist 2 · ');
    expect(
      formatDisneyExtremeBaselineSummary({ historyDepth: 3 }),
    ).toBe(
      'baseline · none · hist 3 · D diff · ⇧D restore · K clear · P pin · U undo · ⇧U redo',
    );
    expect(
      formatDisneyExtremeBaselineSummary({
        hasBaseline: true,
        dirty: true,
        fp: 'deadbeef',
      }),
    ).toContain('baseline · dirty · fp deadbeef');
    expect(typeof engine.formatDisneyExtremeBaselineSummary).toBe('function');
  });
});
