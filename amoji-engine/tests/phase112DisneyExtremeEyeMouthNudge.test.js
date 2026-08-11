import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  resolveDisneyExtremeHotkey,
  nudgeDisneyExtremeFactor,
  nudgeDisneyExtremeEyeFactor,
  nudgeDisneyExtremeMouthFactor,
  DISNEY_EXTREME_FACTOR_STEP,
  DISNEY_EXTREME_EYE_FACTOR_MAX,
  DISNEY_EXTREME_MOUTH_FACTOR_MIN,
} from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 112 Disney Extreme eye/mouth nudge hotkeys', () => {
  it('resolves , . ; \' and clamps eye/mouth factors', () => {
    expect(resolveDisneyExtremeHotkey({ key: ',' })).toEqual({
      ok: true,
      action: 'nudgeEyeDown',
      delta: -DISNEY_EXTREME_FACTOR_STEP,
    });
    expect(resolveDisneyExtremeHotkey({ key: '.' }).action).toBe('nudgeEyeUp');
    expect(resolveDisneyExtremeHotkey({ key: ';' }).action).toBe(
      'nudgeMouthDown',
    );
    expect(resolveDisneyExtremeHotkey({ key: "'" }).action).toBe(
      'nudgeMouthUp',
    );

    expect(nudgeDisneyExtremeEyeFactor(1.4, 0.05)).toBeCloseTo(1.45);
    expect(nudgeDisneyExtremeEyeFactor(2.18, 0.05)).toBe(
      DISNEY_EXTREME_EYE_FACTOR_MAX,
    );
    expect(nudgeDisneyExtremeMouthFactor(1.02, -0.05)).toBe(
      DISNEY_EXTREME_MOUTH_FACTOR_MIN,
    );
    expect(
      nudgeDisneyExtremeFactor(1.5, 0.05, { min: 1, max: 2.2, fallback: 1.4 }),
    ).toBeCloseTo(1.55);
    expect(typeof engine.nudgeDisneyExtremeEyeFactor).toBe('function');
    expect(typeof engine.nudgeDisneyExtremeMouthFactor).toBe('function');
  });

  it('Face Live wires eye/mouth nudge actions', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('nudgeDisneyExtremeEyeFactor');
    expect(src).toContain('nudgeDisneyExtremeMouthFactor');
    expect(src).toContain("resolved.action === 'nudgeEyeDown'");
    expect(src).toContain("resolved.action === 'nudgeMouthUp'");
    expect(src).toContain('<kbd>,</kbd><kbd>.</kbd>');
    expect(src).toContain("<kbd>;</kbd><kbd>'</kbd>");
  });
});
