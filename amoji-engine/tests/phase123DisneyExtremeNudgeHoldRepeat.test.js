import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  isDisneyExtremeNudgeAction,
  shouldRepeatDisneyExtremeNudge,
  DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS,
  DISNEY_EXTREME_NUDGE_REPEAT_INTERVAL_MS,
} from '../engine/ui/faceLivePrefs.js';
import { DISNEY_EXTREME_HOTKEY_HELP } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 123 Extreme nudge hold-to-repeat', () => {
  it('gates nudge repeats after initial delay', () => {
    expect(isDisneyExtremeNudgeAction('nudgeShapeUp')).toBe(true);
    expect(isDisneyExtremeNudgeAction('toggle')).toBe(false);
    expect(shouldRepeatDisneyExtremeNudge({ isRepeat: false })).toBe(true);
    expect(
      shouldRepeatDisneyExtremeNudge({
        isRepeat: true,
        startedMs: 0,
        lastFireMs: 0,
        nowMs: DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS - 1,
      }),
    ).toBe(false);
    expect(
      shouldRepeatDisneyExtremeNudge({
        isRepeat: true,
        startedMs: 0,
        lastFireMs: 0,
        nowMs: DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS,
      }),
    ).toBe(true);
    expect(
      shouldRepeatDisneyExtremeNudge({
        isRepeat: true,
        startedMs: 0,
        lastFireMs: DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS,
        nowMs:
          DISNEY_EXTREME_NUDGE_REPEAT_INITIAL_MS +
          DISNEY_EXTREME_NUDGE_REPEAT_INTERVAL_MS -
          1,
      }),
    ).toBe(false);
    expect(typeof engine.shouldRepeatDisneyExtremeNudge).toBe('function');
    expect(DISNEY_EXTREME_HOTKEY_HELP).toContain('hold nudges');
  });

  it('Face Live tracks nudge hold + keyup clear', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('isDisneyExtremeNudgeAction');
    expect(src).toContain('shouldRepeatDisneyExtremeNudge');
    expect(src).toContain('let disneyExtremeNudgeHold = null');
    expect(src).toContain("addEventListener('keyup'");
    expect(src).toContain('disneyExtremeNudgeHold = null');
  });
});
