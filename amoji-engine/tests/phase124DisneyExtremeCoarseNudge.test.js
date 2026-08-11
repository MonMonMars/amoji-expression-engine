import { describe, expect, it } from 'vitest';
import {
  resolveDisneyExtremeHotkey,
  disneyExtremeNudgeStep,
  DISNEY_EXTREME_FACTOR_STEP,
  DISNEY_EXTREME_FACTOR_COARSE_MULT,
} from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 124 Extreme Shift coarse nudge steps', () => {
  it('doubles nudge delta when Shift is held', () => {
    expect(disneyExtremeNudgeStep(false)).toBe(DISNEY_EXTREME_FACTOR_STEP);
    expect(disneyExtremeNudgeStep(true)).toBe(
      DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSE_MULT,
    );
    expect(resolveDisneyExtremeHotkey({ key: ']' }).delta).toBe(
      DISNEY_EXTREME_FACTOR_STEP,
    );
    expect(
      resolveDisneyExtremeHotkey({ key: ']', shiftKey: true }).delta,
    ).toBe(DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSE_MULT);
    expect(
      resolveDisneyExtremeHotkey({ key: '{', shiftKey: true }).action,
    ).toBe('nudgeShapeDown');
    expect(
      resolveDisneyExtremeHotkey({ key: '<', shiftKey: true }).action,
    ).toBe('nudgeEyeDown');
    expect(
      resolveDisneyExtremeHotkey({ key: '>', shiftKey: true }).delta,
    ).toBe(0.1);
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Shift coarse');
    expect(typeof engine.disneyExtremeNudgeStep).toBe('function');
  });
});
