import { describe, expect, it } from 'vitest';
import {
  BASIC_EMOTIONS,
  emotionFormulas,
  evaluateEmotion,
  neutralParams,
} from '../engine/layers/emotionFormulas.js';
import { clamp, resolveIntensity } from '../engine/layers/intensity.js';
import { applyComplianceGate } from '../engine/compliance/complianceGate.js';
import light24 from '../data/points/light-24.json';
import pro57 from '../data/points/pro-57.json';
import extended77 from '../data/points/extended-77.json';

describe('point catalogs', () => {
  it('has 24 / 57 / 77 expressive points', () => {
    expect(light24).toHaveLength(24);
    expect(pro57).toHaveLength(57);
    expect(extended77).toHaveLength(77);
  });
});

describe('emotion formulas', () => {
  it('returns neutral at t=0 for every basic emotion', () => {
    const neutral = neutralParams();
    for (const id of BASIC_EMOTIONS) {
      const out = emotionFormulas[id](0);
      expect(out.valence ?? 0).toBeCloseTo(neutral.valence ?? 0, 5);
      expect(out.arousal ?? 0).toBeCloseTo(neutral.arousal ?? 0, 5);
      expect(out['MO-L'] ?? {}).toEqual({});
      expect(out['EB-L1'] ?? {}).toEqual({});
    }
  });

  it('raises mouth corners for happy at t=1', () => {
    const happy = emotionFormulas.happy(1);
    expect(happy['MO-L']?.u ?? 0).toBeGreaterThan(0.4);
    expect(happy['EY-L-LOW']?.u ?? 0).toBeGreaterThan(0.4); // Duchenne marker
  });

  it('distinguishes fear vs surprised mouth stretch at t=1', () => {
    const fear = emotionFormulas.fear(1);
    const surprised = emotionFormulas.surprised(1);
    const fearLateral = (fear['MO-L']?.l ?? 0) + (fear['MO-R']?.r ?? 0);
    const surpriseOpen = Math.abs(surprised['MO-CTR']?.d ?? 0);
    expect(fearLateral).toBeGreaterThan(0.5);
    expect(surpriseOpen).toBeGreaterThan(0.6);
  });
});

describe('intensity', () => {
  it('clamps values', () => {
    expect(clamp(1.5, 1)).toBe(1);
    expect(clamp(-1, 1)).toBe(0);
  });

  it('marks overdrive only when unlocked', () => {
    const locked = resolveIntensity(1.5, { unlockOverdrive: false });
    expect(locked.t).toBe(1);
    expect(locked.overdrive).toBe(false);

    const open = resolveIntensity(1.5, { unlockOverdrive: true });
    expect(open.t).toBe(1.5);
    expect(open.overdrive).toBe(true);
  });
});

describe('compliance gate', () => {
  it('passes emotion output and stamps meta', () => {
    const raw = evaluateEmotion('happy', 0.6);
    const gated = applyComplianceGate(raw, { userText: 'hello' });
    expect(gated.params).toEqual(raw.params);
    expect(gated.meta?.compliance).toBe('passed');
  });
});
