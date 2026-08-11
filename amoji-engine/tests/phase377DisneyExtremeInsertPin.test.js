import { describe, expect, it } from 'vitest';
import { resolveDisneyExtremeHotkey } from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';

describe('Phase 377 Extreme Insert pin base', () => {
  it('resolves Insert to pinBaseline', () => {
    expect(resolveDisneyExtremeHotkey({ key: 'Insert' }).action).toBe(
      'pinBaseline',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'p' }).action).toBe(
      'pinBaseline',
    );
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Insert pin base');
  });
});
