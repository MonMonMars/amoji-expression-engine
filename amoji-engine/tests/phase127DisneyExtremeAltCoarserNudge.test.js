import { describe, expect, it } from 'vitest';
import {
  resolveDisneyExtremeHotkey,
  disneyExtremeNudgeStep,
  DISNEY_EXTREME_FACTOR_STEP,
  DISNEY_EXTREME_FACTOR_COARSE_MULT,
  DISNEY_EXTREME_FACTOR_COARSER_MULT,
} from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 127 Extreme Alt coarser nudge steps', () => {
  it('quadruples nudge delta when Alt is held (wins over Shift)', () => {
    expect(disneyExtremeNudgeStep(false)).toBe(DISNEY_EXTREME_FACTOR_STEP);
    expect(disneyExtremeNudgeStep({ altKey: true })).toBe(
      DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSER_MULT,
    );
    expect(disneyExtremeNudgeStep({ shiftKey: true, altKey: true })).toBe(
      DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSER_MULT,
    );
    expect(disneyExtremeNudgeStep(true, true)).toBe(0.2);
    expect(
      resolveDisneyExtremeHotkey({ key: ']', altKey: true }).delta,
    ).toBe(DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSER_MULT);
    expect(
      resolveDisneyExtremeHotkey({
        key: ']',
        shiftKey: true,
        altKey: true,
      }).delta,
    ).toBe(0.2);
    expect(
      resolveDisneyExtremeHotkey({ key: '5', altKey: true }).ok,
    ).toBe(false);
    expect(
      resolveDisneyExtremeHotkey({ key: '5', altKey: true }).reason,
    ).toBe('modifier');
    expect(
      resolveDisneyExtremeHotkey({ key: 'a', altKey: true }).action,
    ).toBe('showBaselinePinBundle');
    expect(
      resolveDisneyExtremeHotkey({ key: 'x', altKey: true }).action,
    ).toBe('focusExtremePanel');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('Alt coarser');
    expect(engine.DISNEY_EXTREME_FACTOR_COARSER_MULT).toBe(
      DISNEY_EXTREME_FACTOR_COARSE_MULT * 2,
    );
  });
});
