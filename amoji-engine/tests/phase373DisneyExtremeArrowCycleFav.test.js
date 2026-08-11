import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

describe('Phase 373 Extreme →← cycle fav', () => {
  it('resolves ArrowRight/Left to favorite cycle actions', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowRight' }).action).toBe(
      'cycleBaselineFavoriteNext',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'ArrowLeft' }).action).toBe(
      'cycleBaselineFavoritePrev',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'q' }).action).toBe(
      'cycleBaselineFavoriteNext',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('→← cycle fav');
  });
});
