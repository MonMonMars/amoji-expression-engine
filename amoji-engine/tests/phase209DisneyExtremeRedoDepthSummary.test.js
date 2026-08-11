import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { formatDisneyExtremeBaselineSummary } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 209 Extreme baseline redo depth + tooltip', () => {
  it('appends redo N and ⇧U redo trail', () => {
    expect(
      formatDisneyExtremeBaselineSummary({
        hasBaseline: true,
        dirty: false,
        fp: 'abcd1234',
        historyDepth: 1,
        redoDepth: 2,
      }),
    ).toBe(
      'baseline · clean · fp abcd1234 · hist 1 · redo 2 · D diff · ⇧D restore · K clear · U undo · ⇧U redo',
    );
    expect(formatDisneyExtremeBaselineSummary({ redoDepth: 0 })).not.toMatch(
      / · redo \d+/,
    );
    expect(formatDisneyExtremeBaselineSummary({})).toContain('⇧U redo');
    expect(typeof engine.formatDisneyExtremeBaselineSummary).toBe('function');
  });

  it('passes redoDepth into Face Live pill title', () => {
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain('redoDepth: extremeBaselineRedo.length');
  });
});
