import { describe, expect, it } from 'vitest';
import {
  applyContinuity,
  decayContinuityResidual,
  tuneContinuityResidualIntensity,
  DiscretionController,
  CONTINUITY_DECAY_HALF_LIFE_SEC,
} from '../../engine/layers/discretion.js';
import {
  exportAuditSavedViewsJson,
  summarizeAuditViewsImportPreview,
} from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 64 continuity residual decay and tune', () => {
  it('decays residual intensity over time and clears below threshold', () => {
    const cont = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.6 },
      personaId: 'companion',
    });
    expect(cont.residual?.intensity).toBeGreaterThan(0.02);

    const half = decayContinuityResidual(cont, CONTINUITY_DECAY_HALF_LIFE_SEC);
    expect(half.decayed).toBe(true);
    expect(half.cleared).toBe(false);
    expect(half.continuity?.residual?.intensity).toBeCloseTo(
      cont.residual.intensity * 0.5,
      5,
    );

    const cleared = decayContinuityResidual(half.continuity, CONTINUITY_DECAY_HALF_LIFE_SEC * 4);
    expect(cleared.cleared).toBe(true);
    expect(cleared.continuity?.residual).toBeNull();
  });

  it('tunes residual intensity for morph overlay with blend scale', () => {
    const cont = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.5 },
      personaId: 'companion',
    });
    const tuned = tuneContinuityResidualIntensity(cont, { morphScale: 0.85 });
    expect(tuned.ok).toBe(true);
    expect(tuned.emotion).toBe('sad');
    expect(tuned.intensity).toBeCloseTo(
      cont.residual.intensity * 0.85 * cont.blend,
      5,
    );
  });

  it('DiscretionController tick decays residual over time', () => {
    const d = new DiscretionController({ personaId: 'companion' });
    d.ingestLine({ emotion: 'sad', intensity: 0.7 });
    d.ingestLine({ emotion: 'happy', intensity: 0.6 });
    const before = d.lastContinuity?.residual?.intensity ?? 0;
    d.tick(CONTINUITY_DECAY_HALF_LIFE_SEC);
    const after = d.lastContinuity?.residual?.intensity ?? 0;
    expect(after).toBeLessThan(before);
  });
});

describe('Phase 64 import drag-drop preview summary', () => {
  it('summarizes view count and toast hash for drop label', () => {
    const payload = exportAuditSavedViewsJson(
      [
        { name: 'Toast QR', toastInHashOnly: true, action: 'qr' },
        { name: 'Plain', toastInHashOnly: false, action: 'share' },
      ],
      { toastInHashOnly: false },
    );
    const preview = summarizeAuditViewsImportPreview(payload.payload, {
      filename: 'views.json',
    });
    expect(preview.ok).toBe(true);
    expect(preview.count).toBe(2);
    expect(preview.toastHashCount).toBe(1);
    expect(preview.label).toContain('views.json');
    expect(preview.label).toContain('2 views');
    expect(preview.label).toContain('1 toast hash');
  });
});

describe('Phase 64 cancel on TTS endpoint Enter', () => {
  it('supports tts_endpoint_enter_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_enter_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_enter_pick');
  });
});
