import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

describe('Phase 335 Extreme Alt+1–8 fav jump range', () => {
  it('resolves Alt+5–8 favorite jumps after capacity expand', () => {
    expect(
      resolveDisneyExtremeHotkey({ key: '5', altKey: true }),
    ).toEqual({
      ok: true,
      action: 'jumpBaselineFavorite',
      index: 4,
    });
    expect(
      resolveDisneyExtremeHotkey({ key: '8', altKey: true }),
    ).toEqual({
      ok: true,
      action: 'jumpBaselineFavorite',
      index: 7,
    });
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt+1–8 fav jump');
    expect(DISNEY_EXTREME_HOTKEY_HELP).not.toContain('Alt+1–4 fav jump');
  });
});
