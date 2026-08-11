import { describe, expect, it } from 'vitest';
import { shouldAutoCaptureDisneyExtremeBaseline } from '../engine/layers/emotionMorphs.js';
import * as engine from '../engine/index.js';

describe('Phase 210 Extreme auto-capture baseline helper', () => {
  it('is true only when Extreme is on and no baseline', () => {
    expect(shouldAutoCaptureDisneyExtremeBaseline({})).toBe(false);
    expect(
      shouldAutoCaptureDisneyExtremeBaseline({ enabled: true }),
    ).toBe(true);
    expect(
      shouldAutoCaptureDisneyExtremeBaseline({
        enabled: true,
        hasBaseline: true,
      }),
    ).toBe(false);
    expect(
      shouldAutoCaptureDisneyExtremeBaseline({
        enabled: true,
        baseline: { enabled: true },
      }),
    ).toBe(false);
    expect(
      shouldAutoCaptureDisneyExtremeBaseline({
        enabled: false,
        baseline: null,
      }),
    ).toBe(false);
    expect(typeof engine.shouldAutoCaptureDisneyExtremeBaseline).toBe(
      'function',
    );
  });
});
