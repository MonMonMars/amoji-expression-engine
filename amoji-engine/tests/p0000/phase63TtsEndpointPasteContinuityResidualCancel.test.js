import { describe, expect, it } from 'vitest';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';
import { mergeMorphOverlays } from '../../engine/layers/emotionMorphs.js';

describe('Phase 63 cancel on TTS endpoint paste', () => {
  it('supports tts_endpoint_paste_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_paste_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_paste_pick');
  });
});

describe('Phase 63 continuity residual morph overlay (unit)', () => {
  it('mergeMorphOverlays uses max per morph key', () => {
    const base = { EMO_sad_medium: 0.2, EMO_happy_medium: 0.1 };
    const overlay = { EMO_sad_medium: 0.35 };
    const merged = mergeMorphOverlays({ ...base }, overlay);
    expect(merged.EMO_sad_medium).toBe(0.35);
    expect(merged.EMO_happy_medium).toBe(0.1);
  });
});

describe('Phase 63 continuity residual tick cancel reason', () => {
  it('supports continuity_residual_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'continuity_residual_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('continuity_residual_pick');
  });
});

