import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  resolveDisneyExtremeHotkey,
  nudgeDisneyExtremeShapeFactor,
  DISNEY_EXTREME_SHAPE_FACTOR_STEP,
  DISNEY_EXTREME_SHAPE_FACTOR_MIN,
  DISNEY_EXTREME_SHAPE_FACTOR_MAX,
} from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 111 Disney Extreme shape factor nudge hotkeys', () => {
  it('resolves [ ] nudges and clamps shape factor', () => {
    expect(resolveDisneyExtremeHotkey({ key: '[' })).toEqual({
      ok: true,
      action: 'nudgeShapeDown',
      delta: -DISNEY_EXTREME_SHAPE_FACTOR_STEP,
    });
    expect(resolveDisneyExtremeHotkey({ key: ']' }).action).toBe(
      'nudgeShapeUp',
    );
    expect(resolveDisneyExtremeHotkey({ key: 'x' }).action).toBe('toggle');
    expect(
      resolveDisneyExtremeHotkey({ key: ']', target: { tagName: 'INPUT' } })
        .ok,
    ).toBe(false);

    expect(nudgeDisneyExtremeShapeFactor(1.6, 0.05)).toBeCloseTo(1.65);
    expect(nudgeDisneyExtremeShapeFactor(1.78, 0.05)).toBe(
      DISNEY_EXTREME_SHAPE_FACTOR_MAX,
    );
    expect(nudgeDisneyExtremeShapeFactor(1.02, -0.05)).toBe(
      DISNEY_EXTREME_SHAPE_FACTOR_MIN,
    );
    expect(typeof engine.nudgeDisneyExtremeShapeFactor).toBe('function');
  });

  it('Face Live wires nudge actions to the shape factor slider', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('nudgeDisneyExtremeShapeFactor');
    expect(src).toContain("resolved.action === 'nudgeShapeDown'");
    expect(src).toContain("resolved.action === 'nudgeShapeUp'");
    expect(src).toContain('<kbd>[</kbd><kbd>]</kbd>');
    expect(src).toContain('applyFactorNudge(disneyExtremeFactorEl');
    expect(src).toContain("el.dispatchEvent(new Event('input'))");
  });
});
