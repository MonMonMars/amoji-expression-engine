import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { formatDisneyExtremeBaselineSummary } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('Phase 259 Extreme fav depth on baseline summary', () => {
  it('appends fav N and passes favoritesDepth to Face Live pill', () => {
    expect(
      formatDisneyExtremeBaselineSummary({
        hasBaseline: true,
        dirty: false,
        fp: 'abcd1234',
        historyDepth: 1,
        redoDepth: 2,
        favoritesDepth: 3,
      }),
    ).toBe(
      'baseline · clean · fp abcd1234 · hist 1 · redo 2 · fav 3 · D diff · ⇧D restore · K clear · P pin · U undo · ⇧U redo',
    );
    expect(
      formatDisneyExtremeBaselineSummary({ favoritesDepth: 0 }),
    ).not.toMatch(/ · fav \d+/);
    expect(
      formatDisneyExtremeBaselineSummary({ favoritesDepth: 2 }),
    ).toContain(' · fav 2 · ');
    const src = readFileSync(join(root, 'prototypes/face-live.html'), 'utf8');
    expect(src).toContain(
      'favoritesDepth: extremeBaselineFavorites.length',
    );
    expect(typeof engine.formatDisneyExtremeBaselineSummary).toBe('function');
  });
});
