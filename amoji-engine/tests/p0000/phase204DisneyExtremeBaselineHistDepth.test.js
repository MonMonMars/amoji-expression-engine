import { describe, expect, it } from 'vitest';
import { formatDisneyExtremeBaselineSummary } from '../../engine/layers/emotionMorphs.js';
import * as engine from '../../engine/index.js';

describe('Phase 204 Extreme baseline summary history depth', () => {
  it('appends hist N when historyDepth > 0', () => {
    expect(
      formatDisneyExtremeBaselineSummary({
        hasBaseline: true,
        dirty: false,
        fp: 'abcd1234',
        historyDepth: 1,
      }),
    ).toBe(
      'baseline · clean · fp abcd1234 · hist 1 · D diff · ⇧D restore · K clear · P pin · U undo · ⇧U redo',
    );
    expect(formatDisneyExtremeBaselineSummary({ historyDepth: 0 })).not.toContain(
      'hist',
    );
    expect(typeof engine.formatDisneyExtremeBaselineSummary).toBe('function');
  });
});
