import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  formatDisneyExtremeNudgeFlash,
  DISNEY_EXTREME_FACTOR_STEP,
  DISNEY_EXTREME_FACTOR_COARSE_MULT,
  DISNEY_EXTREME_FACTOR_COARSER_MULT,
} from '../engine/ui/faceLivePrefs.js';
import * as engine from '../engine/index.js';

const faceLivePath = fileURLToPath(
  new URL('../prototypes/face-live.html', import.meta.url),
);

describe('Phase 129 Extreme nudge flash shows coarse Δ', () => {
  it('appends Δ only when step is coarser than fine', () => {
    expect(formatDisneyExtremeNudgeFlash('nudgeShapeUp', 1.65)).toBe(
      'shape × 1.65',
    );
    expect(
      formatDisneyExtremeNudgeFlash('nudgeShapeUp', 1.7, {
        delta: DISNEY_EXTREME_FACTOR_STEP,
      }),
    ).toBe('shape × 1.70');
    expect(
      formatDisneyExtremeNudgeFlash('nudgeEyeUp', 1.5, {
        delta: DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSE_MULT,
      }),
    ).toBe('eye × 1.50 · Δ0.10');
    expect(
      formatDisneyExtremeNudgeFlash('nudgeMouthDown', 1.4, {
        delta:
          -DISNEY_EXTREME_FACTOR_STEP * DISNEY_EXTREME_FACTOR_COARSER_MULT,
      }),
    ).toBe('mouth × 1.40 · Δ0.20');
    expect(typeof engine.formatDisneyExtremeNudgeFlash).toBe('function');
  });

  it('Face Live passes resolved.delta into nudge flash', () => {
    const src = fs.readFileSync(faceLivePath, 'utf8');
    expect(src).toContain('delta: resolved.delta');
  });
});
