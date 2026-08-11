import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT,
  buildDisneyExtremeLiveSnapshot,
  pushDisneyExtremeBaselineFavorite,
} from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 334 Extreme favorites capacity 8', () => {
  it('raises favorites limit to 8 and retains the newest eight', () => {
    expect(DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT).toBe(8);
    expect(engine.DISNEY_EXTREME_BASELINE_FAVORITES_LIMIT).toBe(8);
    let favs = [];
    for (let i = 0; i < 10; i += 1) {
      favs = pushDisneyExtremeBaselineFavorite(
        favs,
        buildDisneyExtremeLiveSnapshot({
          enabled: true,
          intensity: 0.4 + i * 0.05,
          shapeFactor: 1.1 + i * 0.05,
        }),
      );
    }
    expect(favs).toHaveLength(8);
  });
});
