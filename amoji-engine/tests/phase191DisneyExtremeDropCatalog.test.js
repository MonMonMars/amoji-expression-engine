import { describe, expect, it } from 'vitest';
import {
  DISNEY_EXTREME_HOTKEY_HELP,
} from '../engine/layers/emotionMorphs.js';

describe('Phase 191 Extreme drop JSON catalog note', () => {
  it('documents drop JSON · Meta preview in hotkey help', () => {
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain(
      'drop JSON · hist or snap · Meta preview · Shift merge hist/redo · dbl-click paste',
    );
  });
});
