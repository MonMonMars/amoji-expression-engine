import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  resolveDisneyExtremeHotkey,
  nudgeDisneyExtremeBodyFactor,
  DISNEY_EXTREME_FACTOR_STEP,
  DISNEY_EXTREME_BODY_FACTOR_MAX,
  DISNEY_EXTREME_BODY_FACTOR_MIN,
} from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 113 Disney Extreme body × nudge hotkeys', () => {
  it('resolves -/= nudges and clamps body factor', () => {
    expect(resolveDisneyExtremeHotkey({ key: '-' })).toEqual({
      ok: true,
      action: 'nudgeBodyDown',
      delta: -DISNEY_EXTREME_FACTOR_STEP,
    });
    expect(resolveDisneyExtremeHotkey({ key: '=' }).action).toBe(
      'nudgeBodyUp',
    );
    expect(resolveDisneyExtremeHotkey({ key: '+' }).action).toBe(
      'nudgeBodyUp',
    );
    expect(nudgeDisneyExtremeBodyFactor(1.6, 0.05)).toBeCloseTo(1.65);
    expect(nudgeDisneyExtremeBodyFactor(1.78, 0.05)).toBe(
      DISNEY_EXTREME_BODY_FACTOR_MAX,
    );
    expect(nudgeDisneyExtremeBodyFactor(1.02, -0.05)).toBe(
      DISNEY_EXTREME_BODY_FACTOR_MIN,
    );
    expect(typeof engine.nudgeDisneyExtremeBodyFactor).toBe('function');
  });

  it('Face Live wires body nudge and enables body apply when needed', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('nudgeDisneyExtremeBodyFactor');
    expect(src).toContain("resolved.action === 'nudgeBodyDown'");
    expect(src).toContain("resolved.action === 'nudgeBodyUp'");
    expect(src).toContain('disneyExtremeBodyEl.checked = true');
    expect(src).toContain('<kbd>-</kbd><kbd>=</kbd>');
  });
});
