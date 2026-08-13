import { describe, expect, it } from 'vitest';
import {
  applyContinuity,
  continuityResidualDecayProgress,
} from '../../engine/layers/discretion.js';
import { shouldAutoImportAuditViewsOnDrop } from '../../engine/ui/auditSavedViews.js';
import { cancelCompoundEmblemLifecycle } from '../../engine/export/compoundEmblemCrossfade.js';

describe('Phase 65 continuity residual decay progress', () => {
  it('returns full progress at peak and zero when cleared', () => {
    const cont = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.5 },
      personaId: 'companion',
    });
    const peak = cont.residual?.intensity ?? 0;
    const full = continuityResidualDecayProgress(cont, { peakIntensity: peak });
    expect(full.ok).toBe(true);
    expect(full.progress).toBeCloseTo(1, 5);

    const empty = continuityResidualDecayProgress({ residual: null });
    expect(empty.ok).toBe(false);
    expect(empty.progress).toBe(0);
  });

  it('scales progress down as residual intensity decays', () => {
    const cont = applyContinuity({
      emotion: 'happy',
      intensity: 0.8,
      previous: { emotion: 'sad', intensity: 0.5 },
      personaId: 'companion',
    });
    const peak = cont.residual?.intensity ?? 0;
    const half = continuityResidualDecayProgress(
      {
        ...cont,
        residual: { ...cont.residual, intensity: peak * 0.5 },
      },
      { peakIntensity: peak },
    );
    expect(half.progress).toBeGreaterThan(0.3);
    expect(half.progress).toBeLessThan(0.7);
  });
});

describe('Phase 65 shift-drop auto-import', () => {
  it('auto-imports when shiftKey is held on drop', () => {
    expect(shouldAutoImportAuditViewsOnDrop({ shiftKey: true }).autoImport).toBe(true);
    expect(shouldAutoImportAuditViewsOnDrop({ shiftKey: true }).merge).toBe(true);
    expect(shouldAutoImportAuditViewsOnDrop({ shiftKey: false }).autoImport).toBe(false);
  });
});

describe('Phase 65 cancel on TTS endpoint Escape', () => {
  it('supports tts_endpoint_escape_pick cancel reason', () => {
    const out = cancelCompoundEmblemLifecycle(
      { compoundId: 'fear_surprised', emblemId: 'selfHug' },
      { reason: 'tts_endpoint_escape_pick' },
    );
    expect(out.cancelled).toBe(true);
    expect(out.reason).toBe('tts_endpoint_escape_pick');
  });
});
