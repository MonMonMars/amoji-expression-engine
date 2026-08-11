import { describe, expect, it } from 'vitest';
import { cancelCompoundEmblemLifecycle } from '../engine/export/compoundEmblemCrossfade.js';

describe('Phase 78 cancel on TTS endpoint drag-leave', () => {
  it('supports tts_endpoint_drag_leave_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_drag_leave_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_drag_leave_pick');
  });
});

